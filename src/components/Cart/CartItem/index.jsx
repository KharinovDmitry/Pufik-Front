import React from 'react';
import { CartService } from '../../../services/cart';
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
import {API_GATEWAY} from "../../../config";
import { useToast } from "../../../context/ToastContext";


const CartItem = ({
                      item,
                      highlighted,
                      onRemove,
                      maxQuantity,
                      onCartUpdate
                  }) => {
    const { showToast } = useToast();
    const handleIncrease = async () => {
        try {
            const updatedCart = await CartService.incrementItem(item);
            onCartUpdate(updatedCart);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDecrease = async () => {
        try {
            const updatedCart = await CartService.decrementItem(item);
            onCartUpdate(updatedCart);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async () => {
        try {
            const updatedCart = await CartService.removePosition(item);
            onCartUpdate(updatedCart); // Обновляем состояние корзины
        } catch (error) {
            console.error("Ошибка при удалении товара:", error);
            showToast("Не удалось удалить товар из корзины");
        }
    };

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
                        onClick={handleDecrease}
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
                        onClick={handleIncrease}
                        aria-label="Увеличить количество"
                        disabled={item.count >= maxQuantity}
                    >
                        +
                    </QuantityButton>
                </div>
                <RemoveButton
                    onClick={handleRemove}
                    aria-label="Удалить из корзины"
                >
                    Удалить
                </RemoveButton>
            </ItemActions>
        </ItemContainer>
    );
};

export default CartItem;