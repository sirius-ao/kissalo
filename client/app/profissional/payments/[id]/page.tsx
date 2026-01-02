import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentAvatar, PaymentStatusBadge } from "@/components/Payments";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, File } from "lucide-react";
import { mockPayments } from "@/mocks/payments";
import { Button } from "@/components/ui/button";
import { WalletCard } from "@/components/Wallets";

export default function PaymentDetails() {
  const payment = mockPayments[0];
  const service = payment?.booking?.service;
  const wallet = payment?.conclidation?.wallet;

  const isConsolidated = Boolean(payment?.conclidation);

  return (
    <div className="space-y-6">
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>Pagamento #{payment?.id}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex md:flex-row flex-col gap-4 justify-between">
            <span className="flex flex-col gap-2">
              <PaymentAvatar user={payment?.client} />
              <p>{payment.client?.email}</p>
              <small>Cliente</small>
            </span>
            {payment?.professional && (
              <span className="flex flex-col gap-2">
                <PaymentAvatar user={payment?.professional.user} />
                <p>{payment.professional?.user?.email}</p>
                <small>Prestador</small>
              </span>
            )}
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Valor : </strong> {payment.amount} {payment.currency}
            </div>
            <div>
              <strong>Método : </strong> {payment.method}
            </div>
            <div>
              <strong>Status : </strong>
              <PaymentStatusBadge status={payment.status} />
            </div>
            <div>
              <strong>Pago em : </strong>
              {payment.paidAt?.toLocaleString() || "-"}
            </div>{" "}
            <div>
              <strong>Serviço : </strong> {service.title}
            </div>
            {payment?.fileUrl && (
              <div>
                <strong>Comprovante : </strong>
                <Button variant={"outline"}>
                  <File />
                  Baixar
                </Button>
              </div>
            )}
          </div>

          {isConsolidated && (
            <div className="flex items-center gap-2 mt-4 text-green-600">
              <CheckCircle size={18} />
              <span>Pagamento consolidado — valor recebido</span>
            </div>
          )}
          {wallet && <WalletCard showElips={false} wallet={wallet} />}
        </CardContent>
      </Card>
    </div>
  );
}
