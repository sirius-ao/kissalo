import { ICategory, IServiceTemplate } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import { ApprovalStatus } from "@/types/enum";
import { Eye, Pencil, StepForward, Trash } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function TableViewCategories({
  categories,
}: {
  categories: ICategory[];
}) {
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
          <TableHead>Estado</TableHead>
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
              <Switch defaultChecked={category.isActive} />
            </TableCell>
            <TableCell>
              {category.createdAt &&
                category.createdAt?.toLocaleDateString("pt")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>Acções</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuRadioGroup>
                    <Dialog>
                      <DialogTrigger asChild>
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

                        <form action="" className="flex flex-col gap-2">
                          <Label>Título</Label>
                          <Input
                            defaultValue={category.title}
                            required
                            placeholder="título da categoria"
                          />
                          <Input
                            type="color"
                            className="w-20"
                            required
                            placeholder=""
                            defaultValue={category.color}
                          />
                          <Label>Descrição</Label>
                          <Textarea
                            placeholder="descrição da categoria"
                            className="resize-none h-30"
                            required
                            defaultValue={category.description}
                          />
                          <Button onClick={() => {}}>Criar categoria</Button>
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
                          <Button onClick={() => {}}>Remover </Button>
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
