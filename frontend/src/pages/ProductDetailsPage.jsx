import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { formatTaka } from '../utils/currencyUtils';
import '../styles/ProductDetailsPage.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image & Overlay States
  const [mainImage, setMainImage] = useState('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Panning States
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

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

  // --- PANNING LOGIC ---
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
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // FIX: Build thumbnail list — filter(Boolean) removes any undefined/null/""
  // so <img src=""> is never rendered (avoids the browser re-download warning)
  const thumbnailImages = (product.images?.length > 0
    ? product.images
    : [product.image]
  ).filter(Boolean);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="details-container">
      <Link to="/" className="back-link">← Back to Shop</Link>

      {loading ? (
        <div className="center-state">
          <i className="fa-solid fa-spinner fa-spin spinner-icon"></i>
        </div>
      ) : (
        <div className="product-flex">

          {/* LEFT: IMAGE SECTION */}
          <div className="image-section">
            {/* Only render main image if src is truthy */}
            <div className="main-image-container" onClick={() => setIsOverlayOpen(true)}>
              {mainImage && (
                <img src={mainImage} alt={product.name} className="main-image" />
              )}
            </div>

            {/* Thumbnail row — guaranteed no empty src */}
            <div className="thumbnail-row">
              {thumbnailImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index + 1}`}
                  onClick={() => setMainImage(img)}
                  className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="details-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">{formatTaka(product.price)}</p>

            <div className="description-box">
              <h4>Description</h4>
              <p className="description-text">{product.description}</p>
            </div>

            <div className="status-card">
              {/* Stock Status */}
              <div className="status-row">
                <strong>Status: </strong>
                <span className={`status-badge ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                </span>
              </div>

              {/* Qty Selector */}
              <div className="qty-wrapper">
                <strong>Qty:</strong>
                {product.countInStock > 0 ? (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="qty-select"
                  >
                    {[...Array(Number(product.countInStock)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                ) : (
                  <span className="qty-unavailable">N/A</span>
                )}
              </div>

              {/* Buttons */}
              <div className="btn-group">
                <button
                  className="cart-btn"
                  disabled={product.countInStock === 0}
                  onClick={() => { dispatch(addToCart(id, qty)); navigate('/cart'); }}
                >
                  Add to Cart
                </button>

                <button className="share-btn" onClick={handleShare}>
                  <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-share-nodes'}`}></i>
                  {copySuccess ? ' Copied!' : ' Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- IMAGE OVERLAY --- */}
      <div
        className="overlay-wrapper"
        style={{
          opacity: isOverlayOpen ? 1 : 0,
          pointerEvents: isOverlayOpen ? 'auto' : 'none',
        }}
        onClick={closeOverlay}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Only render overlay image if src is truthy */}
        {mainImage && (
          <img
            ref={imageRef}
            src={mainImage}
            alt="Preview"
            className="overlay-image"
            onMouseDown={handleMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
              if (isZoomed) setPosition({ x: 0, y: 0 });
            }}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${isOverlayOpen ? (isZoomed ? 2.5 : 1) : 0.9})`,
              cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          />
        )}
        {isZoomed && !isDragging && (
          <div className="pan-hint">Hold and Drag to Explore</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;