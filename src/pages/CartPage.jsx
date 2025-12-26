import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../actions/cartActions'; // 1. Import removeFromCart
import { formatTaka } from '../utils/currencyUtils'; // 2. Import Taka formatter

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, Number(qty)));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id)); // 3. Activate the dispatch
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          Your cart is empty. <Link to="/">Go Back Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
          {/* Cart Items List */}
          <div style={{ flex: 2 }}>
            {cartItems.map((item) => (
              <div key={item.product} style={cartItemStyle}>
                <img src={item.image} alt={item.name} style={{ width: '100px', borderRadius: '5px' }} />
                
                <div style={{ flex: 1, marginLeft: '20px' }}>
                  <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
                    {item.name}
                  </Link>
                  <p style={{ color: '#27ae60', fontWeight: 'bold' }}>{formatTaka(item.price)}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <select 
                    value={item.qty} 
                    onChange={(e) => qtyChangeHandler(item.product, e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px' }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>

                  {/* 4. THE REMOVE BUTTON (TRASH ICON) */}
                  <button 
                    type="button" 
                    onClick={() => removeFromCartHandler(item.product)}
                    style={removeButtonStyle}
                    title="Remove Item"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div style={summaryBoxStyle}>
            <h2 style={{ fontSize: '1.2rem' }}>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
            </h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#222' }}>
              {formatTaka(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))}
            </p>
            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
            <button 
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              style={checkoutButtonStyle}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const cartItemStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  padding: '15px 0', 
  borderBottom: '1px solid #eee' 
};

const removeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#e74c3c',
  cursor: 'pointer',
  fontSize: '1.1rem',
  padding: '10px'
};

const summaryBoxStyle = { 
  flex: 1, 
  border: '1px solid #eee', 
  padding: '25px', 
  height: 'fit-content',
  backgroundColor: '#fdfdfd',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
};

const checkoutButtonStyle = { 
  width: '100%', 
  padding: '12px', 
  backgroundColor: '#1a1a1a', 
  color: 'white', 
  border: 'none', 
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem'
};

export default CartPage;