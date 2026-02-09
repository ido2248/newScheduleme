import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const calendarCreateSchema = z.object({
  name: z.string().min(1, "Calendar name is required").max(100),
  allowedGrades: z
    .array(z.number().int().min(7).max(12))
    .min(1, "Select at least one grade"),
  maxStudentsPerSlot: z.number().int().min(1).max(50),
  availabilitySlots: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        periodNumber: z.number().int().min(1).max(12),
      })
    )
    .min(1, "Add at least one availability slot"),
});

export const availabilityEditSchema = z.object({
  scope: z.enum(["permanent", "week", "month"]),
  slots: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      periodNumber: z.number().int().min(1).max(12),
    })
  ),
});

export const bookingSchema = z.object({
  calendarCode: z.string(),
  availabilitySlotId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  studentName: z.string().min(1, "Name is required").max(100),
  studentGrade: z.number().int().min(7).max(12),
});
