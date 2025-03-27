import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
`;

export const CartIcon = styled.div`
    position: relative;
    font-size: 1.5rem;
    animation: ${props => props.$animating ? bounce : 'none'} 0.5s ease;
`;

export const Counter = styled.span`
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
`;

export const TotalPrice = styled.span`
    font-weight: bold;
    color: #333;
`;