import React from 'react';
import {
    CardContainer,
    CardBody,
    CardTitle,
    CardStatus,
    CardPrice,
    AddButton
} from './styles';

const InventoryCard = ({ item, onAddToCart }) => {
    const isAvailable = item.balance > 0;

    return (
        <CardContainer $available={isAvailable}>
            <CardBody>
                <CardTitle>{item.name}</CardTitle>
                <CardStatus $status={item.status}>
                    {item.status}
                </CardStatus>
                <CardPrice>{item.cost_per_day} ₽/день</CardPrice>
                <div style={{ margin: '10px 0' }}>
                    Доступно: {item.balance} шт.
                </div>
                <AddButton
                    onClick={() => isAvailable && onAddToCart(item.id)}
                    disabled={!isAvailable}
                >
                    {isAvailable ? 'Добавить в корзину' : 'Нет в наличии'}
                </AddButton>
            </CardBody>
        </CardContainer>
    );
};

export default InventoryCard;