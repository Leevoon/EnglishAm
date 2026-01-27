import React, { useState, useEffect } from 'react';
import { toeflAPI } from '../../services/api';
import './ToeflSection.css';

const ToeflSpeaking = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await toeflAPI.getSpeaking();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading TOEFL Speaking tests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="toefl-section">
      <div className="container">
        <h1>TOEFL Speaking Tests</h1>
        {loading ? (
          <p>Loading tests...</p>
        ) : tests.length > 0 ? (
          <div className="tests-list">
            {tests.map((test) => (
              <div key={test.id} className="test-item">
                <h3>{test.name || `Test ${test.id}`}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>No TOEFL Speaking tests available</p>
        )}
      </div>
    </div>
  );
};

export default ToeflSpeaking;



