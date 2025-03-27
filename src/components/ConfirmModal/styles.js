import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h3`
  margin: 0 0 20px;
  text-align: center;
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const ConfirmButton = styled.button`
  padding: 8px 16px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #cc0000;
  }
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  background: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #bdbdbd;
  }
`;