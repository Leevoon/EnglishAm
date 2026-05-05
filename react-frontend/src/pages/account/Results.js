import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

function badgeClass(p) {
  if (p >= 80) return 'right';
  if (p >= 50) return 'level';
  return 'wrong';
}

export default function Results() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/account/results').then((r) => setItems(r.data || [])).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (
    <>
      <h1>My Results</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>No results yet.</p>
          <Link to="/tests/audio" className="btn">Take a test</Link>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--c-bg-soft)' }}>
              <th style={th}>Test</th><th style={th}>Score</th><th style={th}>Duration</th><th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid var(--c-border)' }}>
                <td style={td}>{r.test_name}</td>
                <td style={td}><span className={`badge ${badgeClass(r.score_pct)}`}>{r.score_pct}%</span> ({r.score}/{r.score_from})</td>
                <td style={td}>{r.duration}</td>
                <td style={td}>{new Date(r.created_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
const th = { padding: 12, textAlign: 'left', fontWeight: 700 };
const td = { padding: 12 };
