import React, {useState} from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useCartActions } from '../../hooks/useCart';
import InventoryGrid from '../../components/Inventory/InventoryGrid';
import { useCart } from '../../context/CartContext';

import {
    PageContainer,
    PageTitle,
    ControlsContainer,
    FilterButton,
    SortSelect,
    StatusMessage,
    CartSummary,
    CartSummaryButton
} from './styles';
import { useAuth } from "../../context/TgAuthContext";
import TgAuthButton from "../../components/TgAuthButton";
import CartButton from "../../components/Cart/CartButton";
import CartModal from "../../components/Cart/CartModal";
import MyOrders from "../../components/OrdersButton";


const Home = () => {
    const { inventory, loading, error, categories } = useInventory();
    const { addItem, items, totalSum } = useCartActions();
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('price-asc');
    const { user } = useAuth();
    const { isCartOpen, actions: { toggleCart } } = useCart();

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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <PageTitle>Аренда инвентаря</PageTitle>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <MyOrders />
                    <TgAuthButton />
                    <CartButton />
                </div>
            </div>

            {/* Краткая сводка корзины */}
            {items.length > 0 && (
                <CartSummary>
                    <div>
                        <span>В корзине: {items.reduce((sum, item) => sum + item.count, 0)} шт.</span>
                        <span>На сумму: {totalSum} ₽</span>
                    </div>
                    <CartSummaryButton onClick={toggleCart}>
                        Оформить
                    </CartSummaryButton>
                </CartSummary>
            )}

            <ControlsContainer>
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

            <CartModal />
        </PageContainer>
    );
};

export default Home;