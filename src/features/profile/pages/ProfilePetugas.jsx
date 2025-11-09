import React from 'react';
import { Link } from 'react-router-dom';
import './ProfilePetugas.css';

const ProfilePetugas = () => {
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

      <form className="profile-form">
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
                  <input type="file" accept="image/png,image/jpeg" />
                  <div className="upload-inner">
                    <div className="upload-icon" aria-hidden>⬆️</div>
                    <div className="upload-text">
                      <strong>Upload Foto KTP</strong>
                      <span>PNG, JPG (Max. 5MB)</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className="field file-uploader dashed">
                <label className="required">Selfie dengan KTP</label>
                <label className="upload-box">
                  <input type="file" accept="image/png,image/jpeg" />
                  <div className="upload-inner">
                    <div className="upload-icon" aria-hidden>📷</div>
                    <div className="upload-text">
                      <strong>Upload Selfie + KTP</strong>
                      <span>PNG, JPG (Max. 5MB)</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className="field">
                <label className="required" htmlFor="nik">Nomor KTP</label>
                <input id="nik" type="text" placeholder="Masukkan 16 Digit Nomor KTP" maxLength={16} />
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
                <label className="required" htmlFor="nama">Nama Lengkap</label>
                <input id="nama" type="text" placeholder="Sesuai KTP" />
              </div>
              <div className="field">
                <label className="required" htmlFor="dob">Tanggal Lahir</label>
                <input id="dob" type="date" placeholder="dd/mm/yyyy" />
              </div>
              <div className="field">
                <label className="required" htmlFor="telp">No. Telepon</label>
                <input id="telp" type="tel" placeholder="08XXXXXXXXXX" />
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
                <label className="required" htmlFor="alamat">Alamat Lengkap</label>
                <textarea id="alamat" rows={4} placeholder="Jalan, No rumah, RT/RW dll" />
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
          <Link to="/login" className="btn btn-light">Batal</Link>
          <button type="submit" className="btn btn-primary">Simpan Profile</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePetugas;
