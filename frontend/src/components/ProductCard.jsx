import React, { useState } from 'react'; // Added useState
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { toast } from 'react-toastify'; // Import toast
import '../styles/ProductCard.css';

const formatTaka = (amount) => {
  return amount.toLocaleString('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false); // Track local animation state

  const addToCartHandler = (e) => {
    e.preventDefault();
    if (product.countInStock > 0) {
      dispatch(addToCart(product._id, 1));
      
      // Trigger Animation
      setIsAdded(true);
      toast.success(`${product.name} added to cart!`, {
        icon: "🛒"
      });

      // Reset button icon after 1.5 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }
  };

  const optimizedImage =
    product.image && product.image.includes('cloudinary')
      ? product.image.replace('/upload/', '/upload/w_300,c_scale,q_auto,f_auto/')
      : product.image;

  return (
    <div className={`product-card-container ${isAdded ? 'card-bounce' : ''}`}>
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="image-zoom-wrapper">
          <img
            src={optimizedImage || 'https://via.placeholder.com/300?text=No+Image'}
            alt={product.name}
            className="product-img"
          />
          {product.countInStock === 0 && (
            <div className="out-of-stock-overlay">SOLD OUT</div>
          )}
        </div>

        <div className="card-content">
          <h4 className="card-title">{product.name}</h4>

          <div className="card-footer-row">
            <div className="price-container">
              <p className="card-price">{formatTaka(product.price)}</p>
              <p className={`stock-text ${product.countInStock > 0 ? 'in-stock' : 'out-stock'}`}>
                {product.countInStock > 0 ? '● In Stock' : '○ Out of Stock'}
              </p>
            </div>

            {product.countInStock > 0 && (
              <button
                onClick={addToCartHandler}
                className={`add-to-cart-btn ${isAdded ? 'btn-success-animate' : ''}`}
                title="Add to Cart"
                disabled={isAdded} // Prevent double clicks during animation
              >
                <i className={isAdded ? "fa-solid fa-check" : "fa-solid fa-cart-plus"}></i>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;