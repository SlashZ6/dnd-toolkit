

import React from 'react';

interface CardProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

// Fix: Export Card as a named export.
export const Card: React.FC<CardProps> = ({ title, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-lg text-center font-bold font-medieval text-lg transition-all duration-300
        border-2
        ${
          isSelected
            ? 'bg-[var(--bg-interactive)] border-[var(--border-accent-secondary)] text-[var(--text-inverted)] shadow-lg shadow-[var(--glow-secondary)] ring-2 ring-[var(--accent-secondary)]'
            // Fix: Corrected truncated Tailwind CSS class.
            : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-quaternary)]'
        }
      `}
    >
      {title}
    </button>
  );
};
