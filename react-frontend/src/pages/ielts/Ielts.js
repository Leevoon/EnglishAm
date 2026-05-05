import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { ToeflResultView } from '../toefl/ToeflReading';
import { useAuth } from '../../contexts/AuthContext';

export function IeltsList({ kind, title, subtitle }) {
  const { track } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get(`/ielts/${track}/${kind}`).then((r) => setItems(r.data || [])).finally(() => setLoading(false));
  }, [track, kind]);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container">
        <h1>IELTS {track === 'academic' ? 'Academic' : 'General Training'} — {title}</h1>
        <p className="subtitle">{subtitle}</p>
        {items.length === 0 ? <div className="empty">No content yet.</div> : (
          <div className="grid cards-3">
            {items.map((s) => (
              <div key={s.id} className="card">
                <div className="meta"><span className={`badge ${s.tier || 'free'}`}>{s.tier || 'free'}</span></div>
                <h3>{s.title || `Item ${s.id}`}</h3>
                <p className="muted">{s.description || ''}</p>
                {kind === 'reading' ? (
                  <Link to={`/ielts/${track}/reading/${s.id}`} className="btn full">Begin</Link>
                ) : (
                  <button className="btn full" disabled>Coming soon</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function IeltsReadingTest() {
  const { track, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/ielts/${track}/reading/${id}`).then((r) => setSection(r.data)).catch(() => setSection(null)).finally(() => setLoading(false));
  }, [track, id]);

  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => setSecondsLeft((s) => {
      if (s <= 1) { clearInterval(t); doSubmit(); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, result]);

  const doSubmit = async () => {
    if (submitting || result) return;
    if (!user) return navigate('/login', { state: { from: `/ielts/${track}/reading/${id}` } });
    setSubmitting(true);
    try {
      const { data } = await api.post(`/ielts/${track}/reading/${id}/submit`, { answers });
      setResult(data);
    } catch (e) {
      alert((e.response && e.response.data && e.response.data.error) || 'Submit failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Spinner />;
  if (!section) return <div className="empty">Section not found.</div>;
  if (!started && !result) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>{section.title}</h1>
          <ol style={{ lineHeight: 1.9 }}>
            <li>You have 60 minutes to complete this reading section.</li>
            <li>Read the passage carefully, then answer each question.</li>
            <li>Auto-submit at zero on the timer.</li>
          </ol>
          <button className="btn" onClick={() => setStarted(true)}>Continue</button>
        </div>
      </section>
    );
  }
  if (result) return <ToeflResultView title={section.title} result={result} backTo={`/ielts/${track}/reading`} />;

  const cur = section.questions[qIdx];
  const total = section.questions.length;
  const isLast = qIdx === total - 1;
  const select = (qid, aid) => setAnswers((a) => ({ ...a, [qid]: aid }));
  const lowTime = secondsLeft < 300;
  const fmt = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <section className="container player-shell">
      <aside className="player-side">
        <h3>{section.title}</h3>
        <p className="muted">Question <strong>{qIdx + 1}</strong> / {total}</p>
        <div className="timer" style={{ marginTop: 8 }}>
          <span className={lowTime ? 'timer warn' : 'timer'}>⏱ {fmt(secondsLeft)}</span>
        </div>
      </aside>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="player-main" style={{ maxHeight: 600, overflowY: 'auto' }}>
          <h3>Passage</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{section.reading_text}</p>
        </div>
        <div className="player-main">
          <div className="player-progress"><span style={{ width: `${((qIdx + 1) / total) * 100}%` }} /></div>
          <p style={{ fontSize: 17 }}>{cur.question}</p>
          <div className="mt">
            {cur.answers.map((a) => (
              <label key={a.id} className={`option ${answers[cur.id] === a.id ? 'selected' : ''}`}>
                <input type="radio" name={`q${cur.id}`} checked={answers[cur.id] === a.id} onChange={() => select(cur.id, a.id)} />
                <span>{a.value}</span>
              </label>
            ))}
          </div>
          <div className="player-footer">
            <span />
            {!isLast && <button className="btn" disabled={!answers[cur.id]} onClick={() => setQIdx(qIdx + 1)}>Next</button>}
            {isLast && <button className="btn" disabled={submitting || !answers[cur.id]} onClick={doSubmit}>{submitting ? 'Submitting…' : 'Submit'}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function IeltsComplete() {
  const { track } = useParams();
  const STEPS = ['Reading', 'Listening', 'Speaking', 'Writing'];
  const [step, setStep] = useState(0);
  return (
    <section className="section">
      <div className="container">
        <h1>IELTS {track === 'academic' ? 'Academic' : 'General Training'} — Complete Simulation</h1>
        <div className="flex mb wrap">
          {STEPS.map((s, i) => (
            <div key={s} className={`badge ${i === step ? 'level' : ''}`} style={{ padding: '8px 16px' }}>{i + 1}. {s}</div>
          ))}
        </div>
        <div className="card">
          <h3>{STEPS[step]} section</h3>
          <p className="muted">Run each section individually until the integrated runner is built.</p>
        </div>
        <div className="player-footer">
          <button className="btn outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Previous Section</button>
          {step < STEPS.length - 1 && <button className="btn" onClick={() => setStep(step + 1)}>Next Section</button>}
          {step === STEPS.length - 1 && <button className="btn" onClick={() => alert('Complete test submitted (demo).')}>Submit</button>}
        </div>
      </div>
    </section>
  );
}
