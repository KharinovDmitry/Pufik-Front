import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "../../context/TgAuthContext";

const AuthPage = () => {
    const { user, login, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const challenge = searchParams.get('challenge');
    const [polling, setPolling] = useState(false);

    useEffect(() => {
        if (challenge && !user && !polling) {
            setPolling(true);

            const verifyToken = async () => {
                try {
                    const response = await fetch(
                        `http://45.83.143.192:8080/api/auth/telegram/verify?challenge=${challenge}`
                    );
                    const data = await response.json();

                    if (data.user && data.token) {
                        login(data);
                        navigate('/');
                    } else {
                        // Повторяем проверку через 2 секунды
                        setTimeout(verifyToken, 2000);
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    setTimeout(verifyToken, 2000);
                }
            };

            verifyToken();
        }
    }, [challenge, user, login, navigate, polling]);

    return (
        <div className="auth-page">
            {user ? (
                <div className="user-info">
                    <h2>Вы авторизованы</h2>
                    <button onClick={() => navigate('/')}>Продолжить</button>
                </div>
            ) : (
                <div className="auth-message">
                    <h2>Авторизация</h2>
                    {loading || polling ? (
                        <>
                            <p>Ожидаем подтверждения авторизации...</p>
                            <div className="spinner"></div>
                        </>
                    ) : (
                        <p>Пожалуйста, войдите через Telegram</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuthPage;