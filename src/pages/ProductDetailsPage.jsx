// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext.js'; // IMPORT THE CUSTOM HOOK

const detailsContainerStyle = {
  padding: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const ProductDetailsPage = () => {
  // 1. Get the 'id' from the URL (e.g., /product/60d5ec49f3e4e112c8b8a531)
  const { id } = useParams();
 // 2. USE THE HOOK: Get the addItemToCart function
  const { addItemToCart } = useCart();

  // Local state for quantity
  const [qty, setQty] = useState(1);

  // State management for loading, error, and the single product
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // 2. Fetch the specific product using the ID
        // Uses the proxy or the full URL if you kept the axiosConfig setup
        const { data } = await axios.get(`/api/products/${id}`); 
        
        setProduct(data);
        setLoading(false);

      } catch (err) {
        setError('Failed to load product details.');
        setLoading(false);
        console.error(err);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]); // Re-run the effect whenever the 'id' parameter changes
const handleAddToCart = () => {
    // 3. USE THE FUNCTION: Call the global function with product and qty
    addItemToCart(product, qty);
    alert(`${product.name} added to cart! Quantity: ${qty}`);
  };
  return (
    <div style={detailsContainerStyle}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'block' }}>
        ← Go Back
      </Link>

      {/* Conditional Rendering based on state */}
      {loading ? (
        <h2>Loading Product...</h2>
      ) : error ? (
        <h3 style={{ color: 'red' }}>Error: {error}</h3>
      ) : (
        // 3. Display Product Details
        <div style={{ display: 'flex', gap: '40px', border: '1px solid #eee', padding: '20px' }}>
          
          {/* Left Column: Image */}
          <div style={{ flex: 1 }}>
            <img 
              src={product.image || 'https://via.placeholder.com/400?text=Product+Image'} 
              alt={product.name} 
              style={{ width: '100%', borderRadius: '8px' }} 
            />
          </div>

          {/* Right Column: Details and Action */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2>{product.name}</h2>
            <hr />
            <h3>Price: ${product.price?.toFixed(2)}</h3>
            <p><strong>Description:</strong> {product.description}</p>
            <p>
              <strong>Status:</strong> 
              <span style={{ color: product.countInStock > 0 ? 'green' : 'red' }}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
              </span>
            </p>
            
            {/* Cart Action Panel */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
  <p>
    <strong>Quantity:</strong> 
    <input 
        type="number" 
        value={qty} // Sets the value from state (using 'value' removes the need for 'defaultValue')
        min="1" 
        max={product.countInStock} 
        onChange={(e) => setQty(Number(e.target.value))} // FIX: Uses setQty to update state
        style={{ width: '60px', marginLeft: '10px' }} 
    />
</p>
                <button
                    disabled={product.countInStock === 0}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#333', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer', 
                        marginTop: '15px' 
                    }}
                  onClick={handleAddToCart} // Call the new handler} 
                >
                    Add to Cart
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;