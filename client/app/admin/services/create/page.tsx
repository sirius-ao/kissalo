"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";

import { ICategory, IImage, IServiceCreate } from "@/types/interfaces";
import { CategoriesService } from "@/services/Categories/index.service";
import constants from "@/constants";
import { generateKeywords, verifyArrayDisponiblity } from "@/lib/utils";
import { servicesMock } from "@/mocks/services";

import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import {
  Check,
  List,
  Plus,
  Trash,
  ArrowLeft,
  ArrowRight,
  Box,
  Loader2,
} from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { LLmsService } from "@/services/Ia/index.service";
import { ServicesService } from "@/services/Services/index.service";

export default function CreateService() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadImages, setLoadImages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(
    {} as any
  );
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [requiments, setRequirements] = useState("");
  const [requimentsList, setRequirementsList] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [images, setImages] = useState<IImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const steps = [
    { title: "Dados", description: "Dados do serviço" },
    { title: "Imagem", description: "Geração de imagem" },
  ];

  // Busca categorias
  useEffect(() => {
    async function fetchCategories() {
      try {
        const service = new CategoriesService(
          localStorage.getItem("acess-x-token") as string
        );
        const data = await service.get();

        if (data?.logout) {
          toast.error("Sessão expirada");
          return;
        }

        setCategories(data?.data ?? []);
      } catch (err) {
        toast.error("Erro ao carregar categorias");
      } finally {
        setTimeout(() => setLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    fetchCategories();
  }, [router]);

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!selectedCategory) {
        toast.error("Escolhe uma categoria");
        return false;
      }
      if (!title) {
        toast.error("Preenche o título");
        return false;
      }
      if (!subtitle) {
        toast.error("Preenche o subtítulo");
        return false;
      }
      if (!price) {
        toast.error("Preenche o preço");
        return false;
      }
      if (!duration) {
        toast.error("Preenche a duração");
        return false;
      }
      if (!description) {
        toast.error("Preenche a descrição");
        return false;
      }
      if (requimentsList.length === 0) {
        toast.error("Adicione pelo menos 1 requisito!");
        return;
      }
    }
    if (currentStep === 1) {
      if (!selectedImages.length) {
        toast.error("Seleciona pelo menos uma imagem");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;
    const payload: IServiceCreate = {
      bannerUrl: selectedImages[0],
      gallery: selectedImages.slice(1),
      categoryId: +selectedCategory.id,
      deliverables: result,
      description: description,
      shortDescription: subtitle,
      duration: +duration,
      price: +price,
      requirements: requimentsList,
      slug: title + description + subtitle,
      title,
      keywords: generateKeywords([title, description, subtitle]),
    };
    setIsProcessing(true);
    const service = new ServicesService(
      localStorage.getItem("acess-x-token") as string
    );
    const data = await service.create(payload);
    console.log(data);
    if (data?.logout) {
      toast.error("Sessão expirada");
      return;
    }
    if (data?.data?.id) {
      toast.success("Serviço criada");
    } else {
      toast.success(data?.message ?? "Erro ao criar serviço");
    }

    setIsProcessing(false);
  };

  return (
    <section className="flex flex-col gap-4 lg:justify-center items-center">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Steps */}
          <div className="flex w-full lg:w-[50%] justify-between px-4 gap-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={clsx(
                  "flex flex-col md:justify-start md:items-start items-center justify-center opacity-40",
                  { "opacity-100": idx === currentStep }
                )}
              >
                <span
                  className={clsx(
                    "bg-gray-400 transition-all text-white rounded-full md:w-8 md:h-8 h-6 w-6 text-sm justify-center items-center flex font-bold",
                    { "bg-orange-500": idx === currentStep }
                  )}
                >
                  {idx + 1}
                </span>
                <h1 className="md:font-medium text-sm">{step.title}</h1>
                <small className="text-gray-500 md:flex hidden">
                  {step.description}
                </small>
              </div>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full lg:w-[50%] flex-col gap-4 p-4"
          >
            {/* Step 0 */}
            {currentStep === 0 && (
              <>
                <Label>Categoria *</Label>
                <Select
                  required
                  onValueChange={(v) => {
                    const item = categories.find((c) => {
                      return c.id == Number(v);
                    });
                    if (!item) {
                      return;
                    }
                    setSelectedCategory(item);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {verifyArrayDisponiblity(categories) &&
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Label>Título *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Título"
                />
                <Label>Subtítulo *</Label>
                <Input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  required
                  placeholder="Subtítulo"
                />
                <Label>Preço *</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="Preço"
                />
                <Label>Duração (minutos) *</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  placeholder="Duração"
                />
                <Label>Descrição *</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Descrição"
                />
                <Label>Resultado</Label>
                <Textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  required
                  placeholder="Resultado"
                />
                <Label>Requisitos</Label>
                <InputGroup>
                  <InputGroupInput
                    value={requiments}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Adicionar requisito"
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        e.preventDefault();
                        if (!requiments) {
                          toast.info("Preenche o requisito");
                          return;
                        }
                        if (requimentsList.includes(requiments)) {
                          toast.info("Requisito existente");
                          return;
                        }
                        setRequirementsList((prev) => [...prev, requiments]);
                        setRequirements("");
                      }
                    }}
                  />
                  <InputGroupAddon>
                    <List />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => {
                        if (!requiments) {
                          toast.info("Preenche o requisito");
                          return;
                        }
                        if (requimentsList.includes(requiments)) {
                          toast.info("Requisito existente");
                          return;
                        }
                        setRequirementsList((prev) => [...prev, requiments]);
                        setRequirements("");
                      }}
                    >
                      <Plus />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>{" "}
                <span className="flex gap-1 flex-wrap">
                  {requimentsList.map((req, idx) => (
                    <div
                      key={idx}
                      className=" flex items-center gap-2 border p-2 justify-between rounded-sm w-full"
                    >
                      <div className="text-sm flex items-center gap-1">
                        <Check size={16} /> {req}
                      </div>
                      <Button
                        onClick={() =>
                          setRequirementsList(
                            requimentsList.filter((r) => r !== req)
                          )
                        }
                        size={"icon"}
                        variant={"outline"}
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  ))}
                </span>
              </>
            )}

            {/* Step 1 */}
            {currentStep === 1 && (
              <>
                {loadImages ? (
                  <Loader />
                ) : verifyArrayDisponiblity(images) ? (
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img, idx) => {
                      if (idx > 5) return null;
                      return (
                        <img
                          key={idx}
                          src={img.largeImageURL}
                          className={clsx(
                            "h-70 w-full border rounded-sm cursor-pointer",
                            {
                              "border-2 border-green-500":
                                selectedImages.includes(img.largeImageURL),
                            }
                          )}
                          onClick={() => {
                            if (selectedImages.includes(img.largeImageURL)) {
                              setSelectedImages(
                                selectedImages.filter(
                                  (i) => i !== img.largeImageURL
                                )
                              );
                            } else {
                              setSelectedImages((prev) => [
                                ...prev,
                                img.largeImageURL,
                              ]);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Box />
                      </EmptyMedia>
                      <EmptyTitle>Imagem não encontrada</EmptyTitle>
                      <EmptyDescription>
                        Não há imagens disponíveis
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </>
            )}

            {/* Ações */}
            <div className="flex md:flex-row flex-col gap-3 mt-4">
              <div className="grid grid-cols-2 md:w-auto w-full gap-2">
                <Button
                  disabled={currentStep === 0}
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  <ArrowLeft size={16} /> Anterior
                </Button>

                <Button
                  disabled={currentStep >= steps.length - 1}
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    if (validateCurrentStep()) {
                      setCurrentStep((prev) => prev + 1);
                      setLoadImages(true);
                      const imagesService = new LLmsService(
                        localStorage.getItem("acess-x-token") as string
                      );
                      const data = await Promise.all([
                        imagesService.getImages(selectedCategory?.title),
                      ]);

                      for (const item of data) {
                        if (item?.logout) {
                          toast.error("Sessão expirada");
                          return;
                        }
                      }
                      const imagesGet: IImage[][] = data.map(
                        (item) => item?.data?.Images || []
                      );
                      const allImages: IImage[] = imagesGet.flat();
                      console.log(allImages);
                      setImages(allImages);
                      setTimeout(
                        () => setLoadImages(false),
                        constants.TIMEOUT.LOADER
                      );
                    }
                  }}
                >
                  Próximo <ArrowRight size={16} />
                </Button>
              </div>

              <Button
                disabled={isProcessing || currentStep < 1}
                className="flex-1"
                type="submit"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {currentStep < steps.length - 1 ? "Continuar" : "Finalizar"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
