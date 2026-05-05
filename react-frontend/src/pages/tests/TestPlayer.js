import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../contexts/AuthContext';

function timeToSec(t) {
  if (!t) return 600;
  const [h, m, s] = String(t).split(':').map((x) => parseInt(x, 10) || 0);
  return h * 3600 + m * 60 + s;
}
function fmt(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TestPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startTs] = useState(Date.now());
  useEffect(() => {
    setLoading(true);
    api.get(`/tests/${id}`)
      .then((r) => {
        setTest(r.data);
        setSecondsLeft(timeToSec(r.data.time));
      })
      .catch(() => setTest(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!test || result) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(t); doSubmit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, result]);

  const total = test ? test.questions.length : 0;
  const cur = test ? test.questions[idx] : null;

  const doSubmit = async () => {
    if (submitting || result) return;
    if (!user) {
      navigate('/login', { state: { from: `/test/${id}`, msg: 'Please sign in to submit your test.' } });
      return;
    }
    setSubmitting(true);
    try {
      const dur = Math.floor((Date.now() - startTs) / 1000);
      const { data } = await api.post(`/tests/${id}/submit`, {
        answers,
        duration: fmt(dur),
      });
      setResult(data);
      window.scrollTo(0, 0);
    } catch (e) {
      alert((e.response && e.response.data && e.response.data.error) || 'Submit failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Spinner />;
  if (!test) return <div className="empty">Test not found.</div>;

  if (result) {
    return (
      <section className="container player-shell">
        <aside className="player-side">
          <h3>Result</h3>
          <p className="muted">Score</p>
          <div className="stat-card"><div className="value">{result.score_pct}%</div></div>
          <p className="muted mt">Correct: <strong>{result.correct} / {result.total}</strong></p>
          <Link to={`/test/${id}`} className="btn outline mt">Try again</Link>
          <Link to="/account/results" className="btn ghost mt">My results</Link>
        </aside>
        <div className="player-main">
          <h2>Review</h2>
          {result.review.map((r, i) => (
            <div key={r.question_id} className="card mb">
              <div className="meta">
                <strong>Q{i + 1}</strong>
                <span className={`badge ${r.is_correct ? 'right' : 'wrong'}`}>{r.is_correct ? 'Correct' : 'Incorrect'}</span>
              </div>
              <p>{r.question}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const select = (qid, aid) => setAnswers((a) => ({ ...a, [qid]: aid }));
  const isLast = idx === total - 1;
  const lowTime = secondsLeft < 60;

  return (
    <section className="container player-shell">
      <aside className="player-side">
        <h3>{test.name}</h3>
        <p className="muted">Question <strong>{idx + 1}</strong> of {total}</p>
        <div className="timer" style={{ marginTop: 8 }}>
          <span className={lowTime ? 'timer warn' : 'timer'}>⏱ {fmt(secondsLeft)}</span>
        </div>
        <p className="muted mt">{test.description}</p>
        {test.tier && test.tier !== 'free' && (
          <p className="muted">This is a <span className={`badge ${test.tier}`}>{test.tier}</span> test.</p>
        )}
      </aside>
      <div className="player-main">
        <div className="player-progress"><span style={{ width: `${((idx + 1) / total) * 100}%` }} /></div>
        <h2>Question {idx + 1}</h2>
        {cur && cur.audio && (
          <audio controls src={cur.audio} className="mb" style={{ width: '100%' }} />
        )}
        {cur && cur.image && <img src={cur.image} alt="" style={{ borderRadius: 8, marginBottom: 12, maxWidth: 480 }} />}
        <p style={{ fontSize: 17 }}>{cur && cur.question}</p>
        <div className="mt">
          {cur && cur.answers.map((a) => {
            const selected = answers[cur.id] === a.id;
            return (
              <label key={a.id} className={`option ${selected ? 'selected' : ''}`}>
                <input type="radio" name={`q${cur.id}`} checked={selected} onChange={() => select(cur.id, a.id)} />
                <span>{a.value}</span>
              </label>
            );
          })}
        </div>
        <div className="player-footer">
          <button className="btn outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Previous</button>
          {!isLast && <button className="btn" disabled={!answers[cur && cur.id]} onClick={() => setIdx(idx + 1)}>Next</button>}
          {isLast && <button className="btn" disabled={submitting} onClick={doSubmit}>{submitting ? 'Submitting…' : 'Submit Test'}</button>}
        </div>
      </div>
    </section>
  );
}
