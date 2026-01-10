"use client";

import { Button } from "@/components/ui/button";
import constants from "@/constants";
import { categoriesMock } from "@/mocks/categories";
import { ICategory } from "@/types/interfaces";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  List,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { servicesMock } from "@/mocks/services";
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
  EmptyMedia,
  EmptyHeader,
} from "@/components/ui/empty";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function CreateService() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setIsLoading] = useState(true);
  const [loadImages, setLoadImages] = useState(false);
  const [images, setImages] = useState<string[]>([
    ...servicesMock.map((item) => {
      return item.bannerUrl as string;
    }),
  ]);
  const [selectImages, setSelectedImages] = useState<string[]>([]);
  const [requimentsList, setRequirementsList] = useState<string[]>([]);
  const [requiments, setRequirements] = useState<string>("");
  const [resultList, setResultList] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");

  const [categories, setCategories] = useState<ICategory[]>([
    ...categoriesMock,
  ]);

  const [] = useState();
  const steps = [
    {
      title: "Dados",
      description: "Dados do serviço",
    },
    {
      title: "Imagem",
      description: "Geração de imagem",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        return true;

      case 1:
        return true;

      default:
        return true;
    }
  };
  return (
    <section className="flex flex-col gap-4 lg:justify-center items-center">
      {loading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <div className="flex w-full lg:w-[50%] justify-between px-4 gap-4">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className={clsx(
                  "flex flex-col md:justify-start md:items-start items-center justify-center opacity-40",
                  {
                    "opacity-100": idx === currentStep,
                  }
                )}
              >
                <span
                  className={clsx(
                    "bg-gray-400 transition-all text-white rounded-full md:w-8 md:h-8 h-6 w-6 text-sm justify-center items-center flex font-bold",
                    {
                      "bg-orange-500": idx === currentStep,
                    }
                  )}
                >
                  {idx + 1}
                </span>
                <h1 className="md:font-medium text-sm">{item.title}</h1>
                <small className="text-gray-500 md:flex hidden">
                  {item.description}
                </small>
              </div>
            ))}
          </div>
          <form action="" className="flex w-full lg:w-[50%] flex-col gap-4 p-4">
            {currentStep == 0 && (
              <>
                <Label htmlFor="priority">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {verifyArrayDisponiblity(categories) &&
                      categories.map((item, idx) => (
                        <SelectItem key={idx} value={String(item.id)}>
                          {item.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Label htmlFor="title">
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="título do serviço"
                />
                <Label htmlFor="shorttitle">
                  Subtitulo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shorttitle"
                  name="shorttitle"
                  required
                  placeholder="sub-título do serviço"
                />
                <Label htmlFor="price">
                  Preço <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="preço do serviço"
                  required
                />
                <Label htmlFor="requiments">Requisitos</Label>
                <InputGroup className="w-full">
                  <InputGroupInput
                    id="requiments"
                    name="requiments"
                    placeholder="lista de requisitos"
                    value={requiments}
                    onChange={(e) => {
                      setRequirements(e.target.value);
                    }}
                  />
                  <InputGroupAddon>
                    <List />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => {
                        if (requimentsList.length >= 10) {
                          toast.info("limite atingido de requisitos");
                          return;
                        }
                        if (!requiments) {
                          toast.info("Preenche o requisito");
                          return;
                        }
                        const exist = requimentsList.findIndex((item) => {
                          return item.toUpperCase() == requiments.toUpperCase();
                        });
                        if (exist >= 0) {
                          toast.info("Requisito existente");
                          return;
                        }
                        setRequirementsList((prev) => [...prev, requiments]);
                        setRequirements("");
                      }}
                      size={"sm"}
                    >
                      <Plus />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {verifyArrayDisponiblity(requimentsList) && (
                  <span className="flex flex-col gap-2">
                    {requimentsList.map((item, idx) => (
                      <div
                        className="border  transition-all hover:bg-neutral-100 rounded-md p-2 flex justify-between items-center"
                        key={idx}
                      >
                        <span className="flex text-sm  items-center gap-2">
                          <Check size={14} />
                          {item}
                        </span>
                        <Badge
                          className="rounded-sm h-6 text-red-500 border-red-500/50 cursor-pointer"
                          variant={"outline"}
                          onClick={() => {
                            setRequirementsList(
                              requimentsList.filter((req) => {
                                return req.toUpperCase() != item.toUpperCase();
                              })
                            );
                          }}
                        >
                          <Trash />
                        </Badge>
                      </div>
                    ))}
                  </span>
                )}
                <Label htmlFor="results">Resultados</Label>
                <InputGroup className="w-full">
                  <InputGroupInput
                    id="results"
                    name="results"
                    placeholder="lista de possíveis resultados"
                    value={result}
                    onChange={(e) => {
                      setResult(e.target.value);
                    }}
                  />
                  <InputGroupAddon>
                    <List />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => {
                        if (resultList.length >= 10) {
                          toast.info("limite atingido de resultados");
                          return;
                        }
                        if (!result) {
                          toast.info("Preenche o resultado");
                          return;
                        }
                        const exist = resultList.findIndex((item) => {
                          return item.toUpperCase() == result.toUpperCase();
                        });
                        if (exist >= 0) {
                          toast.info("Resultado existente");
                          return;
                        }
                        setResultList((prev) => [...prev, result]);
                        setResult("");
                      }}
                      size={"sm"}
                    >
                      <Plus />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {verifyArrayDisponiblity(resultList) && (
                  <span className="flex flex-col gap-2">
                    {resultList.map((item, idx) => (
                      <div
                        className="border  transition-all hover:bg-neutral-100 rounded-md p-2 flex justify-between items-center"
                        key={idx}
                      >
                        <span className="flex text-sm  items-center gap-2">
                          <Check size={14} />
                          {item}
                        </span>
                        <Badge
                          className="rounded-sm h-6 text-red-500 border-red-500/50 cursor-pointer"
                          variant={"outline"}
                          onClick={() => {
                            setResultList(
                              resultList.filter((req) => {
                                return req.toUpperCase() != item.toUpperCase();
                              })
                            );
                          }}
                        >
                          <Trash />
                        </Badge>
                      </div>
                    ))}
                  </span>
                )}
                <Label htmlFor="min">
                  Duração em minutos <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="min"
                  type="number"
                  name="min"
                  placeholder="Duração em minutos"
                />
              </>
            )}
            {currentStep == 1 && (
              <>
                {loadImages ? (
                  <Loader />
                ) : (
                  <span className="flex flex-col gap-3">
                    {verifyArrayDisponiblity(images) ? (
                      <>
                        <Label htmlFor="images">
                          Seleciona uma ou mais imagens
                          <span className="text-red-500">*</span>
                        </Label>
                        <span className="grid grid-cols-2 gap-3">
                          {images.map((item, idx) => (
                            <img
                              onClick={() => {
                                const existInList = selectImages.findIndex(
                                  (image) => {
                                    return image == item;
                                  }
                                );

                                if (existInList >= 0) {
                                  const newData = selectImages.filter(
                                    (image) => {
                                      return image != item;
                                    }
                                  );
                                  setSelectedImages(newData);
                                  return;
                                }

                                if (selectImages.length >= 3) {
                                  toast.info("Limite atingido");
                                  return;
                                }
                                setSelectedImages((prev) => [...prev, item]);
                              }}
                              src={item}
                              className={clsx(
                                "h-40 bg-gray-100 animate-pulse rounded-sm",
                                {
                                  "border-2 border-green-500":
                                    selectImages.findIndex((image) => {
                                      return image == item;
                                    }) >= 0,
                                }
                              )}
                              key={idx}
                            />
                          ))}
                        </span>
                      </>
                    ) : (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Box />
                          </EmptyMedia>
                          <EmptyTitle>Imagem não econtrada</EmptyTitle>
                          <EmptyDescription>
                            Imagem não encontrada para o título deste serviço
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    )}
                  </span>
                )}
              </>
            )}

            <div className="flex md:flex-row flex-col gap-3 mt-4">
              <div className="grid grid-cols-2 md:w-auto w-full gap-2">
                <Button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  type="button"
                  variant="outline"
                >
                  <ArrowLeft size={16} /> Anterior
                </Button>
                <Button
                  disabled={currentStep >= steps.length - 1}
                  type="button"
                  onClick={() => {
                    if (validateCurrentStep()) {
                      setLoadImages(true);
                      setCurrentStep((prev) => prev + 1);
                      setTimeout(() => {
                        setLoadImages(false);
                      }, constants.TIMEOUT.LOADER);
                    }
                  }}
                  variant="outline"
                >
                  Próximo <ArrowRight size={16} />
                </Button>
              </div>
              <Button
                className="flex-1"
                type={validateCurrentStep() ? "submit" : "button"}
              >
                {currentStep < steps.length - 1 ? "Continuar" : "Finalizar"}
              </Button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
