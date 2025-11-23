

import React, { useState, useMemo } from 'react';
import { DND_SPELLS } from '../data/spellsData';
import { Spell } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { DND_CLASS_DATA } from '../data/dndData';
import { ARMOR, WEAPONS, ADVENTURING_GEAR } from '../data/equipmentData';
import { MAGIC_ITEMS } from '../data/magicItemsData';
import { DND_RACES_DATA } from '../data/racesData';
import { DND_RULES, Rule } from '../data/dndRules';


interface SRDSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchableItem {
  name: string;
  category: string;
  description: string;
  source: string;
  details?: React.ReactNode;
}

// --- Data Aggregation ---

const spellContent: SearchableItem[] = Object.values(DND_SPELLS).map(spell => ({
  name: spell.name,
  category: `Level ${spell.level} ${spell.school}`,
  description: spell.description,
  source: 'Spell',
  details: (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm bg-[var(--bg-primary)]/50 p-3 rounded-lg border border-[var(--border-primary)]">
      <div><strong>Casting Time:</strong> {spell.castingTime}</div>
      <div><strong>Range:</strong> {spell.range}</div>
      <div><strong>Components:</strong> {spell.components}</div>
      <div><strong>Duration:</strong> {spell.duration}</div>
    </div>
  )
}));

const armorContent: SearchableItem[] = ARMOR.map(item => {
    const acString = typeof item.armorClass.base === 'number'
        ? `${item.armorClass.base}${item.armorClass.dexBonus ? ` + Dex${item.armorClass.maxBonus ? ` (max ${item.armorClass.maxBonus})` : ''}` : ''}`
        : 'Special';
    return {
        name: item.name,
        category: `Armor (${item.category})`,
        source: 'Equipment',
        description: `A suit of ${item.category.toLowerCase()} armor.`,
        details: (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm bg-[var(--bg-primary)]/50 p-3 rounded-lg border border-[var(--border-primary)]">
                <div><strong>Cost:</strong> {item.cost}</div>
                <div><strong>Weight:</strong> {item.weight} lbs</div>
                <div><strong>Armor Class (AC):</strong> {acString}</div>
                {item.strengthRequirement > 0 && <div><strong>Strength:</strong> {item.strengthRequirement}</div>}
                {item.stealthDisadvantage && <div><strong>Stealth:</strong> Disadvantage</div>}
            </div>
        )
    };
});

const weaponContent: SearchableItem[] = WEAPONS.map(item => ({
    name: item.name,
    category: `Weapon`,
    source: 'Equipment',
    description: `A martial or simple weapon.`,
    details: (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm bg-[var(--bg-primary)]/50 p-3 rounded-lg border border-[var(--border-primary)]">
            <div><strong>Cost:</strong> {item.cost}</div>
            <div><strong>Weight:</strong> {item.weight} lbs</div>
            <div><strong>Damage:</strong> {item.damage}</div>
            {item.properties.length > 0 && <div className="col-span-2"><strong>Properties:</strong> {item.properties.join(', ')}</div>}
        </div>
    )
}));

const gearContent: SearchableItem[] = ADVENTURING_GEAR.map(item => ({
    name: item.name,
    category: 'Adventuring Gear',
    source: 'Equipment',
    description: `Standard adventuring gear.`,
    details: (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm bg-[var(--bg-primary)]/50 p-3 rounded-lg border border-[var(--border-primary)]">
            <div><strong>Cost:</strong> {item.cost}</div>
            <div><strong>Weight:</strong> {item.weight} lbs</div>
        </div>
    )
}));

const magicItemContent: SearchableItem[] = MAGIC_ITEMS.map(item => ({
    name: item.name,
    category: `Magic Item (${item.rarity})`,
    source: 'Magic Item',
    description: item.description,
    details: (
        <div className="mb-4 text-sm bg-[var(--bg-primary)]/50 p-3 rounded-lg border border-[var(--border-primary)]">
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Attunement:</strong> {item.requiresAttunement ? 'Required' : 'Not Required'}</p>
        </div>
    )
}));

