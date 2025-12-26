import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { formatTaka } from '../utils/currencyUtils';

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  // Calculate Prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [navigate, success]);

const placeOrderHandler = () => {
    console.log('--- Place Order Initiated ---');
    console.log('Cart Items:', cart.cartItems);
    console.log('Shipping Address:', cart.shippingAddress);
    console.log('Payment Method:', cart.paymentMethod);

    if (!cart.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Order Summary</h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 2 }}>
          <p><strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city} </p>
          <p><strong>Payment Method:</strong> {cart.paymentMethod}</p>
          <hr />
          {cart.cartItems.length === 0 ? <p>Your cart is empty</p> : (
             cart.cartItems.map((item, index) => (
               <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                 <span>{item.name}</span>
                 <span>{item.qty} x ${item.price} = ${item.qty * item.price}</span>
               </div>
             ))
          )}
        </div>
        <div style={{ flex: 1, border: '1px solid #eee', padding: '1rem' }}>
          <h3>Order Total</h3>
          <p>Items: {formatTaka(cart.itemsPrice)}</p>
          <p>Shipping: {formatTaka(cart.shippingPrice)}</p>
          <p>Tax: {formatTaka(cart.taxPrice)}</p>
          <p><strong>Total: {formatTaka(cart.totalPrice)}</strong></p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button 
            onClick={placeOrderHandler} 
            disabled={cart.cartItems === 0}
            style={{ width: '100%', padding: '10px', background: 'black', color: 'white' }}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;