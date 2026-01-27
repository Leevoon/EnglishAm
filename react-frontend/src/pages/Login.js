import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Remove spaces from email
    const cleanEmail = email.replace(/\s/g, '');

    const result = await login(cleanEmail, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    const result = await guestLogin();
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Guest login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="page-login">
      <div className="container">
        <div className="login-wrapper">
          <div className="login-content">
            <Link to="/" className="login-logo">
              <h2>English.am</h2>
            </Link>
            
            <div className="login-title">
              Login to your English.am account!
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email or Username <span className="required">*</span></label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email or username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>

              <div className="login-actions">
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-login btn-primary"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button 
                type="button"
                onClick={handleGuestLogin}
                className="btn btn-login btn-secondary mt-3"
                disabled={loading}
              >
                Sign in as Guest
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



