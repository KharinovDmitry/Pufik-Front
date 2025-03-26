import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { CartService } from '../services/Cart';

const API_HOST = 'http://45.83.143.192:8080';
const API_ENDPOINTS = {
    VERIFY_AUTH: '/api/auth/telegram/token',
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const INITIAL_DELAY_MS = 1500;

// Анимации
const spin = keyframes`to { transform: rotate(360deg); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const checkmarkAnimation = keyframes`
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
`;

// Стилизованные компоненты
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  border-top: 4px solid #10b981;
`;

const UserInfoCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const InfoLabel = styled.span`
  color: #6c757d;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #212529;
  font-weight: ${props => props.$highlight ? '600' : '400'};
  ${props => props.$highlight && 'color: #0d6efd;'}
`;

const Checkmark = styled.svg`
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: block;
  
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #10b981;
    fill: none;
    animation: ${checkmarkAnimation} 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }
  
  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    stroke: #10b981;
    animation: ${checkmarkAnimation} 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }
`;

const SuccessButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  min-height: 3rem;
  color: ${props => props.$isError ? '#dc2626' : '#1e293b'};
  font-size: 1.1rem;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(14, 165, 233, 0.3);
  border-radius: 50%;
  border-top-color: #0ea5e9;
  animation: ${spin} 1s ease-in-out infinite;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
`;

const TgAuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState({
        message: 'Подготовка к проверке авторизации...',
        isError: false,
        isLoading: true,
        isInitialCheck: true,
        isSuccess: false
    });
    const [userData, setUserData] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const query = new URLSearchParams(location.search);
    const challenge = query.get('challenge');

    useEffect(() => {
        if (!challenge) {
            navigate('/');
            return;
        }

        let timeoutId;

        const checkAuth = async () => {
            try {
                setStatus(prev => ({
                    ...prev,
                    message: 'Проверяем авторизацию...',
                    isError: false,
                    isLoading: true,
                    isInitialCheck: false
                }));

                const verifyUrl = new URL(`${API_HOST}${API_ENDPOINTS.VERIFY_AUTH}`);
                verifyUrl.searchParams.append('challenge', challenge);

                const res = await fetch(verifyUrl.toString(), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const { token, login, phone, user_uuid, role } = await res.json();

                if (token) {
                    // Сохраняем данные пользователя
                    const userData = { token, login, phone, user_uuid, role };
                    localStorage.setItem('auth_token', token);
                    localStorage.setItem('user_data', JSON.stringify(userData));
                    setUserData(userData);

                    setStatus({
                        message: 'Авторизация успешно завершена!',
                        isError: false,
                        isLoading: false,
                        isSuccess: true
                    });

                    try {
                        const updatedCart = await CartService.syncCart();
                        // Можно добавить обновление состояния через контекст или другие методы
                    } catch (error) {
                        console.error('Ошибка синхронизации корзины:', error);
                        // Можно добавить обработку ошибки, но не прерывать поток
                    }
                } else {
                    setStatus({
                        message: 'Авторизация еще не завершена. Пожалуйста, завершите процесс в Telegram.',
                        isError: false,
                        isLoading: false,
                        isSuccess: false
                    });
                }
            } catch (error) {
                console.error('Auth verification error:', error);
                const attemptsLeft = MAX_RETRIES - retryCount - 1;
                const errorMessage = attemptsLeft > 0
                    ? `Попытка ${retryCount + 1} из ${MAX_RETRIES}...`
                    : 'Не удалось проверить авторизацию. Пожалуйста, попробуйте снова.';

                setStatus({
                    message: errorMessage,
                    isError: attemptsLeft === 0,
                    isLoading: false,
                    isSuccess: false
                });

                if (retryCount < MAX_RETRIES - 1) {
                    timeoutId = setTimeout(() => setRetryCount(c => c + 1), RETRY_DELAY_MS);
                }
            }
        };

        timeoutId = setTimeout(checkAuth, status.isInitialCheck ? INITIAL_DELAY_MS : 0);

        return () => clearTimeout(timeoutId);
    }, [challenge, retryCount, navigate, status.isInitialCheck]);

    const handleContinue = () => {
        navigate('/', { replace: true });
    };

    if (status.isSuccess && userData) {
        return (
            <AuthContainer>
                <SuccessCard>
                    <Checkmark viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </Checkmark>
                    <h2 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
                        Добро пожаловать, {userData.login}!
                    </h2>

                    <UserInfoCard>
                        <InfoRow>
                            <InfoLabel>Логин:</InfoLabel>
                            <InfoValue $highlight>{userData.login}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>Телефон:</InfoLabel>
                            <InfoValue>{userData.phone || 'Не указан'}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>Роль:</InfoLabel>
                            <InfoValue>{userData.role}</InfoValue>
                        </InfoRow>
                    </UserInfoCard>

                    <SuccessButton onClick={handleContinue}>
                        Перейти в приложение
                    </SuccessButton>
                </SuccessCard>
            </AuthContainer>
        );
    }

    return (
        <AuthContainer>
            <AuthCard>
                <h2 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
                    Авторизация через Telegram
                </h2>

                <StatusMessage $isError={status.isError}>
                    {status.isLoading && <Spinner aria-hidden="true" />}
                    <p>{status.message}</p>
                </StatusMessage>

                {!status.isLoading && (
                    <ActionButtons>
                        <Button onClick={() => window.location.reload()}>
                            Обновить страницу
                        </Button>
                        <Button onClick={() => navigate('/', { replace: true })}>
                            На главную
                        </Button>
                    </ActionButtons>
                )}
            </AuthCard>
        </AuthContainer>
    );
};

export default TgAuthPage;