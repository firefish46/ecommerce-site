// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();

  const { loading, error, userInfo } = useSelector((state) => state.userLogin);

  // ✅ Fix: parse redirect properly
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      // ✅ Fix: replace:true removes /login from history stack
      // so pressing back from /shipping goes to /cart, not /login
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`, { replace: true });
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <Link to="/" className="auth-brand__link">
            <img src="/logo1.svg" alt="Logo" className="auth-brand__logo" />
            <span>Gadget<span className="auth-brand__accent">MART</span></span>
          </Link>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {/* Error */}
        {error && (
          <div className="auth-alert auth-alert--error">
            <i className="fas fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="auth-form">

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email Address</label>
            <div className="auth-input-wrap">
              <i className="fas fa-envelope auth-input-icon"></i>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <i className="fas fa-lock auth-input-icon"></i>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-pwd-toggle"
                onClick={() => setShowPwd(!showPwd)}
                tabIndex={-1}
              >
                <i className={`fas ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? <><i className="fas fa-spinner fa-spin"></i> Signing In...</>
              : <><i className="fas fa-sign-in-alt"></i> Sign In</>
            }
          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>New to GadgetMART?</span>
        </div>

        {/* Register link */}
        <Link
          to={`/register?redirect=${redirect}`}
          className="auth-register-btn"
        >
          Create an Account
        </Link>

      </div>

      {/* Secure note */}
      <p className="auth-secure-note">
        <i className="fas fa-shield-halved"></i>
        Your information is encrypted and secure
      </p>
    </div>
  );
};

export default LoginPage;