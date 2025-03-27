import styled from 'styled-components';

export const AuthButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: ${({ $isLoggedIn }) => $isLoggedIn ? '#f5f5f5' : '#0088cc'};
    color: ${({ $isLoggedIn }) => $isLoggedIn ? '#333' : 'white'};

    &:hover {
        background: ${({ $isLoggedIn }) => $isLoggedIn ? '#eaeaea' : '#0077b3'};
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export const TelegramIcon = styled.img`
    width: 20px;
    height: 20px;
`;

export const UserWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const LogoutButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    invert: 1;

    &:hover {
        background: #e0e0e0;
        color: #333;
    }

    svg {
        display: block;
    }
`;