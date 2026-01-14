"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { IBooking } from "@/types/interfaces";
import constants from "@/constants";
import { Loader } from "@/components/Loader";
import { bookingsMock } from "@/mocks/bookings";
import { KanbanView, ListView, TableView } from "./views";
import { BookingService } from "@/services/Booking/index.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookingStatus } from "@/types/enum";

export default function Apoitments() {
  const [bookings, setBookings] = useState<IBooking[]>(bookingsMock);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

  const views: Record<any, ReactNode> = {
    kanban: <KanbanView bookings={bookings} />,
    list: <ListView bookings={bookings} />,
  };
  const router = useRouter();
  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;
        const bookingApi = new BookingService(token);
        const data = await bookingApi.get();
        if (data?.logout) {
          return;
        }
        setBookings(data?.data?.myBookings?.data ?? []);
      } catch {
        toast.error("Erro ao carregar agendamentos");
      } finally {
        setTimeout(() => setIsLoading(false), constants.TIMEOUT.LOADER);
      }
    }
    loadData();
  }, [router]);

  return (
    <section className="flex flex-col gap-2">
      <aside className="flex md:flex-row flex-col md:justify-between gap-4 items-center">
        <div className="md:w-auto w-full">
          <Button
            variant={viewMode === "kanban" ? "secondary" : "ghost"}
            onClick={() => setViewMode("kanban")}
          >
            Kanban <LayoutGrid size={100} />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
          >
            Lista <List size={100} />
          </Button>
        </div>
      </aside>
      <Separator />
      {isLoading ? <Loader /> : <article>{views[viewMode]}</article>}
    </section>
  );
}
