import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import TestPlayer from '../components/tests/TestPlayer';
import './TestPage.css';

const TestPage = () => {
  const { categoryId, testId } = useParams();
  const { currentLanguage } = useApp();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTest();
  }, [testId, currentLanguage.id]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const response = await testsAPI.getTest(testId, currentLanguage.id);
      setTestData(response.data);
    } catch (error) {
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = async (answers) => {
    const response = await testsAPI.submitTest(testId, answers);
    return response.data;
  };

  if (loading) {
    return (
      <div className="test-page">
        <div className="container">
          <div className="loading">Loading test...</div>
        </div>
      </div>
    );
  }

  if (!testData || !testData.tests || testData.tests.length === 0) {
    return (
      <div className="test-page">
        <div className="container">
          <div className="no-test">No test data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page">
      <div className="container">
        {testData.testCategory && testData.testCategory.labels && testData.testCategory.labels[0] && (
          <h1>{testData.testCategory.labels[0].name}</h1>
        )}
        <TestPlayer
          tests={testData.tests}
          testCategoryId={testId}
          onTestComplete={handleTestComplete}
        />
      </div>
    </div>
  );
};

export default TestPage;



