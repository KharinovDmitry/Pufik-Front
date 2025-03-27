import { useAuth } from '../../context/TgAuthContext';
import { useNavigate } from 'react-router-dom';

const TgAuthButton = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleAuth = () => {
        if (user) {
            logout();
        } else {
            navigate('/auth');
        }
    };

    return (
        <button onClick={handleAuth} className="auth-button">
            {user ? `👤 ${user.login}` : 'Войти через Telegram'}
        </button>
    );
};

export default TgAuthButton;