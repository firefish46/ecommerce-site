import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { formatTaka } from '../utils/currencyUtils';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, Number(qty)));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Your Cart</h1>
        <p style={subtitleStyle}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div style={emptyCartStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Sounds like a good time to start shopping!</p>
          <Link to="/" className='Edit-btn' style={continueShoppingBtn}>Start Shopping</Link>
        </div>
      ) : (
        <div style={contentGridStyle}>
          {/* List of Items */}
          <div style={{ flex: '1 1 65%' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={cartCardStyle}>
                <img src={item.image} alt={item.name} style={productImgStyle} />
                
                <div style={infoContainerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to={`/product/${item.product}`} style={productNameStyle}>
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => removeFromCartHandler(item.product)}
                      style={removeBtnStyle}
                      title="Remove"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                  
                  <div style={priceRowStyle}>
                    <p style={priceStyle}>{formatTaka(item.price)}</p>
                    
                    <div style={qtyWrapperStyle}>
                      <label style={qtyLabelStyle}>Qty:</label>
                      <select 
                        value={item.qty} 
                        onChange={(e) => qtyChangeHandler(item.product, e.target.value)}
                        style={selectStyle}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div style={sidebarStyle}>
            <div style={summaryCardStyle}>
              <h2 style={summaryTitleStyle}>Order Summary</h2>
              
              <div style={summaryRowStyle}>
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span>{formatTaka(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))}</span>
              </div>
              
              <div style={summaryRowStyle}>
                <span>Estimated Shipping</span>
                <span style={{ color: '#27ae60' }}>FREE</span>
              </div>

              <div style={totalRowStyle}>
                <span>Total</span>
                <span>{formatTaka(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))}</span>
              </div>

              <button 
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                style={checkoutBtnStyle}
              >
                Proceed to Checkout
              </button>
              
              <p style={secureBadgeStyle}>
                <i className="fas fa-lock"></i> Secure Checkout
              </p>
            </div>
            
            <Link className='Edit-btn' to="/" style={backToShopStyle}>
              <i className="fas fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MODERN STYLES ---
const containerStyle = { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Hubot Sans', sans-serif" };
const headerStyle = { marginBottom: '30px', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' };
const titleStyle = { fontSize: '32px', fontWeight: '800', margin: 0 };
const subtitleStyle = { color: '#888', margin: '5px 0 0 0' };

const contentGridStyle = { display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' };

const cartCardStyle = { 
  display: 'flex', 
  gap: '20px', 
  backgroundColor: '#fff', 
  padding: '20px', 
  borderRadius: '16px', 
  marginBottom: '15px',
  border: '1px solid #f0f0f0',
  transition: 'transform 0.2s',
};

const productImgStyle = { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', backgroundColor: '#f9f9f9' };
const infoContainerStyle = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const productNameStyle = { fontSize: '18px', fontWeight: '700', textDecoration: 'none', color: '#1a1a1a', maxWidth: '80%' };

const priceRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' };
const priceStyle = { fontSize: '20px', fontWeight: '800', color: '#000', margin: 0 };

const qtyWrapperStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
const qtyLabelStyle = { fontSize: '14px', color: '#888' };
const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' };

const removeBtnStyle = { background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' };

const sidebarStyle = { flex: '1 1 300px', position: 'sticky', top: '20px' };
const summaryCardStyle = { backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '20px', border: '1px solid #eee' };
const summaryTitleStyle = { fontSize: '20px', fontWeight: '800', marginBottom: '20px' };

const summaryRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '15px' };
const totalRowStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #ddd', fontSize: '22px', fontWeight: '900' };

const checkoutBtnStyle = { 
  width: '100%', 
  padding: '16px', 
  backgroundColor: '#000', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '12px', 
  marginTop: '25px', 
  cursor: 'pointer', 
  fontWeight: '700', 
  fontSize: '16px',
  transition: '0.2s opacity'
};

const secureBadgeStyle = { textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '15px' };
const backToShopStyle = { display: 'block', textAlign: 'center', marginTop: '20px', textDecoration: 'none', color: '#555', fontSize: '14px', fontWeight: '600' };

const emptyCartStyle = { textAlign: 'center', padding: '80px 0', backgroundColor: '#f9f9f9', borderRadius: '20px' };
const continueShoppingBtn = { display: 'inline-block', marginTop: '20px', padding: '12px 30px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' };

export default CartPage;