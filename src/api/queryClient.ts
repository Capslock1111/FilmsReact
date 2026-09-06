import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 минут данные считаются свежими
            refetchOnWindowFocus: true, // повторный запрос при фокусе окна
            retry: 1,
        },
    },
});