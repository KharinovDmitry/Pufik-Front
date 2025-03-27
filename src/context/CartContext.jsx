import {createContext, useContext, useReducer, useCallback, useEffect} from 'react';

// 1. Типы действий (action types)
const ActionTypes = {
    SET_CART: 'SET_CART',
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    TOGGLE_CART: 'TOGGLE_CART',
    CLEAR_CART: 'CLEAR_CART'
};

const initialState = {
    items: JSON.parse(localStorage.getItem('local_cart')) || [],
    isCartOpen: false,
    loading: false,
    error: null,
    // Новые визуальные состояния
    lastAddedItem: null, // Для анимации
    highlightItems: {} // Подсветка измененных элементов
};

// 3. Редуктор
const cartReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_CART:
            return {
                ...state,
                items: action.payload,
                loading: false
            };

        case ActionTypes.ADD_ITEM:
            const existingItem = state.items.find(
                item => item.inventory.uuid === action.payload.inventory.uuid
            );

            return {
                ...state,
                items: existingItem
                    ? state.items.map(item =>
                        item.inventory.uuid === action.payload.inventory.uuid
                            ? { ...item, count: item.count + 1 }
                            : item
                    )
                    : [...state.items, { ...action.payload, count: 1 }],
                loading: false
            };

        case ActionTypes.REMOVE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item.uuid !== action.payload),
                loading: false
            };

        case ActionTypes.UPDATE_QUANTITY:
            return {
                ...state,
                items: state.items.map(item =>
                    item.uuid === action.payload.itemUuid
                        ? { ...item, count: action.payload.newQuantity }
                        : item
                ),
                loading: false
            };

        case ActionTypes.TOGGLE_CART:
            return {
                ...state,
                isCartOpen: !state.isCartOpen
            };

        case ActionTypes.CLEAR_CART:
            return {
                ...state,
                items: [],
                loading: false
            };

        case 'FETCH_START':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'HIGHLIGHT_ITEM':
            return {
                ...state,
                highlightItems: {
                    ...state.highlightItems,
                    [action.payload]: true
                }
            };

        case 'RESET_HIGHLIGHT':
            const { [action.payload]: _, ...rest } = state.highlightItems;
            return {
                ...state,
                highlightItems: rest
            };

        case 'SET_LAST_ADDED':
            return {
                ...state,
                lastAddedItem: action.payload
            };

        default:
            return state;
    }
};

// 4. Создание контекста
const CartContext = createContext();

// 5. Провайдер
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        localStorage.setItem('local_cart', JSON.stringify(state.items));
    }, [state.items]); // Срабатывает при изменении state.items

    // Оптимизированные функции с useCallback
    const setCart = useCallback(items => {
        dispatch({ type: ActionTypes.SET_CART, payload: items });
    }, []);

    const addItem = useCallback(item => {
        dispatch({ type: ActionTypes.ADD_ITEM, payload: item });
    }, []);

    const removeItem = useCallback(itemUuid => {
        dispatch({ type: ActionTypes.REMOVE_ITEM, payload: itemUuid });
    }, []);

    const updateQuantity = useCallback((itemUuid, newQuantity) => {
        dispatch({
            type: ActionTypes.UPDATE_QUANTITY,
            payload: { itemUuid, newQuantity }
        });
    }, []);

    const toggleCart = useCallback(() => {
        dispatch({ type: ActionTypes.TOGGLE_CART });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: ActionTypes.CLEAR_CART });
    }, []);

    const startLoading = useCallback(() => {
        dispatch({ type: 'FETCH_START' });
    }, []);

    const setError = useCallback(error => {
        dispatch({ type: 'FETCH_ERROR', payload: error });
    }, []);

    const highlightItem = useCallback(itemId => {
        dispatch({ type: 'HIGHLIGHT_ITEM', payload: itemId });
        setTimeout(() => {
            dispatch({ type: 'RESET_HIGHLIGHT', payload: itemId });
        }, 1000);
    }, []);

    const setLastAdded = useCallback(item => {
        dispatch({ type: 'SET_LAST_ADDED', payload: item });
        setTimeout(() => {
            dispatch({ type: 'SET_LAST_ADDED', payload: null });
        }, 1500);
    }, []);

    const value = {
        ...state,
        actions: {
            setCart,
            addItem,
            removeItem,
            updateQuantity,
            toggleCart,
            clearCart,
            startLoading,
            setError,
            highlightItem,
            setLastAdded
        }
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// 6. Кастомный хук для удобства
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};