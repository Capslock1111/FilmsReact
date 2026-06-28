import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData, profileSchema } from "../schemas/profile.schema";
import "./Profile.css";
import { useAuth } from "../context/useAuth";
import { GENRES as genres } from "../constants/genres";
import { authService } from "../services/AuthService";
import { p } from "motion/react-client";


function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      setValue('username', user.username || '');
      setValue('email', user.email || '');
      setValue('birthDate', user.birthDate || '');
      setValue('gender', user.gender || '');
      setValue('favoriteGenre', user.favoriteGenre || '');
      setAvatarPreview(user.avatar || null);
    };
    console.log('Проверка useEffect');
  }, [user, setValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой. Максимум 2MB");
      e.target.value = "";
      return;
    }
    setUploadStatus("Загрузка...");
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setUploadStatus("Файл загружен! ✅");
      setTimeout(() => setUploadStatus(""), 2000);
    };
    reader.onerror = () => {
      setUploadStatus("Ошибка загрузки");
      setTimeout(() => setUploadStatus(""), 2000);
    };
    reader.readAsDataURL(file);
  };
  const onSubmit = (data: ProfileFormData) => {
    console.log("🔥 onSubmit вызван!", data);
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      // Проверяем текущий пароль, если меняем пароль
      if (data.newPassword) {
        if (data.currentPassword !== user?.password) {
          setErrorMessage("❌ Неверный текущий пароль");
          setIsLoading(false);
          return;
        }
      }
      // Собираем данные для обновления
      const updatedUser = {
        ...user,
        username: data.username,
        email: data.email,
        birthDate: data.birthDate,
        gender: data.gender,
        favoriteGenre: data.favoriteGenre,
        avatar: avatarPreview || user?.avatar,
        // Если новый пароль есть - обновляем, иначе оставляем старый
        password: data.newPassword || user?.password,
        updatedAt: new Date().toISOString(),
      };
      console.log("📦 Обновленный пользователь:", updatedUser);
      const success = authService.updateUser(updatedUser);
      if (success) {
        setSuccessMessage("✅ Профиль успешно обновлен!");
        setUser(updatedUser);
        // Очищаем поля пароля
        setValue("currentPassword", "");
        setValue("newPassword", "");
        setValue("confirmNewPassword", "");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("❌ Ошибка при обновлении профиля");
      }
    } catch (err) {
      console.error("❌ Ошибка:", err);
      setErrorMessage("❌ Ошибка при обновлении профиля");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Настройки профиля</h1>
          <p className="profile-subtitle">Измените свои данные</p>
        </div>

        {successMessage && (
          <div className="profile-success">{successMessage}</div>
        )}
        {errorMessage && <div className="profile-error">{errorMessage}</div>}

        <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Avatar */}
          <div className="form-group">
            <label className="form-label">Аватар</label>
            <div className="avatar-upload">
              <div className="avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="avatar-image" />
                ) : (
                  <span className="avatar-placeholder">👤</span>
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="form-input-file"
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
              <small className="form-hint">PNG, JPG или WEBP, до 2MB</small>
            </div>
            {<div className="upload-status">{uploadStatus}</div>}
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Имя пользователя <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Введите логин"
              disabled={isLoading}
              {...register('username')}
            // ⬇️ ЗАДАНИЕ: добавь value, onChange, disabled
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
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="example@mail.com"
              disabled={isLoading}
              {...register('email')}
            // ⬇️ ЗАДАНИЕ: добавь value, onChange, disabled
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          {/* --- БЛОК СМЕНЫ ПАРОЛЯ --- */}
          <div className="form-group password-section">
            <h3 className="password-section-title">Смена пароля</h3>
            <p className="password-section-hint">
              Оставьте поля пустыми, если не хотите менять пароль
            </p>
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">
                Текущий пароль
              </label>
              <input
                type="password"
                id="currentPassword"
                className={`form-input ${errors.currentPassword ? "error" : ""}`}
                placeholder="Введите текущий пароль"
                disabled={isLoading}
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="error-message">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Новый пароль
              </label>
              <input
                type="password"
                id="newPassword"
                className={`form-input ${errors.newPassword ? "error" : ""}`}
                placeholder="Минимум 6 символов"
                disabled={isLoading}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="error-message">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword" className="form-label">
                Подтверждение нового пароля
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                className={`form-input ${errors.confirmNewPassword ? "error" : ""}`}
                placeholder="Повторите новый пароль"
                disabled={isLoading}
                {...register("confirmNewPassword")}
              />
              {errors.confirmNewPassword && (
                <p className="error-message">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>
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
          <button type="submit" className="btn btn-accent profile-btn">
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>

        <div className="profile-footer">
          <button onClick={() => navigate("/")} className="btn btn-outline">
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
