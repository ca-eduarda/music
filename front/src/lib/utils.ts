import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNameFunction(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
