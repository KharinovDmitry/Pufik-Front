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

    async addItem(inventoryId) {
        try {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const response = await fetch(`${API_GATEWAY}/api/order/cart/add`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ inventory_id: inventoryId })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
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

            return await handleResponse(response);
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