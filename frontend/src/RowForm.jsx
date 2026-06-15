import { useMemo, useState } from 'react';
import { apiFetch } from './api';

function inputForField(name, meta, value, onChange) {
  const t = meta.type;
  const common = {
    id: `f-${name}`,
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    placeholder: meta.label,
  };
  if (t === 'boolean') {
    return <input type="checkbox" id={common.id} checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
  }
  if (t === 'integer' || t === 'decimal' || t === 'float') {
    return <input type="number" step={t === 'integer' ? 1 : 'any'} {...common} />;
  }
  if (t === 'datetime') return <input type="datetime-local" {...common} />;
  if (t === 'date') return <input type="date" {...common} />;
  if (t === 'time') return <input type="time" step="1" {...common} />;
  if (t === 'string' && meta.max_length && meta.max_length > 300) {
    return <textarea rows={4} {...common} />;
  }
  if (t === 'string') return <input type="text" maxLength={meta.max_length} {...common} />;
  // FK ("field") or unknown — fall back to a text input
  return <input type="text" {...common} />;
}

function normalize(meta, raw) {
  if (raw === '' || raw === undefined) return null;
  if (meta.type === 'integer') return parseInt(raw, 10);
  if (meta.type === 'decimal' || meta.type === 'float') return parseFloat(raw);
  if (meta.type === 'boolean') return !!raw;
  return raw;
}

export default function RowForm({ table, schema, row, lockedFields, onSaved, onCancel, submitLabel }) {
  const isNew = !row?.id;
  const writable = useMemo(
    () => Object.entries(schema).filter(([_, m]) => !m.read_only),
    [schema]
  );

  const [values, setValues] = useState(() => {
    const seed = {};
    for (const [name, meta] of writable) {
      seed[name] = row?.[name] ?? (lockedFields?.[name] ?? (meta.type === 'boolean' ? false : ''));
    }
    return seed;
  });
  const [errors, setErrors] = useState({});
  const [topError, setTopError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setTopError(null);

    const payload = {};
    for (const [name, meta] of writable) {
      const v = normalize(meta, values[name]);
      if (v !== null) payload[name] = v;
    }
    // Always include lockedFields (the parent FK on Add forms)
    Object.assign(payload, lockedFields || {});

    const url = isNew ? `/api/${table}/` : `/api/${table}/${row.id}/`;
    try {
      const res = await apiFetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        onSaved?.(data);
        return;
      }
      if (data && typeof data === 'object') {
        if (data.detail) setTopError(String(data.detail));
        else if (data.non_field_errors) setTopError(data.non_field_errors.join(' '));
        else setErrors(data);
      } else setTopError(`HTTP ${res.status}`);
    } catch (err) {
      setTopError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="row-form">
      {topError && <div className="error">{topError}</div>}
      {writable.map(([name, meta]) => {
        if (lockedFields && name in lockedFields) return null;  // hidden — managed by parent
        return (
          <div key={name} className="form-row">
            <label htmlFor={`f-${name}`}>
              {meta.label || name}
              {meta.required && <span className="req">*</span>}
            </label>
            {inputForField(name, meta, values[name], (v) => setValues({ ...values, [name]: v }))}
            {errors[name] && (
              <div className="field-error">
                {Array.isArray(errors[name]) ? errors[name].join(' ') : String(errors[name])}
              </div>
            )}
          </div>
        );
      })}
      <div className="form-actions">
        {onCancel && <button type="button" onClick={onCancel} disabled={submitting}>Cancel</button>}
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Saving…' : (submitLabel ?? (isNew ? 'Create' : 'Save'))}
        </button>
      </div>
    </form>
  );
}
