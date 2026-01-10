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
import { MoreHorizontal, Eye, PlusCircle, Check, X } from "lucide-react";
import Link from "next/link";
import { IPayment } from "@/types/interfaces";
import { PaymentStatus } from "@/types/enum";
import { Loader } from "@/components/Loader";
import { IStats, StarsCard } from "@/components/StatsCard";
import constants from "@/constants";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { paymentsMock } from "@/mocks/payments";
import { Checkbox } from "@/components/ui/checkbox";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [payments, setOayments] = useState<IPayment[]>(paymentsMock);
  const [filteredPayments, setFilteredPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), constants.TIMEOUT.LOADER);
  }, []);

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

  // Calculando stats
  const stats: IStats[] = [
    {
      isCoin: true,
      label: "Total de pagamentos",
      oldValue: 0,
      title: "Pagamentos",
      value: payments.length,
    },
    {
      isCoin: true,
      label: "Pagamentos pagos",
      oldValue: 0,
      title: "Pagos",
      value: payments.filter((p) => p.status === PaymentStatus.PAID).length,
    },
    {
      isCoin: true,
      label: "Pagamentos pendentes",
      oldValue: 0,
      title: "Pendentes",
      value: payments.filter((p) => p.status === PaymentStatus.PENDING).length,
    },
    {
      isCoin: true,
      label: "Pagamentos consolidados",
      oldValue: 0,
      title: "Consolidados",
      value: payments.filter((p) => p.conclidation).length,
    },
  ];

  if (loading) return <Loader />;

  return (
    <section className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* TABLE */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
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
                    <Checkbox />
                  </TableCell>
                  {/* CLIENTE */}
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
                        {payment.booking.service.description?.slice(0, 40)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Valor: {payment.amount.toLocaleString()}{" "}
                        {payment.currency}
                      </p>
                    </div>
                  </TableCell>

                  {/* PROFISSIONAL */}
                  <TableCell>
                    {payment.professional && (
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

                  {/* VALOR */}
                  <TableCell>
                    {payment.amount.toLocaleString()} {payment.currency}
                  </TableCell>

                  {/* AÇÕES */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button>Acções</Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`payments/${payment.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </Link>
                        </DropdownMenuItem>

                        {canCreateConsolidation && (
                          <DropdownMenuItem asChild>
                            <Link href={`payments/consolidation/${payment.id}`}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Criar
                              consolidação
                            </Link>
                          </DropdownMenuItem>
                        )}

                        {/* Aprovar/Reprovar exemplo */}
                        {payment.status === PaymentStatus.PENDING && (
                          <>
                            <DropdownMenuItem>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2"
                              >
                                <Check /> Aprovar
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2"
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
