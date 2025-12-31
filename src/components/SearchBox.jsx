import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    // Search while typing
    if (value.trim()) {
      navigate(`/search/${value.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={containerStyle}>
      <i className="fas fa-search" style={iconStyle}></i>
      <input
        type="text"
        name="q"
        placeholder="Search for premium products..."
        onChange={handleSearchChange}
        style={inputStyle}
        autoComplete="off"
      />
    </div>
  );
};

// --- MODERN SEARCH STYLES ---
const containerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: '450px', // Wider bar for better UX
  margin: '0 15px'
};

const iconStyle = {
  position: 'absolute',
  left: '15px',
  color: '#888',
  fontSize: '14px',
  pointerEvents: 'none'
};

const inputStyle = {
  fontFamily: "'Hubot Sans', sans-serif",
  width: '100%',
  padding: '10px 15px 10px 40px', // Left padding makes room for the icon
  fontSize: '14px',
  fontWeight: '500',
  backgroundColor: '#f5f5f7', // Subtle gray background (Apple style)
  border: '1px solid transparent',
  borderRadius: '12px',
  outline: 'none',
  transition: 'all 0.3s ease',
  color: '#1a1a1a'
};

/* Note: Add this to your App.css to handle focus:
   input:focus {
     background-color: #fff !important;
     border-color: #000 !important;
     box-shadow: 0 4px 12px rgba(0,0,0,0.05);
   }
*/

export default SearchBox;