import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { formatTaka } from '../utils/currencyUtils';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name || success) {
        // We reset success on update to prevent infinite loops if your constants/reducers allow
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        // FIXED THE TYPO HERE
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
      setMessage(null);
    }
  };

  return (
    <div style={containerStyle}>
      {/* LEFT COLUMN: User Profile Card */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>User Profile</h2>
        {message && <p style={errorText}>{message}</p>}
        {error && <p style={errorText}>{error}</p>}
        {success && <p style={successText}>Profile Updated Successfully!</p>}
        
        {loading ? (
          <p>Loading Profile...</p>
        ) : (
          <form onSubmit={submitHandler}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={inputStyle} 
                placeholder="Enter your name"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={inputStyle} 
                placeholder="Enter email"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>New Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={inputStyle} 
                placeholder="Leave blank to keep current"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                style={inputStyle} 
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" style={btnStyle}>Update Profile</button>
          </form>
        )}
      </div>

      {/* RIGHT COLUMN: Order History Card */}
      <div style={{ ...cardStyle, flex: 2 }}>
        <h2 style={titleStyle}>Order History</h2>
        {loadingOrders ? (
          <p>Loading Orders...</p>
        ) : errorOrders ? (
          <p style={errorText}>{errorOrders}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={tableHeadStyle}>ID</th>
                  <th style={tableHeadStyle}>DATE</th>
                  <th style={tableHeadStyle}>TOTAL</th>
                  <th style={tableHeadStyle}>PAID</th>
                  <th style={tableHeadStyle}>DELIVERED</th>
                  <th style={tableHeadStyle}></th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map((order) => (
                  <tr key={order._id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{order._id.substring(0, 10)}...</td>
                    <td style={tableCellStyle}>{order.createdAt.substring(0, 10)}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>{formatTaka(order.totalPrice)}</td>
                    <td style={tableCellStyle}>
                      {order.isPaid ? (
                        <span style={badgeSuccess}>{order.paidAt.substring(0, 10)}</span>
                      ) : (
                        <span style={badgeDanger}>Pending</span>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      {order.isDelivered ? (
                        <span style={badgeSuccess}>{order.deliveredAt.substring(0, 10)}</span>
                      ) : (
                        <span style={badgeDanger}>No</span>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      <button 
                        style={detailsBtnStyle} 
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { 
  display: 'flex', 
  flexWrap: 'wrap', 
  gap: '2rem', 
  padding: '2rem',
  backgroundColor: '#f4f7f6', // Light grayish-blue background
  minHeight: '85vh'
};

const cardStyle = { 
  flex: 1, 
  backgroundColor: '#fff', 
  padding: '2rem', 
  borderRadius: '12px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  height: 'fit-content'
};

const titleStyle = { 
  fontFamily: "Hubot Sans",
  fontWeight: 'bold',
  marginBottom: '1.5rem', 
  fontSize: '1.4rem', 
  color: '#333', 
  borderLeft: '4px solid #0d76ff', 
  paddingLeft: '10px' 
};

const inputGroupStyle = { marginBottom: '1.2rem' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' };

const inputStyle = { 
  width: '100%', 
  padding: '0.75rem', 
  borderRadius: '6px', 
  border: '1px solid #ddd', 
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const btnStyle = { 
  fontFamily: "Hubot Sans",
  width: '100%', 
  background: '#333', 
  color: 'white', 
  padding: '0.8rem', 
  border: 'none', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  transition: '0.3s'
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const tableHeaderRow = { borderBottom: '2px solid #f1f1f1' };
const tableHeadStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' };
const tableRowStyle = { borderBottom: '1px solid #fafafa' };
const tableCellStyle = { padding: '1rem', fontSize: '0.9rem', color: '#444' };

const badgeSuccess = { 
  backgroundColor: '#e6fffa', 
  color: '#2d3748', 
  padding: '4px 10px', 
  borderRadius: '20px', 
  fontSize: '0.75rem',
  border: '1px solid #b2f5ea'
};

const badgeDanger = { 
  backgroundColor: '#fff5f5', 
  color: '#c53030', 
  padding: '4px 10px', 
  borderRadius: '20px', 
  fontSize: '0.75rem',
  border: '1px solid #feb2b2'
};

const detailsBtnStyle = { 
  fontFamily: "Hubot Sans", 
  padding: '6px 15px', 
  cursor: 'pointer', 
  backgroundColor: '#7476b99f', 
  color: '#0e0b0bff', 
  border: 'dotted #000000ff 1px', 
  borderRadius: '4px', 
  fontSize: '0.8rem' 
};

const errorText = { color: '#e53e3e', fontSize: '0.85rem', marginBottom: '1rem' };
const successText = { color: '#38a169', fontSize: '0.85rem', marginBottom: '1rem' };

export default ProfilePage;