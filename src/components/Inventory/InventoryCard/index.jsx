import React from 'react';
import {
    CardContainer,
    CardBody,
    CardTitle,
    CardStatus,
    CardPrice,
    AddButton
} from './styles';

const InventoryCard = ({ item, onAddToCart }) => {
    const isAvailable = item.balance > 0;

    return (
        <CardContainer $available={isAvailable}>
            <CardBody>
                <div style={{
                    width: '100%',
                    height: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    fontSize: '48px',
                    color: '#6c757d',
                    marginBottom: '16px'
                }}>
                    {item.image_url ? ( //посмотреть что в ответе и если что заменить imageUrl
                        <img
                            src={item.image_url} //посмотреть что в ответе и если что заменить imageUrl
                            alt="Изображение товара"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                        />
                    ) : (
                        '🛍️'
                    )}
                </div>

                <CardTitle>{item.name}</CardTitle>
                <CardStatus $status={item.status}>
                    {item.status}
                </CardStatus>
                <CardPrice>{item.costPerDay} ₽/день</CardPrice>
                <div style={{ margin: '10px 0' }}>
                    Доступно: {item.balance} шт.
                </div>
                <AddButton
                    onClick={() => isAvailable && onAddToCart(item.id)} 
                    disabled={!isAvailable}
                >
                    {isAvailable ? 'Добавить в корзину' : 'Нет в наличии'}
                </AddButton>
            </CardBody>
        </CardContainer>
    );
};

export default InventoryCard;