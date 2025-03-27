import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth';
import {TG_BOT_NAME} from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = (userData) => {
        localStorage.setItem('auth_token', userData.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setError(null);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    const startAuthFlow = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Получаем challenge от бэкенда
            const { challenge } = await AuthService.getChallenge();

            // 2. Открываем Telegram в новой вкладке
            const telegramUrl = `https://t.me/${TG_BOT_NAME}?start=${challenge}`;
            window.open(telegramUrl, '_blank');

            // 3. Начинаем опрашивать сервер на наличие токена
            const authData = await AuthService.pollForToken(challenge);

            // 4. Если токен получен - логиним пользователя
            login(authData);

        } catch (err) {
            setError(err.message || 'Ошибка авторизации');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            logout,
            startAuthFlow
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);