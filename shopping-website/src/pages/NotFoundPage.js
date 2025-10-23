import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-xl">Oops! The page you are looking for does not exist.</p>
            <a href="/" className="mt-6 text-purple-400 hover:text-purple-600 transition duration-300">
                Go back to Home
            </a>
        </div>
    );
};

export default NotFoundPage;