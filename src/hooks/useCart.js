import { useContext } from 'react';
import { useCart } from '../context/CartContext';
import { CartService } from '../services/cart';

export const useCartActions = () => {
    const {
        items,
        isCartOpen,
        highlightItem,
        actions: {
            setCart,
            addItem: contextAddItem,
            removeItem: contextRemoveItem,
            toggleCart,
            startLoading,
            setError
        }
    } = useCart();

    /**
     * Добавление товара в корзину
     * @param {string} inventoryId - ID инвентаря из API /api/inventory/available
     */
    const addItem = async (inventoryId) => {
        try {
            startLoading();

            const updatedCart = await CartService.addItem(inventoryId);
            setCart(updatedCart);

            // Безопасное получение добавленного элемента
            const addedItem = updatedCart.find(item =>
                item.inventory && item.inventory.id === inventoryId
            );

            if (addedItem) {
                highlightItem(addedItem.uuid);
            }

            if (!isCartOpen && items.length === 0) {
                toggleCart();
            }
        } catch (error) {
            setError(error.message || 'Ошибка при добавлении в корзину');
            throw error;
        }
    };

    /**
     * Удаление товара из корзины
     * @param {string} cartItemId - UUID элемента корзины
     */
    const removeItem = async (cartItemId) => {
        try {
            startLoading();
            const updatedCart = await CartService.removeItem(cartItemId);
            setCart(updatedCart);
        } catch (error) {
            setError(error.message || 'Ошибка при удалении из корзины');
            throw error;
        }
    };

    /**
     * Синхронизация корзины с сервером
     * (После авторизации или при загрузке страницы)
     */
    const syncCart = async () => {
        try {
            startLoading();
            const cartData = await CartService.getCart();
            setCart(cartData || []);
        } catch (error) {
            console.error('Ошибка синхронизации корзины:', error);
            setError('Не удалось загрузить корзину');
        }
    };

    /**
     * Получение общего количества товаров в корзине
     */
    const getTotalCount = () => {
        return items.reduce((total, item) => total + item.count, 0);
    };

    /**
     * Получение общей суммы заказа
     */
    const getTotalSum = () => {
        return items.reduce((sum, item) => {
            return sum + (item.count * item.inventory.cost_per_day);
        }, 0);
    };

    return {
        items,
        addItem,
        removeItem,
        syncCart,
        getTotalCount,
        getTotalSum,
        isCartOpen,
        toggleCart
    };
};