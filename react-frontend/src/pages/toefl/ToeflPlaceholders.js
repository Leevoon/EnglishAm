import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

export function ToeflSpeaking() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/toefl/speaking').then((r) => setItems(r.data || [])).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container">
        <h1>TOEFL Speaking</h1>
        <p className="subtitle">Practice prompts. Recording will be available in a future release.</p>
        {items.length === 0 ? <div className="empty">No prompts yet.</div> : (
          <div className="grid cards-3">
            {items.map((p) => (
              <div key={p.id} className="card">
                <div className="meta"><span className={`badge ${p.tier || 'free'}`}>{p.tier || 'free'}</span></div>
                <h3>{p.title}</h3>
                <p className="muted">Open the prompt and rehearse aloud.</p>
                <button className="btn full" disabled>Coming soon</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ToeflWriting() {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const kind = path.endsWith('/integrated') ? 'integrated' : path.endsWith('/independent') ? 'independent' : null;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/toefl/writing', { params: kind ? { kind } : undefined })
      .then((r) => setItems(r.data || []))
      .finally(() => setLoading(false));
  }, [kind]);
  if (loading) return <Spinner />;
  return (
    <section className="section">
      <div className="container">
        <h1>TOEFL Writing {kind ? `— ${kind.charAt(0).toUpperCase() + kind.slice(1)}` : ''}</h1>
        <p className="subtitle">Essay prompts. Online scoring will be available in a future release.</p>
        {!kind && (
          <div className="flex mb">
            <button className="btn outline" onClick={() => navigate('/toefl/writing/integrated')}>Integrated Writing</button>
            <button className="btn outline" onClick={() => navigate('/toefl/writing/independent')}>Independent Writing</button>
          </div>
        )}
        {items.length === 0 ? <div className="empty">No prompts yet.</div> : (
          <div className="grid cards-3">
            {items.map((p) => (
              <div key={p.id} className="card">
                <div className="meta"><span className={`badge ${p.tier || 'free'}`}>{p.tier || 'free'}</span></div>
                <h3>{p.title}</h3>
                <p className="muted">Practice this essay prompt offline; submission UI is coming soon.</p>
                <button className="btn full" disabled>Coming soon</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ToeflComplete() {
  const STEPS = ['Reading', 'Listening', 'Speaking', 'Writing'];
  const [step, setStep] = useState(0);
  return (
    <section className="section">
      <div className="container">
        <h1>TOEFL — Complete Test Simulation</h1>
        <p className="subtitle">Move through all four sections in one sitting.</p>
        <div className="flex mb wrap">
          {STEPS.map((s, i) => (
            <div key={s} className={`badge ${i === step ? 'level' : ''}`} style={{ padding: '8px 16px' }}>
              {i + 1}. {s}
            </div>
          ))}
        </div>
        <div className="card">
          <h3>{STEPS[step]} section</h3>
          <p className="muted">In a full test, this section would run inline. For now, run each section individually from the menu.</p>
        </div>
        <div className="player-footer">
          <button className="btn outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Previous Section</button>
          {step < STEPS.length - 1 && <button className="btn" onClick={() => setStep(step + 1)}>Next Section</button>}
          {step === STEPS.length - 1 && <button className="btn" onClick={() => alert('Complete test submitted (demo).')}>Submit Complete Test</button>}
        </div>
      </div>
    </section>
  );
}
