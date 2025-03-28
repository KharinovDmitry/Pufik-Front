import React, { useEffect, useState } from "react";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const apiUrl = "/api/order";

    /*useEffect(() => {
        if (!token) {
            window.location.href = "/";
        } else {
            fetchOrders();
        }
    }, []);*/

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${apiUrl}/${role === "customer" ? "all" : "my"}`, {
                headers: { 'Authorization': `Bearer ${token}` },
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
                headers: { 'Authorization': `Bearer ${token}` },
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
        <div className="wrapper">
            <header className="container">
                <span className="logo">soft inventory</span>
                <nav>
                    <ul>
                        <li><a href="inventory">Инвентарь</a></li>
                        <li><a href="cart">Корзина</a></li>
                        <li><button onClick={() => { localStorage.clear(); window.location.href = "/"; }}>Выход</button></li>
                    </ul>
                </nav>
            </header>

            <main className="container">
                <h1>Мои Заказы</h1>
                <div className="order-list">
                    <ul className="order-items">
                        {orders.map(order => (
                            <li key={order.uuid} className="order-item">
                                <div className="order-info">
                                    <span>Срок: с {new Date(order.from_date).toLocaleDateString("ru-RU")} по {new Date(order.to_date).toLocaleDateString("ru-RU")}</span>
                                    <span>Адрес: {order.address}</span>
                                    <span>Сумма: {order.sum}</span>
                                    <span>Статус: {order.status}</span>
                                    {role === "customer" && <span>Номер покупателя: {order.buyer.phone}</span>}
                                    {role === "customer" && (
                                        <div>
                                            <button onClick={() => handleOrderAction(order.uuid, "cancel")}>Отменить</button>
                                            <button onClick={() => handleOrderAction(order.uuid, "confirm")}>Подтвердить</button>
                                            <button onClick={() => handleOrderAction(order.uuid, "close")}>Закрыть</button>
                                        </div>
                                    )}
                                </div>
                                <ul className="inventory-list">
                                    {order.inventories.map(item => (
                                        <li key={item.id} className="order-item">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">Стоимость в день: {item.cost_per_day} р.</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Orders;