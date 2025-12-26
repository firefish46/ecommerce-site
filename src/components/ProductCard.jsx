import React from 'react';
import { Link } from 'react-router-dom';

const formatTaka = (amount) => {
  return amount.toLocaleString('bn-BD', { style: 'currency', currency: 'BDT' });
};

const styles = {
  card: {
    border: '1px solid #eee',
    borderRadius: '6px',
    padding: '10px', // Reduced from 15px
    textAlign: 'center',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)', // Softer shadow
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '180px', // Optional: fixed width for a mini-card feel
    margin: '5px'
  },
  image: {
    width: '100%',
    height: '130px', // Smaller height (was 200px)
    objectFit: 'contain',
    marginBottom: '8px',
    borderRadius: '4px',
    backgroundColor: '#fdfdfd'
  },
  title: {
    fontSize: '14px', // Smaller text
    margin: '5px 0',
    height: '36px', // Fits 2 lines of text
    overflow: 'hidden',
    lineHeight: '1.3',
    fontWeight: '600',
    color: '#333'
  },
  price: {
    fontSize: '16px', // Reduced from 18px
    fontWeight: 'bold',
    margin: '5px 0',
    color: '#0d76ffee',
  },
  stockText: {
    fontSize: '12px', // Smaller text
    marginBottom: '8px'
  }
};

const ProductCard = ({ product }) => {
  // Optimized for a smaller card (w_250 instead of w_400)
  const optimizedImage = (product.image && product.image.includes('cloudinary')) 
    ? product.image.replace('/upload/', '/upload/w_250,c_scale,q_auto,f_auto/') 
    : product.image;

  return (
    <div className='cardclass' style={styles.card}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img 
          src={optimizedImage || 'https://via.placeholder.com/150?text=No+Image'} 
          alt={product.name} 
          style={styles.image}
        />
        <h4 style={styles.title}>{product.name}</h4>
      </Link>
      
      <div>
        <p style={styles.price}>{formatTaka(product.price)}</p>
        
        <p style={{ ...styles.stockText, color: product.countInStock > 0 ? '#27ae60' : '#e74c3c' }}>
          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>

        <Link to={`/product/${product._id}`}> 
          <button
            disabled={product.countInStock === 0}
            className='viewdetails-btn'
            style={{
               width: '100%',
               padding: '6px', // Smaller padding
               fontSize: '12px', // Smaller button text
               cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer',
               backgroundColor: product.countInStock === 0 ? '#ccc' : '',
               borderRadius: '4px',
               border: '1px solid #ddd'
            }}
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;