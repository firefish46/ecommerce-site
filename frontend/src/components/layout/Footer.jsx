import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* Brand & Mission Section */}
        <div className="footer-section brand-info">
          <Link to="/" className="footer-logo">
            Gadget<span className="logo-accent">MART</span>
          </Link>
          <p className="footer-desc">
            Your premier destination for high-end electronics and cutting-edge gadgets. 
            Quality guaranteed with worldwide shipping.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/">All Products</Link></li>
            <li><Link to="/search/laptops">Laptops</Link></li>
            <li><Link to="/search/phones">Smartphones</Link></li>
            <li><Link to="/admin/promotionlist">Special Deals</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Get in Touch</h4>
          <p><i className="fas fa-map-marker-alt"></i> 123 Tech Avenue, Dhaka, BD</p>
          <p><i className="fas fa-phone"></i> +880 1234 567890</p>
          <p><i className="fas fa-envelope"></i> support@gadgetmart.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; {currentYear} GadgetMART. All rights reserved.</p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-apple-pay"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;