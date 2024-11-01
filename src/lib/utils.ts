import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Xoá đị ký tự đàu tiên của path

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
