import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { useLanguage } from '../contexts/LanguageContext';

export default function Faq() {
  const { languageId } = useLanguage();
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get('/faq', { params: { lang: languageId } })
      .then((r) => setItems(r.data || []))
      .finally(() => setLoading(false));
  }, [languageId]);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <h1>Frequently asked questions</h1>
        {items.length === 0 && <div className="empty">Nothing here yet — write to us via the contact form.</div>}
        {items.map((q) => (
          <div key={q.id} className="card mb" style={{ cursor: 'pointer' }} onClick={() => setOpenId(openId === q.id ? null : q.id)}>
            <h3 style={{ margin: 0 }}>{q.question} <span style={{ float: 'right' }}>{openId === q.id ? '−' : '+'}</span></h3>
            {openId === q.id && <div className="mt" dangerouslySetInnerHTML={{ __html: q.answer || '' }} />}
          </div>
        ))}
      </div>
    </section>
  );
}
