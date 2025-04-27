import styled from "styled-components";

export const AdminContainer = styled.div`
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: "Segoe UI", Roboto, sans-serif;
`;

export const UserList = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const UserItem = styled.li`
    background: #fefefe;
    border: 2px solid #0d6efd;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #e7f0ff;
    }
`;

export const OrderList = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
`;

export const OrderItem = styled.li`
    background: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 10px;
    padding: 20px;
`;

export const BackButton = styled.button`
    background: #0d6efd;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 20px;
    transition: background 0.3s ease;
    
    &:hover {
        background: #0b5ed7;
    }
`;
