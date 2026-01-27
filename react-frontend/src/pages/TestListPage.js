import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import './TestListPage.css';

const TestListPage = () => {
  const { category } = useParams();
  const { currentLanguage } = useApp();
  const [tests, setTests] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedVariant, setSelectedVariant] = useState('both');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    loadLevels();
  }, [currentLanguage.id]);

  useEffect(() => {
    loadTests();
  }, [category, currentLanguage.id, selectedLevel, selectedVariant, page]);

  const loadLevels = async () => {
    try {
      const response = await testsAPI.getLevels(currentLanguage.id);
      setLevels(response.data || []);
    } catch (error) {
      console.error('Error loading levels:', error);
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
      
      if (selectedLevel !== 'all') {
        params.levelId = selectedLevel;
      }
      if (selectedVariant !== 'both') {
        params.variant = selectedVariant;
      }

      const response = await testsAPI.getTests(params);
      setTests(response.data.tests || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading tests:', error);
      // Fallback data
      setTests(generateFallbackTests());
    } finally {
      setLoading(false);
    }
  };

  const getCategoryId = (cat) => {
    const categoryIds = {
      'audio': 1,
      'synonyms': 2,
      'antonyms': 3,
      'general-english': 4,
      'professional-english': 5,
      'photo': 6
    };
    return categoryIds[cat] || 1;
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
          {/* Filters */}
          <div className="test-filters">
            <div className="filter-group">
              <label className="filter-label">Level</label>
              <select 
                className="form-control form-select"
                value={selectedLevel}
                onChange={(e) => { setSelectedLevel(e.target.value); setPage(1); }}
              >
                <option value="all">All Levels</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.labels?.[0]?.name || `Level ${level.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">English Variant</label>
              <select 
                className="form-control form-select"
                value={selectedVariant}
                onChange={(e) => { setSelectedVariant(e.target.value); setPage(1); }}
              >
                <option value="both">Both</option>
                <option value="american">American English</option>
                <option value="british">British English</option>
              </select>
            </div>
          </div>

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
                onClick={() => { setSelectedLevel('all'); setSelectedVariant('both'); }}
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
  );
};

export default TestListPage;
