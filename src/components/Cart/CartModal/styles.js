import styled, { keyframes, css } from 'styled-components';

// Анимация появления
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Анимация фона
const overlayFade = keyframes`
  from { background: rgba(0,0,0,0); }
  to { background: rgba(0,0,0,0.5); }
`;

// Оверлей (фон модалки)
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Открытие сверху */
  padding-top: 5%;
  z-index: 1000;
  animation: ${overlayFade} 0.3s ease-out;
  backdrop-filter: blur(3px); /* Эффект размытия фона */
`;

// Контейнер модалки
export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
`;

// Шапка модалки
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

// Кнопка закрытия
export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
    color: #333;
    transform: rotate(90deg);
  }
`;

// Сообщение о пустой корзине
export const EmptyMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #888;
  font-size: 16px;
`;

// Кнопка оформления заказа
export const CheckoutButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: #43A047;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76,175,80,0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Прокручиваемая область с товарами
export const ItemsList = styled.div`
  overflow-y: auto;
  padding: 0 20px;
  flex-grow: 1;

  /* Стили для скроллбара */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
`;

// Блок итоговой суммы
export const TotalBlock = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  font-size: 16px;

  span:last-child {
    font-weight: 600;
    color: #333;
  }
`;