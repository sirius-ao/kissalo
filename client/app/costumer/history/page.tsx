"use client";

import { ListView } from "@/app/profissional/bookings/views";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookingsMock } from "@/mocks/bookings";
import { Files, Paintbrush } from "lucide-react";
import PaymentBookingTab from "./tabs/payments";
export default function History() {
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
          <TabsContent value="services">
            <ListView bookings={bookingsMock} />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentBookingTab />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
