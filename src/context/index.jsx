import { AuthProvider } from "./AuthContext";
import { SearchProvider } from "./SearchContext";
import { ThemeProvider } from "./ThemeContext";

// Компонент, который объединяет все провайдеры
export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <SearchProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
