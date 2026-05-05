import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { useLanguage } from '../contexts/LanguageContext';

export default function StaticPage() {
  const { key } = useParams();
  const { languageId } = useLanguage();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get(`/static-pages/${key}`, { params: { lang: languageId } })
      .then((r) => setPage(r.data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [key, languageId]);
  if (loading) return <Spinner />;
  if (!page) return <div className="empty">Page not found.</div>;
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.body || '' }} />
      </div>
    </section>
  );
}
