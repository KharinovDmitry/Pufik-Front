import { useState } from 'react';
import { useAuth } from "../../context/TgAuthContext";
import { AuthButton, UserWrapper, TelegramIcon, LogoutButton } from "./styles";
import { ConfirmModal } from '../ConfirmModal';

const TgAuthButton = () => {
    const { user, loading, logout, startAuthFlow } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleAuth = async () => {
        try {
            await startAuthFlow();
        } catch (err) {
            console.error('Auth error:', err);
        }
    };

    const handleLogoutClick = (e) => {
        e.stopPropagation();
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <AuthButton
                onClick={!user ? handleAuth : undefined}
                $isLoggedIn={!!user}
                disabled={loading}
            >
                {loading ? (
                    'Подготовка...'
                ) : user ? (
                    <UserWrapper>
                        <span>👤 {user.login}</span>
                        <LogoutButton
                            onClick={handleLogoutClick}
                            title="Выйти"
                            aria-label="Выйти из аккаунта"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </LogoutButton>
                    </UserWrapper>
                ) : (
                    <>
                        <TelegramIcon src="/icons/telegram.svg" alt="Telegram" />
                        Войти через Telegram
                    </>
                )}
            </AuthButton>

            <ConfirmModal
                isOpen={showLogoutConfirm}
                title="Вы уверены, что хотите выйти?"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
                confirmText="Выйти"
                cancelText="Отмена"
            />
        </>
    );
};

export default TgAuthButton;