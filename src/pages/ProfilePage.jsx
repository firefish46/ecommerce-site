import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';

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
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
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
    }
  };

  return (
    <div style={{ display: 'flex', gap: '3rem', padding: '2rem' }}>
      {/* Left Column: User Profile */}
      <div style={{ flex: 1 }}>
        <h2>User Profile</h2>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Profile Updated!</p>}
        
        <form onSubmit={submitHandler}>
          <div style={inputGroupStyle}>
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={inputGroupStyle}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={inputGroupStyle}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>
          <div style={inputGroupStyle}>
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" style={btnStyle}>Update</button>
        </form>
      </div>

      {/* Right Column: Order History */}
      <div style={{ flex: 2 }}>
        <h2>My Orders</h2>
        {loadingOrders ? <p>Loading Orders...</p> : errorOrders ? <p style={{ color: 'red' }}>{errorOrders}</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={tableHeadStyle}>ID</th>
                <th style={tableHeadStyle}>DATE</th>
                <th style={tableHeadStyle}>TOTAL</th>
                <th style={tableHeadStyle}>PAID</th>
                <th style={tableHeadStyle}>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tableCellStyle}>{order._id.substring(0, 10)}...</td>
                  <td style={tableCellStyle}>{order.createdAt.substring(0, 10)}</td>
                  <td style={tableCellStyle}>${order.totalPrice}</td>
                  <td style={tableCellStyle}>
                    {order.isPaid ? order.paidAt.substring(0, 10) : <span style={{ color: 'red' }}>No</span>}
                  </td>
                  <td style={tableCellStyle}>
                    {order.isDelivered ? order.deliveredAt.substring(0, 10) : <span style={{ color: 'red' }}>No</span>}
                  </td>
                  <td style={tableCellStyle}>
                    <button onClick={() => navigate(`/order/${order._id}`)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const inputGroupStyle = { marginBottom: '1rem' };
const inputStyle = { width: '100%', padding: '0.5rem', marginTop: '0.25rem' };
const btnStyle = { background: 'black', color: 'white', padding: '0.6rem 1.2rem', border: 'none', cursor: 'pointer' };
const tableHeadStyle = { textAlign: 'left', padding: '0.5rem' };
const tableCellStyle = { padding: '0.5rem' };

export default ProfilePage;