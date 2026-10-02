import React from 'react';
import { Filter, DollarSign, BookOpen, Layers } from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  totalCount,
  filteredCount
}) {
  return (
    <div className="filter-bar-container">
      <div className="filter-bar-header">
        <div className="filter-title">
          <Filter size={18} />
          <span>Filter Results</span>
        </div>
        <div className="filter-counts">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> recommendations
        </div>
      </div>

      <div className="filter-groups">
        {/* Pricing Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <DollarSign size={14} /> Pricing:
          </label>
          <div className="filter-buttons">
            {['all', 'free', 'paid', 'freemium'].map((p) => (
              <button
                key={p}
                type="button"
                className={`filter-pill ${filters.pricing === p ? 'active' : ''}`}
                onClick={() => onFilterChange('pricing', p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <BookOpen size={14} /> Type:
          </label>
          <div className="filter-buttons">
            {[
              { id: 'all', label: 'All' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'course', label: 'Course' },
              { id: 'book', label: 'Book' },
              { id: 'website', label: 'Website' },
              { id: 'other', label: 'Other' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={`filter-pill ${filters.type === t.id ? 'active' : ''}`}
                onClick={() => onFilterChange('type', t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <Layers size={14} /> Level:
          </label>
          <div className="filter-buttons">
            {[
              { id: 'all', label: 'All Levels' },
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'advanced', label: 'Advanced' }
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                className={`filter-pill ${filters.level === l.id ? 'active' : ''}`}
                onClick={() => onFilterChange('level', l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
