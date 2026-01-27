import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    gender: '1',
    agree: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.agree) {
      setError('Please agree to the Terms of Service');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      if (response.data.success) {
        // Store token and redirect
        localStorage.setItem('authToken', response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-register">
      <div className="container">
        <div className="register-wrapper">
          <div className="register-content">
            <Link to="/" className="register-logo">
              <span className="logo-text">english</span>
              <span className="logo-dot">.</span>
              <span className="logo-domain">am</span>
            </Link>

            <h1 className="register-title">Create your account</h1>
            <p className="register-subtitle">Join thousands of English learners worldwide</p>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="form-control"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="form-control"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="user_name" className="form-label">
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  className="form-control"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  placeholder="johndoe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm_password" className="form-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    className="form-control"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="gender-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="1"
                      checked={formData.gender === '1'}
                      onChange={handleChange}
                    />
                    <span>Male</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="2"
                      checked={formData.gender === '2'}
                      onChange={handleChange}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
