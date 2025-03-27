// components/cart/CartItem/index.jsx
import React from 'react';
import {
    ItemContainer,
    ItemInfo,
    ItemName,
    ItemPrice,
    ItemActions,
    QuantityButton,
    RemoveButton
} from './styles';

const Index = ({ item, highlighted, onRemove, onQuantityChange }) => {
    return (
        <ItemContainer $highlighted={highlighted}>
            <ItemInfo>
                <ItemName>{item.inventory.name}</ItemName>
                <ItemPrice>{item.inventory.cost_per_day} ₽/день</ItemPrice>
            </ItemInfo>

            <ItemActions>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <QuantityButton
                        onClick={() => onQuantityChange(Math.max(1, item.count - 1))}
                        aria-label="Уменьшить количество"
                    >
                        −
                    </QuantityButton>
                    <span style={{ margin: '0 10px', minWidth: '20px', textAlign: 'center' }}>
            {item.count}
          </span>
                    <QuantityButton
                        onClick={() => onQuantityChange(item.count + 1)}
                        aria-label="Увеличить количество"
                    >
                        +
                    </QuantityButton>
                </div>
                <RemoveButton
                    onClick={onRemove}
                    aria-label="Удалить из корзины"
                >
                    Удалить
                </RemoveButton>
            </ItemActions>
        </ItemContainer>
    );
};

export default Index;