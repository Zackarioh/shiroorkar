import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);

    return (
        <div className="profile-page">
            <h1 className="profile-title">User Profile</h1>
            {user ? (
                <div className="profile-info">
                    <h2 className="profile-name">Welcome, {user.name}!</h2>
                    <p className="profile-email">Email: {user.email}</p>
                    <h3 className="cart-title">Your Cart Items:</h3>
                    {cartItems.length > 0 ? (
                        <ul className="cart-items-list">
                            {cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    {item.name} - Quantity: {item.quantity}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-cart-items">Your cart is empty.</p>
                    )}
                </div>
            ) : (
                <p className="login-prompt">Please log in to view your profile.</p>
            )}
        </div>
    );
};

export default ProfilePage;