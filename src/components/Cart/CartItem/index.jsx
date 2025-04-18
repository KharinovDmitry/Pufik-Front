import React from 'react';
import {
    ItemContainer,
    ItemInfo,
    ItemName,
    ItemPrice,
    ItemActions,
    QuantityButton,
    RemoveButton,
    AvailabilityInfo
} from './styles';

const CartItem = ({
                      item,
                      highlighted,
                      onRemove,
                      onQuantityChange,
                      maxQuantity,
                  }) => {
    return (
        <ItemContainer
            $highlighted={highlighted}
        >
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
                    <span style={{
                        margin: '0 10px',
                        minWidth: '20px',
                        textAlign: 'center',
                        color:  'inherit',
                        fontWeight: 'normal'
                    }}>
                        {item.count}
                    </span>
                    <QuantityButton
                        onClick={() => onQuantityChange(Math.min(maxQuantity, item.count + 1))}
                        aria-label="Увеличить количество"
                        disabled={item.count >= maxQuantity}
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

export default CartItem;