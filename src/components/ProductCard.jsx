// src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  textAlign: 'center',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const ProductCard = ({ product }) => {
return (
<div style={cardStyle}>
 {/* This Link wraps the image/title (and is working!) */}
 <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
 <img /* ... */ />
  <h4>{product.name}</h4>
 </Link>
 
 <p /* ... */> ${product.price.toFixed(2)} </p>
 <p /* ... */> {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'} </p>

{/* FIX: Wrap the button itself in a separate Link for a clean click area */}<Link to={`/product/${product._id}`}> 
  <button
 disabled={product.countInStock === 0}
style={{ padding: '8px 15px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
 >
  View Details
   </button>
 </Link>
</div>
);
};

export default ProductCard;