import React, { useState, useEffect, useRef } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { addToCart } from '../actions/cartActions';
import { formatTaka } from '../utils/currencyUtils';

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
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`); 
        setProduct(data);
        setMainImage(data.image);
        setLoading(false);
        window.scrollTo(0, 0);
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
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
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

  if (error) return <div className="error-message">{error}</div>;
  return (
    <div style={detailsContainerStyle}>
      <Link to="/" style={backLinkStyle}> ← Back to Shop </Link>

      {loading ? (
        <div style={centerTextStyle}><i className="fa-solid fa-spinner fa-spin" style={spinnerStyle}></i></div>
      ) : (
        <div style={productFlexContainer}>
          
          {/* LEFT: IMAGE SECTION */}
          <div style={imageSectionStyle}>
            <div style={mainImageContainer} onClick={() => setIsOverlayOpen(true)}>
              <img src={mainImage} alt={product.name} style={mainImageStyle} />
            </div>
            <div style={thumbnailRow}>
               {(product.images?.length > 0 ? product.images : [product.image]).map((img, index) => (
                 <img 
                  key={index}
                  src={img}
                  alt="thumb"
                  onClick={() => setMainImage(img)}
                  style={{
                    ...thumbnailStyle,
                    border: mainImage === img ? '2px solid #000' : '2px solid transparent',
                  }}
                 />
               ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div style={detailsSectionStyle}>
            <h1 style={productTitleStyle}>{product.name}</h1>
            <p style={priceStyle}>{formatTaka(product.price)}</p>
            
            {/* RESTORED: Description Section */}
            <div style={descriptionBox}>
                <h4 style={{ marginBottom: '8px', color: '#111' }}>Description</h4>
                <p style={descStyle}>{product.description}</p>
            </div>

            <div style={statusCard}>
              {/* RESTORED: Stock Status */}
              <div style={{ marginBottom: '20px' }}>
                <strong>Status: </strong>
                <span style={{ 
                    ...statusBadge,
                    backgroundColor: product.countInStock > 0 ? '#e8f5e9' : '#ffebee',
                    color: product.countInStock > 0 ? '#2e7d32' : '#c62828' 
                }}>
                  {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                </span>
              </div>

              <div style={qtyWrapper}>
                <strong>Qty:</strong> 
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} style={qtySelect}>
                  {[...Array(product.countInStock || 0).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>

              <div style={btnGroup}>
                <button 
                className='Edit-btn'
                    disabled={product.countInStock === 0} 
                    onClick={() => { dispatch(addToCart(id, qty)); navigate('/cart'); }} 
                    style={cartBtnStyle}
                >
                    Add to Cart
                </button>
                
                <button 
                className='cancelBtn'
                onClick={handleShare} style={shareBtnStyle}>
                  <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-share-nodes'}`}></i>
                  {copySuccess ? ' Copied!' : ' Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- OVERLAY WITH SMOOTH BLUR & PANNING --- */}
      <div 
        style={{
          ...overlayWrapper,
          opacity: isOverlayOpen ? 1 : 0,
          pointerEvents: isOverlayOpen ? 'auto' : 'none',
        }} 
        onClick={closeOverlay}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          ref={imageRef}
          src={mainImage} 
          alt="Preview" 
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
            if (isZoomed) setPosition({ x: 0, y: 0 }); // Reset position on zoom-out
          }}
          style={{
            ...overlayImageStyle,
            transform: `translate(${position.x}px, ${position.y}px) scale(${isOverlayOpen ? (isZoomed ? 2.5 : 1) : 0.9})`,
            cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        />
        {isZoomed && !isDragging && (
            <div style={panHint}>Hold and Drag to Explore</div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const detailsContainerStyle = { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Hubot sans' };
const backLinkStyle = { textDecoration: 'none', color: '#888', marginBottom: '30px', display: 'inline-block', fontWeight: '500' };
const productFlexContainer = { display: 'flex', gap: '60px', flexWrap: 'wrap' };
const imageSectionStyle = { flex: 1.2, minWidth: '350px' };

const mainImageContainer = { 
  width: '100%', height: '550px', backgroundColor: '#f9f9f9', borderRadius: '30px', 
  overflow: 'hidden', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' 
};

const mainImageStyle = { width: '100%', height: '100%', objectFit: 'contain' };
const thumbnailRow = { display: 'flex', gap: '15px', marginTop: '20px' };
const thumbnailStyle = { width: '75px', height: '75px', borderRadius: '15px', objectFit: 'cover', cursor: 'pointer' };

const detailsSectionStyle = { flex: 1, minWidth: '350px' };
const productTitleStyle = { fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px' };
const priceStyle = { fontSize: '2rem', fontWeight: '700', color: '#111', marginBottom: '20px' };

const descriptionBox = { fontFamily: 'Hubot sans', margin: '30px 0', padding: '20px', backgroundColor: '#fcfcfc', borderRadius: '15px', border: '1px solid #f0f0f0' };
const descStyle = { color: '#555', lineHeight: '1.7', fontSize: '1rem' };

const statusCard = { fontFamily: 'Hubot sans', padding: '30px', borderRadius: '30px', border: '1px solid #eee', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' };
const statusBadge = { padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' };
const qtyWrapper = { marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' };
const qtySelect = { padding: '10px 15px', borderRadius: '12px', border: '1px solid #ddd', fontWeight: 'bold' };

const btnGroup = { fontFamily: 'Hubot sans', display: 'flex', gap: '15px' };
const cartBtnStyle = {  fontFamily: 'Hubot sans', flex: 3, padding: '20px', border: 'none', borderRadius: '18px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' };
const shareBtnStyle = { fontFamily: 'Hubot sans', flex: 1.2, padding: '20px', border: '1px solid #eee', borderRadius: '18px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' };

// --- OVERLAY STYLES ---
const overlayWrapper = {
  position: 'fixed',
  top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, 0.25)', 
  backdropFilter: 'blur(45px)', 
  WebkitBackdropFilter: 'blur(45px)',
  zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center',
  transition: 'opacity 0.5s ease-in-out', overflow: 'hidden'
};

const overlayImageStyle = {
  maxWidth: '85%', maxHeight: '85%', objectFit: 'contain',
  borderRadius: '10px',
  userSelect: 'none',
  WebkitUserDrag: 'none'
};

const panHint = {
    position: 'absolute', bottom: '40px', color: '#555', fontSize: '12px', 
    backgroundColor: 'rgba(255,255,255,0.8)', padding: '8px 20px', borderRadius: '20px',
    letterSpacing: '1px', fontWeight: 'bold'
};

const centerTextStyle = { textAlign: 'center', padding: '100px 0' };
const spinnerStyle = { fontSize: '30px', color: '#000' };

export default ProductDetailsPage;