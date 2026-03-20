import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from '../../actions/userActions';
import '../../styles/UserListPage.css';

const UserListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Tracks which user row is currently "held"
  const [activeUserId, setActiveUserId] = useState(null);
  const timerRef = useRef(null);

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // dispatch(deleteUser(id));
      setActiveUserId(null); // Close overlay after action
    }
  };

  // --- Long Press Logic ---
  const handleTouchStart = (id) => {
    if (window.innerWidth <= 768) {
      // Start a 500ms timer
      timerRef.current = setTimeout(() => {
        setActiveUserId(id);
        if (window.navigator.vibrate) window.navigator.vibrate(60); // Feedback
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(timerRef.current);
  };

  return (
    // Clicking anywhere on the container closes any open "hold" menu
    <div className="userlist-container" onClick={() => setActiveUserId(null)}>
      
      <div className="userlist-header">
        <div>
          <h1 className="userlist-title">User Management</h1>
          <p className="userlist-subtitle">Long-press a user on mobile to see options.</p>
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
             {Array.isArray(users) && users.map((user) => (
                <tr 
                  key={user._id} 
                  className={`userlist-row ${activeUserId === user._id ? 'is-holding' : ''}`}
                  onTouchStart={() => handleTouchStart(user._id)}
                  onTouchEnd={handleTouchEnd}
                  // Prevents the system "save image/copy" menu from popping up
                  onContextMenu={(e) => e.preventDefault()} 
                >
                  <td className="userlist-td">
                    <div className="userlist-user-info">
                      <div className="userlist-avatar">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="userlist-name">{user.name}</div>
                        <span className={`userlist-badge ${user.isAdmin ? 'userlist-badge--admin' : 'userlist-badge--member'}`}>
                          {user.isAdmin ? 'ADMIN' : 'MEMBER'}
                        </span>
                      </div>
                    </div>

                    {/* MOBILE OVERLAY: Only visible when activeUserId === user._id */}
                    <div className="mobile-action-overlay">
                      <button 
                        className="mobile-btn edit" 
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/user/${user._id}/edit`); }}
                      >
                        EDIT
                      </button>
                      <button 
                        className="mobile-btn delete" 
                        onClick={(e) => { e.stopPropagation(); deleteHandler(user._id); }}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>

                  <td className="userlist-td user-email-cell">{user.email}</td>

                  <td className="userlist-td userlist-td--right desktop-actions">
                    <button className="userlist-edit-btn" onClick={() => navigate(`/admin/user/${user._id}/edit`)}>Edit</button>
                    <button className="userlist-delete-btn" onClick={() => deleteHandler(user._id)}>Delete</button>
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