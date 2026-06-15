import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AUTH = 'Basic ' + btoa('admin:admin');

const fetchAll = async (url) => {
  const all = [];
  let next = url;
  while (next) {
    const res = await fetch(next, { headers: { Authorization: AUTH, Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    all.push(...(data.results ?? []));
    next = data.next ? new URL(data.next).pathname + new URL(data.next).search : null;
  }
  return all;
};

export default function TestCategoriesPicker({ rootCategoryId = 1, title = 'Tests' }) {
  const [cats, setCats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    setCats(null); setError(null);
    (async () => {
      try {
        const [categories, labels] = await Promise.all([
          fetchAll(`/api/category/?parent_id=${rootCategoryId}&page_size=200`),
          fetchAll('/api/category_label/?language=1&page_size=500'),
        ]);
        const labelById = Object.fromEntries(labels.map((l) => [l.category, l.value || l.name]));
        const enriched = categories.map((c) => ({
          id: c.id,
          name: labelById[c.id] || `Category #${c.id}`,
          image: c.image,
          status: c.status,
        }));
        if (!cancel) setCats(enriched);
      } catch (e) {
        if (!cancel) setError(String(e));
      }
    })();
    return () => { cancel = true; };
  }, [rootCategoryId]);

  return (
    <div className="page">
      <h1>{title}</h1>
      <div className="meta">Pick a category to view its tests.</div>
      {error && <div className="error">Error: {error}</div>}
      {!cats && !error && <div className="meta">Loading…</div>}
      {cats && cats.length === 0 && <div className="empty">No sub-categories.</div>}
      {cats && cats.length > 0 && (
        <div className="tile-grid">
          {cats.map((c) => (
            <Link key={c.id} to={`/tests/${c.id}`} className={`tile ${!c.status ? 'tile-inactive' : ''}`}>
              <i className="fa fa-folder-o" />
              <div className="tile-label">{c.name}</div>
              <div className="tile-hint">category #{c.id}{!c.status && ' · inactive'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
