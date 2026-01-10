"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Eye, Check, X, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { IPayment } from "@/types/interfaces";
import { PaymentStatus } from "@/types/enum";
import { paymentsMock } from "@/mocks/payments"; // seus mocks
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WalletCard } from "@/components/Wallets";
import { Separator } from "@/components/ui/separator";

export default function PaymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<IPayment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando fetch
    setTimeout(() => {
      const found = paymentsMock.find((p) => p.id.toString() === id);
      setPayment(found || null);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) return <Loader />;
  if (!payment)
    return (
      <p className="text-center py-10 text-red-500">Pagamento não encontrado</p>
    );

  const canConsolidate =
    payment.status === PaymentStatus.PAID &&
    payment.booking.status === "COMPLETED" &&
    !payment.conclidation;

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Detalhes do Pagamento</h1>
        <div className="flex gap-2">
          {canConsolidate && (
            <Link href={`/payments/create?id=${payment.id}`}>
              <Button variant="default">Criar Consolidação</Button>
            </Link>
          )}
          <Button asChild variant="outline">
            <Link href="/payments">Voltar</Link>
          </Button>
        </div>
      </div>
      {/* INFORMACOES DO CLIENTE */}
      <div className="flex flex-col sm:flex-row gap-6 border rounded-lg p-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={payment.client.avatarUrl} />
          <AvatarFallback>
            {payment.client.firstName[0]}
            {payment.client.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-bold text-lg">
            {payment.client.firstName} {payment.client.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {payment.client.email}
          </p>
          <p className="text-sm text-muted-foreground">
            Pagamento feito em: {new Date(payment.createdAt).toLocaleString()}
          </p>
          <Badge variant={"outline"}>Cliente</Badge>
        </div>
        <Badge
          variant={
            payment.status === PaymentStatus.PAID
              ? "default"
              : payment.status === PaymentStatus.PENDING
              ? "outline"
              : "destructive"
          }
          className="self-start"
        >
          {payment.status}
        </Badge>
      </div>
      {/* SERVICO CONTRATADO */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Serviço Contratado</h3>
        <p className="font-medium">{payment.booking.service.title}</p>
        <p className="text-sm text-muted-foreground mb-2">
          {payment.booking.service.description}
        </p>
        <p className="text-sm text-muted-foreground">
          Valor: {payment.amount.toLocaleString()} {payment.currency}
        </p>
        <p className="text-sm text-muted-foreground">
          Data do agendamento:{" "}
          {new Date(payment.booking.scheduleDate).toLocaleString()}
        </p>
      </div>
      {/* PROFISSIONAL */}
      {payment.professional && (
        <div className="flex items-center gap-4 border rounded-lg p-4">
          <Avatar>
            <AvatarImage src={payment.professional.user.avatarUrl} />
            <AvatarFallback>
              {payment.professional.user.firstName[0]}
              {payment.professional.user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {payment.professional.user.firstName}{" "}
              {payment.professional.user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {payment.professional.user.email}
            </p>
            <Badge variant={"outline"}>Profissional</Badge>
          </div>
        </div>
      )}
      {/* CONSOLIDACAO */}
      {payment.conclidation ? (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Consolidação</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carteira</TableHead>
                <TableHead>Recebedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {payment.conclidation?.wallet?.accountHolder} (
                  {payment.conclidation?.wallet?.bankName})
                </TableCell>
                <TableCell>
                  {payment.conclidation?.profissional?.firstName}{" "}
                  {payment.conclidation?.profissional?.lastName}
                </TableCell>
                <TableCell>
                  {payment?.amount.toLocaleString()} {payment.currency}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status == PaymentStatus.PAID
                        ? "default"
                        : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Separator className="my-5" />
          <WalletCard wallet={payment.conclidation.wallet} />
        </div>
      ) : (
        canConsolidate && (
          <div className="border rounded-lg p-4 text-center text-muted-foreground">
            Nenhuma consolidação criada para este pagamento.
          </div>
        )
      )}
      {/* AÇÕES */}
      {payment.status === PaymentStatus.PENDING && (
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            Aprovar
          </Button>
          <Button variant="destructive" size="sm">
            Reprovar
          </Button>
        </div>
      )}{" "}
      <Button variant="outline" onClick={() => router.push("/admin/payments")}>
        Voltar
      </Button>
    </section>
  );
}
