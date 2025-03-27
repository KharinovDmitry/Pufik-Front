import styled from 'styled-components';

// Контейнер для элемента корзины
export const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  background-color: ${props => props.$highlighted ? '#f8f9fa' : 'transparent'};
  transition: background 0.3s ease;
`;

// Блок с информацией о товаре
export const ItemInfo = styled.div`
  flex: 1;
`;

// Название товара
export const ItemName = styled.h4`
  margin: 0 0 4px 0;
  font-size: 16px;
`;

// Цена товара
export const ItemPrice = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

// Блок с кнопками управления
export const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// Кнопка изменения количества
export const QuantityButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
`;

// Кнопка удаления
export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
`;