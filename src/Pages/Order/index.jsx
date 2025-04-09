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

import BackButton from "../../components/ReturnButton";
import { useToast } from "../../context/ToastContext";
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

    const handleOrderAction = async (id, action) => {
        const method = action === "cancel" ? "DELETE" : "POST";
        const basePath = action === "cancel" ? `${apiUrl}s` : apiUrl; // orders для cancel
        const endpoint = `${basePath}/${id}/${action}`;

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Ошибка при обновлении заказа");

            await fetchOrders(token);
        } catch (error) {
            console.error(error);
            showToast("Ошибка при обновлении заказа. Пожалуйста, попробуйте позже.");
        }
    };

    const sortOrdersByDate = (orders) => {
        return orders.sort((a, b) => new Date(a.from_date) - new Date(b.from_date));
    };

    return (
        <StyledPageContainer>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <StyledPageTitle>Мои Заказы</StyledPageTitle>
                <BackButton />
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
                                <span>Статус: {order.status}</span>
                                {role === "buyer" && <span>Номер: {userPhone}</span>}
                                {role === "buyer" && (
                                    <ActionButtons>
                                        {order.status === "created" && (
                                            <>
                                                <ActionButton onClick={() => handleOrderAction(order.uuid, "confirm")}>
                                                    Подтвердить
                                                </ActionButton>
                                                <ActionButton onClick={() => handleOrderAction(order.uuid, "cancel")}>
                                                    Отменить
                                                </ActionButton>
                                            </>
                                        )}
                                        {order.status === "confirmed" && (
                                            <ActionButton onClick={() => handleOrderAction(order.uuid, "close")}>
                                                Закрыть
                                            </ActionButton>
                                        )}
                                    </ActionButtons>
                                )}
                            </OrderInfo>
                            <InventoryList>
                                {order.inventories.map((item) => (
                                    <InventoryItem key={item.uuid}>
                                        <span>{item.name}</span>
                                        <span>Стоимость в день: {item.cost_per_day} р.</span>
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
