

import React, { useState, useCallback } from 'react';
import type { CharacterDetails, Race, Class } from '../types';
// import { generateBackstory } from '../services/geminiService';
import Button from './ui/Button';

interface CharacterDetailsFormProps {
  race: Race | null;
  class: Class | null;
  onSubmit: (details: CharacterDetails) => void;
}

const CharacterDetailsForm: React.FC<CharacterDetailsFormProps> = ({ race, class: charClass, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onSubmit({ name });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block text-lg font-medieval text-[var(--accent-primary)] mb-2">Character Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Elara Swiftwood"
          className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-secondary)] focus:outline-none"
          required
        />
      </div>

      <div className="text-center pt-4">
        <Button
          type="submit"
          disabled={!name}
        >
          Finalize Character & View Sheet
        </Button>
      </div>
    </form>
  );
};

export default CharacterDetailsForm;