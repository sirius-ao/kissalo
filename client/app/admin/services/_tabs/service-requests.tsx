"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IProfessionalServiceRequest } from "@/types/interfaces";
import { ApprovalStatus } from "@/types/enum";
import { MoreHorizontal, CheckCircle, XCircle, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  requests: IProfessionalServiceRequest[];
}

export function TableViewServiceRequests({ requests }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox />
          </TableHead>
          <TableHead>Profissional</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Solicitado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {requests.map((req) => {
          const user = req.professional.user;
          const service = req.service;

          return (
            <TableRow key={req.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              {/* PROFISSIONAL */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="leading-tight">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
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
                  <small>
                    {service?.category.description?.slice(0, 40)} ...
                  </small>
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    req.status === ApprovalStatus.APPROVED
                      ? "default"
                      : req.status === ApprovalStatus.REJECTED
                      ? "destructive"
                      : "outline"
                  }
                >
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(req.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {req.status === ApprovalStatus.PENDING && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"}>Acções</Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprovar solicitação
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeitar solicitação
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          );
        })}

        {requests.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center py-8 text-muted-foreground"
            >
              Nenhuma solicitação pendente encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
