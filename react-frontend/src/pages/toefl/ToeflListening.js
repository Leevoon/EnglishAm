import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api, { media } from '../../services/api';
import Spinner from '../../components/Spinner';
import { ToeflResultView } from './ToeflReading';
import { useAuth } from '../../contexts/AuthContext';

function timeToSec(t) {
  if (!t) return 2400;
  const [h, m, s] = String(t).split(':').map((x) => parseInt(x, 10) || 0);
  return h * 3600 + m * 60 + s;
}
function fmt(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ToeflListeningList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/toefl/listening').then((r) => setItems(r.data || [])).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container">
        <h1>TOEFL Listening</h1>
        <p className="subtitle">Lectures and conversations under exam timer.</p>
        {items.length === 0 && <div className="empty">No listening sections yet.</div>}
        <div className="grid cards-3">
          {items.map((s) => (
            <div key={s.id} className="card">
              <div className="meta"><span className={`badge ${s.tier || 'free'}`}>{s.tier || 'free'}</span></div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <Link to={`/toefl/listening/${s.id}`} className="btn full">Begin</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ToeflListeningTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [pIdx, setPIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/toefl/listening/${id}`)
      .then((r) => { setSection(r.data); setSecondsLeft(timeToSec(r.data.time)); })
      .catch(() => setSection(null))
      .finally(() => setLoading(false));
  }, [id]);

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
    if (!user) return navigate('/login', { state: { from: `/toefl/listening/${id}` } });
    setSubmitting(true);
    try {
      const { data } = await api.post(`/toefl/listening/${id}/submit`, { answers });
      setResult(data); window.scrollTo(0, 0);
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
          <p className="muted">{section.description}</p>
          <ol style={{ lineHeight: 1.9 }}>
            <li>Listen to each clip carefully — you may play it once.</li>
            <li>Answer all questions before moving on.</li>
            <li>Auto-submit at <strong>{fmt(timeToSec(section.time))}</strong>.</li>
          </ol>
          <button className="btn" onClick={() => setStarted(true)}>Continue</button>
        </div>
      </section>
    );
  }
  if (result) {
    return <ToeflResultView title={section.title} result={result} backTo="/toefl/listening" />;
  }

  const part = section.parts[pIdx];
  const allQuestions = section.parts.flatMap((p) => p.questions);
  const flatIdx = allQuestions.findIndex((q) => q.id === part.questions[qIdx].id);
  const totalQ = allQuestions.length;
  const isLast = flatIdx === totalQ - 1;
  const cur = part.questions[qIdx];
  const next = () => {
    if (qIdx + 1 < part.questions.length) setQIdx(qIdx + 1);
    else if (pIdx + 1 < section.parts.length) { setPIdx(pIdx + 1); setQIdx(0); }
  };
  const select = (qid, aid) => setAnswers((a) => ({ ...a, [qid]: aid }));
  const lowTime = secondsLeft < 300;

  return (
    <section className="container player-shell">
      <aside className="player-side">
        <h3>{section.title}</h3>
        <p className="muted">Question <strong>{flatIdx + 1}</strong> / {totalQ}</p>
        <div className="timer" style={{ marginTop: 8 }}>
          <span className={lowTime ? 'timer warn' : 'timer'}>⏱ {fmt(secondsLeft)}</span>
        </div>
      </aside>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="player-main">
          <h3>Audio</h3>
          {part.audio ? <audio controls src={media(part.audio)} style={{ width: '100%' }} /> : <p className="muted">Audio unavailable.</p>}
          {part.image && <img src={media(part.image)} alt="" style={{ borderRadius: 8, marginTop: 12 }} onError={(e) => (e.target.style.display = 'none')} />}
        </div>
        <div className="player-main">
          <div className="player-progress"><span style={{ width: `${((flatIdx + 1) / totalQ) * 100}%` }} /></div>
          <p style={{ fontSize: 17 }}>{cur.question}</p>
          {cur.audio && <audio controls src={media(cur.audio)} className="mb" style={{ width: '100%' }} />}
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
            {!isLast && <button className="btn" disabled={!answers[cur.id]} onClick={next}>Next</button>}
            {isLast && <button className="btn" disabled={submitting || !answers[cur.id]} onClick={doSubmit}>{submitting ? 'Submitting…' : 'Submit'}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
