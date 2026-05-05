import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [languages, setLanguages] = useState([]);
  const [languageId, setLanguageId] = useState(
    parseInt(localStorage.getItem('language_id') || '1', 10),
  );
  const [t, setT] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.get('/languages').then((r) => setLanguages(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('language_id', String(languageId));
    setReady(false);
    api.get('/translations', { params: { lang: languageId } })
      .then((r) => setT(r.data || {}))
      .finally(() => setReady(true));
  }, [languageId]);

  const tr = (key, fallback) => (t && t[key]) || fallback || key;

  return (
    <LanguageContext.Provider value={{ languages, languageId, setLanguageId, t: tr, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
