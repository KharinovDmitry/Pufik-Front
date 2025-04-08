import React from "react";
import { useNavigate } from "react-router-dom";
import { ReturnButton } from "./styles";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <ReturnButton onClick={() => navigate("/")}>
            Назад
        </ReturnButton>
    );
};

export default BackButton;