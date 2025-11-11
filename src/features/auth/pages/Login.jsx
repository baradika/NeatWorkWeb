import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { http } from '../../../services/api/httpClient';
import Alert from '../../../components/Alert';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      setIsLoading(true);
      const response = await http.post('/api/auth/login', { 
        email: formData.email, 
        password: formData.password 
      });
      const responseData = response || {};
      let token = responseData.token; 
      const userData = responseData.data || {};
      if (!token) {
        setError('Login gagal: Token tidak ditemukan');
        return;
      }
      if (!userData) {
        setError('Login gagal: Data pengguna tidak valid');
        return;
      }
      localStorage.setItem('access_token', token);
      if (userData && userData.role) {
        localStorage.setItem('role', userData.role);
      }
      console.debug('Login success. userData:', userData);
      if (userData && userData.role === 'petugas') {
        try {
          const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
          const checkProfileResponse = await fetch(`${base}/api/check-petugas-profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          if (!checkProfileResponse.ok) {
            navigate('/auth/profile-petugas');
            return;
          }
          const checkResult = await checkProfileResponse.json();
          console.debug('check-petugas-profile result:', checkResult);
          if (checkResult.has_profile && checkResult.is_verified) {
            navigate('/dashboard/petugas');
          } else if (checkResult.has_profile && !checkResult.is_verified) {
            navigate('/auth/status-petugas');
          } else {
            navigate('/auth/profile-petugas');
          }
        } catch (_) {
          navigate('/auth/profile-petugas');
        }
      } else {
        // Non-petugas: use generic dashboard router to decide
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
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
          <h2>Welcome Back</h2>
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div style={{ color: '#b91c1c', fontSize: 14, marginBottom: 8 }}>{error}</div>
            )}
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="divider">or</div>
            <div className="register">
              Don't have an account? <Link to="/auth/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;