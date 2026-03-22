// frontend/src/pages/PlaceOrderPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { formatTaka } from '../utils/currencyUtils';
import '../styles/PlaceOrderPage.css';

const PlaceOrderPage = () => {
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  // ✅ Fixed: local variables, no Redux mutation, Number() wrapping
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)
  );
  const shippingPrice = addDecimals(Number(itemsPrice) > 1000 ? 0 : 100);
  const taxPrice = addDecimals(Number((0.05 * Number(itemsPrice)).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      setOrderSuccess(true);
      setTimeout(() => {
        navigate(`/order/${order._id}`);
        dispatch({ type: ORDER_CREATE_RESET });
      }, 2000);
    }
  }, [navigate, success, dispatch, order]);

  const placeOrderHandler = () => {
    if (!cart.paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setIsPlacing(true);
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="po-container">

      {/* Progress Steps */}
      <div className="po-progress">
        <div className="po-step po-step--done">
          <div className="po-step__dot"></div>
          <span>Shipping</span>
        </div>
        <div className="po-step__line po-step__line--done"></div>
        <div className="po-step po-step--done">
          <div className="po-step__dot"></div>
          <span>Payment</span>
        </div>
        <div className="po-step__line po-step__line--done"></div>
        <div className="po-step po-step--active">
          <div className="po-step__dot"></div>
          <span>Review & Place Order</span>
        </div>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            className="po-success-banner"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <i className="fas fa-check-circle"></i> Order placed! Redirecting...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="po-grid">

        {/* LEFT COLUMN */}
        <div className="po-left">

          {/* Shipping */}
          <motion.div
            className="po-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="po-card__header">
              <div className="po-card__icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Shipping Address</h3>
            </div>
            <p className="po-card__text">
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </motion.div>

          {/* Payment */}
          <motion.div
            className="po-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="po-card__header">
              <div className="po-card__icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3>Payment Method</h3>
            </div>
            <div className="po-payment-badge">
              <i className="fas fa-circle-check"></i>
              {cart.paymentMethod}
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            className="po-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="po-card__header">
              <div className="po-card__icon">
                <i className="fas fa-box-open"></i>
              </div>
              <h3>Your Items ({cart.cartItems.length})</h3>
            </div>

            {cart.cartItems.length === 0 ? (
              <p className="po-empty">Your cart is empty.</p>
            ) : (
              <div className="po-items-list">
                {cart.cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="po-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="po-item__left">
                      <img src={item.image} alt={item.name} className="po-item__img" />
                      <div className="po-item__info">
                        <span className="po-item__name">{item.name}</span>
                        <span className="po-item__qty">Qty: {item.qty}</span>
                      </div>
                    </div>
                    <span className="po-item__price">
                      {formatTaka(Number(item.price) * Number(item.qty))}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN — Summary */}
        <div className="po-right">
          <motion.div
            className="po-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="po-summary__title">Order Summary</h2>

            <div className="po-summary__rows">
              <div className="po-summary__row">
                <span>Subtotal</span>
                <span>{formatTaka(itemsPrice)}</span>
              </div>
              <div className="po-summary__row">
                <span>Shipping</span>
                <span>
                  {Number(shippingPrice) === 0
                    ? <span className="po-free">FREE</span>
                    : formatTaka(shippingPrice)
                  }
                </span>
              </div>
              <div className="po-summary__row">
                <span>Tax (5%)</span>
                <span>{formatTaka(taxPrice)}</span>
              </div>
            </div>

            <div className="po-summary__divider"></div>

            <div className="po-summary__total">
              <span>Total</span>
              <span>{formatTaka(totalPrice)}</span>
            </div>

            {Number(shippingPrice) === 0 && (
              <div className="po-free-shipping-note">
                <i className="fas fa-truck"></i> You qualify for free shipping!
              </div>
            )}

            {error && (
              <div className="po-error">
                <i className="fas fa-circle-exclamation"></i> {error}
              </div>
            )}

            <button
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0 || isPlacing}
              className={`po-btn ${isPlacing ? 'po-btn--loading' : ''}`}
            >
              <AnimatePresence mode="wait">
                {!isPlacing ? (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                  >
                    <i className="fas fa-lock"></i> CONFIRM ORDER
                  </motion.span>
                ) : (
                  <motion.div
                    key="anim"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="po-btn__anim"
                  >
                    <motion.i
                      className="fas fa-box"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 40, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      style={{ color: '#f1c40f' }}
                    />
                    <motion.i
                      className="fas fa-truck"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                      style={{ fontSize: '22px' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <p className="po-secure">
              <i className="fas fa-shield-halved"></i> 100% Secure Checkout
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;