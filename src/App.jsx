import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ProfilePetugas from './features/profile/pages/ProfilePetugas';
import './styles/app.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/profile-petugas" element={<ProfilePetugas />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
