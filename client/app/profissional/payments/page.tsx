"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet, Search, Loader2, CheckCheck } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPayment } from "@/types/interfaces";
import {
  PaymentAvatar,
  PaymentStats,
  PaymentStatusBadge,
} from "@/components/Payments";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import constants from "@/constants";
import { Loader } from "@/components/Loader";
import { paymentsMock } from "@/mocks/payments";
import { IStats, StarsCard } from "@/components/StatsCard";
import { verifyArrayDisponiblity } from "@/lib/utils";
export default function Payments() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setpayments] = useState<IPayment[]>(paymentsMock);
  const stats: IStats[] = [
    {
      isCoin: false,
      label: "Total lucrado",
      oldValue: 1000,
      title: "Total",
      value: 100,
    },
    {
      isCoin: true,
      label: "Total recebido na plaforma ",
      oldValue: 100,
      title: "Total facturamento",
      value: 560,
    },
    {
      isCoin: false,
      label: "Pagamentos pendentes",
      oldValue: 5,
      title: "Pendências",
      value: 3,
    },
  ];
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-end gap-1">
          <span className="bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white h-10 w-10 flex justify-center items-center font-bold shadow rounded-sm">
            <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
              P
            </h1>
          </span>

          <h1 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">
            agamentos
          </h1>
        </div>
        <div>
          <Button asChild>
            <Link href={`/profissional/payments/wallets`} prefetch>
              <Wallet />
              Carteiras <span>1</span>
            </Link>
          </Button>
        </div>
      </header>

      {isLoading ? (
        <Loader />
      ) : (
        <article className="flex flex-col gap-5">
          <span className="lg:grid-cols-3 grid md:grid-cols-2 gap-4">
            {verifyArrayDisponiblity(stats) &&
              stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
          </span>{" "}
          <form className="grid md:grid-cols-3 ">
            <div></div>
            <div></div>
            <span className="flex items-center gap-2">
              <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <Search size={100} />
                </InputGroupAddon>
              </InputGroup>

              <Select>
                <SelectTrigger className="bg-black text-white ">
                  <SelectValue
                    placeholder="Filtrar"
                    className="text-white placeholder:text-white "
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">
                    <Loader2 size={100} className="animate-spin" />
                    Pendentes
                  </SelectItem>
                  <SelectItem value="completed">
                    <CheckCheck size={100} />
                    Concluídos
                  </SelectItem>
                  <SelectItem value="canceled">
                    <AlertCircle size={100} />
                    Cancelados
                  </SelectItem>
                </SelectContent>
              </Select>
            </span>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>#{p.id}</TableCell>
                  <TableCell>
                    <PaymentAvatar user={p.client} />
                  </TableCell>
                  <TableCell>
                    {p.professional ? (
                      <PaymentAvatar user={p.professional.user} />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {p.amount.toLocaleString()} {p.currency}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/profissional/payments/${p.id}`}>
                      <Button size="sm" variant="outline">
                        Detalhes
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </article>
      )}
    </section>
  );
}
