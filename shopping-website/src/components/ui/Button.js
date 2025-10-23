import React from 'react';

const Button = ({ children, onClick, className, disabled }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 hover:bg-purple-700 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;