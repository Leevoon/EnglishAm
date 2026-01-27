import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeAPI } from '../../services/api';
import './GallerySection.css';

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getGallery(6);
      setImages(response.data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      // Fallback data
      setImages([
        { id: 1, image: 'gallery-1.jpg' },
        { id: 2, image: 'gallery-2.jpg' },
        { id: 3, image: 'gallery-3.jpg' },
        { id: 4, image: 'gallery-4.jpg' },
        { id: 5, image: 'gallery-5.jpg' },
        { id: 6, image: 'gallery-6.jpg' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">see and feel it</span>
          <h2 className="section-title">Pictures and gallery</h2>
        </div>

        <div className="gallery-grid">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className={`gallery-item ${index === 0 ? 'gallery-item-large' : ''}`}
            >
              <img 
                src={image.image 
                  ? `/vendor/img/gallery/${image.image}`
                  : `/vendor/img/gallery/default-${index + 1}.jpg`}
                alt={`Gallery image ${index + 1}`}
              />
              <div className="gallery-item-overlay">
                <span className="gallery-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="section-footer">
          <Link to="/gallery" className="btn btn-primary">
            View all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
