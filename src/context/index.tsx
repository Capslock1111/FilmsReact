import { AuthProvider } from "./AuthContext";
import { SearchProvider } from "./SearchContext";
import { ThemeProvider } from "./ThemeContext";
import { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}
// Компонент, который объединяет все провайдеры
export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <SearchProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
