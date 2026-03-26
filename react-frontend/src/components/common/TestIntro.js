import React from 'react';
import './TestIntro.css';

const TestIntro = ({ title, instructions, onContinue }) => {
  return (
    <div className="test-intro">
      <div className="test-intro-card">
        {title && <h2 className="test-intro-title">{title}</h2>}
        <div className="test-intro-instructions">
          {instructions.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
        <button className="btn btn-primary test-intro-btn" onClick={onContinue}>
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default TestIntro;
