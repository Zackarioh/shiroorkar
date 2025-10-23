import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import CartItem from './CartItem';

const ShoppingCart = () => {
    const { cartItems, totalAmount } = useContext(CartContext);

    return (
        <div className="shopping-cart">
            <h2 className="text-3xl font-bold mb-4">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <div>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    <div className="total-amount mt-4">
                        <h3 className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;