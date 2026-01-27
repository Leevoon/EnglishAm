import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './AboutSection.css';

const AboutSection = () => {
  const { currentLanguage } = useApp();
  const [aboutContent, setAboutContent] = useState(null);
  const [pageImage, setPageImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, [currentLanguage.id]);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const [aboutResponse, imageResponse] = await Promise.all([
        homeAPI.getAbout(currentLanguage.id),
        homeAPI.getPageImages('home_page_about_us')
      ]);
      setAboutContent(aboutResponse.data);
      setPageImage(imageResponse.data);
    } catch (error) {
      console.error('Error loading about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultContent = {
    title: 'about us',
    value: 'Educated Society NGO is a non-governmental organization established to set up a stable and easy-to-obtain education in response to a heightened awareness of the need for the modern language skills. It also undertakes a great deal of activities in the public sector.'
  };

  const content = aboutContent || defaultContent;

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-grid">
          {/* Content Side */}
          <div className="about-content">
            <div className="section-header">
              <h2 className="section-title">{content.title || 'about us'}</h2>
            </div>
            <div className="about-text">
              <p>
                {stripHtml(content.value).substring(0, 500)}
                {content.value && content.value.length > 500 ? '...' : ''}
              </p>
            </div>
            <Link to="/about" className="btn btn-primary">
              learn more
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          {/* Image Side */}
          <div className="about-image">
            <div className="image-frame">
              <img 
                src={pageImage?.home_page_about_us 
                  ? `/vendor/img/pages/${pageImage.home_page_about_us}`
                  : '/vendor/img/pages/about-us.jpg'}
                alt="About English.am"
              />
            </div>
            <div className="image-accent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


