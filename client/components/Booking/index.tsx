import { IBooking, IBookingSteps } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Camera,
  Star,
  Eye,
  Send,
  Loader2,
  TrendingUp,
  CheckCheck,
  AlertCircle,
  Check,
} from "lucide-react";
import { columnStyles } from "@/app/professional/bookings/views";
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
import { useContext, useState } from "react";
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
import {
  BookingStatus,
  PaymentStatus,
  ServiceLocation,
  UserRole,
} from "@/types/enum";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  getPriorityIcon,
  getPriorityIconText,
  getStatusBadgeClass,
  getStatusIcon,
  priorityColorMap,
} from "@/app/professional/page";
import { IconBrandPaypal } from "@tabler/icons-react";
import { UserContext } from "@/context/userContext";
import { Separator } from "@/components/ui/separator";
import { BookingService } from "@/services/Booking/index.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ReviewServices } from "@/services/Review/index.service";

export function BookingCard({ booking }: { booking: IBooking }) {
  const { role } = useUserRole() as { role: any };
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<BookingStatus | null>(null);

  const [processing, setProcessing] = useState(false);
  const href =
    role == "PROFISSIONAL"
      ? "/profissional/bookings"
      : role == "ADMIN"
      ? "/admin/bookings"
      : "/customer/booking";

  const locationMap: Record<ServiceLocation, string> = {
    CLIENT_HOME: "Estabelecimento do cliente",
    PROFESSIONAL_HOME: "Casa do profissional",
    PROFESSIONAL_SPACE: "Estabelecimento do Profissional",
  };
  return (
    <div className="flex flex-col gap-3 border rounded-md p-3 shadow-sm bg-background hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3">
          {role != "CUSTOMER" && (
            <PaymentAvatar user={booking?.client} notColl={false} />
          )}
          <p className="font-semibold leading-tight">{booking.service.title}</p>
          <small className="text-xs text-shadow-neutral-300 -mt-2">
            {booking?.service?.description}
            {booking?.service?.shortDescription}
          </small>
        </div>

        <Badge
          variant="outline"
          className={getStatusBadgeClass(booking.status)}
        >
          {getStatusIcon(booking.status)}
          {booking.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(booking.scheduleDate).toDateString()}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="text-blue-500" size={12} />
          {new Date(booking.startTime).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="text-indigo-500" size={12} />
          {new Date(booking.endTime).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Star className="text-amber-500" size={12} />
          {!!booking?.review ? "Avalidado" : "Não avaliado"}
        </span>

        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {locationMap[booking.location]}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />{" "}
          {booking?.address && JSON.parse(booking.address)?.country} /{" "}
          {booking?.address && JSON.parse(booking.address)?.city} /{" "}
          {booking?.address && JSON.parse(booking.address)?.street}
        </span>
      </div>

      <div className="flex  justify-between flex-wrap gap-4  mt-2">
        <div className="flex items-center gap-2 text-xs">
          {" "}
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
          <Badge variant="secondary" className="capitalize">
            Pagemento : {booking.paymentStatus}
          </Badge>
          <Badge variant={booking.canEnd ? "secondary" : "default"}>
            {booking.canEnd ? "Liberado" : "Não liberado"}
          </Badge>
        </div>
        {role == "CUSTOMER" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={
                  booking.status == BookingStatus.CANCELED ||
                  booking.status == BookingStatus.REJECTED ||
                  (booking.status == BookingStatus.COMPLETED &&
                    !!booking?.review)
                }
              >
                {processing ? <Loader2 className="animate-spin" /> : "Acções"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuRadioGroup>
                {!booking.canEnd && (
                  <DropdownMenuItem
                    onClick={async () => {
                      setProcessing(true);
                      const token = localStorage.getItem(
                        "acess-x-token"
                      ) as string;
                      const bookingApi = new BookingService(token);
                      const data = await bookingApi.liberate(booking.id);
                      if (data?.logout) {
                        return;
                      }
                      if (data?.updated) {
                        toast.success("Liberado com sucesso");
                        setTimeout(() => {
                          location.reload();
                        }, 1000);
                      } else {
                        toast.error(data?.message ?? "Erro ao liberar");
                      }
                      setProcessing(false);
                    }}
                  >
                    <IconBrandPaypal />
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={booking.review?.id ? true : false}
                        variant="outline"
                        className="w-full mt-2"
                      >
                        {booking.review?.id ? (
                          "Alaiado"
                        ) : (
                          <>
                            <Star className="text-amber-500" />
                            Avaliar
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setProcessing(true);
                          const token = localStorage.getItem(
                            "acess-x-token"
                          ) as string;

                          const reviewApi = new ReviewServices(token);

                          const data = await reviewApi.create({
                            bookingId: booking.id,
                            comment: notes,
                            rating,
                          });

                          if (data?.logout) {
                            toast.error("Sessão expirada");
                            return;
                          }

                          toast.info(
                            data?.message ??
                              data?.data?.message ??
                              data?.data?.sucess
                              ? "Avalação criada"
                              : "Avaliação não criada"
                          );
                          console.log(data);
                          if (data?.data?.sucess) {
                            setTimeout(() => {
                              location.reload();
                            }, 1000);
                          }
                          setProcessing(false);
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>Avaliar Serviço</DialogTitle>
                          <DialogDescription>
                            Compartilhe sua experiência. Sua avaliação ajuda
                            outros usuários.
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
                              className=" resize-none"
                              value={notes}
                              required
                              placeholder="Conte mais sobre sua experiência..."
                              maxLength={500}
                              onChange={(e) => {
                                setNotes(e.target.value);
                              }}
                            />
                            <div className="text-xs text-gray-500 text-right">
                              Máximo de 500 caracteres
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="grid grid-cols-2 gap-2">
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600"
                            disabled={processing}
                          >
                            {processing ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-2" />
                                Publicar Avaliação
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {role == "PROFESSIONAL" && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-1" asChild>
              <Button
                disabled={
                  booking.status == BookingStatus.CANCELED ||
                  booking.status == BookingStatus.REJECTED ||
                  booking.status == BookingStatus.COMPLETED
                }
              >
                {processing ? <Loader2 className="animate-spin" /> : "Acções"}
              </Button>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={booking.status == BookingStatus.COMPLETED}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <TrendingUp className="text-amber-500" />
                    Alterar estado
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Mude o estado do agendamento</DialogTitle>
                    <DialogDescription>
                      Mude o estado do serviço conforme
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (status == BookingStatus.CANCELED && !notes) {
                        return toast.error("Prence o motivo");
                      }

                      setProcessing(true);
                      const token = localStorage.getItem(
                        "acess-x-token"
                      ) as string;
                      const bookingApi = new BookingService(token);
                      const data = await bookingApi.toogle(
                        {
                          files: [],
                          notes:
                            status == BookingStatus.CANCELED
                              ? notes
                              : "Alteração feita pelos propreitarios do agendamento",
                          status: status as any,
                        },
                        booking.id
                      );
                      if (data?.logout) {
                        return;
                      }
                      console.log(data);
                      toast.info(data?.message ?? "Serviço modificado");
                      setProcessing(false);
                    }}
                    className="flex flex-col gap-4"
                  >
                    <Label>Estado</Label>
                    <Select
                      onValueChange={(e: BookingStatus) => {
                        setStatus(e);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Filtrar"
                          className="text-white placeholder:text-white "
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {booking.status == BookingStatus.ACCEPTED && (
                          <SelectItem value="STARTED">
                            <Loader2 size={100} className="animate-spin" />
                            Em progresso
                          </SelectItem>
                        )}
                        {booking.status == BookingStatus.STARTED &&
                          booking.canEnd && (
                            <SelectItem value="COMPLETED">
                              <Check />
                              Finalizar
                            </SelectItem>
                          )}

                        <SelectItem value="CANCELED">
                          <AlertCircle size={100} />
                          Cancelar
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {status == BookingStatus.CANCELED && (
                      <>
                        <Label>Mótivo</Label>
                        <Input
                          required
                          onChange={(e) => {
                            setNotes(e.target.value);
                          }}
                          placeholder="motivo da mudança de estado"
                        />
                      </>
                    )}
                    <DialogFooter className="grid grid-cols-2 gap-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={processing}>
                        {processing ? <Loader2 /> : "Alterar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
export function BookinStepsCard({ step }: { step: IBookingSteps }) {
  const context = useContext(UserContext);

  if (!context) {
    return;
  }

  const { user } = context;
  return (
    <div
      className={clsx("grid md:grid-cols-2 p-2 rounded-sm gap-4 w-full border")}
    >
      <span className="grid grid-cols-2 gap-2 pb-3">
        {verifyArrayDisponiblity(step?.files) &&
          step.files.map((item, idx) => {
            if (idx >= 2) return null;
            return (
              <ImageHoverCard
                adicionalClas="h-full min-h-20 rounded-sm w-full bg-gray-100"
                path={item}
                key={idx}
              />
            );
          })}
      </span>
      <span className="flex flex-col gap-2">
        <small className="text-wrap text-xs wrap-anywhere">{step.notes}</small>

        {step.senderId != user?.id && (
          <>
            <Separator />
            <PaymentAvatar notColl={false} user={step?.user} />
          </>
        )}

        <small>{format(step.createdAt, "dd/MM/yyyy")} </small>
        <Badge
          variant={step.senderId == user?.id ? "secondary" : "default"}
          className="place-self-end"
        >
          <Send />
          {step.senderId == user?.id ? "Enviado" : "Recebido"}{" "}
        </Badge>
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
          className="h-full w-full bg-gray-100 rounded-sm border"
          src={path}
          alt=""
        />
      </DialogContent>
    </Dialog>
  );
}
