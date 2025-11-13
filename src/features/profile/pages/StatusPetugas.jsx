import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../../components/Alert';
import { logout } from '../../../services/api/auth.api';
import './ProfilePetugas.css';

const StatusPetugas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${base}/api/check-petugas-profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        if (!res.ok) {
          setError('Gagal memuat status profil petugas');
          return;
        }
        const data = await res.json();
        if (!data.has_profile) {
          navigate('/auth/profile-petugas', { replace: true });
          return;
        }
        setStatus(data.profile_status || (data.is_verified ? 'approved' : 'pending'));
        setReason(data.rejection_reason || '');
      } catch (_) {
        setError('Terjadi kesalahan saat memuat status');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  const handleProceed = () => {
    navigate('/dashboard/petugas', { replace: true });
  };

  const handleUpdateProfile = () => {
    navigate('/auth/profile-petugas');
  };1

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="brand">
          <img src="/img/neatworklogo.png" alt="NeatWork" />
        </div>
        <div className="titles">
          <h1>Status Verifikasi</h1>
          <p>Periksa status pengajuan profil petugas Anda</p>
        </div>
        <div className="avatar">
          <button
            className="btn"
            onClick={async () => {
              await logout();
              navigate('/auth/login', { replace: true });
            }}
          >
            Keluar
          </button>
        </div>
      </header>

      {error && <div style={{ maxWidth: 720, margin: '16px auto' }}><Alert type="error" message={error} onClose={() => setError('')} /></div>}

      <div className="profile-form" style={{ maxWidth: 720, margin: '0 auto' }}>
        {loading ? (
          <div>Memuat status...</div>
        ) : (
          <div className="section">
            <div className="section-title">
              <span className="icon" aria-hidden>📄</span>
              <h2>Hasil Verifikasi</h2>
            </div>
            <div className="grid one">
              {status === 'approved' && (
                <div className="field">
                  <div className="file-name" style={{ color: '#16a34a', fontWeight: 600 }}>Disetujui</div>
                  <button className="btn btn-primary" onClick={handleProceed}>Lanjut ke Dashboard Petugas</button>
                </div>
              )}
              {status === 'pending' && (
                <div className="field">
                  <div className="file-name" style={{ color: '#f59e0b', fontWeight: 600 }}>Menunggu Verifikasi</div>
                  <div>Pengajuan Anda sedang ditinjau oleh admin.</div>
                </div>
              )}
              {status === 'rejected' && (
                <div className="field">
                  <div className="file-name" style={{ color: '#dc2626', fontWeight: 600 }}>Ditolak</div>
                  {reason && <div>Alasan: {reason}</div>}
                  <button className="btn" onClick={handleUpdateProfile} style={{ marginTop: 12 }}>Perbarui Pengajuan</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPetugas;
