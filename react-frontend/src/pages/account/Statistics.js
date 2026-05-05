import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];

export default function Statistics() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/account/statistics').then((r) => setS(r.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  if (!s) return <div className="empty">No data.</div>;
  const idx = Math.max(0, LEVELS.indexOf(s.level));
  const pct = ((idx + 1) / LEVELS.length) * 100;
  return (
    <>
      <h1>Statistics</h1>
      <div className="stat-grid mb">
        <div className="stat-card"><div className="label">Tests completed</div><div className="value">{s.tests_completed}</div></div>
        <div className="stat-card"><div className="label">Correct answers</div><div className="value">{s.correct_answers}</div></div>
        <div className="stat-card"><div className="label">Total questions</div><div className="value">{s.total_questions}</div></div>
        <div className="stat-card"><div className="label">Average score</div><div className="value">{s.average_score}%</div></div>
      </div>
      <h2>Level progress</h2>
      <div className="player-progress" style={{ height: 14 }}><span style={{ width: `${pct}%` }} /></div>
      <div className="flex between mt"><span className="muted">{LEVELS[0]}</span><span className="muted">{LEVELS[LEVELS.length - 1]}</span></div>
      <p className="mt"><strong>You are at: {s.level}</strong></p>
    </>
  );
}
