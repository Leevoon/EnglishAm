import React, { useState, useEffect } from 'react';
import { homeAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const { currentLanguage } = useApp();
  const [content, setContent] = useState(null);
  const [pageImage, setPageImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [currentLanguage.id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [contentResponse, imageResponse] = await Promise.all([
        homeAPI.getWhyChoose(currentLanguage.id),
        homeAPI.getPageImages('home_page_why_section,home_page_why_section_girl')
      ]);
      setContent(contentResponse.data);
      setPageImage(imageResponse.data);
    } catch (error) {
      console.error('Error loading why choose content:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: '📝',
      title: 'myriads of online tests',
      description: 'Access thousands of tests across all categories'
    },
    {
      icon: '👑',
      title: 'paid membership options',
      description: 'Premium features for serious learners'
    },
    {
      icon: '📚',
      title: 'thousands of downloadable books',
      description: 'Build your own digital library'
    },
    {
      icon: '🎤',
      title: 'speaking and writing engines',
      description: 'Practice and improve your skills'
    },
    {
      icon: '🔄',
      title: 'free updates and support',
      description: 'Always stay current with new content'
    },
    {
      icon: '💳',
      title: 'flexible payment methods',
      description: 'Choose what works best for you'
    }
  ];

  return (
    <section className="why-choose-section">
      <div className="container">
        <div className="why-choose-grid">
          {/* Content Side */}
          <div className="why-choose-content">
            <div className="section-header">
              <h2 className="section-title">Why Choose Us</h2>
            </div>

            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">
                    <span>{feature.icon}</span>
                  </div>
                  <div className="feature-text">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#membership" className="btn btn-primary btn-lg">
              learn more
            </a>
          </div>

          {/* Image Side */}
          <div className="why-choose-image">
            <div className="image-wrapper">
              <img 
                src={pageImage?.home_page_why_section 
                  ? `/vendor/img/pages/${pageImage.home_page_why_section}`
                  : '/vendor/img/pages/why-choose-us.jpg'}
                alt="Why Choose English.am"
              />
              <div className="image-overlay"></div>
            </div>
            {pageImage?.home_page_why_section_girl && (
              <div className="floating-image">
                <img 
                  src={`/vendor/img/pages/${pageImage.home_page_why_section_girl}`}
                  alt="Student learning"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;


