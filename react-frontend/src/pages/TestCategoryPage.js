import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import TestLevelSelector from '../components/tests/TestLevelSelector';
import EnglishVariantSelector from '../components/tests/EnglishVariantSelector';
import './TestCategoryPage.css';

const TestCategoryPage = () => {
  const { categoryId } = useParams();
  const { currentLanguage } = useApp();
  const [tests, setTests] = useState([]);
  const [filters, setFilters] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    loadData();
  }, [categoryId, currentLanguage.id]);

  useEffect(() => {
    loadTests();
  }, [categoryId, selectedFilter, selectedLevel, selectedVariant, pagination.page, currentLanguage.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [filtersResponse, levelsResponse] = await Promise.all([
        testsAPI.getFilters(categoryId, currentLanguage.id),
        testsAPI.getLevels(currentLanguage.id)
      ]);
      setFilters(filtersResponse.data || []);
      setLevels(levelsResponse.data || []);
    } catch (error) {
      console.error('Error loading filters and levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTests = async () => {
    try {
      setLoading(true);
      const params = {
        categoryId,
        languageId: currentLanguage.id,
        filter: selectedFilter === 'all' ? null : selectedFilter,
        levelId: selectedLevel || null,
        variant: selectedVariant || null,
        page: pagination.page,
        limit: 10
      };

      // Remove null values
      Object.keys(params).forEach(key => params[key] === null && delete params[key]);

      const response = await testsAPI.getTests(params);
      setTests(response.data.tests || []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Check if this is the TEST main category (by checking categoryId or category key)
  const showVariantSelector = categoryId && categoryId === 'TEST'; // Adjust based on your category key/id

  return (
    <div className="test-category-page">
      <div className="container">
        <h1>Test Category</h1>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="filters-section">
            <h4>Filters:</h4>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All
              </button>
              {filters.map((filter) => {
                const label = filter.labels && filter.labels.length > 0 
                  ? filter.labels[0].name 
                  : `Filter ${filter.id}`;
                return (
                  <button
                    key={filter.id}
                    className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                    onClick={() => setSelectedFilter(filter.id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Level Selector */}
        {levels.length > 0 && (
          <TestLevelSelector
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
          />
        )}

        {/* Variant Selector (only for TEST main category) */}
        {showVariantSelector && (
          <EnglishVariantSelector
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
          />
        )}

        {/* Tests List */}
        {loading ? (
          <div className="loading">Loading tests...</div>
        ) : tests.length > 0 ? (
          <>
            <div className="tests-grid">
              {tests.map((test) => {
                const label = test.labels && test.labels.length > 0 
                  ? test.labels[0].name 
                  : `Test ${test.id}`;
                return (
                  <Link
                    key={test.id}
                    to={`/tests/${categoryId}/${test.id}`}
                    className="test-card"
                  >
                    <h3>{label}</h3>
                    {test.labels && test.labels[0] && test.labels[0].description && (
                      <p>{test.labels[0].description.substring(0, 100)}...</p>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-tests">No tests found</div>
        )}
      </div>
    </div>
  );
};

export default TestCategoryPage;

