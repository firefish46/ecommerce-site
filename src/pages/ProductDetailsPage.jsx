import React, { useState, useEffect } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { addToCart } from '../actions/cartActions';

const detailsContainerStyle = {
  padding: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Added for navigation
  const dispatch = useDispatch(); // Initialize Redux Dispatch

  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`); 
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // FIX: Updated to use Redux Dispatch instead of addItemToCart context
  const handleAddToCart = () => {
    dispatch(addToCart(id, qty)); // This saves to Redux and LocalStorage
    navigate('/cart'); // Redirect to cart page
  };

  return (
    <div style={detailsContainerStyle}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'block' }}>
        ← Go Back
      </Link>

      {loading ? (
        <h2>Loading Product...</h2>
      ) : error ? (
        <h3 style={{ color: 'red' }}>Error: {error}</h3>
      ) : (
        <div style={{ display: 'flex', gap: '40px', border: '1px solid #eee', padding: '20px' }}>
          
          <div style={{ flex: 1 }}>
            <img 
              src={product.image || 'https://via.placeholder.com/400?text=Product+Image'} 
              alt={product.name} 
              style={{ width: '100%', borderRadius: '8px' }} 
            />
          </div>

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
            
            <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
              <p>
                <strong>Quantity:</strong> 
                <input 
                    type="number" 
                    value={qty} 
                    min="1" 
                    max={product.countInStock} 
                    onChange={(e) => setQty(Number(e.target.value))} 
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
                      cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer', 
                      marginTop: '15px' 
                  }}
                onClick={handleAddToCart} 
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