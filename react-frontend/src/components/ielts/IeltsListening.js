import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ieltsAPI } from '../../services/api';
import './IeltsSection.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MEDIA_BASE = process.env.REACT_APP_MEDIA_URL || '';
const TEST_DURATION = 60 * 60;

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const IeltsListening = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
    ? '/ielts/academic/listening'
    : '/ielts/general/listening';

  useEffect(() => {
    loadTests();
  }, []);

  const handleSubmit = useCallback(async (answers) => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const response = await ieltsAPI.submitSection('listening', testId, answers || selectedAnswers);
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
      const response = await ieltsAPI.getListening();
      setTests(response.data || []);
    } catch (error) {
      console.error('Error loading IELTS Listening tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTest = async (id) => {
    try {
      setLoading(true);
      const response = await ieltsAPI.getSection('listening', id);
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

  const handleNext = () => {
    const questions = selectedTest?.questions || [];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit(selectedAnswers);
    }
  };

  if (loading) {
    return <div className="ielts-section"><div className="container">Loading IELTS Listening tests...</div></div>;
  }

  if (selectedTest) {
    const questions = selectedTest.questions || [];
    const test = selectedTest.test;
    const isTimeLow = timeLeft <= 300;

    if (submitted && results) {
      return (
        <div className="ielts-section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h2 style={{ margin: 0 }}>IELTS Listening - Results</h2>
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
            <div className="listening-layout">
              {questions.map((q, qIndex) => {
                const qResult = results.results?.[q.id];
                return (
                  <div key={q.id} className={`question-item ${qResult?.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="question-number">Question {qIndex + 1}</div>
                    {q.question && <div className="question-text" dangerouslySetInnerHTML={{ __html: q.question }} />}
                    {q.sentences && <div className="question-sentences" dangerouslySetInnerHTML={{ __html: q.sentences }} />}
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
      );
    }

    const question = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
      <div className="ielts-section">
        <div className="container">
          <div className="test-header">
            <h2 style={{ margin: 0 }}>IELTS Listening</h2>
            <div className="test-header-right">
              <div className={`timer ${isTimeLow ? 'timer-low' : ''}`}>{formatTime(timeLeft)}</div>
              <span className="question-counter">Question {currentQuestion + 1} / {questions.length}</span>
            </div>
          </div>

          <div className="listening-layout">
            <div className="audio-player-section">
              {test?.image && (
                <img src={`${MEDIA_BASE}/uploads/ielts/${test.image}`} alt="Listening" />
              )}
              {test?.listening_audio && (
                <audio controls>
                  <source src={`${MEDIA_BASE}/uploads/ielts/${test.listening_audio}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>

            {question && (
              <div className="single-question-view">
                <div className="question-item">
                  <div className="question-number">Question {currentQuestion + 1}</div>

                  {question.question && (
                    <div className="question-text" dangerouslySetInnerHTML={{ __html: question.question }} />
                  )}

                  {question.sentences && (
                    <div className="question-sentences" dangerouslySetInnerHTML={{ __html: question.sentences }} />
                  )}

                  {question.listening_audio && (
                    <div style={{ marginBottom: 10 }}>
                      <audio controls style={{ width: '100%', maxWidth: 400 }}>
                        <source src={`${MEDIA_BASE}/uploads/ielts/${question.listening_audio}`} type="audio/mpeg" />
                      </audio>
                    </div>
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
    );
  }

  return (
    <div className="ielts-section">
      <div className="container">
        <h1>IELTS Listening Tests</h1>
        <div className="tests-list">
          {tests.length > 0 ? (
            tests.map((test) => (
              <div key={test.id} className="test-item" onClick={() => handleTestSelect(test.id)}>
                <h3>{test.name || `Test ${test.id}`}</h3>
              </div>
            ))
          ) : (
            <p>No IELTS Listening tests available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IeltsListening;
