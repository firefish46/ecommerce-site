import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatTaka } from '../utils/currencyUtils';  

const CheckoutPage = () => {
  // 1. Pull everything from Redux State
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  // 2. Calculate Totals
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: Free shipping over $100
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Order Summary</h1>
      <div style={{ display: 'flex', gap: '40px' }}>
        
        {/* Left Side: Details */}
        <div style={{ flex: 2 }}>
          <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #eee' }}>
            <h2>Shipping</h2>
            <p>
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #eee' }}>
            <h2>Order Items</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{item.qty} x {item.name}</span>
                  <span>{formatTaka(item.qty * item.price)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Total Box */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', height: 'fit-content' }}>
          <h2>Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Items:</span>
            <span>tk {formatTaka(itemsPrice)}/-</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Shipping:</span>
            <span>tk {formatTaka(shippingPrice)}/-</span>
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em' }}>
            <span>Total:</span>
            <span>tk {formatTaka(totalPrice)}/-</span>
          </div>
          <button 
            style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
            onClick={() => alert('Order Placed Successfully!')}
          >
            Place Order
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;