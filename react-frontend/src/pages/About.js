import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';

export default function About() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/static-pages/about').then((r) => setPage(r.data)).catch(() => setPage(null)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 32 }}>
        <div>
          <h1>{(page && page.title) || 'About english.am'}</h1>
          <div dangerouslySetInnerHTML={{ __html: (page && page.body) || '<p>English.am is a multilingual English-learning platform run by an NGO.</p>' }} />
        </div>
        <aside>
          <div className="card">
            <h3>Get in touch</h3>
            <p className="muted">Questions, feedback, partnership ideas — we'd love to hear from you.</p>
            <Link to="/contact" className="btn">Contact us</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
