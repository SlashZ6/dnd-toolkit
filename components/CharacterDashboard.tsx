

import React from 'react';
import { Character } from '../types';
import Button from './ui/Button';
import { SwordsIcon } from './icons/SwordsIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ExportIcon } from './icons/ExportIcon';
import { HomebrewIcon } from './icons/HomebrewIcon';

interface CharacterDashboardProps {
  characters: Character[];
  onSelectCharacter: (id: string) => void;
  onNewCharacter: () => void;
  onExportCharacterSheet: (id: string) => void;
  onExportDataFile: (id: string) => void;
  onHomebrew: () => void;
}

const CharacterCard: React.FC<{
  character: Character, 
  onSelect: () => void, 
  onExportSheet: () => void,
  onExportData: () => void
}> = ({ character, onSelect, onExportSheet, onExportData }) => (
  <div
    className="group bg-[var(--bg-secondary)] rounded-lg overflow-hidden border-2 border-[var(--border-primary)] hover:border-[var(--border-accent-secondary)] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_var(--glow-secondary)] flex flex-col"
  >
    <div
      onClick={onSelect}
      className="cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex-grow"
    >
      <div className="h-40 bg-[var(--bg-primary)]/70 flex items-center justify-center overflow-hidden">
        {character.appearanceImage ? (
          <img src={character.appearanceImage} alt={character.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('data:image/svg+xml,%3Csvg width=\"52\" height=\"26\" viewBox=\"0 0 52 26\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23334155\" fill-opacity=\"0.2\"%3E%3Cpath d=\"M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM24 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM42 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM52 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM10 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM24 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM42 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM52 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}>
              <SwordsIcon className="h-20 w-20 text-[var(--bg-quaternary)] group-hover:text-[var(--accent-secondary)] transition-colors duration-300" />
          </div>
        )}
      </div>
      <div className="p-4 bg-gradient-to-t from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <h3 className="text-xl font-medieval text-[var(--text-primary)] truncate">{character.name || 'Unnamed Hero'}</h3>
        <p className="text-sm text-[var(--text-muted)] truncate">
          Level {character.level} {character.race} {character.characterClass}
        </p>
      </div>
    </div>
     <div className="p-2 bg-[var(--bg-primary)] border-t border-[var(--border-primary)] flex gap-2">
        <Button 
          onClick={(e) => { e.stopPropagation(); onExportSheet(); }} 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
          aria-label={`Export ${character.name || 'Unnamed Hero'} as PNG`}
        >
          <DownloadIcon className="h-4 w-4" />
          Export Sheet
        </Button>
        <Button 
          onClick={(e) => { e.stopPropagation(); onExportData(); }} 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
          aria-label={`Export ${character.name || 'Unnamed Hero'} data file`}
        >
          <ExportIcon className="h-4 w-4" />
          Export Data
        </Button>
      </div>
  </div>
);

const NewCharacterCard: React.FC<{onClick: () => void}> = ({ onClick }) => (
    <div
        onClick={onClick}
        className="group bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--border-accent-primary)] transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[288px] hover:shadow-[0_0_15px_var(--glow-primary)] hover:-translate-y-1"
    >
        <div className="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="mt-4 text-xl font-medieval text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">New Adventurer</p>
        </div>
    </div>
);

const HomebrewCard: React.FC<{onClick: () => void}> = ({ onClick }) => (
    <div
        onClick={onClick}
        className="group bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--border-accent-primary)] transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[288px] hover:shadow-[0_0_15px_var(--glow-primary)] hover:-translate-y-1"
    >
        <div className="text-center p-4">
            <HomebrewIcon className="h-16 w-16 mx-auto text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" />
            <p className="mt-4 text-xl font-medieval text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">Homebrew Collection</p>
        </div>
    </div>
);


const CharacterDashboard: React.FC<CharacterDashboardProps> = ({ characters, onSelectCharacter, onNewCharacter, onExportCharacterSheet, onExportDataFile, onHomebrew }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-5xl sm:text-6xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] text-glow-amber">Player's Toolkit</h1>
        <div className="w-48 h-1 mx-auto mt-4 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
        <p className="text-[var(--text-muted)] mt-4 text-lg">Welcome, adventurer. Your heroes await.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map(char => (
            <CharacterCard
              key={char.id}
              character={char}
              onSelect={() => onSelectCharacter(char.id)}
              onExportSheet={() => onExportCharacterSheet(char.id)}
              onExportData={() => onExportDataFile(char.id)}
            />
          ))}
          <NewCharacterCard onClick={onNewCharacter} />
          <HomebrewCard onClick={onHomebrew} />
        </div>

      {characters.length === 0 && (
          <div className="text-center mt-12 text-[var(--text-muted)]/70">
              <p>You haven't created any characters yet.</p>
              <p>Click the card above to forge your first hero!</p>
          </div>
      )}
    </div>
  );
};

export default CharacterDashboard;