"use client";

import DashBoardProfissional from "@/components/Charts/dashchart";
import { IStats, StarsCard } from "@/components/StatsCard";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IBooking } from "@/types/interfaces";
import { bookingsMock } from "@/mocks/bookings";
import { BookingPriority, BookingStatus, PaymentStatus } from "@/types/enum";
import { format } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
export default function ProfissionalHomePage() {
  const [bookings, setBookings] = useState<IBooking[]>(bookingsMock);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookings(bookingsMock);
  }, []);

  if (!mounted) return null;

  const getStatusBadgeClass = (status: BookingStatus) => {
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
  const getStatusIcon = (status: BookingStatus) => {
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
  const getPriorityIcon = (status: BookingPriority) => {
    switch (status) {
      case "HIGH":
        return <TrendingUp />;
      case "LOW":
        return <TrendingDown />;
      default:
        return <LineChart />;
    }
  };
   const getPriorityIconText = (status: BookingPriority) => {
     switch (status) {
       case "HIGH":
         return "Alta";
       case "LOW":
         return "Baixa";
       default:
         return "Média";
     }
   };


  const priorityColorMap: Record<BookingPriority, string> = {
    HIGH: "red",
    MEDIUM: "amber",
    LOW: "blue",
  };

  const stats: IStats[] = [
    {
      isCoin: false,
      label: "Agendamentos recebidos na plataforma",
      oldValue: 1000,
      title: "Total agendamentos",
      value: 100,
    },
    {
      isCoin: true,
      label: "Total recebido na plaforma ",
      oldValue: 1000,
      title: "Total facturamento",
      value: 567100,
    },
    {
      isCoin: false,
      label: "Serviços anexados ao seu perfil",
      oldValue: 1,
      title: "Total servios",
      value: 10,
    },
    {
      isCoin: false,
      label: "carteiras registradas por você",
      oldValue: 1,
      title: "Total carteiras",
      value: 10,
    },
    {
      isCoin: false,
      label: "Serviços prestados e anexados ao seu perfil de profissional",
      oldValue: 1,
      title: "Serviços Prestados",
      value: 10,
    },
    {
      isCoin: true,
      label: "Valor retido na plaforma",
      oldValue: 10023,
      title: "Pagamentos Pendentes",
      value: 5600,
    },
  ];
  return (
    <section className="flex flex-col gap-5">
      <span className="lg:grid-cols-3 grid md:grid-cols-2 gap-4">
        {verifyArrayDisponiblity(stats) &&
          stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
      </span>
      <DashBoardProfissional />
      {verifyArrayDisponiblity(bookings) && (
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Últimos agendamentos</CardTitle>
            <CardDescription>
              {" "}
              ( {bookings.length} ) Agendamentos recentes recebidos{" "}
            </CardDescription>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data / Horário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Montante</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking, idx) => (
                <TableRow key={idx}>
                  <TableCell className="flex gap-2 items-center">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={booking.client?.avatarUrl} />
                        <AvatarFallback className="bg-black text-white">
                          {(booking.client?.firstName?.charAt(0) ?? "") +
                            (booking.client?.lastName?.charAt(0) ?? "")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex flex-col gap-1">
                        <p>
                          {booking.client.firstName +
                            " " +
                            booking.client.lastName}
                        </p>
                        <small>{booking?.client.email}</small>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <h1>{booking.service?.title}</h1>
                      <small>
                        {booking.service.description?.length > 0 &&
                          booking?.service?.description?.slice(0, 30) + "  ..."}
                      </small>
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(booking.scheduleDate, "dd/MM/yyyy")}{" "}
                    {format(booking.startTime, "HH:mm")} -{" "}
                    {format(booking.endTime, "HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(booking.status)}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {Number(booking.totalAmount).toLocaleString("pt")} kz
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`bg-${
                        priorityColorMap[booking.priority]
                      }-500/10  border border-${
                        priorityColorMap[booking.priority]
                      }-500/50  text-${
                        priorityColorMap[booking.priority]
                      }-500 rounded-sm`}
                    >
                      {getPriorityIcon(booking.priority)}
                      {getPriorityIconText(booking.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </section>
  );
}
