// components/cart/CartModal/index.jsx
import React from 'react';
import { useCart } from '../../../context/CartContext';
import CartItem from '../CartItem';
import {
    ModalOverlay,
    ModalContainer,
    Header,
    CloseButton,
    EmptyMessage,
    CheckoutButton
} from './styles';

const Index = () => {
    const {
        items,
        isCartOpen,
        highlightItems,
        actions: { toggleCart, removeItem, updateQuantity }
    } = useCart();

    if (!isCartOpen) return null;

    const totalSum = items.reduce(
        (sum, item) => sum + (item.count * item.inventory.cost_per_day),
        0
    );

    return (
        <ModalOverlay onClick={toggleCart}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <Header>
                    <h3>Ваша корзина</h3>
                    <CloseButton onClick={toggleCart}>&times;</CloseButton>
                </Header>

                {items.length === 0 ? (
                    <EmptyMessage>Корзина пуста</EmptyMessage>
                ) : (
                    <>
                        <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                            {items.map(item => (
                                <CartItem
                                    key={item.uuid}
                                    item={item}
                                    highlighted={highlightItems[item.uuid]}
                                    onRemove={() => removeItem(item.uuid)}
                                    onQuantityChange={(newCount) =>
                                        updateQuantity(item.uuid, newCount)
                                    }
                                />
                            ))}
                        </div>

                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span>Итого:</span>
                                <span style={{ fontWeight: '600' }}>{totalSum} ₽</span>
                            </div>
                            <CheckoutButton onClick={() => console.log('Оформление заказа')}>
                                Оформить заказ
                            </CheckoutButton>
                        </div>
                    </>
                )}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default Index;