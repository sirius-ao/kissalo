"use client";

import { useEffect, useMemo, useState } from "react";
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

import { verifyArrayDisponiblity } from "@/lib/utils";
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
              role={UserRole.CUSTOMER}
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
