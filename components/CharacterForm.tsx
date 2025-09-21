


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Character, createEmptyCharacter, Feature, InventoryItem, Spell } from '../types';
import Button from './ui/Button';
import { DND_CLASSES, DND_SKILLS } from '../constants';
import { DND_CLASS_DATA, getFeaturesForClassLevel } from '../data/dndData';
import { TrashIcon } from './icons/TrashIcon';
import { DND_SPELLS } from '../data/spellsData';
import { DND_RACES_DATA } from '../data/racesData';
import { D20Icon } from './icons/D20Icon';
import { WEAPONS, ARMOR, ADVENTURING_GEAR } from '../data/equipmentData';
import { MAGIC_ITEMS } from '../data/magicItemsData';

interface CharacterFormProps {
  character?: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

type Tab = 'identity' | 'stats' | 'features' | 'inventory' | 'spells' | 'appearance';

const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`bg-[var(--bg-primary)]/50 p-6 rounded-lg border border-[var(--border-primary)] ${className}`}>
        <h3 className="text-xl font-medieval text-[var(--accent-primary)] mb-6 border-b border-[var(--border-secondary)] pb-2">
            {title}
        </h3>
        {children}
    </div>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string, hint?: string}> = ({label, hint, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <input {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none focus:border-[var(--accent-primary-hover)] transition-all shadow-sm focus:shadow-[0_0_12px_var(--glow-primary)] ${props.className}`}/>
        {hint && <p className="text-xs text-[var(--text-muted)] mt-1">{hint}</p>}
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string, children: React.ReactNode, hint?: string}> = ({label, children, hint, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <select {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none focus:border-[var(--accent-primary-hover)] transition-all shadow-sm focus:shadow-[0_0_12px_var(--glow-primary)] ${props.className}`}>
            {children}
        </select>
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <textarea {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none focus:border-[var(--accent-primary-hover)] transition-all shadow-sm focus:shadow-[0_0_12px_var(--glow-primary)] ${props.className}`}/>
    </div>
);

const AbilityScoreInput: React.FC<{ label: string; score: number; modifier: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, score, modifier, onChange }) => (
    <div className="flex flex-col items-center gap-1 p-2 bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-lg text-center">
        <label className="font-bold uppercase text-[var(--text-secondary)] text-sm font-medieval">{label}</label>
        <input type="number" value={score} onChange={onChange} className="w-20 text-4xl font-bold text-center bg-transparent text-[var(--text-primary)] border-none focus:ring-0 p-0"/>
        <div className="text-xl text-[var(--accent-secondary)] bg-[var(--bg-primary)]/70 rounded-full px-3 py-0.5 text-glow-cyan">{modifier}</div>
    </div>
);

const getModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
};

const RaceInfoDisplay: React.FC<{ raceName: string }> = ({ raceName }) => {
    const raceData = DND_RACES_DATA[raceName];

    if (!raceData) return null;

    // New, rich data format
    if (raceData.traits) {
        const { description, size, speed, traits, languages, asi_desc, bonuses } = raceData;

        const bonusText = asi_desc 
            ? asi_desc 
            : Object.entries(bonuses).map(([key, val]) => `+${val} ${key.toUpperCase()}`).join(', ');

        return (
            <div className="mt-4 p-4 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--border-primary)] space-y-3 animate-fade-in text-[var(--text-secondary)]">
                {description && <p className="italic text-[var(--text-muted)]">{description}</p>}
                <div className="text-sm border-t border-[var(--border-primary)] pt-3 space-y-1">
                    {bonusText && <p><strong className="font-semibold text-[var(--text-primary)]">Ability Scores:</strong> {bonusText}</p>}
                    {size && <p><strong className="font-semibold text-[var(--text-primary)]">Size:</strong> {size}</p>}
                    {speed && <p><strong className="font-semibold text-[var(--text-primary)]">Speed:</strong> {speed} ft.</p>}
                    {languages && languages.length > 0 && <p><strong className="font-semibold text-[var(--text-primary)]">Languages:</strong> {languages.join(', ')}</p>}
                </div>
                {traits && traits.length > 0 && (
                    <div className="border-t border-[var(--border-primary)] pt-3">
                        <h4 className="font-semibold text-[var(--text-primary)] mb-2">Racial Traits</h4>
                        <ul className="space-y-2 list-disc list-inside text-sm">
                            {traits.map(trait => (
                                <li key={trait.name}>
                                    <strong className="text-[var(--accent-primary)]">{trait.name}:</strong> <span className="text-[var(--text-muted)]">{trait.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
    
    // Fallback for old data format (where 'description' was the ASI hint)
    if (raceData.description) {
        return <div className="mt-2 text-xs text-[var(--text-muted)]">{raceData.description}</div>
    }

    return null;
};


const CharacterForm: React.FC<CharacterFormProps> = ({ character, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Character>(() => character || createEmptyCharacter(String(Date.now() + Math.random())));
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [rolledScores, setRolledScores] = useState<number[]>([]);
  const [hasRolled, setHasRolled] = useState(!!character);
  const prevRaceRef = useRef<string | undefined>(undefined);
  
  const subclassOptions = formData.characterClass && DND_CLASS_DATA[formData.characterClass] && formData.level >= DND_CLASS_DATA[formData.characterClass].subclassLevel
    ? Object.values(DND_CLASS_DATA[formData.characterClass].subclasses)
    : [];
  
  useEffect(() => {
    const prevRace = prevRaceRef.current;
    const newRace = formData.race;

    if (prevRace === newRace || newRace === '') {
        return;
    }

    const prevRaceData = prevRace ? DND_RACES_DATA[prevRace] : null;
    const newRaceData = newRace ? DND_RACES_DATA[newRace] : null;
    
    // Don't apply bonuses if user is editing a character and hasn't changed the race yet on initial load
    if (character && prevRace === undefined && newRace === character.race) {
        prevRaceRef.current = newRace;
        return;
    }

    setFormData(currentData => {
        const newScores = { ...currentData.abilityScores };

        // Subtract old bonuses
        if (prevRaceData?.bonuses) {
            for (const key in prevRaceData.bonuses) {
                const ability = key as keyof Character['abilityScores'];
                newScores[ability] -= prevRaceData.bonuses[ability] || 0;
            }
        }
        
        // Add new bonuses
        if (newRaceData?.bonuses) {
             for (const key in newRaceData.bonuses) {
                const ability = key as keyof Character['abilityScores'];
                newScores[ability] += newRaceData.bonuses[ability] || 0;
            }
        }

        // Remove old racial traits
        const featuresWithoutRaceTraits = currentData.features.filter(f => f.source !== 'race');
        
        // Add new racial traits
        let newRaceTraits: Feature[] = [];
        if (newRaceData?.traits) {
            newRaceTraits = newRaceData.traits.map(trait => ({
                id: `${newRace}-${trait.name}`.replace(/\s+/g, '-'),
                name: trait.name,
                description: trait.description,
                source: 'race',
            }));
        }
        
        const updatedFeatures = [...featuresWithoutRaceTraits, ...newRaceTraits];

        return { ...currentData, abilityScores: newScores, features: updatedFeatures };
    });

    prevRaceRef.current = newRace;
  }, [formData.race, character]);


  useEffect(() => {
    const classData = DND_CLASS_DATA[formData.characterClass];
    if (classData && formData.level < classData.subclassLevel && formData.subclass !== '') {
        setFormData(prev => ({...prev, subclass: ''}));
    }

    const otherFeatures = formData.features.filter(f => f.source !== 'automatic');
    let autoFeatures: Feature[] = [];

    if (formData.characterClass && formData.level > 0) {
      autoFeatures = getFeaturesForClassLevel(formData.characterClass, formData.subclass, formData.level, formData.abilityScores);
    }
    
    const newFeatures = [...otherFeatures, ...autoFeatures];
      
    // Auto-calculate HP, Passive Perception, and Spell Slots
    const getModifierAsNumber = (score: number) => Math.floor((score - 10) / 2);
    const conMod = getModifierAsNumber(formData.abilityScores.con);
    const wisMod = getModifierAsNumber(formData.abilityScores.wis);
    const proficiencyBonus = Math.floor((formData.level - 1) / 4) + 2;
    const hitDie = classData?.hitDie || 0;
    
    let maxHp = 0;
    if(hitDie > 0) {
        // Level 1: max hit die + con mod
        maxHp = hitDie + conMod;
        // Levels 2-20: add average roll + con mod
        if (formData.level > 1) {
            maxHp += (formData.level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
        }
    }
    
    const perceptionProficient = formData.skillProficiencies.includes("Perception");
    const passivePerception = 10 + wisMod + (perceptionProficient ? proficiencyBonus : 0);

    let currentHp = formData.currentHp;
    if (!character) { // If new character, set current HP to max
      currentHp = maxHp;
    } else if (maxHp !== formData.maxHp) { // If maxHP changed, adjust currentHP proportionally
      const ratio = formData.maxHp > 0 ? formData.currentHp / formData.maxHp : 1;
      currentHp = Math.round(maxHp * ratio);
    }

    // Spell Slots
    let spellcastingData = classData?.spellcasting;
    if (classData && formData.subclass && classData.subclasses[formData.subclass]?.spellcasting) {
        spellcastingData = classData.subclasses[formData.subclass].spellcasting;
    }
    const maxSlots = spellcastingData?.spellSlots?.[formData.level - 1] || [];
    const filledMaxSlots = [...maxSlots];
    while (filledMaxSlots.length < 9) {
        filledMaxSlots.push(0);
    }
    
    let currentSlots = formData.spellSlots.current;
    const maxSlotsChanged = JSON.stringify(filledMaxSlots) !== JSON.stringify(formData.spellSlots.max);
    if (maxSlotsChanged) {
        currentSlots = [...filledMaxSlots];
    }

    setFormData(prev => ({ 
      ...prev, 
      features: newFeatures, 
      maxHp, 
      passivePerception, 
      currentHp,
      spellSlots: {
          max: filledMaxSlots,
          current: currentSlots
      }
    }));

  }, [formData.characterClass, formData.subclass, formData.level, formData.abilityScores, formData.skillProficiencies, character]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'characterClass' && formData.characterClass !== value) {
      setFormData(prev => ({ ...prev, subclass: '', spells: [] }));
    }

    const isNumber = type === 'number' && name !== 'age'; // Keep age as a string
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value, 10) || 0 : value }));
  };

  const handleAbilityScoreChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Character['abilityScores']) => {
    const { value } = e.target;
     setFormData(prev => ({
        ...prev,
        abilityScores: {
            ...prev.abilityScores,
            [field]: parseInt(value, 10) || 0,
        }
    }));
  };

  const handleSkillProficiencyChange = (skill: string) => {
      setFormData(prev => {
          const newProficiencies = prev.skillProficiencies.includes(skill)
            ? prev.skillProficiencies.filter(s => s !== skill)
            : [...prev.skillProficiencies, skill];
          return { ...prev, skillProficiencies: newProficiencies };
      });
  }
  
  const handleInventoryItemChange = (index: number, field: keyof InventoryItem, value: string | number) => {
    const items = [...formData.inventory];
    const updatedItem = { ...items[index], [field]: value };
    items[index] = updatedItem as InventoryItem;
    setFormData(prev => ({ ...prev, inventory: items }));
  };

  const addItem = (item: Omit<InventoryItem, 'id' | 'equipped' | 'quantity'>) => {
    const newItem: InventoryItem = {
        ...item,
        id: String(Date.now() + Math.random()),
        equipped: false,
        quantity: 1,
    };
    setFormData(prev => ({ ...prev, inventory: [...prev.inventory, newItem] }));
  };
  
  const removeInventoryItem = (id: string) => {
      setFormData(prev => ({ ...prev, inventory: prev.inventory.filter(item => item.id !== id) }));
  };

  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (id: string) => {
      setFormData(prev => ({...prev, features: prev.features.filter(f => f.id !== id)}));
  };
  
  const addFeature = () => {
    const newFeature: Feature = {
        id: String(Date.now() + Math.random()),
        name: '',
        description: '',
        source: 'manual',
    };
    setFormData(prev => ({ ...prev, features: [...prev.features, newFeature] }));
  };
  
  const addSpell = (spellName: string) => {
    if (spellName && !formData.spells.includes(spellName)) {
        setFormData(prev => ({ ...prev, spells: [...prev.spells, spellName] }));
    }
  };

  const removeSpell = (spellName: string) => {
      setFormData(prev => ({ ...prev, spells: prev.spells.filter(s => s !== spellName) }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, appearanceImage: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleRollScores = () => {
    const newScores: number[] = [];
    for (let i = 0; i < 6; i++) {
      const rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      rolls.sort((a, b) => a - b);
      rolls.shift(); // drop the lowest
      const sum = rolls.reduce((acc, val) => acc + val, 0);
      newScores.push(sum);
    }
    setRolledScores(newScores);
    setHasRolled(true);
  };
  
  const TabButton: React.FC<{tabId: Tab, children: React.ReactNode}> = ({tabId, children}) => (
      <button type="button" onClick={() => setActiveTab(tabId)} className={`px-3 sm:px-4 py-2 text-base sm:text-lg font-medieval rounded-t-lg transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === tabId ? 'bg-[var(--bg-secondary)] border-[var(--border-accent-primary)] text-[var(--accent-primary)] shadow-[0_2px_10px_var(--glow-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50'}`}>
          {children}
      </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <header className="text-center">
            <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)]">
                {character ? `Edit ${character.name}` : 'Create Your Character'}
            </h2>
        </header>

        <div className="border-b border-[var(--border-primary)]">
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-px">
                <TabButton tabId="identity">Identity</TabButton>
                <TabButton tabId="stats">Stats & Skills</TabButton>
                <TabButton tabId="features">Features</TabButton>
                <TabButton tabId="spells">Spells</TabButton>
                <TabButton tabId="inventory">Inventory</TabButton>
                <TabButton tabId="appearance">Appearance & Notes</TabButton>
            </div>
        </div>
        
        <div className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm rounded-b-xl p-4 sm:p-8 border border-[var(--border-primary)] border-t-0">
            {activeTab === 'identity' && <div className="animate-fade-in">
                <Section title="Core Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2 lg:col-span-3">
                            <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Elara Swiftwood" />
                        </div>
                         <div className="lg:col-span-1">
                            <FormSelect label="Race" name="race" value={formData.race} onChange={handleChange} required>
                                <option value="">Select a Race</option>
                                {Object.keys(DND_RACES_DATA).sort().map(raceName => (
                                    <option key={raceName} value={raceName}>{raceName}</option>
                                ))}
                            </FormSelect>
                        </div>
                        <FormSelect label="Class" name="characterClass" value={formData.characterClass} onChange={handleChange} required>
                            <option value="">Select a Class</option>
                            {DND_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </FormSelect>
                        <FormInput label="Level" name="level" type="number" value={formData.level} onChange={handleChange} min="1" max="20" required/>
                        <FormSelect label="Subclass" name="subclass" value={formData.subclass} onChange={handleChange} disabled={subclassOptions.length === 0}>
                            <option value="">Select Subclass (Lvl {DND_CLASS_DATA[formData.characterClass]?.subclassLevel || 'N/A'})</option>
                            {subclassOptions.map(sc => <option key={sc.name} value={sc.name}>{sc.name}</option>)}
                        </FormSelect>
                        <FormInput label="Bloodline" name="bloodline" value={formData.bloodline} onChange={handleChange} placeholder="e.g., of Dragons" />
                        <FormInput label="Age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 28" />
                    </div>
                     {formData.race && <RaceInfoDisplay raceName={formData.race} />}
                </Section>
            </div>}

            {activeTab === 'stats' && <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Section title="Ability Scores" className="lg:col-span-3">
                    <div className="flex flex-col items-center mb-6 gap-4">
                        <Button type="button" onClick={handleRollScores} variant="ghost" className="flex items-center gap-2" disabled={hasRolled}>
                            <D20Icon className="h-5 w-5" />
                            {character ? "Stats are Set" : hasRolled ? "Scores Rolled" : "Roll for Stats (4d6 drop lowest)"}
                        </Button>
                        {rolledScores.length > 0 && (
                            <div className="w-full text-center p-3 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--border-primary)] animate-fade-in">
                                <h4 className="text-[var(--text-secondary)] font-bold mb-2">Your Rolls - Assign Below</h4>
                                <div className="flex justify-center flex-wrap gap-3 font-mono text-2xl text-[var(--accent-primary)]">
                                    {rolledScores.map((score, index) => (
                                        <div key={index} className="bg-[var(--bg-secondary)] rounded-md px-3 py-1 border border-[var(--border-secondary)] shadow-[0_0_8px_var(--glow-primary)] text-glow-amber">
                                            {score}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {(Object.keys(formData.abilityScores) as Array<keyof typeof formData.abilityScores>).map(key => (
                            <AbilityScoreInput 
                                key={key}
                                label={key.toUpperCase()}
                                score={formData.abilityScores[key]}
                                modifier={getModifier(formData.abilityScores[key])}
                                onChange={e => handleAbilityScoreChange(e, key)}
                            />
                        ))}
                     </div>
                </Section>
                 <Section title="Vitals" className="lg:col-span-1">
                    <div className="space-y-4">
                        <FormInput label="Max Hit Points (HP)" name="maxHp" type="number" value={formData.maxHp} onChange={handleChange} hint="Auto-calculated from class, level, and CON."/>
                        <FormInput label="Current Hit Points" name="currentHp" type="number" value={formData.currentHp} onChange={handleChange} />
                        <FormInput label="Armor Class (AC)" name="ac" type="number" value={formData.ac} onChange={handleChange}/>
                        <FormInput label="Passive Perception" name="passivePerception" type="number" value={formData.passivePerception} onChange={handleChange} hint="Auto-calculated from WIS and Perception proficiency." readOnly/>
                    </div>
                </Section>
                <Section title="Skill Proficiencies" className="lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                        {DND_SKILLS.map(skill => (
                            <label key={skill} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.skillProficiencies.includes(skill)} onChange={() => handleSkillProficiencyChange(skill)} className="h-4 w-4 rounded bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--bg-interactive)] focus:ring-[var(--bg-interactive-hover)]" />
                                <span className="text-[var(--text-primary)]">{skill}</span>
                            </label>
                        ))}
                    </div>
                </Section>
            </div>}

            {activeTab === 'features' && <div className="animate-fade-in">
                 <Section title="Features & Abilities">
                    <div className="space-y-4">
                        {formData.features.map((feature, index) => {
                            const isGenerated = feature.source === 'automatic' || feature.source === 'race';
                            return (
                                <div key={feature.id} className="grid grid-cols-12 gap-3 p-4 bg-[var(--bg-secondary)]/70 rounded-lg border border-[var(--border-primary)]">
                                    <div className="col-span-11 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <input value={feature.name} onChange={(e) => handleFeatureChange(index, 'name', e.target.value)} placeholder="Feature Name" className={`w-full bg-[var(--bg-secondary)] p-2 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-primary-hover)] focus:border-[var(--accent-primary-hover)] ${isGenerated ? 'font-bold text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}/>
                                            {feature.source === 'automatic' && <span className="text-xs text-[var(--accent-secondary)] bg-[var(--bg-interactive)]/20 px-2 py-1 rounded-full whitespace-nowrap">CLASS FEATURE</span>}
                                            {feature.source === 'race' && <span className="text-xs text-emerald-400 bg-emerald-900/50 px-2 py-1 rounded-full whitespace-nowrap">RACIAL TRAIT</span>}
                                        </div>
                                        <textarea value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} placeholder="Description" rows={2} className={`w-full bg-[var(--bg-secondary)] p-2 rounded-md text-sm border border-[var(--border-secondary)] focus:ring-[var(--accent-primary-hover)] focus:border-[var(--accent-primary-hover)] text-[var(--text-primary)]`} />
                                    </div>
                                    <div className="col-span-1 flex items-start justify-center pt-1">
                                       <Button type="button" size="sm" onClick={() => removeFeature(feature.id)} variant="ghost" className="!p-2 aspect-square text-[var(--text-muted)] hover:text-red-500 hover:bg-red-900/30"><TrashIcon className="h-5 w-5"/></Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <Button type="button" onClick={addFeature} className="mt-6">Add Custom Feature</Button>
                </Section>
            </div>}

            {activeTab === 'spells' && <div className="animate-fade-in">
                <Section title="Spellbook">
                    <SpellSelector 
                        onSelect={addSpell} 
                        onRemove={removeSpell}
                        knownSpells={formData.spells}
                        characterClass={formData.characterClass}
                        subclass={formData.subclass}
                        characterLevel={formData.level}
                        abilityScores={formData.abilityScores}
                         />
                </Section>
            </div>}
            
            {activeTab === 'inventory' && <div className="animate-fade-in">
                 <Section title="Inventory & Currency">
                    <div className="p-4 bg-[var(--bg-primary)]/50 rounded-lg mb-6">
                        <FormInput label="Gold Pieces (GP)" name="currency" type="number" value={formData.currency} onChange={handleChange}/>
                    </div>
                    <ItemSelector onAddItem={addItem} />
                    <h4 className="text-lg font-medieval text-[var(--accent-primary)] mb-4 border-t border-[var(--border-secondary)] pt-4 mt-6">Items</h4>
                    <div className="space-y-4">
                        {formData.inventory.map((item, index) => (
                             <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-[var(--bg-secondary)]/70 rounded-lg border border-[var(--border-primary)]">
                                <input value={item.name} onChange={(e) => handleInventoryItemChange(index, 'name', e.target.value)} placeholder="Item Name" className="flex-grow bg-[var(--bg-primary)]/80 p-2 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-primary-hover)] focus:border-[var(--accent-primary-hover)]"/>
                                <input type="number" value={item.quantity} onChange={(e) => handleInventoryItemChange(index, 'quantity', parseInt(e.target.value, 10) || 1)} placeholder="Qty" className="w-24 bg-[var(--bg-primary)]/80 p-2 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-primary-hover)] focus:border-[var(--accent-primary-hover)]"/>
                                <input value={item.description} onChange={(e) => handleInventoryItemChange(index, 'description', e.target.value)} placeholder="Description/Notes" className="flex-grow bg-[var(--bg-primary)]/80 p-2 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-primary-hover)] focus:border-[var(--accent-primary-hover)]"/>
                                <Button type="button" size="sm" onClick={() => removeInventoryItem(item.id)} variant="ghost" className="!p-2 aspect-square text-[var(--text-muted)] hover:text-red-500 hover:bg-red-900/30 self-center sm:self-auto"><TrashIcon className="h-5 w-5"/></Button>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>}

            {activeTab === 'appearance' && <div className="animate-fade-in">
                 <Section title="Appearance & Notes">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-[var(--bg-primary)]/80 rounded-lg border-2 border-dashed border-[var(--border-secondary)] flex items-center justify-center overflow-hidden">
                                {formData.appearanceImage ? (
                                    <img src={formData.appearanceImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[var(--text-muted)]/70 p-4 text-center">No image uploaded.</span>
                                )}
                            </div>
                             <div className="flex items-center gap-2">
                                <label htmlFor="appearance-upload" className="cursor-pointer bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-[var(--text-inverted)] font-bold py-2 px-4 rounded-md transition-colors w-full text-center flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    Upload Portrait
                                </label>
                                <input id="appearance-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                                {formData.appearanceImage && (
                                    <Button type="button" onClick={() => setFormData(prev => ({...prev, appearanceImage: ''}))} size="sm" variant="destructive">
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <FormTextarea label="Backstory, Notes & Appearance Details" name="notes" value={formData.notes} onChange={handleChange} rows={12} placeholder="Describe your character's appearance, personality, and history..." />
                        </div>
                    </div>
                 </Section>
            </div>}
        </div>

        <div className="flex justify-center items-center gap-4 pt-6">
            <Button type="button" onClick={onCancel} variant="ghost" size="lg">Cancel</Button>
            <Button type="submit" size="lg">Save Character</Button>
        </div>
    </form>
  )
};

const ItemSelector: React.FC<{onAddItem: (item: Omit<InventoryItem, 'id' | 'equipped' | 'quantity'>) => void}> = ({onAddItem}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    const allItems = useMemo(() => [
        ...WEAPONS.map(i => ({ ...i, category: 'Weapon' as const })),
        ...ARMOR.map(i => ({ ...i, category: 'Armor' as const })),
        ...ADVENTURING_GEAR.map(i => ({ ...i, category: 'Gear' as const })),
        ...MAGIC_ITEMS.map(i => ({ name: i.name, weight: 0, category: 'Magic Item' as const, cost: 'Varies', description: i.description, properties: [i.rarity, i.type] })),
    ], []);

    const filteredItems = useMemo(() => {
        return allItems
            .filter(item => category === 'All' || item.category === category)
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allItems, searchTerm, category]);

    const handleAddItem = (item: any) => {
        onAddItem({
            name: item.name,
            weight: item.weight || 0,
            category: item.category,
            cost: item.cost,
            properties: item.properties || [],
            description: item.damage ? `${item.damage} ${item.properties.join(', ')}` : item.description || '',
        });
    }

    return (
        <div className="bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)] space-y-3">
             <h4 className="text-lg font-medieval text-[var(--accent-primary)]">Add Item from Compendium</h4>
            <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for an item..." className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)]"/>
                <select value={category} onChange={e => setCategory(e.target.value)} className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)]">
                    <option value="All">All</option>
                    <option value="Weapon">Weapons</option>
                    <option value="Armor">Armor</option>
                    <option value="Gear">Gear</option>
                    <option value="Magic Item">Magic Items</option>
                </select>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 p-2 bg-[var(--bg-primary)] rounded">
                {filteredItems.map(item => (
                    <button type="button" key={item.name} onClick={() => handleAddItem(item)} className="w-full text-left p-2 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                        <p className="font-bold text-[var(--text-primary)]">{item.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{item.category} - {item.cost}</p>
                    </button>
                ))}
            </div>
             <Button type="button" onClick={() => handleAddItem({name: 'Custom Item', weight: 0, category: 'Other', cost: '0 gp', description: ''})}>Add Custom Item</Button>
        </div>
    );
}

