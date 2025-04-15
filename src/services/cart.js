import { API_GATEWAY } from "../config";

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

export const CartService = {
    async getCart() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const response = await fetch(`${API_GATEWAY}/api/order/cart/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Ошибка получения корзины');
                return await response.json();
            } catch (error) {
                console.error('Ошибка получения корзины:', error);
                throw error;
            }
        } else {
            // Для неавторизованных пользователей возвращаем данные из localStorage
            return JSON.parse(localStorage.getItem('local_cart')) || [];
        }
    },

    async addItem(inventoryId, count = 1) {
        const token = localStorage.getItem('auth_token');
    if (!token) {
        try {
            // Для неавторизованных пользователей загружаем данные из /api/inventory/available
            const response = await fetch(`${API_GATEWAY}/api/inventory/available`);
            const inventoryData = await response.json();
            const item = inventoryData.find(i => i.id === inventoryId);

            if (!item) throw new Error('Товар не найден');

            const localCart = JSON.parse(localStorage.getItem('local_cart')) || [];
            const existingItem = localCart.find(i => i.inventory?.id === inventoryId);

            const updatedCart = existingItem
                ? localCart.map(i => 
                    i.inventory.id === inventoryId 
                        ? { 
                            ...i, 
                            count: i.count + count,
                            inventory: {
                                ...i.inventory,
                                balance: Math.max(0, i.inventory.balance - count)
                            }
                        }
                        : i
                )
                : [
                    ...localCart,
                    {
                        uuid: crypto.randomUUID(),
                        inventory: {
                            id: item.id,
                            name: item.name,
                            cost_per_day: item.cost_per_day,
                            balance: item.balance - count
                        },
                        count: count
                    }
                ];

            localStorage.setItem('local_cart', JSON.stringify(updatedCart));
            return updatedCart;
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            throw error;
        }
        } else {
            try {
                const response = await fetch(`${API_GATEWAY}/api/order/cart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        inventory_uuid: inventoryId,
                        count: count
                    })
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Ошибка добавления товара');
                }
    
                return this.getCart();
            } catch (error) {
                console.error('Ошибка добавления товара:', error);
                throw error;
            }
        }
    },

    async removeItem(cartItemId) {
        try {
            const token = localStorage.getItem('auth_token');
            if (token) {
                // Для авторизованных пользователей
                const response = await fetch(`${API_GATEWAY}/api/order/cart/remove`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ cart_item_id: cartItemId })
                });
                return this.getCart();
            } else {
                // Для неавторизованных пользователей
                const localCart = JSON.parse(localStorage.getItem('local_cart')) || [];
                const updatedCart = localCart.filter(item => item.uuid !== cartItemId);
                localStorage.setItem('local_cart', JSON.stringify(updatedCart));
                return updatedCart;
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    },

    async syncCart(localCart) {
        const token = localStorage.getItem('auth_token');
        if (!token) return localCart;
        
        try {
          // Сначала очищаем серверную корзину
          await fetch(`${API_GATEWAY}/api/order/cart/clear`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
      
          // Добавляем все элементы из локальной корзины
          await Promise.all(
            localCart.map(item => 
              this.addItem(item.inventory_id, item.count)
            )
          );
          
          return this.getCart();
        } catch (error) {
          console.error('Sync error:', error);
          return this.getCart();
        }
    },
};