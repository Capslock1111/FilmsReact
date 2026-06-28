import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../schemas/register.schema";
import "./Register.css";
import { authService } from "../services/AuthService";
import { GENRES as genres } from "../constants/genres";

// Список жанров для выпадающего списк

export default function Register() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой. Максимум 2MB");
      e.target.value = "";
      return;
    }

    // ✅ Показываем сообщение о загрузке
    setUploadStatus("Загрузка...");

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setUploadStatus("Файл загружен! ✅");

      // Скрываем сообщение через 2 секунды
      setTimeout(() => setUploadStatus(""), 2000);
    };
    reader.onerror = () => {
      setUploadStatus("Ошибка загрузки");
      setTimeout(() => setUploadStatus(""), 2000);
    };
    reader.readAsDataURL(file);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const handleFormSubmit = (data: RegisterFormData) => {
    console.log("🔥 onSubmit вызван!", data);
    setIsLoading(true);
    setServerError("");

    try {
      // Регистрация через AuthService
      const success = authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
        avatar: avatarPreview,
      });

      if (success) {
        console.log("✅ Пользователь зарегистрирован!");
        // Переход на страницу логина
        navigate("/login");
      } else {
        setServerError("Пользователь с таким именем уже существует");
      }
    } catch (err) {
      setServerError("Ошибка при регистрации. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="register-logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">CinemaHub</span>
          </div>
          <h1 className="register-title">Регистрация</h1>
          <p className="register-subtitle">Стань частью киносообщества</p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Имя пользователя <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              className={`form-input ${errors.username ? "error" : ""}`}
              placeholder="Введите логин"
              disabled={isLoading}
              {...register("username")}
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="example@mail.com"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Минимум 6 символов"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Подтверждение пароля <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              placeholder="Повторите пароль"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Birth Date */}
          <div className="form-group">
            <label htmlFor="birthDate" className="form-label">
              Дата рождения
            </label>
            <input
              type="date"
              id="birthDate"
              className="form-input"
              disabled={isLoading}
              {...register("birthDate")}
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">Пол</label>
            <div className="gender-group">
              <label className="gender-option">
                <input
                  type="radio"
                  value="male"
                  disabled={isLoading}
                  {...register("gender")}
                />
                <span>Мужской</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  value="female"
                  disabled={isLoading}
                  {...register("gender")}
                />
                <span>Женский</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  value="other"
                  disabled={isLoading}
                  {...register("gender")}
                />
                <span>Другой</span>
              </label>
            </div>
          </div>

          {/* Favorite Genre */}
          <div className="form-group">
            <label htmlFor="favoriteGenre" className="form-label">
              Любимый жанр
            </label>
            <select
              id="favoriteGenre"
              className="form-select"
              disabled={isLoading}
              {...register("favoriteGenre")}
            >
              <option value="">Выберите жанр</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Avatar Upload */}
          <div className="form-group">
            <label className="form-label">Аватар (необязательно)</label>
            <div className="avatar-upload">
              <div className="avatar-preview" id="avatarPreview">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="avatar-image"
                  />
                ) : (
                  <span className="avatar-placeholder">👤</span>
                )}
              </div>
              <input
                type="file"
                id="avatar"
                accept="image/jpeg,image/png,image/webp"
                className="form-input-file"
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
              <small className="form-hint">PNG, JPG или WEBP, до 2MB</small>
            </div>
            {uploadStatus && (
              <div className="upload-status">{uploadStatus}</div>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                disabled={isLoading}
                {...register("agreeToTerms")}
              />
              <span>
                Я соглашаюсь с{" "}
                <Link to="/terms" className="terms-link">
                  правилами использования
                </Link>{" "}
                и{" "}
                <Link to="/privacy" className="terms-link">
                  политикой конфиденциальности
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="error-message">{errors.agreeToTerms.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-accent register-btn"
          // disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="register-footer">
          <Link to="/login" className="register-footer-link">
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
