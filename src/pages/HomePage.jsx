// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  // 1. State for data fetching
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 2. Fetch data from the backend API
        // Thanks to the proxy setting in package.json, React knows 'api/products' 
        // should be forwarded to http://localhost:5000/api/products
        const { data } = await axios.get('/api/products'); 
        
        // 3. Update state with fetched data
        setProducts(data);
        setLoading(false);

      } catch (err) {
        setError('Failed to fetch products. Is the backend server running?');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs only once after initial render

  return (
    <div style={{ padding: '20px' }}>
      <h1>Latest Products</h1>
      
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h3 style={{ color: 'red' }}>Error: {error}</h3>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* 4. Map over the products and render a ProductCard for each */}
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;