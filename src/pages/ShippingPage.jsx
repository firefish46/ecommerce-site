import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const ShippingPage = () => {
  // 1. Get existing address from state to pre-fill the form
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
    // 2. Dispatch the save action (we will create this next)
    dispatch({
        type: 'CART_SAVE_SHIPPING_ADDRESS',
        payload: { address, city, postalCode, country }
    });
    // 3. Save to localStorage for persistence
    localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
    
    // 4. Move to the next step (Payment or Place Order)
    navigate('/payment');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h1>Shipping</h1>
      <form onSubmit={submitHandler}>
        <div style={inputGroupStyle}>
          <label>Address</label>
          <input type="text" placeholder="Enter address" value={address} required 
            onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
        </div>

        <div style={inputGroupStyle}>
          <label>City</label>
          <input type="text" placeholder="Enter city" value={city} required 
            onChange={(e) => setCity(e.target.value)} style={inputStyle} />
        </div>

        <div style={inputGroupStyle}>
          <label>Postal Code</label>
          <input type="text" placeholder="Enter postal code" value={postalCode} required 
            onChange={(e) => setPostalCode(e.target.value)} style={inputStyle} />
        </div>

        <div style={inputGroupStyle}>
          <label>Country</label>
          <input type="text" placeholder="Enter country" value={country} required 
            onChange={(e) => setCountry(e.target.value)} style={inputStyle} />
        </div>

        <button type="submit" style={buttonStyle}>Continue to Checkout</button>
      </form>
    </div>
  );
};

// Simple Styles
const inputGroupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.1em' };

export default ShippingPage;