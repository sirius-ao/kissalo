import { IBooking, IBookingSteps } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Camera, Star, Eye } from "lucide-react";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import clsx from "clsx";
import { PaymentStatus, ServiceLocation, UserRole } from "@/types/enum";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function BookingCard({ booking }: { booking: IBooking }) {
  const { role } = useUserRole() as { role: any };

  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: any) => {};

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };
  const href =
    role == "PROFISSIONAL"
      ? "/profissional/bookings"
      : role == "ADMIN"
      ? "/admin/bookings"
      : "/costumer/booking";

  const locationMap: Record<ServiceLocation, string> = {
    CLIENT_HOME: "Estabelecimento do cliente",
    PROFESSIONAL_HOME: "Casa do profissional",
    PROFESSIONAL_SPACE: "Estabelecimento do Profissional",
  };
  const style = columnStyles[booking.status];
  return (
    <div className="flex flex-col gap-3 border rounded-md p-3 shadow-sm bg-background hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <p className="font-semibold leading-tight">{booking.service.title}</p>
          {role != "CUSTOMER" && (
            <PaymentAvatar user={booking?.client} notColl={false} />
          )}
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
          {locationMap[booking.location]}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {booking?.address?.city} / {booking?.address?.district}
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
        {JSON.stringify(booking.payment, null, 2)}
        {role == "CUSTOMER" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Acções</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuRadioGroup>
                {!booking.canEnd && (
                  <DropdownMenuItem>
                    Liberar
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}

                <Link href={`${href}/${booking.id}`}>
                  <DropdownMenuItem>
                    <Eye />
                    Detalhes
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuRadioGroup>
              {booking?.professional?.user && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <User />
                        Profissional
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <PaymentAvatar
                              notColl={false}
                              user={booking.professional.user}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </>
              )}
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-5">
                      <Star className="text-amber-500" />
                      Avaliar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Avaliar Serviço</DialogTitle>
                      <DialogDescription>
                        Compartilhe sua experiência. Sua avaliação ajuda outros
                        usuários.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-3">
                        <Label htmlFor="rating">Avaliação</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                            >
                              {star <= rating ? (
                                <Star
                                  className="fill-amber-500 text-amber-500"
                                  size={33}
                                />
                              ) : (
                                <Star
                                  className="text-gray-300  text-3xl"
                                  size={33}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="comment">Comentário</Label>
                        <Textarea
                          id="comment"
                          name="comment"
                          rows={4}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                          placeholder="Conte mais sobre sua experiência..."
                          maxLength={500}
                        />
                        <div className="text-xs text-gray-500 text-right">
                          Máximo de 500 caracteres
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Publicar Avaliação
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {role == "PROFISSIONAL" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Acções</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuRadioGroup>
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
                  <DropdownMenuSubTrigger>Cliente</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        {booking.client && (
                          <PaymentAvatar
                            notColl={false}
                            user={booking.client}
                          />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
