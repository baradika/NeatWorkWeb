import { http } from './httpClient';

// Register sebagai petugas
export async function registerPetugas({ email, password, password_confirmation }) {
  if (!email || !password || !password_confirmation) {
    throw new Error('email, password, dan password_confirmation wajib diisi');
  }
  const payload = { email, password, password_confirmation, role: 'petugas' };
  const data = await http.post('/api/auth/register', payload);
  return data;
}
