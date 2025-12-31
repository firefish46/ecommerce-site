import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // If no shipping address, redirect back to shipping
  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: 'CART_SAVE_PAYMENT_METHOD',
      payload: paymentMethod 
    });
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div style={containerStyle}>
      {/* Checkout Progress Bar */}
      <div style={progressContainer}>
        <div style={stepActive}>Shipping</div>
        <div style={lineActive}></div>
        <div style={stepActiveBold}>Payment</div>
        <div style={lineInactive}></div>
        <div style={stepInactive}>Review</div>
      </div>

      <div style={formCardStyle}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={titleStyle}>Payment Method</h1>
          <p style={subtitleStyle}>Select how you'd like to pay for your order.</p>
        </header>

        <form onSubmit={submitHandler}>
          <div style={optionsGrid}>
            
            {/* Cash on Delivery Option */}
            <div 
              style={paymentMethod === 'CashOnDelivery' ? activeOption : inactiveOption}
              onClick={() => setPaymentMethod('CashOnDelivery')}
            >
              <div style={radioCircle}>
                {paymentMethod === 'CashOnDelivery' && <div style={radioInner} />}
              </div>
              <div style={optionTextWrapper}>
                <span style={optionTitle}>Cash On Delivery</span>
                <span style={optionSub}>Pay when your package arrives</span>
              </div>
              <i className="fas fa-money-bill-wave" style={iconStyle}></i>
            </div>

            {/* Placeholder for future: Stripe/Card 
            <div 
              style={paymentMethod === 'Stripe' ? activeOption : inactiveOption}
              onClick={() => setPaymentMethod('Stripe')}
            >
              <div style={radioCircle}>
                {paymentMethod === 'Stripe' && <div style={radioInner} />}
              </div>
              <div style={optionTextWrapper}>
                <span style={optionTitle} >Credit / Debit Card</span>
                <span style={optionSub}>Secure payment via Stripe</span>
              </div>
              <i className="fas fa-credit-card" style={iconStyle}></i>
            </div>
            */}

          </div>

          <button type='submit' style={buttonStyle}>
            Continue to Review <i className="fas fa-chevron-right" style={{marginLeft: '10px', fontSize: '12px'}}></i>
          </button>
        </form>
      </div>

      <div style={footerNote}>
        <i className="fas fa-shield-check"></i> 100% Encrypted & Secure Checkout
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

const progressContainer = { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', gap: '10px' };
const stepActive = { fontSize: '11px', fontWeight: '500', color: '#888', textTransform: 'uppercase' };
const stepActiveBold = { fontSize: '11px', fontWeight: '900', color: '#000', textTransform: 'uppercase' };
const stepInactive = { fontSize: '11px', fontWeight: '500', color: '#ccc', textTransform: 'uppercase' };
const lineActive = { height: '2px', width: '30px', backgroundColor: '#000' };
const lineInactive = { height: '2px', width: '30px', backgroundColor: '#eee' };

const formCardStyle = { 
  backgroundColor: '#fff', 
  padding: '40px', 
  borderRadius: '24px', 
  boxShadow: '0 10px 40px rgba(0,0,0,0.04)', 
  border: '1px solid #f0f0f0' 
};

const titleStyle = { fontSize: '28px', fontWeight: '900', margin: '0 0 8px 0' };
const subtitleStyle = { fontSize: '14px', color: '#888', margin: 0 };

const optionsGrid = { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' };

const optionBase = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '2px solid transparent',
  position: 'relative'
};

const activeOption = {
  ...optionBase,
  border: '2px solid #000',
  backgroundColor: '#f9f9f9'
};

const inactiveOption = {
  ...optionBase,
  border: '2px solid #eee',
  backgroundColor: '#fff'
};

const radioCircle = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '2px solid #000',
  marginRight: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const radioInner = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: '#000'
};

const optionTextWrapper = { display: 'flex', flexDirection: 'column', flex: 1 };
const optionTitle = { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' };
const optionSub = { fontSize: '12px', color: '#888', marginTop: '2px' };

const iconStyle = { fontSize: '20px', color: '#333', marginLeft: '10px' };

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
  fontWeight: '700' 
};

const footerNote = { textAlign: 'center', marginTop: '25px', fontSize: '12px', color: '#aaa' };

export default PaymentPage;