import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminButtonStyle } from "./styles";

const AdminButton = ({ userRole }) => {
    const navigate = useNavigate();

    if (userRole !== "customer") {
        return null;
    }

    const handleClick = () => {
        navigate("/adminPanel");
    };

    return (
        <AdminButtonStyle  onClick={handleClick}>
            Админ панель
        </AdminButtonStyle >
    );
};

export default AdminButton;
