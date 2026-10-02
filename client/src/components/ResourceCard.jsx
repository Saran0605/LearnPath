import React, { useState } from 'react';
import {
  ExternalLink,
  Video,
  BookOpen,
  GraduationCap,
  Globe,
  Quote,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function ResourceCard({ resource, sources }) {
  const [showProof, setShowProof] = useState(false);

  // Helper to resolve icon by type
  const getTypeBadge = (type) => {
    switch (type) {
      case 'youtube_playlist':
      case 'youtube_video':
        return { label: 'YouTube', icon: <Video size={14} />, className: 'badge-youtube' };
      case 'course':
        return { label: 'Course', icon: <GraduationCap size={14} />, className: 'badge-course' };
      case 'book':
        return { label: 'Book', icon: <BookOpen size={14} />, className: 'badge-book' };
      case 'website':
        return { label: 'Website', icon: <Globe size={14} />, className: 'badge-website' };
      default:
        return { label: 'Resource', icon: <ExternalLink size={14} />, className: 'badge-other' };
    }
  };

  // Helper for pricing styling
  const getPricingBadge = (pricing) => {
    switch (pricing) {
      case 'free':
        return { label: 'Free', className: 'pricing-free' };
      case 'paid':
        return { label: 'Paid', className: 'pricing-paid' };
      case 'freemium':
        return { label: 'Freemium', className: 'pricing-freemium' };
      default:
        return { label: 'Unknown', className: 'pricing-unknown' };
    }
  };

  // Match resource's sourceIds with original sources
  const supportingSources = (resource.sourceIds || [])
    .map((id) => sources?.find((s) => Number(s.id) === Number(id)))
    .filter(Boolean);

  const typeInfo = getTypeBadge(resource.type);
  const pricingInfo = getPricingBadge(resource.pricing);

  return (
    <div className="resource-card">
      <div className="card-header">
        <div className="card-badges">
          <span className={`badge ${typeInfo.className}`}>
            {typeInfo.icon} {typeInfo.label}
          </span>
          <span className={`pricing-badge ${pricingInfo.className}`}>
            {pricingInfo.label}
          </span>
          {resource.bestFor && (
            <span className="level-badge">
              Level: {resource.bestFor.charAt(0).toUpperCase() + resource.bestFor.slice(1)}
            </span>
          )}
        </div>

        <div className="mention-badge">
          <ShieldCheck size={14} />
          <span>Recommended in {resource.mentionCount} {resource.mentionCount === 1 ? 'source' : 'sources'}</span>
        </div>
      </div>

      <h3 className="resource-title">
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="title-link">
          {resource.name}
          <ExternalLink size={16} className="external-icon" />
        </a>
      </h3>

      <p className="resource-summary">{resource.summary}</p>

      {resource.feedbackQuotes && resource.feedbackQuotes.length > 0 && (
        <div className="feedback-section">
          <div className="feedback-header">
            <Quote size={14} />
            <span>Learner Feedback Points:</span>
          </div>
          <ul className="feedback-list">
            {resource.feedbackQuotes.map((quote, idx) => (
              <li key={idx} className="feedback-item">
                <CheckCircle2 size={14} className="check-icon" />
                <span>{quote}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-actions">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="open-resource-btn"
        >
          <span>Open Resource</span>
          <ExternalLink size={15} />
        </a>

        {supportingSources.length > 0 && (
          <button
            type="button"
            className="see-proof-btn"
            onClick={() => setShowProof(!showProof)}
          >
            <MessageSquare size={14} />
            <span>{showProof ? 'Hide proof' : `See proof (${supportingSources.length})`}</span>
            {showProof ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {showProof && supportingSources.length > 0 && (
        <div className="proof-drawer">
          <h4 className="proof-title">Original Source Feedback Posts:</h4>
          <div className="proof-list">
            {supportingSources.map((source) => (
              <div key={source.id} className="proof-item">
                <span className={`platform-pill platform-${source.platform?.toLowerCase()}`}>
                  {source.platform}
                </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-link"
                >
                  {source.title || source.url}
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
