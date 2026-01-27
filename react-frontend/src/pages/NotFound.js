import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="page not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-illustration">
            <span className="error-code">404</span>
          </div>
          
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-message">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Go to Homepage
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline btn-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Go Back
            </button>
          </div>

          <div className="not-found-suggestions">
            <h3>You might be looking for:</h3>
            <ul className="suggestions-list">
              <li><Link to="/tests/general-english">English Tests</Link></li>
              <li><Link to="/toefl/reading">TOEFL Preparation</Link></li>
              <li><Link to="/ielts/general/reading">IELTS Practice</Link></li>
              <li><Link to="/lessons">Lessons</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
