// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../schemas/register.schema";

const genres = [
  'Комедия',
  'Драма',
  'Боевик',
  'Ужасы',
  'Фантастика',
  'Триллер',
  'Мелодрама',
  'Детектив',
  'Приключения',
  'Анимация'
];
function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 2MB');
      return;
    }

    // Проверка типа
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Поддерживаются только JPEG, PNG, WEBP');
      return;
    }

    setAvatarFile(file);

    // Превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      gender: '',
      favoriteGenre: '',
      agreeToTerms: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError('');

    try {
      // Сохраняем данные пользователя в localStorage
      const userData = {
        username: data.username,
        email: data.email,
        avatar: avatarPreview, // Base64 строка
        registeredAt: new Date().toISOString()
      };

      // Сохраняем в localStorage
      localStorage.setItem('cinemahub_user', JSON.stringify(userData));

      console.log('Регистрация:', userData);
      navigate('/login');
    } catch (err) {
      setServerError('Ошибка при регистрации. Попробуйте позже.');
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

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
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
              {...register('username')}
              disabled={isLoading}
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
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
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
              {...register('password')}
              disabled={isLoading}
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
              {...register('confirmPassword')}
              disabled={isLoading}
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
              {...register('birthDate')}
              disabled={isLoading}
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
                  {...register('gender')}
                  disabled={isLoading}
                />
                <span>Мужской</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                  disabled={isLoading}
                />
                <span>Женский</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  value="other"
                  {...register('gender')}
                  disabled={isLoading}
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
              {...register('favoriteGenre')}
              disabled={isLoading}
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
                <span className="avatar-placeholder">👤</span>
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
          </div>

          {/* Terms Agreement */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('agreeToTerms')}
                disabled={isLoading}
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
            disabled={isLoading}
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

export default Register;
