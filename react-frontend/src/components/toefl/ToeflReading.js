import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toeflAPI } from '../../services/api';
import './ToeflSection.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const TEST_DURATION = 60 * 60; // 1 hour in seconds

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const ToeflReading = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const timerRef = useRef(null);

  useEffect(() => {
    loadTests();
  }, []);

  const handleSubmit = useCallback(async (answers) => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const response = await toeflAPI.submitSection('reading', testId, answers || selectedAnswers);
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  }, [testId, selectedAnswers]);

  useEffect(() => {
    if (testId) {
      loadTest(testId);
    } else {
      setSelectedTest(null);
      setSelectedAnswers({});
      setSubmitted(false);
      setResults(null);
      setCurrentQuestion(0);
      setTimeLeft(TEST_DURATION);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [testId]);

  // Timer
  useEffect(() => {
    if (selectedTest && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [selectedTest, submitted]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !submitted && selectedTest) {
      handleSubmit(selectedAnswers);
    }
  }, [timeLeft, submitted, selectedTest, handleSubmit, selectedAnswers]);

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
      setLoading(true);
      const response = await toeflAPI.getSection('reading', id);
      setSelectedTest(response.data);
      setTimeLeft(TEST_DURATION);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setSubmitted(false);
      setResults(null);
    } catch (error) {
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (id) => {
    navigate(`/toefl/reading/${id}`);
  };

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate('/toefl/reading');
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const getAllQuestions = () => {
    if (!selectedTest?.passages) return [];
    const questions = [];
    selectedTest.passages.forEach(passage => {
      if (passage.questions) {
        passage.questions.forEach(q => questions.push(q));
      }
    });
    return questions;
  };

  const getPassageText = () => {
    if (!selectedTest?.passages || selectedTest.passages.length === 0) return '';
    return selectedTest.passages.map(p => p.text).join('');
  };

  const handleNext = () => {
    const allQuestions = getAllQuestions();
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit(selectedAnswers);
    }
  };

  if (loading) {
    return <div className="toefl-section"><div className="container">Loading TOEFL Reading tests...</div></div>;
  }

  if (selectedTest) {
    const allQuestions = getAllQuestions();
    const passageText = getPassageText();
    const isLastQuestion = currentQuestion === allQuestions.length - 1;
    const question = allQuestions[currentQuestion];
    const isTimeLow = timeLeft <= 300;

    if (submitted && results) {
      return (
        <div className="toefl-section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h2 style={{ margin: 0 }}>TOEFL Reading - Results</h2>
              <button onClick={handleBack} className="btn btn-secondary">Back to List</button>
            </div>
            <div className="results-summary">
              <h3>Results</h3>
              <div className="score-display">{results.correct} / {results.total}</div>
              <div className="score-details">
                <span className="score-correct">Correct: {results.correct}</span>
                <span className="score-incorrect">Incorrect: {results.incorrect}</span>
              </div>
            </div>
            <div className="test-split-layout">
              <div className="passage-panel">
                <h3>Reading Passage</h3>
                <div dangerouslySetInnerHTML={{ __html: passageText }} />
              </div>
              <div className="questions-panel">
                <h3>Review</h3>
                <div className="questions-scroll">
                  {allQuestions.map((q, qIndex) => {
                    const qResult = results.results?.[q.id];
                    return (
                      <div key={q.id} className={`question-item ${qResult?.isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="question-number">Question {qIndex + 1}</div>
                        <div className="question-text" dangerouslySetInnerHTML={{ __html: q.text }} />
                        {q.answers && (
                          <div className="answer-options">
                            {q.answers.map((answer, aIndex) => {
                              const isSelected = String(selectedAnswers[q.id]) === String(answer.id);
                              let cls = 'answer-option disabled';
                              if (answer.true_false === 1) cls += ' correct-answer';
                              else if (isSelected) cls += ' wrong-answer';
                              const displayText = answer.text || answer.answer_question || '';
                              return (
                                <div key={answer.id} className={cls}>
                                  <span className="answer-letter">{LETTERS[aIndex]}</span>
                                  <span className="answer-text" dangerouslySetInnerHTML={{ __html: displayText }} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="toefl-section">
        <div className="container">
          <div className="test-header">
            <h2 style={{ margin: 0 }}>TOEFL Reading</h2>
            <div className="test-header-right">
              <div className={`timer ${isTimeLow ? 'timer-low' : ''}`}>{formatTime(timeLeft)}</div>
              <span className="question-counter">Question {currentQuestion + 1} / {allQuestions.length}</span>
            </div>
          </div>

          <div className="test-split-layout">
            <div className="passage-panel">
              <h3>Reading Passage</h3>
              <div dangerouslySetInnerHTML={{ __html: passageText }} />
            </div>

            <div className="questions-panel">
              {question && (
                <div className="single-question-view">
                  <div className="question-item">
                    <div className="question-number">Question {currentQuestion + 1}</div>
                    <div className="question-text" dangerouslySetInnerHTML={{ __html: question.text }} />

                    {question.answers && question.answers.length > 0 && (
                      <div className="answer-options">
                        {question.answers.map((answer, aIndex) => {
                          const isSelected = selectedAnswers[question.id] === answer.id;
                          let optionClass = 'answer-option';
                          if (isSelected) optionClass += ' selected';
                          const displayText = answer.text || answer.answer_question || '';

                          return (
                            <div
                              key={answer.id}
                              className={optionClass}
                              onClick={() => handleAnswerSelect(question.id, answer.id)}
                            >
                              <span className="answer-letter">{LETTERS[aIndex]}</span>
                              <span className="answer-text" dangerouslySetInnerHTML={{ __html: displayText }} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="test-actions">
                    <div />
                    <button
                      className={`btn ${isLastQuestion ? 'btn-success' : 'btn-primary'}`}
                      onClick={handleNext}
                      disabled={!selectedAnswers[question.id]}
                    >
                      {isLastQuestion ? 'Submit' : 'Next'}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              <div key={test.id} className="test-item" onClick={() => handleTestSelect(test.id)}>
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