const classFeatureContent: SearchableItem[] = [];
Object.values(DND_CLASS_DATA).forEach(charClass => {
    charClass.features.forEach(feature => {
        classFeatureContent.push({
            name: feature.name,
            category: `${charClass.name} Feature (Lvl ${feature.level})`,
            description: feature.description,
            source: 'Class Feature',
        });
    });
    Object.values(charClass.subclasses).forEach(subclass => {
        subclass.features.forEach(feature => {
            classFeatureContent.push({
                name: feature.name,
                category: `${subclass.name} Feature (Lvl ${feature.level})`,
                description: feature.description,
                source: 'Class Feature',
            });
        });
    });
});

const racialTraitContent: SearchableItem[] = [];
Object.values(DND_RACES_DATA).forEach(race => {
    if (race.traits) {
        race.traits.forEach(trait => {
            racialTraitContent.push({
                name: trait.name,
                category: `${race.name} Trait`,
                description: trait.description,
                source: 'Racial Trait',
            });
        });
    }
});

const ruleContent: SearchableItem[] = [];
const processRules = (rules: Rule[], parentCategory: string) => {
  rules.forEach(rule => {
    ruleContent.push({
      name: rule.title,
      category: parentCategory,
      description: rule.content,
      source: 'Rule',
    });
    if (rule.subsections) {
      processRules(rule.subsections, `${parentCategory} > ${rule.title}`);
    }
  });
};
processRules(DND_RULES, 'Core Rule');

const allContent: SearchableItem[] = [
    ...spellContent,
    ...armorContent,
    ...weaponContent,
    ...gearContent,
    ...magicItemContent,
    ...classFeatureContent,
    ...racialTraitContent,
    ...ruleContent,
].sort((a, b) => a.name.localeCompare(b.name));


const SRDSearch: React.FC<SRDSearchProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<SearchableItem | null>(null);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return allContent.filter(item => 
      item.name.toLowerCase().includes(lowercasedTerm) ||
      item.category.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);
  
  const displayedList = searchTerm.trim() ? searchResults : allContent;
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-vignette flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="srd-search-title"
    >
      <div
        className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl shadow-black/50 w-full max-w-4xl h-[90vh] max-h-[800px] border border-[var(--border-primary)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] flex-shrink-0">
          <h2 id="srd-search-title" className="text-2xl font-medieval text-[var(--accent-primary)]">SRD Search</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-3xl leading-none">&times;</button>
        </header>
        <div className="flex flex-grow min-h-0">
          <div className="w-1/3 border-r border-[var(--border-primary)] flex flex-col">
            <div className="p-3 border-b border-[var(--border-primary)]">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
                <input
                  type="search"
                  placeholder="Search rules, spells, items..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-md py-2 pl-10 pr-3 text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <ul className="overflow-y-auto flex-grow p-2">
              {displayedList.map((item, index) => (
                <li key={`${item.name}-${item.category}-${index}`}>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-2 rounded-md transition-colors ${selectedItem?.name === item.name && selectedItem.category === item.category ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-[var(--bg-tertiary)]/50'}`}
                  >
                    <p className="font-bold text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.category}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/3 overflow-y-auto p-6">
            {selectedItem ? (
              <div className="animate-fade-in">
                <h3 className="text-3xl font-medieval text-amber-300 mb-2">{selectedItem.name}</h3>
                <p className="text-sm italic text-[var(--text-muted)] mb-4">{selectedItem.category}</p>
                {selectedItem.details}
                <div className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: selectedItem.description.replace(/\|/g, '&#124;').replace(/\n/g, '<br />') }} />
              </div>
            ) : (
              <div className="text-center text-[var(--text-muted)] h-full flex flex-col items-center justify-center">
                <SearchIcon className="h-16 w-16 mb-4" />
                <p>Select an item from the list to view its details.</p>
                <p className="text-sm">Search for spells, equipment, features, and more.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRDSearch;