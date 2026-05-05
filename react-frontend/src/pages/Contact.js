import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get('/contact-info').then((r) => setInfo(r.data || {})).catch(() => {}); }, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', body: '' });
    } catch (ex) {
      setErr((ex.response && ex.response.data && ex.response.data.error) || 'Could not send message');
    } finally { setBusy(false); }
  };

  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 32 }}>
        <div>
          <h1>Contact us</h1>
          {sent && <div className="alert success">Thanks — we'll be in touch soon.</div>}
          {err && <div className="alert error">{err}</div>}
          <form className="form" onSubmit={onSubmit}>
            <div className="row">
              <div className="field"><label>Name</label><input value={form.name} onChange={set('name')} required /></div>
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set('email')} required /></div>
            </div>
            <div className="field"><label>Subject</label><input value={form.subject} onChange={set('subject')} /></div>
            <div className="field"><label>Message</label><textarea rows={6} value={form.body} onChange={set('body')} required /></div>
            <button className="btn" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
          </form>
        </div>
        <aside>
          <div className="card">
            <h3>Reach us</h3>
            <p className="muted">{info.email}</p>
            <p className="muted">{info.phone}</p>
            <p className="muted">{info.address}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
