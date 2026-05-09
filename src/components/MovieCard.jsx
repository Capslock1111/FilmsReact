import "./MovieCard.css";
import { motion, AnimatePresence } from 'framer-motion';

function MovieCard({ movie, onHandleSelect }) {
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
    <motion.div
      className="movie-card"
      onClick={() => onHandleSelect && onHandleSelect(movie)}
      variants={itemVariants}
    >
      <div className="movie-poster">
        <div className="poster-placeholder">🎬</div>
        <div className="movie-rating">⭐ {movie.rating}</div>
      </div>

      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>

        <div className="movie-meta">
          <span className="movie-year">{movie.year}</span>
          <span className="movie-duration">{movie.duration}</span>
          <span className="movie-age-rating">{movie.ageRating}</span>
        </div>

        <p className="movie-description">{movie.description}</p>

        <div className="movie-genres">
          {movie.genres.map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>

        <div className="movie-actions">
          <button className="btn btn-accent watch-btn">Смотреть</button>
          <button className="btn btn-outline save-btn">Сохранить</button>
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;
