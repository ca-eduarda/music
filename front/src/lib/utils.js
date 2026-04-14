import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNameFunction(...inputs) {
  return twMerge(clsx(inputs));
}
