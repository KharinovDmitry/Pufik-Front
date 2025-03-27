import React from 'react';
import { useCart } from '../../../context/CartContext';
import { CartIcon, Counter, TotalPrice } from './styles';

const CartButton = () => {
    const { items, actions: { toggleCart } } = useCart();
    const totalItems = items.reduce((sum, item) => sum + item.count, 0);
    const totalSum = items.reduce((sum, item) => sum + (item.count * item.inventory.cost_per_day), 0);

    return (
        <button
            onClick={toggleCart}  // Это откроет/закроет модальное окно
            aria-label="Корзина"
            style={{
                background: 'none',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            <CartIcon>
                🛒
                {totalItems > 0 && <Counter>{totalItems}</Counter>}
            </CartIcon>
            {totalItems > 0 && (
                <TotalPrice>
                    {totalSum} ₽
                </TotalPrice>
            )}
        </button>
    );
};

export default CartButton;