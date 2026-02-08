// frontend/src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';

// NOTE: You would typically use dedicated components for Message and Loader
// For simplicity, we are using simple <p> tags for now.

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null); // Local state for password mismatch

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Redux state for registration
    const userRegister = useSelector((state) => state.userRegister);
    const { loading, error, userInfo } = userRegister;

    // A simple function to get the redirect URL from the browser's location
    const getRedirect = () => {
        const params = new URLSearchParams(location.search);
        return params.get('redirect') || '/';
    };
    const redirect = getRedirect();

    // Effect to redirect if registration (and subsequent login) is successful
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setMessage(null); // Clear local message
            dispatch(register(name, email, password));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' ,borderRadius: '8px' }}>
            <h1>Sign Up</h1>

            {/* Display local error message (password mismatch) */}
            {message && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{message}</p>}
            
            {/* Display Redux error message (API failure) */}
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
            
            {/* Display loading state */}
            {loading && <p>Loading...</p>}

            <form onSubmit={submitHandler}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                
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

                <div style={{ marginBottom: '15px' }}>
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
                
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <button 
                    className='button_submit'
                    type="submit" 
                    disabled={loading}
                    style={{ fontFamily: 'Hubot Sans', width: '100%', padding: '10px', backgroundColor: '#4588cfe7', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                    Register
                </button>
            </form>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                Have an Account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'blue' }}>
                    Login
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;