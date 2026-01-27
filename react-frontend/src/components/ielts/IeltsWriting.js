import React, { useState, useEffect } from 'react';
import { ieltsAPI } from '../../services/api';
import './IeltsSection.css';

const IeltsWriting = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await ieltsAPI.getWriting();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading IELTS Writing tests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ielts-section">
      <div className="container">
        <h1>IELTS Writing Tests</h1>
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
          <p>No IELTS Writing tests available</p>
        )}
      </div>
    </div>
  );
};

export default IeltsWriting;



