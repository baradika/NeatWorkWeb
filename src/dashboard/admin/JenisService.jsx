import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/api/auth.api';
import { listJenisService, createJenisService, updateJenisService, deleteJenisService } from '../../services/api/jenisService.api';
import '../petugas/petugas.css';

export default function JenisServiceAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ id: null, kode_service: '', nama_service: '', deskripsi: '', harga: '', estimasi_waktu: '', image_url: '' });
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const data = await listJenisService();
      const arr = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setItems(arr);
    } catch (e) {
      setError(e?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        kode_service: form.kode_service,
        nama_service: form.nama_service,
        deskripsi: form.deskripsi || null,
        harga: Number(form.harga || 0),
        estimasi_waktu: Number(form.estimasi_waktu || 0),
        image_url: form.image_url || null,
      };
      if (form.id) {
        await updateJenisService(form.id, payload);
      } else {
        await createJenisService(payload);
      }
      setForm({ id: null, kode_service: '', nama_service: '', deskripsi: '', harga: '', estimasi_waktu: '', image_url: '' });
      await refresh();
    } catch (e) {
      setError(e?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      kode_service: item.kode_service || '',
      nama_service: item.nama_service || '',
      deskripsi: item.deskripsi || '',
      harga: item.harga ?? '',
      estimasi_waktu: item.estimasi_waktu ?? '',
      image_url: item.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus data ini?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteJenisService(id);
      await refresh();
    } catch (e) {
      setError(e?.message || 'Gagal menghapus');
    } finally {
      setLoading(false);
    }
  };

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
            className={`nav-item ${isActive('/dashboard/admin') ? 'nav-item-active' : ''}`}
            onClick={() => navigate('/dashboard/admin')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button
            className={`nav-item ${isActive('/dashboard/admin/jenis-service') ? 'nav-item-active' : ''}`}
            onClick={() => navigate('/dashboard/admin/jenis-service')}
          >
            <span className="nav-icon">🧰</span>
            <span className="nav-label">Jenis Service</span>
          </button>

          <button
            className={`nav-item ${isActive('/dashboard/admin/verifikasi') ? 'nav-item-active' : ''}`}
            onClick={() => navigate('/dashboard/admin/verifikasi')}
          >
            <span className="nav-icon">🧑‍💼</span>
            <span className="nav-label">Verifikasi Petugas</span>
          </button>

          <button
            className={`nav-item ${isActive('/dashboard/admin/pengaturan') ? 'nav-item-active' : ''}`}
            onClick={() => navigate('/dashboard/admin/pengaturan')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Pengaturan</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button
          className="nav-item logout-btn"
          onClick={async () => {
            await logout();
            navigate('/auth/login', { replace: true });
          }}
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Keluar</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-card">
          <div className="header-section">
            <h1 className="main-title">CRUD Jenis Service</h1>
          </div>

          {error && <div className="order-card" style={{ borderColor: '#fca5a5', color: '#b91c1c' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="order-card" style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Kode</label>
                <input value={form.kode_service} onChange={(e)=>setForm({...form, kode_service: e.target.value})} required />
              </div>
              <div>
                <label>Nama</label>
                <input value={form.nama_service} onChange={(e)=>setForm({...form, nama_service: e.target.value})} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Deskripsi</label>
                <textarea value={form.deskripsi} onChange={(e)=>setForm({...form, deskripsi: e.target.value})} rows={3} />
              </div>
              <div>
                <label>Harga</label>
                <input type="number" value={form.harga} onChange={(e)=>setForm({...form, harga: e.target.value})} required />
              </div>
              <div>
                <label>Estimasi Waktu (jam)</label>
                <input type="number" value={form.estimasi_waktu} onChange={(e)=>setForm({...form, estimasi_waktu: e.target.value})} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Image URL</label>
                <input placeholder="https://..." value={form.image_url} onChange={(e)=>setForm({...form, image_url: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-accept" type="submit" disabled={loading}>{form.id ? 'Update' : 'Create'}</button>
              {form.id && (
                <button type="button" className="btn btn-reject" onClick={()=>setForm({ id: null, kode_service: '', nama_service: '', deskripsi: '', harga: '', estimasi_waktu: '', image_url: '' })}>
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="orders-section">
            <div className="order-card">
              <div className="orders-header">
                <h2 className="section-title">Data Jenis Service</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
                      <th style={{ textAlign: 'left', padding: 12 }}>Kode</th>
                      <th style={{ textAlign: 'left', padding: 12 }}>Nama</th>
                      <th style={{ textAlign: 'left', padding: 12 }}>Harga</th>
                      <th style={{ textAlign: 'left', padding: 12 }}>Estimasi</th>
                      <th style={{ textAlign: 'left', padding: 12 }}>Gambar</th>
                      <th style={{ textAlign: 'left', padding: 12 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it)=> (
                      <tr key={it.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: 12 }}>{it.id}</td>
                        <td style={{ padding: 12 }}>{it.kode_service}</td>
                        <td style={{ padding: 12 }}>{it.nama_service}</td>
                        <td style={{ padding: 12 }}>{Number(it.harga).toLocaleString('id-ID')}</td>
                        <td style={{ padding: 12 }}>{it.estimasi_waktu} jam</td>
                        <td style={{ padding: 12 }}>{it.image_url ? <img src={it.image_url} alt={it.nama_service} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} /> : '-'}</td>
                        <td style={{ padding: 12 }}>
                          <div className="table-actions" style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-accept" onClick={()=>handleEdit(it)}>Edit</button>
                            <button className="btn btn-reject" onClick={()=>handleDelete(it.id)}>Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!items?.length && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: 16 }}>{loading ? 'Memuat...' : 'Belum ada data'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
