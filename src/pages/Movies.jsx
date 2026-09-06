import "./Movies.css";
import { useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { useSearchStore } from "../store/searchStore";
import { useTopFilms } from "../api/hooks/useMovies";

function Movies() {
  const { query: searchQuery } = useSearchStore();

  const [sortBy, setSortBy] = useState("default");
  const [selectedGenre, setSelectedGenre] = useState("Все");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Загружаем все фильмы через React Query
  const { data, isLoading, isError, error } = useTopFilms(
    "TOP_250_BEST_FILMS",
    1,
  );

  // ✅ Полная логика фильтрации и сортировки внутри useMemo
  const filteredAndSortedMovies = useMemo(() => {
    if (!data) return [];

    let movies = [...data];

    if (searchQuery) {
      movies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedGenre !== "Все") {
      movies = movies.filter((movie) => movie.genres?.includes(selectedGenre));
    }

    if (sortBy === "rating") {
      movies.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "year") {
      movies.sort((a, b) => {
        const yearA =
          typeof a.year === "string" ? parseInt(a.year, 10) : a.year;
        const yearB =
          typeof b.year === "string" ? parseInt(b.year, 10) : b.year;
        return (yearB ?? 0) - (yearA ?? 0);
      });
    } else if (sortBy === "title") {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    }

    return movies;
  }, [data, searchQuery, selectedGenre, sortBy]);

  // ✅ Все жанры из данных
  const allGenres = useMemo(() => {
    if (!data) return ["Все"];
    const genres = data.flatMap((movie) => movie.genres || []);
    return ["Все", ...new Set(genres)].sort();
  }, [data]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMovie(null);
  };

  const clearFilters = () => {
    setSortBy("default");
    setSelectedGenre("Все");
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="movies-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка фильмов...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="movies-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Ошибка загрузки</h2>
            <p className="error-message">
              {error?.message || "Не удалось загрузить фильмы"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-accent"
            >
              Повторить попытку
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Каталог фильмов</h1>
          <p className="page-subtitle">
            Коллекция из {data?.length || 0} фильмов различных жанров и годов
            выпуска
          </p>
        </div>

        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="genre-filter" className="filter-label">
              Жанр:
            </label>
            <select
              id="genre-filter"
              className="filter-select"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "Все" ? "Все жанры" : genre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter" className="filter-label">
              Сортировка:
            </label>
            <select
              id="sort-filter"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">По умолчанию</option>
              <option value="rating">По рейтингу</option>
              <option value="year">По году (новые)</option>
              <option value="title">По названию</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="btn btn-outline clear-filters-btn"
          >
            Сбросить фильтры
          </button>

          <div className="search-info">
            {searchQuery && (
              <span className="search-query">Поиск: "{searchQuery}"</span>
            )}
            <span className="movies-count">
              Результаты: {filteredAndSortedMovies.length} из{" "}
              {data?.length || 0}
            </span>
          </div>
        </div>

        {filteredAndSortedMovies.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🎬</div>
            <h2 className="no-results-title">Фильмы не найдены</h2>
            <p className="no-results-text">
              Попробуйте изменить параметры поиска или выбрать другой жанр
            </p>
            <button onClick={clearFilters} className="btn btn-accent">
              Показать все фильмы
            </button>
          </div>
        ) : (
          <div className="movies-grid">
            {filteredAndSortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onHandleSelect={handleMovieSelect}
              />
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <MovieModal
          movie={selectedMovie}
          isOpen={isOpen}
          onCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Movies;
