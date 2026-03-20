import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../../actions/userActions';
import { USER_UPDATE_RESET } from '../../constants/userConstants';
import '../../styles/UserEditPage.css';

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate('/admin/userlist');
      return;
    }

    // FIX: Convert user._id to string for comparison
    // MongoDB ObjectId !== plain string, so this was always true → infinite fetch loop
    if (!user || !user.name || String(user._id) !== String(userId)) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, navigate, userId, user, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <div className="useredit-container">
      <Link to="/admin/userlist" className="useredit-back">
        ← Back to Users
      </Link>

      <div className="useredit-card">
        <h1 className="useredit-title">Edit User</h1>
        <p className="useredit-subtitle">Update account permissions and details</p>

        {loadingUpdate && <div className="loader-line"></div>}
        {errorUpdate && <div className="useredit-alert useredit-alert--error">{errorUpdate}</div>}

        {loading ? (
          <div className="useredit-center">Loading User Data...</div>
        ) : error ? (
          <div className="useredit-alert useredit-alert--error">{error}</div>
        ) : (
          <form onSubmit={submitHandler} className="useredit-form">

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className="checkbox-label">Administrator Privileges</span>
            </div>

            <button type="submit" className="useredit-btn" disabled={loadingUpdate}>
              {loadingUpdate ? 'Updating...' : 'Update User Account'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditPage;