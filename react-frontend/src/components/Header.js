import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const TEST_CATEGORIES = [
  { key: 'audio', label: 'Audio Tests' },
  { key: 'synonyms', label: 'Synonyms' },
  { key: 'antonyms', label: 'Antonyms' },
  { key: 'general', label: 'General English' },
  { key: 'professional', label: 'Professional English' },
  { key: 'photo', label: 'Photo Tests' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { languages, languageId, setLanguageId, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => { logout(); setUserMenu(false); navigate('/'); };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">english.am</Link>

        <button className="btn ghost menu-toggle" onClick={() => setMenuOpen((m) => !m)} aria-label="Menu">☰</button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
          <div className="nav-item">
            <span>{t('tests', 'Tests')} ▾</span>
            <div className="dropdown">
              {TEST_CATEGORIES.map((c) => (
                <Link key={c.key} to={`/tests/${c.key}`}>{c.label}</Link>
              ))}
            </div>
          </div>
          <div className="nav-item">
            <span>TOEFL iBT ▾</span>
            <div className="dropdown">
              <Link to="/toefl/reading">Reading</Link>
              <Link to="/toefl/listening">Listening</Link>
              <Link to="/toefl/speaking">Speaking</Link>
              <div className="dropdown-section">Writing</div>
              <Link to="/toefl/writing/integrated">Integrated Writing</Link>
              <Link to="/toefl/writing/independent">Independent Writing</Link>
              <Link to="/toefl/complete">Complete Test</Link>
            </div>
          </div>
          <div className="nav-item">
            <span>IELTS ▾</span>
            <div className="dropdown">
              <div className="dropdown-section">General Training</div>
              <Link to="/ielts/general/reading">Reading</Link>
              <Link to="/ielts/general/listening">Listening</Link>
              <Link to="/ielts/general/speaking">Speaking</Link>
              <Link to="/ielts/general/writing">Writing</Link>
              <Link to="/ielts/general/complete">Complete</Link>
              <div className="dropdown-section">Academic</div>
              <Link to="/ielts/academic/reading">Reading</Link>
              <Link to="/ielts/academic/listening">Listening</Link>
              <Link to="/ielts/academic/speaking">Speaking</Link>
              <Link to="/ielts/academic/writing">Writing</Link>
              <Link to="/ielts/academic/complete">Complete</Link>
            </div>
          </div>
          <div className="nav-item">
            <span>Training ▾</span>
            <div className="dropdown">
              <Link to="/training/reading">Reading Skills</Link>
              <Link to="/training/listening">Listening Skills</Link>
              <Link to="/training/speaking">Speaking Skills</Link>
              <Link to="/training/writing">Writing Skills</Link>
            </div>
          </div>
          <NavLink to="/lessons">{t('lessons', 'Lessons')}</NavLink>
          <NavLink to="/faq">{t('faq', 'FAQ')}</NavLink>
        </nav>

        <div className="auth-area">
          <select className="lang-select" value={languageId} onChange={(e) => setLanguageId(parseInt(e.target.value, 10))} aria-label="Language">
            {languages.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          {!user && (
            <>
              <Link to="/login" className="btn outline">{t('login', 'Login')}</Link>
              <Link to="/register" className="btn">{t('register', 'Register')}</Link>
            </>
          )}
          {user && (
            <div className={`user-menu ${userMenu ? 'open' : ''}`} onMouseLeave={() => setUserMenu(false)}>
              <button className="avatar" onClick={() => setUserMenu((m) => !m)} aria-label="Account">
                {(user.first_name || user.user_name || '?')[0].toUpperCase()}
              </button>
              <div className="menu-pop">
                <Link to="/account" onClick={() => setUserMenu(false)}>📊 Dashboard</Link>
                <Link to="/account/profile" onClick={() => setUserMenu(false)}>👤 My Profile</Link>
                <Link to="/account/results" onClick={() => setUserMenu(false)}>📝 My Results</Link>
                <Link to="/account/statistics" onClick={() => setUserMenu(false)}>📈 Statistics</Link>
                <Link to="/account/subscription" onClick={() => setUserMenu(false)}>💳 Subscription</Link>
                <Link to="/account/change-password" onClick={() => setUserMenu(false)}>🔒 Change Password</Link>
                <button onClick={onLogout}>🚪 {t('logout', 'Logout')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
