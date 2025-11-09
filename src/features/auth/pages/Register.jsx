import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerPetugas } from '../../../services/api/auth.api';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setError('Password and confirmation do not match');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await registerPetugas({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please login with your credentials.' 
        } 
      });
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="left">
        <img src="/img/neatworklogo.png" alt="NeatWork Logo" />
      </div>
      <div className="right">
        <div className="login-box">
          <h2>Register as Petugas</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password_confirmation">Confirm Password</label>
              <input 
                type="password" 
                id="password_confirmation" 
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                minLength="6"
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div className="divider">or</div>
            <div className="register">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
