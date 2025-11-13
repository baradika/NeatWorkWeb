import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/api/auth.api';
import { Bell, User, CheckCircle, Star, Calendar, Clock, MapPin, X, Check } from 'lucide-react';
import './petugas.css';

export default function DashboardPetugas() {
  const navigate = useNavigate();
  const [orders] = useState([
    {
      id: 1,
      name: 'Ahmad Hilal',
      service: 'Deep Cleaning',
      date: '02-03-2025',
      time: '09:00',
      location: 'Cipayung, Jakarta Timur',
      status: 'Menunggu'
    }
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Logo */}
        <div className="logo-container">
            <div className="logo-circle">
                <img src="/img/neatworklogo.png" alt="logo" className="logo-image" />
            </div>
            </div>


        {/* Menu Items */}
        <nav className="nav-menu">
          <button className="nav-item"  onClick={() => navigate('/dashboard/admin/petugas')}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          
          <button className="nav-item"  onClick={() => navigate('/dashboard/admin/RiwayatPekerjaan')}>
            <span className="nav-icon">📜</span>
            <span className="nav-label">Riwayat Pekerjaan</span>
          </button>
          
          <button className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Pengaturan</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button className="nav-item logout-btn" onClick={async () => { await logout(); navigate('/auth/login', { replace: true }); }}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Keluar</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="content-card">
          <div className="header-section">
            <h1 className="main-title">DASHBOARD PETUGAS</h1>
            <div className="header-icons">
              <button className="icon-button">
                <Bell className="icon" />
              </button>
              <button className="icon-button">
                <User className="icon" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {/* Selesai Hari Ini */}
            <div className="stat-card stat-card-green">
              <div className="stat-content">
                <div className="stat-label">Selesai Hari Ini</div>
                <div className="stat-number">2</div>
              </div>
              <CheckCircle className="stat-icon" />
            </div>

            {/* Pesan Masuk */}
            <div className="stat-card stat-card-cyan">
              <div className="stat-content">
                <div className="stat-label">Pesan Masuk</div>
                <div className="stat-number">3</div>
              </div>
              <Bell className="stat-icon" />
            </div>

            {/* Rating */}
            <div className="stat-card stat-card-yellow">
              <div className="stat-content">
                <div className="stat-label">Rating Rata-rata</div>
                <div className="stat-number">4.8</div>
              </div>
              <Star className="stat-icon stat-icon-filled" />
            </div>
          </div>

          {/* Pesan Masuk Section */}
          <div className="orders-section">
            <div className="orders-header">
              <Bell className="section-icon" />
              <h2 className="section-title">Pesan Masuk</h2>
            </div>

            {/* Order Card */}
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-name">{order.name}</h3>
                    <p className="order-service">{order.service}</p>
                  </div>
                  <span className="order-status">{order.status}</span>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <Calendar className="detail-icon" />
                    <span>{order.date}</span>
                  </div>
                  <div className="detail-item">
                    <Clock className="detail-icon" />
                    <span>{order.time}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin className="detail-icon" />
                    <span>{order.location}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button className="btn btn-reject">
                    <X className="btn-icon" />
                    Tolak
                  </button>
                  <button className="btn btn-accept">
                    <Check className="btn-icon" />
                    Terima
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}