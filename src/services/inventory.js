import {API_GATEWAY} from "../config";

export const InventoryService = {
    async getAvailableInventory() {
        const response = await fetch(`${API_GATEWAY}/api/inventory/available`);
        if (!response.ok) throw new Error('Ошибка загрузки инвентаря');
        return await response.json();
    }
};