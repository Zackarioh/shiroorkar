import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useHistory } from 'react-router-dom';

const CheckoutPage = () => {
    const { cartItems, totalAmount } = useContext(CartContext);
    const history = useHistory();

    const handleCheckout = () => {
        // Logic for handling checkout process
        // This could involve API calls to process payment, etc.
        alert('Checkout process initiated!');
        history.push('/'); // Redirect to home after checkout
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                    <ul className="mb-4">
                        {cartItems.map((item) => (
                            <li key={item.id} className="flex justify-between mb-2">
                                <span>{item.name}</span>
                                <span>${item.price.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                    >
                        Complete Purchase
                    </button>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;