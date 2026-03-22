// frontend/src/pages/admin/UserEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axiosConfig.js';
import '../../styles/UserEditPage.css';

const UserEditPage = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (!userInfo?.isAdmin) { navigate('/login'); return; }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/users/${id}`, config);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user');
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/users/${id}`, { name, email, isAdmin }, config);
      setSuccess(true);
      setTimeout(() => navigate('/admin/userlist'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSaving(false);
    }
  };

  return (
    <div className="useredit-container">
      <Link to="/admin/userlist" className="useredit-back">
        <i className="fas fa-arrow-left"></i> Back to Users
      </Link>

      <div className="useredit-card">
        <h1 className="useredit-title">Edit User</h1>
        <p className="useredit-subtitle">Update user details and permissions</p>

        {loading && <div className="loader-line"></div>}

        {error && (
          <div className="useredit-alert useredit-alert--error">
            <i className="fas fa-circle-exclamation"></i> {error}
          </div>
        )}
        {success && (
          <div className="useredit-alert useredit-alert--success">
            <i className="fas fa-circle-check"></i> User updated! Redirecting...
          </div>
        )}

        {!loading && (
          <form onSubmit={submitHandler} className="useredit-form">

            <div className="form-group">
              <label htmlFor="ue-name">Full Name</label>
              <input
                type="text" id="ue-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="User's full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ue-email">Email Address</label>
              <input
                type="email" id="ue-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">Admin Privileges</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className="useredit-toggle-hint">
                {isAdmin ? '⚡ Admin — full access' : '👤 Member — standard access'}
              </span>
            </div>

            <button type="submit" className="useredit-btn" disabled={saving || success}>
              {saving
                ? <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                : <><i className="fas fa-floppy-disk"></i> Save Changes</>
              }
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditPage;