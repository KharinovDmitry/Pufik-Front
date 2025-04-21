import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const StyledPageContainer = styled.div`
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
    animation: ${fadeIn} 0.4s ease-out;
    font-family: "Segoe UI", Roboto, sans-serif;

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

export const StyledPageTitle = styled.h1`
    font-size: 32px;
    color: #2c3e50;
    margin-bottom: 24px;
    font-weight: 700;
    position: relative;
    display: inline-block;

    &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 3px;
        background: #0d6efd;
        border-radius: 3px;
    }

    @media (max-width: 768px) {
        font-size: 26px;
    }
`;

export const StyledStatusMessage = styled.div`
    padding: 40px 20px;
    text-align: center;
    color: #6c757d;
    font-size: 18px;
`;

export const OrderList = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const OrderItem = styled.li`
    background: #fefefe;
    border: 3px solid #0d6efd;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    animation: ${fadeIn} 0.3s ease-out;
    transition: box-shadow 0.3s ease, transform 0.2s ease;

    &:hover {
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
`;

export const OrderInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
    color: #2c3e50;
    font-size: 16px;
    line-height: 1.5;

    span {
        font-weight: 500;
    }
`;

export const InventoryList = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 12px;
    border-top: 1px solid #eaeaea;
`;

export const InventoryItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    border: 1px solid #000000;
    border-radius: 8px;
    background-color: #ffffff;
    font-size: 15px;
    color: #2c3e50;
    
    span {
        min-width: 150px;
        text-align: right;
    }
    
    span.name {
        flex-grow: 1;
        text-align: left;
        padding-right: 10px;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 16px;
`;

export const ActionButton = styled.button`
    background: #0d6efd;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #0b5ed7;
    }

    &:disabled {
        background: #adb5bd;
        cursor: not-allowed;
    }
`;
