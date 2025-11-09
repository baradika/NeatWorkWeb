import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  return (
    <div className="login-page">
      <div className="left">
        <img src="/img/neatworklogo.png" alt="NeatWork Logo" />
      </div>
      <div className="right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <form>
            <div>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn">
              Sign In
            </button>
            <div className="divider">or</div>
            <div className="register">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
