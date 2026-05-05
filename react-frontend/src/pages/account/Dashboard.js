import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/account/dashboard').then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (
    <>
      <h1>Welcome back, {user.first_name || user.user_name} 👋</h1>
      <p className="subtitle">Here's a quick look at your progress.</p>
      <div className="stat-grid mb">
        <div className="stat-card"><div className="label">Tests completed</div><div className="value">{data.stats.tests_completed}</div></div>
        <div className="stat-card"><div className="label">Average score</div><div className="value">{data.stats.average_score}%</div></div>
        <div className="stat-card"><div className="label">Correct answers</div><div className="value">{data.stats.correct_answers}</div></div>
        <div className="stat-card"><div className="label">Current level</div><div className="value">{data.stats.level}</div></div>
      </div>

      <h2>Recent activity</h2>
      {data.recent.length === 0 ? (
        <div className="empty">
          <p>You haven't completed any tests yet.</p>
          <Link to="/tests/audio" className="btn">Take your first test</Link>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--c-bg-soft)' }}>
              <th style={th}>Test</th><th style={th}>Score</th><th style={th}>Duration</th><th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid var(--c-border)' }}>
                <td style={td}>{r.test_name}</td>
                <td style={td}>{r.score} / {r.score_from}</td>
                <td style={td}>{r.duration}</td>
                <td style={td}>{new Date(r.created_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mt-l">Quick actions</h2>
      <div className="flex wrap">
        <Link to="/tests/audio" className="btn">Take a test</Link>
        <Link to="/toefl/reading" className="btn outline">TOEFL Practice</Link>
        <Link to="/ielts/general/reading" className="btn outline">IELTS Practice</Link>
      </div>
    </>
  );
}
const th = { padding: 12, textAlign: 'left', fontWeight: 700 };
const td = { padding: 12 };
