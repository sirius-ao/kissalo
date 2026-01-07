import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function verifyArrayDisponiblity(data: any[]): boolean {
  return Array.isArray(data) && data.length > 0;
}


