"use client";

import { format } from "date-fns";
import { NotificationType } from "@/types/enum";
import { INotification } from "@/types/interfaces";
import { IconBrandBooking, IconBrandPaypal } from "@tabler/icons-react";
import { AlertCircle, Lock, Send, Settings } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

export interface NotificationStyle {
  color: string;
  labe: string;
  icon: ReactNode;
}
export default function NotificationCard({
  notification,
}: {
  notification: INotification;
}) {
  const notificationMap: Record<NotificationType, NotificationStyle> = {
    ALERT: {
      color: "red",
      labe: "Alerta",
      icon: <AlertCircle size={15} />,
    },
    AUTH: {
      color: "yellow",
      labe: "Segurança",
      icon: <Lock size={15} />,
    },
    BOOKING: {
      color: "indigo",
      labe: "Agendamento",
      icon: <IconBrandBooking size={22} />,
    },
    PAYMENT: {
      color: "green",
      labe: "Pagamento",
      icon: <IconBrandPaypal size={15} />,
    },
    REVIEW: {
      color: "amber",
      labe: "Avaliação",
      icon: <Send size={15} />,
    },
    SYSTEM: { color: "gray", labe: "Sistema", icon: <Settings /> },
  };

  const metadata = notificationMap[notification.type];

  return (
    <div className="flex flex-col gap-2  border shadow-2xs p-3 rounded-lg">
      <div
        className={clsx(
          `text-${metadata.color}-500 max-w-30 gap-2 justify-center items-center   border border-${metadata.color}-500/50  p-1 rounded-sm flex items-center`
        )}
      >
        {metadata.icon}
        <p className="text-sm">{metadata.labe}</p>
      </div>

      <small>{notification.message}</small>
      {notification.deepLink && (
        <span className="text-blue-500 hover:underline justify-end flex text-sm">
          <Link href={notification.deepLink}>ver mais ...</Link>
        </span>
      )}
      <small>{format(notification.createdAt, "dd/MM/yyyy")} </small>
    </div>
  );
}
