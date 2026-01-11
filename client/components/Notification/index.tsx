"use client";

import { Loader } from "@/components/Loader";
import constants from "@/constants";
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
import { NofiticationService } from "@/services/Notification/index.service";

export default function NotificationPage() {
  const router = useRouter();
  const [notification, setNotification] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function get() {
      const apiSevice = new NofiticationService(
        localStorage.getItem("acess-x-token") as string
      );
      const data = await apiSevice.get();
      console.log(data);
      if (data?.logout) {
        router.push("/auth/login");
        return;
      }
      setNotification(data?.data ?? []);
      setTimeout(() => {
        setIsLoading(false);
      }, constants.TIMEOUT.LOADER);
    }
    get();
  }, []);

  return (
    <section>
      {isLoading ? (
        <Loader />
      ) : (
        <span>
          {verifyArrayDisponiblity(notification) ? (
            <article className="flex flex-col gap-4">
              <span className="flex flex-col gap-4">
                {notification.map((item, idx) => (
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
