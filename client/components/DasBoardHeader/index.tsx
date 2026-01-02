"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export function DshBoardHeader() {
  const [hasUnRead, setHasUnread] = useState(true);
  const user = {
    fisrtName: "Francico",
    lastName: "Diakomas",
    avatarUrl: "https://github.com/shadcn.png",
    role: "Profissional",
    email: "franciscodiakoma@gmail.com",
  };

  return (
    <header className="fixed top-0 p-3 items-center gap-3 flex justify-end lg:w-[85%] w-full bg-white z-20  right-0 border-b  ">
      <Link href={``} className="flex  relative">
        {hasUnRead && (
          <div className="h-2 w-2 bg-orange-500 rounded-full absolute"></div>
        )}
        <Bell size={18} />
      </Link>
      <Avatar className="h-7 w-7">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback className="bg-linear-to-r text-sm from-[#f7a60ed1] to-[#ec4d03e3] text-white">
          {user.fisrtName.charAt(0).toUpperCase() +
            user.lastName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
