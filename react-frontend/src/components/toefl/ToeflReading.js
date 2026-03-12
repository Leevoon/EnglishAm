import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toeflAPI } from '../../services/api';
import './ToeflSection.css';

const ToeflReading = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    if (testId) {
      loadTest(testId);
    } else {
      setSelectedTest(null);
    }
  }, [testId]);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await toeflAPI.getReading();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading TOEFL Reading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTest = async (id) => {
    try {
      const response = await toeflAPI.getSection('reading', id);
      setSelectedTest(response.data);
    } catch (error) {
      console.error('Error loading test:', error);
    }
  };

  const handleTestSelect = (id) => {
    navigate(`/toefl/reading/${id}`);
  };

  const handleBack = () => {
    navigate('/toefl/reading');
  };

  if (loading) {
    return <div className="toefl-section">Loading TOEFL Reading tests...</div>;
  }

  if (selectedTest) {
    return (
      <div className="toefl-section">
        <div className="container">
          <h2>TOEFL Reading Test</h2>
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
                    <div dangerouslySetInnerHTML={{ __html: question.text || `Question ${index + 1}` }} />
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleBack} className="btn btn-secondary">
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
        <h1>TOEFL Reading Tests</h1>
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
            <p>No TOEFL Reading tests available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToeflReading;
