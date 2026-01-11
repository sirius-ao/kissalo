"use client";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Loader } from "@/components/Loader";
import constants from "@/constants";
import { paymentsMock } from "@/mocks/payments";
import { IPayment } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentCard } from "@/components/Payments";

export default function PaymentBookingTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<IPayment[]>(paymentsMock);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);
  return (
    <span>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {verifyArrayDisponiblity(payment) ? (
            <aside className="flex flex-col gap-3">
              {payment.map((item, idx) => (
                <PaymentCard payment={item} key={idx} />
              ))}
            </aside>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Box />
                </EmptyMedia>
                <EmptyTitle>Sem pagamentos</EmptyTitle>
                <EmptyDescription>
                  pagamento não encontrado , certifique de que tens a permissão
                  para ver o mesmo e que o mesmo existe
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      )}
    </span>
  );
}
