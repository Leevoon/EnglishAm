import React from 'react';
import './EnglishVariantSelector.css';

const EnglishVariantSelector = ({ selectedVariant, onVariantChange }) => {
  return (
    <div className="variant-selector">
      <h4>Select English Variant:</h4>
      <div className="variant-buttons">
        <button
          className={`variant-btn ${selectedVariant === 'american' ? 'active' : ''}`}
          onClick={() => onVariantChange('american')}
        >
          <span className="flag">🇺🇸</span>
          <span className="label">American English</span>
        </button>
        <button
          className={`variant-btn ${selectedVariant === 'british' ? 'active' : ''}`}
          onClick={() => onVariantChange('british')}
        >
          <span className="flag">🇬🇧</span>
          <span className="label">British English</span>
        </button>
      </div>
    </div>
  );
};

export default EnglishVariantSelector;



