import { AuthProvider } from "./AuthContext";
import { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}
// Компонент, который объединяет все провайдеры
export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>

      {children}

    </AuthProvider>
  );
}
