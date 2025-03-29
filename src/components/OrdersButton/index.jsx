import React from "react";
import { OrdersButton } from "./styles";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const navigate = useNavigate();

    return (
        <OrdersButton onClick={() => navigate("/orders")}>
            Мои заказы
        </OrdersButton>
    );
};

export default MyOrders;
