import "./MovieCard.css";
import { Movie } from '../types/movie';
import { motion } from 'framer-motion';
import { useFavouritesState } from "../store/favouritesStore";
// import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  onHandleSelect?: (movie: Movie) => void;
}
function MovieCard({ movie, onHandleSelect }: MovieCardProps) {
  const { addFavourite, removeFavourite, isFavourite } = useFavouritesState();
  // const isFav = isFavourite(movie.id);
  // const [isFavor, setIsFavor] = useState(isFav);

  const handleFavouriteToggle = () => {
    if (isFavourite(movie.id)) {
      removeFavourite(movie.id);
      // setIsFavor(false)
      // console.log(isFav);
    } else {
      addFavourite(movie);
      // setIsFavor(true)
      // console.log(isFav);
    }
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
    <motion.div
      className="movie-card"
      // onClick={() => onHandleSelect && onHandleSelect(movie)}
      variants={itemVariants}
    >
      <div onClick={() => onHandleSelect && onHandleSelect(movie)} className="movie-poster">
        <div className="poster-placeholder">🎬</div>
        <div className="movie-rating">⭐ {movie.rating || 'N/A'}</div>

      </div>

      <div className="movie-content">
        <h3 className="movie-title" onClick={() => onHandleSelect && onHandleSelect(movie)}>{movie.title}</h3>

        <div className="movie-meta" onClick={() => onHandleSelect && onHandleSelect(movie)}>
          <span className="movie-year">{movie.year}</span>
          <span className="movie-duration">{movie.duration}</span>
          <span className="movie-age-rating">{movie.ageRating}</span>
        </div>

        <p className="movie-description" onClick={() => onHandleSelect && onHandleSelect(movie)}>{movie.description}</p>

        {/* <div onClick={() => onHandleSelect && onHandleSelect(movie)} className="movie-genres">
          {movie.genres.map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div> */}
        <div className="movie-genres" onClick={() => onHandleSelect && onHandleSelect(movie)}>
          {(movie.genres || []).map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>

        <div className="movie-actions">
          <button onClick={handleFavouriteToggle} className="btn btn-outline">
            {isFavourite(movie.id) ? "❤️" : "🤍"}
          </button>
          <button onClick={() => onHandleSelect && onHandleSelect(movie)} className="btn btn-accent watch-btn">Смотреть</button>
          <button onClick={() => onHandleSelect && onHandleSelect(movie)} className="btn btn-outline save-btn">Сохранить</button>

        </div>
      </div>
    </motion.div>

  );
}

export default MovieCard;
