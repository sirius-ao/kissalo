"use client";
import { IStats, StarsCard } from "@/components/StatsCard";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { useState } from "react";
import { BookingPriority, BookingStatus, PaymentStatus } from "@/types/enum";
import { useEffect } from "react";
import {
  CheckCheck,
  LineChart,
  Loader2,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { IconProgress } from "@tabler/icons-react";

export const getStatusBadgeClass = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/10 text-amber-500 border-amber-500/50 rounded-sm";
    case "CONFIRMED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/50 rounded-sm";
    case "STARTED":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/50 rounded-sm";
    case "COMPLETED":
      return "bg-green-500/10 text-green-500 border-green-500/50 rounded-sm";
    case "CANCELED":
      return "bg-red-500/10 text-red-500 border-red-500/50 rounded-sm";
    case "ACCEPTED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/50 rounded-sm";
    case "REJECTED":
      return "bg-red-500/10 text-red-500 border-red-500/50 rounded-sm";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/50 rounded-sm";
  }
};
export const getStatusIcon = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return <Loader2 className="animate-spin" />;
    case "STARTED":
      return <IconProgress />;
    case "COMPLETED":
      return <CheckCheck />;
    case "CANCELED":
      return <ShieldAlert />;
    case "ACCEPTED":
      return <CheckCheck />;
    case "REJECTED":
      return <ShieldAlert />;
    default:
      return <CheckCheck />;
  }
};
export const getPriorityIcon = (status: BookingPriority) => {
  switch (status) {
    case "HIGH":
      return <TrendingUp />;
    case "LOW":
      return <TrendingDown />;
    default:
      return <LineChart />;
  }
};
export const getPriorityIconText = (status: BookingPriority) => {
  switch (status) {
    case "HIGH":
      return "Alta";
    case "LOW":
      return "Baixa";
    default:
      return "Média";
  }
};
export const priorityColorMap: Record<BookingPriority, string> = {
  HIGH: "red",
  MEDIUM: "amber",
  LOW: "blue",
};

export default function ProfissionalHomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats: IStats[] = [
    {
      isCoin: false,
      label: "total profissionais da plaforma",
      oldValue: 1000,
      title: "Total profissionais",
      value: 100,
    },
    {
      isCoin: true,
      label: "total clientes da plaforma ",
      oldValue: 1000,
      title: "Total clientes",
      value: 567100,
    },
    {
      isCoin: false,
      label: "total de usuários",
      oldValue: 1,
      title: "Total usuários",
      value: 10,
    },
  ];
  return (
    <section className="flex flex-col gap-5">
      <span className="lg:grid-cols-3 grid md:grid-cols-2 gap-4">
        {verifyArrayDisponiblity(stats) &&
          stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
      </span>
    </section>
  );
}
