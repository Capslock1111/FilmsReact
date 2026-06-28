import { useState, SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../context/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";

function Login() {
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  // Настройка формы
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // валидация при потере фокуса
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate("/");
      } else {
        setServerError("Неверный логин или пароль");
      }
    } catch (err) {
      setServerError("Ошибка при входе. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

        {serverError && <div className="login-error">⚠️ {serverError}</div>}

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              className={`form-input`}
              placeholder="Введите логин"
              disabled={isLoading}
              {...register("username")}
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className={`form-input`}
              placeholder="Введите пароль"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
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
            Логин: <strong>admin</strong> / Пароль: <strong>11111</strong>
          </p>
        </div>

        <div className="login-footer">
          <Link to="/register" className="login-footer-link">
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
