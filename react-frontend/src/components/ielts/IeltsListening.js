import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ieltsAPI } from '../../services/api';
import './IeltsSection.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MEDIA_BASE = process.env.REACT_APP_MEDIA_URL || '';

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

  const basePath = location.pathname.includes('/ielts/academic/')
    ? '/ielts/academic/listening'
    : '/ielts/general/listening';

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    if (testId) {
      loadTest(testId);
    } else {
      setSelectedTest(null);
      setSelectedAnswers({});
      setSubmitted(false);
      setResults(null);
    }
  }, [testId]);

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
    navigate(basePath);
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    try {
      const response = await ieltsAPI.submitSection('listening', testId, selectedAnswers);
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (loading) {
    return <div className="ielts-section"><div className="container">Loading IELTS Listening tests...</div></div>;
  }

  if (selectedTest) {
    const questions = selectedTest.questions || [];
    const test = selectedTest.test;
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="ielts-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h2 style={{ margin: 0 }}>IELTS Listening</h2>
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

            {questions.length > 0 && (
              <div>
                <h3>Questions</h3>
                {questions.map((question, qIndex) => {
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
            )}

            {!submitted && questions.length > 0 && (
              <div className="test-actions">
                <span>{answeredCount} of {questions.length} answered</span>
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
    <div className="ielts-section">
      <div className="container">
        <h1>IELTS Listening Tests</h1>
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
            <p>No IELTS Listening tests available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IeltsListening;
