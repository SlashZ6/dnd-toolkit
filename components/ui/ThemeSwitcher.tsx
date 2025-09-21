import React, { useState, useRef, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';

export type Theme = 'slate' | 'parchment' | 'feywild' | 'darkness' | 'crimson';

export const THEMES: { id: Theme; name: string; colors: { bg: string; accent: string } }[] = [
  { id: 'slate', name: 'Default Slate', colors: { bg: '#1e293b', accent: '#fcd34d' } },
  { id: 'parchment', name: 'Parchment', colors: { bg: '#f4e9d8', accent: '#800000' } },
  { id: 'feywild', name: 'Feywild', colors: { bg: '#047857', accent: '#a3e63f' } },
  { id: 'darkness', name: 'Darkness', colors: { bg: '#111111', accent: '#00ffff' } },
  { id: 'crimson', name: 'Crimson', colors: { bg: '#310b0b', accent: '#f59e0b' } },
];

const ThemeSwitcher: React.FC<{
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  backgroundEffectsEnabled: boolean;
  onBackgroundEffectsChange: (enabled: boolean) => void;
}> = ({ currentTheme, onThemeChange, backgroundEffectsEnabled, onBackgroundEffectsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedTheme = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        id="theme-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] text-sm rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] focus:outline-none py-1.5 px-2 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select a theme"
      >
        <span className="flex items-center gap-2 overflow-hidden">
          <span className="w-4 h-4 rounded-full border border-slate-400/50 shrink-0" style={{ backgroundColor: selectedTheme.colors.bg, borderColor: selectedTheme.colors.accent }}></span>
          <span className="truncate">{selectedTheme.name}</span>
        </span>
        <svg className="fill-current h-4 w-4 text-[var(--text-muted)] shrink-0 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md shadow-lg z-20 animate-fade-in"
          style={{ animationDuration: '150ms' }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="theme-button"
        >
          <ul className="p-1" role="none">
            {THEMES.map(theme => (
              <li key={theme.id} role="none">
                <button
                  onClick={() => {
                    onThemeChange(theme.id);
                  }}
                  className={`w-full text-left flex items-center gap-3 px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-[var(--bg-tertiary)] ${currentTheme === theme.id ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-secondary)]'}`}
                  role="menuitem"
                >
                  <span className="w-4 h-4 rounded-full border border-slate-400/50 shrink-0" style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.accent }}></span>
                  <span>{theme.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--border-primary)] my-1 mx-1" role="separator" />
          <div className="px-3 py-1.5" role="none">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">
                BG Effects
              </span>
              <ToggleSwitch
                enabled={backgroundEffectsEnabled}
                onChange={onBackgroundEffectsChange}
                label="Toggle Background Effects"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;