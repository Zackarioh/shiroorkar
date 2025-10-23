import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const useCart = () => {
    const { cartItems, addToCart, removeFromCart, clearCart, getTotalPrice } = useContext(CartContext);

    return {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
    };
};

export default useCart;