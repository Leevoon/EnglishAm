import React, { useState, useEffect } from 'react';
import { ieltsAPI } from '../../services/api';
import './IeltsSection.css';

const IeltsSpeaking = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await ieltsAPI.getSpeaking();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading IELTS Speaking tests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ielts-section">
      <div className="container">
        <h1>IELTS Speaking Tests</h1>
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
          <p>No IELTS Speaking tests available</p>
        )}
      </div>
    </div>
  );
};

export default IeltsSpeaking;



