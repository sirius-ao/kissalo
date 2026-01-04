import { IBooking, IBookingSteps } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Camera } from "lucide-react";
import { columnStyles } from "@/app/profissional/bookings/views";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUserRole } from "@/hooks/use-UserRole";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { PaymentAvatar } from "../Payments";

import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import clsx from "clsx";

export function BookingCard({ booking }: { booking: IBooking }) {
  const { role } = useUserRole();
  const href =
    role == "PROFISSIONAL"
      ? "/profissional/bookings"
      : role == "ADMIN"
      ? "/admin/bookings"
      : "/costumer/bookings";

  const style = columnStyles[booking.status];
  return (
    <div className="flex flex-col gap-3 border rounded-md p-3 shadow-sm bg-background hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold leading-tight">{booking.service.title}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <User size={12} />
            {booking.client.firstName}
          </p>
        </div>

        <Badge variant="outline" className="flex items-center gap-1">
          {style.icon}
          {booking.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(booking.scheduleDate).toLocaleDateString()}
        </span>

        <span className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(booking.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {new Date(booking.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {booking.location}
        </span>
      </div>

      <div className="flex justify-between  mt-2">
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary">{booking.priority}</Badge>
          <Badge variant="secondary">{booking.paymentStatus}</Badge>
          <Badge variant="secondary">
            {booking.canEnd ? "Liberado" : "..."}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Acções</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuRadioGroup>
              <DropdownMenuItem>
                Liberar
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Pagar
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>

              <Link href={`${href}/${booking.id}`}>
                <DropdownMenuItem>
                  Detalhes
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Prestador</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Cliente</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
export function BookinStepsCard({ step }: { step: IBookingSteps }) {
  return (
    <div className="grid shadow-gray-100 shadow-2xs md:grid-cols-2 p-2 rounded-sm gap-2 w-full border">
      <span className="grid grid-cols-2 gap-1">
        {verifyArrayDisponiblity(step?.files) &&
          step.files.map((item, idx) => {
            if (idx >= 2) return null;
            return (
              <ImageHoverCard
                adicionalClas="h-full min-h-20 rounded-sm bg-gray-100"
                path={item}
                key={idx}
              />
            );
          })}
      </span>
      <span className="flex flex-col gap-2">
        <small>{step.notes}</small>
        <PaymentAvatar user={step?.user} />
        <small>{format(step.createdAt, "dd/MM/yyyy")} </small>
      </span>
    </div>
  );
}
export function ImageHoverCard({
  path,
  adicionalClas,
}: {
  path: string;
  adicionalClas?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Dialog>
      <DialogTrigger
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        className="relative"
      >
        <img
          className={`h-full min-h-20 rounded-sm bg-gray-100 ${adicionalClas}`}
          src={path}
          alt=""
        />

        <span
          className={clsx(
            "absolute h-full cursor-pointer w-full top-0 left-0 flex transition-all bg-linear-0 to-black/50 from-black/30 rounded-sm opacity-0 justify-center items-center",
            {
              "opacity-100": hover,
            }
          )}
        >
          <Camera className="text-white animate-pulse" size={18} />
        </span>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Arquivo anexado</DialogTitle>
        <DialogDescription>
          Arquivo enviado para exlcarecimento
        </DialogDescription>
        <img
          className="min-h-70 h-full w-full bg-gray-100 rounded-sm"
          src={path}
          alt=""
        />
      </DialogContent>
    </Dialog>
  );
}
