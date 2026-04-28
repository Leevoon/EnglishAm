import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ieltsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './IeltsSection.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const TEST_DURATION = 60 * 60;

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const LEVEL_NAMES = { 0: 'Free', 1: 'Silver', 2: 'Gold' };

const IeltsReading = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const timerRef = useRef(null);

  const basePath = location.pathname.includes('/ielts/academic/')
    ? '/ielts/academic/reading'
    : '/ielts/general/reading';

  useEffect(() => {
    loadTests();
  }, []);

  const handleSubmit = useCallback(async (answers) => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = TEST_DURATION - timeLeft;
      const duration = formatTime(elapsed);
      const response = await ieltsAPI.submitSection('reading', testId, answers || selectedAnswers, duration);
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  }, [testId, selectedAnswers, timeLeft]);

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

  useEffect(() => {
    if (timeLeft === 0 && !submitted && selectedTest) {
      handleSubmit(selectedAnswers);
    }
  }, [timeLeft, submitted, selectedTest, handleSubmit, selectedAnswers]);

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
      setLoading(true);
      const response = await ieltsAPI.getSection('reading', id);
      setSelectedTest(response.data);
      setTimeLeft(TEST_DURATION);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setSubmitted(false);
      setResults(null);
    } catch (error) {
      if (error.response?.status === 403) {
        if (!isAuthenticated) {
          navigate('/login', { replace: true, state: { from: `${basePath}/${id}` } });
          return;
        }
        const level = error.response.data?.required_level || 1;
        alert(`This content requires a ${LEVEL_NAMES[level] || 'Premium'} membership. Please upgrade to access.`);
        navigate(basePath);
        return;
      }
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (id) => {
    navigate(`${basePath}/${id}`);
  };

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(basePath);
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const getPassageText = () => {
    if (!selectedTest?.passages || selectedTest.passages.length === 0) {
      return selectedTest?.test?.text || '';
    }
    return selectedTest.passages.map(p => p.text).join('');
  };

  const handleNext = () => {
    const questions = selectedTest?.questions || [];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit(selectedAnswers);
    }
  };

  if (loading) {
    return <div className="ielts-section"><div className="container">Loading IELTS Reading tests...</div></div>;
  }

  if (selectedTest) {
    const questions = selectedTest.questions || [];
    const passageText = getPassageText();
    const isTimeLow = timeLeft <= 300;

    if (submitted && results) {
      return (
        <div className="ielts-section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h2 style={{ margin: 0 }}>IELTS Reading - Results</h2>
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
                  {questions.map((q, qIndex) => {
                    const qResult = results.results?.[q.id];
                    return (
                      <div key={q.id} className={`question-item ${qResult?.isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="question-number">Question {qIndex + 1}</div>
                        <div className="question-text" dangerouslySetInnerHTML={{ __html: q.question }} />
                        {q.sentences && (
                          <div className="question-sentences" dangerouslySetInnerHTML={{ __html: q.sentences }} />
                        )}
                        {q.answers && (
                          <div className="answer-options">
                            {q.answers.map((answer, aIndex) => {
                              const isSelected = String(selectedAnswers[q.id]) === String(answer.id);
                              let cls = 'answer-option disabled';
                              if (answer.true_false === 1) cls += ' correct-answer';
                              else if (isSelected) cls += ' wrong-answer';
                              return (
                                <div key={answer.id} className={cls}>
                                  <span className="answer-letter">{LETTERS[aIndex]}</span>
                                  <span className="answer-text">{answer.answer}</span>
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

    const question = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
      <div className="ielts-section">
        <div className="container">
          <div className="test-header">
            <h2 style={{ margin: 0 }}>IELTS Reading</h2>
            <div className="test-header-right">
              <div className={`timer ${isTimeLow ? 'timer-low' : ''}`}>{formatTime(timeLeft)}</div>
              <span className="question-counter">Question {currentQuestion + 1} / {questions.length}</span>
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
                    <div className="question-text" dangerouslySetInnerHTML={{ __html: question.question }} />

                    {question.sentences && (
                      <div className="question-sentences" dangerouslySetInnerHTML={{ __html: question.sentences }} />
                    )}

                    {question.answers && question.answers.length > 0 && (
                      <div className="answer-options">
                        {question.answers.map((answer, aIndex) => {
                          const isSelected = selectedAnswers[question.id] === answer.id;
                          let optionClass = 'answer-option';
                          if (isSelected) optionClass += ' selected';

                          return (
                            <div
                              key={answer.id}
                              className={optionClass}
                              onClick={() => handleAnswerSelect(question.id, answer.id)}
                            >
                              <span className="answer-letter">{LETTERS[aIndex]}</span>
                              <span className="answer-text">{answer.answer}</span>
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
    <div className="ielts-section">
      <div className="container">
        <h1>IELTS Reading Tests</h1>
        <div className="tests-list">
          {tests.length > 0 ? (
            tests.map((test) => (
              <div key={test.id} className={`test-item${test.locked ? ` test-locked level-${test.required_level}` : ''}`} onClick={() => handleTestSelect(test.id)}>
                <h3>
                  {test.locked && <span className={`lock-icon level-${test.required_level}`} title={`Requires ${LEVEL_NAMES[test.required_level] || 'Premium'} membership`}>&#128274; </span>}
                  {test.name || `Test ${test.id}`}
                </h3>
                {test.locked && <span className={`membership-badge level-${test.required_level}`}>{LEVEL_NAMES[test.required_level] || 'Premium'}</span>}
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
