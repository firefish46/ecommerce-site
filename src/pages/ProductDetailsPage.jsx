import React, { useState, useEffect } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { addToCart } from '../actions/cartActions';
import { formatTaka } from '../utils/currencyUtils';

const detailsContainerStyle = {
  padding: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState({}); // Initial state is empty
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const { data } = await axios.get(`/api/products/${id}`); 
        setProduct(data);
        setLoading(false);
        window.scrollTo(0, 0); // Jump to top when new product loads
      } catch (err) {
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    if (id) {
      setProduct({}); // CRITICAL: Reset product state so old data disappears immediately
      setQty(1);      // Reset quantity to 1 for the new product
      fetchProduct();
    }
  }, [id]); // This ensures that every time the URL ID changes, the code runs again

  const handleAddToCart = () => {
    dispatch(addToCart(id, qty));
    navigate('/cart');
  };

  return (
    <div style={detailsContainerStyle}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'block' }}>
        ← Go Back
      </Link>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '30px', marginBottom: '10px' }}></i>
            <h2>Loading Product Details...</h2>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h3 style={{ color: 'red' }}>Error: {error}</h3>
            <button onClick={() => window.location.reload()} style={retryBtn}>Retry</button>
        </div>
      ) : (
        <div style={productFlexContainer}>
          {/* Left Side: Image */}
          <div style={{ flex: 1 }}>
            <img 
              src={product.image || 'https://via.placeholder.com/400?text=Product+Image'} 
              alt={product.name} 
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
          </div>

          {/* Right Side: Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{product.name}</h2>
            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
            
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                Price: {formatTaka(product.price)}
            </p>
            
            <p style={{ color: '#666', lineHeight: '1.6', margin: '20px 0' }}>
                <strong>Description:</strong> {product.description}
            </p>

            <div style={statusCard}>
              <p style={{ margin: '5px 0' }}>
                <strong>Status:</strong> 
                <span style={{ 
                    marginLeft: '10px', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '14px',
                    backgroundColor: product.countInStock > 0 ? '#e8f5e9' : '#ffebee',
                    color: product.countInStock > 0 ? '#2e7d32' : '#c62828' 
                }}>
                  {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                </span>
              </p>
              
              {product.countInStock > 0 && (
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <strong>Quantity:</strong> 
                    <select 
                        value={qty} 
                        onChange={(e) => setQty(Number(e.target.value))}
                        style={qtySelect}
                    >
                        {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                    </select>
                </div>
              )}

              <button
                className='cart-btn'
                disabled={product.countInStock === 0}
                onClick={handleAddToCart} 
                style={{
                    ...cartBtnStyle,
                    backgroundColor: product.countInStock === 0 ? '#ccc' : '#000',
                    cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer'
                }}
              > 
                <i className="fa-solid fa-cart-arrow-down" style={{ marginRight: '10px' }}></i>
                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Professional Styled Components ---
const productFlexContainer = {
    display: 'flex', 
    gap: '40px', 
    backgroundColor: '#fff', 
    padding: '30px', 
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    flexWrap: 'wrap'
};

const statusCard = { 
    border: '1px solid #f0f0f0', 
    padding: '20px', 
    marginTop: 'auto', 
    borderRadius: '10px',
    backgroundColor: '#fafafa'
};

const qtySelect = {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '70px'
};

const cartBtnStyle = {
    marginTop: '20px',
    width: '100%',
    padding: '15px',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    transition: '0.3s'
};

const retryBtn = { padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default ProductDetailsPage;