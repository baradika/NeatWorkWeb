import { http } from './httpClient';

export async function listJenisService(params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  const url = qs ? `/api/jenis-service?${qs}` : '/api/jenis-service';
  return await http.get(url);
}

export async function createJenisService(payload) {
  return await http.post('/api/jenis-service', payload);
}

export async function updateJenisService(id, payload) {
  return await http.put(`/api/jenis-service/${id}`, payload);
}

export async function deleteJenisService(id) {
  return await http.delete(`/api/jenis-service/${id}`);
}
