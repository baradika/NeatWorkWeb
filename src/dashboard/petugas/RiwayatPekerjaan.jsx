import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/api/auth.api';
import { Bell, User, Star, Calendar, Clock, MapPin } from 'lucide-react';
import './petugas.css';

export default function RiwayatPetugas() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [data, setData] = useState({ incoming: [], in_progress: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star-icon ${index < rating ? 'star-filled' : 'star-empty'}`}
        size={16}
      />
    ));
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${base}/api/petugas/my-bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        const isJson = (res.headers.get('content-type') || '').includes('application/json');
        const json = isJson ? await res.json().catch(() => ({})) : {};
        if (!res.ok) throw new Error(json?.message || 'Gagal memuat data');
        const payload = json?.data || {};
        setData({
          incoming: Array.isArray(payload.incoming) ? payload.incoming : [],
          in_progress: Array.isArray(payload.in_progress) ? payload.in_progress : [],
          completed: Array.isArray(payload.completed) ? payload.completed : []
        });
      } catch (e) {
        setError(e.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function startJob(id) {
    try {
      setActionLoading(id);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/petugas/bookings/${id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const data = isJson ? await res.json().catch(() => ({})) : {};
      if (!res.ok) throw new Error(data?.message || 'Gagal memulai pekerjaan');
      // Pindahkan item dari incoming ke in_progress
      setData(prev => {
        const incoming = prev.incoming.filter(o => o.id !== id);
        const moved = prev.incoming.find(o => o.id === id);
        const in_progress = moved ? [moved, ...prev.in_progress] : prev.in_progress;
        return { ...prev, incoming, in_progress };
      });
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setActionLoading(null);
    }
  }

  async function completeJob(id) {
    try {
      setActionLoading(id);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/petugas/bookings/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const data = isJson ? await res.json().catch(() => ({})) : {};
      if (!res.ok) throw new Error(data?.message || 'Gagal menyelesaikan pekerjaan');
      // Pindahkan item dari in_progress ke completed
      setData(prev => {
        const in_progress = prev.in_progress.filter(o => o.id !== id);
        const moved = prev.in_progress.find(o => o.id === id);
        const completed = moved ? [moved, ...prev.completed] : prev.completed;
        return { ...prev, in_progress, completed };
      });
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setActionLoading(null);
    }
  }

  const Section = ({ title, items, emptyText }) => (
    <div className="orders-section" style={{ marginTop: 16 }}>
      <div className="orders-header">
        <h2 className="section-title">{title}</h2>
      </div>
      {items.length === 0 ? (
        <div>{emptyText}</div>
      ) : (
        items.map((order) => (
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
                <span>{order.service_date}</span>
              </div>
              <div className="detail-item">
                <Clock className="detail-icon" />
                <span>{order.service_time || '-'}</span>
              </div>
              <div className="detail-item">
                <MapPin className="detail-icon" />
                <span>{order.alamat}</span>
              </div>
            </div>
            {title === 'Incoming' && (
              <div className="order-actions">
                <button className="btn btn-accept" disabled={actionLoading === order.id} onClick={() => startJob(order.id)}>Mulai</button>
              </div>
            )}
            {title === 'In Progress' && (
              <div className="order-actions">
                <button className="btn btn-accept" disabled={actionLoading === order.id} onClick={() => completeJob(order.id)}>Selesaikan</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

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
          
          <button className={`nav-item ${isActive('/dashboard/petugas/riwayat') ? 'nav-item-active' : ''}`}>
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

          {/* Sections */}
          {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
          {loading ? (
            <div>Memuat...</div>
          ) : (
            <>
              <Section title="Incoming" items={data.incoming} emptyText="Tidak ada pekerjaan mendatang" />
              <Section title="In Progress" items={data.in_progress} emptyText="Tidak ada pekerjaan yang sedang berjalan" />
              <Section title="Selesai" items={data.completed} emptyText="Belum ada pekerjaan selesai" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}