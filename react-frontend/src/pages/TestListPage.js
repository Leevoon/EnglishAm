import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import './TestListPage.css';

// Per-category filter configuration (matches admin panel)
const categoryConfig = {
  'audio':                { hasLevels: true,  hasVariant: true,  hasSubcategories: false },
  'synonyms':             { hasLevels: true,  hasVariant: false, hasSubcategories: false },
  'antonyms':             { hasLevels: true,  hasVariant: false, hasSubcategories: false },
  'general-english':      { hasLevels: true,  hasVariant: false, hasSubcategories: true },
  'professional-english': { hasLevels: true,  hasVariant: false, hasSubcategories: true },
  'photo':                { hasLevels: false, hasVariant: false, hasSubcategories: true },
};

const TestListPage = () => {
  const { category } = useParams();
  const { currentLanguage } = useApp();
  const [tests, setTests] = useState([]);
  const [levels, setLevels] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedVariant, setSelectedVariant] = useState('both');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const config = categoryConfig[category] || { hasLevels: true, hasVariant: false, hasSubcategories: false };

  const categoryNames = {
    'audio': 'Audio Tests',
    'synonyms': 'Synonyms',
    'antonyms': 'Antonyms',
    'general-english': 'General English',
    'professional-english': 'Professional English',
    'photo': 'Photo Tests'
  };

  const categoryDescriptions = {
    'audio': 'Improve your listening skills with audio-based exercises',
    'synonyms': 'Expand your vocabulary by learning words with similar meanings',
    'antonyms': 'Learn words with opposite meanings',
    'general-english': 'Comprehensive tests covering grammar, vocabulary, and more',
    'professional-english': 'Business and professional English tests',
    'photo': 'Visual learning through picture-based tests'
  };

  // Reset filters when category changes
  useEffect(() => {
    setSelectedLevel('all');
    setSelectedVariant('both');
    setSelectedSubcategory('all');
    setPage(1);
  }, [category]);

  useEffect(() => {
    if (config.hasLevels) {
      loadLevels();
    }
    if (config.hasSubcategories) {
      loadSubcategories();
    }
  }, [category, currentLanguage.id]);

  useEffect(() => {
    loadTests();
  }, [category, currentLanguage.id, selectedLevel, selectedVariant, selectedSubcategory, page]);

  const loadLevels = async () => {
    try {
      const response = await testsAPI.getLevels(currentLanguage.id);
      setLevels(response.data || []);
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  };

  const loadSubcategories = async () => {
    try {
      const response = await testsAPI.getCategories(getCategoryId(category), currentLanguage.id);
      setSubcategories(response.data || []);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const loadTests = async () => {
    try {
      setLoading(true);
      const params = {
        categoryId: getCategoryId(category),
        languageId: currentLanguage.id,
        page,
        limit: 12
      };

      if (config.hasLevels && selectedLevel !== 'all') {
        params.levelId = selectedLevel;
      }
      if (config.hasVariant && selectedVariant !== 'both') {
        params.variant = selectedVariant;
      }
      if (config.hasSubcategories && selectedSubcategory !== 'all') {
        params.filter = selectedSubcategory;
      }

      const response = await testsAPI.getTests(params);
      setTests(response.data.tests || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading tests:', error);
      setTests(generateFallbackTests());
    } finally {
      setLoading(false);
    }
  };

  const getCategoryId = (cat) => {
    const categoryIds = {
      'audio': 15,
      'synonyms': 19,
      'antonyms': 23,
      'general-english': 2,
      'professional-english': 3,
      'photo': 4
    };
    return categoryIds[cat] || 2;
  };

  const generateFallbackTests = () => {
    const tests = [];
    for (let i = 1; i <= 8; i++) {
      tests.push({
        id: i,
        labels: [{ name: `Test ${i}` }],
        level_id: (i % 3) + 1,
        created_date: `2024-0${i}-01`
      });
    }
    return tests;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getLevelName = (levelId) => {
    const level = levels.find(l => l.id === levelId);
    return level?.labels?.[0]?.name || 'All Levels';
  };

  return (
    <div className="page test-list-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{categoryNames[category] || 'Tests'}</h1>
          <p className="page-subtitle">{categoryDescriptions[category] || 'Practice and improve your English'}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Top Chip Filters (subcategories + variant) */}
          {(config.hasSubcategories || config.hasVariant) && (
            <div className="top-chip-filters">
              {config.hasSubcategories && subcategories.length > 0 && (
                <div className="chip-filter-row">
                  <button
                    className={`chip-filter ${selectedSubcategory === 'all' ? 'active' : ''}`}
                    onClick={() => { setSelectedSubcategory('all'); setPage(1); }}
                  >
                    all
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      className={`chip-filter ${String(selectedSubcategory) === String(sub.id) ? 'active' : ''}`}
                      onClick={() => { setSelectedSubcategory(sub.id); setPage(1); }}
                    >
                      {sub.labels?.[0]?.name || `Category ${sub.id}`}
                    </button>
                  ))}
                </div>
              )}

              {config.hasVariant && (
                <div className="chip-filter-row">
                  <button
                    className={`chip-filter ${selectedVariant === 'both' ? 'active' : ''}`}
                    onClick={() => { setSelectedVariant('both'); setPage(1); }}
                  >
                    Both
                  </button>
                  <button
                    className={`chip-filter ${selectedVariant === 'american' ? 'active' : ''}`}
                    onClick={() => { setSelectedVariant('american'); setPage(1); }}
                  >
                    American English
                  </button>
                  <button
                    className={`chip-filter ${selectedVariant === 'british' ? 'active' : ''}`}
                    onClick={() => { setSelectedVariant('british'); setPage(1); }}
                  >
                    British English
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Main Layout: Level sidebar + Tests */}
          <div className="test-list-layout">
            {config.hasLevels && (
              <aside className="level-sidebar">
                <ul className="level-list">
                  <li>
                    <button
                      className={`level-item ${selectedLevel === 'all' ? 'active' : ''}`}
                      onClick={() => { setSelectedLevel('all'); setPage(1); }}
                    >
                      All
                    </button>
                  </li>
                  {levels.map((level) => (
                    <li key={level.id}>
                      <button
                        className={`level-item ${String(selectedLevel) === String(level.id) ? 'active' : ''}`}
                        onClick={() => { setSelectedLevel(level.id); setPage(1); }}
                      >
                        {level.labels?.[0]?.name || `Level ${level.id}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="test-list-main">
              {/* Tests Grid */}
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p className="loading-text">Loading tests...</p>
                </div>
              ) : tests.length === 0 ? (
                <div className="empty-state">
                  <p>No tests found matching your criteria.</p>
                  <button
                    className="btn btn-outline"
                    onClick={() => { setSelectedLevel('all'); setSelectedVariant('both'); setSelectedSubcategory('all'); }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="tests-grid">
                    {tests.map((test) => {
                      const testName = test.labels?.[0]?.name || `Test ${test.id}`;
                      return (
                        <div key={test.id} className="test-card card">
                          <div className="test-card-header">
                            <span className="test-level badge badge-primary">
                              {getLevelName(test.level_id)}
                            </span>
                            <span className="test-date">{formatDate(test.created_date)}</span>
                          </div>
                          <div className="test-card-body">
                            <h3 className="test-title">{testName}</h3>
                            <p className="test-category">{categoryNames[category]}</p>
                          </div>
                          <div className="test-card-footer">
                            <Link
                              to={`/tests/${category}/${test.id}`}
                              className="btn btn-primary btn-block"
                            >
                              Begin Test
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-link"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          className={`pagination-link ${p === page ? 'active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        className="pagination-link"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestListPage;
