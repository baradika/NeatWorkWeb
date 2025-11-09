const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const url = `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message = isJson && data && (data.message || data.error) ? (data.message || data.error) : `Request failed with ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const http = {
  get: (path, opts) => request(path, { method: 'GET', ...(opts || {}) }),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...(opts || {}) }),
  put: (path, body, opts) => request(path, { method: 'PUT', body, ...(opts || {}) }),
  patch: (path, body, opts) => request(path, { method: 'PATCH', body, ...(opts || {}) }),
  delete: (path, opts) => request(path, { method: 'DELETE', ...(opts || {}) }),
};
