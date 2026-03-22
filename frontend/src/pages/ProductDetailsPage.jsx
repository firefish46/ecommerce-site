// frontend/src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { formatTaka } from '../utils/currencyUtils';
import '../styles/ProductDetailsPage.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const ProductDetailsPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [qty, setQty]             = useState(1);
  const [product, setProduct]     = useState({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [activeThumb, setActiveThumb] = useState(0);

  // Overlay / zoom
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isZoomed, setIsZoomed]           = useState(false);
  const [position, setPosition]           = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging]       = useState(false);
  const [startPos, setStartPos]           = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // UI feedback
  const [copySuccess, setCopySuccess]   = useState(false);
  const [addedToCart, setAddedToCart]   = useState(false);

  // Cart qty already in cart
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartItem  = cartItems.find((x) => x.product === id);
  const qtyInCart = cartItem?.qty || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(data);
        setMainImage(data.image);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product.');
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const thumbnailImages = (
    product.images?.length > 0 ? product.images : [product.image]
  ).filter(Boolean);

  // Stock helpers
  const inStock        = product.countInStock > 0;
  const lowStock       = product.countInStock > 0 && product.countInStock <= 5;
  const remainingStock = product.countInStock - qtyInCart;
  const canAddMore     = remainingStock > 0;
  const maxQty         = Math.min(remainingStock, 10);

  // Panning
  const handleMouseDown = (e) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging || !isZoomed) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleAddToCart = () => {
    dispatch(addToCart(id, qty));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(addToCart(id, qty));
    navigate('/cart');
  };

  const selectThumb = (img, index) => {
    setMainImage(img);
    setActiveThumb(index);
  };

  if (error) return (
    <div className="pdp-error">
      <i className="fas fa-circle-exclamation"></i>
      <p>{error}</p>
      <Link to="/" className="pdp-error__back">← Back to Shop</Link>
    </div>
  );

  return (
    <div className="pdp-container">

      {/* Back */}
      <Link to="/" className="pdp-back">
        <i className="fas fa-arrow-left"></i> Back to Shop
      </Link>

      {loading ? (
        <div className="pdp-loading">
          <div className="pdp-loading__spinner"></div>
          <p>Loading product...</p>
        </div>
      ) : (
        <div className="pdp-grid">

          {/* ── LEFT: Images ── */}
          <div className="pdp-images">

            {/* Main image */}
            <div
              className="pdp-main-img-wrap"
              onClick={() => setIsOverlayOpen(true)}
              title="Click to zoom"
            >
              {mainImage && (
                <img src={mainImage} alt={product.name} className="pdp-main-img" />
              )}
              <div className="pdp-zoom-hint">
                <i className="fas fa-magnifying-glass-plus"></i>
              </div>
              {!inStock && (
                <div className="pdp-sold-out-overlay">
                  <span>Sold Out</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {thumbnailImages.length > 1 && (
              <div className="pdp-thumbs">
                {thumbnailImages.map((img, i) => (
                  <button
                    key={i}
                    className={`pdp-thumb ${activeThumb === i ? 'pdp-thumb--active' : ''}`}
                    onClick={() => selectThumb(img, i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`view-${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="pdp-details">

            {/* Brand / Category tag */}
            {product.category && (
              <span className="pdp-category">{product.category}</span>
            )}

            <h1 className="pdp-name">{product.name}</h1>

            {/* Price */}
            <div className="pdp-price-row">
              <span className="pdp-price">{formatTaka(product.price)}</span>
            </div>

            {/* Stock status */}
            <div className="pdp-stock-row">
              {!inStock && (
                <span className="pdp-stock pdp-stock--out">
                  <i className="fas fa-ban"></i> Out of Stock
                </span>
              )}
              {inStock && lowStock && (
                <span className="pdp-stock pdp-stock--low">
                  <i className="fas fa-fire"></i> Only {product.countInStock} left!
                </span>
              )}
              {inStock && !lowStock && (
                <span className="pdp-stock pdp-stock--in">
                  <i className="fas fa-circle-check"></i> In Stock
                </span>
              )}
              {inStock && qtyInCart > 0 && (
                <span className="pdp-in-cart-note">
                  <i className="fas fa-cart-shopping"></i>
                  {qtyInCart} already in cart
                </span>
              )}
            </div>

            {/* Description */}
            <div className="pdp-description">
              <h4 className="pdp-description__label">About this product</h4>
              <p className="pdp-description__text">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="pdp-actions">

              {inStock && canAddMore ? (
                <>
                  {/* Qty selector */}
                  <div className="pdp-qty-row">
                    <label className="pdp-qty-label">Quantity</label>
                    <div className="pdp-qty-control">
                      <button
                        className="pdp-qty-btn"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                      >−</button>
                      <span className="pdp-qty-value">{qty}</span>
                      <button
                        className="pdp-qty-btn"
                        onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                        disabled={qty >= maxQty}
                      >+</button>
                    </div>
                    <span className="pdp-qty-max">
                      Max {maxQty}
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pdp-cta-row">
                    <button
                      className={`pdp-cart-btn ${addedToCart ? 'pdp-cart-btn--added' : ''}`}
                      onClick={handleAddToCart}
                    >
                      {addedToCart
                        ? <><i className="fas fa-check"></i> Added!</>
                        : <><i className="fas fa-cart-plus"></i> Add to Cart</>
                      }
                    </button>
                    <button className="pdp-buy-btn" onClick={handleBuyNow}>
                      Buy Now
                    </button>
                  </div>
                </>
              ) : inStock && !canAddMore ? (
                // Already have max in cart
                <div className="pdp-max-cart-note">
                  <i className="fas fa-circle-check"></i>
                  You've added the maximum available quantity to your cart.
                  <button className="pdp-goto-cart" onClick={() => navigate('/cart')}>
                    View Cart <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              ) : (
                // Out of stock
                <div className="pdp-out-of-stock-msg">
                  <button className="pdp-cart-btn pdp-cart-btn--disabled" disabled>
                    <i className="fas fa-ban"></i> Out of Stock
                  </button>
                  <p className="pdp-restock-note">Check back later for availability.</p>
                </div>
              )}

              {/* Share */}
              <button className="pdp-share-btn" onClick={handleShare}>
                <i className={`fas ${copySuccess ? 'fa-check' : 'fa-share-nodes'}`}></i>
                {copySuccess ? 'Link Copied!' : 'Share Product'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="pdp-trust">
              <div className="pdp-trust__item">
                <i className="fas fa-truck"></i>
                <span>Fast Delivery</span>
              </div>
              <div className="pdp-trust__item">
                <i className="fas fa-shield-halved"></i>
                <span>Secure Payment</span>
              </div>
              <div className="pdp-trust__item">
                <i className="fas fa-rotate-left"></i>
                <span>Easy Returns</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Image Overlay ── */}
      {isOverlayOpen && (
        <div
          className="pdp-overlay"
          onClick={closeOverlay}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <button className="pdp-overlay__close" onClick={closeOverlay}>
            <i className="fas fa-times"></i>
          </button>
          {mainImage && (
            <img
              ref={imageRef}
              src={mainImage}
              alt="Preview"
              className="pdp-overlay__img"
              onMouseDown={handleMouseDown}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
                if (isZoomed) setPosition({ x: 0, y: 0 });
              }}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${isZoomed ? 2.5 : 1})`,
                cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            />
          )}
          {isZoomed && !isDragging && (
            <div className="pdp-overlay__hint">
              <i className="fas fa-hand"></i> Drag to explore
            </div>
          )}
          {!isZoomed && (
            <div className="pdp-overlay__hint">
              <i className="fas fa-magnifying-glass-plus"></i> Click to zoom
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;