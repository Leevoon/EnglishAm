import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ieltsAPI } from '../../services/api';
import './IeltsSection.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const IeltsReading = () => {
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
      setSelectedAnswers({});
      setSubmitted(false);
      setResults(null);
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
      setLoading(true);
      const response = await ieltsAPI.getSection('reading', id);
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
      const response = await ieltsAPI.submitSection('reading', testId, selectedAnswers);
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const getPassageText = () => {
    if (!selectedTest?.passages || selectedTest.passages.length === 0) {
      return selectedTest?.test?.text || '';
    }
    return selectedTest.passages.map(p => p.text).join('');
  };

  if (loading) {
    return <div className="ielts-section"><div className="container">Loading IELTS Reading tests...</div></div>;
  }

  if (selectedTest) {
    const questions = selectedTest.questions || [];
    const passageText = getPassageText();
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="ielts-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h2 style={{ margin: 0 }}>IELTS Reading</h2>
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

          <div className="test-split-layout">
            <div className="passage-panel">
              <h3>Reading Passage</h3>
              <div dangerouslySetInnerHTML={{ __html: passageText }} />
            </div>

            <div className="questions-panel">
              <h3>Questions ({answeredCount}/{questions.length})</h3>

              {questions.length > 10 && (
                <div className="question-nav">
                  {questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    let dotClass = 'question-nav-dot';
                    if (submitted && results?.results?.[q.id]) {
                      dotClass += results.results[q.id].isCorrect ? ' correct' : ' incorrect';
                    } else if (isAnswered) {
                      dotClass += ' answered';
                    }
                    return (
                      <a
                        key={q.id}
                        href={`#question-${q.id}`}
                        className={dotClass}
                        title={`Question ${idx + 1}`}
                      >
                        {idx + 1}
                      </a>
                    );
                  })}
                </div>
              )}

              <div className="questions-scroll">
                {questions.map((question, qIndex) => {
                  const questionResult = submitted ? results?.results?.[question.id] : null;
                  let qClass = 'question-item';
                  if (questionResult) {
                    qClass += questionResult.isCorrect ? ' correct' : ' incorrect';
                  } else if (selectedAnswers[question.id]) {
                    qClass += ' answered';
                  }

                  return (
                    <div key={question.id} id={`question-${question.id}`} className={qClass}>
                      <div className="question-number">Question {qIndex + 1}</div>
                      <div className="question-text" dangerouslySetInnerHTML={{ __html: question.question }} />

                      {question.sentences && (
                        <div className="question-sentences" dangerouslySetInnerHTML={{ __html: question.sentences }} />
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
