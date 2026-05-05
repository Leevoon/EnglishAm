import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: '', last_name: '', username: '', email: '',
    password: '', confirm: '', gender: 1, agree: false,
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setErr('Passwords do not match');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters');
    if (!form.agree) return setErr('You must accept the terms');
    setBusy(true);
    setErr('');
    try {
      await register({
        username: form.username, email: form.email, password: form.password,
        first_name: form.first_name, last_name: form.last_name, gender: parseInt(form.gender, 10),
      });
      navigate('/account');
    } catch (ex) {
      setErr((ex.response && ex.response.data && ex.response.data.error) || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 540, padding: '40px 20px' }}>
      <h1>Create your account</h1>
      <p className="muted">Free forever. Upgrade any time.</p>
      {err && <div className="alert error">{err}</div>}
      <form className="form" onSubmit={onSubmit}>
        <div className="row">
          <div className="field"><label>First name</label><input value={form.first_name} onChange={set('first_name')} /></div>
          <div className="field"><label>Last name</label><input value={form.last_name} onChange={set('last_name')} /></div>
        </div>
        <div className="field"><label>Username</label><input value={form.username} onChange={set('username')} required autoComplete="username" /></div>
        <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></div>
        <div className="row">
          <div className="field"><label>Password</label><input type="password" value={form.password} onChange={set('password')} required autoComplete="new-password" /></div>
          <div className="field"><label>Confirm password</label><input type="password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password" /></div>
        </div>
        <div className="field">
          <label>Gender</label>
          <div className="flex">
            <label><input type="radio" name="gender" value={1} checked={Number(form.gender) === 1} onChange={set('gender')} /> Male</label>
            <label><input type="radio" name="gender" value={2} checked={Number(form.gender) === 2} onChange={set('gender')} /> Female</label>
          </div>
        </div>
        <label className="flex"><input type="checkbox" checked={form.agree} onChange={set('agree')} /> I agree to the <Link to="/static/terms">Terms</Link> and <Link to="/static/privacy">Privacy Policy</Link></label>
        <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Create Account'}</button>
      </form>
      <p className="muted mt">Already have an account? <Link to="/login">Sign in</Link>.</p>
    </div>
  );
}
