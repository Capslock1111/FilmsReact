import { z } from 'zod';

export const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(5, 'Логин должен содержать минимум 5 символов')
        .max(20, 'Логин не может превышать 20 символов')
        .regex(/^[a-zA-Z0-9]+$/, "Логин может содержать только буквы и цифры"),
    password: z.string()
        .trim()
        .min(5, 'Логин должен содержать минимум 5 символов')
        .max(20, 'Логин не может превышать 20 символов')
        .regex(/^[a-zA-Z0-9]+$/, "Логин может содержать только буквы и цифры"),
});

export type LoginFormData = z.infer<typeof loginSchema>