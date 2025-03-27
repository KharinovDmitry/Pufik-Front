import React, { useEffect, useState } from 'react';
import { useCart } from '../../../context/CartContext';
import CartItem from '../CartItem';
import {
    ModalOverlay,
    ModalContainer,
    Header,
    CloseButton,
    EmptyMessage,
    CheckoutButton,
    SummaryRow,
    WarningMessage,
    ItemsContainer,
    ModalContent
} from './styles';

const CartModal = () => {
    const {
        items,
        isCartOpen,
        highlightItems,
        actions: { toggleCart, removeItem, updateQuantity }
    } = useCart();

    const [unavailableItems, setUnavailableItems] = useState([]);

    useEffect(() => {
        if (isCartOpen) {
            const unavailable = items.filter(
                item => item.inventory.balance < item.count
            );
            setUnavailableItems(unavailable);
        }
    }, [isCartOpen, items]);

    const totalSum = items.reduce(
        (sum, item) => sum + (item.count * item.inventory.cost_per_day),
        0
    );

    if (!isCartOpen) return null;

    return (
        <ModalOverlay onClick={toggleCart}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <ModalContent>
                    <Header>
                        <h3>Ваша корзина ({items.length})</h3>
                        <CloseButton onClick={toggleCart}>&times;</CloseButton>
                    </Header>

                    {items.length === 0 ? (
                        <EmptyMessage>
                            <img src="/empty-cart.svg" alt="Пустая корзина" width={120} />
                            <p>Корзина пуста</p>
                        </EmptyMessage>
                    ) : (
                        <>
                            <ItemsContainer>
                                {unavailableItems.length > 0 && (
                                    <WarningMessage>
                                        ⚠ Некоторые товары недоступны в выбранном количестве
                                    </WarningMessage>
                                )}

                                {items.map(item => (
                                    <CartItem
                                        key={item.uuid}
                                        item={item}
                                        highlighted={highlightItems[item.uuid]}
                                        onRemove={() => removeItem(item.uuid)}
                                        onQuantityChange={(newCount) =>
                                            updateQuantity(item.uuid, Math.min(newCount, item.inventory.balance))
                                        }
                                        maxQuantity={item.inventory.balance}
                                        isAvailable={item.inventory.balance >= item.count}
                                    />
                                ))}
                            </ItemsContainer>

                            <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
                                <SummaryRow>
                                    <span>Товаров:</span>
                                    <span>{items.reduce((sum, item) => sum + item.count, 0)} шт.</span>
                                </SummaryRow>
                                <SummaryRow>
                                    <span>Итого:</span>
                                    <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>{totalSum} ₽</span>
                                </SummaryRow>
                                <CheckoutButton
                                    onClick={() => console.log('Оформление заказа')}
                                    disabled={unavailableItems.length > 0}
                                >
                                    Оформить заказ
                                </CheckoutButton>
                            </div>
                        </>
                    )}
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default CartModal;