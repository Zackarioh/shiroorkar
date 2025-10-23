import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-400">&copy; {new Date().getFullYear()} Shiroorkar. All rights reserved.</p>
                <div className="mt-4 space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;