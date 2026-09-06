import { useState, SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { useAuthStore } from "../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { useLogin } from '../api/hooks/useAuth';

function Login() {
  const [serverError, setServerError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

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

  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: (success) => {
          if (success) {
            navigate("/");
          } else {
            setServerError("Неверный логин или пароль");
          }
        },
        onError: () => {
          setServerError("Ошибка при входе. Попробуйте позже.");
        },
      }
    );
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
              disabled={isPending}
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
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-accent login-btn"
            disabled={isPending}
          >
            {isPending ? "Вход..." : "Войти"}
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
