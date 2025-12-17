// src/pages/CheckoutPage.jsx

import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartState } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartState.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartState.cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (cartState.cartItems.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Checkout</h1>
        <p>Your cart is empty. Please add items before checking out.</p>
      </div>
    );
  }

  const placeOrderHandler = () => {
    // 1. **Authentication Check:** (Assumed user is logged in to reach here)
    // 2. **Collect Data:** Gather shipping/payment info (not built yet)
    // 3. **API Call:** Send the order details (cartState.cartItems) to the backend API: POST /api/orders
    
    alert(`Order Placed Successfully! Total: $${totalPrice.toFixed(2)}`);
    // In a real app, after the API call, you would clear the cart and navigate to OrderConfirmationPage.
    navigate('/'); 
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>Final Step: Place Order</h1>
      
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
        <h3>Order Summary</h3>
        <p>Items: **{totalItems}**</p>
        <p>Shipping: **$5.00** (Placeholder)</p>
        <p>Tax: **${(totalPrice * 0.1).toFixed(2)}** (Placeholder)</p>
        <hr />
        <h3>Grand Total: **${(totalPrice * 1.1 + 5).toFixed(2)}**</h3>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {/* Placeholder for Shipping Address and Payment Method forms */}
        <h3>Shipping and Payment (Forms to be built here)</h3>
        <p>Forms for address and card details will go here...</p>
      </div>

      <button
        onClick={placeOrderHandler}
        style={{ width: '100%', padding: '15px', backgroundColor: 'red', color: 'white', fontSize: '1.2em', border: 'none', cursor: 'pointer' }}
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;