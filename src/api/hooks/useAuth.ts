import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/AuthService';

export function useLogin() {
    const loginStore = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            authService.login(username, password),
        onSuccess: (success, variables) => {
            if (success) {
                loginStore(variables.username, variables.password);
            }
        },
    });
}
export function useLogout() {
    const logoutStore = useAuthStore((state) => state.logout);

    return useMutation({
        // ✅ mutationFn — асинхронная (возвращает Promise)
        mutationFn: async () => {
            authService.logout(); // синхронное удаление из localStorage
            // Можно добавить искусственную задержку для имитации
            await Promise.resolve(); // или просто вернуть Promise
        },
        // ✅ onSuccess — вызывается после успешной мутации
        onSuccess: () => {
            logoutStore(); // синхронно обновляем Zustand
        },
    });
}
