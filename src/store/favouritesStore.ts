import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "../types/movie";

interface FavouritesState {
    favourites: Movie[];
    addFavourite: (movie: Movie) => void;
    removeFavourite: (movieId: number) => void;
    isFavourite: (movieId: number) => boolean;
    clearFavourites: () => void;
}

export const useFavouritesState = create<FavouritesState>()(
    persist(
        (set, get) => ({
            favourites: [],
            addFavourite: (movie) => {
                const { favourites } = get();
                const exists = favourites.some((m) => m.id === movie.id);

                if (exists) {
                    // Уже в избранном → удаляем
                    set({
                        favourites: favourites.filter((m) => m.id !== movie.id),
                    });
                } else {
                    // Ещё нет → добавляем
                    set({
                        favourites: [...favourites, movie],
                    });
                }
            },
            removeFavourite: (movieId) =>
                set((state) => ({
                    favourites: state.favourites.filter((m) => m.id !== movieId),
                })),

            isFavourite: (movieId) => get().favourites.some((m) => m.id === movieId),
            clearFavourites: () => set({ favourites: [] }),
        }),

        { name: 'favourites-storage' },
    ),
);