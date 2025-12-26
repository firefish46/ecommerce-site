import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../actions/orderActions';
import { formatTaka } from '../../utils/currencyUtils';

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <div style={pageContainer}>
      <div style={headerSection}>
        <h1 style={titleStyle}>Admin Dashboard: Orders</h1>
        <p style={subtitleStyle}>Manage and track all customer purchases</p>
      </div>

      {loading ? (
        <div style={loadingText}>Loading Orders...</div>
      ) : error ? (
        <p style={errorText}>{error}</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRow}>
                <th style={thStyle}>ORDER ID</th>
                <th style={thStyle}>CUSTOMER</th>
                <th style={thStyle}>DATE</th>
                <th style={thStyle}>TOTAL</th>
                <th style={thStyle}>PAID STATUS</th>
                <th style={thStyle}>DELIVERY</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr 
                  key={order._id} 
                  style={{ 
                    ...tableRowStyle, 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' 
                  }}
                >
                  <td style={{ ...tdStyle, color: '#888', fontSize: '12px' }}>
                    {order._id.substring(0, 12)}...
                  </td>
                  <td style={{ ...tdStyle, fontWeight: '600' }}>
                    {order.user && order.user.name ? order.user.name : 'Deleted User'}
                  </td>
                  <td style={tdStyle}>{order.createdAt.substring(0, 10)}</td>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#eb2020ff' }}>
                    {formatTaka(order.totalPrice)}
                  </td>
                  <td style={tdStyle}>
                    {order.isPaid ? (
                      <span style={badgeSuccess}>Paid ({order.paidAt.substring(0, 10)})</span>
                    ) : (
                      <span style={badgeDanger}>Pending</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {order.isDelivered ? (
                      <span style={badgeSuccess}>Delivered</span>
                    ) : (
                      <span style={badgeWarning}>In Transit</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <button 
                    className='viewDetails'
                      style={detailsBtnStyle}
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Dashboard UI Styles ---
const pageContainer = {
  padding: '2rem',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh'
};

const headerSection = {
  marginBottom: '2rem',
  borderBottom: '1px solid #dee2e6',
  paddingBottom: '1rem'
};

const titleStyle = { margin: 0, fontSize: '1.8rem', color: '#212529' };
const subtitleStyle = { margin: '5px 0 0', color: '#6c757d', fontSize: '0.9rem' };

const tableWrapper = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  overflow: 'hidden'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const tableHeaderRow = {
  backgroundColor: '#343a40',
  color: '#fff'
};

const thStyle = {
  padding: '1rem',
  fontSize: '0.75rem',
  letterSpacing: '0.05rem',
  fontWeight: 'bold'
};

const tableRowStyle = {
  borderBottom: '1px solid #eee',
  transition: 'background 0.2s'
};

const tdStyle = {
  padding: '1rem',
  fontSize: '0.9rem',
  verticalAlign: 'middle'
};

// Badges
const badgeBase = {
  padding: '5px 10px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 'bold'
};

const badgeSuccess = { ...badgeBase, backgroundColor: '#d4edda', color: '#155724' };
const badgeDanger = { ...badgeBase, backgroundColor: '#f8d7da', color: '#721c24' };
const badgeWarning = { ...badgeBase, backgroundColor: '#fff3cd', color: '#856404' };

const detailsBtnStyle = {
  fontfamily: "Hubot Sans",
  backgroundColor: '#7a688bff',
  border: '1px solid #01132bff',
  color: '#ffffffff',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.8rem', 
  fontWeight: 'italic ',
  transition: 'all 0.3s'
};

const loadingText = { textAlign: 'center', padding: '3rem', color: '#666' };
const errorText = { color: '#dc3545', textAlign: 'center', padding: '1rem' };

export default OrderListPage;