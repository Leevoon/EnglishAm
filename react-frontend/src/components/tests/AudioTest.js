import React, { useState, useEffect, useRef } from 'react';
import AudioPlayer from 'react-audio-player';
import './AudioTest.css';

const AudioTest = ({ test, onAnswerChange, selectedAnswer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioUrl = test.audio 
    ? `/vendor/videos/tests/${test.audio}` 
    : test.image && test.image.endsWith('.mp3') 
      ? `/vendor/videos/tests/${test.image}` 
      : null;

  const handleAnswerSelect = (answerId) => {
    onAnswerChange(answerId);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="audio-test">
      {audioUrl && (
        <div className="audio-player-section">
          <h4>Listen to the audio:</h4>
          <AudioPlayer
            ref={audioRef}
            src={audioUrl}
            controls
            onPlay={handlePlay}
            onEnded={handleEnded}
            className="audio-player"
          />
        </div>
      )}
      
      <div className="test-question">
        <h5>Question:</h5>
        <p>{test.question || 'No question text available'}</p>
      </div>

      {test.answers && test.answers.length > 0 && (
        <div className="test-answers">
          <h5>Select your answer:</h5>
          <div className="answers-list">
            {test.answers.map((answer) => (
              <label
                key={answer.id}
                className={`answer-option ${selectedAnswer === answer.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`answer-${test.id}`}
                  value={answer.id}
                  checked={selectedAnswer === answer.id}
                  onChange={() => handleAnswerSelect(answer.id)}
                />
                <span className="answer-text">{answer.value || answer.text}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioTest;



