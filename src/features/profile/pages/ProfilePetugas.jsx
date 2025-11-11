import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../../components/Alert';
import './ProfilePetugas.css';

const ProfilePetugas = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ktp_number: '',
    full_name: '',
    date_of_birth: '',
    phone_number: '',
    address: ''
  });
  const [files, setFiles] = useState({
    ktp_photo: null,
    selfie_with_ktp: null
  });
  const [fileNames, setFileNames] = useState({
    ktp_photo: '',
    selfie_with_ktp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const { id, files: selected } = e.target;
    const file = selected && selected[0] ? selected[0] : null;
    const key = id; // ids match keys: ktp_photo, selfie_with_ktp
    setFiles(prev => ({ ...prev, [key]: file }));
    setFileNames(prev => ({ ...prev, [key]: file ? file.name : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.ktp_number || !form.full_name || !form.date_of_birth || !form.phone_number || !form.address) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (!files.ktp_photo || !files.selfie_with_ktp) {
      setError('Foto KTP dan Selfie dengan KTP wajib diupload.');
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('access_token');
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      const fd = new FormData();
      fd.append('ktp_number', form.ktp_number);
      fd.append('ktp_photo', files.ktp_photo);
      fd.append('selfie_with_ktp', files.selfie_with_ktp);
      fd.append('full_name', form.full_name);
      fd.append('date_of_birth', form.date_of_birth);
      fd.append('phone_number', form.phone_number);
      fd.append('address', form.address);

      const res = await fetch(`${base}/api/form-profile-petugas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: fd
      });
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const data = isJson ? await res.json().catch(() => ({})) : {};
      if (!res.ok) {
        let msg = data?.message || 'Gagal mengirim profil petugas';
        if (data?.errors && typeof data.errors === 'object') {
          const firstKey = Object.keys(data.errors)[0];
          const firstMsg = Array.isArray(data.errors[firstKey]) ? data.errors[firstKey][0] : data.errors[firstKey];
          if (firstMsg) msg = firstMsg;
        }
        setError(msg);
        return;
      }
      setSuccess('Profil petugas berhasil diajukan. Menunggu verifikasi admin.');
      // Opsional: arahkan ke dashboard petugas setelah submit
      // navigate('/dashboard');
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim data.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="brand">
          <img src="/img/neatworklogo.png" alt="NeatWork" />
        </div>
        <div className="titles">
          <h1>Lengkapi Profile</h1>
          <p>Isi data diri Anda dengan lengkap dan benar</p>
        </div>
        <div className="avatar">
          <div className="avatar-circle" aria-hidden="true">👤</div>
        </div>
      </header>

      <form className="profile-form" onSubmit={handleSubmit}>
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
        <div className="form-grid three">
          {/* Kolom Kiri: Foto KTP, Selfie KTP, NIK */}
          <section className="section">
            <div className="section-title">
              <span className="icon" aria-hidden>🧾</span>
              <h2>Foto KTP dan Verifikasi</h2>
            </div>

            <div className="grid one">
              <div className="field file-uploader">
                <label className="required">Foto KTP</label>
                <label className="upload-box">
                  <input id="ktp_photo" name="ktp_photo" type="file" accept="image/png,image/jpeg" onChange={handleFileChange} />
                  <div className="upload-inner">
                    <div className="upload-icon" aria-hidden>⬆️</div>
                    <div className="upload-text">
                      <strong>Upload Foto KTP</strong>
                      <span>PNG, JPG (Max. 5MB)</span>
                    </div>
                  </div>
                </label>
                {fileNames.ktp_photo && <div className="file-name">Dipilih: {fileNames.ktp_photo}</div>}
              </div>

              <div className="field file-uploader dashed">
                <label className="required">Selfie dengan KTP</label>
                <label className="upload-box">
                  <input id="selfie_with_ktp" name="selfie_with_ktp" type="file" accept="image/png,image/jpeg" onChange={handleFileChange} />
                  <div className="upload-inner">
                    <div className="upload-icon" aria-hidden>📷</div>
                    <div className="upload-text">
                      <strong>Upload Selfie + KTP</strong>
                      <span>PNG, JPG (Max. 5MB)</span>
                    </div>
                  </div>
                </label>
                {fileNames.selfie_with_ktp && <div className="file-name">Dipilih: {fileNames.selfie_with_ktp}</div>}
              </div>

              <div className="field">
                <label className="required" htmlFor="ktp_number">Nomor KTP</label>
                <input id="ktp_number" type="text" placeholder="Masukkan 16 Digit Nomor KTP" maxLength={16} value={form.ktp_number} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          {/* Kolom Tengah: Data Pribadi */}
          <section className="section">
            <div className="section-title">
              <span className="icon" aria-hidden>🧑</span>
              <h2>Data Pribadi</h2>
            </div>

            <div className="grid one">
              <div className="field">
                <label className="required" htmlFor="full_name">Nama Lengkap</label>
                <input id="full_name" type="text" placeholder="Sesuai KTP" value={form.full_name} onChange={handleInputChange} />
              </div>
              <div className="field">
                <label className="required" htmlFor="date_of_birth">Tanggal Lahir</label>
                <input id="date_of_birth" type="date" placeholder="dd/mm/yyyy" value={form.date_of_birth} onChange={handleInputChange} />
              </div>
              <div className="field">
                <label className="required" htmlFor="phone_number">No. Telepon</label>
                <input id="phone_number" type="tel" placeholder="08XXXXXXXXXX" value={form.phone_number} onChange={handleInputChange} />
              </div>
              <div className="field">
                <label className="required" htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="email@example.com" />
              </div>
            </div>
          </section>

          {/* Kolom Kanan: Alamat, Bio, Pengalaman */}
          <section className="section">
            <div className="section-title">
              <span className="icon" aria-hidden>📍</span>
              <h2>Informasi Tambahan</h2>
            </div>

            <div className="grid one">
              <div className="field">
                <label className="required" htmlFor="address">Alamat Lengkap</label>
                <textarea id="address" rows={4} placeholder="Jalan, No rumah, RT/RW dll" value={form.address} onChange={handleInputChange} />
              </div>
              <div className="field">
                <label htmlFor="bio">Bio Singkat</label>
                <textarea id="bio" rows={4} placeholder="Ceritakan Tentang Diri Anda ..." />
              </div>
              <div className="field">
                <label htmlFor="pengalaman">Pengalaman Kerja/Pendidikan</label>
                <textarea id="pengalaman" rows={4} placeholder="Jelaskan Pengalaman Kerja atau Pendidikan Anda..." />
              </div>
            </div>
          </section>
        </div>

        <div className="actions">
          <Link to="/auth/login" className="btn btn-light">Batal</Link>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Profile'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePetugas;
