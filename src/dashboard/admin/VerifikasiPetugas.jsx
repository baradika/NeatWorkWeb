import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/api/auth.api';
import '../petugas/petugas.css';

export default function VerifikasiPetugas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [targetProfileId, setTargetProfileId] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }
    load();
  }, [navigate]);

  async function load(status = 'pending') {
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/admin/petugas-profiles?status=${encodeURIComponent(status)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      if (!res.ok) {
        throw new Error('Gagal memuat data pengajuan');
      }
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : [];
      console.debug('Loaded profiles:', list);
      console.debug('Derived IDs:', list.map(p => ({ rawId: p?.id_petugas_profile, derived: getProfileId(p), name: p?.full_name })));
      setProfiles(list);
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  function getProfileId(p) {
    return p?.id_petugas_profile ?? p?.id ?? p?.profile_id ?? p?._id ?? null;
  }

  function fileUrl(path) {
    if (!path) return '';
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
    return `${base}/storage/${path}`;
  }

  async function approve(id) {
    console.debug('approve clicked with id:', id);
    if (!id && id !== 0) {
      setError('ID profil tidak valid. Coba muat ulang halaman.');
      return;
    }
    try {
      setActionLoading(id);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/admin/petugas-profiles/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      if (!res.ok) throw new Error('Gagal menyetujui profil');
      await load('pending');
    } catch (e) {
      setError(e.message || 'Gagal melakukan aksi');
    } finally {
      setActionLoading(null);
    }
  }

  async function reject(id, reason) {
    console.debug('reject clicked with id/reason:', id, reason);
    if (!id && id !== 0) {
      setError('ID profil tidak valid. Coba muat ulang halaman.');
      return;
    }
    try {
      setActionLoading(id);
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${base}/api/admin/petugas-profiles/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ rejection_reason: reason })
      });
      if (!res.ok) throw new Error('Gagal menolak profil');
      await load('pending');
    } catch (e) {
      setError(e.message || 'Gagal melakukan aksi');
    } finally {
      setActionLoading(null);
    }
  }

  function openRejectModal(id) {
    console.debug('openRejectModal id:', id);
    if (id === null || id === undefined) {
      setError('ID profil tidak ditemukan. Muat ulang halaman lalu coba lagi.');
      return;
    }
    setTargetProfileId(id);
    setRejectReason('');
    setShowRejectModal(true);
  }

  function openApproveModal(id) {
    console.debug('openApproveModal id:', id);
    if (id === null || id === undefined) {
      setError('ID profil tidak ditemukan. Muat ulang halaman lalu coba lagi.');
      return;
    }
    setTargetProfileId(id);
    setShowApproveModal(true);
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
          <button className="nav-item" onClick={() => navigate('/dashboard/admin')}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button className="nav-item nav-item-active" onClick={() => navigate('/dashboard/admin/verifikasi')}>
            <span className="nav-icon">🧑‍💼</span>
            <span className="nav-label">Verifikasi Petugas</span>
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

      {/* Inline modal styles to ensure visibility without external CSS */}
      <style>{`
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-card { background: #fff; padding: 16px; border-radius: 12px; width: 100%; max-width: 520px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
      `}</style>
      <div className="main-content" style={{ width: '100%' }}>
        <div className="content-card">
          <div className="header-section">
            <h1 className="main-title">Verifikasi Petugas</h1>
            <div>
              <button type="button" className="btn" onClick={() => load('pending')}>Pending</button>
              <button type="button" className="btn" onClick={() => load('approved')} style={{ marginLeft: 8 }}>Approved</button>
              <button type="button" className="btn" onClick={() => load('rejected')} style={{ marginLeft: 8 }}>Rejected</button>
            </div>
          </div>

          {error && (
            <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>
          )}

          {loading ? (
            <div>Memuat...</div>
          ) : profiles.length === 0 ? (
            <div>Tidak ada data</div>
          ) : (
            <div className="orders-section">
              {profiles.map((p, idx) => (
                <div key={getProfileId(p) ?? `profile-${idx}-${p.ktp_number ?? 'unknown'}`} className="order-card" style={{ padding: 16 }}>
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-name">{p.full_name} ({p.user?.email})</h3>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>ID: {getProfileId(p) ?? 'tidak tersedia'}</div>
                      <p className="order-service">Status: {p.status}</p>
                    </div>
                    <span className="order-status">{new Date(p.created_at).toLocaleString()}</span>
                  </div>

                  <div className="order-details" style={{ gap: 16, flexWrap: 'wrap' }}>
                    <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600 }}>Nomor KTP</span>
                      <span>{p.ktp_number}</span>
                    </div>
                    <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600 }}>Tanggal Lahir</span>
                      <span>{p.date_of_birth}</span>
                    </div>
                    <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600 }}>No. Telepon</span>
                      <span>{p.phone_number}</span>
                    </div>
                    <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', maxWidth: 420 }}>
                      <span style={{ fontWeight: 600 }}>Alamat</span>
                      <span>{p.address}</span>
                    </div>
                  </div>

                  <div className="order-details" style={{ gap: 24 }}>
                    <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600, marginBottom: 8 }}>Foto KTP</span>
                      <a href={fileUrl(p.ktp_photo_path)} target="_blank" rel="noreferrer">
                        <img src={fileUrl(p.ktp_photo_path)} alt="KTP" style={{ width: 220, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                      </a>
                    </div>
                    <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600, marginBottom: 8 }}>Selfie + KTP</span>
                      <a href={fileUrl(p.selfie_with_ktp_path)} target="_blank" rel="noreferrer">
                        <img src={fileUrl(p.selfie_with_ktp_path)} alt="Selfie KTP" style={{ width: 220, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                      </a>
                    </div>
                  </div>

                  <div className="order-actions">
                    {p.status === 'pending' ? (
                      <>
                        <button type="button" className="btn btn-reject" onClick={() => openRejectModal(getProfileId(p))} disabled={actionLoading === getProfileId(p)}>
                          Tolak
                        </button>
                        <button type="button" className="btn btn-accept" onClick={() => openApproveModal(getProfileId(p))} disabled={actionLoading === getProfileId(p)}>
                          Terima
                        </button>
                      </>
                    ) : p.status === 'rejected' ? (
                      <div>Alasan penolakan: {p.rejection_reason}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 style={{ marginTop: 0 }}>Tolak Pengajuan</h3>
            <p>Berikan alasan penolakan agar petugas dapat memperbaiki pengajuan.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Tuliskan alasan penolakan..."
              style={{ width: '100%', minHeight: 100, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
              <button type="button" className="btn" onClick={() => { setShowRejectModal(false); setRejectReason(''); setTargetProfileId(null); }}>
                Batal
              </button>
              <button
                className="btn btn-reject"
                onClick={() => {
                  if (!rejectReason.trim()) {
                    setError('Alasan penolakan wajib diisi');
                    return;
                  }
                  const id = targetProfileId;
                  setShowRejectModal(false);
                  reject(id, rejectReason.trim());
                }}
                disabled={actionLoading === targetProfileId}
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 style={{ marginTop: 0 }}>Setujui Pengajuan</h3>
            <p>Pastikan dokumen sesuai. Lanjutkan untuk menyetujui pengajuan ini?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
              <button type="button" className="btn" onClick={() => { setShowApproveModal(false); setTargetProfileId(null); }}>
                Batal
              </button>
              <button
                className="btn btn-accept"
                onClick={() => {
                  const id = targetProfileId;
                  setShowApproveModal(false);
                  approve(id);
                }}
                disabled={actionLoading === targetProfileId}
              >
                Konfirmasi Terima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
