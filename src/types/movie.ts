export interface Movie {
    id: number;
    title: string;
    originalTitle?: string;
    year: number | string;
    rating: number;
    duration: string;
    ageRating: string;
    description: string;
    genres: string[];
    countries?: string[];
    poster: string;
    posterPreview?: string;
    type?: string;
    isSeries: boolean;
}
export interface RawKinopoiskMovie {
    filmId: number;
    kinopoiskId?: number;
    nameRu: string;
    nameEn?: string;
    year: number | string;
    rating: number;
    ratingKinopoisk?: number;
    ratingImdb?: number;
    filmLength?: number;
    ratingAgeLimits?: string;
    description?: string;
    genres?: { genre: string }[];
    countries?: { country: string }[];
    posterUrl?: string;
    posterUrlPreview?: string;
    type?: string;
    serial?: boolean;
}