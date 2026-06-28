import z from "zod";
export const profileSchema = z
    .object({
        username: z
            .string()
            .min(5, "Имя пользователя должно содержать минимум 5 символов")
            .max(20, "Имя пользователя не может превышать 20 символов")
            .regex(/^[a-zA-Z0-9_]+$/, "Только буквы, цифры и подчёркивание"),
        email: z.string().email("Неверный формат email"),
        currentPassword: z.string().min(6, "Введите текущий пароль"),
        newPassword: z
            .string()
            .min(6, "Новый пароль должен содержать минимум 6 символов")
            .optional()
            .or(z.literal("")),
        confirmNewPassword: z.string().optional().or(z.literal("")),
        birthDate: z.string().optional(),
        gender: z.string().optional(),
        favoriteGenre: z.string().optional(),
    })
    .refine(
        (data) => {
            // Если новый пароль заполнен, он должен совпадать с подтверждением
            if (data.newPassword || data.confirmNewPassword) {
                return data.newPassword === data.confirmNewPassword;
            }
            return true;
        },
        {
            message: "Новые пароли не совпадают",
            path: ["confirmNewPassword"],
        },
    )
    .refine(
        (data) => {
            // Если новый пароль заполнен, текущий пароль обязателен
            if (data.newPassword || data.confirmNewPassword) {
                return !!data.currentPassword;
            }
            return true;
        },
        {
            message: "Введите текущий пароль для смены пароля",
            path: ["currentPassword"],
        },
    );

export type ProfileFormData = z.infer<typeof profileSchema>;