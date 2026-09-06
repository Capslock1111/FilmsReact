// import { render, screen } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import Login from "./Login";
// import { AuthContext } from "../context/AuthContext";
// import userEvent from "@testing-library/user-event";

// const mockAuthValue = {
//     isAuthenticated: false,
//     isLoading: false,
//     user: null,
//     login: vi.fn(),
//     logout: vi.fn(),
//     setUser: vi.fn(),
// };

// const renderLogin = () => {
//     return render(
//         <BrowserRouter>
//             <AuthContext.Provider value={mockAuthValue}>й
//                 <Login />
//             </AuthContext.Provider>

//         </BrowserRouter>
//     )
// };

// describe('Login Component', () => {
//     it('renders login form', () => {
//         renderLogin();

//         expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument();
//         expect(screen.getByLabelText('Имя пользователя')).toBeInTheDocument();
//         expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
//         expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
//     });
// });

// describe('Login form interactions', () => {
//     it('calls login with correct credentials on submit', async () => {
//         const mockLogin = vi.fn().mockResolvedValue(true)
//         const mockAuth = { ...mockAuthValue, login: mockLogin }

//         render(
//             <BrowserRouter>
//                 <AuthContext.Provider value={mockAuth}>
//                     <Login />
//                 </AuthContext.Provider>

//             </BrowserRouter>
//         )

//         const user = userEvent.setup()

//         await user.type(screen.getByLabelText('Имя пользователя'), 'admin')
//         await user.type(screen.getByLabelText('Пароль'), '11111')
//         await user.click(screen.getByRole('button', { name: /войти/i }))

//         expect(mockLogin).toHaveBeenLastCalledWith('admin', '11111')
//     });
// });

// it('shows error message when login fails', async () => {
//     const mockLogin = vi.fn().mockResolvedValue(false)
//     const mockAuth = { ...mockAuthValue, login: mockLogin }

//     render(
//         <BrowserRouter>
//             <AuthContext.Provider value={mockAuth}>
//                 <Login />
//             </AuthContext.Provider>
//         </BrowserRouter>
//     )

//     const user = userEvent.setup()

//     await user.type(screen.getByLabelText('Имя пользователя'), 'wrong')
//     await user.type(screen.getByLabelText('Пароль'), 'wrong')
//     await user.click(screen.getByRole('button', { name: /войти/i }))

//     // Проверяем, что сообщение об ошибке появилось
//     expect(await screen.findByText(/неверный логин или пароль/i)).toBeInTheDocument()
// })

// Login.test.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogService from '../services/LogService';

interface LoginProps {
    onLoginSuccess?: (user: any) => void;
}

// Простая имитация пользователей
const VALID_USERS = [
    { username: 'admin', password: '11111', id: 1, name: 'Admin' },
    { username: 'user', password: '12345', id: 2, name: 'User' },
    { username: 'demo', password: 'demo123', id: 3, name: 'Demo User' },
];

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 500));

            // Проверка credentials
            const user = VALID_USERS.find(
                u => u.username === username && u.password === password
            );

            if (user) {
                // Создаем объект пользователя без пароля
                const userData = {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                };

                // Сохраняем в localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isAuthenticated', 'true');

                if (onLoginSuccess) {
                    onLoginSuccess(userData);
                }

                navigate('/');
            } else {
                setError('Неверный логин или пароль');
            }
        } catch (err) {
            console.error('Ошибка входа:', err);
            setError('Произошла ошибка при входе. Попробуйте позже.');

            const errorObject = err instanceof Error ? err : new Error(String(err));
            LogService.error('Login failed', errorObject);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Добро пожаловать!</h1>
                <p className="login-subtitle">Войдите в свой аккаунт</p>

                {error && (
                    <div className="login-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                            disabled={isLoading}
                            aria-label="Имя пользователя"
                            className="login-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            disabled={isLoading}
                            aria-label="Пароль"
                            className="login-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="login-button"
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="login-help">
                    <p>Тестовые данные:</p>
                    <ul>
                        <li>admin / 11111</li>
                        <li>user / 12345</li>
                        <li>demo / demo123</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;