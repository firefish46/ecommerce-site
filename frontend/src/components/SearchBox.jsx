import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/searchbox.css';

const SearchBox = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus when mobile search opens
  useEffect(() => {
    if (mobileOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mobileOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      navigate(`/search/${value.trim()}`);
    } else {
      navigate('/');
    }
  };

  const handleClose = () => {
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Desktop: inline search bar */}
      <div className="search-wrapper desktop-search">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          name="q"
          placeholder="Search for premium products..."
          onChange={handleSearchChange}
          className="search-input"
          autoComplete="off"
        />
      </div>

      {/* Mobile: icon button in header row */}
      <button
        className="mobile-search-toggle"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle search"
      >
        <i className={mobileOpen ? 'fas fa-times' : 'fas fa-search'}></i>
      </button>

      {/* Mobile: dropdown search bar below header */}
      {mobileOpen && (
        <div className="mobile-search-bar">
          <i className="fas fa-search mobile-search-icon"></i>
          <input
            ref={inputRef}
            type="text"
            name="q"
            placeholder="Search products..."
            onChange={handleSearchChange}
            className="search-input mobile-search-input"
            autoComplete="off"
          />
          <button
            className="mobile-search-close"
            onClick={handleClose}
            aria-label="Close search"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default SearchBox;