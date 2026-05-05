import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';

export default function Lessons() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState([]);
  const [levels, setLevels] = useState([]);
  const [filterId, setFilterId] = useState(0);
  const [levelId, setLevelId] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/lessons/filters'),
      api.get('/lessons/levels'),
    ]).then(([f, l]) => { setFilters(f.data || []); setLevels(l.data || []); });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filterId) params.filter_id = filterId;
    if (levelId) params.level_id = levelId;
    api.get('/lessons', { params }).then((r) => setItems(r.data.items || [])).finally(() => setLoading(false));
  }, [filterId, levelId]);

  return (
    <section className="section">
      <div className="container">
        <h1>Lessons</h1>
        <p className="subtitle">Short, focused practice — vocabulary, grammar, pronunciation, idioms.</p>

        <div className="flex wrap mb">
          <button className={`btn ${filterId === 0 ? '' : 'outline'}`} onClick={() => setFilterId(0)}>All categories</button>
          {filters.map((f) => (
            <button key={f.id} className={`btn ${filterId === f.id ? '' : 'outline'}`} onClick={() => setFilterId(f.id)}>{f.name || `Filter ${f.id}`}</button>
          ))}
        </div>

        {levels.length > 0 && (
          <div className="flex wrap mb">
            <button className={`btn ${levelId === 0 ? '' : 'outline'}`} onClick={() => setLevelId(0)}>All levels</button>
            {levels.map((l) => (
              <button key={l.id} className={`btn ${levelId === l.id ? '' : 'outline'}`} onClick={() => setLevelId(l.id)}>{l.name || `Level ${l.id}`}</button>
            ))}
          </div>
        )}

        {loading ? <Spinner /> : items.length === 0 ? (
          <div className="empty">
            <p>No lessons match these filters.</p>
            <button className="btn outline" onClick={() => { setFilterId(0); setLevelId(0); }}>Clear filters</button>
          </div>
        ) : (
          <div className="grid cards-3">
            {items.map((l) => (
              <div key={l.id} className="card">
                <div className="meta"><span className="badge level">Level {l.level_id}</span> {l.duration && <span>· {l.duration}</span>}</div>
                <h3>{l.name || `Lesson ${l.id}`}</h3>
                <p>{l.description}</p>
                <Link to={`/lessons/${l.id}`} className="btn outline">Start lesson</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
