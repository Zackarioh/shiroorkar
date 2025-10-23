import React from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import './product.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const { product, loading, error } = useProduct(productId);

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error">Error loading product details.</div>;

    return (
        <div className="product-detail">
            <h1 className="product-title">{product.title}</h1>
            <img src={product.image} alt={product.title} className="product-image" />
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button className="cta-button">Add to Cart</button>
        </div>
    );
};

export default ProductDetail;