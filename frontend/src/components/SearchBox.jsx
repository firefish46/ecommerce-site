// frontend/src/components/SearchBox.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/searchbox.css';

const SearchBox = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Auto-focus when mobile search opens
  useEffect(() => {
    if (mobileOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mobileOpen]);

  // ✅ Debounced navigate — waits 400ms after user stops typing
  const debouncedNavigate = useCallback((value) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/search/${value.trim()}`);
      } else {
        navigate('/');
      }
    }, 400);
  }, [navigate]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedNavigate(value);
  };

  const handleClear = () => {
    setQuery('');
    setMobileOpen(false);
    clearTimeout(debounceTimer.current);
    navigate('/');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      {/* ── Desktop: always visible inline search ── */}
      <div className="search-wrapper desktop-search">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search for premium products..."
          onChange={handleChange}
          className="search-input"
          autoComplete="off"
          value={query}
        />
        {query && (
          <button className="search-clear" onClick={handleClear} aria-label="Clear">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* ── Mobile: icon that expands inline ── */}
      <div className={`mobile-search-wrap ${mobileOpen ? 'mobile-search-wrap--open' : ''}`}>
        {/* Search icon / toggle */}
        <button
          className="mobile-search-toggle"
          onClick={() => {
            setMobileOpen((prev) => !prev);
            if (mobileOpen) handleClear();
          }}
          aria-label="Toggle search"
        >
          <i className={mobileOpen ? 'fas fa-times' : 'fas fa-search'}></i>
        </button>

        {/* Expanding inline input */}
        <div className={`mobile-search-input-wrap ${mobileOpen ? 'mobile-search-input-wrap--visible' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            onChange={handleChange}
            className="search-input mobile-search-input"
            autoComplete="off"
            value={query}
          />
        </div>
      </div>
    </>
  );
};

export default SearchBox;