import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const auth = authService.isAuthenticated();
            setIsAuthenticated(auth);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        const success = await authService.login(username, password);
        if (success) {
            setIsAuthenticated(true);
        }
        return success;
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        isLoading,
        login,
        logout,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}