const getSpellcastingInfo = (charClass: string, subclass: string, level: number, abilityScores: Character['abilityScores']) => {
    const classData = DND_CLASS_DATA[charClass];
    if (!classData) return null;

    let spellcastingData = classData.spellcasting;
    // Check for subclass spellcasting (Eldritch Knight, Arcane Trickster)
    if (subclass && classData.subclasses[subclass]?.spellcasting) {
        spellcastingData = classData.subclasses[subclass].spellcasting;
    }

    if (!spellcastingData) return null;

    const getMod = (score: number) => Math.floor((score - 10) / 2);
    const abilityMod = getMod(abilityScores[spellcastingData.ability]);
    
    const maxSpellLevel = (spellcastingData.spellSlots?.[level-1] || []).findIndex(s => s > 0) !== -1 
        ? (spellcastingData.spellSlots?.[level-1] || []).reduce((max, _, i) => ((spellcastingData.spellSlots?.[level-1][i] || 0) > 0 ? i + 1 : max), 0)
        : 0;

    const cantripsKnown = spellcastingData.cantripsKnown?.[level-1] || 0;
    
    let spellsKnown = 0;
    if (spellcastingData.spellsKnown) { // Bard, Ranger, Sorcerer, Warlock
        spellsKnown = spellcastingData.spellsKnown[level-1] || 0;
    } else { // Prepared casters: Cleric, Druid, Paladin, Wizard, Artificer
        const casterLevel = ['Paladin', 'Ranger', 'Artificer'].includes(charClass) ? Math.floor(level/2) : level;
        spellsKnown = Math.max(1, abilityMod + casterLevel);
    }
    
    return { maxSpellLevel, cantripsKnown, spellsKnown, castingType: spellcastingData.spellsKnown ? 'known' : 'prepared' };
}

