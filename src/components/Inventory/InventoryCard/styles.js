import styled, { css } from 'styled-components';

export const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
  border: 1px solid ${props => props.$available ? '#e9ecef' : '#ffeaea'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
`;

export const CardStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 12px;
  background: ${props =>
    props.$status === 'new' ? '#e3f2fd' :
        props.$status === 'used' ? '#fff8e1' : '#f5f5f5'};
  color: ${props =>
    props.$status === 'new' ? '#1976d2' :
        props.$status === 'used' ? '#ff8f00' : '#616161'};
`;

export const CardPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #0d6efd;
  margin: 8px 0;
`;

export const AddButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: ${props => props.disabled ? '#f5f5f5' : '#0d6efd'};
  color: ${props => props.disabled ? '#9e9e9e' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  margin-top: auto;

  &:hover {
    background: ${props => props.disabled ? '#f5f5f5' : '#0b5ed7'};
  }
`;