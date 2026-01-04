"use client";

import { Loader } from "@/components/Loader";
import constants from "@/constants";
import { servicesMock } from "@/mocks/services";
import { NotificationChannel, NotificationType } from "@/types/enum";
import { INotification } from "@/types/interfaces";
import { useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NotificationCard from "@/components/Notifications";
export default function NotificationPage() {
  const router = useRouter();
  const types: NotificationType[] = [
    NotificationType.ALERT,
    NotificationType.AUTH,
    NotificationType.BOOKING,
    NotificationType.PAYMENT,
    NotificationType.REVIEW,
    NotificationType.SYSTEM,
  ];

  const notificationMocks: INotification[] = Array.from({ length: 5 }).map(
    (_, index) => {
      return {
        channel: NotificationChannel.PUSH,
        id: index,
        createdAt: new Date(),
        isRead: false,
        message: servicesMock[index]?.description,
        title: servicesMock[index]?.title,
        type: types[index],
        user: undefined as any,
        userId: index,
        deepLink: `https:/${index}`,
      };
    }
  );

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  return (
    <section>
      {isLoading ? (
        <Loader />
      ) : (
        <span>
          {verifyArrayDisponiblity(notificationMocks) ? (
            <article className="flex flex-col gap-4">
              <span className="flex flex-col gap-4">
                {notificationMocks.map((item, idx) => (
                  <NotificationCard notification={item} key={idx} />
                ))}
              </span>
              <span className="flex gap-2">
                <Button variant={"outline"} className="w-10">
                  <ArrowLeft />
                </Button>
                <Button variant={"outline"} className="w-10">
                  <ArrowRight />
                </Button>
              </span>
            </article>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Box />
                </EmptyMedia>
                <EmptyTitle>Sem notificações</EmptyTitle>
                <EmptyDescription>
                  Notificações não encontrado , certifique de que tens a
                  permissão para ver o mesmo e que o mesmo existe
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => {
                    router.back();
                  }}
                >
                  Voltar
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </span>
      )}
    </section>
  );
}
