import { createContext, useState, useEffect } from "react";
import { authService } from "../services/AuthService";
import { ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
// 1. Создаём контекст
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Создаём провайдер
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const auth = authService.isAuthenticated();
      setIsAuthenticated(auth);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (username: string, password: string) => {
    const success = await authService.login(username, password);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  // Функция выхода
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  // Значения, которые будут доступны в контексте
  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
}
