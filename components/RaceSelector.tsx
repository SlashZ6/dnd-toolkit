

import React, { useState, useCallback } from 'react';
import type { Race } from '../types';
import { DND_RACES } from '../constants';
// import { getRaceInfo } from '../services/geminiService';
// Fix: Use a named import for Card as it does not have a default export.
import { Card } from './ui/Card';
import Button from './ui/Button';

interface RaceSelectorProps {
  onSelect: (race: Race) => void;
}

const RaceSelector: React.FC<RaceSelectorProps> = ({ onSelect }) => {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRaceSelection = useCallback(async (raceName: string) => {
    setSelectedRace(raceName);
    setLoading(false);
    setDescription(`Description for ${raceName} would appear here.`);
    // AI call removed to adhere to "no AI" requirement.
    // setLoading(true);
    // setDescription('');
    // try {
    //   const raceInfo = await getRaceInfo(raceName);
    //   setDescription(raceInfo);
    // } catch (error) {
    //   console.error('Failed to get race info:', error);
    //   setDescription('Could not retrieve information for this race. Please try another.');
    // } finally {
    //   setLoading(false);
    // }
  }, []);

  const handleConfirm = () => {
    if (selectedRace && description) {
      onSelect({ name: selectedRace, description });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {DND_RACES.map(race => (
          <Card
            key={race}
            title={race}
            isSelected={selectedRace === race}
            onClick={() => handleRaceSelection(race)}
          />
        ))}
      </div>

      {selectedRace && (
        <div className="w-full max-w-2xl p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] transition-all duration-500">
          <h3 className="text-2xl font-medieval text-[var(--accent-primary-hover)] mb-3">{selectedRace}</h3>
          <div className="h-32">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-secondary)]"></div>
              </div>
            ) : (
              <p className="text-[var(--text-secondary)]">{description}</p>
            )}
          </div>
          <div className="text-center mt-4">
            <Button
              onClick={handleConfirm}
              disabled={loading || !description}
            >
              Choose {selectedRace}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceSelector;