import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose, isAuthenticated, user, onLogout }) => {
  const { currentLanguage, setCurrentLanguage } = useApp();
  const [expandedMenus, setExpandedMenus] = useState([]);

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const languages = [
    { id: 1, code: 'en', name: 'English', flag: '🇬🇧' },
    { id: 2, code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { id: 3, code: 'hy', name: 'Հայdelays', flag: '🇦🇲' },
    { id: 4, code: 'zh', name: '中文', flag: '🇨🇳' },
    { id: 5, code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 6, code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const menuItems = [
    { label: 'about us', path: '/about', type: 'link' },
    {
      label: 'TESTS',
      key: 'tests',
      type: 'accordion',
      children: [
        { label: 'AUDIO TESTS', path: '/tests/audio' },
        { label: 'SYNONYMS', path: '/tests/synonyms' },
        { label: 'ANTONYMS', path: '/tests/antonyms' },
        { label: 'GENERAL ENGLISH', path: '/tests/general-english' },
        { label: 'PROFESSIONAL ENGLISH', path: '/tests/professional-english' },
        { label: 'PHOTO TESTS', path: '/tests/photo' }
      ]
    },
    {
      label: 'TOEFL iBT',
      key: 'toefl',
      type: 'accordion',
      children: [
        { label: 'READING', path: '/toefl/reading' },
        { label: 'LISTENING', path: '/toefl/listening' },
        { label: 'SPEAKING', path: '/toefl/speaking' },
        { label: 'WRITING - Integrated', path: '/toefl/writing/integrated' },
        { label: 'WRITING - Independent', path: '/toefl/writing/independent' },
        { label: 'COMPLETE TEST', path: '/toefl/complete' }
      ]
    },
    {
      label: 'IELTS',
      key: 'ielts',
      type: 'accordion',
      children: [
        { label: 'General - Reading', path: '/ielts/general/reading' },
        { label: 'General - Listening', path: '/ielts/general/listening' },
        { label: 'General - Speaking', path: '/ielts/general/speaking' },
        { label: 'General - Writing', path: '/ielts/general/writing' },
        { label: 'General - Complete', path: '/ielts/general/complete' },
        { label: 'Academic - Reading', path: '/ielts/academic/reading' },
        { label: 'Academic - Listening', path: '/ielts/academic/listening' },
        { label: 'Academic - Speaking', path: '/ielts/academic/speaking' },
        { label: 'Academic - Writing', path: '/ielts/academic/writing' },
        { label: 'Academic - Complete', path: '/ielts/academic/complete' }
      ]
    },
    {
      label: 'Training',
      key: 'training',
      type: 'accordion',
      children: [
        { label: 'Reading Skills', path: '/training/reading' },
        { label: 'Listening Skills', path: '/training/listening' },
        { label: 'Speaking Skills', path: '/training/speaking' },
        { label: 'Writing Skills', path: '/training/writing' }
      ]
    },
    { label: 'lessons', path: '/lessons', type: 'link' },
    { label: 'contact us', path: '/contact', type: 'link' }
  ];

  const accountMenuItems = [
    { label: 'Dashboard', path: '/account' },
    { label: 'My Profile', path: '/account/profile' },
    { label: 'My Results', path: '/account/results' },
    { label: 'Statistics', path: '/account/statistics' },
    { label: 'Subscription', path: '/account/subscription' },
    { label: 'Change Password', path: '/account/change-password' }
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {/* User Section */}
        {isAuthenticated && user && (
          <div className="mobile-menu-user">
            <div className="mobile-user-avatar">
              {user.avatar ? (
                <img src={`/vendor/img/avatars/${user.avatar}`} alt="" />
              ) : (
                <span>{user.user_name?.substring(0, 2).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="mobile-user-info">
              <div className="mobile-user-name">
                {user.first_name || user.user_name}
              </div>
              <div className="mobile-user-email">{user.email}</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mobile-menu-nav">
          <ul className="mobile-menu-list">
            {menuItems.map((item, index) => (
              <li key={index} className="mobile-menu-item">
                {item.type === 'link' ? (
                  <NavLink 
                    to={item.path} 
                    className="mobile-menu-link"
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <>
                    <button
                      className={`mobile-menu-accordion ${expandedMenus.includes(item.key) ? 'expanded' : ''}`}
                      onClick={() => toggleSubmenu(item.key)}
                    >
                      {item.label}
                      <svg className="accordion-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <ul className={`mobile-submenu ${expandedMenus.includes(item.key) ? 'expanded' : ''}`}>
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link 
                            to={child.path} 
                            className="mobile-submenu-link"
                            onClick={handleLinkClick}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Account Menu (if logged in) */}
        {isAuthenticated && (
          <>
            <div className="mobile-menu-divider"></div>
            <div className="mobile-menu-section">
              <div className="mobile-menu-section-title">My Account</div>
              <ul className="mobile-menu-list">
                {accountMenuItems.map((item, index) => (
                  <li key={index} className="mobile-menu-item">
                    <Link 
                      to={item.path} 
                      className="mobile-menu-link"
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Language Selector */}
        <div className="mobile-menu-divider"></div>
        <div className="mobile-menu-section">
          <div className="mobile-menu-section-title">Language</div>
          <div className="mobile-language-grid">
            {languages.map((lang) => (
              <button
                key={lang.id}
                className={`mobile-language-btn ${currentLanguage.id === lang.id ? 'active' : ''}`}
                onClick={() => setCurrentLanguage(lang)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auth Actions */}
        <div className="mobile-menu-footer">
          {isAuthenticated ? (
            <button className="mobile-logout-btn" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn btn-primary btn-block" onClick={handleLinkClick}>
                Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-block" onClick={handleLinkClick}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
