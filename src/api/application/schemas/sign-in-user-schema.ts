import { z } from 'zod';

export const signInUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInUserInput = z.infer<typeof signInUserSchema>;

