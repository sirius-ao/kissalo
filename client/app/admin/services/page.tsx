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
import { verifyArrayDisponiblity } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  Files,
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
import { ICategory, IServiceTemplate } from "@/types/interfaces";
import { servicesMock } from "@/mocks/services";
import { categoriesMock } from "@/mocks/categories";
import { TableViewServices } from "./_tabs/services";
import { TableViewCategories } from "./_tabs/categories";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function ServicesPage() {
  const [stats, setStats] = useState<IStats[]>([
    {
      isCoin: false,
      label: "serviços criados",
      oldValue: 30,
      title: "Total serviços",
      value: 100,
    },
    {
      isCoin: false,
      label: "serviços sem profissionais anexados",
      oldValue: 1000,
      title: "Serviços anémicos",
      value: 567100,
    },
    {
      isCoin: false,
      label: "total categoria de serviços",
      oldValue: 1,
      title: "Categorias de serviços",
      value: 10,
    },
  ]);
  const [currentTab, setCurrentTab] = useState(0);
  const [services, setServices] = useState<IServiceTemplate[]>([
    ...servicesMock,
  ]);
  const [categories, setCategories] = useState<ICategory[]>([
    ...categoriesMock,
  ]);

  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

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
            defaultValue="services"
            className="flex  mt-5 gap-6 overflow-visible"
          >
            <TabsList className="flex lg:flex-row flex-col-reverse justify-between w-full gap-3 h-auto   bg-transparent">
              <div className=" flex gap-3 lg:w-[20%] w-full">
                <TabsTrigger
                  onClick={() => {
                    setCurrentTab(0);
                  }}
                  value="services"
                  className="justify-start gap-2"
                >
                  <Paintbrush size={16} />
                  Serviços
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    setCurrentTab(1);
                  }}
                  value="categories"
                  className="justify-start gap-2 "
                >
                  <Files size={16} /> Categorias
                </TabsTrigger>
              </div>
              <form
                action=""
                className="flex  justify-end lg:w-[30%] w-full  gap-3"
              >
                <InputGroup className="w-full">
                  <InputGroupInput placeholder="Buscar por serviços ..." />
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
                ) : (
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

                      <form action="" className="flex flex-col gap-2">
                        <Label>Título</Label>
                        <Input required placeholder="título da categoria" />
                        <Input
                          type="color"
                          className="w-20"
                          required
                          placeholder=""
                        />
                        <Label>Descrição</Label>
                        <Textarea
                          placeholder="descrição da categoria"
                          className="resize-none h-30"
                          required
                        />
                        <Button onClick={() => {}}>Criar categoria</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </form>
            </TabsList>

            <div className="flex-1 lg:pt-10  ">
              <TabsContent value="services">
                <TableViewServices services={services} />{" "}
                {verifyArrayDisponiblity(services) && (
                  <span className="flex  mt-5 justify-between items-center gap-3">
                    <div>1 de 10</div>
                    <span className="flex  gap-2">
                      <Button variant={"outline"}>
                        <ArrowLeft />
                      </Button>
                      <Button variant={"outline"}>
                        <ArrowRight />
                      </Button>
                    </span>
                  </span>
                )}
              </TabsContent>
              <TabsContent value="categories">
                <TableViewCategories categories={categories} />{" "}
                {verifyArrayDisponiblity(categories) && (
                  <span className="flex mt-5 justify-between items-center gap-3">
                    <div>1 de 10</div>
                    <span className="flex  gap-2">
                      <Button variant={"outline"}>
                        <ArrowLeft />
                      </Button>
                      <Button variant={"outline"}>
                        <ArrowRight />
                      </Button>
                    </span>
                  </span>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </section>
  );
}
