// frontend/src/pages/admin/UserListPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../../actions/userActions';
import '../../styles/UserListPage.css';

const UserListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeUserId, setActiveUserId] = useState(null);
  const timerRef = useRef(null);

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete) || {};
  const { success: successDelete } = userDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  // ✅ Count admins for frontend protection
  const adminCount = Array.isArray(users) ? users.filter((u) => u.isAdmin).length : 0;

  const deleteHandler = (user) => {
    // ✅ Frontend guard: prevent deleting last admin
    if (user.isAdmin && adminCount <= 1) {
      alert('Cannot delete the last admin account. Promote another user to admin first.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${user.name}"?`)) {
      dispatch(deleteUser(user._id));
      setActiveUserId(null);
    }
  };

  const handleTouchStart = (id) => {
    if (window.innerWidth <= 768) {
      timerRef.current = setTimeout(() => {
        setActiveUserId(id);
        if (window.navigator.vibrate) window.navigator.vibrate(60);
      }, 500);
    }
  };

  const handleTouchEnd = () => clearTimeout(timerRef.current);

  return (
    <div className="userlist-container" onClick={() => setActiveUserId(null)}>

      <div className="userlist-header">
        <div>
          <h1 className="userlist-title">User Management</h1>
          <p className="userlist-subtitle">Long-press a user on mobile to see options.</p>
        </div>
        <div className="userlist-stats-badge">
          Total: {Array.isArray(users) ? users.length : 0}
          {adminCount > 0 && <span className="userlist-admin-count"> · {adminCount} admin{adminCount > 1 ? 's' : ''}</span>}
        </div>
      </div>

      {loading ? (
        <div className="userlist-center">Loading...</div>
      ) : error ? (
        <div className="userlist-error">{error}</div>
      ) : (
        <div className="userlist-table-wrapper">
          <table className="userlist-table">
            <thead>
              <tr className="userlist-thead-row">
                <th className="userlist-th">User</th>
                <th className="userlist-th">Email</th>
                <th className="userlist-th userlist-th--right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) ? users.map((user) => {
                // ✅ Disable delete if this is the last admin
                const isLastAdmin = user.isAdmin && adminCount <= 1;

                return (
                  <tr
                    key={user._id}
                    className={`userlist-row ${activeUserId === user._id ? 'is-holding' : ''}`}
                    onTouchStart={() => handleTouchStart(user._id)}
                    onTouchEnd={handleTouchEnd}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <td className="userlist-td">
                      <div className="userlist-user-info">
                        <div className={`userlist-avatar ${user.isAdmin ? 'userlist-avatar--admin' : ''}`}>
                          {user.name ? user.name.substring(0, 2).toUpperCase() : '??'}
                        </div>
                        <div>
                          <div className="userlist-name">{user.name}</div>
                          <span className={`userlist-badge ${user.isAdmin ? 'userlist-badge--admin' : 'userlist-badge--member'}`}>
                            {user.isAdmin ? 'ADMIN' : 'MEMBER'}
                          </span>
                        </div>
                      </div>

                      {/* Mobile overlay */}
                      <div className="mobile-action-overlay">
                        <button
                          className="mobile-btn edit"
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/user/${user._id}/edit`); }}
                        >
                          EDIT
                        </button>
                        <button
                          className={`mobile-btn delete ${isLastAdmin ? 'mobile-btn--disabled' : ''}`}
                          disabled={isLastAdmin}
                          onClick={(e) => { e.stopPropagation(); deleteHandler(user); }}
                          title={isLastAdmin ? 'Cannot delete last admin' : 'Delete user'}
                        >
                          DELETE
                        </button>
                      </div>
                    </td>

                    <td className="userlist-td user-email-cell">
                      <a href={`mailto:${user.email}`} className="userlist-email-link">{user.email}</a>
                    </td>

                    <td className="userlist-td userlist-td--right desktop-actions">
                      <button
                        className="userlist-edit-btn"
                        onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className={`userlist-delete-btn ${isLastAdmin ? 'userlist-delete-btn--disabled' : ''}`}
                        disabled={isLastAdmin}
                        onClick={() => deleteHandler(user)}
                        title={isLastAdmin ? 'Cannot delete last admin' : 'Delete user'}
                      >
                        {isLastAdmin ? '🔒 Protected' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="3" className="userlist-center">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;