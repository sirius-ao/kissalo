"use client";

import DashBoardProfissional from "@/components/Charts/dashchart";
import { IStats, StarsCard } from "@/components/StatsCard";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IBooking } from "@/types/interfaces";
import { bookingsMock } from "@/mocks/bookings";
import { BookingPriority, BookingStatus, PaymentStatus } from "@/types/enum";
import { format } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import {
  CheckCheck,
  LineChart,
  Loader2,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { IconProgress } from "@tabler/icons-react";

export const getStatusBadgeClass = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/10 text-amber-500 border-amber-500/50 rounded-sm";
    case "CONFIRMED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/50 rounded-sm";
    case "STARTED":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/50 rounded-sm";
    case "COMPLETED":
      return "bg-green-500/10 text-green-500 border-green-500/50 rounded-sm";
    case "CANCELED":
      return "bg-red-500/10 text-red-500 border-red-500/50 rounded-sm";
    case "ACCEPTED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/50 rounded-sm";
    case "REJECTED":
      return "bg-red-500/10 text-red-500 border-red-500/50 rounded-sm";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/50 rounded-sm";
  }
};
export const getStatusIcon = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return <Loader2 className="animate-spin" />;
    case "STARTED":
      return <IconProgress />;
    case "COMPLETED":
      return <CheckCheck />;
    case "CANCELED":
      return <ShieldAlert />;
    case "ACCEPTED":
      return <CheckCheck />;
    case "REJECTED":
      return <ShieldAlert />;
    default:
      return <CheckCheck />;
  }
};
export const getPriorityIcon = (status: BookingPriority) => {
  switch (status) {
    case "HIGH":
      return <TrendingUp />;
    case "LOW":
      return <TrendingDown />;
    default:
      return <LineChart />;
  }
};
export const getPriorityIconText = (status: BookingPriority) => {
  switch (status) {
    case "HIGH":
      return "Alta";
    case "LOW":
      return "Baixa";
    default:
      return "Média";
  }
};
export const priorityColorMap: Record<BookingPriority, string> = {
  HIGH: "red",
  MEDIUM: "amber",
  LOW: "blue",
};

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search } from "lucide-react";

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

import { Loader } from "@/components/Loader";
import { UnJoinedServiceCard } from "@/components/Service";

import constants from "@/constants";

import { CategoriesService } from "@/services/Categories/index.service";
import { ServicesService } from "@/services/Services/index.service";

import { UserRole } from "@/types/enum";
import { ICategory, IServiceTemplate } from "@/types/interfaces";

export default function ServiceProfissionalPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allServices, setAllServices] = useState<IServiceTemplate[]>([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;

        const categoriesApi = new CategoriesService(token);
        const servicesApi = new ServicesService(token);

        const [cats, servs] = await Promise.all([
          categoriesApi.get(),
          servicesApi.get(),
        ]);

        if (cats?.logout || servs?.logout) {
          toast.error("Sessão expirada");
          return;
        }

        setCategories(cats?.data ?? []);
        setAllServices(servs?.data ?? []);
      } catch {
        toast.error("Erro ao carregar serviços");
      } finally {
        setTimeout(() => setIsLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    loadData();
  }, [router]);

  /* ---------------- FILTRO ---------------- */
  const filteredServices = useMemo(() => {
    let result = [...allServices];

    if (categoryFilter !== "all") {
      result = result.filter(
        (service) => service.categoryId === categoryFilter
      );
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [allServices, categoryFilter, search]);

  /* ---------------- RENDER ---------------- */
  if (isLoading) return <Loader />;

  return (
    <section className="flex flex-col gap-10">
      {/* FILTROS */}
      <form className="w-full lg:w-[35%]">
        <InputGroup>
          <InputGroupInput
            placeholder="Buscar por serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>

          <InputGroupAddon align="inline-end">
            <Select
              value={String(categoryFilter)}
              onValueChange={(value) =>
                setCategoryFilter(value === "all" ? "all" : Number(value))
              }
            >
              <SelectTrigger className="border-none shadow-none">
                <SelectValue placeholder="Categorias" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    <div className="flex flex-col">
                      <span>{cat.title}</span>
                      <small className="text-xs text-muted-foreground">
                        {cat.services?.length ?? 0} serviços
                      </small>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputGroupAddon>
        </InputGroup>
      </form>

      {/* LISTAGEM */}
      {verifyArrayDisponiblity(filteredServices) ? (
        <article className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <UnJoinedServiceCard
              key={service.id}
              service={service}
              role={UserRole.PROFESSIONAL}
            />
          ))}
        </article>
      ) : (
        <div className="text-center mt-20 text-muted-foreground">
          <h2 className="text-lg font-medium">Nenhum serviço encontrado</h2>
          <p className="text-sm">Tente mudar os filtros ou a busca</p>
        </div>
      )}
    </section>
  );
}
