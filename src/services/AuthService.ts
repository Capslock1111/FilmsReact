class AuthService {
  private STORAGE_KEY = "cinemahub_auth";
  private USERS_KEY = "cinemahub_users";
  private CURRENT_USER_KEY = "cinemahub_current_user";

  // Проверка авторизации
  isAuthenticated(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === "true";
  }

  // Получить всех пользователей
  getUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  // Получить текущего пользователя
  getCurrentUser(): any | null {
    try {
      return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || "null");
    } catch {
      return null;
    }
  }

  // Установить текущего пользователя
  setCurrentUser(user: any): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  // Вход с сохранением пользователя
  async login(username: string, password: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = this.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      localStorage.setItem(this.STORAGE_KEY, "true");
      this.setCurrentUser(user);
      return true;
    }

    return false;
  }

  // Регистрация
  register(userData: {
    username: string;
    email: string;
    password: string;
    avatar?: string | null;
  }): boolean {
    const users = this.getUsers();

    if (users.some((u) => u.username === userData.username)) {
      return false;
    }

    const newUser = {
      ...userData,
      registeredAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }

  // Выход
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
  updateUser(updatedUser: any): boolean {
    try {
      const users = this.getUsers();
      const index = users.findIndex((u) => u.username === updatedUser.username);
      if (index === -1) {
        return false;
      }
      users[index] = updatedUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      // Обновляем текущего пользователя, если это он
      const currentUser = this.getCurrentUser();
      if (currentUser?.username === updatedUser.username) {
        this.setCurrentUser(updatedUser);
      }
      return true;
    } catch {
      return false;
    }
  }

}

export const authService = new AuthService();
