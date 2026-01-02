import { IBooking } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { columnStyles } from "@/app/profissional/bookings/views";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

export function BookingCard({ booking }: { booking: IBooking }) {
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
              <DropdownMenuItem>
                Detalhes
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
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
