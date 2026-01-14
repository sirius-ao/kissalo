"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Wallet,
  Search,
  Loader2,
  CheckCheck,
  Download,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPayment } from "@/types/interfaces";
import { PaymentAvatar, PaymentStatusBadge } from "@/components/Payments";
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
import { PaymentService } from "@/services/Payments/index.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/enum";
export default function Payments() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;
        const paymentngApi = new PaymentService(token);
        const dataPayments = await paymentngApi.get();
        if (dataPayments?.logout) {
          return;
        }
        setPayments(dataPayments?.data?.data);
        console.log(dataPayments);
      } catch {
        toast.error("Erro ao carregar agendamentos");
      } finally {
        setTimeout(() => setIsLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    loadData();
  }, [router]);

  return (
    <section className="flex flex-col gap-4">
      {isLoading ? (
        <Loader />
      ) : (
        <article className="flex flex-col gap-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consolidação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Comprovante</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {verifyArrayDisponiblity(payments) &&
                payments.map((payment) => (
                  <TableRow key={payment.id}>
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
                      <Badge>
                        {payment?.conclidation ? "Consolidado" : "Pendente"}
                      </Badge>
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

                    <TableCell>
                      <Button>Detalhes</Button>
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
