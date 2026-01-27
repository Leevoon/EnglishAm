import React, { useState, useEffect } from 'react';
import { toeflAPI } from '../../services/api';
import './ToeflSection.css';

const ToeflWriting = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await toeflAPI.getWriting();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading TOEFL Writing tests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="toefl-section">
      <div className="container">
        <h1>TOEFL Writing Tests</h1>
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
          <p>No TOEFL Writing tests available</p>
        )}
      </div>
    </div>
  );
};

export default ToeflWriting;



