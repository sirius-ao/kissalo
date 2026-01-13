import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  File,
  Download,
} from "lucide-react";
import { IPayment } from "@/types/interfaces";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
export function PaymentStats({ payments }: { payments: IPayment[] }) {
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const paid = payments.filter((p) => p.status === "PAID").length;
  const pending = payments.filter((p) => p.status === "PENDING").length;
  const failed = payments.filter((p) => p.status === "REFUNDED").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Stat
        title="Total Processado"
        value={`${total.toLocaleString()} AOA`}
        icon={<DollarSign />}
      />
      <Stat title="Pagos" value={paid} icon={<CheckCircle />} />
      <Stat title="Pendentes" value={pending} icon={<Clock />} />
      <Stat title="Falhados" value={failed} icon={<XCircle />} />
    </div>
  );
}

function Stat({ title, value, icon }: any) {
  return (
    <Card className="bg-linear-to-br from-background to-muted/50">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="text-2xl font-bold">{value}</CardContent>
    </Card>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/types/interfaces";

export function PaymentAvatar({
  user,
  notColl = true,
}: {
  user: IUser;
  notColl?: boolean;
}) {
  return (
    <div className={clsx(`flex ${notColl && "flex-col"}  gap-2`)}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user?.avatarUrl} />
        <AvatarFallback className="text-sm font-bold">
          {user?.firstName[0]}
          {user?.lastName[0]}
        </AvatarFallback>
      </Avatar>
      {notColl ? (
        <small>
          {user?.firstName} {user?.lastName}
        </small>
      ) : (
        <span className="flex flex-col gap-1">
          <small>
            {user?.firstName} {user?.lastName}
          </small>
          <small>{user?.email}</small>
        </span>
      )}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Button } from "../ui/button";
import { PaymentStatus } from "@/types/enum";
import Link from "next/link";
export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-green-500",
    PENDING: "bg-yellow-500",
    FAILED: "bg-red-500",
  };

  return <Badge className={`${map[status]} text-white`}>{status}</Badge>;
}

export function PaymentCard({ payment }: { payment: IPayment }) {
  return (
    <div className="flex flex-col gap-3 border p-2 rounded-sm">
      <Badge variant={"outline"}>#{payment.id}</Badge>
      <strong>Pagamento referente ao serviço</strong>
      <h1>{payment?.booking?.service?.title}</h1>
      <small>{payment?.booking?.service?.description}</small>
      <span className="flex flex-wrap items-center gap-2">
        <PaymentStatusBadge status={payment.status} />
        <Badge variant={"outline"}>{payment.method}</Badge>
        <Badge variant={"outline"}>
          Registrado aos {format(payment.createdAt, "dd/MM/yyyy -- HH:mm:ss")}
        </Badge>
        {payment.refundedAt && (
          <Badge variant={"destructive"}>
            Negado aos {format(payment.refundedAt, "dd/MM/yyyy -- HH:mm:ss")}
          </Badge>
        )}
        <Badge variant={"outline"}>
          {payment.amount.toLocaleString("pt") + ".00"} {payment.currency}
        </Badge>
        {payment.paidAt && (
          <Badge variant={"outline"}>
            Pago aos {format(payment.paidAt, "dd/MM/yyyy -- HH:mm:ss")}
          </Badge>
        )}
      </span>

      <div className="flex-row flex gap-3">
        {payment.fileUrl ? (
          <Button className="flex-1" asChild>
            <Link
              href={payment.fileUrl}
              target="_blank"
              download={payment.fileUrl}
            >
              <Download />
              Comprovativo
            </Link>
          </Button>
        ) : (
          <Button
            disabled={payment.status == PaymentStatus.PAID}
            variant={"outline"}
            className="flex-1 "
          >
            <File /> Anexar comprovativo
          </Button>
        )}
        <Button variant={"outline"} asChild>
          <Link href={`/customer/booking/${payment.bookingId}`}>Serviço</Link>
        </Button>
      </div>
    </div>
  );
}
