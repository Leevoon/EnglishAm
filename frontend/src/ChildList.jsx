import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RowFormModal from './RowFormModal';
import { isAudioField, isImageField, mediaUrl } from './media';

const AUTH = 'Basic ' + btoa('admin:admin');

function renderCell(table, name, v) {
  if (v === null || v === undefined || v === '') return <span className="muted">—</span>;
  if (typeof v === 'boolean') return v ? '✓' : '✗';
  if (typeof v === 'object') return <code>{JSON.stringify(v)}</code>;
  if (isImageField(name) && typeof v === 'string') {
    const url = mediaUrl(table, v);
    return url ? <a href={url} target="_blank" rel="noreferrer" className="media-thumb"><img src={url} alt={v} loading="lazy" /></a> : v;
  }
  if (isAudioField(name) && typeof v === 'string') {
    const url = mediaUrl(table, v);
    return url ? <audio src={url} controls preload="none" className="media-audio" /> : v;
  }
  const s = String(v);
  return s.length > 80 ? s.slice(0, 80) + '…' : s;
}

export default function ChildList({ parentTable, parentId, childTable, fkField }) {
  const lockedFields = { [fkField]: parseInt(parentId, 10) };
  const url = `/api/${childTable}/?${fkField}=${parentId}&page_size=50`;
  const [data, setData] = useState(null);
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  const reload = useCallback(() => setReloadTick((t) => t + 1), []);

  useEffect(() => {
    fetch(`/api/schema/${childTable}/`, { headers: { Authorization: AUTH, Accept: 'application/json' } })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setSchema(d?.fields || null))
      .catch(() => setSchema(null));
  }, [childTable]);

  useEffect(() => {
    fetch(url, { headers: { Authorization: AUTH, Accept: 'application/json' } })
      .then((r) => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [url, reloadTick]);

  async function handleDelete(row) {
    if (!confirm(`Delete row #${row.id} from ${childTable}?`)) return;
    const res = await fetch(`/api/${childTable}/${row.id}/`, {
      method: 'DELETE', headers: { Authorization: AUTH },
    });
    if (res.ok) reload();
    else alert(`Delete failed: HTTP ${res.status}`);
  }

  const rows = data?.results ?? [];
  const cols = rows.length ? Object.keys(rows[0]).filter((c) => c !== fkField) : [];

  return (
    <div className="child-list">
      <div className="child-list-head">
        <span className="meta">
          <code>/api/{childTable}/?{fkField}={parentId}</code>
          {data && <> · <strong>{data.count}</strong> row(s)</>}
        </span>
        {schema && (
          <button className="btn-primary btn-sm" onClick={() => setAdding(true)}>
            <i className="fa fa-plus" /> Add
          </button>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      {data && rows.length === 0 && <div className="empty">No rows yet.</div>}
      {rows.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>{cols.map((c) => <th key={c}>{c}</th>)}<th className="col-actions">actions</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {cols.map((c) => <td key={c}>{renderCell(childTable, c, row[c])}</td>)}
                  <td className="col-actions">
                    <Link className="btn-sm" to={`/edit/${childTable}/${row.id}`}>open</Link>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(row)}>delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data?.next && (
        <div className="meta" style={{marginTop: 8}}>
          More rows exist beyond the first 50. Open the dedicated <Link to={`/${childTable}`}>{childTable}</Link> list to paginate.
        </div>
      )}
      {adding && schema && (
        <RowFormModal
          table={childTable}
          schema={schema}
          row={null}
          lockedFields={lockedFields}
          onClose={() => setAdding(false)}
          onSaved={() => { setAdding(false); reload(); }}
        />
      )}
    </div>
  );
}
