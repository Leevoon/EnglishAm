import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ieltsAPI } from '../../services/api';
import './IeltsSection.css';

const IeltsReading = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine the base path (general or academic) from current URL
  const basePath = location.pathname.includes('/ielts/academic/')
    ? '/ielts/academic/reading'
    : '/ielts/general/reading';

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
      const response = await ieltsAPI.getReading();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading IELTS Reading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTest = async (id) => {
    try {
      const response = await ieltsAPI.getSection('reading', id);
      setSelectedTest(response.data);
    } catch (error) {
      console.error('Error loading test:', error);
    }
  };

  const handleTestSelect = (id) => {
    navigate(`${basePath}/${id}`);
  };

  const handleBack = () => {
    navigate(basePath);
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
