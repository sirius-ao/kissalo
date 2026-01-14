"use client";

import { ICategory, IServiceTemplate } from "@/types/interfaces";
import { Eye, Loader2, Pencil, StepForward, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoriesService } from "@/services/Categories/index.service";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TableViewCategories({
  categories,
  onUpdate,
  onRemove,
}: {
  categories: ICategory[];
  onUpdate: (updated: ICategory) => void;
  onRemove: (id: number) => void;
}) {
  const router = useRouter();
  const service = new CategoriesService(
    localStorage.getItem("acess-x-token") as string
  );
  const [processing, setProcessing] = useState(false);
  const [editData, setEditData] = useState<ICategory>({} as any);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox />
          </TableHead>
          <TableHead>Ordem</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Serviços</TableHead>
          <TableHead>Criado</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category, idx) => (
          <TableRow key={idx}>
            <TableCell className="flex gap-2 items-center">
              <Checkbox />
            </TableCell>
            <TableCell>{category.order}</TableCell>
            <TableCell>{category.slug}</TableCell>
            <TableCell>
              <span className="">
                <span className="flex items-center gap-1">
                  <div
                    style={{
                      backgroundColor: category.color,
                    }}
                    className="h-2 w-2 rounded-full
                  "
                  ></div>
                  <h1>{category?.title}</h1>
                </span>
                <small>{category.description}</small>
              </span>
            </TableCell>
            <TableCell>{category.services.length}</TableCell>
            <TableCell>
              {category.createdAt &&
                new Date(category.createdAt)?.toLocaleDateString("pt")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>Acções</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuRadioGroup>
                    <Dialog>
                      <DialogTrigger
                        asChild
                        onClick={() => {
                          setEditData(category);
                        }}
                      >
                        <span className="flex items-center p-2 hover:bg-neutral-100 rounded-md justify-between text-sm gap-1 ">
                          <Pencil size={14} className="text-neutral-500" />
                          Editar
                          <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Actualização de categoria</DialogTitle>
                        <DialogDescription>
                          actualize categorias e anexe serviços a elas
                        </DialogDescription>

                        <form className="flex flex-col gap-2">
                          <Label>Título</Label>
                          <Input
                            required
                            value={editData.title ?? ""}
                            placeholder="título da categoria"
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                          />

                          <Label>Cor</Label>
                          <Input
                            type="color"
                            className="w-20"
                            required
                            value={editData.color ?? "#000000"}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                color: e.target.value,
                              }))
                            }
                          />

                          <Label>Descrição</Label>
                          <Textarea
                            required
                            className="resize-none h-30"
                            placeholder="descrição da categoria"
                            value={editData.description ?? ""}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />

                          <Button
                            disabled={processing}
                            onClick={async (e) => {
                              e.preventDefault();
                              setProcessing(true);

                              const data = await service.update(
                                {
                                  title: editData.title,
                                  description: editData.description as string,
                                  color: editData.color as string,
                                  order: editData.order,
                                },
                                editData.id
                              );

                              if (data?.logout) {
                                toast.error("Sessão expirada");
                                return;
                              }
                              if (data?.id) {
                                toast.success("Categoria atualizada");
                                onUpdate(data);
                              }

                              setProcessing(false);
                            }}
                          >
                            {processing ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Salvar alterações"
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="flex items-center p-2 hover:bg-neutral-100 rounded-md justify-between text-sm gap-1 ">
                          <Trash size={14} className="text-neutral-500" />
                          Eliminar
                          <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Remoção de categoria</DialogTitle>
                        <DialogDescription>
                          Uma vez removido , todos os serviços .agendamentos ,
                          pagamentos e outros registros envolvidos serão
                          elimidados dua vez
                        </DialogDescription>
                        <div className="grid grid-cols-2 gap-2">
                          <DialogClose className="border rounded-sm text-sm ">
                            Cancelar
                          </DialogClose>
                          <Button
                            disabled={processing}
                            onClick={async () => {
                              setProcessing(true);

                              const data = await service.remove(category.id);

                              if (data?.logout) {
                                toast.error("Sessão expirada");
                                return;
                              }

                              if (data?.data?.id) {
                                toast.success("Categoria removida");
                                onRemove(category.id);
                              } else {
                                toast.error("Categoria não encontrada");
                              }

                              setProcessing(false);
                            }}
                          >
                            {processing ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Remover"
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
