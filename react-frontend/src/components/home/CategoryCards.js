import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { homeAPI } from '../../services/api';
import './CategoryCards.css';

const buildPath = (item) => {
  if (item.source_type === 'lessons_filter' && item.seo_name) {
    return `/lessons/${item.seo_name}/0`;
  }
  if (item.source_type === 'category') {
    return `/categories/${item.source_id}`;
  }
  return '/lessons';
};

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    homeAPI.getCategories()
      .then((res) => { if (!cancelled) setCategories(res.data || []); })
      .catch((err) => { console.error('Failed to load home categories', err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">choose a category</span>
          <h2 className="section-title">learn a language with us</h2>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={buildPath(category)}
              key={category.id}
              className="category-card"
              style={{ '--card-color': category.color || '#4CAF50' }}
            >
              <div className="category-icon">
                <span>{category.icon || '📘'}</span>
              </div>
              <h3 className="category-title">{(category.title || '').toLowerCase()}</h3>
              <p className="category-description">{category.description}</p>
              <span className="category-link">
                Explore
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
