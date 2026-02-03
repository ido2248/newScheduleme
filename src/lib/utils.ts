import { nanoid } from "nanoid";

export function generateCalendarCode(): string {
  return nanoid(8);
}

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const GRADES = [7, 8, 9, 10, 11, 12] as const;

export const MAX_PERIODS = 12;

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
