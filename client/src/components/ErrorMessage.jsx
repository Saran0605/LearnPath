import React from 'react';
import { AlertTriangle, SearchX, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, isNotFound, onRetry }) {
  return (
    <div className="error-card">
      <div className="error-icon-wrapper">
        {isNotFound ? <SearchX size={36} className="empty-icon" /> : <AlertTriangle size={36} className="error-icon" />}
      </div>
      <h3 className="error-title">
        {isNotFound ? 'No Real Feedback Found' : 'Something went wrong'}
      </h3>
      <p className="error-description">
        {message || 'Not enough real feedback found for this skill. Try a broader term.'}
      </p>
      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Another Skill</span>
        </button>
      )}
    </div>
  );
}
