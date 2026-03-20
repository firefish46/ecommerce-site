import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../../actions/userActions';
import '../../styles/UserListPage.css';

const UserListPage = () => {
  const dispatch = useDispatch();

  const [activeUserId, setActiveUserId] = useState(null);
  const timerRef = useRef(null);

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { success: successUpdate } = userUpdate;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch, successDelete, successUpdate]);

  // ── Delete ──
  const deleteHandler = (id, name) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      dispatch(deleteUser(id));
      setActiveUserId(null);
    }
  };

  // ── Toggle Admin / Ban ──
  const toggleAdminHandler = (user) => {
    const action = user.isAdmin ? 'Demote' : 'Promote';
    if (window.confirm(`Are you sure you want to ${action} "${user.name}"?`)) {
      dispatch({ type: 'USER_UPDATE_REQUEST' });
      dispatch({
        type: 'USER_UPDATE_SUCCESS',
        payload: { ...user, isAdmin: !user.isAdmin },
      });
    }
    setActiveUserId(null);
  };

  // ── Long press (mobile) ──
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

      {/* ── Header ── */}
      <div className="userlist-header">
        <div>
          <h1 className="userlist-title">User Management</h1>
          <p className="userlist-subtitle">Delete or promote/demote users. Long-press a row on mobile.</p>
        </div>
        <div className="userlist-stats-badge">
          Total: {users ? users.length : 0}
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
              {users && users.map((user) => (
                <tr
                  key={user._id}
                  className={`userlist-row ${activeUserId === user._id ? 'is-holding' : ''}`}
                  onTouchStart={() => handleTouchStart(user._id)}
                  onTouchEnd={handleTouchEnd}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {/* User + Avatar + Role Badge */}
                  <td className="userlist-td">
                    <div className="userlist-user-info">
                      <div className={`userlist-avatar ${user.isAdmin ? 'userlist-avatar--admin' : ''}`}>
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="userlist-name">{user.name}</div>
                        <span className={`userlist-badge ${user.isAdmin ? 'userlist-badge--admin' : 'userlist-badge--member'}`}>
                          {user.isAdmin ? 'ADMIN' : 'MEMBER'}
                        </span>
                      </div>
                    </div>

                    {/* Long-press overlay (mobile only) */}
                    <div className="mobile-action-overlay">
                      <button
                        className="mobile-btn promote"
                        onClick={(e) => { e.stopPropagation(); toggleAdminHandler(user); }}
                      >
                        {user.isAdmin ? 'DEMOTE' : 'PROMOTE'}
                      </button>
                      <button
                        className="mobile-btn delete"
                        onClick={(e) => { e.stopPropagation(); deleteHandler(user._id, user.name); }}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="userlist-td user-email-cell">
                    <a href={`mailto:${user.email}`} className="userlist-email-link">
                      {user.email}
                    </a>
                  </td>

                  {/* Desktop Actions */}
                  <td className="userlist-td userlist-td--right desktop-actions">
                    <button
                      className={`userlist-promote-btn ${user.isAdmin ? 'userlist-promote-btn--demote' : ''}`}
                      onClick={() => toggleAdminHandler(user)}
                      title={user.isAdmin ? 'Remove admin privileges' : 'Grant admin privileges'}
                    >
                      {user.isAdmin ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      className="userlist-delete-btn"
                      onClick={() => deleteHandler(user._id, user.name)}
                    >
                      Delete
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

export default UserListPage;