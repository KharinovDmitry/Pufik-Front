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
        try {
            const token = localStorage.getItem('auth_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${API_GATEWAY}/api/order/cart/my`, { headers });
            return await handleResponse(response);
        } catch (error) {
            console.error('Cart fetch error:', error);
            throw error;
        }
    },

    async addItem(inventoryId, count = 1) {
        const token = localStorage.getItem('auth_token');
        const url = token ?
            `${API_GATEWAY}/api/order/cart/add` :
            null;

        if (url) {
            // Запрос к бэкенду
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({inventory_uuid: inventoryId, count})
            });
            return this.getCart();
        } else {
            // Логика для локального хранилища
            return new Promise((resolve) => {
                const localCart = JSON.parse(localStorage.getItem('local_cart')) || [];
                const existingItem = localCart.find(i => i.inventory_id === inventoryId);

                const updatedCart = existingItem ?
                    localCart.map(i =>
                        i.inventory_id === inventoryId ?
                            {...i, count: i.count + count} : i
                    ) :
                    [...localCart, {inventory_id: inventoryId, count}];

                localStorage.setItem('local_cart', JSON.stringify(updatedCart));
                resolve(updatedCart);
            });
        }
    },

    async removeItem(cartItemId) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_GATEWAY}/api/order/cart/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cart_item_id: cartItemId })
            });

            return this.getCart();
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    },

    async syncCart(localCart) {
        const token = localStorage.getItem('auth_token');
        if (!token) return localCart;

        try {
            // Отправляем все элементы локальной корзины
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