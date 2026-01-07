"use client";

import { navigations } from "@/constants/navigations";
import { UserRole } from "@/types/enum";
import { useEffect } from "react";

export function useUserRole() {
  let role: keyof typeof navigations = "CUSTOMER";
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
