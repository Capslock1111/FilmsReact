class AuthService {
  constructor() {
    // Статичные данные для входа
    this.validCredentials = {
      username: "admin",
      password: "1111",
    };

    // Ключ для localStorage
    this.STORAGE_KEY = "cinemahub_auth";
  }

  /**
   * Проверка, авторизован ли пользователь
   * @returns {boolean}
   */
  isAuthenticated() {
    return localStorage.getItem(this.STORAGE_KEY) === "true";
  }

  /**
   * Попытка входа
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async login(username, password) {
    // Имитация задержки сервера (для реализма)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isValid =
      username === this.validCredentials.username &&
      password === this.validCredentials.password;

    if (isValid) {
      localStorage.setItem(this.STORAGE_KEY, "true");
      return true;
    }

    return false;
  }

  /**
   * Выход из системы
   */
  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Создаем и экспортируем единственный экземпляр (синглтон)
export const authService = new AuthService();
