

import React, { useState, useCallback } from 'react';
import type { Class } from '../types';
import { DND_CLASSES } from '../constants';
// import { getClassInfo } from '../services/geminiService';
// Fix: Use a named import for Card as it does not have a default export.
import { Card } from './ui/Card';
import Button from './ui/Button';

interface ClassSelectorProps {
  onSelect: (charClass: Class) => void;
  raceName: string;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ onSelect, raceName }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleClassSelection = useCallback(async (className: string) => {
    setSelectedClass(className);
    setLoading(false);
    setDescription(`Description for ${className} would appear here.`);
    // AI call removed to adhere to "no AI" requirement.
    // setLoading(true);
    // setDescription('');
    // try {
    //   const classInfo = await getClassInfo(className, raceName);
    //   setDescription(classInfo);
    // } catch (error) {
    //   console.error('Failed to get class info:', error);
    //   setDescription('Could not retrieve information for this class. Please try another.');
    // } finally {
    //   setLoading(false);
    // }
  }, [raceName]);

  const handleConfirm = () => {
    if (selectedClass && description) {
      onSelect({ name: selectedClass, description });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {DND_CLASSES.map(charClass => (
          <Card
            key={charClass}
            title={charClass}
            isSelected={selectedClass === charClass}
            onClick={() => handleClassSelection(charClass)}
          />
        ))}
      </div>

      {selectedClass && (
        <div className="w-full max-w-2xl p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] transition-all duration-500">
          <h3 className="text-2xl font-medieval text-[var(--accent-primary-hover)] mb-3">{selectedClass}</h3>
          <div className="h-36">
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
              Choose {selectedClass}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;