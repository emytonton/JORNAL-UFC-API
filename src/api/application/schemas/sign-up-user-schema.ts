import { z } from 'zod';
import { Role } from '../../domain/entities/enums/Role';

export const signUpUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Role must be student, admin, or teacher' }),
  }),
});

export type SignUpUserInput = z.infer<typeof signUpUserSchema>;

