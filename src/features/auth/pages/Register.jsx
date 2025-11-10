import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerPetugas, checkEmail } from '../../../services/api/auth.api';
import Alert from '../../../components/Alert';
import './Login.css';

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    type: 'error',
    message: ''
  });

  const showAlert = (message, type = 'error') => {
    setAlert({
      show: true,
      type,
      message
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };
  const navigate = useNavigate();

  // Debounced email check
  const checkEmailAvailability = useCallback(
    debounce(async (email) => {
      if (!email) {
        setIsEmailAvailable(null);
        return;
      }
      
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setIsEmailAvailable(null);
        return;
      }

      try {
        setIsCheckingEmail(true);
        const result = await checkEmail(email);
        // The API returns { exists: true/false } directly, not nested under data
        setIsEmailAvailable(!result.exists);
      } catch (error) {
        console.error('Error checking email:', error);
        setIsEmailAvailable(null);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500),
    []
  );

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Check email availability when email field changes
    if (id === 'email') {
      checkEmailAvailability(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      showAlert('Password dan konfirmasi password tidak cocok');
      return;
    }

    // Check email availability one more time before submission
    if (isEmailAvailable === false) {
      showAlert('Email sudah terdaftar. Silakan gunakan email lain.');
      return;
    }

    try {
      setIsLoading(true);
      
      await registerPetugas({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      
      // Redirect to login page after successful registration
      showAlert('Registrasi berhasil! Silakan login dengan akun Anda.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.message || 'Registrasi gagal. Silakan coba lagi.';
      showAlert(errorMessage);
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
          {alert.show && (
            <Alert 
              type={alert.type} 
              message={alert.message} 
              onClose={closeAlert}
            />
          )}
          
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={`w-full ${isEmailAvailable === false ? 'border-red-500' : isEmailAvailable ? 'border-green-500' : ''}`}
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-3 w-4 h-4 border-2 border-gray-300 border-t-2 border-t-blue-500 rounded-full animate-spin"></div>
                )}
                {!isCheckingEmail && isEmailAvailable === false && (
                  <span className="absolute right-3 top-3 text-red-500">✗</span>
                )}
                {!isCheckingEmail && isEmailAvailable === true && (
                  <span className="absolute right-3 top-3 text-green-500">✓</span>
                )}
              </div>
              {isEmailAvailable === false && (
                <p className="text-red-500 text-sm mt-1">Email sudah terdaftar</p>
              )}
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
              Already have an account? <Link to="/auth/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
