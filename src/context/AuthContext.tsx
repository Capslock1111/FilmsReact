import { createContext, useState, useEffect } from "react";
import { authService } from "../services/AuthService";
import { ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: any) => void; // <-- Добавляем
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUserState] = useState<any | null>(null); // <-- Переименовали

  useEffect(() => {
    const checkAuth = () => {
      const auth = authService.isAuthenticated();
      setIsAuthenticated(auth);

      if (auth) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const success = await authService.login(username, password);
    if (success) {
      setIsAuthenticated(true);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    return success;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Функция для обновления пользователя извне (из Profile)
  const setUser = (userData: any) => {
    setUserState(userData);
    if (userData) {
      authService.setCurrentUser(userData);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
