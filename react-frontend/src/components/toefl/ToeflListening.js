import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toeflAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TestIntro from '../common/TestIntro';
import './ToeflSection.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MEDIA_BASE = process.env.REACT_APP_MEDIA_URL || '';
const TEST_DURATION = 60 * 60;

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const LEVEL_NAMES = { 0: 'Free', 1: 'Silver', 2: 'Gold' };

const ToeflListening = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [showIntro, setShowIntro] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    loadTests();
  }, []);

  const handleSubmit = useCallback(async (answers) => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = TEST_DURATION - timeLeft;
      const duration = formatTime(elapsed);
      const response = await toeflAPI.submitSection('listening', testId, answers || selectedAnswers, duration);
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
      setShowIntro(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [testId]);

  useEffect(() => {
    if (selectedTest && !submitted && !showIntro) {
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
  }, [selectedTest, submitted, showIntro]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted && selectedTest) {
      handleSubmit(selectedAnswers);
    }
  }, [timeLeft, submitted, selectedTest, handleSubmit, selectedAnswers]);

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

  const loadTest = async (id) => {
    try {
      setLoading(true);
      const response = await toeflAPI.getSection('listening', id);
      setSelectedTest(response.data);
      setTimeLeft(TEST_DURATION);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setSubmitted(false);
      setResults(null);
      setShowIntro(true);
    } catch (error) {
      if (error.response?.status === 403) {
        const level = error.response.data?.required_level || 1;
        alert(`This content requires a ${LEVEL_NAMES[level] || 'Premium'} membership. Please upgrade to access.`);
        navigate('/toefl/listening');
        return;
      }
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (id) => {
    navigate(`/toefl/listening/${id}`);
  };

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate('/toefl/listening');
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const getAllQuestions = () => {
    if (!selectedTest?.parts) return [];
    const questions = [];
    selectedTest.parts.forEach(part => {
      if (part.questions) {
        part.questions.forEach(q => ({ ...q, _part: part }));
        part.questions.forEach(q => questions.push({ ...q, _part: part }));
      }
    });
    return questions;
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
    return <div className="toefl-section"><div className="container">Loading TOEFL Listening tests...</div></div>;
  }

  if (selectedTest && showIntro) {
    const introAudio = selectedTest.explain?.audio
      ? `${MEDIA_BASE}/uploads/toefl/${selectedTest.explain.audio}`
      : null;

    return (
      <div className="toefl-section">
        <div className="container">
          <TestIntro
            title="TOEFL Listening"
            instructions={[
              'This section measures your ability to understand conversations and lectures in English. You will listen to one conversation and one lecture. You will hear each conversation and lecture one time.',
              'After each conversation or lecture you will answer questions about it. The questions typically ask about the main idea and supporting details. Some questions ask about the speaker\'s purpose or attitude. Answer the questions based on what is stated or implied by the speakers.',
              'You may take notes while you listen. You may use your notes to help you answer the questions. Your notes will not be scored.',
              'Click on CONTINUE, when you are ready to start.',
            ]}
            audioSrc={introAudio}
            onContinue={() => setShowIntro(false)}
          />
        </div>
      </div>
    );
  }

  if (selectedTest && selectedTest.parts) {
    const allQuestions = getAllQuestions();
    const isTimeLow = timeLeft <= 300;

    if (submitted && results) {
      return (
        <div className="toefl-section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h2 style={{ margin: 0 }}>TOEFL Listening - Results</h2>
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
              {allQuestions.map((q, qIndex) => {
                const qResult = results.results?.[q.id];
                return (
                  <div key={q.id} className={`question-item ${qResult?.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="question-number">Question {qIndex + 1}</div>
                    <div className="question-text" dangerouslySetInnerHTML={{ __html: q.question }} />
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
                              <span className="answer-text">{answer.value}</span>
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

    const question = allQuestions[currentQuestion];
    const isLastQuestion = currentQuestion === allQuestions.length - 1;

    return (
      <div className="toefl-section">
        <div className="container">
          <div className="test-header">
            <h2 style={{ margin: 0 }}>TOEFL Listening</h2>
            <div className="test-header-right">
              <div className={`timer ${isTimeLow ? 'timer-low' : ''}`}>{formatTime(timeLeft)}</div>
              <span className="question-counter">Question {currentQuestion + 1} / {allQuestions.length}</span>
            </div>
          </div>

          <div className="listening-layout">
            {question && question._part && (
              <div className="audio-player-section">
                {question._part.image && (
                  <img src={`${MEDIA_BASE}/uploads/toefl/${question._part.image}`} alt="Listening" />
                )}
                {question._part.audio && (
                  <audio controls>
                    <source src={`${MEDIA_BASE}/uploads/toefl/${question._part.audio}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )}

            {question && (
              <div className="single-question-view">
                <div className="question-item">
                  <div className="question-number">Question {currentQuestion + 1}</div>
                  <div className="question-text" dangerouslySetInnerHTML={{ __html: question.question }} />

                  {question.audio && (
                    <div style={{ marginBottom: 10 }}>
                      <audio controls style={{ width: '100%', maxWidth: 400 }}>
                        <source src={`${MEDIA_BASE}/uploads/toefl/${question.audio}`} type="audio/mpeg" />
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
                            <span className="answer-text">{answer.value}</span>
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
    <div className="toefl-section">
      <div className="container">
        <h1>TOEFL Listening Tests</h1>
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
            <p>No TOEFL Listening tests available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToeflListening;
