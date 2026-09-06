import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/ApiService';
export const movieKeys = {
    all: ['movies'] as const,
    top: (type: string, page: number) => [...movieKeys.all, 'top', type, page] as const,
    search: (keyword: string, page: number) => [...movieKeys.all, 'search', keyword, page] as const,
};
export function useTopFilms(type: string = 'TOP_250_BEST_FILMS', page: number = 1) {
    return useQuery({
        queryKey: movieKeys.top(type, page),
        queryFn: () => apiService.getTopFilms(type, page),
        staleTime: 1000 * 60 * 10, // 10 минут
    });
}
export function useTopFilmsPaginated(type: string = 'TOP_250_BEST_FILMS', page: number = 1) {
    return useQuery({
        queryKey: movieKeys.top(type, page),
        queryFn: () => apiService.getTopFilms(type, page),
        placeholderData: (previousData) => previousData,// ← сохраняет старые данные во время загрузки
    });
}