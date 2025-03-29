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

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const apiUrl = "/api/order";

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            const checkTokenInterval = setInterval(() => {
                const newToken = localStorage.getItem("token");
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
            const role = localStorage.getItem("role");
            const response = await fetch(`${apiUrl}/${role === "customer" ? "all" : "my"}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Ошибка при загрузке заказов");

            const data = await response.json();
            setOrders(sortOrdersByDate(data));
        } catch (error) {
            console.error(error);
            alert("Ошибка при загрузке заказов. Пожалуйста, попробуйте позже.");
        }
    };

    const handleOrderAction = async (id, action) => {
        try {
            const response = await fetch(`${apiUrl}/${id}/${action}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Ошибка при обновлении заказа");
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert("Ошибка при обновлении заказа. Пожалуйста, попробуйте позже.");
        }
    };

    const sortOrdersByDate = (orders) => {
        return orders.sort((a, b) => new Date(a.from_date) - new Date(b.from_date));
    };

    return (
        <StyledPageContainer>
            <StyledPageTitle>Мои Заказы</StyledPageTitle>
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
                                {role === "customer" && <span>Номер покупателя: {order.buyer.phone}</span>}
                                {role === "customer" && (
                                    <ActionButtons>
                                        <ActionButton onClick={() => handleOrderAction(order.uuid, "cancel")}>
                                            Отменить
                                        </ActionButton>
                                        <ActionButton onClick={() => handleOrderAction(order.uuid, "confirm")}>
                                            Подтвердить
                                        </ActionButton>
                                        <ActionButton onClick={() => handleOrderAction(order.uuid, "close")}>
                                            Закрыть
                                        </ActionButton>
                                    </ActionButtons>
                                )}
                            </OrderInfo>
                            <InventoryList>
                                {order.inventories.map((item) => (
                                    <InventoryItem key={item.id}>
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
