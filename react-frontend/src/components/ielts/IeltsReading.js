import React, { useState, useEffect } from 'react';
import { ieltsAPI } from '../../services/api';
import './IeltsSection.css';

const IeltsReading = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await ieltsAPI.getReading();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading IELTS Reading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = async (testId) => {
    try {
      const response = await ieltsAPI.getSection('reading', testId);
      setSelectedTest(response.data);
    } catch (error) {
      console.error('Error loading test:', error);
    }
  };

  if (loading) {
    return <div className="ielts-section">Loading IELTS Reading tests...</div>;
  }

  if (selectedTest) {
    return (
      <div className="ielts-section">
        <div className="container">
          <h2>IELTS Reading Test</h2>
          <div className="test-content">
            <div className="reading-passage">
              {selectedTest.test && selectedTest.test.text && (
                <div dangerouslySetInnerHTML={{ __html: selectedTest.test.text }} />
              )}
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
    <div className="ielts-section">
      <div className="container">
        <h1>IELTS Reading Tests</h1>
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
            <p>No IELTS Reading tests available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IeltsReading;



