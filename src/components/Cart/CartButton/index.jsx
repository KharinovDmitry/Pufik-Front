import React from 'react';
import { useCart } from '../../../context/CartContext';
import { CartIcon, Counter } from './styles';

const Index = () => {
    const { items, isCartOpen, actions: { toggleCart } } = useCart();
    const totalItems = items.reduce((sum, item) => sum + item.count, 0);

    return (
        <button
            onClick={toggleCart}
            aria-label="Корзина"
            style={{
                background: 'none',
                border: 'none',
                position: 'relative',
                cursor: 'pointer'
            }}
        >
            <CartIcon>
                🛒
                {totalItems > 0 && <Counter>{totalItems}</Counter>}
            </CartIcon>
        </button>
    );
};

export default Index;