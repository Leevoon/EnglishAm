import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './LatestNews.css';

const LatestNews = () => {
  const { currentLanguage } = useApp();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [currentLanguage.id]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getNews(currentLanguage.id, 3);
      setNews(response.data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      // Fallback data
      setNews([
        {
          id: 1,
          image: 'news-1.jpg',
          created_date: '2024-01-15',
          newsLabels: [{ title: 'New TOEFL Tests Available', value: 'We have added new TOEFL practice tests...' }]
        },
        {
          id: 2,
          image: 'news-2.jpg',
          created_date: '2024-01-10',
          newsLabels: [{ title: 'IELTS Preparation Tips', value: 'Expert tips for acing your IELTS exam...' }]
        },
        {
          id: 3,
          image: 'news-3.jpg',
          created_date: '2024-01-05',
          newsLabels: [{ title: 'Mobile App Coming Soon', value: 'Learn English on the go with our new app...' }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="latest-news-section">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading news...</p>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="latest-news-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">latest news</span>
          <h2 className="section-title">all updates</h2>
          <Link to="/news" className="btn btn-outline section-link">
            browse news
          </Link>
        </div>

        <div className="news-grid">
          {news.map((item) => {
            const label = item.newsLabels?.[0];
            
            return (
              <article key={item.id} className="news-card">
                <div className="news-card-image">
                  <img 
                    src={item.image 
                      ? `/vendor/img/news/${item.image}`
                      : '/vendor/img/news/default.jpg'}
                    alt={label?.title || 'News'}
                  />
                  <div className="news-card-overlay">
                    <Link to={`/news/${item.id}`} className="read-more-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="news-card-body">
                  <span className="news-card-date">
                    {formatDate(item.created_date)}
                  </span>
                  <h3 className="news-card-title">
                    <Link to={`/news/${item.id}`}>
                      {label?.title || 'Untitled'}
                    </Link>
                  </h3>
                  <p className="news-card-excerpt">
                    {truncateText(label?.value?.replace(/<[^>]*>/g, '') || '', 100)}
                  </p>
                  <Link to={`/news/${item.id}`} className="news-card-link">
                    Read More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;


