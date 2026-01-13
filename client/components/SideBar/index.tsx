"use client";
import { IconLogout } from "@tabler/icons-react";
import { User, UserPen } from "lucide-react";
import { navigations } from "@/constants/navigations";
import { useUserRole } from "@/hooks/use-UserRole";
import { Logo } from "../Logo";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { Button } from "../ui/button";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types/enum";
import { UserContext } from "@/context/userContext";

export function SideBar() {
  const context = useContext(UserContext);
  const { role } = useUserRole();
  if (!role || !context || !context?.user) {
    return null;
  }
  const { user } = context;
  const nav = navigations[role] ?? [];
  if (nav.length == 0) {
    return null;
  }
  const urlParms = usePathname();
  const defaultActived = nav.findIndex((item) => {
    return item.to?.endsWith(urlParms);
  });
  const [active, setActive] = useState(
    defaultActived == -1 ? 0 : defaultActived
  );

  useEffect(() => {
    const defaultActived = nav.findIndex((item) => {
      return item.to?.endsWith(urlParms);
    });
    setActive(defaultActived == -1 ? 0 : defaultActived);
  }, [urlParms]);

  return (
    <>
      {" "}
      <aside className="fixed lg:flex hidden left-0 top-0 p-4 h-screen bg-white z-12 border-l border  flex-col gap-7 lg:w-[15%]">
        <Logo to={nav[0].to} /> <Separator />
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
          <div className="flex bottom-10 left-2 absolute gap-2 p-2 rounded-sm border-black/4 w-[93%]  items-center border justify-between">
            <div className="flex gap-2 ">
              <Avatar>
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white">
                  {user.firstName.charAt(0).toUpperCase() +
                    user.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col text-sm ">
                <h1>{user.firstName + " " + user.lastName}</h1>
                <small>{user.email}</small>
                <small className="lowercase flex items-center gap-1">
                  {" "}
                  <User size={12} /> {role == "CUSTOMER" ? "CLIENTE" : role}
                </small>
              </span>
            </div>
            <Button
              variant={"ghost"}
              className="hover:bg-transparent "
              size={"lg"}
              asChild
            >
              <Link href={"/auth/login"}>
                <IconLogout />
              </Link>
            </Button>
          </div>
        </span>
      </aside>
      <div className="z-300 lg:hidden flex fixed top-2 left-2">
        <Logo to={nav[0].to} />
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
                "flex relative w-full justify-center  items-center hover:bg-gray-50/50 cursor-pointer rounded-sm gap-2 p-2",
                {
                  "bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white":
                    idx == active,
                }
              )}
            >
              {item.icon}
              {role == "CUSTOMER" && active == idx && (
                <p
                  className={clsx("opacity-0 transition-all", {
                    "opacity-100": idx == active,
                  })}
                >
                  {item.title}
                </p>
              )}
            </Link>
          ))}
      </footer>
    </>
  );
}
