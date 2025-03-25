import React, { useState } from 'react';
import TelegramAuthButton from '../compnents/tg-auth-button';

const Home = () => {
    const [error, setError] = useState(null);

    return (
        <div className="home-container">
            <h1>Добро пожаловать</h1>

            <nav>
                <ul>
                    <li><Link to="/cart">Корзина</Link></li>
                    <li><Link to="/inventory">Инвентарь</Link></li>
                </ul>
            </nav>

            <TelegramAuthButton
                onError={setError}
                onSuccess={(challenge) => console.log('Challenge received:', challenge)}
            />

            {error && (
                <div className="error-message" role="alert">
                    ⚠️ {error}
                    <button
                        onClick={() => setError(null)}
                        className="error-close"
                        aria-label="Закрыть ошибку"
                    >
                        &times;
                    </button>
                </div>
            )}

            <style jsx>{`
        .home-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          text-align: center;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .error-message {
          color: #d32f2f;
          background: #fce7e7;
          padding: 12px;
          border-radius: 8px;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .error-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.2em;
          cursor: pointer;
          padding: 0 4px;
        }
      `}</style>
        </div>
    );
};

export default Home;