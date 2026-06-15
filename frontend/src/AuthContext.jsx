import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch, apiJson } from './api';

const AuthContext = createContext({
  user: null, loading: true, login: async () => {}, logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await apiJson('/api/auth/whoami/');
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Any 401/403 from anywhere in the app → drop user state and reveal login.
  useEffect(() => {
    const onUnauth = () => setUser(null);
    window.addEventListener('api:unauthenticated', onUnauth);
    return () => window.removeEventListener('api:unauthenticated', onUnauth);
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await apiFetch('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try { detail = (await res.json()).detail || detail; } catch { /* ignore */ }
      throw new Error(detail);
    }
    await refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await apiFetch('/api/auth/logout/', { method: 'POST' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
