import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TelegramAuthButton from '../components/tg-auth-button';
import { API_GATEWAY, API_ENDPOINTS } from '../config';

// Стилизованные компоненты
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 2rem;
`;

const MainCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(90deg, #ffffff, #f8f9fa);
`;

const Title = styled.h1`
  margin: 0;
  color: #212529;
  font-size: 1.75rem;
  font-weight: 600;
  background: linear-gradient(90deg, #0d6efd, #0dcaf0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Content = styled.div`
  padding: 2rem;
`;

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const InventoryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e9ecef;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ItemName = styled.h3`
  margin: 0 0 0.5rem;
  color: #212529;
  font-size: 1.25rem;
`;

const ItemBalance = styled.p`
  margin: 0;
  font-size: 1.1rem;
  color: ${props => props.$low ? '#dc3545' : '#28a745'};
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #dc3545;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.25rem;
`;

const Home = () => {
    const [error, setError] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch(`${API_GATEWAY}${API_ENDPOINTS.INVENTORY.AVAILABLE}`);
                if (!response.ok) {
                    throw new Error('Не удалось загрузить инвентарь');
                }
                const data = await response.json();
                setInventory(data);
            } catch (err) {
                console.error('Ошибка загрузки инвентаря:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    return (
        <PageContainer>
            <MainCard>
                <Header>
                    <Title>Аренда мягкого инвентаря</Title>
                    <TelegramAuthButton
                        onError={setError}
                        onSuccess={(challenge) => console.log('Challenge received:', challenge)}
                    />
                </Header>

                <Content>
                    <h2>Доступные товары</h2>

                    {loading ? (
                        <p>Загрузка инвентаря...</p>
                    ) : (
                        <InventoryGrid>
                            {inventory.map(item => (
                                <InventoryCard key={item.id}>
                                    <ItemName>{item.name}</ItemName>
                                    <ItemBalance $low={item.balance <= 0}>
                                        {item.balance > 0 ? `Осталось: ${item.balance}` : 'Нет в наличии'}
                                    </ItemBalance>
                                </InventoryCard>
                            ))}
                        </InventoryGrid>
                    )}
                </Content>
            </MainCard>

            {error && (
                <ErrorMessage role="alert">
                    ⚠️ {error}
                    <CloseButton
                        onClick={() => setError(null)}
                        aria-label="Закрыть ошибку"
                    >
                        &times;
                    </CloseButton>
                </ErrorMessage>
            )}
        </PageContainer>
    );
};

export default Home;