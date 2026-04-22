import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation for signup
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignup) {
        // Signup
        await axios.post('/api/auth/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        setSuccess('Account created successfully! Please login.');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          setIsSignup(false);
          setSuccess('');
        }, 2000);
      } else {
        // Login
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || (isSignup ? 'Signup failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>RecycleRight Pakistan</h1>
          <p>Admin Portal</p>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={!isSignup ? 'tab-btn active' : 'tab-btn'}
            onClick={() => !isSignup || toggleMode()}
          >
            Login
          </button>
          <button 
            className={isSignup ? 'tab-btn active' : 'tab-btn'}
            onClick={() => isSignup || toggleMode()}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          {isSignup && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="admin@recycleright.pk"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isSignup ? 'Creating Account...' : 'Logging in...') : (isSignup ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button className="toggle-btn" onClick={toggleMode}>
              {isSignup ? 'Login here' : 'Sign up here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
