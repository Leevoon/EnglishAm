import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toeflAPI } from '../../services/api';
import './ToeflSection.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MEDIA_BASE = process.env.REACT_APP_MEDIA_URL || '';

const ToeflListening = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePart, setActivePart] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    if (testId) {
      loadTest(testId);
    } else {
      setSelectedTest(null);
      setActivePart(0);
      setSelectedAnswers({});
      setSubmitted(false);
      setResults(null);
    }
  }, [testId]);

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
    } catch (error) {
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (id) => {
    navigate(`/toefl/listening/${id}`);
  };

  const handleBack = () => {
    navigate('/toefl/listening');
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    try {
      const response = await toeflAPI.submitSection('listening', testId, selectedAnswers);
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const getAllQuestions = () => {
    if (!selectedTest?.parts) return [];
    const questions = [];
    selectedTest.parts.forEach(part => {
      if (part.questions) {
        part.questions.forEach(q => questions.push(q));
      }
    });
    return questions;
  };

  if (loading) {
    return <div className="toefl-section"><div className="container">Loading TOEFL Listening tests...</div></div>;
  }

  if (selectedTest && selectedTest.parts) {
    const parts = selectedTest.parts;
    const currentPart = parts[activePart];
    const allQuestions = getAllQuestions();
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="toefl-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h2 style={{ margin: 0 }}>TOEFL Listening</h2>
            <button onClick={handleBack} className="btn btn-secondary">
              Back to List
            </button>
          </div>

          {submitted && results && (
            <div className="results-summary">
              <h3>Results</h3>
              <div className="score-display">
                {results.correct} / {results.total}
              </div>
              <div className="score-details">
                <span className="score-correct">Correct: {results.correct}</span>
                <span className="score-incorrect">Incorrect: {results.incorrect}</span>
              </div>
            </div>
          )}

          <div className="listening-layout">
            {parts.length > 1 && (
              <div className="part-selector">
                {parts.map((part, idx) => (
                  <button
                    key={part.id}
                    className={`btn ${activePart === idx ? 'btn-primary active' : 'btn-secondary'}`}
                    onClick={() => setActivePart(idx)}
                  >
                    Part {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {currentPart && (
              <>
                <div className="audio-player-section">
                  {currentPart.image && (
                    <img src={`${MEDIA_BASE}/uploads/toefl/${currentPart.image}`} alt="Listening" />
                  )}
                  {currentPart.audio && (
                    <audio controls>
                      <source src={`${MEDIA_BASE}/uploads/toefl/${currentPart.audio}`} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>

                {currentPart.questions && currentPart.questions.length > 0 && (
                  <div>
                    <h3>Questions</h3>
                    {currentPart.questions.map((question, qIndex) => {
                      const questionResult = submitted ? results?.results?.[question.id] : null;
                      let qClass = 'question-item';
                      if (questionResult) {
                        qClass += questionResult.isCorrect ? ' correct' : ' incorrect';
                      } else if (selectedAnswers[question.id]) {
                        qClass += ' answered';
                      }

                      return (
                        <div key={question.id} className={qClass}>
                          <div className="question-number">Question {qIndex + 1}</div>
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
                                if (submitted) {
                                  optionClass += ' disabled';
                                  if (answer.true_false === 1) {
                                    optionClass += ' correct-answer';
                                  } else if (isSelected && answer.true_false !== 1) {
                                    optionClass += ' wrong-answer';
                                  }
                                } else {
                                  if (isSelected) optionClass += ' selected';
                                }

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
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {!submitted && allQuestions.length > 0 && (
              <div className="test-actions">
                <span>{answeredCount} of {allQuestions.length} answered</span>
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                >
                  Submit Answers
                </button>
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
