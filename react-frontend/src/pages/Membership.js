import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { useLanguage } from '../contexts/LanguageContext';

const MATRIX = [
  ['Audio Tests', '5', 'All', 'All'],
  ['Synonyms', '5', 'All', 'All'],
  ['Antonyms', '5', 'All', 'All'],
  ['General English', '5', 'All', 'All'],
  ['Professional English', '—', 'All', 'All'],
  ['Photo Tests', '5', 'All', 'All'],
  ['Personal Account', '✓', '✓', '✓'],
  ['Result View', '✓', '✓', '✓'],
  ['Statistics', '✓', '✓', '✓'],
  ['CV / Letter Templates', '—', '✓', '✓'],
  ['Downloadable Books', '—', '—', '✓'],
  ['Lessons', 'Limited', '✓', '✓'],
  ['TOEFL Access', '—', 'Limited', 'Full'],
  ['IELTS Access', '—', 'Limited', 'Full'],
  ['Online Support', '—', '✓', 'Priority'],
  ['Private Tutoring', '—', '—', '✓'],
  ['Training Engine', '—', '✓', '✓'],
];

export default function Membership() {
  const { languageId } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/membership-plans', { params: { lang: languageId } })
      .then((r) => setPlans(r.data || []))
      .finally(() => setLoading(false));
  }, [languageId]);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container">
        <h1>Membership plans</h1>
        <p className="subtitle">Pick the level that suits how you study.</p>
        <div className="plans">
          {plans.map((p, i) => (
            <div key={p.id} className={`plan ${i === 1 ? 'popular' : ''}`}>
              <h3>{p.title}</h3>
              <div className="price">${Number(p.price || 0).toFixed(2)}</div>
              <p className="muted">{p.short_description}</p>
              <div dangerouslySetInnerHTML={{ __html: p.description || '' }} />
              <Link to={p.price > 0 ? '#' : '/register'} className="btn full">{p.price > 0 ? 'Upgrade' : 'Start free'}</Link>
            </div>
          ))}
        </div>

        <h2 className="mt-l">What's included</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr style={{ background: 'var(--c-bg-soft)' }}>
                <th style={th}>Feature</th><th style={th}>Free</th><th style={th}>Silver</th><th style={th}>Gold</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--c-border)' }}>
                  {row.map((cell, j) => <td key={j} style={{ padding: 12, textAlign: j === 0 ? 'left' : 'center' }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
const th = { padding: 12, textAlign: 'left', fontWeight: 700 };
