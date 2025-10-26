import { z } from "zod";

function therapistIdValidator(val: string) {
  // Check env at validation time so dotenv ordering doesn't matter
  const allowLoose = process.env.APPOINTMENTS_USE_INMEMORY === "true";
  if (allowLoose) return typeof val === "string" && val.length > 0;
  // otherwise ensure it's a UUID
  return z.string().uuid().safeParse(val).success;
}

export const createAppointmentSchema = z.object({
  therapistId: z.string().refine(therapistIdValidator, { message: "Invalid therapistId" }),
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
