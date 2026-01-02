"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { categoriesMock } from "@/mocks/categories";
import { servicesMock } from "@/mocks/services";
import clsx from "clsx";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  CheckCheck,
  FolderSync,
  Grid,
  Loader2,
  Menu,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import constants from "@/constants";
import { Loader } from "@/components/Loader";
import { UnJoinedServiceCard } from "@/components/Service";
import { UserRole } from "@/types/enum";
import { useRouter, useSearchParams } from "next/navigation";

export default function ServiceProfissionalPage() {
  const query = useSearchParams();
  const tab = query.get("tab") || "disponivel";
  const [categoryFilter, setCategoryFilter] = useState<undefined | number>(
    undefined
  );
  const tabs = [
    {
      icon: <ShieldCheck />,
      title: "Anexados",
      value: "confirmated",
    },
    {
      icon: <FolderSync />,
      title: "Disponíveis",
      value: "disponible",
    },
  ];
  const [activeTab, setActiveTab] = useState(tab == "confirmado" ? 0 : 1);
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

      setServices(filtred);
      return;
    }
  }, [categoryFilter]);

  if (!mounted) return null;
  const getStatusIcon = (status: boolean) => {
    switch (status) {
      case true:
        return <CheckCheck />;
      case false:
        return <ShieldAlert />;
      default:
        return <ShieldAlert />;
    }
  };
  const filtredServices = [...services];

  return (
    <section>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <span className="flex justify-between gap-3 pt-4">
            <form action="" className="lg:w-[30%]">
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
            <div></div>
            <span className="flex">
              <Tabs defaultValue="confirmated" className="w-full">
                <TabsList className="w-full  bg-gray-100/1 border border-neutral-500/10">
                  {tabs.map((item, idx) => (
                    <TabsTrigger
                      onClick={() => {
                        setActiveTab(idx);
                        router.push(`/profissional/services?tab=${item.value}`);
                      }}
                      className={clsx("border-none transition-all", {
                        "bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white":
                          idx == activeTab,
                      })}
                      key={idx}
                      value={item.value}
                    >
                      {item.icon}
                      {item.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </span>
          </span>
          {verifyArrayDisponiblity(filtredServices) ? (
            <article className="flex flex-col gap-4 mt-10">
              {activeTab == 0 ? (
                <Card className="rounded-sm shadow-none">
                  <CardHeader className="flex flex-col">
                    <CardTitle>Tabela de serviços</CardTitle>
                    <CardDescription>
                      ({filtredServices.length}) serviços criados e gerenciados
                      pelo adiministrador
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Checkbox />
                          </TableHead>
                          <TableHead>Serviço</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Agendamentos</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Aceitação</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtredServices.map((service, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="flex gap-2 items-center">
                              <Checkbox />
                            </TableCell>
                            <TableCell>
                              <span className="flex flex-col gap-1">
                                <p>{service.title}</p>
                                <small>
                                  {service.description.slice(0, 30)} ...
                                </small>
                              </span>
                            </TableCell>
                            <TableCell>
                              <h1>
                                {Number(service.price).toLocaleString("pt")},00{" "}
                                {service.currency == "AOA"
                                  ? "kz"
                                  : service.currency}
                              </h1>
                            </TableCell>
                            <TableCell>
                              <span className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                      backgroundColor: `${service.category.color}`,
                                    }}
                                  ></div>
                                  <p>{service?.category.title}</p>
                                </div>
                                <small>
                                  {String(service?.category?.description).slice(
                                    0,
                                    30
                                  )}{" "}
                                  ...
                                </small>
                              </span>
                            </TableCell>
                            <TableCell className="flex gap-2 items-center">
                              {service.bookings.length}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={clsx("rounded-sm", {
                                  "text-green-500 bg-green-500/10 border-green-500":
                                    service.isActive,
                                  "text-amber-500 bg-amber-500/10 border-amber-500":
                                    !service.isActive,
                                })}
                                variant="outline"
                              >
                                {getStatusIcon(service.isActive)}
                                {service.isActive ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={clsx("rounded-sm", {
                                  "text-green-500 bg-green-500/10 border-green-500":
                                    service.requests.length > 0,
                                  "text-amber-500 bg-amber-500/10 border-amber-500":
                                    service.requests.length <= 0,
                                })}
                                variant="outline"
                              >
                                {getStatusIcon(service.requests.length > 0)}
                                {service.requests.length > 0
                                  ? "Aceite"
                                  : "Pendete"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <aside className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                  {services.map((item, idx) => (
                    <UnJoinedServiceCard
                      role={UserRole.PROFESSIONAL}
                      service={item}
                      key={idx}
                    />
                  ))}
                </aside>
              )}
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