const SpellSelector: React.FC<{
    onSelect: (spellName: string) => void,
    onRemove: (spellName: string) => void,
    knownSpells: string[],
    characterClass: string,
    subclass: string,
    characterLevel: number,
    abilityScores: Character['abilityScores']
}> = ({onSelect, onRemove, knownSpells, characterClass, subclass, characterLevel, abilityScores}) => {
    const [levelFilter, setLevelFilter] = useState<number | 'all'>(0);
    const [searchTerm, setSearchTerm] = useState('');

    const spellInfo = getSpellcastingInfo(characterClass, subclass, characterLevel, abilityScores);
    
    const currentCantrips = useMemo(() => knownSpells.filter(s => DND_SPELLS[s]?.level === 0), [knownSpells]);
    const currentSpells = useMemo(() => knownSpells.filter(s => DND_SPELLS[s]?.level > 0), [knownSpells]);

    const availableSpells = useMemo(() => {
        return Object.values(DND_SPELLS)
            .filter(spell => {
                const classMatch = characterClass ? spell.class.includes(characterClass) : true;
                const searchMatch = spell.name.toLowerCase().includes(searchTerm.toLowerCase());
                const levelMatch = levelFilter === 'all' ? true : spell.level === levelFilter;
                return classMatch && searchMatch && levelMatch;
            })
            .sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));
    }, [characterClass, searchTerm, levelFilter]);

    const spellLevels = [...new Set(Object.values(DND_SPELLS).map(s => s.level))].sort((a,b) => a - b);
    
    const handleSelectSpell = (spell: Spell) => {
        if (knownSpells.includes(spell.name)) {
            onRemove(spell.name);
        } else {
            if (!spellInfo) {
                onSelect(spell.name);
                return;
            };
            
            if (spell.level === 0) {
                if (currentCantrips.length < spellInfo.cantripsKnown) onSelect(spell.name);
            } else {
                if (currentSpells.length < spellInfo.spellsKnown) onSelect(spell.name);
            }
        }
    }
    
    if (!characterClass || !spellInfo) {
        return <p className="text-[var(--text-muted)]">Select a class with spellcasting to see available spells.</p>;
    }
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--bg-primary)]/50 p-3 rounded-lg border border-[var(--border-primary)] mb-4">
                <div className="text-center">
                    <p className="text-lg font-bold text-[var(--text-primary)]">Cantrips {spellInfo.castingType === 'known' ? 'Known' : 'Prepared'}</p>
                    <p className="text-2xl font-bold text-[var(--accent-secondary)]">{currentCantrips.length} / {spellInfo.cantripsKnown}</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-[var(--text-primary)]">Spells {spellInfo.castingType === 'known' ? 'Known' : 'Prepared'}</p>
                    <p className="text-2xl font-bold text-[var(--accent-primary)]">{currentSpells.length} / {spellInfo.spellsKnown}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                 <input 
                    type="text"
                    placeholder="Search available spells..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)]"
                />
                <div className="flex items-center gap-1 sm:gap-2 bg-[var(--bg-primary)]/50 p-1 rounded-md overflow-x-auto">
                    <button type="button" onClick={() => setLevelFilter('all')} className={`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${levelFilter === 'all' ? 'bg-[var(--accent-primary-hover)] text-[var(--text-inverted)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-quaternary)]'}`}>All</button>
                    {spellLevels.map(level => (
                        <button key={level} type="button" onClick={() => setLevelFilter(level)} disabled={level > spellInfo.maxSpellLevel} className={`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-muted)]/50 disabled:cursor-not-allowed ${levelFilter === level ? 'bg-[var(--accent-primary-hover)] text-[var(--text-inverted)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-quaternary)]'}`}>{level === 0 ? 'Cantrip' : `Lvl ${level}`}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--border-primary)]">
                {availableSpells.map(spell => {
                    const isSelected = knownSpells.includes(spell.name);
                    const isClassSpell = characterClass ? spell.class.includes(characterClass) : true;
                    const canLearnLevel = spell.level <= spellInfo.maxSpellLevel;
                    
                    let isSelectionDisabled = false;
                    if (!isSelected) {
                        if (spell.level === 0) {
                            isSelectionDisabled = currentCantrips.length >= spellInfo.cantripsKnown;
                        } else {
                            isSelectionDisabled = currentSpells.length >= spellInfo.spellsKnown;
                        }
                    }

                    return (
                        <button
                            key={spell.name}
                            type="button"
                            onClick={() => handleSelectSpell(spell)}
                            disabled={!isClassSpell || !canLearnLevel || isSelectionDisabled}
                            title={!isClassSpell ? `Not available for ${characterClass || 'your class'}` : !canLearnLevel ? `You cannot learn level ${spell.level} spells yet.` : spell.name}
                            className={`
                                p-3 rounded-md text-left text-sm transition-all duration-200 truncate
                                ${ isSelected 
                                    ? 'bg-[var(--accent-violet)] text-[var(--text-inverted)] ring-2 ring-[var(--border-accent-violet)] shadow-[0_0_10px_var(--glow-violet)]' 
                                    : (!isClassSpell || !canLearnLevel || isSelectionDisabled)
                                        ? 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-quaternary)] text-[var(--text-secondary)]'
                                }
                            `}
                        >
                           <p className="font-bold truncate">{spell.name}</p>
                           <p className="text-xs text-[var(--text-muted)]">{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}</p>
                        </button>
                    )
                })}
                {availableSpells.length === 0 && <p className="col-span-full text-center text-[var(--text-muted)] py-4">No spells match your criteria.</p>}
            </div>
        </div>
    )
}

export default CharacterForm;