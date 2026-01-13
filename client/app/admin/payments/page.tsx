"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  PlusCircle,
  Check,
  X,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { IPayment } from "@/types/interfaces";
import { PaymentStatus } from "@/types/enum";
import { Loader } from "@/components/Loader";
import { IStats, StarsCard } from "@/components/StatsCard";
import constants from "@/constants";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { PaymentService } from "@/services/Payments/index.service";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filteredPayments, setFilteredPayments] = useState<IPayment[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<IStats[]>([]);
  const [status, setStaus] = useState<"PAID" | "REFUNDED">("PAID");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [notes, setNotes] = useState("");
  const [reload, setReload] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;
        const paymentngApi = new PaymentService(token);
        const [dataPayments] = await Promise.all([paymentngApi.get()]);
        if (dataPayments?.logout) {
          return;
        }
        console.log(dataPayments?.data);
        setPayments(dataPayments?.data?.data);
        if (dataPayments?.data?.stats) {
          setStats([
            {
              isCoin: false,
              label: "pagamentos",
              oldValue: dataPayments?.data?.stats?.total,
              title: "Total Pagamentos",
              value: dataPayments?.data?.stats?.total,
            },
            {
              isCoin: false,
              label: "Pendências",
              oldValue: dataPayments?.data?.stats?.pending,
              title: "Pendências",
              value: dataPayments?.data?.stats?.pending,
            },
          ]);
        }
      } catch {
        toast.error("Erro ao carregar agendamentos");
      } finally {
        setTimeout(() => setIsLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    loadData();
  }, [router, reload]);

  useEffect(() => {
    setFilteredPayments(
      payments.filter(
        (p) =>
          p.client.firstName.toLowerCase().includes(search.toLowerCase()) ||
          p.client.lastName.toLowerCase().includes(search.toLowerCase()) ||
          p.professional?.user.firstName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          p.professional?.user.lastName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          p.booking.service.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [payments, search]);

  if (isLoading) return <Loader />;

  return (
    <section className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {verifyArrayDisponiblity(stats) &&
          stats.map((stat, idx) => <StarsCard key={idx} data={stat} />)}
      </div>

      {/* SEARCH */}
      <div className="flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por cliente, profissional ou serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-full max-w-md"
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogTitle>
            {status == "PAID" ? "Aprovação" : "Reprovação"} do pagamento
          </DialogTitle>
          <DialogDescription>
            Informe o motivo pelo qual estas a executar esta acção
          </DialogDescription>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!id || id == 0) {
                toast.info("Seleciona o pagamento");
                return;
              }
              setProcessing(true);
              const token = localStorage.getItem("acess-x-token") as string;
              const paymentngApi = new PaymentService(token);
              const [dataPayments] = await Promise.all([
                paymentngApi.update(
                  id,
                  status,
                  !notes && status == "PAID" ? "Pagamento confirmado" : notes
                ),
              ]);
              if (dataPayments?.logout) {
                return;
              }
              console.log(dataPayments?.data);
              if (dataPayments?.data?.id) {
                toast.info("Pagamento actualizado");
              } else {
                toast.info(
                  dataPayments?.data?.message ?? "Pagamento actualizado"
                );
              }
              setProcessing(false);
              setReload((prev) => !prev);
            }}
            className="flex flex-col gap-3"
          >
            <Label>Título</Label>
            <Input
              required={status == "PAID" ? false : true}
              placeholder="nota informativa"
              onChange={(e) => {
                setNotes(e.target.value);
              }}
            />{" "}
            <div
              className={clsx(
                "flex flex-col justify-center items-center text-center border rounded-sm p-2 text-sm ",
                {
                  "bg-green-500/5 border-green-500 text-green-500":
                    status == "PAID",
                  "bg-red-500/5 border-red-500 text-red-500":
                    status == "REFUNDED",
                }
              )}
            >
              {status == "PAID" ? "Aprovação" : "Reprovação"}
            </div>
            <Button disabled={processing} onClick={() => {}}>
              {processing ? <Loader2 className="animate-spin" /> : "Actualizar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* TABLE */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Consolidação</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Comprovante</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPayments.map((payment) => {
              const canCreateConsolidation =
                payment.status === PaymentStatus.PAID &&
                payment.booking.status === "COMPLETED" &&
                !payment.conclidation;

              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={payment.client.avatarUrl} />
                        <AvatarFallback>
                          {payment.client.firstName[0]}
                          {payment.client.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <p className="font-medium">
                          {payment.client.firstName} {payment.client.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.client.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* SERVIÇO */}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {payment.booking.service.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {payment.booking.service.description?.slice(0, 50)}...
                      </p>
                    </div>
                  </TableCell>

                  {/* PROFISSIONAL */}
                  <TableCell>
                    {payment.professional ? (
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={payment.professional.user.avatarUrl}
                          />
                          <AvatarFallback>
                            {payment.professional.user.firstName[0]}
                            {payment.professional.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                          <p className="font-medium">
                            {payment.professional.user.firstName}{" "}
                            {payment.professional.user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.professional.user.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-500 text-xs">
                        Sem profissional anexado
                      </p>
                    )}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === PaymentStatus.PAID
                          ? "default"
                          : payment.status === PaymentStatus.PENDING
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {payment?.conclidation ? (
                      <Badge>Consolidado</Badge>
                    ) : (
                      <Button
                        disabled={
                          payment.conclidation?.id
                            ? true
                            : false ||
                              payment.status == PaymentStatus.REFUNDED ||
                              processing
                        }
                        onClick={async () => {
                          setProcessing(true);
                          const token = localStorage.getItem(
                            "acess-x-token"
                          ) as string;
                          const paymentngApi = new PaymentService(token);
                          const [dataPayments] = await Promise.all([
                            paymentngApi.consolidate(payment.id),
                          ]);
                          if (dataPayments?.logout) {
                            return;
                          }
                          console.log(dataPayments?.data);
                          toast.success(
                            dataPayments?.data?.message ?? "Erro ao consolidar"
                          );
                          setProcessing(false);
                          setTimeout(() => {
                            location.reload();
                          }, 10000);
                        }}
                      >
                        {processing ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Consolidar"
                        )}
                      </Button>
                    )}
                  </TableCell>
                  {/* VALOR */}
                  <TableCell>
                    {payment.amount.toLocaleString()} {payment.currency}
                  </TableCell>
                  <TableCell>
                    <Button variant={"secondary"} asChild>
                      <Link
                        href={payment?.fileUrl as string}
                        download={payment?.fileUrl}
                        target="_blank"
                      >
                        <Download />
                        Baixar
                      </Link>
                    </Button>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          disabled={payment?.status != PaymentStatus.PENDING}
                        >
                          Acções
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        {canCreateConsolidation && (
                          <DropdownMenuItem asChild>
                            <Link href={`payments/consolidation/${payment.id}`}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Criar
                              consolidação
                            </Link>
                          </DropdownMenuItem>
                        )}

                        {payment.status === PaymentStatus.PENDING && (
                          <>
                            <DropdownMenuItem>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2"
                                onClick={() => {
                                  setId(payment.id);
                                  setStaus("PAID");
                                  setOpen(true);
                                }}
                              >
                                <Check /> Aprovar
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2"
                                onClick={() => {
                                  setId(payment.id);
                                  setStaus("REFUNDED");
                                  setOpen(true);
                                }}
                              >
                                <X /> Reprovar
                              </Button>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}

            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum pagamento encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
