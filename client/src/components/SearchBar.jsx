import React, { useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

const EXAMPLE_CHIPS = ['SQL', 'Python', 'Guitar', 'Docker', 'React', 'Data Structures'];

export default function SearchBar({ onSearch, isLoading, currentSkill }) {
  const [inputSkill, setInputSkill] = useState(currentSkill || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputSkill.trim() && !isLoading) {
      onSearch(inputSkill.trim());
    }
  };

  const handleChipClick = (chip) => {
    setInputSkill(chip);
    if (!isLoading) {
      onSearch(chip);
    }
  };

  const handleClear = () => {
    setInputSkill('');
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <Search className="search-icon" size={22} />
          <input
            type="text"
            className="search-input"
            placeholder="What skill do you want to learn? (e.g. SQL, guitar, Python)..."
            value={inputSkill}
            onChange={(e) => setInputSkill(e.target.value)}
            disabled={isLoading}
            maxLength={60}
          />
          {inputSkill && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              aria-label="Clear input"
              disabled={isLoading}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="search-submit-btn"
          disabled={!inputSkill.trim() || isLoading}
        >
          {isLoading ? (
            <span className="btn-loading-state">
              <span className="spinner"></span> Analyzing...
            </span>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Find Best Resources</span>
            </>
          )}
        </button>
      </form>

      <div className="example-chips-container">
        <span className="chips-label">Popular Skills:</span>
        <div className="chips-list">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`chip-btn ${currentSkill?.toLowerCase() === chip.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleChipClick(chip)}
              disabled={isLoading}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
