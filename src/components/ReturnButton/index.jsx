import React from "react";
import { useNavigate } from "react-router-dom";
import { ReturnButton } from "./styles";

const BackButtonToMainPage = () => {
    const navigate = useNavigate();

    return (
        <ReturnButton onClick={() => navigate("/")}>
            Назад
        </ReturnButton>
    );
};

export default BackButtonToMainPage;