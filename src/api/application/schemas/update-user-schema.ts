import { z } from "zod";
import { Role } from "../../domain/entities/enums/Role";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z
    .nativeEnum(Role, {
      errorMap: () => ({
        message: "Role must be student, admin, or teacher",
      }),
    })
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
