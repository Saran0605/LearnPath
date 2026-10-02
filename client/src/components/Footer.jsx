import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="disclaimer-badge">
          <Info size={16} />
          <span>Anti-Hallucination Design Guarantee</span>
        </div>
        <p className="footer-note">
          Results are summarized by an open-weight model from real posts and may contain mistakes. Check the source links.
        </p>
        <div className="footer-meta">
          <span>LearnPath Monorepo • Open-Weight Gemma AI Integration</span>
        </div>
      </div>
    </footer>
  );
}
