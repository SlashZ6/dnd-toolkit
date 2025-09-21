import React, { useState } from 'react';
import { Character, CrestData } from '../../types';
import Button from '../ui/Button';
import { CrestDisplay } from './CrestDisplay';

interface CrestCreatorProps {
  character: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

const SHAPES = ['shield1', 'shield2', 'circle', 'square', 'diamond', 'banner'];
const SYMBOLS = ['star', 'lion', 'dragon', 'griffin', 'wolf', 'sword', 'tower', 'skull', 'sun', 'flame', 'mountain', 'tree', 'ship', 'book', 'key', 'crown', 'eye'];
const DIVISIONS: CrestData['division'][] = ['none', 'perPale', 'perFess', 'perBend'];
const DIVISION_LABELS: { [key in CrestData['division']]: string } = {
  none: 'Solid',
  perPale: 'Vertical',
  perFess: 'Horizontal',
  perBend: 'Diagonal'
};

const defaultCrest: CrestData = {
  shape: 'shield1',
  symbol: 'star',
  primaryColor: '#6b7280',
  secondaryColor: '#e2e8f0',
  symbolColor: '#ffffff',
  division: 'none',
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2 p-2 bg-[var(--bg-primary)]/50 rounded-md">
      {children}
    </div>
  </div>
);

const ColorPickerInput: React.FC<{
  label: string;
  value: string;
  onChange: (color: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-2 bg-[var(--bg-primary)]/50 rounded-md w-full">
    <label htmlFor={`${label}-picker`} className="text-sm font-bold text-[var(--text-secondary)]">{label}</label>
    <div className="relative w-24 h-9 rounded-md overflow-hidden border border-[var(--border-secondary)]">
      <input
        type="color"
        id={`${label}-picker`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full cursor-pointer border-0 p-0"
        aria-label={`Select ${label}`}
      />
    </div>
  </div>
);


const CrestCreator: React.FC<CrestCreatorProps> = ({ character, onSave, onCancel }) => {
  const [crest, setCrest] = useState<CrestData>(character.crest || defaultCrest);

  const handleSave = () => {
    onSave({ ...character, crest });
  };

  const SelectionButton: React.FC<{ type: 'shape' | 'symbol', value: string }> = ({ type, value }) => {
    const isSelected = crest[type] === value;
    let previewData: Partial<CrestData> = {
        primaryColor: '#475569',
        secondaryColor: '#94a3b8',
        symbolColor: '#e2e8f0',
        division: 'none'
    };

    if (type === 'shape') {
        previewData.shape = value;
        previewData.symbolColor = 'transparent';
    } else {
        previewData.shape = 'shield1';
        previewData.symbol = value;
    }

    return (
        <button
          type="button"
          onClick={() => setCrest(c => ({ ...c, [type]: value }))}
          className={`w-20 h-20 p-1 rounded-md transition-all ${isSelected ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
        >
          <div className="bg-[var(--bg-tertiary)]/50 rounded-sm">
            <CrestDisplay crestData={previewData} size={72} />
          </div>
        </button>
    );
  };
  
  const DivisionButton: React.FC<{ value: CrestData['division'] }> = ({ value }) => (
    <button
      type="button"
      onClick={() => setCrest(c => ({ ...c, division: value }))}
      className={`px-4 py-2 text-sm rounded transition-colors flex-grow ${crest.division === value ? 'bg-[var(--bg-interactive)] text-[var(--text-inverted)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-quaternary)]'}`}
    >
      {DIVISION_LABELS[value]}
    </button>
  );


  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Column */}
            <div className="lg:col-span-1 flex flex-col items-center gap-6">
                <div className="w-64 h-64 bg-[var(--bg-primary)] rounded-lg border-2 border-[var(--border-primary)] shadow-xl flex items-center justify-center p-2">
                    <CrestDisplay crestData={crest} size={240} />
                </div>
                <div className="flex gap-4">
                    <Button onClick={onCancel} variant="ghost" size="md">Cancel</Button>
                    <Button onClick={handleSave} size="md">Save Crest</Button>
                </div>
            </div>

            {/* Controls Column */}
            <div className="lg:col-span-2 space-y-3">
                <Section title="Shape">
                    {SHAPES.map(s => <SelectionButton key={s} type="shape" value={s} />)}
                </Section>
                <Section title="Symbol">
                    {SYMBOLS.map(s => <SelectionButton key={s} type="symbol" value={s} />)}
                </Section>
                <Section title="Field Division">
                  <div className="flex gap-2 w-full">
                    {DIVISIONS.map(d => <DivisionButton key={d} value={d} />)}
                  </div>
                </Section>
                <div className="space-y-2 pt-2">
                    <ColorPickerInput 
                        label="Primary Color"
                        value={crest.primaryColor}
                        onChange={(color) => setCrest(c => ({...c, primaryColor: color}))}
                    />
                    <ColorPickerInput 
                        label="Secondary / Border Color"
                        value={crest.secondaryColor}
                        onChange={(color) => setCrest(c => ({...c, secondaryColor: color}))}
                    />
                    <ColorPickerInput 
                        label="Symbol Color"
                        value={crest.symbolColor}
                        onChange={(color) => setCrest(c => ({...c, symbolColor: color}))}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default CrestCreator;