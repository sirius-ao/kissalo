import { IBooking } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types/enum";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";
import {
  Loader2,
  CheckCircle,
  PlayCircle,
  XCircle,
  Ban,
  Calendar,
  Clock,
  MapPin,
  User,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { BookingCard } from "@/components/Booking";

const columns: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.ACCEPTED,
  BookingStatus.STARTED,
  BookingStatus.COMPLETED,
  BookingStatus.CANCELED,
  BookingStatus.REJECTED,
];

export const columnStyles: Record<
  BookingStatus,
  {
    icon: ReactNode;
    color: string;
    title: string;
    text: string;
  }
> = {
  PENDING: {
    color: "bg-amber-500",
    icon: <Loader2 className="animate-spin text-amber-500" size={16} />,
    title: "Pendentes",
    text: "text-amber-500",
  },

  ACCEPTED: {
    color: "bg-blue-500",
    icon: <CheckCircle className="text-blue-500" size={16} />,
    title: "Aceite",
    text: "text-blue-500",
  },

  STARTED: {
    color: "bg-indigo-500",
    icon: <PlayCircle className="text-indigo-500" size={16} />,
    title: "Em progresso",
    text: "text-indigo-500",
  },

  COMPLETED: {
    color: "bg-green-500",
    icon: <CheckCircle className="text-green-600" size={16} />,
    title: "Feito",
    text: "text-green-500",
  },

  CANCELED: {
    color: "bg-gray-500",
    icon: <Ban className="text-gray-500" size={16} />,
    title: "Cancelado",
    text: "text-gray-500",
  },

  REJECTED: {
    color: "bg-red-500",
    icon: <XCircle className="text-red-500" size={16} />,
    title: "Rejeitado",
    text: "text-red-500",
  },
  CONFIRMED: {
    color: "bg-green-500",
    icon: <CheckCircle className="text-green-600" size={16} />,
    title: "Confirmado",
    text: "text-green-500",
  },
};
export function KanbanView({ bookings }: { bookings: IBooking[] }) {
  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  gap-4">
      {columns.map((status, idx) => {
        if (status.length > 0)
          return (
            <span className="flex flex-col gap-2" key={idx}>
              <div
                className={`flex ${columnStyles[status].color}/10 p-2 rounded-sm  items-center justify-between w-full h-10`}
              >
                {columnStyles[status].icon}
                <h1 className={`${columnStyles[status].text} text-sm`}>
                  {columnStyles[status].title} ({status.length})
                </h1>
              </div>
              <div className="flex flex-col gap-2 bg-accent/5 p-2">
                {verifyArrayDisponiblity(bookings) &&
                  bookings
                    .filter((b) => b.status === status)
                    .map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
              </div>
            </span>
          );
      })}
    </div>
  );
}

export function ListView({ bookings }: { bookings: IBooking[] }) {
  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

export function TableView({ bookings }: { bookings: IBooking[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.id}</TableCell>
            <TableCell>{booking.service.title}</TableCell>
            <TableCell>{booking.client.firstName}</TableCell>
            <TableCell>
              {new Date(booking.scheduleDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{booking.status}</Badge>
            </TableCell>
            <TableCell>{booking.paymentStatus}</TableCell>
            <TableCell>{booking.totalAmount.toLocaleString()} AOA</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
