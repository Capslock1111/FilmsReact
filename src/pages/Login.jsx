import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ToastModal from '../components/ToastModal';
import "./Login.css";
import { AppProvider } from "../context";
import { useAuth } from "../context/useAuth";

function Login() {
  const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!username.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    // setIsLoading(true);
    setError("");

    try {
      const success = await login(username, password);

      if (success) {
        setIsToastOpen(true);
        const timer = setTimeout(() => {
          setIsToastOpen(false);
          navigate("/");
          setIsAuthenticated(true);
        }, 3000);
      } else {
        setError("Неверный логин или пароль");
      }
    } catch (err) {
      setError(`Ошибка при входе ${err}. Попробуйте позже.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppProvider>
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">CinemaHub</span>
            </div>
            <h1 className="login-title">Добро пожаловать!</h1>
            <p className="login-subtitle">Войдите в свой аккаунт</p>
          </div>

          {error && <div className="login-error">⚠️ {error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-accent login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="login-hint">
            <p>Подсказка для входа:</p>
            <p>
              Логин: <strong>admin</strong> / Пароль: <strong>1111</strong>
            </p>
          </div>

          <div className="login-footer">
            <Link to="/" className="login-footer-link">
              Вернуться на главную
            </Link>
            {isToastOpen && (<ToastModal
              // onClose={handleCloseToastModal}
              isToastOpen={isToastOpen}
            />)}
            {/* {isOpen && (
        <MovieModal
          movie={selectedMovie}
          isOpen={isOpen}
          onCloseModal={handleCloseModal}
        />
      )} */}
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default Login;
