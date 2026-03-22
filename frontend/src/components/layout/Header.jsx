// frontend/src/components/Header/Header.jsx
import '../../styles/Header.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/userActions';
import SearchBox from '../SearchBox';

const Header = () => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const adminRef = useRef(null);
  const userRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) setShowAdminMenu(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobile = () => setIsMobileMenuOpen(false);
  const handleLogoutClick = () => { setShowUserMenu(false); setIsMobileMenuOpen(false); setShowLogoutConfirm(true); };
  const handleLogoutConfirm = () => { dispatch(logout()); setShowLogoutConfirm(false); navigate('/login'); };
  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  return (
    <>
      <header className="main-header">
        <div className="header-container">

          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobile}>
            <img src="/logo1.svg" alt="GadgetMART Logo" />
            <span>Gadget<span className="logo-accent">MART</span></span>
          </Link>

          {/* Desktop Search — hidden on mobile via CSS */}
          <div className="header-search">
            <SearchBox />
          </div>

          {/* Mobile Search icon — inline expand, shown only on mobile via CSS */}
          <div className="mobile-search-slot">
            <SearchBox />
          </div>

          {/* Hamburger — animated bars */}
          <button
            className={`mobile-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="bars">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </button>

          {/* Nav */}
          <nav className={`nav-menu ${isMobileMenuOpen ? 'nav-menu--open' : ''}`} >
            {/* ✅ No search inside nav — SearchBox lives in header row */}
            <div className="nav-items-row" style={{display:'flex'}}>

              {/* Cart */}
              <Link to="/cart" className="nav-link nav-link--cart" onClick={closeMobile}>
                <div className="cart-wrap">
                  <i className="fas fa-shopping-cart"></i>
                  {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </div>
                <span className="nav-text">Cart</span>
              </Link>

              {/* Admin */}
              {userInfo && userInfo.isAdmin && (
                <div className="nav-dropdown" ref={adminRef}
                  onMouseEnter={() => setShowAdminMenu(true)}
                  onMouseLeave={() => setShowAdminMenu(false)}
                >
                  <button className="nav-link nav-link--btn" onClick={() => setShowAdminMenu(!showAdminMenu)}>
                    <i className="fas fa-layer-group"></i>
                    <span className="nav-text">Admin</span>
                    <i className={`fas fa-chevron-down nav-chevron ${showAdminMenu ? 'nav-chevron--open' : ''}`}></i>
                  </button>
                  {showAdminMenu && (
                    <div className="dropdown-panel">
                      <Link to="/admin/userlist"      className="dropdown-item" onClick={closeMobile}><i className="fas fa-users"></i> Users</Link>
                      <Link to="/admin/productlist"   className="dropdown-item" onClick={closeMobile}><i className="fas fa-box"></i> Products</Link>
                      <Link to="/admin/orderlist"     className="dropdown-item" onClick={closeMobile}><i className="fas fa-receipt"></i> Orders</Link>
                      <Link to="/admin/promotionlist" className="dropdown-item" onClick={closeMobile}><i className="fas fa-tag"></i> Promotions</Link>
                    </div>
                  )}
                </div>
              )}

              {/* User / Login */}
              {userInfo ? (
                <div className="nav-dropdown" ref={userRef}
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <button className="nav-link nav-link--btn nav-link--user" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <i className="fas fa-user-circle"></i>
                    <span className="nav-text">{userInfo.name.split(' ')[0]}</span>
                    <i className={`fas fa-chevron-down nav-chevron ${showUserMenu ? 'nav-chevron--open' : ''}`}></i>
                  </button>
                  {showUserMenu && (
                    <div className="dropdown-panel dropdown-panel--right">
                      <Link to="/profile" className="dropdown-item" onClick={() => { setShowUserMenu(false); closeMobile(); }}>
                        <i className="fas fa-user"></i> Profile
                      </Link>
                      <button className="dropdown-item dropdown-item--danger dropdown-item--btn" onClick={handleLogoutClick}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-btn" onClick={closeMobile}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Sign In</span>
                </Link>
              )}

            </div>
          </nav>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="logout-overlay" onClick={handleLogoutCancel}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal__icon"><i className="fas fa-sign-out-alt"></i></div>
            <h3 className="logout-modal__title">Sign out?</h3>
            <p className="logout-modal__text">You'll need to sign in again to access your account.</p>
            <div className="logout-modal__actions">
              <button className="logout-modal__cancel" onClick={handleLogoutCancel}>Cancel</button>
              <button className="logout-modal__confirm" onClick={handleLogoutConfirm}>
                <i className="fas fa-sign-out-alt"></i> Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;