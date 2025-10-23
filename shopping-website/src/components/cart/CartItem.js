import React from 'react';

const CartItem = ({ item, onRemove }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-gray-400">Quantity: {item.quantity}</p>
                    <p className="text-gray-400">Price: ${item.price.toFixed(2)}</p>
                </div>
            </div>
            <button 
                onClick={() => onRemove(item.id)} 
                className="text-red-500 hover:text-red-700 transition duration-300"
            >
                Remove
            </button>
        </div>
    );
};

export default CartItem;