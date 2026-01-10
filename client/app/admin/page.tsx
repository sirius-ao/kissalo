"use client";
import { IStats, StarsCard } from "@/components/StatsCard";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { IUser } from "@/types/interfaces";
import { usersCustomersMock, usersProfessionalsMock } from "@/mocks/users";
import { Loader } from "@/components/Loader";
import constants from "@/constants";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { UserRole, UserStatus } from "@/types/enum";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, User, Briefcase } from "lucide-react";

const roleConfig: Record<UserRole, any> = {
  ADMIN: {
    label: "Admin",
    icon: <ShieldCheck size={12} />,
    variant: "destructive" as const,
  },
  PROFESSIONAL: {
    label: "Profissional",
    icon: <Briefcase size={12} />,
    variant: "default" as const,
  },
  CUSTOMER: {
    label: "Cliente",
    icon: <User size={12} />,
    variant: "secondary" as const,
  },
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
type UserTypeFilter = "ALL" | "CUSTOMER" | "PROFESSIONAL";


export default function HomePage() {
  const [load, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<UserTypeFilter>("ALL");
  const [users, setUsers] = useState<IUser[]>([
    ...usersCustomersMock,
    ...usersProfessionalsMock,
  ]);
  const stats: IStats[] = [
    {
      isCoin: false,
      label: "total profissionais da plaforma",
      oldValue: 1000,
      title: "Total profissionais",
      value: 100,
    },
    {
      isCoin: false,
      label: "total clientes da plaforma ",
      oldValue: 1000,
      title: "Total clientes",
      value: 567100,
    },
    {
      isCoin: false,
      label: "total de usuários",
      oldValue: 1,
      title: "Total usuários",
      value: 10,
    },
  ];
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "ALL" || user.role === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [users, search, typeFilter]);

  const toggleUserStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status:
                u.status === UserStatus.ACTIVE
                  ? UserStatus.SUSPENDED
                  : UserStatus.ACTIVE,
            }
          : u
      )
    );
  };

  return (
    <section className="flex flex-col gap-5">
      {load ? (
        <Loader />
      ) : (
        <>
          <span className="lg:grid-cols-3 grid md:grid-cols-2 gap-4">
            {verifyArrayDisponiblity(stats) &&
              stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
          </span>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:max-w-sm"
              />

              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as UserTypeFilter)}
              >
                <SelectTrigger className="md:w-[220px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="CUSTOMER">Clientes</SelectItem>
                  <SelectItem value="PROFESSIONAL">Profissionais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox />
                    </TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Verificado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>

                      {/* USER */}
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium leading-none">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </TableCell>

                      {/* ROLE */}
                      <TableCell>
                        <Badge
                          variant={roleConfig[user.role]?.variant ?? "outline"}
                          className="flex w-fit items-center gap-1"
                        >
                          {roleConfig[user.role] && roleConfig[user.role].icon}
                          {roleConfig[user.role]?.label ?? user.role}
                        </Badge>
                      </TableCell>

                      {/* STATUS COM SWITCH */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.status === UserStatus.ACTIVE}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {user.status === UserStatus.ACTIVE
                              ? "Ativo"
                              : "Suspenso"}
                          </span>
                        </div>
                      </TableCell>

                      {/* SALDO */}
                      <TableCell className="font-medium">
                        {user.amountAvaliable.toLocaleString()} Kz
                      </TableCell>

                      {/* EMAIL VERIFIED */}
                      <TableCell>
                        <Badge
                          variant={user.isEmailVerified ? "default" : "outline"}
                        >
                          {user.isEmailVerified ? "Verificado" : "Pendente"}
                        </Badge>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4 text-destructive" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
