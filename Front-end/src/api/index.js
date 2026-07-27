import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ── CSRF: lazily fetch a token and attach it to cookie-based writes ──────────
let csrfToken = null;
const MUTATING = ['post', 'put', 'patch', 'delete'];

// Endpoints the server does NOT CSRF-protect (pre-auth / token issuance).
const isCsrfExempt = (url = '') =>
  url.startsWith('/Login') || url.startsWith('/auth/') || url.startsWith('/csrf-token');

async function fetchCsrfToken() {
  const { data } = await api.get('/csrf-token', { _skipCsrf: true });
  csrfToken = data.csrfToken;
  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (config._skipCsrf || !MUTATING.includes(method) || isCsrfExempt(config.url)) {
    return config;
  }
  if (!csrfToken) await fetchCsrfToken();
  config.headers['x-csrf-token'] = csrfToken;
  return config;
});

// If the token is stale/rotated (e.g. right after login), refetch once and retry.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const cfg = error.config;
    const status = error.response?.status;
    const msg = error.response?.data?.message || '';
    const isCsrfError = status === 403 && /csrf/i.test(msg);
    if (isCsrfError && cfg && !cfg._csrfRetried) {
      cfg._csrfRetried = true;
      csrfToken = null;
      await fetchCsrfToken();
      cfg.headers['x-csrf-token'] = csrfToken;
      return api(cfg);
    }
    return Promise.reject(error);
  }
);

export default api;
