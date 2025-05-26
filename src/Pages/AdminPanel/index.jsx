import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContainer, UserList, UserItem, BackButton, StyledPageTitle } from "./styles";
import { API_GATEWAY } from '../../config';
import BackButtonToMainPage from "../../components/ReturnButton"
import { useToast } from "../../context/ToastContext";
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
    const { showToast } = useToast();

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

    const translateStatus = (status) => {
        switch (status) {
            case "подтвержден":
                return "в пути";
            case "завершен":
                return "находится в аренде";
            default:
                return status;
        }
    };

    const fetchOrdersByUser = async (userUuid) => {
        try {
            const response = await fetch(`${API_GATEWAY}/api/order/user/${userUuid}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            setSelectedUser(userUuid);
            setOrders(data);
        } catch (error) {
            console.error("Ошибка при загрузке заказов:", error);
        }
    };

    const updateOrderStatusLocally = (orderUUID, newStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.uuid === orderUUID ? { ...order, status: newStatus } : order
            )
        );
    };

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
                showToast("Заказ подтвержден!");
                updateOrderStatusLocally(orderUUID, "в пути");
            } else {
                showToast("Ошибка при подтверждении заказа");
            }
        } catch (error) {
            console.error(error);
            showToast("Ошибка сервера при подтверждении");
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
                showToast("Заказ закрыт!");
                updateOrderStatusLocally(orderUUID, "находится в аренде");
            } else {
                showToast("Ошибка при закрытии заказа");
            }
        } catch (error) {
            console.error(error);
            showToast("Ошибка сервера при закрытии");
        }
    };

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
        fetchOrdersByUser(userUuid);
    };

    const handleBack = () => {
        setSelectedUser(null);
        setOrders([]);
    };

    const statusOrder = ["создан", "в пути", "находится в аренде"];

    return (
        <AdminContainer>
            {selectedUser ? (
                <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                        <StyledPageTitle>Заказы пользователя</StyledPageTitle>
                        <BackButton onClick={handleBack}>Назад к пользователям</BackButton>
                    </div>

                    {statusOrder.map((statusKey) => {
                        const filtered = orders.filter(o => translateStatus(o.status) === statusKey);
                        if (filtered.length === 0) return null;

                        return (
                            <div key={statusKey} style={{ marginBottom: "30px" }}>
                                <h3>{statusKey[0].toUpperCase() + statusKey.slice(1)}</h3>
                                <OrderList>
                                    {filtered.map((order) => (
                                        <OrderItem key={order.uuid}>
                                            <OrderInfo>
                                                <span>
                                                    Срок: с {new Date(order.from_date).toLocaleDateString("ru-RU")} по{" "}
                                                    {new Date(order.to_date).toLocaleDateString("ru-RU")}
                                                </span>
                                                <span>Адрес: {order.address}</span>
                                                <span>Сумма: {order.sum}</span>
                                                <span>Статус: {translateStatus(order.status)}</span>
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
                            </div>
                        );
                    })}
                </>
            ) : (
                <>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <StyledPageTitle>Пользователи</StyledPageTitle>
                        <div style={{ marginLeft: "auto" }}>
                            <BackButtonToMainPage />
                        </div>
                    </div>
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
