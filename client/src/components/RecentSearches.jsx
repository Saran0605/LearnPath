import React from 'react';
import { History, Sparkles } from 'lucide-react';

export default function RecentSearches({ recentList, onSelectSkill, isLoading }) {
  if (!recentList || recentList.length === 0) return null;

  return (
    <section className="recent-searches-section">
      <div className="recent-header">
        <History size={18} className="recent-icon" />
        <h2>Recently Searched Skills</h2>
      </div>

      <div className="recent-grid">
        {recentList.map((item, idx) => (
          <button
            key={`${item.skill}-${idx}`}
            type="button"
            className="recent-card-btn"
            onClick={() => onSelectSkill(item.skill)}
            disabled={isLoading}
          >
            <span className="recent-skill-name">{item.skill}</span>
            <span className="recent-count-badge">
              <Sparkles size={12} />
              {item.resourceCount} {item.resourceCount === 1 ? 'resource' : 'resources'}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
