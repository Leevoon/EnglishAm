import RowForm from './RowForm';

export default function RowFormModal({ table, schema, row, onClose, onSaved, lockedFields }) {
  const isNew = !row?.id;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2>{isNew ? 'Add new row' : `Edit row #${row.id}`} · <code>{table}</code></h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="modal-body">
          <RowForm
            table={table}
            schema={schema}
            row={row}
            lockedFields={lockedFields}
            onSaved={() => onSaved?.()}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
