"use client";

import { TableView } from "@/app/professional/bookings/views";
import { Loader } from "@/components/Loader";
import { IStats, StarsCard } from "@/components/StatsCard";
import { Separator } from "@/components/ui/separator";
import constants from "@/constants";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { bookingsMock } from "@/mocks/bookings";
import { BookingService } from "@/services/Booking/index.service";
import { BookingStatus } from "@/types/enum";
import { IBooking } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookingAdmin() {
  const [stats, setStats] = useState<IStats[]>([
    {
      isCoin: false,
      label: "Agendamentos recebidos na plataforma",
      oldValue: 0,
      title: "Total agendamentos",
      value: 0,
    },
    {
      isCoin: false,
      label: "agendamentos pendentes",
      oldValue: 0,
      title: "Pendências",
      value: 0,
    },
    {
      isCoin: false,
      label: "agendamentos concluidos",
      oldValue: 0,
      title: "Conslusões",
      value: 0,
    },
    {
      isCoin: false,
      label: "agendamentos cancelados",
      oldValue: 0,
      title: "Cancelamentos",
      value: 0,
    },
    {
      isCoin: false,
      label: "agendamentos  aceites",
      oldValue: 0,
      title: "Aceitações",
      value: 0,
    },
    {
      isCoin: false,
      label: "agendamentos  recusados",
      oldValue: 0,
      title: "Rejeições",
      value: 0,
    },
  ]);
  const [booking, setBookings] = useState<IBooking[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;
        const bookingApi = new BookingService(token);
        const [data] = await Promise.all([bookingApi.get()]);
        if (data?.logout) {
          return;
        }
        setBookings(data?.data?.myBookings?.data ?? []);
        if (Array.isArray(data?.data?.myBookings?.data)) {
          const apointments = data?.data?.myBookings?.data as IBooking[];
          const completed = apointments.filter((item) => {
            return item.status == BookingStatus.COMPLETED;
          }).length;
          const acepted = apointments.filter((item) => {
            return (
              item.status == BookingStatus.CONFIRMED ||
              item.status == BookingStatus.ACCEPTED
            );
          }).length;
          const pending = apointments.filter((item) => {
            return item.status == BookingStatus.PENDING;
          }).length;
          const cancled = apointments.filter((item) => {
            return (
              item.status == BookingStatus.CANCELED ||
              item.status == BookingStatus.REJECTED
            );
          }).length;
          const unprofissional = apointments.filter((item) => {
            return !item.professionalId;
          }).length;
          setStats([
            {
              isCoin: false,
              label: "agendamentos pendentes",
              oldValue: pending,
              title: "Pendências",
              value: pending,
            },
            {
              isCoin: false,
              label: "agendamentos concluidos",
              oldValue: completed,
              title: "Conslusões",
              value: completed,
            },
            {
              isCoin: false,
              label: "agendamentos cancelados",
              oldValue: cancled,
              title: "Cancelamentos",
              value: cancled,
            },
            {
              isCoin: false,
              label: "agendamentos  aceites",
              oldValue: acepted,
              title: "Aceitações",
              value: acepted,
            },
            {
              isCoin: false,
              label: "agendamentos  sem proissionais anexados",
              oldValue: unprofissional,
              title: "Agendamentos sem profissionais",
              value: unprofissional,
            },
          ]);
        }
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
        <>
          <span className="lg:grid-cols-3 grid md:grid-cols-2 gap-4">
            {verifyArrayDisponiblity(stats) &&
              stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
          </span>
          {verifyArrayDisponiblity(booking) ? (
            <>
              <Separator />
              <TableView bookings={booking} />
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </section>
  );
}
