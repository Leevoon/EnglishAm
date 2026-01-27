import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testsAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './PopularTests.css';

const PopularTests = () => {
  const { currentLanguage } = useApp();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularTests();
  }, [currentLanguage.id]);

  const loadPopularTests = async () => {
    try {
      setLoading(true);
      // Load tests from different categories
      const response = await testsAPI.getTests({
        languageId: currentLanguage.id,
        page: 1,
        limit: 4
      });
      setTests(response.data.tests || []);
    } catch (error) {
      console.error('Error loading popular tests:', error);
      // Set fallback data for demo
      setTests([
        {
          id: 1,
          labels: [{ name: 'Test IV' }],
          category_id: 1,
          created_date: '2019-04-01',
          level: 'Free Access',
          categoryName: 'PRESENT SIMPLE & PRESENT PROGRESSIVE'
        },
        {
          id: 2,
          labels: [{ name: 'Test I' }],
          category_id: 1,
          created_date: '2019-04-01',
          level: 'Free Access',
          categoryName: 'PRESENT SIMPLE & PRESENT PROGRESSIVE'
        },
        {
          id: 3,
          labels: [{ name: 'Test I' }],
          category_id: 2,
          created_date: '2017-03-24',
          level: 'Free Access',
          categoryName: 'BASIC'
        },
        {
          id: 4,
          labels: [{ name: 'Test III' }],
          category_id: 1,
          created_date: '2019-07-01',
          level: 'Free Access',
          categoryName: 'PAST SIMPLE & PAST PROGRESSIVE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return { month, year };
  };

  if (loading) {
    return (
      <section className="popular-tests-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">the most popular tests</span>
          </div>
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading tests...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-tests-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">the most popular tests</span>
        </div>

        <div className="tests-grid">
          {tests.map((test) => {
            const { month, year } = formatDate(test.created_date);
            const testName = test.labels?.[0]?.name || `Test ${test.id}`;
            
            return (
              <div key={test.id} className="test-card">
                <div className="test-card-date">
                  <span className="date-month">{month}</span>
                  <span className="date-year">{year}</span>
                </div>
                <div className="test-card-content">
                  <h3 className="test-card-title">{testName}</h3>
                  <p className="test-card-category">
                    {test.categoryName || 'General English'}
                  </p>
                  <span className="test-card-badge">
                    {test.level || 'Free Access'}
                  </span>
                </div>
                <Link 
                  to={`/tests/general-english/${test.id}`}
                  className="test-card-button"
                >
                  begin a test
                </Link>
              </div>
            );
          })}
        </div>

        <div className="section-footer">
          <Link to="/tests/general-english" className="btn btn-outline">
            view more
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularTests;
