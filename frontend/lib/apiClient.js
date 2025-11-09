const API_BASE_URL = ("http://localhost:8080" || '').replace(/\/$/, '');

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    return path;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function apiFetch(path, { method = 'GET', headers = {}, body, ...restOptions } = {}) {
  const url = buildUrl(path);

  const response = await fetch(url, {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body,
    ...restOptions,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const error = new Error(payload?.message || `API request failed with status ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const fetchCategories = () => apiFetch('/categories');

export const calculateCardList = (payload) =>
  apiFetch('/calculate-list', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchCardById = (cardId) => apiFetch(`/cards/${cardId}`);

export const trackAnalyticsEvent = (payload) =>
  apiFetch('/analytics', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

