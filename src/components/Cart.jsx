import React, { useState, useEffect } from 'react';
import { CartService } from '../services/Cart';
import styled, { keyframes, css } from 'styled-components';

const CartContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 1rem;
  width: 300px;
  z-index: 1000;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

const CartButton = styled.button`
  background: ${props => props.$primary ? '#0d6efd' : '#dc3545'};
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
`;

const highlight = keyframes`
  0% { background-color: rgba(13, 110, 253, 0.1); }
  100% { background-color: transparent; }
`;

const AnimatedCartItem = styled(CartItem)`
  ${props => props.$highlight && css`
    animation: ${highlight} 1s ease-out;
  `}
`;

const Cart = ({ cartItems, setCartItems, onAdd, onRemove, onClose, onCheckout }) => {
    const [highlightedItem, setHighlightedItem] = useState(null);

    const handleAdd = async (inventoryUuid) => {
        try {
            await onAdd(inventoryUuid); // Используем переданный из Home обработчик

            const addedItem = cartItems.find(item =>
                item.inventory.uuid === inventoryUuid
            );
            if (addedItem) {
                setHighlightedItem(addedItem.uuid);
                setTimeout(() => setHighlightedItem(null), 1000);
            }
        } catch (err) {
            console.error('Failed to add item:', err);
        }
    };

    const handleRemove = async (itemUuid) => {
        try {
            await onRemove(itemUuid); // Используем переданный из Home обработчик
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContainer>
            <h3>Корзина</h3>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <AnimatedCartItem
                            key={item.uuid}
                            $highlight={highlightedItem === item.uuid}
                        >
                            <span>
                                {item.inventory?.name || 'Товар'} - {item.count} шт.
                            </span>
                            <div>
                                <CartButton
                                    $primary
                                    onClick={() => handleAdd(item.inventory.uuid)}
                                >
                                    +
                                </CartButton>
                                <CartButton
                                    onClick={() => handleRemove(item.uuid)}
                                >
                                    -
                                </CartButton>
                            </div>
                        </AnimatedCartItem>
                    ))}
                    <button
                        onClick={onCheckout}
                        style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            marginTop: '1rem',
                            width: '100%'
                        }}
                    >
                        Оформить заказ
                    </button>
                </div>
            )}
        </CartContainer>
    );
};

export default Cart;