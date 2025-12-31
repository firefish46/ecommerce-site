import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; 
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { formatTaka } from '../utils/currencyUtils';

const PlaceOrderPage = () => {
  const [isShipping, setIsShipping] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  // Price Calculation Logic
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  cart.shippingPrice = addDecimals(cart.itemsPrice > 1000 ? 0 : 100);
  cart.taxPrice = addDecimals(Number((0.05 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
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
    setIsShipping(true); 
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
    <div style={containerStyle}>
      <div style={progressContainer}>
        <div style={stepActive}>Shipping</div>
        <div style={lineActive}></div>
        <div style={stepActive}>Payment</div>
        <div style={lineActive}></div>
        <div style={stepActiveBold}>Review & Place Order</div>
      </div>

      <div style={contentGrid}>
        <div style={leftColumn}>
          <div style={sectionCard}>
            <h3 style={sectionTitle}><i className="fas fa-truck"></i> Shipping Address</h3>
            <p style={detailText}>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div style={sectionCard}>
            <h3 style={sectionTitle}><i className="fas fa-credit-card"></i> Payment Method</h3>
            <p style={detailText}>{cart.paymentMethod}</p>
          </div>

          <div style={sectionCard}>
            <h3 style={sectionTitle}><i className="fas fa-box-open"></i> Your Items</h3>
            {cart.cartItems.map((item, index) => (
              <div key={index} style={itemRow}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img src={item.image} alt="" style={itemImage} />
                    <span style={itemName}>{item.name}</span>
                </div>
                <span style={itemPriceDetail}>{item.qty} x {formatTaka(item.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={rightColumn}>
          <div style={summaryStickyCard}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>Summary</h2>
            <div style={summaryRow}><span>Subtotal</span><span>{formatTaka(cart.itemsPrice)}</span></div>
            <div style={summaryRow}><span>Shipping</span><span>{formatTaka(cart.shippingPrice)}</span></div>
            
            <div style={totalDivider}></div>
            <div style={totalRow}>
              <span>Total</span>
              <span>{formatTaka(cart.totalPrice)}</span>
            </div>

            {error && <div style={errorBanner}>{error}</div>}

            <button 
              onClick={placeOrderHandler} 
              disabled={cart.cartItems.length === 0 || isShipping}
              style={placeOrderBtn}
            >
              <AnimatePresence mode="wait">
                {!isShipping ? (
                  <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                    CONFIRM ORDER
                  </motion.span>
                ) : (
                  <motion.div key="anim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={animFlex}>
                    <motion.i 
                      className="fas fa-box"
                      initial={{ x: -60, opacity: 0 }}
                      animate={{ x: 30, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      style={{ color: '#f1c40f' }}
                    ></motion.i>
                    <motion.i 
                      className="fas fa-truck"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                      style={{ fontSize: '22px' }}
                    ></motion.i>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <p style={secureNote}><i className="fas fa-lock"></i> Secure Checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES DEFINITIONS ---
const containerStyle = { fontFamily: "'Hubot Sans', sans-serif", maxWidth: '1200px', margin: '40px auto', padding: '0 20px' };
const progressContainer = { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', gap: '10px' };
const stepActive = { fontSize: '11px', fontWeight: '500', color: '#888', textTransform: 'uppercase' };
const stepActiveBold = { fontSize: '11px', fontWeight: '900', color: '#000', textTransform: 'uppercase' };
const lineActive = { height: '2px', width: '30px', backgroundColor: '#000' };

const contentGrid = { display: 'flex', gap: '30px', flexWrap: 'wrap' };
const leftColumn = { flex: '1 1 700px' };
const rightColumn = { flex: '1 1 350px' };

const sectionCard = { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #f0f0f0', marginBottom: '20px' };
const sectionTitle = { fontSize: '16px', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' };
const detailText = { fontSize: '14px', color: '#555', margin: 0 };

const itemRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f9f9f9' };
const itemImage = { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' };
const itemName = { fontSize: '14px', fontWeight: '600' };
const itemPriceDetail = { fontSize: '13px', color: '#666' };

const summaryStickyCard = { backgroundColor: '#fff', padding: '30px', borderRadius: '24px', border: '2px solid #000', position: 'sticky', top: '20px' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' };
const totalDivider = { height: '1px', backgroundColor: '#eee', margin: '20px 0' };
const totalRow = { display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '900', marginBottom: '25px' };

const placeOrderBtn = { 
  width: '100%', height: '60px', backgroundColor: '#000', color: '#fff', border: 'none', 
  borderRadius: '14px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', overflow: 'hidden' 
};

const animFlex = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' };
const secureNote = { textAlign: 'center', color: '#aaa', fontSize: '11px', marginTop: '15px' };
const errorBanner = { backgroundColor: '#fff1f0', color: '#f5222d', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffa39e' };

export default PlaceOrderPage;