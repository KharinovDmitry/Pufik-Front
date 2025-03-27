import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TelegramAuthButton from '../components/TgAuthButton';
import Cart from '../components/Cart';
import { API_GATEWAY, API_ENDPOINTS } from '../config';
import { CartService } from '../services/Cart';

// Стилизованные компоненты
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 2rem;
  position: relative;
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
  position: relative;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const InventoryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ItemName = styled.h3`
  margin: 0;
  color: #212529;
  font-size: 1.25rem;
`;

const ItemPrice = styled.span`
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  color: #0d6efd;
`;

const ItemMeta = styled.div`
  margin: 0.5rem 0;
`;

const ItemBalance = styled.p`
  margin: 0;
  color: ${props => props.$low ? '#dc3545' : '#28a745'};
  font-weight: 500;
`;

const AddToCartButton = styled.button`
  margin-top: auto;
  background: ${props => props.$available ? '#0d6efd' : '#adb5bd'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: ${props => props.$available ? 'pointer' : 'not-allowed'};
  transition: all 0.2s;
  align-self: flex-start;

  &:hover {
    background: ${props => props.$available ? '#0b5ed7' : '#adb5bd'};
  }
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
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventoryResponse = await fetch(`${API_GATEWAY}${API_ENDPOINTS.INVENTORY.AVAILABLE}`);
                if (!inventoryResponse.ok) throw new Error('Не удалось загрузить инвентарь');
                const inventoryData = await inventoryResponse.json();
                setInventory(inventoryData);

                // Добавляем обработку ошибок для корзины
                try {
                    const cartItems = await CartService.getCart();
                    setCartItems(cartItems || []); // Гарантируем, что это массив
                } catch (cartError) {
                    console.error('Ошибка загрузки корзины:', cartError);
                    setCartItems([]);
                }
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = async (inventoryUuid) => {
        setCartLoading(true);
        try {
            const updatedCart = await CartService.addItem(inventoryUuid);
            setCartItems(updatedCart); // Обновляем состояние корзины

            if (!showCart) {
                setShowCart(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveFromCart = async (cartItemUuid) => {
        try {
            const updatedCart = await CartService.removeItem(cartItemUuid);
            setCartItems(updatedCart);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCheckout = () => {
        const isAuthenticated = !!localStorage.getItem('auth_token');
        if (isAuthenticated) {
            // Переход к оформлению заказа
            console.log('Переход к оформлению заказа');
        } else {
            // Показать модалку авторизации
            setShowCart(false);
            // Здесь можно вызвать модалку авторизации
            console.log('Требуется авторизация');
        }
    };

    return (
        <PageContainer>
            <MainCard>
                <Header>
                    <Title>Аренда мягкого инвентаря</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setShowCart(!showCart)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            🛒
                            {cartItems.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: '#dc3545',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem'
                                }}>
                                    {cartItems.reduce((sum, item) => sum + item.count, 0)}
                                </span>
                            )}
                        </button>
                        <TelegramAuthButton
                            onError={setError}
                            onSuccess={async () => {
                                try {
                                    const updatedCart = await CartService.syncCart();
                                    setCartItems(updatedCart || []); // Гарантируем массив
                                } catch (error) {
                                    console.error('Ошибка синхронизации корзины:', error);
                                    setError('Ошибка синхронизации корзины');
                                }
                            }}
                        />
                    </div>
                </Header>

                <Content>
                    <h2 style={{ color: '#212529', marginBottom: '1rem' }}>Доступные товары</h2>

                    {loading ? (
                        <p>Загрузка инвентаря...</p>
                    ) : (
                        <InventoryGrid>
                            {inventory.map(item => (
                                <InventoryCard key={item.id}>
                                    <ItemHeader>
                                        <ItemName>{item.name}</ItemName>
                                        <ItemPrice>{item.cost_per_day} ₽/день</ItemPrice>
                                    </ItemHeader>
                                    <ItemMeta>
                                        <ItemBalance $low={item.balance <= 0}>
                                            {item.balance > 0 ? `Осталось: ${item.balance}` : 'Нет в наличии'}
                                        </ItemBalance>
                                    </ItemMeta>
                                    <AddToCartButton
                                        onClick={() => item.balance > 0 && handleAddToCart(item.id)}
                                        $available={item.balance > 0}
                                        disabled={item.balance <= 0}
                                    >
                                        {item.balance > 0 ? 'В корзину' : 'Нет в наличии'}
                                    </AddToCartButton>
                                </InventoryCard>
                            ))}
                        </InventoryGrid>
                    )}
                </Content>
            </MainCard>

            {showCart && (
                <Cart
                    cartItems={cartItems}
                    loading={cartLoading}
                    setCartItems={setCartItems}
                    onAdd={handleAddToCart}
                    onRemove={handleRemoveFromCart}
                    onClose={() => setShowCart(false)}
                    onCheckout={handleCheckout}
                />
            )}

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