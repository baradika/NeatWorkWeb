import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ProfilePetugas from './features/profile/pages/ProfilePetugas';
import DashboardPetugas from './dashboard/petugas/petugas';
import RiwayatPetugas from './dashboard/petugas/RiwayatPekerjaan';
import AdminDashboard from './dashboard/admin/admin';
import PengaturanAdmin from './dashboard/admin/pengaturan';
import VerifikasiPetugas from './dashboard/admin/VerifikasiPetugas';
import Dashboard from './features/dashboard/pages/Dashboard';
import StatusPetugas from './features/profile/pages/StatusPetugas';
import { useEffect } from 'react';
import './styles/app.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const location = useLocation();

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          {/* Protected auth routes for petugas profile & status */}
          <Route path="/dashboard/petugas" element={<DashboardPetugas />} />
          <Route path="/dashboard/petugas/riwayat" element={<RiwayatPetugas />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/pengaturan" element={<PengaturanAdmin />} />
          <Route 
            path="/dashboard/admin/verifikasi" 
            element={
              <ProtectedRoute>
                <VerifikasiPetugas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/auth/profile-petugas" 
            element={
              <ProtectedRoute>
                <ProfilePetugas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/auth/status-petugas" 
            element={
              <ProtectedRoute>
                <StatusPetugas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
