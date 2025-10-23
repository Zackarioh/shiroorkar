import React from 'react';
import Header from '../components/common/Header';
import Navigation from '../components/common/Navigation';
import ProductList from '../components/product/ProductList';
import Footer from '../components/common/Footer';

const HomePage = () => {
    return (
        <div>
            <Header />
            <Navigation />
            <main className="container mx-auto my-8">
                <h1 className="text-3xl font-bold text-center mb-6">Welcome to Our Shopping Website</h1>
                <ProductList />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;