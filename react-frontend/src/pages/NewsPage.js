import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import './NewsPage.css';

const NewsPage = () => {
  const { currentLanguage } = useApp();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadNews();
  }, [currentLanguage.id, page]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getNews(currentLanguage.id, 9);
      setNews(response.data || []);
      setHasMore(false); // Simplified for now
    } catch (error) {
      console.error('Error loading news:', error);
      // Fallback data
      setNews([
        { id: 1, image: 'news-1.jpg', created_date: '2024-01-15', newsLabels: [{ title: 'New TOEFL Tests Available', value: 'We have added new TOEFL practice tests to help you prepare for your exam.' }] },
        { id: 2, image: 'news-2.jpg', created_date: '2024-01-10', newsLabels: [{ title: 'IELTS Preparation Tips', value: 'Expert tips and strategies for acing your IELTS examination.' }] },
        { id: 3, image: 'news-3.jpg', created_date: '2024-01-05', newsLabels: [{ title: 'Mobile App Coming Soon', value: 'Learn English on the go with our upcoming mobile application.' }] },
        { id: 4, image: 'news-4.jpg', created_date: '2024-01-01', newsLabels: [{ title: 'New Year, New Goals', value: 'Start the year right with our special English learning programs.' }] },
        { id: 5, image: 'news-5.jpg', created_date: '2023-12-20', newsLabels: [{ title: 'Holiday Learning Specials', value: 'Take advantage of our holiday discounts on premium memberships.' }] },
        { id: 6, image: 'news-6.jpg', created_date: '2023-12-15', newsLabels: [{ title: 'Grammar Made Easy', value: 'Our new grammar section makes learning English grammar simple and fun.' }] }
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

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    <div className="page news-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">News & Updates</h1>
          <p className="page-subtitle">Stay updated with the latest from English.am</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {loading && news.length === 0 ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="empty-state">
              <p>No news articles available at the moment.</p>
            </div>
          ) : (
            <>
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
                      </div>
                      <div className="news-card-body">
                        <span className="news-card-date">
                          {formatDate(item.created_date)}
                        </span>
                        <h2 className="news-card-title">
                          <Link to={`/news/${item.id}`}>
                            {label?.title || 'Untitled'}
                          </Link>
                        </h2>
                        <p className="news-card-excerpt">
                          {truncateText(label?.value)}
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

              {hasMore && (
                <div className="load-more">
                  <button 
                    className="btn btn-outline btn-lg"
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More'}
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

export default NewsPage;
