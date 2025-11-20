import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/api/auth.api';
import { Bell, User, CheckCircle, Star, Calendar, Clock, MapPin, X, Check } from 'lucide-react';
import './petugas.css';

export default function DashboardPetugas() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function fetchAvailable() {
      try {
        setLoading(true);
        setError('');
        const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${base}/api/petugas/available-bookings?per_page=20`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        const isJson = (res.headers.get('content-type') || '').includes('application/json');
        const data = isJson ? await res.json().catch(() => ({})) : {};
        if (!res.ok) {
          throw new Error(data?.message || 'Gagal memuat pemesanan');
        }
        const items = Array.isArray(data?.data?.data) ? data.data.data : (Array.isArray(data?.data) ? data.data : []);
        setOrders(items);
      } catch (e) {
        setError(e.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }
    fetchAvailable();
  }, []);

  async function acceptOrder(id) {
    try {
      setActionLoading(id);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/petugas/bookings/${id}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const data = isJson ? await res.json().catch(() => ({})) : {};
      if (!res.ok) throw new Error(data?.message || 'Gagal menerima pemesanan');
      // Refresh list
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectOrder(id) {
    try {
      setActionLoading(id);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/petugas/bookings/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const data = isJson ? await res.json().catch(() => ({})) : {};
      if (!res.ok) throw new Error(data?.message || 'Gagal menolak pemesanan');
      // Remove from list
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setActionLoading(null);
    }
  }

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
          <button 
            className={`nav-item ${isActive('/dashboard/petugas') ? 'nav-item-active' : ''}`}
            onClick={() => navigate('/dashboard/petugas')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${isActive('/dashboard/petugas/riwayat') ? 'nav-item-active' : ''}`}
            onClick={() => navigate('/dashboard/petugas/riwayat')}
          >
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

            {error && (
              <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>
            )}
            {loading ? (
              <div>Memuat...</div>
            ) : orders.length === 0 ? (
              <div>Tidak ada pemesanan tersedia</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-name">{order.jenis_service?.nama_service || order.jenisService?.nama_service || 'Layanan'}</h3>
                      <p className="order-service">Preferensi Gender: {order.preferred_gender === 'any' ? 'Bebas' : (order.preferred_gender === 'male' ? 'Laki-laki' : 'Perempuan')}</p>
                    </div>
                    <span className="order-status">{order.status}</span>
                  </div>

                  <div className="order-details">
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span>{(() => {
                        try {
                          const d = new Date(order.service_date);
                          if (isNaN(d)) return order.service_date || '-';
                          const y = d.getFullYear();
                          const m = String(d.getMonth() + 1).padStart(2, '0');
                          const day = String(d.getDate()).padStart(2, '0');
                          return `${y}-${m}-${day}`;
                        } catch { return order.service_date || '-'; }
                      })()}</span>
                    </div>
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span>{(() => {
                        if (!order.service_time) return '-';
                        try {
                          const start = new Date(`${order.service_date}T${order.service_time}`);
                          if (isNaN(start)) return order.service_time;
                          const end = new Date(start.getTime() + (Number(order.duration || 0) * 60 * 60 * 1000));
                          const fmt = (t) => `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
                          return `${fmt(start)} - ${fmt(end)}`;
                        } catch { return order.service_time; }
                      })()}</span>
                    </div>
                    <div className="detail-item">
                      <span style={{ fontWeight: 600, marginRight: 6 }}>Durasi</span>
                      <span>{(order.duration ?? 0) > 0 ? `${order.duration} jam` : '-'}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span>{order.alamat}</span>
                    </div>
                    <div className="detail-item">
                      <span style={{ fontWeight: 600, marginRight: 6 }}>Jumlah Petugas</span>
                      <span>{order.people_count || 1}</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button className="btn btn-reject" disabled={actionLoading === order.id} onClick={() => rejectOrder(order.id)}>
                      <X className="btn-icon" />
                      Tolak
                    </button>
                    <button className="btn btn-accept" disabled={actionLoading === order.id} onClick={() => acceptOrder(order.id)}>
                      <Check className="btn-icon" />
                      Terima
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}