import React, { useState, useEffect } from 'react';
import { homeAPI } from '../services/api';
import './GalleryPage.css';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getGallery(20);
      setImages(response.data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      // Fallback data
      const fallback = [];
      for (let i = 1; i <= 12; i++) {
        fallback.push({ id: i, image: `gallery-${i}.jpg`, title: `Gallery Image ${i}` });
      }
      setImages(fallback);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction) => {
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    setSelectedImage(images[newIndex]);
  };

  return (
    <div className="page gallery-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">Pictures and memories from English.am</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <p>No images available in the gallery.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((image, index) => (
                <div 
                  key={image.id} 
                  className="gallery-item"
                  onClick={() => openLightbox(image)}
                >
                  <img 
                    src={image.image 
                      ? `/vendor/img/gallery/${image.image}`
                      : `/vendor/img/gallery/default-${(index % 6) + 1}.jpg`}
                    alt={image.title || `Gallery image ${index + 1}`}
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
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          <button 
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.image 
                ? `/vendor/img/gallery/${selectedImage.image}`
                : '/vendor/img/gallery/default.jpg'}
              alt={selectedImage.title || 'Gallery image'}
            />
          </div>
          
          <button 
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
