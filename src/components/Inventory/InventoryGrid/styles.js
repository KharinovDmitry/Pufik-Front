import styled, {keyframes} from 'styled-components';

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
`;

export const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #6c757d;

  p {
    margin-top: 16px;
    font-size: 16px;
  }

  img {
    opacity: 0.7;
  }
`;

// Анимация для скелетона
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

export const SkeletonItem = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  height: 220px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;