import { nanoid } from "nanoid";

export function generateCalendarCode(): string {
  return nanoid(8);
}

// Hebrew day names (Sunday = index 0, matching JavaScript getDay())
export const DAY_NAMES = [
  "יום ראשון",
  "יום שני",
  "יום שלישי",
  "יום רביעי",
  "יום חמישי",
  "יום שישי",
  "שבת",
] as const;

// Short day names for calendar headers
export const DAY_NAMES_SHORT = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"] as const;

// Hebrew month names
export const MONTH_NAMES = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
] as const;

export const GRADES = [7, 8, 9, 10, 11, 12] as const;

export const MAX_PERIODS = 12;

// Hebrew grade labels using Hebrew letters
export const GRADE_LABELS: Record<number, string> = {
  1: "שכבה א'",
  2: "שכבה ב'",
  3: "שכבה ג'",
  4: "שכבה ד'",
  5: "שכבה ה'",
  6: "שכבה ו'",
  7: "שכבה ז'",
  8: "שכבה ח'",
  9: "שכבה ט'",
  10: "שכבה י'",
  11: "שכבה י\"א",
  12: "שכבה י\"ב",
};

// Short grade labels for compact display
export const GRADE_LABELS_SHORT: Record<number, string> = {
  1: "א'",
  2: "ב'",
  3: "ג'",
  4: "ד'",
  5: "ה'",
  6: "ו'",
  7: "ז'",
  8: "ח'",
  9: "ט'",
  10: "י'",
  11: "י\"א",
  12: "י\"ב",
};

// Helper to format hour in Hebrew
export function formatHour(periodNumber: number): string {
  return `שעה ${periodNumber}`;
}

// Helper to format grade in Hebrew
export function formatGrade(grade: number): string {
  return GRADE_LABELS[grade] || `שכבה ${grade}`;
}

// Helper for short grade format
export function formatGradeShort(grade: number): string {
  return GRADE_LABELS_SHORT[grade] || `${grade}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Returns {start, end} for the Sun–Sat week containing the given date (UTC) */
export function getWeekRange(referenceDate?: Date): { start: Date; end: Date } {
  const d = referenceDate ? new Date(referenceDate) : new Date();
  d.setUTCHours(0, 0, 0, 0);
  const dayOfWeek = d.getUTCDay();
  const start = new Date(d);
  start.setUTCDate(d.getUTCDate() - dayOfWeek);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return { start, end };
}

/** Returns {start, end} for the month containing the given date (UTC) */
export function getMonthRange(referenceDate?: Date): { start: Date; end: Date } {
  const d = referenceDate ? new Date(referenceDate) : new Date();
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
  return { start, end };
}
