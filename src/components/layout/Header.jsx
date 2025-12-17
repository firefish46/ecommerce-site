// src/components/layout/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import useCart to show item count

const headerStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '20px',
  fontSize: '1.1em',
};

const Header = () => {
  // Access the cart state to get the total number of items
  const { cartState } = useCart();
  const cartItemCount = cartState.cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Placeholder for User/Login state (to be implemented with API later)
  const isAuthenticated = false; // Assume not logged in for now

  return (
    <header style={headerStyle}>
      {/* Logo/Home Link */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5em', fontWeight: 'bold' }}>
        🛒  TECH BAZAR
      </Link>

      {/* Navigation Links */}
      <nav>
        {/* Cart Link */}
        <Link to="/cart" style={navLinkStyle}>
          <i className="fas fa-shopping-cart"></i> Cart ({cartItemCount})
        </Link>
        
        {/* Login/User Link */}
        {isAuthenticated ? (
          <Link to="/profile" style={navLinkStyle}>
            Profile
          </Link>
        ) : (
          <Link to="/login" style={navLinkStyle}>
            <i className="fas fa-user"></i> Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;