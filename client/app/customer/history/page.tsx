"use client";

import { ListView } from "@/app/profissional/bookings/views";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookingsMock } from "@/mocks/bookings";
import { Files, Paintbrush } from "lucide-react";
import PaymentBookingTab from "./tabs/payments";
import { useEffect, useState } from "react";
import { IBooking } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookingService } from "@/services/Booking/index.service";
import constants from "@/constants";
import { Loader } from "@/components/Loader";
export default function History() {
  const [booking, setBookings] = useState<IBooking[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;
        const bookingApi = new BookingService(token);
        const data = await bookingApi.get();
        if (data?.logout) {
          router.push("/auth/login");
          return;
        }
        console.log(data?.data?.myBookings?.data);
        setBookings(data?.data?.myBookings?.data ?? []);
      } catch {
        toast.error("Erro ao carregar agendamentos");
      } finally {
        setTimeout(() => setIsLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    loadData();
  }, [router]);
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Histórico</h1>
      <Tabs defaultValue="services" className="flex gap-6 overflow-visible">
        <TabsList className="ld:flex grid grid-cols-2 w-full gap-3 h-auto bg-transparent border">
          <TabsTrigger value="services" className="justify-start gap-2 ">
            <Paintbrush size={16} />
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="payments" className="justify-start gap-2 ">
            <Files size={16} /> Pagamentos
          </TabsTrigger>{" "}
        </TabsList>

        <div className="flex-1 lg:pt-10  ">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <TabsContent value="services">
                <ListView bookings={booking} />
              </TabsContent>
              <TabsContent value="payments">
                <PaymentBookingTab />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </section>
  );
}
