import React from 'react';

const Header = () => {
    return (
        <header className="bg-gray-900 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Shopping Website</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:text-purple-400">Home</a></li>
                        <li><a href="/products" className="hover:text-purple-400">Products</a></li>
                        <li><a href="/cart" className="hover:text-purple-400">Cart</a></li>
                        <li><a href="/profile" className="hover:text-purple-400">Profile</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;