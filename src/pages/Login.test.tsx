import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { AuthContext } from "../context/AuthContext";
import userEvent from "@testing-library/user-event";

const mockAuthValue = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
};

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <AuthContext.Provider value={mockAuthValue}>
                <Login />
            </AuthContext.Provider>

        </BrowserRouter>
    )
};

describe('Login Component', () => {
    it('renders login form', () => {
        renderLogin();

        expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument();
        expect(screen.getByLabelText('Имя пользователя')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
    });
});

describe('Login form interactions', () => {
    it('calls login with correct credentials on submit', async () => {
        const mockLogin = vi.fn().mockResolvedValue(true)
        const mockAuth = { ...mockAuthValue, login: mockLogin }

        render(
            <BrowserRouter>
                <AuthContext.Provider value={mockAuth}>
                    <Login />
                </AuthContext.Provider>

            </BrowserRouter>
        )

        const user = userEvent.setup()

        await user.type(screen.getByLabelText('Имя пользователя'), 'admin')
        await user.type(screen.getByLabelText('Пароль'), '11111')
        await user.click(screen.getByRole('button', { name: /войти/i }))

        expect(mockLogin).toHaveBeenLastCalledWith('admin', '11111')
    });
});

it('shows error message when login fails', async () => {
    const mockLogin = vi.fn().mockResolvedValue(false)
    const mockAuth = { ...mockAuthValue, login: mockLogin }

    render(
        <BrowserRouter>
            <AuthContext.Provider value={mockAuth}>
                <Login />
            </AuthContext.Provider>
        </BrowserRouter>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Имя пользователя'), 'wrong')
    await user.type(screen.getByLabelText('Пароль'), 'wrong')
    await user.click(screen.getByRole('button', { name: /войти/i }))

    // Проверяем, что сообщение об ошибке появилось
    expect(await screen.findByText(/неверный логин или пароль/i)).toBeInTheDocument()
})