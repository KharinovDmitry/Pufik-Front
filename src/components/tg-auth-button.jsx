import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {API_GATEWAY} from "../config";

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

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  font-weight: 500;
  padding: 10px 15px;
  background: #f0f8ff;
  border-radius: 50px;
`;

const TelegramAuthButton = ({
                                botName = 'PUFIK_ID_BOT',
                                endpoints = {
                                    GET_CHALLENGE: '/api/auth/telegram/challenge',
                                    VERIFY_AUTH: '/api/auth/telegram/token'
                                },
                                onError,
                                onSuccess
                            }) => {
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Проверяем авторизацию при монтировании компонента
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
    }, []);

    const handleTelegramAuth = async () => {
        setLoading(true);

        try {
            const challengeUrl = `http://45.83.143.192:8080${endpoints.GET_CHALLENGE}`;
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

    // Если пользователь авторизован, возвращаем null (ничего не рендерим)
    if (isAuthenticated) {
        return null;
    }

    // Рендерим кнопку только для неавторизованных пользователей
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