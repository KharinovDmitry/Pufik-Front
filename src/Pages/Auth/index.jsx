import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/TgAuthContext';
import TgAuthButton from '../../components/TgAuthButton';
import {API_GATEWAY} from "../../config";

const AuthPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            // Здесь запрос к вашему API для верификации токена
            fetch(`${API_GATEWAY}/api/auth/telegram/verify?token=${token}`)
                .then(res => res.json())
                .then(data => {
                    login(data.user);
                    navigate('/');
                });
        }
    }, [token]);

    return (
        <div className="auth-page">
            {user ? (
                <div className="user-info">
                    <h2>Вы авторизованы</h2>
                    <p>Логин: {user.login}</p>
                    <p>Телефон: {user.phone}</p>
                    <p>Роль: {user.role}</p>
                    <button onClick={() => navigate('/')}>Продолжить</button>
                </div>
            ) : (
                <TgAuthButton />
            )}
        </div>
    );
};

export default AuthPage;