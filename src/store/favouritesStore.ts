import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "../types/movie";

interface FavouritesState {
    favourites: Movie[];
    addFavourite: (movie: Movie) => void;
    removeFavourite: (movieId: number) => void;
    isFavourite: (movieId: number) => boolean;
}

export const useFavouritesState = create<FavouritesState>()(
    persist(
        (set, get) => ({
            favourites: [],
            addFavourite: (movie) =>
                set((state) => ({
                    favourites: [...state.favourites, movie],
                })),
            removeFavourite: (movieId) =>
                set((state) => ({
                    favourites: state.favourites.filter((m) => m.id !== movieId),
                })),
            isFavourite: (movieId) => get().favourites.some((m) => m.id === movieId),
        }),
        { name: 'favourites-storage' },
    ),
);