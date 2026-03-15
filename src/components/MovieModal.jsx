// src/components/MovieModal/MovieModal.jsx (версия для ДЗ)
import "./MovieModal.css";

function MovieModal({ movie, onCloseModal, isOpen }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Шапка модального окна */}
        <div className="modal-header">
          <h2 className="modal-title">
            {movie ? movie.title : "Название фильма"}
          </h2>
          <button className="modal-close-btn" onClick={onCloseModal}>
            ✕
          </button>
        </div>

        {/* Основное содержимое */}
        <div className="modal-content">
          {/* Левая часть - постер */}
          <div className="modal-poster-section">
            <div
              className="modal-poster"
              style={{
                backgroundColor: movie?.posterColor || "#2c3e50",
                backgroundImage: movie?.poster
                  ? `url(${movie.poster})`
                  : "none",
              }}
            >
              {!movie?.poster && (
                <div className="modal-poster-placeholder">
                  <span className="placeholder-icon">🎬</span>
                  <span className="placeholder-text">Нет постера</span>
                </div>
              )}
            </div>

            {/* Бейдж с рейтингом */}
            <div className="modal-rating-badge">
              <div className="rating-value">
                {movie?.rating ? parseFloat(movie.rating).toFixed(1) : "Н/Д"}
              </div>
              <div className="rating-label">Рейтинг</div>
            </div>
          </div>

          {/* Правая часть - детали */}
          <div className="modal-details">
            {/* Сетка с основной информацией */}
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Год выпуска:</span>
                <span className="detail-value">{movie?.year || "Н/Д"}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Длительность:</span>
                <span className="detail-value">{movie?.duration || "Н/Д"}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Возрастной рейтинг:</span>
                <span className="detail-value age-rating">
                  {movie?.ageRating || "0+"}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Тип:</span>
                <span className="detail-value">
                  {movie?.isSeries ? "Сериал" : "Фильм"}
                </span>
              </div>
            </div>

            {/* Жанры */}
            <div className="genres-section">
              <h3 className="section-title">Жанры</h3>
              <div className="genres-list">
                {movie?.genres && movie.genres.length > 0 ? (
                  movie.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="no-genres">Жанры не указаны</span>
                )}
              </div>
            </div>

            {/* Страны (если есть) */}
            {movie?.countries && movie.countries.length > 0 && (
              <div className="countries-section">
                <h3 className="section-title">Страны</h3>
                <div className="countries-list">
                  {movie.countries.map((country, index) => (
                    <span key={index} className="country-tag">
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Описание */}
            <div className="description-section">
              <h3 className="section-title">Описание</h3>
              <p className="description-text">
                {movie?.description || "Описание отсутствует"}
              </p>
            </div>

            {/* Оригинальное название (если отличается) */}
            {movie?.originalTitle && movie.originalTitle !== movie.title && (
              <div className="original-title-section">
                <span className="original-label">Оригинальное название:</span>
                <span className="original-value">{movie.originalTitle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Футер с кнопками */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCloseModal}>
            Закрыть
          </button>
          <button className="btn btn-accent">❤️ Добавить в избранное</button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
