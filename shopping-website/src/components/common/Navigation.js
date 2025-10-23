import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-white text-2xl font-bold">
                    Shopping Website
                </div>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                    <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
                    <Link to="/cart" className="text-gray-300 hover:text-white">Cart</Link>
                    <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;