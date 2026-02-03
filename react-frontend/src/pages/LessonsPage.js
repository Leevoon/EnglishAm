import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LessonsPage.css';

const LessonsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Lessons' },
    { id: 'vocabulary', label: 'Vocabulary' },
    { id: 'grammar', label: 'Grammar' },
    { id: 'pronunciation', label: 'Pronunciation' },
    { id: 'idioms', label: 'Idioms & Phrases' }
  ];

  const lessons = [
    { id: 1, title: 'Basic Vocabulary', category: 'vocabulary', level: 'Beginner', duration: '15 min', image: 'lesson-1.jpg', description: 'Learn essential everyday words' },
    { id: 2, title: 'Present Tenses', category: 'grammar', level: 'Beginner', duration: '20 min', image: 'lesson-2.jpg', description: 'Master present simple and continuous' },
    { id: 3, title: 'English Sounds', category: 'pronunciation', level: 'Beginner', duration: '25 min', image: 'lesson-3.jpg', description: 'Perfect your pronunciation' },
    { id: 4, title: 'Business Vocabulary', category: 'vocabulary', level: 'Intermediate', duration: '30 min', image: 'lesson-4.jpg', description: 'Professional English terms' },
    { id: 5, title: 'Past Tenses', category: 'grammar', level: 'Intermediate', duration: '25 min', image: 'lesson-5.jpg', description: 'Past simple, continuous, and perfect' },
    { id: 6, title: 'Common Idioms', category: 'idioms', level: 'Intermediate', duration: '20 min', image: 'lesson-6.jpg', description: 'Popular English expressions' },
    { id: 7, title: 'Advanced Vocabulary', category: 'vocabulary', level: 'Advanced', duration: '35 min', image: 'lesson-7.jpg', description: 'Expand your vocabulary' },
    { id: 8, title: 'Complex Sentences', category: 'grammar', level: 'Advanced', duration: '30 min', image: 'lesson-8.jpg', description: 'Subordinate clauses and more' }
  ];

  const filteredLessons = activeCategory === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === activeCategory);

  const getLevelBadgeClass = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'badge-success';
      case 'intermediate': return 'badge-warning';
      case 'advanced': return 'badge-error';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="page lessons-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Lessons</h1>
          <p className="page-subtitle">Learn English with our interactive lessons</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Lessons Grid */}
          <div className="lessons-grid">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="lesson-card card">
                <div className="lesson-card-image">
                  <img
                    src={`/vendor/img/lessons/${lesson.image}`}
                    alt=""
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className={`lesson-level badge ${getLevelBadgeClass(lesson.level)}`}>
                    {lesson.level}
                  </span>
                </div>
                <div className="lesson-card-body">
                  <h3 className="lesson-title">{lesson.title}</h3>
                  <p className="lesson-description">{lesson.description}</p>
                  <div className="lesson-meta">
                    <span className="lesson-duration">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {lesson.duration}
                    </span>
                  </div>
                  <Link to={`/lessons/${lesson.id}`} className="btn btn-primary btn-block">
                    Start Lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="empty-state">
              <p>No lessons found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
