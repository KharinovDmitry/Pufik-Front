import { API_GATEWAY } from '../config';

const LOCAL_STORAGE_KEY = 'user_cart';

export const CartService = {
    // Добавление в корзину
    async addItem(inventoryUuid) {
        const token = localStorage.getItem('auth_token');

        if (token) {
            // Работаем с бэкендом
            try {
                const response = await fetch(`${API_GATEWAY}/api/order/cart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ inventory_uuid: inventoryUuid })
                });

                if (!response.ok) throw new Error('Ошибка добавления в корзину');
                return await this.getCart();
            } catch (error) {
                console.error('Cart add error:', error);
                throw error;
            }
        } else {
            // Работаем с localStorage
            const localCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
            const existingItem = localCart.find(item => item.inventory_uuid === inventoryUuid);

            const updatedCart = existingItem
                ? localCart.map(item =>
                    item.inventory_uuid === inventoryUuid
                        ? { ...item, count: item.count + 1 }
                        : item
                )
                : [...localCart, { inventory_uuid: inventoryUuid, count: 1 }];

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
            return updatedCart;
        }
    },

    // Получение корзины
    async getCart() {
        const token = localStorage.getItem('auth_token');

        try {
            if (token) {
                const response = await fetch(`${API_GATEWAY}/api/order/cart/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Ошибка получения корзины');
                return await response.json() || []; // Гарантируем возврат массива
            } else {
                return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
            }
        } catch (error) {
            console.error('Cart fetch error:', error);
            return []; // Всегда возвращаем массив
        }

    },

    // Удаление из корзины
    async removeItem(cartItemUuid) {
        const token = localStorage.getItem('auth_token');

        if (token) {
            try {
                const response = await fetch(`${API_GATEWAY}/api/order/cart/remove`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ cart_item_uuid: cartItemUuid })
                });

                if (!response.ok) throw new Error('Ошибка удаления из корзины');
                return await this.getCart();
            } catch (error) {
                console.error('Cart remove error:', error);
                throw error;
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
            const updatedCart = localCart
                .map(item =>
                    item.inventory_uuid === cartItemUuid
                        ? { ...item, count: item.count - 1 }
                        : item
                )
                .filter(item => item.count > 0);

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
            return updatedCart;
        }
    },

    // Синхронизация локальной корзины с сервером после авторизации
    async syncCart() {
        const token = localStorage.getItem('auth_token');
        const localCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

        if (token && localCart.length > 0) {
            try {
                // Синхронизируем каждый элемент
                const results = [];
                for (const item of localCart) {
                    for (let i = 0; i < item.count; i++) {
                        const result = await this.addItem(item.inventory_uuid);
                        results.push(result);
                    }
                }

                localStorage.removeItem(LOCAL_STORAGE_KEY);
                return await this.getCart();
            } catch (error) {
                console.error('Cart sync error:', error);
                throw error;
            }
        }

        return await this.getCart();
    }
};