import React, { useState, useEffect } from 'react';
import { Search, Database, Sparkles, CheckCircle2 } from 'lucide-react';

const LOADING_STEPS = [
  { label: 'Fetching posts from Hacker News, Reddit & YouTube...', icon: <Database size={18} /> },
  { label: 'Analyzing learner feedback with Gemma AI model...', icon: <Sparkles size={18} /> },
  { label: 'Verifying URLs & filtering hallucinated recommendations...', icon: <CheckCircle2 size={18} /> }
];

export default function LoadingSkeleton({ skill }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 4000);
    const timer2 = setTimeout(() => setActiveStep(2), 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-status-box">
        <div className="pulse-ring">
          <Search size={24} className="pulse-icon" />
        </div>
        <div className="loading-text-area">
          <h3 className="loading-title">Analyzing recommendations for "{skill}"</h3>
          <p className="loading-subtitle">{LOADING_STEPS[activeStep].label}</p>
        </div>
      </div>

      <div className="step-progress-bar">
        {LOADING_STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`progress-step ${idx <= activeStep ? 'completed' : ''} ${idx === activeStep ? 'active' : ''}`}
          >
            <div className="step-dot"></div>
            <span className="step-text">{step.label.split('...')[0]}</span>
          </div>
        ))}
      </div>

      {/* Cards Skeletons */}
      <div className="skeleton-grid">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton-pill skeleton-badge"></div>
              <div className="skeleton-pill skeleton-badge-sm"></div>
            </div>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-body-1"></div>
            <div className="skeleton-line skeleton-body-2"></div>
            <div className="skeleton-footer">
              <div className="skeleton-btn"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
