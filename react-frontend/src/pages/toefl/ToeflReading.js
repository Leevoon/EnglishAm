import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../contexts/AuthContext';

function timeToSec(t) {
  if (!t) return 3600;
  const [h, m, s] = String(t).split(':').map((x) => parseInt(x, 10) || 0);
  return h * 3600 + m * 60 + s;
}
function fmt(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ToeflReadingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/toefl/reading').then((r) => setItems(r.data || [])).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container">
        <h1>TOEFL Reading</h1>
        <p className="subtitle">Real exam conditions: 60-minute timer, single-question advancement, full review.</p>
        {items.length === 0 && <div className="empty">No reading sections available yet.</div>}
        <div className="grid cards-3">
          {items.map((s) => (
            <div key={s.id} className="card">
              <div className="meta"><span className={`badge ${s.tier || 'free'}`}>{s.tier || 'free'}</span></div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <Link to={`/toefl/reading/${s.id}`} className="btn full">Begin</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ToeflReadingTest() {
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
    api.get(`/toefl/reading/${id}`)
      .then((r) => {
        setSection(r.data);
        setSecondsLeft(timeToSec(r.data.time));
      })
      .catch(() => setSection(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(t); doSubmit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, result]);

  const doSubmit = async () => {
    if (submitting || result) return;
    if (!user) return navigate('/login', { state: { from: `/toefl/reading/${id}` } });
    setSubmitting(true);
    try {
      const { data } = await api.post(`/toefl/reading/${id}/submit`, { answers });
      setResult(data);
      window.scrollTo(0, 0);
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
            <li>You will have <strong>{fmt(timeToSec(section.time))}</strong> to complete this section.</li>
            <li>Read each passage carefully, then answer the questions on the right.</li>
            <li>You cannot return to a question after submitting an answer.</li>
            <li>Your test will auto-submit when the timer reaches zero.</li>
            <li>You'll see a full review with the correct answers afterwards.</li>
          </ol>
          <button className="btn" onClick={() => setStarted(true)}>Continue</button>
        </div>
      </section>
    );
  }

  if (result) {
    return (
      <ToeflResultView title={section.title} result={result} backTo="/toefl/reading" passages={section.passages} />
    );
  }

  const passage = section.passages[pIdx];
  const allQuestions = section.passages.flatMap((p) => p.questions.map((q) => ({ ...q, passage_id: p.id })));
  const flatIdx = allQuestions.findIndex((q) => q.id === passage.questions[qIdx].id);
  const totalQ = allQuestions.length;
  const isLast = flatIdx === totalQ - 1;
  const cur = passage.questions[qIdx];

  const next = () => {
    if (qIdx + 1 < passage.questions.length) {
      setQIdx(qIdx + 1);
    } else if (pIdx + 1 < section.passages.length) {
      setPIdx(pIdx + 1); setQIdx(0);
    }
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
        <div className="player-main" style={{ maxHeight: 600, overflowY: 'auto' }}>
          <h3>Passage</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{passage.text}</p>
        </div>
        <div className="player-main">
          <div className="player-progress"><span style={{ width: `${((flatIdx + 1) / totalQ) * 100}%` }} /></div>
          <p style={{ fontSize: 17 }}>{cur.text}</p>
          <div className="mt">
            {cur.answers.map((a) => {
              const selected = answers[cur.id] === a.id;
              return (
                <label key={a.id} className={`option ${selected ? 'selected' : ''}`}>
                  <input type="radio" name={`q${cur.id}`} checked={selected} onChange={() => select(cur.id, a.id)} />
                  <span>{a.text}</span>
                </label>
              );
            })}
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

export function ToeflResultView({ title, result, backTo, passages }) {
  return (
    <section className="container player-shell">
      <aside className="player-side">
        <h3>{title}</h3>
        <p className="muted">Score</p>
        <div className="stat-card"><div className="value">{result.score_pct}%</div></div>
        <p className="muted mt">Correct: <strong>{result.correct} / {result.total}</strong></p>
        <Link to={backTo} className="btn outline mt">Back to list</Link>
      </aside>
      <div className="player-main">
        <h2>Review</h2>
        {result.review.map((r, i) => (
          <div key={r.question_id} className="card mb">
            <div className="meta">
              <strong>Q{i + 1}</strong>
              <span className={`badge ${r.is_correct ? 'right' : 'wrong'}`}>{r.is_correct ? 'Correct' : 'Incorrect'}</span>
            </div>
            <p>{r.question_text || r.question}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
