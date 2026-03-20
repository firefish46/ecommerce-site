
import '../../styles/Header.css'; // Import CSS for styling

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchBox from '../SearchBox';


const Header = () => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
         <img src="/logo1.svg" alt="Logo" />
          <span>Gadget<span className="logo-accent">MART</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        {/* Navigation */}
        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>

  <SearchBox />

          
          <Link to="/cart" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="cart-container">
              <i className="fas fa-shopping-cart"></i>
              <span className="nav-text">Cart</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </div>
          </Link>

          {/* Admin Section */}
          {userInfo && userInfo.isAdmin && (
            <div className="admin-section">
              <div 
                className="dropdown"
                onMouseEnter={() => setShowAdminMenu(true)}
                onMouseLeave={() => setShowAdminMenu(false)}
              >
                <span className="nav-link">
                  Admin <i className="fas fa-caret-down"></i>
                </span>
                
                {showAdminMenu && (
                  <div className="dropdown-content">
                    <Link to="/admin/userlist" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Users</Link>
                    <Link to="/admin/productlist" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                    <Link to="/admin/orderlist" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                    <Link to='/admin/promotionlist' className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Promotions</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Section */}
          {userInfo ? (
            <div className="user-group">
              <Link to="/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-user-circle"></i>
                <span className="nav-text">{userInfo.name.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="login-btn" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;