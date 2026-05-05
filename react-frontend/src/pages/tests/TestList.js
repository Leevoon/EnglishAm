import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TestList() {
  const { category } = useParams();
  const { languageId } = useLanguage();
  const [data, setData] = useState({ items: [], levels: [], category: null });
  const [levelId, setLevelId] = useState(0);
  const [subcat, setSubcat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setLevelId(0);
    setSubcat(null);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    const params = { lang: languageId };
    if (levelId) params.level_id = levelId;
    if (subcat) params.subcategory = subcat;
    api.get(`/tests/categories/${category}`, { params })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [category, languageId, levelId, subcat]);

  const showSubcat = category === 'audio';

  return (
    <section className="section">
      <div className="container">
        <h1>{(data.category && data.category.name) || category}</h1>
        <p className="subtitle">Pick a test to begin. Free tests are open to everyone; Silver and Gold tests require a membership.</p>

        {showSubcat && (
          <div className="flex wrap mb">
            <button className={`btn ${!subcat ? '' : 'outline'}`} onClick={() => setSubcat(null)}>Both</button>
            <button className={`btn ${subcat === 'american' ? '' : 'outline'}`} onClick={() => setSubcat('american')}>American</button>
            <button className={`btn ${subcat === 'british' ? '' : 'outline'}`} onClick={() => setSubcat('british')}>British</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 220px) 1fr', gap: 24 }}>
          {data.levels && data.levels.length > 0 ? (
            <aside>
              <div className="card">
                <h3>Level</h3>
                <button className={`btn ghost ${levelId === 0 ? 'active' : ''}`} onClick={() => setLevelId(0)} style={{ display: 'block', width: '100%', textAlign: 'left' }}>All</button>
                {data.levels.map((l) => (
                  <button key={l.id} className="btn ghost" onClick={() => setLevelId(l.id)} style={{ display: 'block', width: '100%', textAlign: 'left', fontWeight: levelId === l.id ? 700 : 400 }}>{l.name || `Level ${l.id}`}</button>
                ))}
              </div>
            </aside>
          ) : <div />}
          <div>
            {loading ? <Spinner /> : data.items.length === 0 ? (
              <div className="empty">
                <p>No tests match these filters.</p>
                <button className="btn outline" onClick={() => { setLevelId(0); setSubcat(null); }}>Clear filters</button>
              </div>
            ) : (
              <div className="grid cards-3">
                {data.items.map((t) => (
                  <div key={t.id} className="card">
                    <div className="meta">
                      {t.level_id ? <span className="badge level">Level {t.level_id}</span> : null}
                      <span className={`badge ${t.tier || 'free'}`}>{t.tier || 'free'}</span>
                    </div>
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                    <Link to={`/test/${t.id}`} className="btn full">Begin Test</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
