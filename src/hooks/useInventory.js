import { useState, useEffect } from 'react';
import { InventoryService } from '../services/inventory';

export const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const data = await InventoryService.getAvailableInventory();
            setInventory(data);
        } catch (err) {
            setError(err.message || 'Не удалось загрузить инвентарь');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const categories = [...new Set(inventory.map(item => item.status))];

    return {
        inventory,
        loading,
        error,
        categories,
        refresh: fetchInventory
    };
};