import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart || { shippingAddress: {} });
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
        type: 'CART_SAVE_SHIPPING_ADDRESS',
        payload: { address, city, postalCode, country }
    });
    localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div style={containerStyle}>
      {/* Checkout Progress Bar */}
      <div style={progressContainer}>
        <div style={stepActive}>Login</div>
        <div style={lineActive}></div>
        <div style={stepActive}>Shipping</div>
        <div style={lineInactive}></div>
        <div style={stepInactive}>Payment</div>
        <div style={lineInactive}></div>
        <div style={stepInactive}>Place Order</div>
      </div>

      <div style={formCardStyle}>
        <header style={{ marginBottom: '25px' }}>
          <h1 style={titleStyle}>Shipping Details</h1>
          <p style={subtitleStyle}>Please enter your delivery information accurately.</p>
        </header>

        <form onSubmit={submitHandler}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Street Address</label>
            <input 
              type="text" 
              placeholder="e.g. 123 Tech Lane" 
              value={address} 
              required 
              onChange={(e) => setAddress(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <div style={flexRow}>
            <div style={{ flex: 1, ...inputGroupStyle }}>
              <label style={labelStyle}>City</label>
              <input 
                type="text" 
                placeholder="City" 
                value={city} 
                required 
                onChange={(e) => setCity(e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div style={{ flex: 1, ...inputGroupStyle }}>
              <label style={labelStyle}>Postal Code</label>
              <input 
                type="text" 
                placeholder="Code" 
                value={postalCode} 
                required 
                onChange={(e) => setPostalCode(e.target.value)} 
                style={inputStyle} 
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Country</label>
            <input 
              type="text" 
              placeholder="Enter country" 
              value={country} 
              required 
              onChange={(e) => setCountry(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Continue to Payment <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
          </button>
        </form>
      </div>

      <div style={footerNote}>
        <i className="fas fa-shield-alt"></i> Your data is encrypted and secure
      </div>
    </div>
  );
};

// --- MODERN STYLES ---
const containerStyle = { 
  fontFamily: "'Hubot Sans', sans-serif", 
  maxWidth: '600px', 
  margin: '60px auto', 
  padding: '0 20px' 
};

// Checkout Progress Steps
const progressContainer = { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', gap: '10px' };
const stepActive = { fontSize: '12px', fontWeight: '800', color: '#000', textTransform: 'uppercase' };
const stepInactive = { fontSize: '12px', fontWeight: '500', color: '#ccc', textTransform: 'uppercase' };
const lineActive = { height: '2px', width: '30px', backgroundColor: '#000' };
const lineInactive = { height: '2px', width: '30px', backgroundColor: '#eee' };

const formCardStyle = { 
  backgroundColor: '#fff', 
  padding: '40px', 
  borderRadius: '24px', 
  boxShadow: '0 10px 40px rgba(0,0,0,0.04)', 
  border: '1px solid #f0f0f0' 
};

const titleStyle = { fontSize: '28px', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.5px' };
const subtitleStyle = { fontSize: '14px', color: '#888', margin: 0 };

const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#444', marginBottom: '8px' };
const inputStyle = { 
  fontFamily: "'Hubot Sans', sans-serif", 
  width: '100%', 
  padding: '14px', 
  borderRadius: '12px', 
  border: '1px solid #e0e0e0', 
  fontSize: '15px', 
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  outline: 'none',
  backgroundColor: '#fafafa'
};

const flexRow = { display: 'flex', gap: '15px' };

const buttonStyle = { 
  fontFamily: "'Hubot Sans', sans-serif", 
  width: '100%', 
  padding: '16px', 
  backgroundColor: '#000', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '14px', 
  cursor: 'pointer', 
  fontSize: '16px', 
  fontWeight: '700',
  marginTop: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const footerNote = { textAlign: 'center', marginTop: '25px', fontSize: '12px', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

export default ShippingPage;