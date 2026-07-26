import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Movies from './Movies';
import { useSearch } from '../context/useSearch';
import { apiService } from '../services/ApiService';
import LogService from '../services/LogService';
import { Movie } from '../types/movie';

// Мокаем зависимости (используем vi вместо jest)
vi.mock('../context/useSearch');
vi.mock('../services/ApiService');
vi.mock('../services/LogService');
vi.mock('../components/MovieCard', () => ({
    default: ({ movie, onHandleSelect }: any) => (
        <div data-testid={`movie-card-${movie.id}`} onClick={() => onHandleSelect(movie)}>
            {movie.title}
        </div>
    ),
}));
vi.mock('../components/MovieModal', () => ({
    default: ({ movie, isOpen, onCloseModal }: any) => (
        isOpen ? <div data-testid="movie-modal">{movie?.title}</div> : null
    ),
}));
vi.mock('../components/Footer', () => ({
    default: () => <div>Footer</div>,
}));

// Тестовые данные
const mockMovies: Movie[] = [
    {
        id: 1,
        title: 'The Shawshank Redemption',
        year: 1994,
        rating: 9.3,
        genres: ['Drama', 'Crime'],
        duration: '2ч 22м',
        ageRating: '16+',
        description: 'Two imprisoned men bond...',
        poster: 'shawshank.jpg',
        isSeries: false,
    },
    {
        id: 2,
        title: 'The Godfather',
        year: '1972',
        rating: 9.2,
        genres: ['Drama', 'Crime'],
        duration: '2ч 55м',
        ageRating: '18+',
        description: 'The aging patriarch...',
        poster: 'godfather.jpg',
        isSeries: false,
    },
    {
        id: 3,
        title: 'The Dark Knight',
        year: 2008,
        rating: 9.0,
        genres: ['Action', 'Drama'],
        duration: '2ч 32м',
        ageRating: '16+',
        description: 'When the menace known...',
        poster: 'darkknight.jpg',
        isSeries: false,
    },
    {
        id: 4,
        title: 'Pulp Fiction',
        year: '1994',
        rating: 8.9,
        genres: ['Drama', 'Crime'],
        duration: '2ч 34м',
        ageRating: '18+',
        description: 'The lives of two mob hitmen...',
        poster: 'pulpfiction.jpg',
        isSeries: false,
    },
];

const fallbackMovies = mockMovies.map(movie => ({
    ...movie,
    year: typeof movie.year === 'string' ? parseInt(movie.year, 10) : movie.year
}));

const mockUseSearch = useSearch as any;
const mockApiService = apiService as any;
const mockLogService = LogService as any;

describe('Movies Component', () => {
    const mockSetFeaturedMovies = vi.fn();
    const mockSetSearchQuery = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseSearch.mockReturnValue({
            searchQuery: '',
            setSearchQuery: mockSetSearchQuery,
        });

        mockApiService.getTopFilms.mockResolvedValue(mockMovies);
        mockApiService.getFallbackMovies.mockReturnValue(fallbackMovies);
    });

    test('renders page header correctly', async () => {
        render(<Movies featuredMovies={[]} setFeaturedMovies={mockSetFeaturedMovies} />);

        await waitFor(() => {
            expect(screen.getByText('Каталог фильмов')).toBeInTheDocument();
            expect(screen.getByText(/Коллекция из/)).toBeInTheDocument();
        });
    });

    test('fetches and displays movies on mount', async () => {
        render(<Movies featuredMovies={[]} setFeaturedMovies={mockSetFeaturedMovies} />);

        await waitFor(() => {
            expect(mockApiService.getTopFilms).toHaveBeenCalledWith('TOP_250_BEST_FILMS', 1);
            expect(mockSetFeaturedMovies).toHaveBeenCalledWith(mockMovies);
        });
    });

    test('filters movies by genre', async () => {
        const user = userEvent.setup();
        render(<Movies featuredMovies={mockMovies} setFeaturedMovies={mockSetFeaturedMovies} />);

        await waitFor(() => {
            expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
        });

        const genreSelect = screen.getByLabelText('Жанр:') as HTMLSelectElement;
        await user.selectOptions(genreSelect, 'Action');

        expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
        expect(screen.queryByText('The Shawshank Redemption')).not.toBeInTheDocument();
    });

    // Добавьте остальные тесты аналогично
});