
import React from 'react';

const Footer: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <footer className={`w-full text-center py-4 text-xs text-[var(--text-muted)] flex-shrink-0 overflow-hidden hidden sm:block ${className}`}>
        <p className="truncate">
          Created by <a href="https://www.instagram.com/slashz6_/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary-hover)] hover:text-[var(--accent-primary)] underline transition-colors">SlashZ</a> with Gemini.
          <span className="mx-2">•</span>
          All data is stored locally in your browser using IndexedDB.
          <span className="mx-2">•</span>
          <span className="font-medieval text-[var(--text-muted)]/80">D&D Toolkit</span>
          <span className="mx-2">•</span>
          You should pay for this (˘︹˘)
        </p>
    </footer>
  );
};

export default Footer;
