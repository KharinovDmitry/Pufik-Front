import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Анимация спиннера
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Стилизованные компоненты
const AuthButton = styled.button`
  position: relative;
  background: linear-gradient(135deg, #0088cc, #00a2ff);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 136, 204, 0.2);
  overflow: hidden;
  min-width: 200px;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0077bb, #0088cc);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 136, 204, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 136, 204, 0.2);
  }
  
  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
    background: linear-gradient(135deg, #0088cc, #00a2ff);
  }
`;

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const TelegramIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url('/icons/telegram.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  transition: transform 0.3s;
  
  ${AuthButton}:hover:not(:disabled) & {
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 50px;
  font-weight: 500;
  color: #333;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const UserLogin = styled.span`
  font-weight: 600;
  color: #0d6efd;
`;

const TelegramAuthButton = ({
                                botName = 'PUFIK_ID_BOT',
                                apiHost = 'http://45.83.143.192:8080',
                                endpoints = {
                                    GET_CHALLENGE: '/api/auth/telegram/challenge',
                                    VERIFY_AUTH: '/api/auth/telegram/token'
                                },
                                onError,
                                onSuccess
                            }) => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Проверяем авторизацию при монтировании
    useEffect(() => {
        const storedUserData = localStorage.getItem('user_data');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const handleTelegramAuth = async () => {
        setLoading(true);

        try {
            const challengeUrl = `${apiHost}${endpoints.GET_CHALLENGE}`;
            const response = await fetch(challengeUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { challenge } = await response.json();
            const deepLink = `https://t.me/${botName}?start=${challenge}`;
            window.open(deepLink, '_blank', 'noopener,noreferrer');
            navigate(`/tg-auth?challenge=${encodeURIComponent(challenge)}`);

            if (onSuccess) onSuccess(challenge);
        } catch (err) {
            console.error('Auth error:', err);
            if (onError) onError(err.message || 'Ошибка авторизации');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setUserData(null);
        // Можно добавить вызов API для логаута
    };

    // Если пользователь авторизован, показываем его данные
    if (userData) {
        return (
            <UserInfo>
                <span>Добро пожаловать, <UserLogin>{userData.login}</UserLogin></span>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Выйти
                </button>
            </UserInfo>
        );
    }

    // Если не авторизован, показываем кнопку входа
    return (
        <AuthButton
            onClick={handleTelegramAuth}
            disabled={loading}
            aria-busy={loading}
        >
            {loading ? (
                <>
                    <Spinner aria-hidden="true" />
                    Идет авторизация...
                </>
            ) : (
                <>
                    <TelegramIcon aria-hidden="true" />
                    Войти через Telegram
                </>
            )}
        </AuthButton>
    );
};

export default TelegramAuthButton;