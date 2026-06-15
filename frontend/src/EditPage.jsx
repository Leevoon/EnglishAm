import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ChildList from './ChildList';
import RowForm from './RowForm';
import { apiJson } from './api';

function humanize(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function EditPage() {
  const { table, id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [schema, setSchema] = useState(null);
  const [relations, setRelations] = useState(null);
  const [row, setRow] = useState(isNew ? {} : null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('main');

  useEffect(() => { setTab('main'); }, [table, id]);

  useEffect(() => {
    setSchema(null);
    setRelations(null);
    setRow(isNew ? {} : null);
    setError(null);

    apiJson(`/api/schema/${table}/`)
      .then((d) => setSchema(d?.fields || null))
      .catch(() => setSchema(null));
    apiJson(`/api/relations/${table}/`)
      .then((d) => setRelations(d?.children || []))
      .catch(() => setRelations([]));

    if (!isNew) {
      apiJson(`/api/${table}/${id}/`)
        .then(setRow)
        .catch((e) => setError(e.message));
    }
  }, [table, id, isNew]);

  if (error) return <div className="page"><h1>Error</h1><div className="error">{error}</div></div>;
  if (!schema || (!isNew && !row) || relations === null) {
    return <div className="page"><div className="meta">Loading editor…</div></div>;
  }

  const childRelations = relations.filter(
    (r) => !['django_admin_log', 'auth_user', 'auth_group', 'auth_permission'].includes(r.table)
  );

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <Link className="back-link" to={`/${table}`}>{humanize(table)}</Link>
          <span className="sep">›</span>
          {isNew ? 'New row' : `#${id}`}
        </h1>
      </div>

      <div className="tabs">
        <button className={tab === 'main' ? 'tab active' : 'tab'} onClick={() => setTab('main')}>
          Fields
        </button>
        {!isNew && childRelations.map((c) => (
          <button
            key={c.table}
            className={tab === c.table ? 'tab active' : 'tab'}
            onClick={() => setTab(c.table)}
          >
            {humanize(c.table.replace(table + '_', '') || c.table)}
          </button>
        ))}
      </div>

      <div className="tab-body">
        {tab === 'main' && (
          <RowForm
            table={table}
            schema={schema}
            row={isNew ? null : row}
            onSaved={(saved) => {
              if (isNew && saved?.id) navigate(`/edit/${table}/${saved.id}`, { replace: true });
            }}
            onCancel={() => navigate(`/${table}`)}
          />
        )}
        {tab !== 'main' && !isNew && (() => {
          const c = childRelations.find((r) => r.table === tab);
          return c ? (
            <ChildList
              parentTable={table}
              parentId={id}
              childTable={c.table}
              fkField={c.fk_field}
            />
          ) : null;
        })()}
      </div>
    </div>
  );
}
