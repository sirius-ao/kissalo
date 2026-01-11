import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function verifyArrayDisponiblity(data: any[]): boolean {
  return Array.isArray(data) && data.length > 0;
}

export function validateEmail(email: string) {
  try {
    z.email().parse(email);
  } catch (error) {
    return {
      message: "Email inválido",
      error: true,
    };
  }
}
export function includesText(value?: string, search?: string) {
  if (!value || !search) return false;
  return value.toLowerCase().includes(search.toLowerCase());
}

export function generateKeywords(words: string[], minLength = 2): string[] {
  const keywordsSet = new Set<string>();
  words.forEach((word) => {
    const cleanWord = word.trim().toLowerCase();
    if (cleanWord.length >= minLength) {
      keywordsSet.add(cleanWord);
    }
  });

  return Array.from(keywordsSet);
}
