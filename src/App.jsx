// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout Components (to be created in components/layout)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Import Page Components (to be created in pages/)
// frontend/src/App.jsx (CORRECTED IMPORTS)

// ...
// Import Page Components (to be created in pages/)
import HomePage from './pages/HomePage'; // <-- Ensure lowercase 'pages'
import ProductDetailsPage from './pages/ProductDetailsPage'; // <-- Ensure lowercase 'pages'
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage'; // <-- Ensure lowercase 'pages'
import LoginPage from './pages/LoginPage'; // <-- Ensure lowercase 'pages'
import CheckoutPage from './pages/CheckoutPage'; // <-- Ensure lowercase 'pages'

// ...
function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;