import { z } from 'zod';

export const AuthSchema = z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type AuthDto = z.infer<typeof AuthSchema>;
