import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // 1. Add these
import { login } from '../actions/userActions';       // 2. Import your login action

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation(); // Use this instead of window.location
  const dispatch = useDispatch();

  // 3. Get userLogin state from Redux
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  // 4. If userInfo exists (login success), move to redirect page automatically
 useEffect(() => {
  if (userInfo) {
    // If redirect is "shipping", navigate to "/shipping"
    navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
  }
}, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    // 5. DISPATCH THE REAL LOGIN ACTION
    dispatch(login(email, password)); 
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' ,borderRadius: '8px' }}>
      <h1>Sign In</h1>
      
      {/* 6. Show Error or Loading messages */}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {loading && <div>Loading...</div>}

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

        <button
        className='button_submit'
         type="submit" style={{ fontFamily: 'Hubot Sans', width: '100%', padding: '10px', backgroundColor: '#11b45ae7', color: 'white', border: 'none', cursor: 'pointer',borderRadius: '4px'  }}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        New Customer?{' '}
        <Link to={`/register?redirect=${redirect}`} style={{ color: 'blue' }}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;