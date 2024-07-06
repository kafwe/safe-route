import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertRiskToText(risk: number) {
  if (risk < 33) return "Low"
  if (risk < 66) return "Medium"
  return "High"
}