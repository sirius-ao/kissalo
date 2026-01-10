import { IServiceTemplate } from "@/types/interfaces";
import { Badge } from "@/components/ui/badge";
import { ApprovalStatus } from "@/types/enum";
import { Eye, Pencil, StepForward, Trash } from "lucide-react";

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

export function TableViewServices({
  services,
}: {
  services: IServiceTemplate[];
}) {
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
          <TableHead>Profissionais</TableHead>
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
              <span className="flex items-center gap-0.5">
                {service.requests
                  .filter((item) => {
                    return item.status == ApprovalStatus.APPROVED;
                  })
                  .map((item, idx) => {
                    if (idx <= 3) {
                      return (
                        <Avatar key={idx} className="h-7 w-7">
                          <AvatarImage
                            src={item.professional?.user.avatarUrl}
                          />
                          <AvatarFallback className="bg-primary text-xs  text-white">
                            {item.professional?.user.firstName
                              .charAt(0)
                              .toUpperCase() +
                              item.professional?.user.lastName
                                .charAt(0)
                                .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      );
                    }
                  })}
              </span>
            </TableCell>
            <TableCell>
              <Switch defaultChecked={service.isActive} />
            </TableCell>
            <TableCell>
              {service.createdAt && service.createdAt?.toLocaleDateString("pt")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>Acções</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuRadioGroup>
                    <DropdownMenuItem>
                      <Trash />
                      Cancelar
                      <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>

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
