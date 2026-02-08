// src/components/layout/Footer.jsx

import React from 'react';

const footerStyle = {
  backgroundColor: '#f8f8f8',
  color: '#333',
  padding: '20px 0',
  textAlign: 'center',
  marginTop: '40px',
  borderTop: '1px solid #eee',
  bottom: '1%',
  position: 'relative',
  width: '100%',
};

const linkContainerStyle = {
  margin: '10px 0',
};

const linkStyle = {
  color: '#666',
  textDecoration: 'none',
  margin: '0 15px',
};

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={linkContainerStyle}>
        <a href="/about" style={linkStyle}>About Us</a> |
        <a href="/contact" style={linkStyle}>Contact</a> |
        <a href="/policies" style={linkStyle}>Policies</a>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: '0.9em' }}>
        &copy; {new Date().getFullYear()} E-Com Shop. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;