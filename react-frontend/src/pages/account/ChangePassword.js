import React, { useState } from 'react';
import api from '../../services/api';

export default function ChangePassword() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setOk(false);
    if (form.new_password !== form.confirm) return setErr('New passwords do not match');
    if (form.new_password.length < 6) return setErr('Password must be at least 6 characters');
    setBusy(true);
    try {
      await api.post('/auth/change-password', { current_password: form.current_password, new_password: form.new_password });
      setOk(true);
      setForm({ current_password: '', new_password: '', confirm: '' });
    } catch (e) {
      setErr((e.response && e.response.data && e.response.data.error) || 'Could not change password');
    } finally { setBusy(false); }
  };

  return (
    <>
      <h1>Change password</h1>
      {err && <div className="alert error">{err}</div>}
      {ok && <div className="alert success">Password updated.</div>}
      <form className="form" onSubmit={submit}>
        <div className="field"><label>Current password</label><input type="password" value={form.current_password} onChange={set('current_password')} required /></div>
        <div className="field"><label>New password</label><input type="password" value={form.new_password} onChange={set('new_password')} required /></div>
        <div className="field"><label>Confirm new password</label><input type="password" value={form.confirm} onChange={set('confirm')} required /></div>
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
      </form>
    </>
  );
}
