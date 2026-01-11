"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from "@/components/Loader";
import { IStats, StarsCard } from "@/components/StatsCard";
import constants from "@/constants";
import { includesText, verifyArrayDisponiblity } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Files,
  Loader2,
  Paintbrush,
  Plus,
  Search,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  ICategory,
  IProfessionalServiceRequest,
  IServiceTemplate,
} from "@/types/interfaces";
import { servicesMock } from "@/mocks/services";
import { categoriesMock } from "@/mocks/categories";
import { TableViewServices } from "./_tabs/services";
import { TableViewCategories } from "./_tabs/categories";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TableViewServiceRequests } from "./_tabs/service-requests";
import { serviceRequestsMock } from "@/mocks/service-requests";
import { CategoriesService } from "@/services/Categories/index.service";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FilterProvider } from "@/context/searchContext";
import { ServicesService } from "@/services/Services/index.service";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = (searchParams.get("tab") as TabKey) ?? "services";
  const router = useRouter();
  const TAB_KEYS = ["services", "categories", "requests"] as const;
  type TabKey = (typeof TAB_KEYS)[number];
  const [processing, setProcessing] = useState(false);
  const [newCategorie, setNewCategorie] = useState<ICategory>({} as any);
  const [stats, setStats] = useState<IStats[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(
    TAB_KEYS.indexOf(tabFromUrl)
  );

  const [services, setServices] = useState<IServiceTemplate[]>([]);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [serviceRequests, setServiceRequests] = useState<
    IProfessionalServiceRequest[]
  >([...serviceRequestsMock]);

  const [loading, setIsLoading] = useState(true);
  useEffect(() => {
    async function get() {
      const [categoriService, servicesService] = [
        new CategoriesService(localStorage.getItem("acess-x-token") as string),
        new ServicesService(localStorage.getItem("acess-x-token") as string),
      ];
      const [categoriesList, serviceList] = await Promise.all([
        categoriService.get(),
        servicesService.get(),
      ]);
      if (categoriesList?.logout || serviceList?.logout) {
        router.push("/auth/login");
        toast.error("Sessão expirada");
        return;
      }
      setCategories(categoriesList?.data ?? []);
      setServices(serviceList?.data ?? []);
      setStats([
        {
          isCoin: false,
          label: "total de serviços",
          oldValue: Array.isArray(serviceList?.data)
            ? serviceList?.data?.length
            : 0,
          title: "Total serviços",
          value: Array.isArray(serviceList?.data)
            ? serviceList?.data?.length
            : 0,
        },
        {
          isCoin: false,
          label: "total de categorias",
          oldValue: Array.isArray(categoriesList?.data)
            ? categoriesList?.data?.length
            : 0,
          title: "Total categorias",
          value: Array.isArray(categoriesList?.data)
            ? categoriesList?.data?.length
            : 0,
        },
      ]);
      setTimeout(() => {
        setIsLoading(false);
      }, constants.TIMEOUT.LOADER);
    }

    get();
  }, []);

  useEffect(() => {
    const index = TAB_KEYS.indexOf(tabFromUrl);
    if (index !== -1) {
      setCurrentTab(index);
    }
  }, [tabFromUrl]);

  function changeTab(tab: TabKey) {
    router.push(`?tab=${tab}`);
  }

  useEffect(() => {
    setSearch("");
  }, [currentTab]);

  return (
    <section>
      {loading ? (
        <Loader />
      ) : (
        <>
          <span className="lg:grid-cols-3 grid md:grid-cols-2 gap-4">
            {verifyArrayDisponiblity(stats) &&
              stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
          </span>
          <Tabs
            value={TAB_KEYS[currentTab]}
            className="flex  mt-5 gap-6 overflow-visible"
          >
            <TabsList className="flex lg:flex-row flex-col-reverse justify-between w-full gap-3 h-auto   bg-transparent">
              <div className=" flex gap-3 lg:w-[20%] w-full">
                <TabsTrigger
                  onClick={() => {
                    changeTab("services");
                  }}
                  value="services"
                  className="justify-start gap-2"
                >
                  <Paintbrush size={16} />
                  Serviços
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    changeTab("categories");
                  }}
                  value="categories"
                  className="justify-start gap-2 "
                >
                  <Files size={16} /> Categorias
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => changeTab("requests")}
                  value="requests"
                  className="justify-start gap-2 "
                >
                  <ClipboardList size={16} />
                  Solicitações
                </TabsTrigger>
              </div>
              <form
                action=""
                className="flex  justify-end lg:w-[30%] w-full  gap-3"
              >
                <InputGroup className="w-full">
                  <InputGroupInput
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end"></InputGroupAddon>
                </InputGroup>

                {currentTab == 0 ? (
                  <Button type="button" asChild>
                    <Link href={"/admin/services/create"}>
                      <Plus /> Novo
                    </Link>
                  </Button>
                ) : currentTab == 1 ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button">
                        <Plus /> Novo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Criação de categoria</DialogTitle>
                      <DialogDescription>
                        Crie categorias e anexe serviços a elas
                      </DialogDescription>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setProcessing(true);
                          const categorieServices = new CategoriesService(
                            localStorage.getItem("acess-x-token") as string
                          );
                          const data = await categorieServices.create({
                            color: newCategorie.color as string,
                            title: newCategorie.title,
                            description: newCategorie.description as string,
                            order: categories?.length + 1,
                          });
                          if (data?.logout) {
                            router.push("/auth/login");
                            toast.error("Sessão expirada");
                            return;
                          }
                          toast.info(
                            data?.message ?? "Categoria criada com sucesso"
                          );
                          if (data?.data?.id) {
                            console.log(data);
                            setCategories((prev) => [
                              ...prev,
                              {
                                ...(data?.data as ICategory),
                                services: [],
                              },
                            ]);
                          }
                          setProcessing(false);
                        }}
                        className="flex flex-col gap-2"
                      >
                        <Label>Título</Label>
                        <Input
                          required
                          defaultValue={newCategorie?.title}
                          placeholder="título da categoria"
                          onChange={(e) => {
                            setNewCategorie((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }));
                          }}
                        />
                        <Label>Cor</Label>
                        <Input
                          type="color"
                          className="w-20"
                          required
                          defaultValue={newCategorie?.color}
                          placeholder=""
                          onChange={(e) => {
                            setNewCategorie((prev) => ({
                              ...prev,
                              color: e.target.value,
                            }));
                          }}
                        />
                        <Label>Descrição</Label>
                        <Textarea
                          placeholder="descrição da categoria"
                          className="resize-none h-30"
                          required
                          onChange={(e) => {
                            setNewCategorie((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }));
                          }}
                          defaultValue={newCategorie?.description}
                        />
                        <Button disabled={processing} onClick={() => {}}>
                          {processing ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Criar categoria"
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : null}
              </form>
            </TabsList>

            <div className="flex-1 lg:pt-10  ">
              <TabsContent value="services">
                <FilterProvider
                  data={services}
                  search={search}
                  filter={(service, search) =>
                    includesText(service.title, search) ||
                    includesText(service.description, search) ||
                    includesText(service.category?.title, search)
                  }
                >
                  {(filteredServices) => (
                    <TableViewServices
                      services={filteredServices}
                      onRemove={(id) =>
                        setServices((prev) => prev.filter((c) => c.id !== id))
                      }
                      onUpdate={(updated) =>
                        setServices((prev) =>
                          prev.map((c) => (c.id === updated.id ? updated : c))
                        )
                      }
                    />
                  )}
                </FilterProvider>
              </TabsContent>

              <TabsContent value="categories">
                <FilterProvider
                  data={categories}
                  search={search}
                  filter={(category, search) =>
                    includesText(category.title, search) ||
                    includesText(category.description, search)
                  }
                >
                  {(filteredCategories) => (
                    <TableViewCategories
                      onRemove={(id) =>
                        setCategories((prev) => prev.filter((c) => c.id !== id))
                      }
                      onUpdate={(updated) =>
                        setCategories((prev) =>
                          prev.map((c) => (c.id === updated.id ? updated : c))
                        )
                      }
                      categories={filteredCategories}
                    />
                  )}
                </FilterProvider>
              </TabsContent>
              <TabsContent value="requests">
                <FilterProvider
                  data={serviceRequests}
                  search={search}
                  filter={(request, search) =>
                    includesText(request.service?.title, search) ||
                    includesText(request.professional?.user?.email, search) ||
                    includesText(request.professional?.user?.firstName, search)
                  }
                >
                  {(filteredRequests) => (
                    <TableViewServiceRequests requests={filteredRequests} />
                  )}
                </FilterProvider>
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </section>
  );
}
