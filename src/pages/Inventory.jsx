import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Inventory = () => {
    const { token, role } = useContext(AuthContext);
    const [goods, setGoods] = useState([]);
    const [newGood, setNewGood] = useState({ name: '', balance: '' });

    // получаем список товаров при загрузке страницы
    useEffect(() => {
        if (!token) return;

        const fetchGoods = async () => {
            try {
                const response = await axios.get('/api/inventory/available', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGoods(response.data);
            } catch (error) {
                console.error('Ошибка при получении товаров:', error);
            }
        };

        fetchGoods();
    }, [token]);

    // добавляем товар
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newGood.name || !newGood.balance) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const response = await axios.post('/api/inventory/new', [{ name: newGood.name, balance: newGood.balance, status: 'available' }], {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Ошибка при добавлении товара.');

            setGoods(prevGoods => [...prevGoods, { id: generateUniqueId(), name: newGood.name, balance: newGood.balance }]);
            setNewGood({ name: '', balance: '' });
        } catch (error) {
            console.error(error);
            alert('Не удалось добавить товар.');
        }
    };

    // генерируем ID
    const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

    // обновляем статус товара
    const updateGood = async (id) => {
        const newStatus = prompt("Введите новый статус товара:", "доступен");

        if (!newStatus) return;

        try {
            const response = await axios.put('/api/inventory', [{ id, status: newStatus }], {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Ошибка при обновлении статуса.');

            setGoods(prevGoods =>
                prevGoods.map(good =>
                    good.id === id ? { ...good, status: newStatus } : good
                )
            );
        } catch (error) {
            console.error(error);
            alert('Не удалось обновить статус товара.');
        }
    };

    // Удаление товара
    const deleteGood = async (id) => {
        if (!confirm("Вы уверены, что хотите удалить этот товар?")) return;

        try {
            const response = await axios.delete(`/api/inventory/inventory/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Ошибка при удалении товара.');

            setGoods(prevGoods => prevGoods.filter(good => good.id !== id));
        } catch (error) {
            console.error(error);
            alert('Не удалось удалить товар.');
        }
    };

    // добавляем товар в корзину
    const addToCart = async (id) => {
        if (!token) return;

        try {
            const response = await axios.post('/api/order/cart/add', { inventory_uuid: id }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Ошибка при добавлении в корзину.');

            alert('Товар успешно добавлен в корзину.');
        } catch (error) {
            console.error(error);
            alert('Не удалось добавить товар в корзину.');
        }
    };

    return (
        <div className="inventory-container">
            <h1>Инвентарь</h1>

            {role === 'admin' && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newGood.name}
                        onChange={(e) => setNewGood({ ...newGood, name: e.target.value })}
                        placeholder="Название товара"
                        required
                    />
                    <input
                        type="number"
                        value={newGood.balance}
                        onChange={(e) => setNewGood({ ...newGood, balance: e.target.value })}
                        placeholder="Количество"
                        required
                    />
                    <button type="submit">Добавить товар</button>
                </form>
            )}

            <ul>
                {goods.map(good => (
                    <li key={good.id} className="inventory-item">
                        <strong>{good.name}</strong>
                        <br />
                        Статус: {good.status}
                        <br />
                        Количество: {good.balance}

                        {role === 'admin' ? (
                            <>
                                <button onClick={() => updateGood(good.id)}>Обновить</button>
                                <button onClick={() => deleteGood(good.id)}>Удалить</button>
                            </>
                        ) : (
                            <button onClick={() => addToCart(good.id)}>В корзину</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inventory;