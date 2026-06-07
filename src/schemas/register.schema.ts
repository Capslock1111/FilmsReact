import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string()
        .trim()
        .min(5, 'Имя пользователя должно содержать минимум 5 символа')
        .max(20, 'Имя пользователя не может превышать 20 символов')
        .regex(/^[a-zA-Z0-9_]+$/, 'Только буквы, цифры и подчёркивание'),

    email: z.email('Неверный формат email'),

    password: z.string()
        .min(5, 'Пароль должен содержать минимум 5 символов')
        .max(20, 'Логин не может превышать 20 символов'),

    confirmPassword: z.string(),

    birthDate: z.string().optional(),

    gender: z.string().optional(),

    favoriteGenre: z.string().optional(),

    agreeToTerms: z.boolean()
        .refine(val => val === true, 'Необходимо согласие с правилами'),
    avatar: z.any().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
});

export type RegisterFormData = z.infer<typeof registerSchema>