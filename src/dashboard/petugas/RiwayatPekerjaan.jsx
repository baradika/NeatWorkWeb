import React, { useState } from 'react';
import { Bell, User, Star, Calendar, MapPin } from 'lucide-react';
import './petugas.css';

export default function RiwayatPetugas() {
  const [historyOrders] = useState([
    {
      id: 1,
      name: 'Dewi Lestari',
      service: 'Deep Cleaning',
      date: '02-03-2025',
      location: 'Cipayung, Jakarta Timur',
      rating: 5,
      review: 'Sangat profesional dan cepat!!',
      status: 'Selesai'
    },
    {
      id: 2,
      name: 'Eko Prasetyo',
      service: 'Home Cleaning',
      date: '05-03-2025',
      location: 'Kebayoran Baru, Jakarta Selatan',
      rating: 4,
      review: 'Bagus, hanya sedikit terlambat',
      status: 'Selesai'
    },
    {
      id: 3,
      name: 'Cahya Putri',
      service: 'Home Cleaning',
      date: '05-03-2025',
      location: 'Menteng, Jakarta Pusat',
      rating: 4,
      review: 'Memuaskan, akan order lagi',
      status: 'Selesai'
    }
  ]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star-icon ${index < rating ? 'star-filled' : 'star-empty'}`}
        size={16}
      />
    ));
  };

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
          <button className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          
          <button className="nav-item nav-item-active">
            <span className="nav-icon">📜</span>
            <span className="nav-label">Riwayat Pekerjaan</span>
          </button>
          
          <button className="nav-item">
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
            <h1 className="main-title">RIWAYAT PEKERJAAN</h1>
            <div className="header-icons">
              <button className="icon-button">
                <Bell className="icon" />
              </button>
              <button className="icon-button">
                <User className="icon" />
              </button>
            </div>
          </div>

          {/* History Section */}
          <div className="orders-section">
            <div className="orders-header">
              <span className="section-icon">📜</span>
              <h2 className="section-title">Lihat Riwayat Pekerjaan Anda..</h2>
            </div>

            {/* History Cards */}
            {historyOrders.map(order => (
              <div key={order.id} className="history-card">
                <div className="history-header">
                  <div className="order-info">
                    <h3 className="order-name">{order.name}</h3>
                    <p className="order-service">{order.service}</p>
                    <p className="order-date">{order.date}</p>
                  </div>
                  <span className="status-badge status-completed">{order.status}</span>
                </div>

                <div className="history-rating">
                  <div className="stars-container">
                    {renderStars(order.rating)}
                  </div>
                  <span className="rating-text">({order.rating}/5)</span>
                </div>

                <div className="history-review">
                  <p className="review-text">"{order.review}"</p>
                </div>

                <div className="history-location">
                  <MapPin className="detail-icon" />
                  <span>{order.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}