import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Cart = () => {
    const { token } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // получаем товары из корзины при загрузке страницы
    useEffect(() => {
        if (!token) return;

        const fetchCart = async () => {
            try {
                const response = await axios.get('/api/order/cart/my', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Ошибка при получении корзины:', error);
            }
        };

        fetchCart();
    }, [token]);

    // уменьшаем количество товара
    const handleDecrement = async (uuid) => {
        if (!token) return;

        try {
            const response = await axios.delete('/api/order/cart/remove', {
                headers: { Authorization: `Bearer ${token}` },
                data: { cart_item_uuid: uuid },
            });

            if (!response.ok) throw new Error('Ошибка при уменьшении количества.');

            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.uuid === uuid ? { ...item, count: Math.max(0, item.count - 1) } : item
                ).filter(item => item.count > 0)
            );
        } catch (error) {
            console.error(error);
            alert('Не удалось уменьшить количество.');
        }
    };

    // увеличиваем количество товара
    const handleIncrement = async (uuid) => {
        if (!token) return;

        try {
            const response = await axios.post('/api/order/cart/add', { inventory_uuid: uuid }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Ошибка при увеличении количества.');

            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.uuid === uuid ? { ...item, count: item.count + 1 } : item
                )
            );
        } catch (error) {
            console.error(error);
            alert('Не удалось увеличить количество.');
        }
    };

    // создаем заказ
    const createOrder = async () => {
        if (!token || !address || !fromDate || !toDate) {
            alert('Заполните все поля.');
            return;
        }

        try {
            const orderData = {
                address,
                fromDate: new Date(fromDate).toISOString(),
                toDate: new Date(toDate).toISOString(),
                inventories: cartItems.map(item => item.uuid),
            };

            const response = await axios.post('/api/order/create', orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Ошибка при создании заказа.');

            alert('Заказ успешно создан!');
            setAddress('');
            setFromDate('');
            setToDate('');
            setCartItems([]);
        } catch (error) {
            console.error(error);
            alert('Не удалось создать заказ.');
        }
    };

    return (
        <div className="cart-container">
            <h1>Корзина</h1>

            {cartItems.length > 0 ? (
                <>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.uuid} className="cart-item">
                                <span>{item.inventory.name}</span>
                                <span>Количество: {item.count}</span>
                                <button onClick={() => handleDecrement(item.uuid)}>-</button>
                                <button onClick={() => handleIncrement(item.uuid)}>+</button>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <label>
                            Адрес доставки:
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Введите адрес"
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Дата начала аренды:
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Дата окончания аренды:
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button onClick={createOrder} className="btn btn__placeOrder">
                            Заказать
                        </button>
                    </form>
                </>
            ) : (
                <p>Ваша корзина пуста.</p>
            )}
        </div>
    );
};

export default Cart;