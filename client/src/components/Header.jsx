import React from 'react';
import { Compass, Sparkles, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="brand-logo">
          <div className="logo-icon-wrapper">
            <Compass className="logo-icon" size={32} />
          </div>
          <div>
            <h1 className="brand-title">
              Learn<span className="gradient-text">Path</span>
            </h1>
            <p className="brand-tagline">
              Discover trusted learning resources backed by <strong>real community feedback</strong>.
            </p>
          </div>
        </div>

        <div className="header-badges">
          <div className="gemma-badge">
            <Sparkles size={16} className="sparkle-icon" />
            <span>Open-Weight Gemma AI</span>
          </div>
          <div className="anti-hallucination-badge">
            <ShieldCheck size={16} className="shield-icon" />
            <span>Anti-Hallucination Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
