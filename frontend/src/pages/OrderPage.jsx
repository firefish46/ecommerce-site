import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../actions/orderActions';
import { formatTaka } from '../utils/currencyUtils';
import '../styles/OrderPage.css';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <h2 className="order-loading">Loading Order...</h2>;
  if (error)   return <p className="order-error">{error}</p>;

  return (
    <div className="invoice-container">

      {/* ── Header ── */}
      <div className="invoice-header">
        <div>
          <h1 className="invoice-title">INVOICE</h1>
          <p className="invoice-order-id">Order ID: {order._id}</p>
        </div>
        <div className="invoice-brand">
          <h3>Tech Mart</h3>
          <p>Dhaka, Bangladesh</p>
        </div>
      </div>

      <hr className="invoice-divider" />

      {/* ── Customer Details ── */}
      <div className="invoice-details-grid">
        <div>
          <p className="invoice-label">Billed To:</p>
          <h4>{order.user.name}</h4>
          <p className="invoice-info-text">{order.user.email}</p>
        </div>
        <div>
          <p className="invoice-label">Shipping Address:</p>
          <p className="invoice-info-text">
            {order.shippingAddress.address},<br />
            {order.shippingAddress.city} — {order.shippingAddress.postalCode}
          </p>
        </div>
      </div>

      {/* ── Order Items Table ── */}
      <div className="invoice-table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th className="invoice-th">Product</th>
              <th className="invoice-th">Qty</th>
              <th className="invoice-th">Price</th>
              <th className="invoice-th">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index} className="invoice-tr">
                <td className="invoice-td">
                  <div className="invoice-item-cell">
                    <img src={item.image} alt={item.name} className="invoice-item-img" />
                    <Link to={`/product/${item.product}`} className="invoice-item-name">
                      {item.name}
                    </Link>
                  </div>
                </td>
                <td className="invoice-td">{item.qty}</td>
                <td className="invoice-td">{formatTaka(item.price)}</td>
                <td className="invoice-td">{formatTaka(item.qty * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Summary ── */}
      <div className="invoice-summary">
        <div className="invoice-summary-row">
          <span>Items Total:</span>
          <span>{formatTaka(order.itemsPrice || order.totalPrice - (order.shippingPrice || 0))}</span>
        </div>
        <div className="invoice-summary-row">
          <span>Shipping:</span>
          <span>{formatTaka(order.shippingPrice || 0)}</span>
        </div>
        <hr className="invoice-summary-divider" />
        <div className="invoice-total-row">
          <span>Grand Total:</span>
          <span className="invoice-grand-total">{formatTaka(order.totalPrice)}</span>
        </div>
      </div>

      <p className="invoice-footer">Thank you for shopping with Tech Mart!</p>

    </div>
  );
};

export default OrderPage;