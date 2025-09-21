


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDmNotes } from '../hooks/useDmNotes';
import Button from './ui/Button';
import Loader from './ui/Loader';
import { DMNotes } from '../types';
import { DND_SKILLS, SKILL_ABILITY_MAP } from '../constants';

interface DMNotesSectionProps {
  characterId: string;
}

const DMNotesSection: React.FC<DMNotesSectionProps> = ({ characterId }) => {
  const { dmNotes, saveDmNotes, isLoading } = useDmNotes(characterId);
  const [localNotes, setLocalNotes] = useState<DMNotes | null>(null);
  const [newCondition, setNewCondition] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (dmNotes) {
      setLocalNotes(dmNotes);
    }
  }, [dmNotes]);

  const handleCheckboxChange = (field: 'proficientSkills' | 'proficientSavingThrows', value: string) => {
    if (!localNotes) return;
    const currentValues = localNotes[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    setLocalNotes({ ...localNotes, [field]: newValues });
    setSaveState('idle');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!localNotes) return;
    const { name, value } = e.target;
    const isNumber = e.target.type === 'number';
    setLocalNotes({ ...localNotes, [name]: isNumber ? parseInt(value, 10) || 0 : value });
    setSaveState('idle');
  };

  const handleAddTag = (type: 'conditions' | 'knownLanguages') => {
    if (!localNotes) return;
    const value = type === 'conditions' ? newCondition.trim() : newLanguage.trim();
    const currentTags = localNotes[type];
    if (value && !currentTags.includes(value)) {
        setLocalNotes({ ...localNotes, [type]: [...currentTags, value] });
    }
    if (type === 'conditions') setNewCondition('');
    else setNewLanguage('');
    setSaveState('idle');
  };

  const handleRemoveTag = (type: 'conditions' | 'knownLanguages', tagToRemove: string) => {
    if (!localNotes) return;
    setLocalNotes({
        ...localNotes,
        [type]: localNotes[type].filter(tag => tag !== tagToRemove)
    });
    setSaveState('idle');
  };

  const handleSave = useCallback(async () => {
    if (!localNotes) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSaveState('saving');
    await saveDmNotes(localNotes);
    setSaveState('saved');
    timeoutRef.current = window.setTimeout(() => setSaveState('idle'), 2000);
  }, [localNotes, saveDmNotes]);

  if (isLoading || !localNotes) {
    return <div className="p-4"><Loader message="Loading DM Notes..." /></div>;
  }
  
  const getSaveButtonText = () => {
      switch (saveState) {
          case 'saving': return 'Saving...';
          case 'saved': return 'Saved!';
          default: return 'Save Notes';
      }
  };

  const SAVING_THROWS = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
  const sortedSkills = [...DND_SKILLS].sort();

  return (
    <section className="bg-[var(--bg-secondary)]/70 backdrop-blur-sm rounded-xl shadow-2xl shadow-black/50 p-4 sm:p-6 lg:p-8 border border-[var(--border-primary)] space-y-6">
        <div className="flex justify-between items-center border-b-2 border-[var(--border-secondary)] pb-2">
            <h2 className="text-3xl font-medieval text-[var(--accent-primary)]">Dungeon Master's Notes</h2>
            <Button onClick={handleSave} disabled={saveState !== 'idle'}>
                {getSaveButtonText()}
            </Button>
        </div>
        
        <div className="space-y-4">
            <h3 className="font-medieval text-2xl text-[var(--accent-primary-hover)] border-b-2 border-[var(--border-accent-primary)]/30 pb-1 mb-4">Proficiencies</h3>
            <div>
                <label htmlFor="proficiencyBonus" className="block text-[var(--text-secondary)] mb-1">Proficiency Bonus</label>
                <input 
                    id="proficiencyBonus"
                    name="proficiencyBonus"
                    type="number"
                    value={localNotes.proficiencyBonus}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none"
                />
            </div>
            <div className="bg-[var(--bg-primary)]/50 p-4 rounded-md border border-[var(--border-secondary)]">
                <h4 className="font-bold text-[var(--text-secondary)] mb-2">Proficient Skills</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                    {sortedSkills.map(skill => (
                        <label key={skill} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={localNotes.proficientSkills.includes(skill)}
                                onChange={() => handleCheckboxChange('proficientSkills', skill)}
                                className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary-hover)] appearance-none checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary-hover)]"
                            />
                            <span className="text-[var(--text-secondary)]">{skill} <span className="text-[var(--text-muted)] text-xs">({SKILL_ABILITY_MAP[skill].toUpperCase()})</span></span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="bg-[var(--bg-primary)]/50 p-4 rounded-md border border-[var(--border-secondary)]">
                <h4 className="font-bold text-[var(--text-secondary)] mb-2">Proficient Saving Throws</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                    {SAVING_THROWS.map(st => (
                        <label key={st} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localNotes.proficientSavingThrows.includes(st)}
                                onChange={() => handleCheckboxChange('proficientSavingThrows', st)}
                                className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary-hover)] appearance-none checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary-hover)]"
                            />
                            <span className="text-[var(--text-secondary)]">{st}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>

        <div>
            <label className="block text-[var(--text-secondary)] mb-2">Conditions</label>
             <div className="flex flex-wrap gap-2 mb-2 min-h-[2.25rem] p-1">
                {localNotes.conditions.map(tag => (
                  <span key={tag} className="flex items-center bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-md text-sm">
                    {tag}
                    <button onClick={() => handleRemoveTag('conditions', tag)} className="ml-2 text-[var(--text-muted)] hover:text-white font-bold">&times;</button>
                  </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={e => setNewCondition(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTag('conditions')}
                  placeholder="Add condition"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none"
                />
                <button type="button" onClick={() => handleAddTag('conditions')} className="px-4 py-2 rounded-md bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-inverted)] font-bold transition-colors">Add</button>
            </div>
        </div>

        <div>
            <label className="block text-[var(--text-secondary)] mb-2">Known Languages</label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[2.25rem] p-1">
                {localNotes.knownLanguages.map(tag => (
                  <span key={tag} className="flex items-center bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-md text-sm">
                    {tag}
                    <button onClick={() => handleRemoveTag('knownLanguages', tag)} className="ml-2 text-[var(--text-muted)] hover:text-white font-bold">&times;</button>
                  </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={e => setNewLanguage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTag('knownLanguages')}
                  placeholder="Add language"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none"
                />
                <button type="button" onClick={() => handleAddTag('knownLanguages')} className="px-4 py-2 rounded-md bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-inverted)] font-bold transition-colors">Add</button>
            </div>
        </div>

        <div>
            <label htmlFor="backstoryDetails" className="block text-[var(--text-secondary)] mb-2">DM Notes (Backstory Details)</label>
            <textarea
                id="backstoryDetails"
                name="backstoryDetails"
                value={localNotes.backstoryDetails}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none"
            />
        </div>

        <div>
            <label htmlFor="goalsSecrets" className="block text-[var(--text-secondary)] mb-2">DM Notes (Goals/Secrets)</label>
            <textarea
                id="goalsSecrets"
                name="goalsSecrets"
                value={localNotes.goalsSecrets}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none"
            />
        </div>
    </section>
  );
};

export default DMNotesSection;