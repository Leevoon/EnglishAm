import React, { useState, useEffect } from 'react';
import { toeflAPI } from '../../services/api';
import './ToeflSection.css';

const ToeflComplete = () => {
  const [testData, setTestData] = useState(null);
  const [currentSection, setCurrentSection] = useState('reading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompleteTest();
  }, []);

  const loadCompleteTest = async () => {
    try {
      setLoading(true);
      const response = await toeflAPI.getComplete();
      setTestData(response.data);
    } catch (error) {
      console.error('Error loading complete TOEFL test:', error);
    } finally {
      setLoading(false);
    }
  };

  const sections = ['reading', 'listening', 'speaking', 'writing'];
  const currentIndex = sections.indexOf(currentSection);

  const handleNextSection = () => {
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    }
  };

  const handlePreviousSection = () => {
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  };

  if (loading) {
    return <div className="toefl-section">Loading complete TOEFL test...</div>;
  }

  if (!testData) {
    return <div className="toefl-section">No test data available</div>;
  }

  return (
    <div className="toefl-section">
      <div className="container">
        <h1>Complete TOEFL iBT Test</h1>
        <div className="section-progress">
          <div className="progress-indicator">
            {sections.map((section, index) => (
              <div
                key={section}
                className={`progress-step ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </div>
            ))}
          </div>
        </div>
        <div className="test-content">
          <h2>{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} Section</h2>
          {testData[currentSection] && (
            <div className="section-content">
              <p>Section content for {currentSection} would be displayed here</p>
            </div>
          )}
          <div className="section-navigation">
            <button
              onClick={handlePreviousSection}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
            >
              Previous Section
            </button>
            {currentIndex < sections.length - 1 ? (
              <button
                onClick={handleNextSection}
                className="btn btn-primary"
              >
                Next Section
              </button>
            ) : (
              <button className="btn btn-success">
                Submit Complete Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeflComplete;



