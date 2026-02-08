import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';

const formatTaka = (amount) => {
  return amount.toLocaleString('bn-BD', { 
    style: 'currency', 
    currency: 'BDT',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  });
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (e) => {
    e.preventDefault(); 
    if (product.countInStock > 0) {
      dispatch(addToCart(product._id, 1));
    }
  };

  const optimizedImage = (product.image && product.image.includes('cloudinary')) 
    ? product.image.replace('/upload/', '/upload/w_300,c_scale,q_auto,f_auto/') 
    : product.image;

  return (
    <div className="product-card-container" style={styles.card}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        
        <div className="image-zoom-wrapper" style={styles.imageWrapper}>
          <img 
            src={optimizedImage || 'https://via.placeholder.com/300?text=No+Image'} 
            alt={product.name} 
            className="product-img"
            style={styles.image}
          />
          {product.countInStock === 0 && (
            <div style={styles.outOfStockOverlay}>SOLD OUT</div>
          )}
        </div>

        <div style={styles.content}>
          <h4 style={styles.title}>{product.name}</h4>
          
          <div style={styles.footerRow}>
            <div style={styles.priceContainer}>
              <p style={styles.price}>{formatTaka(product.price)}</p>
              <p style={{ 
                ...styles.stockText, 
                color: product.countInStock > 0 ? '#27ae60' : '#e74c3c' 
              }}>
                {product.countInStock > 0 ? '● In Stock' : '○ Out of Stock'}
              </p>
            </div>

            {product.countInStock > 0 && (
              <button 
                onClick={addToCartHandler}
                className="add-to-cart-btn"
                style={styles.cartBtn}
                title="Add to Cart"
              >
                <i className="fa-solid fa-cart-plus"></i>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

// ... (Styles remain the same)

// --- STYLES ---
const styles = {
  card: {
    width: '210px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Hubot Sans', sans-serif",
    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
  },
  imageWrapper: {
    width: '100%',
    height: '180px',
    backgroundColor: '#fdfdfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  image: {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
  },
  content: {
    padding: '15px',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    height: '34px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    color: '#333',
    lineHeight: '1.4'
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Aligns button perfectly with price
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  price: {
    fontSize: '18px',
    fontWeight: '900',
    margin: 0,
    color: '#000',
    letterSpacing: '-0.5px'
  },
  stockText: {
    fontSize: '9px',
    fontWeight: '700',
    margin: '2px 0 0 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cartBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  outOfStockOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '900',
    color: '#000',
    zIndex: 1
  }
};

export default ProductCard;