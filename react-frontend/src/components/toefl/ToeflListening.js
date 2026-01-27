import React, { useState, useEffect } from 'react';
import { toeflAPI } from '../../services/api';
import './ToeflSection.css';

const ToeflListening = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await toeflAPI.getListening();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading TOEFL Listening tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = async (testId) => {
    try {
      const response = await toeflAPI.getSection('listening', testId);
      setSelectedTest(response.data);
    } catch (error) {
      console.error('Error loading test:', error);
    }
  };

  if (loading) {
    return <div className="toefl-section">Loading TOEFL Listening tests...</div>;
  }

  if (selectedTest) {
    return (
      <div className="toefl-section">
        <div className="container">
          <h2>TOEFL Listening Test</h2>
          <div className="test-content">
            <div className="audio-section">
              <p>Audio player would be here</p>
            </div>
            {selectedTest.questions && selectedTest.questions.length > 0 && (
              <div className="questions-section">
                <h3>Questions</h3>
                {selectedTest.questions.map((question, index) => (
                  <div key={question.id || index} className="question-item">
                    <p>{question.text || `Question ${index + 1}`}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setSelectedTest(null)} className="btn btn-secondary">
              Back to Test List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="toefl-section">
      <div className="container">
        <h1>TOEFL Listening Tests</h1>
        <div className="tests-list">
          {tests.length > 0 ? (
            tests.map((test) => (
              <div
                key={test.id}
                className="test-item"
                onClick={() => handleTestSelect(test.id)}
              >
                <h3>{test.name || `Test ${test.id}`}</h3>
              </div>
            ))
          ) : (
            <p>No TOEFL Listening tests available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToeflListening;



