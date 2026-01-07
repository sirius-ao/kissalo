"use client";

import { Loader } from "@/components/Loader";
import constants from "@/constants";
import { IBooking, IUser } from "@/types/interfaces";
import { useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Box, Stars, StepForward } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { bookingsMock } from "@/mocks/bookings";
import { paymentsMock } from "@/mocks/payments";
import { UnJoinedServiceCard } from "@/components/Service";
import { UserRole } from "@/types/enum";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { BookinStepsCard, BookingCard } from "@/components/Booking";
import { PaymentAvatar } from "@/components/Payments";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function BookingDetails() {
  const { id } = useParams();
  const bookingFiltred = bookingsMock.filter((item) => {
    return item.id == Number(id);
  });

  const [booking, setBooking] = useState<IBooking>({
    ...bookingFiltred[0],
    payment: paymentsMock.filter((i) => {
      return i.bookingId == Number(id);
    })[0],
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);  <></>;
    }, constants.TIMEOUT.LOADER);
  }, []);

  return (
    <section>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!booking ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Box />
                </EmptyMedia>
                <EmptyTitle>Agendamento não encontrado</EmptyTitle>
                <EmptyDescription>
                  Agendamento não encontrado , certifique de que tens a
                  permissão para ver o mesmo e que o mesmo existe
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => {
                    router.back();
                  }}
                >
                  Voltar
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <aside className="flex flex-col gap-5 ">
              <div className="flex lg:flex-row relative flex-col gap-3 justify-between">
                <span className="w-full flex flex-col gap-4">
                  <UnJoinedServiceCard
                    service={booking.service}
                    role={UserRole.PROFESSIONAL}
                    autoHigth={true}
                  />
                  <div className="lg:flex hidden lg:flex-col gap-4">
                    <strong className="textx">Informações</strong>
                    <span className="grid md:grid-cols-2 gap-4">
                      <span className="flex flex-col gap-3">
                        <strong>Cliente</strong>
                        <PaymentAvatar user={booking?.client} />
                      </span>
                      <span className="flex flex-col gap-3">
                        <strong>Prestador</strong>
                        <PaymentAvatar
                          user={booking?.professional?.user as IUser}
                        />
                      </span>
                    </span>
                    <Separator />
                    <strong>Agendamento</strong>
                    <BookingCard booking={booking} />
                  </div>
                </span>
                <span className="lg:w-[25%] lg:sticky top-0 flex flex-col gap-2">
                  {verifyArrayDisponiblity(booking?.steps) ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => {}}>
                            <StepForward size={13} /> Criar etápas
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Criação de etápas</DialogTitle>
                          <DialogDescription>
                            Crie etápas para estar sincronizado com o cliente
                          </DialogDescription>

                          <form action="" className="flex flex-col gap-2">
                            <Label>Nota</Label>
                            <Textarea
                              placeholder="descrição da etápa"
                              className="resize-none"
                              required
                            />
                            <Label>Anexos</Label>
                            <span className="grid gap-2 lg:grid-cols-2">
                              <Input
                                type="url"
                                required
                                placeholder="https://..."
                              />
                              <Input
                                type="url"
                                required
                                placeholder="https://..."
                              />
                            </span>
                            <Button onClick={() => {}}>
                              <StepForward size={13} /> Criar etápas
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <span className="lg:grid-cols-1 grid md:grid-cols-2 gap-4">
                        {booking.steps.map((item, idx) => (
                          <BookinStepsCard step={item} key={idx} />
                        ))}
                      </span>
                    </>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Box />
                        </EmptyMedia>
                        <EmptyTitle>Sem etapa</EmptyTitle>
                        <EmptyDescription>
                          Crie uma etapa agora
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button onClick={() => {}}>Criar</Button>
                      </EmptyContent>
                    </Empty>
                  )}
                </span>
                <div className="lg:hidden flex flex-col gap-4">
                  <strong className="textx">Informações</strong>
                  <span className="grid grid-cols-2 gap-4">
                    <span className="flex flex-col gap-3">
                      <strong>Cliente</strong>
                      <PaymentAvatar user={booking?.client} />
                    </span>
                    <span className="flex flex-col gap-3">
                      <strong>Prestador</strong>
                      <PaymentAvatar
                        user={booking?.professional?.user as IUser}
                      />
                    </span>
                  </span>
                  <Separator />
                </div>
              </div>
            </aside>
          )}
        </> 
      )}
    </section>
  );
}
