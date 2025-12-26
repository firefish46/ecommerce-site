// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // <--- THIS is where it is linked
// 1. You can remove CartProvider import
// import { CartProvider } from './context/CartContext.js'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
  <React.StrictMode>
    {/* 2. REMOVE the <CartProvider> tags */}
    <App />
  </React.StrictMode>
);