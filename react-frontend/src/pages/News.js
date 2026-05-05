import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { media } from '../services/api';
import Spinner from '../components/Spinner';
import { useLanguage } from '../contexts/LanguageContext';

export function NewsList() {
  const { languageId } = useLanguage();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    setLoading(true);
    api.get('/news', { params: { lang: languageId, page, limit } })
      .then((r) => { setItems(r.data.items || []); setTotal(r.data.total || 0); })
      .finally(() => setLoading(false));
  }, [languageId, page]);

  if (loading) return <Spinner />;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="section">
      <div className="container">
        <h1>News</h1>
        {items.length === 0 && <div className="empty">No news yet — check back soon.</div>}
        <div className="grid cards-3">
          {items.map((n) => (
            <Link key={n.id} to={`/news/${n.id}`} className="card">
              {n.image && <img src={media(n.image)} alt="" style={{ borderRadius: 8, marginBottom: 8, height: 160, objectFit: 'cover', width: '100%' }} onError={(e) => (e.target.style.display = 'none')} />}
              <div className="meta">{new Date(n.created_date).toLocaleDateString()}</div>
              <h3>{n.title}</h3>
              <p>{n.excerpt}</p>
              <span className="btn outline">Read more</span>
            </Link>
          ))}
        </div>
        {pages > 1 && (
          <div className="flex mt-l" style={{ justifyContent: 'center' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`btn ${p === page ? '' : 'outline'}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function NewsDetail() {
  const { id } = useParams();
  const { languageId } = useLanguage();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get(`/news/${id}`, { params: { lang: languageId } })
      .then((r) => setItem(r.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id, languageId]);
  if (loading) return <Spinner />;
  if (!item) return <div className="empty">News item not found.</div>;
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link to="/news" className="muted">← Back to News</Link>
        <h1>{item.title}</h1>
        <div className="meta muted mb">{new Date(item.created_date).toLocaleDateString()}</div>
        {item.image && <img src={media(item.image)} alt="" style={{ borderRadius: 10, marginBottom: 16, width: '100%' }} onError={(e) => (e.target.style.display = 'none')} />}
        <div dangerouslySetInnerHTML={{ __html: item.body || '' }} />
      </div>
    </section>
  );
}
