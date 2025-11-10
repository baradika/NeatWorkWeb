import { http } from './httpClient';
export async function login(email, password) {
  try {
    if (!email || !password) {
      throw { message: 'Email dan password wajib diisi' };
    }

    const response = await http.post('/api/auth/login', { email, password });
    if (response.data?.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
    throw { message: errorMessage, status: error.response?.status || 500 };
  }
}

export async function checkEmail(email) {
  if (!email) {
    throw new Error('Email is required');
  }
  const response = await http.post('/api/auth/check-email', { email });
  return response.data;
}

export async function registerPetugas({ email, password, password_confirmation }) {
  try {
    if (!email || !password || !password_confirmation) {
      throw { message: 'email, password, dan password_confirmation wajib diisi' };
    }
    
    const emailCheck = await checkEmail(email);
    if (emailCheck.exists) {
      throw { message: 'Email sudah terdaftar', status: 400 };
    }
    
    const payload = { email, password, password_confirmation, role: 'petugas' };
    const response = await http.post('/api/auth/register', payload);
    return response.data;
  } catch (error) {

    if (error.message) {
      throw error;
    }
    const errorMessage = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
    throw { message: errorMessage, status: error.response?.status || 500 };
  }
}
