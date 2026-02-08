import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../actions/orderActions';
import { formatTaka } from '../utils/currencyUtils';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  return loading ? (
    <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Order...</h2>
  ) : error ? (
    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
  ) : (
    <div style={invoiceContainer}>
      {/* Invoice Header */}
      <div style={invoiceHeader}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>INVOICE</h1>
          <p style={orderIdStyle}>Order ID: {order._id}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ margin: 0 }}>Tech Mart</h3>
          <p style={{ fontSize: '12px', color: '#666' }}>Dhaka, Bangladesh</p>
        </div>
      </div>

      <hr style={divider} />

      {/* Customer Details */}
      <div style={detailsGrid}>
        <div>
          <p style={labelStyle}>Billed To:</p>
          <h4 style={{ margin: '5px 0' }}>{order.user.name}</h4>
          <p style={infoText}>{order.user.email}</p>
        </div>
        <div>
          <p style={labelStyle}>Shipping Address:</p>
          <p style={infoText}>
            {order.shippingAddress.address}, <br />
            {order.shippingAddress.city} - {order.shippingAddress.postalCode}
          </p>
        </div>
      </div>

      {/* Order Items Table */}
      <div style={tableWrapper}>
        <table style={invoiceTable}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={item.image} alt={item.name} style={itemImageStyle} />
                    <Link to={`/product/${item.product}`} style={itemNameStyle}>
                      {item.name}
                    </Link>
                  </div>
                </td>
                <td style={tdStyle}>{item.qty}</td>
                <td style={tdStyle}>{formatTaka(item.price)}</td>
                <td style={tdStyle}>{formatTaka(item.qty * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div style={summaryContainer}>
        <div style={summaryRow}>
          <span>Items Total:</span>
          <span>{formatTaka(order.itemsPrice || order.totalPrice - (order.shippingPrice || 0))}</span>
        </div>
        <div style={summaryRow}>
          <span>Shipping:</span>
          <span>{formatTaka(order.shippingPrice || 0)}</span>
        </div>
        <hr style={{ border: '0.5px solid #eee' }} />
        <div style={totalHighlightRow}>
          <span>Grand Total:</span>
          <span style={grandTotalAmount}>{formatTaka(order.totalPrice)}</span>
        </div>
      </div>
      
      <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '30px' }}>
        Thank you for shopping with Tech Mart!
      </p>
    </div>
  );
};

// --- Styles ---
const invoiceContainer = {
  fontFamily: 'hubot sans',
  maxWidth: '800px',
  margin: '40px auto',
  padding: '40px',
  backgroundColor: '#fff',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  borderRadius: '8px',

};

const invoiceHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };

const orderIdStyle = { fontSize: '11px', color: '#999', marginTop: '5px', letterSpacing: '1px' };

const divider = { border: '0', borderTop: '2px solid #333', margin: '20px 0' };

const detailsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' };

const labelStyle = { fontSize: '12px', textTransform: 'uppercase', color: '#999', margin: 0 };

const infoText = { fontSize: '14px', margin: '5px 0', color: '#444' };

const tableWrapper = { marginTop: '20px' };

const invoiceTable = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };

const thStyle = { padding: '12px', borderBottom: '2px solid #eee', color: '#666', fontSize: '14px' };

const tdStyle = { padding: '15px 12px', fontSize: '14px' };

const itemImageStyle = { width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee' };

const itemNameStyle = { textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '14px' };

const summaryContainer = { marginLeft: 'auto', width: '300px', marginTop: '30px' };

const summaryRow = { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px', color: '#666' };

const totalHighlightRow = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  marginTop: '10px',
  backgroundColor: '#f8f9ff',
  padding: '10px',
  borderRadius: '5px'
};

const grandTotalAmount = { fontSize: '20px', fontWeight: 'bold', color: '#00bb19ff' };

export default OrderPage;