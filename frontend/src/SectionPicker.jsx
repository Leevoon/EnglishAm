import { Link } from 'react-router-dom';

export default function SectionPicker({ title, sections, basePath }) {
  return (
    <div className="page">
      <h1>{title}</h1>
      <div className="meta">Pick a section.</div>
      <div className="tile-grid">
        {sections.map((s) => (
          <Link key={s.slug} to={`${basePath}/${s.slug}`} className="tile">
            <i className={`fa ${s.icon || 'fa-circle-o'}`} />
            <div className="tile-label">{s.label}</div>
            {s.hint && <div className="tile-hint">{s.hint}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
