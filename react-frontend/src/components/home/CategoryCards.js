import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCards.css';

const CategoryCards = () => {
  const categories = [
    {
      id: 1,
      title: 'new words',
      description: 'Expand your vocabulary with our comprehensive word lists',
      icon: '📚',
      path: '/lessons',
      color: '#4CAF50'
    },
    {
      id: 2,
      title: 'dialogs',
      description: 'Practice real-life conversations and improve speaking',
      icon: '💬',
      path: '/training/speaking',
      color: '#2196F3'
    },
    {
      id: 3,
      title: 'picture dictionary',
      description: 'Learn words through visual associations',
      icon: '🖼️',
      path: '/tests/photo',
      color: '#FF9800'
    }
  ];

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
              to={category.path} 
              key={category.id} 
              className="category-card"
              style={{ '--card-color': category.color }}
            >
              <div className="category-icon">
                <span>{category.icon}</span>
              </div>
              <h3 className="category-title">{category.title}</h3>
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
