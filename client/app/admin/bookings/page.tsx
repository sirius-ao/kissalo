"use client";

import { TableView } from "@/app/professional/bookings/views";
import { Loader } from "@/components/Loader";
import { IStats, StarsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import constants from "@/constants";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { bookingsMock } from "@/mocks/bookings";
import { IBooking } from "@/types/interfaces";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function BookingAdmin() {
  const [bookings, setbookings] = useState<IBooking[]>([...bookingsMock]);
  const [loading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<IStats[]>([
    {
      isCoin: false,
      label: "Agendamentos recebidos na plataforma",
      oldValue: 1000,
      title: "Total agendamentos",
      value: 100,
    },
    {
      isCoin: false,
      label: "agendamentos pendentes",
      oldValue: 1000,
      title: "Pendências",
      value: 567100,
    },
    {
      isCoin: false,
      label: "agendamentos concluidos",
      oldValue: 1,
      title: "Conslusões",
      value: 10,
    },
    {
      isCoin: false,
      label: "agendamentos cancelados",
      oldValue: 1000,
      title: "Cancelamentos",
      value: 567100,
    },
    {
      isCoin: false,
      label: "agendamentos  aceites",
      oldValue: 1,
      title: "Aceitações",
      value: 10,
    },
    {
      isCoin: false,
      label: "agendamentos  recusados",
      oldValue: 1,
      title: "Rejeições",
      value: 10,
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          <span className="lg:grid-cols-3 grid md:grid-cols-2 gap-4">
            {verifyArrayDisponiblity(stats) &&
              stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
          </span>
          {verifyArrayDisponiblity(bookings) ? (
            <>
              <Separator />
              <TableView bookings={bookings} />
              <Separator />
              <span className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center ">
                  <Button variant={"outline"}>
                    <ArrowLeft />
                  </Button>
                  <Button variant={"outline"}>
                    <ArrowRight />
                  </Button>
                </div>
                <span>1 de 10</span>
              </span>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </section>
  );
}
