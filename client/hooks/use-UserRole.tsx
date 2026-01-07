"use client";
import { UserRole } from "@/types/enum";
import { useEffect } from "react";

export function useUserRole() : { role : UserRole} {
  let role: UserRole = UserRole.ADMIN;
  useEffect(() => {
    const storedRole = localStorage.getItem("x-user-role") as
      | UserRole
      | undefined;
    if (storedRole) {
      role = role;
    }
  }, []);

  return {
    role,
  };
}
