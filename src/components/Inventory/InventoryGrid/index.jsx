import React from 'react';
import PropTypes from 'prop-types';
import InventoryCard from '../InventoryCard';
import { GridContainer, EmptyMessage } from './styles';

const Index = ({ items, onAddToCart, loading }) => {
    if (loading) {
        return (
            <GridContainer>
                {[...Array(6)].map((_, index) => (
                    <InventoryCardSkeleton key={index} />
                ))}
            </GridContainer>
        );
    }

    if (items.length === 0) {
        return (
            <EmptyMessage>
                <img src="/empty-inventory.svg" alt="Пусто" width={120} />
                <p>Нет доступного инвентаря</p>
            </EmptyMessage>
        );
    }

    return (
        <GridContainer>
            {items.map(item => (
                <InventoryCard
                    key={item.id}
                    item={item}
                    onAddToCart={onAddToCart}
                />
            ))}
        </GridContainer>
    );
};

// Компонент-заглушка для загрузки
const InventoryCardSkeleton = () => (
    <div style={{
        background: '#f5f5f5',
        borderRadius: '12px',
        padding: '16px',
        height: '220px',
        animation: 'pulse 1.5s infinite'
    }} />
);

Index.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            cost_per_day: PropTypes.number.isRequired,
            balance: PropTypes.number.isRequired
        })
    ).isRequired,
    onAddToCart: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

Index.defaultProps = {
    loading: false
};

export default Index;