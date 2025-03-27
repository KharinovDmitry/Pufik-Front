import React, {useEffect, useState} from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useCartActions } from '../../hooks/useCart';
import InventoryGrid from '../../components/Inventory/InventoryGrid';
import {
    PageContainer,
    PageTitle,
    ControlsContainer,
    FilterButton,
    SortSelect,
    StatusMessage
} from './styles';
import {useAuth} from "../../context/TgAuthContext";
import TgAuthButton from "../../components/TgAuthButton";

const Home = () => {
    const { inventory, loading, error, categories } = useInventory();
    const { addItem } = useCartActions();
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('price-asc');

    const { user } = useAuth();
    const { syncCart } = useCartActions();

    useEffect(() => {
        if (user) {
            const localCart = JSON.parse(localStorage.getItem('local_cart')) || [];
            syncCart(localCart).then(() => {
                localStorage.removeItem('local_cart');
            });
        }
    }, [syncCart, user]);

    const handleAddToCart = (inventoryId) => {
        addItem(inventoryId);
    };

    // Фильтрация и сортировка
    const filteredItems = inventory
        .filter(item => activeFilter === 'all' || item.status === activeFilter)
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.cost_per_day - b.cost_per_day;
            if (sortBy === 'price-desc') return b.cost_per_day - a.cost_per_day;
            return 0;
        });

    if (error) {
        return (
            <PageContainer>
                <StatusMessage>
                    <img src="/error-icon.svg" alt="Ошибка" />
                    <p>{error}</p>
                </StatusMessage>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageTitle>Аренда инвентаря</PageTitle>

            <ControlsContainer>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <TgAuthButton/>
                </div>

                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    <FilterButton
                        $active={activeFilter === 'all'}
                        onClick={() => setActiveFilter('all')}
                    >
                        Все
                    </FilterButton>
                    {categories.map(category => (
                        <FilterButton
                            key={category}
                            $active={activeFilter === category}
                            onClick={() => setActiveFilter(category)}
                        >
                            {category}
                        </FilterButton>
                    ))}
                </div>

                <SortSelect
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="price-asc">По цене (возр.)</option>
                    <option value="price-desc">По цене (убыв.)</option>
                </SortSelect>
            </ControlsContainer>

            <InventoryGrid
                items={filteredItems}
                onAddToCart={handleAddToCart}
                loading={loading}
            />
        </PageContainer>
    );
};

export default Home;