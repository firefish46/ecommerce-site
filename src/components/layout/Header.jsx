import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { logout } from '../../actions/userActions';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.header 
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={styles.header}
    >
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <motion.span 
            whileHover={{ rotate: 20 }} 
            style={styles.logoIcon}
          >
            🚀
          </motion.span>
          <span>TECH<span style={styles.logoAccent}>MART</span></span>
        </Link>

        {/* Navigation */}
        <nav style={styles.nav}>
          
          {/* Cart Link */}
          <Link to="/cart" style={styles.navLink}>
            <div style={styles.cartContainer}>
              <i className="fas fa-shopping-cart"></i>
              <span style={styles.navText}>Cart</span>
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    key={cartItemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    style={styles.cartBadge}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>

          {/* Admin Dropdown (Managed by React State) */}
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
                
                {/* The Dropdown Menu */}
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
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logoutHandler} 
                style={styles.logoutBtn}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>Sign In</Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

// Styles
const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #eaeaea',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
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
    padding: '10px 0', // Increases hit area
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
  logoutBtn: {
    background: 'none',
    border: '1px solid #ddd',
    padding: '5px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#666',
  }
};

export default Header;