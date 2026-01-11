"use client";
import { UserContext } from "@/context/userContext";
import { UserRole } from "@/types/enum";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export function useUserRole(): { role: UserRole | undefined } {
  const context = useContext(UserContext);
  const router = useRouter();
  if (!context || !context?.user) {
    router.push("/auth/login");
    return {
      role: undefined,
    };
  }
  let role: UserRole = context.user?.role;
  return {
    role,
  };
}
