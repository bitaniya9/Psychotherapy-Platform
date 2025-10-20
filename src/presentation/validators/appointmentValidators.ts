import { z } from "zod";

export const createAppointmentSchema = z.object({
  therapistId: z.string().uuid(),
  startsAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  endsAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  reason: z.string().optional(),
});

export const listAppointmentsSchema = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  reason: z.string().optional(),
});
