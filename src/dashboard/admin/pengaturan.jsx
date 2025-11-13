import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/api/auth.api';
import './PengaturanAdmin.css';

export default function PengaturanAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [tanggal, setTanggal] = useState('');
  const [status, setStatus] = useState('tersedia');
  const [waktuMulai, setWaktuMulai] = useState('');
  const [waktuSelesai, setWaktuSelesai] = useState('');

  const [pilihService, setPilihService] = useState('');
  const [harga, setHarga] = useState('');
  const [minOrder, setMinOrder] = useState('');

  const [kecamatan, setKecamatan] = useState('');
  const [radius, setRadius] = useState('');

  // Services list
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }
    loadServices();
  }, [navigate]);

  async function loadServices() {
    try {
      setLoadingServices(true);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data.data) ? data.data : []);
      }
    } catch (e) {
      console.error('Gagal memuat services:', e);
    } finally {
      setLoadingServices(false);
    }
  }

  async function handleJadwalSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!tanggal || !waktuMulai || !waktuSelesai) {
      setError('Semua field jadwal wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      
      const res = await fetch(`${base}/api/admin/jadwal-ketersediaan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          tanggal,
          status,
          waktu_mulai: waktuMulai,
          waktu_selesai: waktuSelesai
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Gagal menyimpan jadwal');
      }

      setSuccess('Jadwal berhasil disimpan');
      setTanggal('');
      setWaktuMulai('');
      setWaktuSelesai('');
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  async function handleLayananSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!pilihService || !harga || !minOrder) {
      setError('Semua field layanan wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      
      const res = await fetch(`${base}/api/admin/setup-layanan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          service_id: pilihService,
          harga: parseInt(harga),
          min_order: parseInt(minOrder)
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Gagal menyimpan layanan');
      }

      setSuccess('Layanan berhasil disimpan');
      setPilihService('');
      setHarga('');
      setMinOrder('');
    } catch (e) {
      setError(e.message || 'Gagal melakukan aksi');
    } finally {
      setLoading(false);
    }
  }

  async function handleServiceAreaSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!kecamatan || !radius) {
      setError('Semua field service area wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      
      const res = await fetch(`${base}/api/admin/service-area`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          kecamatan,
          radius: parseInt(radius)
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Gagal menyimpan service area');
      }

      setSuccess('Service area berhasil disimpan');
      setKecamatan('');
      setRadius('');
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo-circle">
            <img src="/img/neatworklogo.png" alt="logo" className="logo-image" />
          </div>
        </div>

        <nav className="nav-menu">
          <button className="nav-item" onClick={() => navigate('/dashboard/admin')}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button className="nav-item" onClick={() => navigate('/dashboard/admin/verifikasi')}>
            <span className="nav-icon">🧑‍💼</span>
            <span className="nav-label">Verifikasi Petugas</span>
          </button>

          <button className="nav-item nav-item-active" onClick={() => navigate('/dashboard/admin/pengaturan')}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Pengaturan</span>
          </button>
        </nav>

        <button className="nav-item logout-btn" onClick={async () => { await logout(); navigate('/auth/login', { replace: true }); }}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Keluar</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-card">
          <div className="header-section">
            <h1 className="main-title">Pengaturan</h1>
            <div className="header-icons">
              <button className="icon-button" onClick={() => navigate('/dashboard/admin')}>
                <span className="home-icon">🏠</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* Forms Grid */}
          <div className="forms-grid">
            
            {/* Jadwal Ketersediaan */}
            <div className="form-card">
              <h2 className="form-title">Buat Jadwal Ketersediaan</h2>

              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="tidak_tersedia">Tidak Tersedia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Waktu Mulai</label>
                  <input
                    type="time"
                    value={waktuMulai}
                    onChange={(e) => setWaktuMulai(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Waktu Selesai</label>
                  <input
                    type="time"
                    value={waktuSelesai}
                    onChange={(e) => setWaktuSelesai(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button 
                  type="button"
                  onClick={handleJadwalSubmit}
                  className="btn btn-accept btn-full"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>

            {/* Set Up Layanan */}
            <div className="form-card">
              <h2 className="form-title">Set Up Layanan</h2>

              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">Pilih Service</label>
                  <select
                    value={pilihService}
                    onChange={(e) => setPilihService(e.target.value)}
                    className="form-select"
                    disabled={loadingServices}
                  >
                    <option value="">
                      {loadingServices ? 'Memuat...' : 'Pilih layanan'}
                    </option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Set Harga (Rp)</label>
                  <input
                    type="number"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="50000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Set Min Order (Rp)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="35000"
                    className="form-input"
                  />
                </div>

                <button 
                  type="button"
                  onClick={handleLayananSubmit}
                  className="btn btn-accept btn-full"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>

            {/* Set Service Area */}
            <div className="form-card">
              <h2 className="form-title">Set Service Area</h2>

              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">Kecamatan/Kota</label>
                  <input
                    type="text"
                    value={kecamatan}
                    onChange={(e) => setKecamatan(e.target.value)}
                    placeholder="Jakarta Timur"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Radius Coverage (km)</label>
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    placeholder="6"
                    className="form-input"
                  />
                </div>

                <button 
                  type="button"
                  onClick={handleServiceAreaSubmit}
                  className="btn btn-accept btn-full"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}