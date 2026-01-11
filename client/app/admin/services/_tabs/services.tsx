"use client";
import { IServiceTemplate } from "@/types/interfaces";
import { Eye, Loader2, Pencil, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { useState } from "react";
import { ServicesService } from "@/services/Services/index.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function TableViewServices({
  services,
  onRemove,
  onUpdate,
}: {
  services: IServiceTemplate[];
  onUpdate: (updated: IServiceTemplate) => void;
  onRemove: (id: number) => void;
}) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const serviceApi = new ServicesService(
    localStorage.getItem("acess-x-token") as string
  );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox />
          </TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Preços</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Criado</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service, idx) => (
          <TableRow key={idx}>
            <TableCell className="flex gap-2 items-center">
              <Checkbox />
            </TableCell>
            <TableCell>
              <span className="flex gap-2">
                <img
                  src={service.bannerUrl}
                  className="h-8 w-8 object-fill rounded-sm bg-gray-100"
                />
                <div>
                  <h1>{service?.title}</h1>
                  <small>{service.description?.slice(0, 30)} ...</small>
                </div>
              </span>
            </TableCell>
            <TableCell>
              <span className="">
                <span className="flex items-center gap-1">
                  <div
                    style={{
                      backgroundColor: service.category.color,
                    }}
                    className="h-2 w-2 rounded-full
                  "
                  ></div>
                  <h1>{service?.category?.title}</h1>
                </span>
                <small>{service?.category.description?.slice(0, 40)} ...</small>
              </span>
            </TableCell>
            <TableCell>
              {service.price?.toLocaleString("pt")},00 {service.currency}{" "}
            </TableCell>
            <TableCell>
              <Switch defaultChecked={service.isActive} />
            </TableCell>
            <TableCell>
              {service.createdAt &&
                new Date(service.createdAt)?.toLocaleDateString("pt")}
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
                          <Trash size={14} className="text-neutral-500" />
                          Eliminar
                          <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Remoção de serviço</DialogTitle>
                        <DialogDescription>
                          Uma vez removido , todos os agendamentos , pagamentos
                          e outros registros envolvidos serão elimidados dua vez
                        </DialogDescription>
                        <div className="grid grid-cols-2 gap-2">
                          <DialogClose className="border rounded-sm text-sm ">
                            Cancelar
                          </DialogClose>
                          <Button
                            disabled={processing}
                            onClick={async () => {
                              setProcessing(true);

                              const data = await serviceApi.remove(service.id);

                              if (data?.logout) {
                                router.push("/auth/login");
                                toast.error("Sessão expirada");
                                return;
                              }
                              if (data?.data?.id) {
                                toast.success("Serviço removida");
                                onRemove(service.id);
                              } else {
                                toast.error("Serviço não encontrada");
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

                    <Link href={`/admin/services/${service.id}/edit`}>
                      <DropdownMenuItem>
                        <Pencil />
                        Editar
                        <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/services/${service.id}`}>
                      <DropdownMenuItem>
                        <Eye />
                        Detalhes
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
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
