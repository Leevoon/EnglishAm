import { createContext, useContext, useEffect, useState } from 'react';
import { apiJson } from './api';

const SectionsContext = createContext({ sections: null, loading: true, error: null });

export function SectionsProvider({ children }) {
  const [state, setState] = useState({ sections: null, loading: true, error: null });

  useEffect(() => {
    apiJson('/api/sections/')
      .then((d) => setState({ sections: d.sections, loading: false, error: null }))
      .catch((e) => setState({ sections: null, loading: false, error: e.message }));
  }, []);

  return <SectionsContext.Provider value={state}>{children}</SectionsContext.Provider>;
}

export function useSections() {
  return useContext(SectionsContext);
}

// The "Tests" submenu shows every section the data confirms as test-related:
// kind=categories (a category-keyed section) or kind=skills (has skill tables).
// Slugs whose data backing is missing (kind=unsupported) are NOT shown — when
// you add `overall_english_reading` etc. they'll appear automatically.
export function useTestMenuSections() {
  const { sections, loading, error } = useSections();
  if (loading || error || !sections) return { items: [], loading, error };
  const items = Object.values(sections).filter(
    (s) => s.kind === 'categories' || s.kind === 'skills',
  );
  return { items, loading: false, error: null };
}
