import { AuthProvider } from "./AuthContext";
import { SearchProvider } from "./SearchContext";
import { ModalProvider } from "./ModalContext";

export function AppProvider({ children }) {
    return (
        <AuthProvider>
            <SearchProvider>
                <ModalProvider>{children}</ModalProvider>
            </SearchProvider>
        </AuthProvider>
    )
}