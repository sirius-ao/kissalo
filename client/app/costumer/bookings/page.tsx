"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCheck,
  LayoutGrid,
  List,
  Loader2,
  Search,
  Table,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ReactNode, useEffect, useState } from "react";
import { IBooking } from "@/types/interfaces";
import constants from "@/constants";
import { Loader } from "@/components/Loader";
import { bookingsMock } from "@/mocks/bookings";
import {
  KanbanView,
  ListView,
  TableView,
} from "@/app/profissional/bookings/views";

export default function Apoitments() {
  const [bookings, setBookings] = useState<IBooking[]>(bookingsMock);

  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

  const views: Record<ViewMode, ReactNode> = {
    kanban: <KanbanView bookings={bookings} />,
    table: <TableView bookings={bookings} />,
    list: <ListView bookings={bookings} />,
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-end gap-1">
          <span className="bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white h-10 w-10 flex justify-center items-center font-bold shadow rounded-sm">
            <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
              A
            </h1>
          </span>

          <h1 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">
            gendamentos
          </h1>
        </div>
        <div>
          <Button>
            <AlertCircle />
            Pendencias <span>1</span>
          </Button>
        </div>
      </header>
      <aside className="flex md:flex-row flex-col md:justify-between gap-4 items-center">
        <div className="md:w-auto w-full">
          <Button
            variant={viewMode === "kanban" ? "secondary" : "ghost"}
            onClick={() => setViewMode("kanban")}
          >
            Kanban <LayoutGrid size={100} />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
          >
            Lista <List size={100} />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            onClick={() => setViewMode("table")}
          >
            Tabela <Table size={100} />
          </Button>
        </div>

        <form className="flex gap-2 items-center w-full md:w-[20%]">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search size={100} />
            </InputGroupAddon>
          </InputGroup>

          <Select>
            <SelectTrigger className="bg-black text-white ">
              <SelectValue
                placeholder="Filtrar"
                className="text-white placeholder:text-white "
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">
                <Loader2 size={100} className="animate-spin" />
                Pendentes
              </SelectItem>
              <SelectItem value="completed">
                <CheckCheck size={100} />
                Concluídos
              </SelectItem>
              <SelectItem value="canceled">
                <AlertCircle size={100} />
                Cancelados
              </SelectItem>
            </SelectContent>
          </Select>
        </form>
      </aside>
      <Separator />
      {isLoading ? <Loader /> : <article>{views[viewMode]}</article>}
    </section>
  );
}
