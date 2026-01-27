import React, { useState, useEffect } from 'react';
import { homeAPI } from '../../services/api';
import './TestimonialsCarousel.css';

const TestimonialsCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    loadTestimonials();
    loadPageImages();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getTestimonials(5);
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPageImages = async () => {
    try {
      const response = await homeAPI.getPageImages('home_page_review');
      if (response.data && response.data.home_page_review) {
        setBackgroundImage(`/vendor/img/pages/${response.data.home_page_review}`);
      }
    } catch (error) {
      console.error('Error loading page images:', error);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return <div className="testimonials-loading">Loading testimonials...</div>;
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];
  const avatarUrl = currentTestimonial.user && currentTestimonial.user.avatar
    ? `/vendor/img/users_avatars/${currentTestimonial.user.avatar}`
    : '/vendor/img/default-avatar.png';

  const sectionStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <div className="section background-opacity slider-talk-about-us reviews testimonials-section" style={sectionStyle}>
      <div className="container">
        <div className="slider-talk-about-us-wrapper">
          <div className="slider-talk-about-us-content">
            <div className="testimonial-item active">
              <div className="testimonial-card card-base">
                <div className="testimonial-quote">
                  <i className="fa-solid fa-quote-left"></i>
                </div>
                <p className="testimonial-text">{currentTestimonial.review}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    <img src={avatarUrl} alt="User Avatar" className="img-responsive" />
                  </div>
                  <div className="testimonial-info">
                    <div className="testimonial-name">
                      {currentTestimonial.user 
                        ? `${currentTestimonial.user.first_name || ''} ${currentTestimonial.user.last_name || ''}`.trim()
                        : 'Anonymous'}
                    </div>
                    <div className="testimonial-profession">
                      {currentTestimonial.profession || 'Student'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {testimonials.length > 1 && (
        <div className="group-btn-slider">
          <button onClick={prevTestimonial} className="btn-prev carousel-control left">
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button onClick={nextTestimonial} className="btn-next carousel-control right">
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
