import "./Movies.css";
import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import LogService from "../services/LogService";
import { apiService } from "../services/ApiService";
import MovieModal from "../components/MovieModal";
import { useSearch } from "../context/useSearch";

function Movies({
  featuredMovies,
  setFeaturedMovies,
}) {
  const { searchQuery, setSearchQuery } = useSearch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [selectedGenre, setSelectedGenre] = useState("Все");
  const [displaySearchQuery, setDisplaySearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null); // ← состояние для хранения выбранного фильма
  const [isOpen, setIsOpen] = useState(false);

  const hasFetched = useRef(false); // ← флаг для контроля двойного запроса на сервер

  const handleMovieSelect = (movie) => {
    console.log(movie);
    setSelectedMovie(movie);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMovie(null);
  };

  const allGenres = [
    "Все",
    ...[...new Set(featuredMovies.flatMap((movie) => movie.genres))],
  ].sort();

  useEffect(() => {
    if (hasFetched.current) return; // избавляемся от двойного запроса в режиме разработки
    hasFetched.current = true;

    const fetchMovies = async () => {
      try {
        LogService.info("Начало загрузки фильмов");
        setIsLoading(true);

        const moviesData = await apiService.getTopFilms(
          "TOP_250_BEST_FILMS",
          1,
        );

        setFeaturedMovies(moviesData || []);
        setError(null);
      } catch (err) {
        LogService.error("Ошибка загрузки фильмов:", err);
        setError("Не удалось загрузить фильмы. Пожалуйста, попробуйте позже.");
        setFeaturedMovies(apiService.getFallbackMovies());
      } finally {
        setIsLoading(false);
        LogService.success("Фильмы загружены", {
          count: featuredMovies.length,
        });
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setDisplaySearchQuery(searchQuery);
    }
  }, [searchQuery]);

  const clearFilters = () => {
    setSortBy("default");
    setSelectedGenre("Все");
    setSearchQuery("");
    setDisplaySearchQuery("");
  };

  const onHandleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    LogService.info(`Выбран жанр:`, event.target.value);
  };

  const filteredMovies = featuredMovies.filter((movie) => {
    // Фильтр по поисковому запросу
    const matchesSearch = searchQuery
      ? movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Фильтр по жанру
    const matchesGenre =
      selectedGenre === "Все"
        ? true
        : movie.genres && movie.genres.includes(selectedGenre);

    // Оба условия должны выполняться
    return matchesSearch && matchesGenre;
  });

  if (sortBy === "rating") {
    filteredMovies.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "year") {
    filteredMovies.sort((a, b) => b.year - a.year);
  } else if (sortBy === "title") {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  }

  const moviesData =
    filteredMovies.length === 0 ? (
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
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onHandleSelect={handleMovieSelect}
          />
        ))}
      </div>
    );

  return (
    <div className="movies-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Каталог фильмов</h1>
          <p className="page-subtitle">
            Коллекция из {featuredMovies.length} фильмов различных жанров и
            годов выпуска
          </p>
        </div>

        {/* Панель фильтров */}
        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="genre-filter" className="filter-label">
              Жанр:
            </label>
            <select
              id="genre-filter"
              className="filter-select"
              value={selectedGenre} //
              onChange={(e) => onHandleGenreChange(e)} //
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
            {displaySearchQuery && (
              <span className="search-query">
                Поиск: "{displaySearchQuery}"
              </span>
            )}
            <span className="movies-count">
              Результаты: {filteredMovies.length} из {featuredMovies.length}
            </span>
          </div>
        </div>

        {/* Сетка фильмов
        Если ошибка с загрузкой данных, то отображается блок div с ошибкой.
        Если данные загружены, то отображается блок div с сеткой фильмов.
        */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка фильмов...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Ошибка загрузки</h2>
            <p className="error-message">{error}</p>
            <button onClick={clearFilters} className="btn btn-accent">
              Повторить попытку
            </button>
            {moviesData}
          </div>
        ) : (
          moviesData
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
