import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { IPayment } from "@/types/interfaces";

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

export function PaymentAvatar({ user }: { user: IUser }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user?.avatarUrl} />
        <AvatarFallback>
          {user?.firstName[0]}
          {user?.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm">
        {user?.firstName} {user?.lastName}
      </span>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-green-500",
    PENDING: "bg-yellow-500",
    FAILED: "bg-red-500",
  };

  return <Badge className={`${map[status]} text-white`}>{status}</Badge>;
}
