"use client";

import { IconLogout } from "@tabler/icons-react";
import { Search, UserPen } from "lucide-react";
import { navigations } from "@/constants/navigations";
import { useUserRole } from "@/hooks/use-UserRole";
import { Logo } from "../Logo";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

export function SideBar() {
  const { role } = useUserRole();
  const nav = navigations[role] ?? [];
  const [active, setActive] = useState(0);
  const user = {
    fisrtName: "Francico",
    lastName: "Diakomas",
    avatarUrl: "https://github.com/shadcn.png",
    role: "Profissional",
    email: "franciscodiakoma@gmail.com",
  };
  const message =
    role == "PROFISSIONAL"
      ? {
          title: "Gerencie seus agendamentos",
          to: "",
          active: 2,
          message:
            "Aceite ou começe agora executando as tarefas que lhe foi atribuido",
          btnLabel: "Agendamentos",
        }
      : {};

  return (
    <>
      {" "}
      <aside className="fixed lg:flex hidden left-0 top-0 p-4 h-screen bg-white z-12 border-l border  flex-col gap-7 lg:w-[15%]">
        <Logo /> <Separator />
        <ul className="flex flex-col gap-5">
          {verifyArrayDisponiblity(nav) &&
            nav.map((item, idx) => (
              <Link
                href={item.to}
                onClick={() => {
                  setActive(idx);
                }}
                key={idx}
                className={clsx(
                  "flex relative  items-center hover:bg-gray-50/50 cursor-pointer rounded-sm gap-2 p-2  ",
                  {
                    "bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white":
                      idx == active,
                  }
                )}
              >
                {item.icon}
                <p>{item.title}</p>
              </Link>
            ))}
        </ul>
        <Separator />
        <span className="w-full flex flex-col gap-5 ">
          <Card className="rounded-sm px-2 py-4 gap-3 shadow-none border-none">
            <CardTitle>{message.title}</CardTitle>
            <CardContent className="p-0">
              <CardDescription>{message.message}</CardDescription>
            </CardContent>

            <Button
              size={"lg"}
              className="bg-linear-to-r shadow-2xl from-[#161615f2] to-[#434242f5] text-white"
            >
              {message.btnLabel}
              <UserPen />
            </Button>
          </Card>

          <div className="flex bottom-10 left-2 absolute gap-2 p-2 rounded-sm border-black/4   items-center border">
            <Avatar>
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white">
                {user.fisrtName.charAt(0).toUpperCase() +
                  user.lastName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="flex flex-col text-sm">
              <h1>{user.fisrtName + " " + user.lastName}</h1>
              <small>{user.email}</small>
            </span>
            <Button
              variant={"ghost"}
              className="hover:bg-transparent"
              size={"lg"}
            >
              <IconLogout />
            </Button>
          </div>
        </span>
      </aside>
      <div className="z-300 lg:hidden flex fixed top-2 left-2">
        <Logo />
      </div>
      <footer className="fixed lg:hidden bottom-0 z-100 w-full left-0 flex bg-white justify-between p-3 shadow border-t">
        {verifyArrayDisponiblity(nav) &&
          nav.map((item, idx) => (
            <Link
              href={item.to}
              onClick={() => {
                setActive(idx);
              }}
              key={idx}
              className={clsx(
                "flex relative flex-col w-full justify-center  items-center hover:bg-gray-50/50 cursor-pointer rounded-sm gap-2 p-2  ",
                {
                  "bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white":
                    idx == active,
                }
              )}
            >
              {item.icon}
              {item.title?.slice(0, 7)}
              {item.title?.length > 7 && "..."}
            </Link>
          ))}
      </footer>
    </>
  );
}
