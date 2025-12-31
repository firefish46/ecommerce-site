import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from '../../actions/userActions';

const UserListPage = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  // Helper to get initials for the profile avatar
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div style={containerStyle}>
      <div style={headerSection}>
        <div>
          <h1 style={titleStyle}>User Management</h1>
          <p style={subtitleStyle}>Manage your store's registered customers and admins.</p>
        </div>
        <div style={statsBadge}>Total Users: {users ? users.length : 0}</div>
      </div>

      {loading ? (
        <div style={center}><div className="spinner"></div><p>Fetching users...</p></div>
      ) : error ? (
        <div style={errorBox}>{error}</div>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={thStyle}>USER</th>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>EMAIL</th>
                <th style={thStyle}>ROLE</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user) => (
                <tr key={user._id} style={rowStyle}>
                  <td style={tdStyle}>
                    <div style={userInfoStyle}>
                      <div style={avatarStyle}>{getInitials(user.name)}</div>
                      <span style={userNameStyle}>{user.name}</span>
                    </div>
                  </td>
                  <td style={idStyle}>{user._id.substring(0, 8)}...</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={user.isAdmin ? adminBadge : memberBadge}>
                      {user.isAdmin ? 'ADMIN' : 'CUSTOMER'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <button className='Edit-btn' style={actionBtn}>Edit</button>
                    <button className='delete-btn' style={deleteBtn}>Delete</button>
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

// --- MODERN STYLES ---
const containerStyle = { padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Hubot Sans', sans-serif" };
const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' };
const titleStyle = { fontSize: '28px', fontWeight: '800', margin: 0, color: '#1a1a1a' };
const subtitleStyle = { color: '#666', marginTop: '5px', fontSize: '14px' };
const statsBadge = { backgroundColor: '#f0f0f0', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };

const tableWrapper = { backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const headerRowStyle = { backgroundColor: '#fafafa', borderBottom: '1px solid #eee' };
const thStyle = { padding: '15px 20px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' };
const rowStyle = { borderBottom: '1px solid #f8f8f8', transition: '0.2s' };
const tdStyle = { padding: '16px 20px', fontSize: '14px', verticalAlign: 'middle' };

const userInfoStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatarStyle = { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0d76ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' };
const userNameStyle = { fontWeight: '600', color: '#1a1a1a' };
const idStyle = { fontFamily: 'monospace', color: '#999', fontSize: '12px' };

const adminBadge = { padding: '4px 10px', backgroundColor: '#e6fffb', color: '#08979c', borderRadius: '6px', fontSize: '10px', fontWeight: '800', border: '1px solid #b5f5ec' };
const memberBadge = { padding: '4px 10px', backgroundColor: '#f5f5f5', color: '#595959', borderRadius: '6px', fontSize: '10px', fontWeight: '800', border: '1px solid #d9d9d9' };

const actionBtn = { background: 'none', border: 'solid 1px #ddd', color: '#0d76ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginRight: '15px' };
const deleteBtn = { background: 'none', border: 'solid 1px #ddd', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };

const center = { textAlign: 'center', padding: '100px 0' };
const errorBox = { padding: '20px', backgroundColor: '#fff1f0', color: '#cf1322', borderRadius: '8px', border: '1px solid #ffa39e' };

export default UserListPage;