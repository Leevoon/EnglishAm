import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, guest } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const loc = useLocation();
  const from = (loc.state && loc.state.from) || '/account';
  const initialMsg = loc.state && loc.state.msg;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (e) {
      setErr((e.response && e.response.data && e.response.data.error) || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const onGuest = async () => {
    setBusy(true);
    try {
      await guest();
      navigate('/');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 440, padding: '50px 20px' }}>
      <h1>Sign in</h1>
      <p className="muted">Welcome back to english.am.</p>
      {initialMsg && <div className="alert info">{initialMsg}</div>}
      {err && <div className="alert error">{err}</div>}
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label>Email or username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
        <button type="button" className="btn outline" onClick={onGuest} disabled={busy}>Sign in as Guest</button>
      </form>
      <p className="muted mt">Don't have an account? <Link to="/register">Create one</Link>.</p>
      <p className="muted">Demo account: <code>demo / demo</code></p>
    </div>
  );
}
