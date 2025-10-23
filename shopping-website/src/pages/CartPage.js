import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';
import ShoppingCart from '../components/cart/ShoppingCart';

const CartPage = () => {
    const { cartItems } = useContext(CartContext);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p className="text-lg text-gray-500">Your cart is empty.</p>
            ) : (
                <div>
                    <div className="mb-6">
                        {cartItems.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    <ShoppingCart />
                </div>
            )}
        </div>
    );
};

export default CartPage;