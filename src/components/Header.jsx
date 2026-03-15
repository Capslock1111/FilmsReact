import { Link, NavLink, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import "./Header.css";
import LogService from "../services/LogService";

function Header({ searchQuery, setSearchQuery, onLogout }) {
  const inputRef = useRef(null);
  const location = useLocation();

  const handleSearchClick = () => {
    if (inputRef.current) {
      const value = inputRef.current.value;
      setSearchQuery(value);
      LogService.search(value);
      inputRef.current.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick(); // Тот же обработчик при нажатии Enter
    }
  };

  // Метод для выхода из аккаунта
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Сбрасываем поле ввода при смене страницы
  useEffect(() => {
    LogService.navigation(location.pathname);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Также сбрасываем состояние поиска в App.jsx
    setSearchQuery("");
  }, [location.pathname, setSearchQuery]); // Срабатывает при смене пути URL и при изменении состояния поиска

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">CinemaHub</span>
            </Link>
          </div>

          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Главная
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/movies"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Фильмы
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="header-search">
            <input
              type="text"
              placeholder="Поиск фильмов..."
              className="search-input"
              ref={inputRef}
              defaultValue={searchQuery}
              onKeyDown={handleKeyPress}
            />
            <Link
              to="/movies"
              onClick={handleSearchClick}
              className="search-btn"
            >
              🔍
            </Link>
          </div>
          {/* Добавляем кнопку выхода из аккаунта (сброс localStorage) */}
          <button
            onClick={handleLogoutClick}
            className="btn btn-outline logout-btn"
            title="Выйти из аккаунта"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
