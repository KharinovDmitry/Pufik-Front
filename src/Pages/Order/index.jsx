import React, { useEffect, useState } from "react";
import {
    StyledPageContainer,
    StyledPageTitle,
    StyledStatusMessage,
    OrderList,
    OrderItem,
    OrderInfo,
    InventoryList,
    InventoryItem,
    ActionButtons,
    ActionButton,
} from "./styles";

import { API_GATEWAY, API_ENDPOINTS } from '../../config';
import BackButtonToMainPage from "../../components/ReturnButton";
import { useToast } from "../../context/ToastContext";

const daysUntilStartDate = (fromDate) => {
    const startDate = new Date(fromDate);
    const today = new Date();
    const timeDifference = startDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysRemaining;
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const role = userData.role;
    const userPhone = userData.phone;
    const token = localStorage.getItem("auth_token");
    const apiUrl = "http://45.83.143.192/api/order";
    const { showToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            const checkTokenInterval = setInterval(() => {
                const newToken = localStorage.getItem('auth_token');
                if (newToken) {
                    clearInterval(checkTokenInterval);
                    fetchOrders(newToken);
                }
            }, 500);

            return () => clearInterval(checkTokenInterval);
        } else {
            fetchOrders(token);
        }
    }, []);

    const fetchOrders = async (token) => {
        if (!token) {
            window.location.href = "/";
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
            const role = userData.role;
            const isCustomer = role?.toLowerCase() === "customer";
            const response = await fetch(`${apiUrl}/${isCustomer ? "all" : "my"}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Ошибка при загрузке заказов");

            const data = await response.json();
            setOrders(sortOrdersByDate(data));
        } catch (error) {
            console.error(error);
            showToast("Ошибка при загрузке заказов. Пожалуйста, попробуйте позже.");
        }
    };

    const handleOrderAction = async (id) => {
        const method = "POST";
        const endpoint = `${API_GATEWAY}/api/order/${id}/cancel`; // Исправленный путь

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка при обновлении заказа");
            }

            await fetchOrders(token);
        } catch (error) {
            console.error("Ошибка при обновлении заказа:", error);
            showToast("Ошибка при обновлении заказа. Пожалуйста, попробуйте позже.");
        }
    };

    const sortOrdersByDate = (orders) => {
        return orders.sort((a, b) => new Date(a.from_date) - new Date(b.from_date));
    };

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

    return (
        <StyledPageContainer>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <StyledPageTitle>Мои Заказы</StyledPageTitle>
                <BackButtonToMainPage />
            </div>
            {orders.length === 0 ? (
                <StyledStatusMessage>Заказов пока нет</StyledStatusMessage>
            ) : (
                <OrderList>
                    {orders.map((order) => (
                        <OrderItem key={order.uuid}>
                            <OrderInfo>
                                <span>
                                    Срок: с {new Date(order.from_date).toLocaleDateString("ru-RU")} по {" "}
                                    {new Date(order.to_date).toLocaleDateString("ru-RU")}
                                </span>
                                <span>Адрес: {order.address}</span>
                                <span>Сумма: {order.sum}</span>
                                <span>Статус: {translateStatus(order.status)}</span>
                                {role === "buyer" && <span>Номер: {userPhone}</span>}
                                {role === "buyer" && (
                                    <ActionButtons>
                                        {order.status === "создан" && (
                                            <>
                                                <ActionButton
                                                    disabled={daysUntilStartDate(order.from_date) < 3}
                                                    onClick={() => handleOrderAction(order.uuid)}
                                                    title={
                                                        daysUntilStartDate(order.from_date) < 3
                                                            ? "Отмена возможна не менее чем за три дня до заказа"
                                                            : undefined
                                                    }
                                                >
                                                    Отменить
                                                </ActionButton>
                                            </>
                                        )}
                                        {order.status === "confirmed" && (
                                            <><ActionButton onClick={() => handleOrderAction(order.uuid, "confirm")}>
                                                Подтвердить
                                            </ActionButton>
                                            <ActionButton onClick={() => handleOrderAction(order.uuid, "close")}>
                                                Закрыть
                                            </ActionButton></>
                                        )}
                                    </ActionButtons>
                                )}
                            </OrderInfo>
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
            )}
        </StyledPageContainer>
    );
};

export default Orders;