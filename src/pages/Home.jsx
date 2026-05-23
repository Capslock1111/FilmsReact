import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";
import { apiService } from "../services/ApiService";
import MovieModal from "../components/MovieModal";
import MovieCard from "../components/MovieCard";
import { motion, AnimatePresence } from 'framer-motion';

function Home({ featuredMovies, setFeaturedMovies }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        setIsLoading(true);

        // Загружаем топ-250 фильмов с API (так же как в Movies.jsx)
        const topFilms = await apiService.getTopFilms("TOP_250_BEST_FILMS", 1);

        if (topFilms && topFilms.length > 0) {
          // Алгоритм Тасования Фишера-Йейтса (Fisher-Yates Shuffle) - для случайного выбора трех фильмов
          const shuffled = [...topFilms];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }

          // Берем первые 3 после перемешивания
          setFeaturedMovies(shuffled.slice(0, 3));
        } else {
          // Если API вернул пустой массив, используем fallback
          setFeaturedMovies(apiService.getFallbackMovies().slice(0, 3));
        }

        setError(null);
      } catch (err) {
        console.error("Ошибка загрузки фильмов:", err);
        setError("Не удалось загрузить фильмы");
        // Fallback на случай ошибки
        setFeaturedMovies(apiService.getFallbackMovies().slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка популярных фильмов...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1,
      },
    },
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="home-page">
      <motion.section className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Откройте мир кино с CinemaHub</h1>
            <p className="hero-subtitle">
              Самые популярные фильмы, подробные описания и удобный поиск. Все,
              что нужно настоящему киноману.
            </p>
            <div className="hero-buttons">
              <Link to="/movies" className="btn btn-accent">
                Смотреть фильмы
              </Link>
              <a href="#features" className="btn btn-outline">
                Узнать больше
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* О проекте... */}
      <motion.section id="features" className="section features"
        initial={{ opacity: 0, y: 50 }}
        // animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="container"
          variants={containerVariants}
          initial="hidden"
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}>
          <h2 className="section-title">Почему выбирают нас</h2>
          <p className="section-subtitle">
            CinemaHub предлагает уникальный опыт для любителей кино
          </p>

          <div className="features-grid">
            <motion.div className="feature-card"
              key={1} variants={itemVariants}
            >
              <div className="feature-icon">🎬</div>
              <h3 className="feature-title">Обширная библиотека</h3>
              <p className="feature-description">
                Тысячи фильмов различных жанров и годов выпуска из топ-250
              </p>
            </motion.div>

            <motion.div className="feature-card"
              key={2} variants={itemVariants}>
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Рейтинги и отзывы</h3>
              <p className="feature-description">
                Реальные оценки от Kinopoisk и IMDb
              </p>
            </motion.div>

            <motion.div className="feature-card"
              key={3} variants={itemVariants}>
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Умный поиск</h3>
              <p className="feature-description">
                Находите фильмы по жанру, году, рейтингу и другим параметрам
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Популярные фильмы */}
      <motion.section className="section featured-movies"
        initial={{ opacity: 0, y: 50 }}
        // animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Рекомендуем посмотреть</h2>
            <Link to="/movies" className="btn btn-outline">
              Смотреть все
            </Link>
          </div>

          {error ? (
            <div className="error-container"
            >
              <p className="error-message">{error}</p>
              <p className="error-hint">Используются демо-данные</p>
            </div>
          ) : null}

          <motion.div className="movies-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}>
            {featuredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onHandleSelect={handleMovieSelect}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Модальное окно с деталями фильма */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onCloseModal={handleCloseModal}

      />
    </div >
  );
}

export default Home;
