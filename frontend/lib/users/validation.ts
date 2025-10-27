import { z } from "zod";

const UserCreateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),
});

export function validateUserCreate(payload: any) {
  const result = UserCreateSchema.safeParse(payload);
  return {
    valid: result.success,
    errors: result.success
      ? {}
      : (result.error.flatten().fieldErrors as Record<string, string[]>),
    parsed: result.success ? result.data : null,
  };
}
