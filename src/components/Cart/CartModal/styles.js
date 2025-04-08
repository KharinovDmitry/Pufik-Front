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
    max-height: 100vh;
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
    padding: 0 20px;
    max-height: 28vh; 
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
    background: ${props => props.disabled ? '#ccc' : '#0d6efd'};
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    margin-top: 10px;
    transition: background 0.2s;

    &:hover {
        background: ${props => props.disabled ? '#ccc' : '#0d6efd'};
    }
`;

export const FormWrapper = styled.div`
    margin-top: 20px;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;

export const FormLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
`;

export const FormInput = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    transition: border-color 0.3s;

    &:focus {
        border-color: #0d6efd;
        outline: none;
    }
`;