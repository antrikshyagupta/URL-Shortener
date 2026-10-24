const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || 'Something went wrong';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // URLs
  shortenUrl: ({ originalUrl, customAlias, expiresAt }, token) =>
    request('/urls/shorten', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        originalUrl,
        ...(customAlias ? { customAlias } : {}),
        ...(expiresAt ? { expiresAt } : {}),
      }),
    }),

  getUrls: (page = 1, limit = 10, token) =>
    request(`/urls?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),

  getUrlStats: (shortCode, token) =>
    request(`/urls/${shortCode}/stats`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateUrl: (shortCode, { originalUrl, expiresAt }, token) =>
    request(`/urls/${shortCode}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...(originalUrl !== undefined ? { originalUrl } : {}),
        ...(expiresAt !== undefined ? { expiresAt } : {}),
      }),
    }),

  deleteUrl: (shortCode, token) =>
    request(`/urls/${shortCode}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
