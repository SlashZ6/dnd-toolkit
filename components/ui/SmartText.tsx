
import React from 'react';
import { useToast } from './Toast';

interface SmartTextProps {
  text: string;
  className?: string;
}

const SmartText: React.FC<SmartTextProps> = ({ text, className = '' }) => {
  const { addToast } = useToast();

  if (!text) return <span className="text-[var(--text-muted)] italic">None</span>;

  // Regex patterns
  // 1. Matches dice notation: 2d6, 1d8+4, 3d10 - 2
  const diceRegex = /\b(\d+)?d(\d+)(\s*[+-]\s*\d+)?\b/g;
  // 2. Matches "to hit": +5 to hit
  const hitRegex = /([+-]\d+)\s+to\s+hit/g;

  // Helper to perform roll
  const rollDice = (formula: string) => {
    // Normalized: 2d6+4
    const cleanFormula = formula.replace(/\s/g, '');
    const parts = cleanFormula.match(/(\d+)?d(\d+)([+-]\d+)?/);
    
    if (!parts) return;

    const count = parseInt(parts[1] || '1');
    const sides = parseInt(parts[2]);
    const mod = parseInt(parts[3] || '0');

    const rolls = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      total += r;
    }
    total += mod;

    const detail = `${cleanFormula}: [${rolls.join(', ')}]${mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : ''} = ${total}`;
    addToast(detail, 'roll');
  };

  const rollHit = (bonusStr: string) => {
    const bonus = parseInt(bonusStr.replace(/\s/g, ''));
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + bonus;
    const isCrit = roll === 20;
    const isFumble = roll === 1;
    
    let msg = `Attack (+${bonus}): 1d20 (${roll}) + ${bonus} = ${total}`;
    if (isCrit) msg += " (CRITICAL!)";
    if (isFumble) msg += " (MISS!)";
    
    addToast(msg, 'roll');
  };

  // Split and render
  // We do a two-pass split for simplicity or a unified regex split.
  // Let's iterate through the text and replace matches.
  
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  
  // Combine regexes for a single pass tokenization
  const combinedRegex = /([+-]\d+\s+to\s+hit)|(\b\d*d\d+(?:\s*[+-]\s*\d+)?\b)/g;
  
  let match;
  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const isHit = !!match[1]; // Capture group 1 is "to hit"
    // const isDice = !!match[2]; // Capture group 2 is dice

    if (isHit) {
        const bonus = fullMatch.split(' ')[0]; // Get the +5 part
        parts.push(
            <button 
                key={match.index} 
                onClick={(e) => { e.stopPropagation(); rollHit(bonus); }}
                className="inline-flex items-center justify-center px-1.5 py-0 mx-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--accent-primary)] border border-[var(--border-secondary)] text-xs font-bold hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer"
                title="Roll Attack"
            >
                {fullMatch}
            </button>
        );
    } else {
        // Dice
        parts.push(
            <button 
                key={match.index} 
                onClick={(e) => { e.stopPropagation(); rollDice(fullMatch); }}
                className="inline-flex items-center justify-center px-1.5 py-0 mx-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--accent-secondary)] border border-[var(--border-secondary)] text-xs font-bold hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer"
                title="Roll Dice"
            >
                {fullMatch}
            </button>
        );
    }

    lastIndex = combinedRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <div className={`whitespace-pre-wrap ${className}`}>{parts}</div>;
};

export default SmartText;
