import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Анимация спиннера
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Стилизованный компонент кнопки
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
  margin-top: 1rem;
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
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover:not(:disabled)::after {
    opacity: 1;
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

const TelegramIcon = styled.span`
  font-size: 1.3em;
  transition: transform 0.3s;
  
  ${AuthButton}:hover:not(:disabled) & {
    transform: scale(1.1);
  }
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
    const navigate = useNavigate();

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
                    <TelegramIcon aria-hidden="true">📱</TelegramIcon>
                    Войти через Telegram
                </>
            )}
        </AuthButton>
    );
};

export default TelegramAuthButton;