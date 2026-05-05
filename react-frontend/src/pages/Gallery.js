import React, { useEffect, useState, useCallback } from 'react';
import api, { media } from '../services/api';
import Spinner from '../components/Spinner';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    api.get('/gallery').then((r) => setItems(r.data || [])).finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => setOpen(-1), []);
  const next = useCallback((delta) => setOpen((i) => (i + delta + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') next(-1);
      if (e.key === 'ArrowRight') next(1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, next]);

  if (loading) return <Spinner />;

  return (
    <section className="section">
      <div className="container">
        <h1>Gallery</h1>
        {items.length === 0 && <div className="empty">No photos yet.</div>}
        <div className="grid cards-4">
          {items.map((g, i) => (
            <button key={g.id} onClick={() => setOpen(i)} style={{ border: 'none', padding: 0, background: 'none' }}>
              <img src={media(g.image)} alt="" style={{ borderRadius: 10, height: 200, width: '100%', objectFit: 'cover', cursor: 'zoom-in' }} onError={(e) => (e.target.style.background = '#e5e7eb')} />
            </button>
          ))}
        </div>
        {open >= 0 && (
          <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); next(-1); }} style={{ position: 'absolute', left: 20, fontSize: 32, color: 'white', background: 'none', border: 'none' }} aria-label="Previous">‹</button>
            <img src={media(items[open].image)} alt="" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: 8 }} />
            <button onClick={(e) => { e.stopPropagation(); next(1); }} style={{ position: 'absolute', right: 20, fontSize: 32, color: 'white', background: 'none', border: 'none' }} aria-label="Next">›</button>
            <button onClick={close} style={{ position: 'absolute', top: 20, right: 20, color: 'white', background: 'none', border: 'none', fontSize: 28 }} aria-label="Close">×</button>
          </div>
        )}
      </div>
    </section>
  );
}
