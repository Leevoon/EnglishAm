import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { media } from '../services/api';
import Spinner from '../components/Spinner';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { languageId } = useLanguage();
  const [data, setData] = useState(null);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/home', { params: { lang: languageId } })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [languageId]);

  useEffect(() => {
    if (!data || !data.slides || data.slides.length < 2) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % data.slides.length), 6000);
    return () => clearInterval(t);
  }, [data]);

  if (loading || !data) return <Spinner />;
  const cur = (data.slides || [])[slide];

  return (
    <>
      <section className="hero">
        <div className="container hero-slide">
          {cur && (
            <>
              <div dangerouslySetInnerHTML={{ __html: cur.caption }} />
              <div>
                {cur.href && <Link to={cur.href} className="btn">Get started</Link>}
              </div>
            </>
          )}
          {!cur && <h1>Practice English every day.</h1>}
          {(data.slides || []).length > 1 && (
            <div className="flex" style={{ marginTop: 16, gap: 6 }}>
              {data.slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', background: i === slide ? 'var(--c-primary)' : '#cbd5e1' }} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Learn a language with us</h2>
          <p className="subtitle">Six categories, hundreds of timed practice tests.</p>
          <div className="grid cards-6">
            {[
              ['audio', 'Audio Tests', '🎧'],
              ['synonyms', 'Synonyms', '🔁'],
              ['antonyms', 'Antonyms', '↔️'],
              ['general', 'General English', '📚'],
              ['professional', 'Professional', '💼'],
              ['photo', 'Photo Tests', '📷'],
            ].map(([k, l, e]) => (
              <Link key={k} to={`/tests/${k}`} className="card text-c">
                <div style={{ fontSize: 40 }}>{e}</div>
                <h3>{l}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container flex" style={{ gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <h2>About english.am</h2>
            <p className="subtitle">English.am is a multilingual English-learning platform run by an NGO. We help learners prepare for TOEFL, IELTS, and everyday English with hundreds of free and premium practice tests.</p>
            <Link to="/about" className="btn outline">Learn more</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Most popular tests</h2>
          <p className="subtitle">Try one for free — no signup required for guest mode.</p>
          <div className="grid cards-4">
            {(data.popular || []).map((t) => (
              <Link key={t.id} to={`/test/${t.id}`} className="card">
                <div className="meta">
                  <span className={`badge ${t.tier || 'free'}`}>{t.tier || 'free'}</span>
                </div>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <span className="btn outline">Begin</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>Why choose us</h2>
          <div className="grid cards-3">
            {[
              ['Lots of tests', 'Hundreds of practice tests across six categories.', '📚'],
              ['Premium memberships', 'Silver and Gold unlock TOEFL/IELTS and downloadables.', '⭐'],
              ['Downloadable books', 'PDF books for offline study.', '📖'],
              ['Speaking & writing', 'Engines for full exam practice.', '🗣️'],
              ['Free updates', 'New content added monthly.', '🆕'],
              ['Flexible payments', 'Multiple currencies, no lock-in.', '💳'],
            ].map(([t, d, e]) => (
              <div key={t} className="card">
                <div style={{ fontSize: 32 }}>{e}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="text-c mt-l"><Link to="/membership" className="btn">See membership plans</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Membership plans</h2>
          <p className="subtitle">Pick the tier that suits you.</p>
          <div className="plans">
            {(data.plans || []).map((p, i) => (
              <div key={p.id} className={`plan ${i === 1 ? 'popular' : ''}`}>
                <h3>{p.title}</h3>
                <div className="price">${Number(p.price || 0).toFixed(2)}</div>
                <p className="muted">{p.short_description}</p>
                <div dangerouslySetInnerHTML={{ __html: p.description || '' }} />
                <Link to={p.price > 0 ? '/membership' : '/register'} className="btn full">{p.price > 0 ? 'Choose plan' : 'Start free'}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>Latest news</h2>
          <div className="grid cards-3">
            {(data.news || []).map((n) => (
              <Link key={n.id} to={`/news/${n.id}`} className="card">
                {n.image && <img src={media(n.image)} alt="" style={{ borderRadius: 8, marginBottom: 8 }} onError={(e) => (e.target.style.display = 'none')} />}
                <div className="meta">{new Date(n.created_date).toLocaleDateString()}</div>
                <h3>{n.title}</h3>
                <p>{n.excerpt}</p>
              </Link>
            ))}
          </div>
          <div className="text-c mt-l"><Link to="/news" className="btn outline">View all news</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Gallery</h2>
          <div className="grid cards-6">
            {(data.gallery || []).map((g) => (
              <img key={g.id} src={media(g.image)} alt="" style={{ borderRadius: 8, height: 140, width: '100%', objectFit: 'cover' }} onError={(e) => (e.target.style.background = '#e5e7eb')} />
            ))}
          </div>
          <div className="text-c mt-l"><Link to="/gallery" className="btn outline">Open gallery</Link></div>
        </div>
      </section>
    </>
  );
}
