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
import {API_GATEWAY} from "../../../config";

const CartModal = () => {
    const {
        items,
        isCartOpen,
        highlightItems,
        actions: { toggleCart, removeItem, updateQuantity }
    } = useCart();


    const formatDate = (date) => {
        return date.toISOString();
    };

    const [unavailableItems, setUnavailableItems] = useState([]);
    const [address, setAddress] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

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

    const createOrder = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            alert("Необходимо войти в аккаунт");
            return;
        }

        console.log("fromDate:", fromDate);
        console.log("toDate:", toDate);


        const inventories = items.map(item => item.inventory.uuid);

        const body = { address,
            fromDate: formatDate(new Date(fromDate)),
            toDate: formatDate(new Date(toDate)),
            inventories};

        try {
            const response = await fetch(`${API_GATEWAY}/api/order/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Заказ успешно оформлен!");
            toggleCart();
            window.location.href = "/orders";
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            alert("Не удалось оформить заказ: " + error.message);
        }
    };

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

                                <div style={{ marginTop: '20px' }}>
                                    <label>Адрес:</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Введите адрес"
                                    />
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <label>Дата начала аренды:</label>
                                    <input
                                        type="datetime-local"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <label>Дата окончания аренды:</label>
                                    <input
                                        type="datetime-local"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>

                                <CheckoutButton
                                    onClick={createOrder}
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