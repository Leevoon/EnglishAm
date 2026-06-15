import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Page from './Page';
import EditPage from './EditPage';
import Login from './Login';
import SectionPicker from './SectionPicker';
import TestCategoriesPicker from './TestCategoriesPicker';
import CategoryTests from './CategoryTests';
import { allRoutes } from './menu';
import { SectionsProvider, useSections } from './useSections';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

function SectionRouter() {
  const { slug } = useParams();
  const { sections, loading, error } = useSections();
  if (loading) return <div className="page"><div className="meta">Loading…</div></div>;
  if (error) return <div className="page"><div className="error">Error: {error}</div></div>;
  const section = sections?.[slug];
  if (!section) return <div className="page"><h1>Unknown section: {slug}</h1></div>;

  if (section.kind === 'categories') {
    return <TestCategoriesPicker rootCategoryId={section.category_id} title={section.label} />;
  }
  if (section.kind === 'skills') {
    return <SectionPicker title={section.label} sections={section.subsections} basePath={`/${slug}`} />;
  }
  return (
    <div className="page">
      <h1>{section.label}</h1>
      <div className="meta">
        This section is declared in <code>settings.menu_control</code> but no
        matching tables or categories were found in the database. Add data and
        it will appear here automatically.
      </div>
    </div>
  );
}

function SubsectionRouter() {
  const { slug, sub } = useParams();
  const { sections, loading, error } = useSections();
  if (loading) return <div className="page"><div className="meta">Loading…</div></div>;
  if (error) return <div className="page"><div className="error">Error: {error}</div></div>;
  const section = sections?.[slug];
  if (!section) return <div className="page"><h1>Unknown section: {slug}</h1></div>;
  const found = (section.subsections || []).find((s) => s.slug === sub);
  if (!found) return <div className="page"><h1>Unknown {section.label} subsection: {sub}</h1></div>;
  return <Page title={`${section.label} · ${found.label}`} table={found.table} />;
}

function Shell() {
  const { user, logout } = useAuth();
  return (
    <BrowserRouter>
      <div className="layout">
        <header className="topbar">
          <span className="brand">EnglishAm Admin</span>
          <span className="topbar-user">
            {user?.username}
            <button className="link-btn" onClick={logout}>Sign out</button>
          </span>
        </header>
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/contactMessages" replace />} />
            <Route path="/edit/:table/:id" element={<EditPage />} />
            <Route path="/tests/:categoryId" element={<CategoryTests />} />
            <Route path="/:slug" element={<SectionRouter />} />
            <Route path="/:slug/:sub" element={<SubsectionRouter />} />
            {allRoutes().map((r) => (
              <Route key={r.path} path={r.path} element={<Page title={r.label} table={r.table} />} />
            ))}
            <Route path="*" element={<div className="page"><h1>Not found</h1></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return <div className="login-shell"><div className="meta">Loading…</div></div>;
  if (!user) return <Login />;
  return (
    <SectionsProvider>
      <Shell />
    </SectionsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
