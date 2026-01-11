"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";

import { ICategory, IServiceCreate } from "@/types/interfaces";

import { CategoriesService } from "@/services/Categories/index.service";
import { ServicesService } from "@/services/Services/index.service";

import constants from "@/constants";
import { generateKeywords } from "@/lib/utils";

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

import { ArrowLeft, Check, List, Loader2, Plus, Trash } from "lucide-react";

export default function CreateService() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceExists, setServiceExists] = useState(true);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");

  const [requiments, setRequirements] = useState("");
  const [requirementsList, setRequirementsList] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;
        const categoriesApi = new CategoriesService(token);
        const servicesApi = new ServicesService(token);

        const [cats, srv] = await Promise.all([
          categoriesApi.get(),
          servicesApi.getById(Number(id)),
        ]);

        if (cats?.logout || srv?.logout) {
          router.push("/auth/login");
          toast.error("Sessão expirada");
          return;
        }

        setCategories(cats?.data ?? []);

        if (!srv?.id) {
          setServiceExists(false);
          return;
        }

        setTitle(srv.title ?? "");
        setSubtitle(srv.shortDescription ?? "");
        setDescription(srv.description ?? "");
        setResult(srv.deliverables ?? "");
        setPrice(String(srv.price ?? ""));
        setDuration(String(srv.duration ?? ""));
        setRequirementsList(srv.requirements ?? []);
        setSelectedImages([srv.bannerUrl, ...(srv.gallery ?? [])]);

        const cat = cats.data.find((c: ICategory) => c.id === srv.categoryId);

        setSelectedCategory(cat ?? cats.data[0] ?? null);
      } catch {
        toast.error("Erro ao carregar dados");
      } finally {
        setTimeout(() => setLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    loadData();
  }, [id, router]);

  /* ---------------- VALIDATION ---------------- */
  const validateStep = () => {
    if (!selectedCategory) return toast.error("Selecione uma categoria"), false;
    if (!selectedImages.length)
      return toast.error("Selecione ao menos uma imagem"), false;
    if (!title) return toast.error("Título obrigatório"), false;
    if (!subtitle) return toast.error("Subtítulo obrigatório"), false;
    if (!price) return toast.error("Preço obrigatório"), false;
    if (!duration) return toast.error("Duração obrigatória"), false;
    if (!description) return toast.error("Descrição obrigatória"), false;
    if (!requirementsList.length)
      return toast.error("Adicione ao menos 1 requisito"), false;

    return true;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep() || !selectedCategory) return;
    setIsProcessing(true);
    const payload: IServiceCreate = {
      title,
      shortDescription: subtitle,
      description,
      deliverables: result,
      categoryId: selectedCategory.id,
      price: Number(price),
      duration: Number(duration),
      requirements: requirementsList,
      bannerUrl: selectedImages[0],
      gallery: selectedImages.slice(1),
      slug: title,
      keywords: generateKeywords([title, subtitle, description]),
    };

    const api = new ServicesService(
      localStorage.getItem("acess-x-token") as string
    );

    const res = await api.update(payload, Number(id));

    if (res?.logout) {
      router.push("/auth/login");
      toast.error("Sessão expirada");
      return;
    }

    res?.id
      ? toast.success("Serviço atualizado com sucesso")
      : toast.error(res?.message ?? "Erro ao atualizar serviço");

    setIsProcessing(false);
  };
  if (loading) return <Loader />;

  if (!serviceExists) {
    return (
      <section className="flex flex-col items-center gap-4 mt-20">
        <h2 className="text-lg font-semibold">Serviço não encontrado</h2>
        <p className="text-sm text-muted-foreground">
          O serviço que você tentou editar não existe ou foi removido.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft />
          Voltar
        </Button>
      </section>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <section className="flex flex-col items-center gap-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col gap-4"
      >
        <Label>Categoria</Label>
        <select
          className="border rounded-md h-10 px-3"
          value={selectedCategory?.id ?? ""}
          onChange={(e) =>
            setSelectedCategory(
              categories.find((c) => c.id === Number(e.target.value)) ?? null
            )
          }
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>

        <Label>Título</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />

        <Label>Subtítulo</Label>
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />

        <Label>Preço</Label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Label>Duração</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <Label>Descrição</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Label>Resultado</Label>
        <Textarea value={result} onChange={(e) => setResult(e.target.value)} />

        <Label>Requisitos</Label>
        <InputGroup>
          <InputGroupInput
            value={requiments}
            placeholder="Adicionar requisito"
            onChange={(e) => setRequirements(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!requiments || requirementsList.includes(requiments))
                  return;
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
                if (!requiments || requirementsList.includes(requiments))
                  return;
                setRequirementsList((prev) => [...prev, requiments]);
                setRequirements("");
              }}
            >
              <Plus />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        {requirementsList.map((req) => (
          <div
            key={req}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span className="flex items-center gap-1 text-sm">
              <Check size={14} /> {req}
            </span>
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setRequirementsList(requirementsList.filter((r) => r !== req))
              }
            >
              <Trash size={12} />
            </Button>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-2">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? <Loader2 className="animate-spin" /> : "Finalizar"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={() => router.back()}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>
      </form>
    </section>
  );
}
