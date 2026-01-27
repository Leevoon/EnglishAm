import React, { useState, useEffect } from 'react';
import { contentAPI, homeAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import './About.css';

const About = () => {
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
      const [aboutResponse, imageResponse] = await Promise.all([
        contentAPI.getAbout(currentLanguage.id),
        homeAPI.getPageImages('home_page_about_us')
      ]);
      setContent(aboutResponse.data?.[0] || null);
      setPageImage(imageResponse.data);
    } catch (error) {
      console.error('Error loading about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultContent = {
    title: 'About Us',
    value: `<p>Educated Society NGO is a non-governmental organization established to set up a stable and easy-to-obtain education in response to a heightened awareness of the need for the modern language skills. It also undertakes a great deal of activities in the public sector.</p>
    <p>Our mission is to contribute to society through the pursuit of education, learning, and research at the highest international levels of excellence.</p>
    <h3>Our Vision</h3>
    <p>To be a leading platform for English language learning, providing high-quality education accessible to everyone, everywhere.</p>
    <h3>What We Offer</h3>
    <ul>
      <li>Comprehensive English language tests</li>
      <li>TOEFL and IELTS preparation courses</li>
      <li>Interactive training modules</li>
      <li>Downloadable learning materials</li>
      <li>Expert tutoring support</li>
    </ul>`
  };

  if (loading) {
    return (
      <div className="page about-page">
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">About Us</h1>
          </div>
        </div>
        <div className="page-content">
          <div className="container">
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayContent = content || defaultContent;

  return (
    <div className="page about-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{displayContent.title || 'About Us'}</h1>
          <p className="page-subtitle">Learn more about our mission and values</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="about-layout">
            <div className="about-main">
              <div 
                className="content-body"
                dangerouslySetInnerHTML={{ __html: displayContent.value }}
              />
            </div>
            <div className="about-sidebar">
              <div className="sidebar-image">
                <img 
                  src={pageImage?.home_page_about_us 
                    ? `/vendor/img/pages/${pageImage.home_page_about_us}`
                    : '/vendor/img/pages/about-us.jpg'}
                  alt="About English.am"
                />
              </div>
              <div className="contact-card card">
                <h3>Get in Touch</h3>
                <p>Have questions? We'd love to hear from you.</p>
                <a href="/contact" className="btn btn-primary btn-block">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
