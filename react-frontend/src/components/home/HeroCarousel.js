import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { homeAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './HeroCarousel.css';

const HeroCarousel = () => {
  const { currentLanguage } = useApp();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    loadSlideshow();
  }, [currentLanguage.id]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const loadSlideshow = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getSlideshow(currentLanguage.id);
      setSlides(response.data || []);
    } catch (error) {
      console.error('Error loading slideshow:', error);
      // Fallback slides
      setSlides([
        {
          id: 1,
          image: 'slide-1.jpg',
          slideshowLabels: [{ value: '<h1>Learn English Online</h1><p>Master the language with our comprehensive courses</p>' }],
          href: '/tests/general-english'
        },
        {
          id: 2,
          image: 'slide-2.jpg',
          slideshowLabels: [{ value: '<h1>TOEFL & IELTS Preparation</h1><p>Get ready for your international exams</p>' }],
          href: '/toefl/reading'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="hero-section hero-loading">
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="hero-section hero-default">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Welcome to English.am</h1>
            <p className="hero-subtitle">Your gateway to mastering English</p>
            <Link to="/tests/general-english" className="btn btn-primary btn-lg">
              Start Learning
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      <div className="carousel">
        {/* Slides */}
        <div className="carousel-inner">
          {slides.map((slide, index) => {
            const label = slide.slideshowLabels?.[0];
            return (
              <div
                key={slide.id}
                className={`carousel-slide ${index === currentIndex ? 'active' : ''} ${
                  index === (currentIndex - 1 + slides.length) % slides.length ? 'prev' : ''
                } ${index === (currentIndex + 1) % slides.length ? 'next' : ''}`}
                style={{
                  backgroundImage: `url(/vendor/img/slideshow/${slide.image})`
                }}
              >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <div className="container">
                    <div className="hero-text">
                      {label?.value ? (
                        <div dangerouslySetInnerHTML={{ __html: label.value }} />
                      ) : (
                        <>
                          <h1 className="hero-title">Learn English</h1>
                          <p className="hero-subtitle">Start your journey today</p>
                        </>
                      )}
                      {slide.href && (
                        <Link to={slide.href} className="btn btn-primary btn-lg hero-btn">
                          Start Learning Now
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              className="carousel-arrow carousel-arrow-prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              className="carousel-arrow carousel-arrow-next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {slides.length > 1 && (
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;


