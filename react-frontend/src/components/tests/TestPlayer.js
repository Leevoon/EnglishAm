import React, { useState } from 'react';
import AudioTest from './AudioTest';
import AdComponent from './AdComponent';
import './TestPlayer.css';

const TestPlayer = ({ tests, testCategoryId, onTestComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const currentTest = tests && tests[currentPage] ? tests[currentPage] : null;
  const totalPages = tests ? tests.length : 0;

  const handleAnswerChange = (answerId) => {
    setAnswers({
      ...answers,
      [currentTest.id]: answerId
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    // Collect all answers in the format expected by the API
    const answerArray = Object.keys(answers).map(testId => ({
      test_id: parseInt(testId),
      answer_id: answers[testId]
    }));

    if (onTestComplete) {
      try {
        const result = await onTestComplete(answerArray);
        setResults(result);
        setShowResults(true);
      } catch (error) {
        console.error('Error submitting test:', error);
        alert('Error submitting test. Please try again.');
      }
    }
  };

  if (showResults && results) {
    return (
      <div className="test-results">
        <h2>Test Results</h2>
        <div className="result-score">
          <h3>Score: {results.score}%</h3>
          <p>Correct: {results.correct} out of {results.total}</p>
        </div>
        <div className="result-details">
          <h4>Answer Details:</h4>
          {results.results && results.results.map((result, index) => (
            <div key={index} className={`result-item ${result.correct ? 'correct' : 'incorrect'}`}>
              Question {index + 1}: {result.correct ? '✓ Correct' : '✗ Incorrect'}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return <div className="test-player">No test available</div>;
  }

  return (
    <div className="test-container">
      <div className="test-sidebar">
        <AdComponent testId={testCategoryId} />
      </div>
      <div className="test-content">
        <div className="test-header">
          <h3>Test Question {currentPage + 1} of {totalPages}</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>

        <AudioTest
          test={currentTest}
          selectedAnswer={answers[currentTest.id] || null}
          onAnswerChange={handleAnswerChange}
        />

        <div className="test-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>
          {currentPage < totalPages - 1 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-success"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPlayer;



