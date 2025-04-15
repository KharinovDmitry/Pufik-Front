import { useContext, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CartService } from '../services/cart';
import { useAuth } from '../context/TgAuthContext';
import { useToast } from "../context/ToastContext";
import { API_GATEWAY } from '../config';

export const useCartActions = () => {
    const {
        items,
        isCartOpen,
        actions: {
            setCart,
            addItem: contextAddItem,
            removeItem: contextRemoveItem,
            toggleCart,
            startLoading,
            highlightItem,
            setError
        }
    } = useCart();

    const { user } = useAuth(); // Получаем информацию об авторизации
    const { showToast } = useToast();
    /**
     * Добавление товара в корзину
     * @param {string} inventoryId - ID инвентаря из API /api/inventory/available
     */

    useEffect(() => {
        if (user) {
            syncCart();
        }
    }, [user]);

    const addItem = async (inventoryId) => {
        try {
            startLoading();
            const updatedCart = await CartService.addItem(inventoryId);
            setCart(updatedCart);
    
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
    
            // Загружаем данные инвентаря
            const inventoryResponse = await fetch(`${API_GATEWAY}/api/inventory/available`);
            const inventoryData = await inventoryResponse.json();
            const inventoryMap = inventoryData.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {});
    
            // Обогащаем данные корзины
            const enrichedCart = cartData.map(cartItem => ({
                ...cartItem,
                inventory: inventoryMap[cartItem.inventory.uuid]
            }));
    
            setCart(enrichedCart);
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
            return sum + (item.inventory?.cost_per_day || 0) * item.count;
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