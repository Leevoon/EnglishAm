import React, { useEffect, useState } from 'react';
import { adsAPI } from '../../services/api';
import './AdComponent.css';

const AdComponent = ({ testId }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (testId) {
      loadAd();
    } else {
      setLoading(false);
    }
  }, [testId]);

  const loadAd = async () => {
    try {
      setLoading(true);
      const response = await adsAPI.getTestAd(testId);
      if (response.data) {
        setAd(response.data);
      }
    } catch (error) {
      console.error('Error loading ad:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ad-component">
        <div className="ad-placeholder">Loading ad...</div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="ad-component">
        <div className="ad-placeholder">Ad space available</div>
      </div>
    );
  }

  const renderAd = () => {
    switch (ad.ad_type) {
      case 1: // Video
        return ad.video_url ? (
          <video controls className="ad-video">
            <source src={ad.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null;
      
      case 2: // Image
        return ad.image_url ? (
          <img src={ad.image_url} alt="Advertisement" className="ad-image" />
        ) : null;
      
      case 3: // Text
        return (
          <div 
            className="ad-text" 
            dangerouslySetInnerHTML={{ __html: ad.content }} 
          />
        );
      
      default:
        return <div className="ad-placeholder">Invalid ad type</div>;
    }
  };

  return (
    <div className="ad-component">
      <div className="ad-wrapper">
        {renderAd()}
      </div>
    </div>
  );
};

export default AdComponent;



