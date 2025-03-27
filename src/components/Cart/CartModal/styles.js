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
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const ModalContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    line-height: 1;
`;

export const EmptyMessage = styled.div`
    text-align: center;
    padding: 20px 0;
`;

export const ItemsContainer = styled.div`
    overflow-y: auto;
    flex-grow: 1;
    margin: 0 -20px;
    padding: 0 20px;
`;

export const WarningMessage = styled.div`
    background: #fff3cd;
    color: #856404;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 0.9rem;
`;

export const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 5px 0;
`;

export const CheckoutButton = styled.button`
    width: 100%;
    padding: 14px;
    background: ${props => props.disabled ? '#ccc' : '#4CAF50'};
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    margin-top: 10px;
    transition: background 0.2s;

    &:hover {
        background: ${props => props.disabled ? '#ccc' : '#45a049'};
    }
`;