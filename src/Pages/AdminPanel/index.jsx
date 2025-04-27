import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContainer, UserList, UserItem, BackButton } from "./styles";
import { API_GATEWAY } from '../../config';
import {
    OrderList,
    OrderItem,
    OrderInfo,
    InventoryList,
    InventoryItem,
    ActionButtons,
    ActionButton
} from "../Order/styles";
const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        fetch(`${API_GATEWAY}/api/order/users/all`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка сервера: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setUsers(data))
            .catch(error => console.error("Ошибка при загрузке пользователей:", error));
    }, [token]);

    const handleConfirm = async (orderUUID) => {
        try {
            const response = await fetch(`${API_GATEWAY}/api/order/${orderUUID}/confirm`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("Заказ подтвержден!");
                // здесь надо еще обновлять сам заказ
            } else {
                alert("Ошибка при подтверждении заказа");
            }
        } catch (error) {
            console.error(error);
            alert("Ошибка сервера при подтверждении");
        }
    };

    const handleClose = async (orderUUID) => {
        try {
            const response = await fetch(`${API_GATEWAY}/api/order/${orderUUID}/close`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("Заказ закрыт!");
                // здесь тоже надо еще обновлять сам заказ
            } else {
                alert("Ошибка при закрытии заказа");
            }
        } catch (error) {
            console.error(error);
            alert("Ошибка сервера при закрытии");
        }
    };

    //здесь функцию из ордер пейдж надо вытащить
    const groupItemsByUUID = (items) => {
        const grouped = {};
        items.forEach(item => {
            if (!grouped[item.uuid]) {
                grouped[item.uuid] = { ...item, count: 1 };
            } else {
                grouped[item.uuid].count += 1;
            }
        });
        return Object.values(grouped);
    };

    const handleUserClick = (userUuid) => {
        fetch(`${API_GATEWAY}/api/order/user/${userUuid}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка сервера: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setSelectedUser(userUuid);
                setOrders(data);
            })
            .catch(error => console.error("Ошибка при загрузке заказов:", error));
    };

    const handleBack = () => {
        setSelectedUser(null);
        setOrders([]);
    };

    return (
        <AdminContainer>
            {selectedUser ? (
                <>
                    <BackButton onClick={handleBack}>← Назад к пользователям</BackButton>
                    <h2>Заказы пользователя</h2>
                    <OrderList>
                        {orders.map((order) => (
                            <OrderItem key={order.uuid}>
                                <OrderInfo>
                                    <span>
                                        Срок: с {new Date(order.from_date).toLocaleDateString("ru-RU")} по{" "}
                                        {new Date(order.to_date).toLocaleDateString("ru-RU")}
                                    </span>
                                    <span>Адрес: {order.address}</span>
                                    <span>Сумма: {order.sum}</span>
                                    <span>Статус: {order.status}</span>
                                    <span>Покупатель: {}</span>
                                </OrderInfo>

                                <ActionButtons>
                                    <ActionButton onClick={() => handleConfirm(order.uuid)}>
                                        Подтвердить
                                    </ActionButton>
                                    <ActionButton onClick={() => handleClose(order.uuid)}>
                                        Закрыть
                                    </ActionButton>
                                </ActionButtons>
                                <InventoryList>
                                    {groupItemsByUUID(order.inventories).map((item) => (
                                        <InventoryItem key={item.uuid}>
                                            <span className="name">{item.name}</span>
                                            <span>Стоимость в день: {item.cost_per_day} р.</span>
                                            <span>Количество: {item.count}</span>
                                        </InventoryItem>
                                    ))}
                                </InventoryList>

                            </OrderItem>
                        ))}
                    </OrderList>
                </>
            ) : (
                <>
                    <h2>Пользователи</h2>
                    <UserList>
                        {users.map((user) => (
                            <UserItem key={user.uuid} onClick={() => handleUserClick(user.uuid)}>
                                <div><b>Логин:</b> {user.login}</div>
                                <div><b>Телефон:</b> {user.phone}</div>
                            </UserItem>
                        ))}
                    </UserList>
                </>
            )}
        </AdminContainer>
    );
};

export default AdminPanel;
