import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

export default function Profile() {
  const [u, setU] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/account/profile').then((r) => { setU(r.data); setForm(r.data); }).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  if (!u) return <div className="empty">Could not load profile.</div>;

  const save = async () => {
    setErr(''); setSaved(false);
    try {
      const { data } = await api.put('/account/profile', form);
      setU(data); setForm(data); setEdit(false); setSaved(true);
    } catch (e) {
      setErr((e.response && e.response.data && e.response.data.error) || 'Could not save');
    }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <h1>My Profile</h1>
      {saved && <div className="alert success">Profile updated.</div>}
      {err && <div className="alert error">{err}</div>}
      {!edit ? (
        <>
          <div className="card">
            <p><strong>Username:</strong> {u.user_name}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>First name:</strong> {u.first_name || '—'}</p>
            <p><strong>Last name:</strong> {u.last_name || '—'}</p>
            <p><strong>Phone:</strong> {u.phone || '—'}</p>
            <p><strong>Address:</strong> {u.address || '—'}</p>
          </div>
          <button className="btn mt" onClick={() => setEdit(true)}>Edit profile</button>
        </>
      ) : (
        <form className="form" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <div className="row">
            <div className="field"><label>First name</label><input value={form.first_name || ''} onChange={set('first_name')} /></div>
            <div className="field"><label>Last name</label><input value={form.last_name || ''} onChange={set('last_name')} /></div>
          </div>
          <div className="row">
            <div className="field"><label>Phone</label><input value={form.phone || ''} onChange={set('phone')} /></div>
            <div className="field"><label>Address</label><input value={form.address || ''} onChange={set('address')} /></div>
          </div>
          <div className="flex"><button className="btn">Save</button><button type="button" className="btn outline" onClick={() => { setEdit(false); setForm(u); }}>Cancel</button></div>
        </form>
      )}
    </>
  );
}
