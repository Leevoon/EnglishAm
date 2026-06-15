import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RowFormModal from './RowFormModal';
import { apiFetch, apiJson } from './api';
import { isAudioField, isImageField, mediaUrl } from './media';

function toRelative(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

function renderCell(table, name, v) {
  if (v === null || v === undefined || v === '') return <span className="muted">—</span>;
  if (typeof v === 'boolean') return v ? '✓' : '✗';
  if (typeof v === 'object') return <code>{JSON.stringify(v)}</code>;

  if (isImageField(name) && typeof v === 'string') {
    const url = mediaUrl(table, v);
    return url ? (
      <a href={url} target="_blank" rel="noreferrer" className="media-thumb">
        <img src={url} alt={v} loading="lazy" />
      </a>
    ) : v;
  }
  if (isAudioField(name) && typeof v === 'string') {
    const url = mediaUrl(table, v);
    return url ? <audio src={url} controls preload="none" className="media-audio" /> : v;
  }

  const s = String(v);
  return s.length > 80 ? s.slice(0, 80) + '…' : s;
}

export default function Page({ title, table, extraQuery }) {
  const initial = table ? `/api/${table}/?page=1${extraQuery ? '&' + extraQuery : ''}` : null;
  const [url, setUrl] = useState(initial);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schema, setSchema] = useState(null);
  const [editing, setEditing] = useState(null);  // null | 'new' | row

  useEffect(() => {
    setUrl(initial);
    setData(null);
    setError(null);
  }, [initial]);

  // Fetch the schema once per table — drives form rendering. We use a
  // GET endpoint because Vite intercepts OPTIONS as CORS preflight.
  useEffect(() => {
    setSchema(null);
    if (!table) return;
    apiJson(`/api/schema/${table}/`)
      .then((d) => setSchema(d?.fields || null))
      .catch(() => setSchema(null));
  }, [table]);

  const reload = () => setUrl((u) => u && (u + '&_ts=' + Date.now()));

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    apiJson(url)
      .then((d) => { setData(d); setError(null); })
      .catch((e) => { setError(e.message); setData(null); })
      .finally(() => setLoading(false));
  }, [url]);

  async function handleDelete(row) {
    if (!confirm(`Delete row #${row.id} from ${table}?`)) return;
    const res = await apiFetch(`/api/${table}/${row.id}/`, { method: 'DELETE' });
    if (res.ok) reload();
    else alert(`Delete failed: HTTP ${res.status}`);
  }

  const rows = data?.results ?? [];
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const canEdit = !!schema;

  return (
    <div className="page">
      <div className="page-head">
        <h1>{title}</h1>
        {canEdit && (
          <button className="btn-primary" onClick={() => setEditing('new')}>
            <i className="fa fa-plus" /> Add
          </button>
        )}
      </div>
      <div className="meta">
        {table ? <>API: <code>/api/{table}/</code></> : <em>No backing table — placeholder page.</em>}
        {data && <> · <strong>{data.count}</strong> total rows</>}
        {loading && <> · loading…</>}
      </div>

      {error && <div className="error">Error: {error}</div>}

      {data && rows.length === 0 && <div className="empty">No rows.</div>}

      {rows.length > 0 && (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((c) => <th key={c}>{c}</th>)}
                  {canEdit && <th className="col-actions">actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id ?? i}>
                    {columns.map((c) => <td key={c}>{renderCell(table, c, row[c])}</td>)}
                    {canEdit && (
                      <td className="col-actions">
                        <Link className="btn-sm" to={`/edit/${table}/${row.id}`}>open</Link>
                        <button className="btn-sm btn-danger" onClick={() => handleDelete(row)}>delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <button disabled={!data.previous} onClick={() => setUrl(toRelative(data.previous))}>
              ← Prev
            </button>
            <span>{rows.length} of {data.count}</span>
            <button disabled={!data.next} onClick={() => setUrl(toRelative(data.next))}>
              Next →
            </button>
          </div>
        </>
      )}

      {editing && schema && (
        <RowFormModal
          table={table}
          schema={schema}
          row={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); reload(); }}
        />
      )}
    </div>
  );
}
