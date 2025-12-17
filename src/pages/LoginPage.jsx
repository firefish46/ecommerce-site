// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // A simple function to get the redirect URL from the browser's location (e.g., '/checkout')
  const getRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || '/';
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // In a real app, you would send email/password to the backend API here.

    // Simulate successful login
    alert(`Logging in user: ${email}`); 
    
    // Redirect user to the original destination (or home page)
    navigate(getRedirect()); 
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        New Customer?{' '}
        <Link to={`/register?redirect=${getRedirect()}`} style={{ color: 'blue' }}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;