import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile, logout } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { formatTaka } from '../utils/currencyUtils';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
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
        setShowSuccessMsg(true);
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        setIsEditing(false);
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
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

  // 4. SHAKE ON UPDATE ERROR
  useEffect(() => {
    if (updateError) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [updateError]);

  const hasChanges = (name !== user?.name || password !== '') && isEditing;

  const triggerError = (msg) => {
    setMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    setShowSuccessMsg(false);
    if (password !== confirmPassword) {
      triggerError('Passwords do not match');
    } else if (password !== '' && !oldPassword) {
      triggerError('Current password is required to set a new one');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, oldPassword, password }));
    }
  };

  return (
    <div className="profile-container">

      {/* ── Profile Card ── */}
      <div
        ref={profileCardRef}
        className="profile-card"
        style={{ maxHeight: isEditing ? '1200px' : '550px' }}
      >
        <h2 className="profile-title">User Profile</h2>

        {/* Messages */}
        <div className="profile-message-area">
          {(message || updateError) && (
            <div className={`profile-alert profile-alert--error${shake ? ' shake' : ''}`}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              {message || updateError}
            </div>
          )}
          {showSuccessMsg && (
            <div className="profile-alert profile-alert--success">
              <i className="fa-solid fa-circle-check"></i>
              Profile Updated Successfully!
            </div>
          )}
        </div>

        {loading ? (
          <p>Loading Profile...</p>
        ) : (
          <form onSubmit={submitHandler}>

            {/* Name */}
            <div className="profile-input-group">
              <label className="profile-label">Full Name</label>
              <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className={`profile-input ${isEditing ? 'profile-input--active' : 'profile-input--disabled'}`}
              />
            </div>

            {/* Email */}
            <div
              className="profile-input-group"
              onClick={() => isEditing && triggerError('Email cannot be edited for security.')}
            >
              <label className="profile-label">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="profile-input profile-input--disabled"
              />
            </div>

            {/* Expandable Password Section */}
            <div className={`profile-pwd-section ${isEditing ? 'profile-pwd-section--visible' : 'profile-pwd-section--hidden'}`}>

              <div className="profile-input-group">
                <label className="profile-label">Current Password</label>
                <div className="profile-pwd-wrapper">
                  <input
                    type={showOldPwd ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="profile-input"
                  />
                  <i
                    className={`fa-solid ${showOldPwd ? 'fa-eye-slash' : 'fa-eye'} profile-eye-icon`}
                    onClick={() => setShowOldPwd(!showOldPwd)}
                  />
                </div>
              </div>

              <div className="profile-input-group">
                <label className="profile-label">New Password</label>
                <div className="profile-pwd-wrapper">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="profile-input"
                  />
                  <i
                    className={`fa-solid ${showNewPwd ? 'fa-eye-slash' : 'fa-eye'} profile-eye-icon`}
                    onClick={() => setShowNewPwd(!showNewPwd)}
                  />
                </div>
              </div>

              <div className="profile-input-group">
                <label className="profile-label">Confirm New Password</label>
                <div className="profile-pwd-wrapper">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="profile-input"
                  />
                  <i
                    className={`fa-solid ${showNewPwd ? 'fa-eye-slash' : 'fa-eye'} profile-eye-icon`}
                    onClick={() => setShowNewPwd(!showNewPwd)}
                  />
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="profile-btn-row">
              {!isEditing ? (
                <button
                  className="profile-edit-btn Edit-btn"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  className="profile-update-btn Edit-btn"
                  type="submit"
                  disabled={!hasChanges || updateLoading}
                  style={{ opacity: hasChanges ? 1 : 0.5 }}
                >
                  {updateLoading
                    ? <i className="fa-solid fa-spinner fa-spin"></i>
                    : 'Update Profile'}
                </button>
              )}
              <button
                className="profile-logout-btn delete-btn"
                type="button"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </div>

          </form>
        )}
      </div>

      {/* ── Order History ── */}
      <div className="profile-card profile-card--orders">
        <h2 className="profile-title">Order History</h2>

        {loadingOrders ? (
          <p>Loading Orders...</p>
        ) : errorOrders ? (
          <p className="profile-error-text">{errorOrders}</p>
        ) : (
          <div className="profile-orders-scroll">
            <table className="profile-table">
              <thead>
                <tr className="profile-table-header-row">
                  <th className="profile-th">ID</th>
                  <th className="profile-th">Date</th>
                  <th className="profile-th">Total</th>
                  <th className="profile-th">Paid</th>
                  <th className="profile-th">Delivered</th>
                  <th className="profile-th"></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order, index) => (
                  <tr
                    key={order._id}
                    className="profile-order-row"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="profile-td">{order._id.substring(0, 10)}...</td>
                    <td className="profile-td">{order.createdAt.substring(0, 10)}</td>
                    <td className="profile-td profile-td--bold">{formatTaka(order.totalPrice)}</td>
                    <td className="profile-td">
                      {order.isPaid
                        ? <span className="profile-badge profile-badge--success">Paid</span>
                        : <span className="profile-badge profile-badge--danger">Pending</span>}
                    </td>
                    <td className="profile-td">
                      {order.isDelivered
                        ? <span className="profile-badge profile-badge--success">Yes</span>
                        : <span className="profile-badge profile-badge--danger">No</span>}
                    </td>
                    <td className="profile-td">
                      <button
                        className="profile-details-btn"
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

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-emoji">⚠️</div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="profile-modal-btns">
              <button
                className="profile-modal-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="profile-modal-confirm"
                onClick={() => { dispatch(logout()); navigate('/login'); }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;