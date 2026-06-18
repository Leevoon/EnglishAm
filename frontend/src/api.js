// Single source of truth for talking to the Django API.
//
// Auth: session cookies (no localStorage / no Authorization header). The
// browser carries `sessionid` and `csrftoken` automatically when we set
// `credentials: 'include'`. For state-changing requests we read csrftoken
// from cookie and echo it back as X-CSRFToken — Django's middleware checks it.
//
// Backend host: VITE_API_BASE_URL at build time. Empty = same-origin (works
// in dev through Vite's `/api` proxy, and in compose through nginx's
// `/api` location block). Set to e.g. `https://api.example.com` when the
// frontend is served from a different origin than the backend — in that
// case the backend MUST add the frontend's origin to DJANGO_CORS_ALLOWED_ORIGINS
// and DJANGO_CSRF_TRUSTED_ORIGINS.

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path}`;
}

function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

const UNSAFE = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function apiFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  if (options.body && !headers.has('Content-Type') && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  if (UNSAFE.has(method)) {
    const csrf = getCookie('csrftoken');
    if (csrf) headers.set('X-CSRFToken', csrf);
  }

  const res = await fetch(buildUrl(url), {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  // Surface auth failures globally — the AuthProvider listens for this.
  if (res.status === 401 || res.status === 403) {
    window.dispatchEvent(new CustomEvent('api:unauthenticated'));
  }
  return res;
}

export async function apiJson(url, options = {}) {
  const res = await apiFetch(url, options);
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch { /* ignore */ }
    const err = new Error(body?.detail || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}
