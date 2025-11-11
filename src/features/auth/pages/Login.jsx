import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../../../services/api/auth.api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginRequest(form.email, form.password);
      const role = data?.user?.role || data?.role;

      if (role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
        return;
      }

      if (role === 'petugas') {
        navigate('/dashboard/petugas', { replace: true });
        return;
      }

      // Fallback jika role tidak diketahui
      navigate('/dashboard/petugas', { replace: true });
    } catch (err) {
      setError(err?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
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
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            {error && (
              <div style={{ color: '#b91c1c', fontSize: 14, marginBottom: 8 }}>{error}</div>
            )}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
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