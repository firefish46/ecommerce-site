// frontend/src/pages/ShippingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/ShippingPage.css';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart || { shippingAddress: {} });
  const { shippingAddress } = cart;

  const [address, setAddress]       = useState(shippingAddress?.address || '');
  const [city, setCity]             = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry]       = useState(shippingAddress?.country || 'Bangladesh');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: 'CART_SAVE_SHIPPING_ADDRESS',
      payload: { address, city, postalCode, country },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({ address, city, postalCode, country })
    );
    navigate('/payment');
  };

  return (
    <div className="ship-page">

      {/* Progress */}
      <div className="ship-progress">
        <div className="ship-step ship-step--done">
          <div className="ship-step__dot"></div>
          <span>Login</span>
        </div>
        <div className="ship-step__line ship-step__line--done"></div>
        <div className="ship-step ship-step--active">
          <div className="ship-step__dot"></div>
          <span>Shipping</span>
        </div>
        <div className="ship-step__line"></div>
        <div className="ship-step">
          <div className="ship-step__dot"></div>
          <span>Payment</span>
        </div>
        <div className="ship-step__line"></div>
        <div className="ship-step">
          <div className="ship-step__dot"></div>
          <span>Place Order</span>
        </div>
      </div>

      <div className="ship-card">

        {/* ✅ Back button — goes to previous page in history */}
        <button className="ship-back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <header className="ship-header">
          <h1 className="ship-title">Shipping Details</h1>
          <p className="ship-subtitle">Enter your delivery information accurately.</p>
        </header>

        <form onSubmit={submitHandler} className="ship-form">

          {/* Street Address */}
          <div className="ship-field">
            <label className="ship-label">
              <i className="fas fa-map-marker-alt"></i> Street Address
            </label>
            <input
              type="text"
              className="ship-input"
              placeholder="e.g. 123 Mirpur Road"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* City + Postal Code */}
          <div className="ship-row">
            <div className="ship-field">
              <label className="ship-label">
                <i className="fas fa-city"></i> City
              </label>
              <input
                type="text"
                className="ship-input"
                placeholder="Dhaka"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="ship-field">
              <label className="ship-label">
                <i className="fas fa-hashtag"></i> Postal Code
              </label>
              <input
                type="text"
                className="ship-input"
                placeholder="1207"
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          {/* Country */}
          <div className="ship-field">
            <label className="ship-label">
              <i className="fas fa-globe"></i> Country
            </label>
            <input
              type="text"
              className="ship-input"
              placeholder="Bangladesh"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <button type="submit" className="ship-submit-btn">
            Continue to Payment
            <i className="fas fa-arrow-right"></i>
          </button>

        </form>
      </div>

      <p className="ship-secure-note">
        <i className="fas fa-shield-halved"></i>
        Your data is encrypted and secure
      </p>
    </div>
  );
};

export default ShippingPage;