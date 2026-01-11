"use client";

import constants from "@/constants";
import { AuthService } from "@/services/auth/login.service";
import { IUser } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useEffect, useState } from "react";

export interface IUserContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}
export const UserContext = createContext<IUserContext | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getMe() {
      const token = localStorage.getItem("acess-x-token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const service = new AuthService();
      const data = (await service.getMe(token)) as IUser | null;
      if (!data?.id) {
        router.push("/auth/login");
        return;
      }
      setUser(data);
    }

    getMe();

    const interval = setInterval(async () => {
      await getMe();
    }, constants.TIMEOUT.INTEVAL);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {user && children}
    </UserContext.Provider>
  );
}
