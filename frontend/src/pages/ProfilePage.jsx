import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { formatTaka } from '../utils/currencyUtils';
import { logout } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false); // NEW: Local success state
  const [shake, setShake] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileCardRef = useRef(null);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, error: updateError, loading: updateLoading } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  // 1. DATA FETCHING & LOOP PREVENTION
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (success) {
        // Trigger local success message before resetting Redux
        setShowSuccessMsg(true);
        
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        
        setIsEditing(false);
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');

        // Hide the success message after 4 seconds
        setTimeout(() => setShowSuccessMsg(false), 4000);
      } else if (!user || !user.name) {
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        if (!isEditing) {
          setName(user.name);
          setEmail(user.email);
        }
      }
    }
  }, [dispatch, navigate, userInfo, user, success, isEditing]);

  // 2. AUTO-HIDE ERROR MESSAGES
  useEffect(() => {
    if (message || updateError) {
      const timer = setTimeout(() => {
        setMessage(null);
        if (updateError) dispatch({ type: USER_UPDATE_PROFILE_RESET });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, updateError, dispatch]);

  // 3. CLICK OUTSIDE TO CANCEL
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditing && profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setIsEditing(false);
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        setMessage(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  const hasChanges = (name !== user?.name || password !== '') && isEditing;

  const triggerError = (msg) => {
    setMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    setShowSuccessMsg(false); // Clear old success message on new attempt

    if (password !== confirmPassword) {
      triggerError('Passwords do not match');
    } else if (password !== '' && !oldPassword) {
      triggerError('Current password is required to set a new one');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, oldPassword, password }));
    }
  };

  useEffect(() => {
    if (updateError) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [updateError]);
  
  // return function follows...
  return (
    <div style={containerStyle}>
      {/* PROFILE CARD */}
      <div 
        ref={profileCardRef} 
        style={{
          ...cardStyle,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: isEditing ? '1200px' : '550px', 
          overflow: 'hidden'
        }}
      >
        <h2 style={titleStyle}>User Profile</h2>
        
        {/* MESSAGE AREA WITH SHAKE */}
        <div style={{ minHeight: '60px' }}>
          {(message || updateError) && (
            <div style={{ ...alertError, ...(shake ? shakeAnimation : {}) }}>
              <i className="fa-solid fa-triangle-exclamation" style={{marginRight: '8px'}}></i>
              {message || updateError}
            </div>
          )}
       {showSuccessMsg && (
  <div style={alertSuccess}>
    <i className="fa-solid fa-circle-check" style={{marginRight: '8px'}}></i>
    Profile Updated Successfully!
  </div>
)}
        </div>

        {loading ? (
          <p>Loading Profile...</p>
        ) : (
          <form onSubmit={submitHandler}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" 
                value={name} 
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)} 
                style={{...inputStyle, backgroundColor: isEditing ? '#fff' : '#f9f9f9'}} 
              />
            </div>

            <div style={inputGroupStyle} onClick={() => isEditing && triggerError('Email cannot be edited for security.')}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={email} disabled style={{...inputStyle, backgroundColor: '#f9f9f9', cursor: 'not-allowed'}} />
            </div>

            {/* EXPANDABLE PASSWORD SECTION */}
            <div style={{
              opacity: isEditing ? 1 : 0,
              transform: isEditing ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.4s ease-out',
              maxHeight: isEditing ? '600px' : '0',
              visibility: isEditing ? 'visible' : 'hidden'
            }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showOldPwd ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={inputStyle} />
                  <i className={`fa-solid ${showOldPwd ? 'fa-eye-slash' : 'fa-eye'}`} style={eyeIconStyle} onClick={() => setShowOldPwd(!showOldPwd)}></i>
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showNewPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                  <i className={`fa-solid ${showNewPwd ? 'fa-eye-slash' : 'fa-eye'}`} style={eyeIconStyle} onClick={() => setShowNewPwd(!showNewPwd)}></i>
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showNewPwd ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
                  <i className={`fa-solid ${showNewPwd ? 'fa-eye-slash' : 'fa-eye'}`} style={eyeIconStyle} onClick={() => setShowNewPwd(!showNewPwd)}></i>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
              {!isEditing ? (
                <button  className='Edit-btn' type="button" onClick={() => setIsEditing(true)} style={editBtnStyle}>Edit Profile</button>
              ) : (
                <button className='Edit-btn' type="submit" disabled={!hasChanges || updateLoading} style={{...updateBtnStyle, opacity: hasChanges ? 1 : 0.5}}>
                  {updateLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Update Profile'}
                </button>
              )}
              <button className='delete-btn' type="button" onClick={() => setShowLogoutModal(true)} style={profileLogoutBtn}>Logout</button>
            </div>
          </form>
        )}
      </div>

      {/* ORDER HISTORY */}
      <div style={{ ...cardStyle, flex: 2 }}>
        <h2 style={titleStyle}>Order History</h2>
        {loadingOrders ? <p>Loading Orders...</p> : errorOrders ? <p style={errorText}>{errorOrders}</p> : (
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
                {orders?.map((order, index) => (
                  <tr key={order._id} style={{...tableRowStyle, ...fadeInRow, animationDelay: `${index * 0.1}s`}}>
                    <td style={tableCellStyle}>{order._id.substring(0, 10)}...</td>
                    <td style={tableCellStyle}>{order.createdAt.substring(0, 10)}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>{formatTaka(order.totalPrice)}</td>
                    <td style={tableCellStyle}>{order.isPaid ? <span style={badgeSuccess}>Paid</span> : <span style={badgeDanger}>Pending</span>}</td>
                    <td style={tableCellStyle}>{order.isDelivered ? <span style={badgeSuccess}>Yes</span> : <span style={badgeDanger}>No</span>}</td>
                    <td style={tableCellStyle}>
                      <button style={detailsBtnStyle} onClick={() => navigate(`/order/${order._id}`)}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{fontSize: '40px'}}>⚠️</div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setShowLogoutModal(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={() => { dispatch(logout()); navigate('/login'); }} style={confirmLogoutBtnStyle}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
      
      {/* INLINE CSS FOR KEYFRAMES */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

// --- STYLES (Kept from your original) ---
const containerStyle = { display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem', backgroundColor: '#f4f7f6', minHeight: '85vh' };
const cardStyle = { flex: 1, backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', height: 'fit-content' };
const titleStyle = { fontFamily: "Hubot Sans", fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.4rem', color: '#333', borderLeft: '4px solid #0d76ff', paddingLeft: '10px' };
const inputGroupStyle = { marginBottom: '1.2rem' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' };
const inputStyle = { fontFamily: "Hubot Sans", width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };
const editBtnStyle = { flex: 1, fontFamily: "Hubot Sans", backgroundColor: '#030818ff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const updateBtnStyle = { flex: 1, fontFamily: "Hubot Sans", backgroundColor: '#080024ff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' };
const profileLogoutBtn = { flex: 1, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: "Hubot Sans",                  };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const tableHeaderRow = { borderBottom: '2px solid #f1f1f1' };
const tableHeadStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' };
const tableRowStyle = { borderBottom: '1px solid #fafafa' };
const tableCellStyle = { padding: '1rem', fontSize: '0.9rem', color: '#444' };
const badgeSuccess = { backgroundColor: '#e6fffa', color: '#2d3748', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid #b2f5ea' };
const badgeDanger = { backgroundColor: '#fff5f5', color: '#c53030', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid #feb2b2' };
const detailsBtnStyle = { fontFamily: "Hubot Sans", padding: '6px 15px', cursor: 'pointer', backgroundColor: '#7476b99f', color: '#0e0b0bff', border: 'dotted #000000ff 1px', borderRadius: '4px', fontSize: '0.8rem' };
const alertError = { backgroundColor: '#fff5f5', color: '#c53030', padding: '10px', borderRadius: '6px', border: '1px solid #feb2b2', fontSize: '0.85rem', marginBottom: '1rem' };
const alertSuccess = { backgroundColor: '#f0fff4', color: '#2f855a', padding: '10px', borderRadius: '6px', border: '1px solid #c6f6d5', fontSize: '0.85rem', marginBottom: '1rem' };
const errorText = { color: '#e53e3e', fontSize: '0.85rem', marginBottom: '1rem' };
const eyeIconStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' };
const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#f1f1f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#333' };
const confirmLogoutBtnStyle = { padding: '10px 20px', backgroundColor: '#dc3545', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#fff' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };

const fadeInRow = { animation: 'fadeIn 0.6s ease-out forwards' };
const shakeAnimation = { animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both', transform: 'translate3d(0, 0, 0)' };

export default ProfilePage;