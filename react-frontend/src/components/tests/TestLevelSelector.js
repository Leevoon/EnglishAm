import React, { useEffect, useState } from 'react';
import { testsAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './TestLevelSelector.css';

const TestLevelSelector = ({ selectedLevel, onLevelChange }) => {
  const { currentLanguage } = useApp();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, [currentLanguage.id]);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const response = await testsAPI.getLevels(currentLanguage.id);
      setLevels(response.data || []);
    } catch (error) {
      console.error('Error loading test levels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="level-selector">Loading levels...</div>;
  }

  return (
    <div className="level-selector">
      <h4>Select Level:</h4>
      <div className="level-buttons">
        <button
          className={`level-btn ${!selectedLevel ? 'active' : ''}`}
          onClick={() => onLevelChange(null)}
        >
          All Levels
        </button>
        {levels.map((level) => {
          const label = level.labels && level.labels.length > 0 
            ? level.labels[0].value 
            : `Level ${level.id}`;
          return (
            <button
              key={level.id}
              className={`level-btn ${selectedLevel === level.id ? 'active' : ''}`}
              onClick={() => onLevelChange(level.id)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TestLevelSelector;



