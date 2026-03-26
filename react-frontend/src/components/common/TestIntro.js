import React, { useEffect } from 'react';
import './TestIntro.css';

const TestIntro = ({ title, instructions, audioSrc, onContinue }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="test-intro">
      <div className="test-intro-card">
        {title && <h2 className="test-intro-title">{title}</h2>}
        <div className="test-intro-instructions">
          {instructions.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
        {audioSrc && (
          <div className="test-intro-audio">
            <audio controls autoPlay>
              <source src={audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        <button className="btn btn-primary test-intro-btn" onClick={onContinue}>
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default TestIntro;
