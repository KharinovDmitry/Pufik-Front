import styled, { keyframes } from "styled-components";

// Анимация плавного появления
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Контейнер страницы
export const StyledPageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// Заголовок страницы
export const StyledPageTitle = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 600;
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
    font-size: 24px;
  }
`;

// Сообщение о статусе
export const StyledStatusMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6c757d;
  font-size: 16px;
`;

// Список заказов
export const OrderList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// Один заказ
export const OrderItem = styled.li`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

// Информация о заказе
export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  color: #2c3e50;
  font-size: 14px;
`;

// Список инвентаря
export const InventoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

// Один элемент инвентаря
export const InventoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px solid #e0e0e0;
  font-size: 14px;
  color: #2c3e50;
`;

// Кнопки действий
export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

// Одна кнопка действия
export const ActionButton = styled.button`
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0b5ed7;
  }
`;