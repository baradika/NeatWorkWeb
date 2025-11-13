import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, CheckCircle, Star, Calendar, Clock, MapPin, X, Check } from 'lucide-react';
import '../petugas/petugas.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [requests] = useState([
    {
      id: 101,
      name: 'Budi Santoso',
      service: 'General Cleaning',
      date: '05-04-2025',
      time: '10:00',
      location: 'Cilandak, Jakarta Selatan',
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
            <img src="/public/img/neatworklogo.png" alt="logo" className="logo-image" />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="nav-menu">
          <button className="nav-item nav-item-active">
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button className="nav-item" onClick={() => navigate('/dashboard/admin/verifikasi')}>
            <span className="nav-icon">🧑‍💼</span>
            <span className="nav-label">Verifikasi Petugas</span>
          </button>

          <button className="nav-item"  onClick={() => navigate('/dashboard/admin/pengaturan')}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Pengaturan</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button className="nav-item logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Keluar</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="content-card">
          <div className="header-section">
            <h1 className="main-title">DASHBOARD ADMIN</h1>
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
            {/* Pengajuan Hari Ini */}
            <div className="stat-card stat-card-green">
              <div className="stat-content">
                <div className="stat-label">Pengajuan Baru</div>
                <div className="stat-number">5</div>
              </div>
              <CheckCircle className="stat-icon" />
            </div>

            {/* Notifikasi */}
            <div className="stat-card stat-card-cyan">
              <div className="stat-content">
                <div className="stat-label">Notifikasi</div>
                <div className="stat-number">7</div>
              </div>
              <Bell className="stat-icon" />
            </div>

            {/* Rating Sistem */}
            <div className="stat-card stat-card-yellow">
              <div className="stat-content">
                <div className="stat-label">Rating Sistem</div>
                <div className="stat-number">4.9</div>
              </div>
              <Star className="stat-icon stat-icon-filled" />
            </div>
          </div>

          {/* Daftar Permintaan/Pemesanan (contoh) */}
          <div className="orders-section">
            <div className="orders-header">
              <Bell className="section-icon" />
              <h2 className="section-title">Permintaan Terbaru</h2>
            </div>

            {requests.map(req => (
              <div key={req.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-name">{req.name}</h3>
                    <p className="order-service">{req.service}</p>
                  </div>
                  <span className="order-status">{req.status}</span>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <Calendar className="detail-icon" />
                    <span>{req.date}</span>
                  </div>
                  <div className="detail-item">
                    <Clock className="detail-icon" />
                    <span>{req.time}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin className="detail-icon" />
                    <span>{req.location}</span>
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


