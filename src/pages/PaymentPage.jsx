import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();

  // If no shipping address, redirect back to shipping
  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

const submitHandler = (e) => {
  e.preventDefault();
  // Ensure 'paymentMethod' (the state) is being sent
  dispatch({
    type: 'CART_SAVE_PAYMENT_METHOD',
    payload: paymentMethod 
  });
  
  // Save to localStorage so it doesn't disappear on refresh
  localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
  
  navigate('/placeorder');
};

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Method</label>
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type='radio'
              id='CashOnDelivery'
              name='paymentMethod'
              value='CashOnDelivery'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor='CashOnDelivery' style={{ marginLeft: '0.5rem' }}>Cash On Delivery</label>
          </div>
          {/* You can add Stripe here later */}
        </div>

        <button type='submit' style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;