import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { logout } from '../../actions/userActions';
import SearchBox from '../SearchBox';

const Header = () => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const dispatch = useDispatch();

  // Redux State
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🚀</span>
          <span>TECH<span style={styles.logoAccent}>MART</span></span>
        </Link>

        {/* Navigation */}
        <nav style={styles.nav}>
          <SearchBox />
          
          {/* Cart Link */}
          <Link to="/cart" style={styles.navLink}>
            <div style={styles.cartContainer}>
              <i className="fas fa-shopping-cart"></i>
              <span style={styles.navText}>Cart</span>
              {cartItemCount > 0 && (
                <span style={styles.cartBadge}>
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>

          {/* Admin Dropdown */}
          {userInfo && userInfo.isAdmin && (
            <div style={styles.adminSection}>
              <div 
                style={styles.dropdown}
                onMouseEnter={() => setShowAdminMenu(true)}
                onMouseLeave={() => setShowAdminMenu(false)}
              >
                <span style={styles.navLink}>
                  Admin <i className="fas fa-caret-down"></i>
                </span>
                
                <div 
                  style={{ 
                    ...styles.dropdownContent, 
                    opacity: showAdminMenu ? 1 : 0,
                    visibility: showAdminMenu ? 'visible' : 'hidden',
                    transform: showAdminMenu ? 'translateY(0)' : 'translateY(10px)'
                  }}
                >
                  <Link to="/admin/userlist" style={styles.dropdownItem}>Users</Link>
                  <Link to="/admin/productlist" style={styles.dropdownItem}>Products</Link>
                  <Link to="/admin/orderlist" style={styles.dropdownItem}>Orders</Link>
                </div>
              </div>
            </div>
          )}

          {/* User Section */}
          {userInfo ? (
            <div style={styles.userGroup}>
              <Link to="/profile" style={styles.navLink}>
                <i className="fas fa-user-circle"></i>
                <span style={styles.navText}>{userInfo.name.split(' ')[0]}</span>
              </Link>
              <button className='logoutBtn'
                onClick={logoutHandler} 
                style={styles.logoutBtn}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

// Styles remain the same
const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #eaeaea',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    fontfamily: "'Poppins', sans-serif",
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '1.4rem',
    fontWeight: '800',
  },
  logoIcon: { fontSize: '1.5rem' },
  logoAccent: { color: '#3498db' },
  nav: { display: 'flex', alignItems: 'center', gap: '25px' },
  navLink: {
    textDecoration: 'none',
    color: '#444',
    fontSize: '0.95rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    padding: '10px 0',
  },
  cartContainer: { position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' },
  cartBadge: {
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 6px',
    borderRadius: '10px',
    position: 'absolute',
    top: '-8px',
    right: '-12px',
  },
  adminSection: {
    borderLeft: '1px solid #eee',
    paddingLeft: '20px',
  },
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownContent: {
    position: 'absolute',
    backgroundColor: '#fff',
    minWidth: '150px',
    boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '10px 0',
    top: '100%',
    left: '0',
    zIndex: 1100,
    transition: 'all 0.3s ease',
    border: '1px solid #eee',
  },
  dropdownItem: {
    color: '#333',
    padding: '10px 20px',
    textDecoration: 'none',
    display: 'block',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
  userGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderLeft: '1px solid #eee',
    paddingLeft: '20px',
  },
  loginBtn: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  
};

export default Header;