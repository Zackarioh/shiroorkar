import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Navigation from './components/common/Navigation';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/global.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Header />
                    <Navigation />
                    <main>
                        <Switch>
                            <Route path="/" exact component={HomePage} />
                            <Route path="/products" exact component={ProductsPage} />
                            <Route path="/products/:id" component={ProductDetailPage} />
                            <Route path="/cart" component={CartPage} />
                            <Route path="/checkout" component={CheckoutPage} />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </main>
                    <Footer />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;