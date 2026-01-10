"use client";

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
import { verifyArrayDisponiblity } from "@/lib/utils";
import { categoriesMock } from "@/mocks/categories";
import { servicesMock } from "@/mocks/services";
import { FloatingDock } from "@/components/ui/floating-dock";
import { CheckCheck, Search, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import constants from "@/constants";
import { Loader } from "@/components/Loader";
import { UnJoinedServiceCard } from "@/components/Service";
import { UserRole } from "@/types/enum";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ServiceProfissionalPage() {
  const [categoryFilter, setCategoryFilter] = useState<undefined | number>(
    undefined
  );
  const [services, setServices] = useState(servicesMock);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState(categoriesMock);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCategories(categoriesMock);
    setServices(servicesMock);

    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      const filtred = verifyArrayDisponiblity(categories)
        ? services.filter((item) => {
            return item.categoryId == categoryFilter;
          })
        : [];

      if (filtred.length == 0) {
        toast.info("Busca não encontrada");
        setServices(servicesMock);
        return;
      }
      setServices(filtred);
    }
  }, [categoryFilter]);

  if (!mounted) return null;

  return (
    <section>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <span className="flex flex-col  justify-between gap-10 pt-4">
            <form action="" className="lg:w-[30%] w-full">
              <InputGroup>
                <InputGroupInput placeholder="Buscar por serviços ..." />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Select
                    onValueChange={(e) => {
                      setSearch(e);
                      setCategoryFilter(+e);
                    }}
                  >
                    <SelectTrigger className="border-none shadow-none outline-none">
                      {search ? <SelectValue></SelectValue> : "Categorias"}
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={"all"}>Todos</SelectItem>
                      {verifyArrayDisponiblity(categories) &&
                        categories.map((item, idx) => (
                          <SelectItem value={item.id?.toString()} key={idx}>
                            <p>{item.title}</p>
                            <small className="text-[9px]">
                              ({item.services.length}) serviços
                            </small>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </span>

          {verifyArrayDisponiblity(services) ? (
            <article className="flex flex-col gap-4 mt-10">
              <aside className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                {services.map((item, idx) => (
                  <UnJoinedServiceCard
                    role={UserRole.CUSTOMER}
                    service={item}
                    key={idx}
                  />
                ))}
              </aside>
            </article>
          ) : (
            <span className="text-center flex flex-col gap-4 mt-50">
              <h1>Serviços ainda não foram criados</h1>
            </span>
          )}
        </>
      )}
    </section>
  );
}
