import "./MovieCard.css";

function MovieCard({ movie, onHandleSelect }) {
  return (
    <div
      className="movie-card"
      onClick={() => onHandleSelect && onHandleSelect(movie)}
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
    </div>
  );
}

export default MovieCard;
