import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './LanguageSelector.css';

const languages = [
  { id: 1, code: 'en', name: 'English', flag: '🇬🇧' },
  { id: 2, code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 3, code: 'hy', name: 'Հայերdelays', flag: '🇦🇲' },
  { id: 4, code: 'zh', name: '中文', flag: '🇨🇳' },
  { id: 5, code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 6, code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
  };

  const currentLang = languages.find(lang => lang.id === currentLanguage.id) || languages[0];

  return (
    <div className={`language-selector ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <button 
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="language-flag">{currentLang.flag}</span>
        <span className="language-name">{currentLang.name}</span>
        <svg className="language-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <ul className="language-dropdown" role="listbox">
        {languages.map((language) => (
          <li key={language.id}>
            <button
              className={`language-option ${currentLanguage.id === language.id ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language)}
              role="option"
              aria-selected={currentLanguage.id === language.id}
            >
              <span className="language-flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
              {currentLanguage.id === language.id && (
                <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSelector;
