"use client";

import { Loader } from "@/components/Loader";
import constants from "@/constants";
import { IBooking, IUser } from "@/types/interfaces";
import { FormEvent, useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Box, Loader2, Stars, StepForward } from "lucide-react";
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
import { BookingService } from "@/services/Booking/index.service";
import { toast } from "sonner";

export default function BookingDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [notes, setNotes] = useState("");
  const [file1, setFile1] = useState<string>("");
  const [file2, setFile2] = useState<string>("");
  const [procissing, setProcissng] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;
        const bookingApi = new BookingService(token);
        const data = await bookingApi.getById(Number(id));
        if (data?.logout) {
          return;
        }
        setBooking(data?.data);
      } catch {
        toast.error("Erro ao carregar agendamento");
      } finally {
        setTimeout(() => setIsLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    loadData();
  }, [router]);

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (!notes) {
      toast.info("Preenche a nota");
      return;
    }
    if (!file1 || !file2) {
      toast.info("Preenche os arquivos");
      return;
    }
    setProcissng(true);
    const token = localStorage.getItem("acess-x-token") as string;
    const bookingApi = new BookingService(token);
    const data = await bookingApi.createStep(
      {
        files: [file1, file2],
        notes,
      },
      Number(id)
    );
    if (data?.logout) {
      return;
    }
    if (data?.data?.sucess) {
      toast.error("Etápa registrada");
      setBooking(data?.data?.data);
    } else {
      toast.error("Erro ao cadastrat etapa agendamento");
    }
    setProcissng(false);
  }

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
            <aside className="flex flex-col gap-5 md:-mt-10">
              <div className="flex lg:flex-row relative flex-col gap-3 justify-between">
                <span className="w-full flex flex-col gap-4 ">
                  <strong>Agendamento</strong>
                  <BookingCard booking={booking} />
                  <strong>Serviço</strong>
                  <UnJoinedServiceCard
                    service={booking.service}
                    role={UserRole.PROFESSIONAL}
                    autoHigth={true}
                  />
                  <strong>Etapas</strong>
                </span>
                <span className="lg:w-[35%] lg:sticky top-0 flex md:flex-col flex-col-reverse  gap-2">
                  {verifyArrayDisponiblity(booking?.steps) && (
                    <span className="lg:grid-cols-1 grid md:grid-cols-2 gap-4">
                      {booking.steps.map((item, idx) => (
                        <BookinStepsCard step={item} key={idx} />
                      ))}
                    </span>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <StepForward size={13} /> Criar etápas
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Criação de etápas</DialogTitle>
                      <DialogDescription>
                        Crie etápas para estar sincronizado com o cliente
                      </DialogDescription>

                      <form onSubmit={submit} className="flex flex-col gap-2">
                        <Label>Nota</Label>
                        <Textarea
                          placeholder="descrição da etápa"
                          className="resize-none"
                          required
                          onChange={(e) => {
                            setNotes(e.target.value);
                          }}
                        />
                        <Label>Anexos</Label>
                        <span className="grid gap-2 lg:grid-cols-2">
                          <Input
                            type="url"
                            required
                            placeholder="https://..."
                            onChange={(e) => {
                              setFile1(e.target.value);
                            }}
                          />
                          <Input
                            type="url"
                            required
                            placeholder="https://..."
                            onChange={(e) => {
                              setFile2(e.target.value);
                            }}
                          />
                        </span>
                        <Button type="submit" disabled={procissing}>
                          {procissing ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              <StepForward size={13} /> Criar etápas
                            </>
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </span>
              </div>
            </aside>
          )}
        </>
      )}
    </section>
  );
}
