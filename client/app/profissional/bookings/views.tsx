import { IBooking, IUser } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import { ApprovalStatus, BookingStatus, UserRole } from "@/types/enum";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useState } from "react";
import { Loader2, CheckCircle, PlayCircle, XCircle, Ban } from "lucide-react";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { BookingCard } from "@/components/Booking";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getPriorityIcon,
  getPriorityIconText,
  getStatusBadgeClass,
  getStatusIcon,
  priorityColorMap,
} from "../page";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserRole } from "@/hooks/use-UserRole";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const columns: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.ACCEPTED,
  BookingStatus.STARTED,
  BookingStatus.COMPLETED,
  BookingStatus.CONFIRMED,
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
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    id: 0,
    name: "",
  });

  const [currentServiceUserList, setCurrentServiceUsersList] = useState<
    IUser[]
  >([]);
  const { role } = useUserRole();
  const href =
    role == UserRole.PROFESSIONAL
      ? "/profissional/bookings"
      : role == UserRole.ADMIN
      ? "/admin/bookings"
      : "/costumer/bookings";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox />
          </TableHead>
          <TableHead>Cliente</TableHead>
          {role == UserRole.ADMIN && <TableHead>Profissional</TableHead>}
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
                    {booking.client.firstName + " " + booking.client.lastName}
                  </p>
                  <small>{booking?.client.email}</small>
                </span>
              </span>
            </TableCell>
            {role == UserRole.ADMIN && (
              <TableCell>
                {booking?.professionalId ? (
                  <span className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={booking.professional?.user?.avatarUrl}
                      />
                      <AvatarFallback className="bg-black text-white">
                        {(booking.professional?.user?.firstName?.charAt(0) ??
                          "") +
                          (booking.professional?.user?.lastName?.charAt(0) ??
                            "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col gap-1">
                      <p>
                        {booking.professional?.user.firstName +
                          " " +
                          booking.professional?.user.lastName}
                      </p>
                      <small>{booking?.professional?.user.email}</small>
                    </span>
                  </span>
                ) : (
                  <p className="text-xs text-red-500">Nenhum profissional anexado</p>
                )}
              </TableCell>
            )}
            <TableCell>
              <span className="flex gap-2">
                <img
                  src={booking?.service?.bannerUrl}
                  alt="ServiceImage"
                  className="h-10 w-10 rounded-sm object-contain"
                />
                <div className="flex flex-col gap-2">
                  <h1>{booking.service?.title}</h1>
                  <small>
                    {booking.service.description?.length > 0 &&
                      booking?.service?.description?.slice(0, 30) + "  ..."}
                  </small>
                </div>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>Acções</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {role == UserRole.ADMIN && (
                    <>
                      <DropdownMenuRadioGroup>
                        <DropdownMenuItem>
                          Cancelar
                          <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <Link href={`${href}/${booking.id}`}>
                          <DropdownMenuItem>
                            Detalhes
                            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>

                        {!booking?.professionalId && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full mt-3"
                                variant={"outline"}
                              >
                                Anexar profissional
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Anexe profissional a este pedido
                                </DialogTitle>
                                <DialogDescription>
                                  Caso o agendamento já possui um profissional
                                  anexado o mesmo não poderá ser alterado ou
                                  removido, portanto certifique se de escolher o
                                  profissional ideial para o mesmo agndamento.
                                </DialogDescription>
                              </DialogHeader>

                              <Popover
                                open={open}
                                onOpenChange={(e) => {
                                  if (e) {
                                    const users: IUser[] =
                                      booking.service?.requests
                                        .filter((item) => {
                                          return (
                                            item.status ==
                                            ApprovalStatus.APPROVED
                                          );
                                        })
                                        .map((item) => {
                                          return item?.professional?.user;
                                        });
                                    setCurrentServiceUsersList(users);
                                  }
                                  setOpen(e);
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                  >
                                    {value?.name
                                      ? currentServiceUserList.find(
                                          (user) => user.id === value.id
                                        )?.firstName +
                                        " " +
                                        currentServiceUserList.find(
                                          (user) => user.id === value.id
                                        )?.lastName
                                      : "Selecione um profissional..."}
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command className="p-2">
                                    <CommandInput placeholder="Selecione um profissional..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        Nenhum profissonal anexado a este
                                        serviço
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {currentServiceUserList.map(
                                          (user, idx) => (
                                            <CommandItem
                                              key={idx}
                                              value={
                                                user?.firstName +
                                                " " +
                                                user?.lastName
                                              }
                                              onSelect={(currentValue) => {
                                                setValue({
                                                  id: user.id,
                                                  name:
                                                    user.firstName +
                                                    " " +
                                                    user.lastName,
                                                });
                                                setOpen(false);
                                              }}
                                              className=""
                                            >
                                              <CheckIcon
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  value?.id === user.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              <Avatar>
                                                <AvatarImage
                                                  src={user?.avatarUrl}
                                                />
                                                <AvatarFallback className="bg-black text-white">
                                                  {(user?.firstName?.charAt(
                                                    0
                                                  ) ?? "") +
                                                    (user?.lastName?.charAt(
                                                      0
                                                    ) ?? "")}
                                                </AvatarFallback>
                                              </Avatar>
                                              {user.firstName +
                                                " " +
                                                user.lastName}
                                            </CommandItem>
                                          )
                                        )}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <Button>Anexar profissional</Button>
                            </DialogContent>
                          </Dialog>
                        )}
                      </DropdownMenuRadioGroup>
                    </>
                  )}

                  {role == UserRole.PROFESSIONAL && (
                    <>
                      <DropdownMenuRadioGroup>
                        <Link href={`${href}/${booking.id}`}>
                          <DropdownMenuItem>
                            Detalhes
                            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuRadioGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
