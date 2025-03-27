import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Анимация плавного появления
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Основной контейнер страницы
export const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// Заголовок страницы
export const PageTitle = styled.h1`
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

// Фильтры и сортировка
export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const FilterButton = styled.button`
  background: ${props => props.$active ? '#0d6efd' : 'white'};
  color: ${props => props.$active ? 'white' : '#2c3e50'};
  border: 1px solid ${props => props.$active ? '#0d6efd' : '#e0e0e0'};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    border-color: #0d6efd;
    color: ${props => props.$active ? 'white' : '#0d6efd'};
  }
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: border 0.2s;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }
`;

// Для сообщений о состоянии
export const StatusMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6c757d;
  font-size: 16px;

  img {
    width: 120px;
    opacity: 0.7;
    margin-bottom: 16px;
  }
`;

// Кнопка "Вернуться" (если нужно)
export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #0d6efd;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.2s;

  &:hover {
    color: #0b5ed7;
    text-decoration: underline;
  }

  svg {
    margin-right: 8px;
  }
`;

export const CartSummary = styled.div`
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    
    div {
        display: flex;
        gap: 16px;
    }
    
    span {
        font-size: 0.9rem;
        color: #333;
    }
`;

export const CartSummaryButton = styled.button`
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
        background: #45a049;
    }
`;