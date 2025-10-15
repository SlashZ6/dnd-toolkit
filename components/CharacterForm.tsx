import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Character, createEmptyCharacter, Feature, InventoryItem, Spell, HomebrewRace, HomebrewSpell, Companion, CompanionAction, createEmptyCompanion, HomebrewOfficialSubclass } from '../types';
import Button from './ui/Button';
import { DND_CLASSES, DND_SKILLS } from '../constants';
import { DND_CLASS_DATA, getFeaturesForClassLevel } from '../data/dndData';
import { TrashIcon } from './icons/TrashIcon';
import { DND_SPELLS } from '../data/spellsData';
import { DND_RACES_DATA } from '../data/racesData';
import { D20Icon } from './icons/D20Icon';
import { WEAPONS, ARMOR, ADVENTURING_GEAR } from '../data/equipmentData';
import { MAGIC_ITEMS } from '../data/magicItemsData';
import { useHomebrewRaces } from '../hooks/useHomebrewRaces';
import { useHomebrewSpells } from '../hooks/useHomebrewSpells';
import { useHomebrewOfficialSubclasses } from '../hooks/useHomebrewOfficialSubclasses';
import { LockIcon } from './icons/LockIcon';

interface CharacterFormProps {
  character?: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

type Tab = 'identity' | 'stats' | 'features' | 'inventory' | 'spells' | 'appearance' | 'companions';

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

const RaceInfoDisplay: React.FC<{ raceName: string, homebrewRaces: HomebrewRace[] }> = ({ raceName, homebrewRaces }) => {
    const raceData = DND_RACES_DATA[raceName];
    const homebrewRaceData = homebrewRaces.find(r => r.name === raceName);

    if (homebrewRaceData) {
        return (
            <div className="mt-4 p-4 bg-[var(--bg-primary)]/50 rounded-lg border border-[var(--border-primary)] space-y-3 animate-fade-in text-[var(--text-secondary)]">
                <div className="text-sm border-t border-[var(--border-primary)] pt-3 space-y-1">
                    {homebrewRaceData.asi_desc && <p><strong className="font-semibold text-[var(--text-primary)]">Ability Scores:</strong> {homebrewRaceData.asi_desc}</p>}
                    <p><strong className="font-semibold text-[var(--text-primary)]">Size:</strong> {homebrewRaceData.size}</p>
                    <p><strong className="font-semibold text-[var(--text-primary)]">Speed:</strong> {homebrewRaceData.speed} ft.</p>
                    {homebrewRaceData.languages && <p><strong className="font-semibold text-[var(--text-primary)]">Languages:</strong> {homebrewRaceData.languages}</p>}
                </div>
                {homebrewRaceData.traits && homebrewRaceData.traits.length > 0 && (
                    <div className="border-t border-[var(--border-primary)] pt-3">
                        <h4 className="font-semibold text-[var(--text-primary)] mb-2">Racial Traits</h4>
                        <ul className="space-y-2 list-disc list-inside text-sm">
                            {homebrewRaceData.traits.map(trait => (
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
    
    if (!raceData) return null;

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
    
    if (raceData.description) {
        return <div className="mt-2 text-xs text-[var(--text-muted)]">{raceData.description}</div>
    }

    return null;
};


const CharacterForm: React.FC<CharacterFormProps> = ({ character, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Character>(() => {
    const initialCharacter = character || createEmptyCharacter(String(Date.now() + Math.random()));
    if (!initialCharacter.companions) {
      initialCharacter.companions = [];
    }
    return initialCharacter;
  });
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [rolledScores, setRolledScores] = useState<number[]>([]);
  const [hasRolled, setHasRolled] = useState(!!character);
  const prevRaceRef = useRef<string | undefined>(undefined);
  
  const { races: homebrewRaces } = useHomebrewRaces();
  const { spells: homebrewSpells } = useHomebrewSpells();
  const { subclasses: homebrewSubclasses } = useHomebrewOfficialSubclasses();

  const allRaces = useMemo(() => {
    const official = Object.keys(DND_RACES_DATA).sort();
    const homebrew = homebrewRaces.sort((a, b) => a.name.localeCompare(b.name));
    return { official, homebrew };
  }, [homebrewRaces]);
  
  const officialSubclassOptions = formData.characterClass && DND_CLASS_DATA[formData.characterClass] && formData.level >= DND_CLASS_DATA[formData.characterClass].subclassLevel
    ? Object.values(DND_CLASS_DATA[formData.characterClass].subclasses)
    : [];

  const relevantHomebrewSubclasses = useMemo(() => {
    if (!formData.characterClass || !homebrewSubclasses) return [];
    const classData = DND_CLASS_DATA[formData.characterClass];
    if (!classData || formData.level < classData.subclassLevel) return [];
    return homebrewSubclasses.filter(sub => sub.baseClassName === formData.characterClass);
  }, [formData.characterClass, formData.level, homebrewSubclasses]);
  
  useEffect(() => {
    const prevRace = prevRaceRef.current;
    const newRace = formData.race;

    if (prevRace === newRace || newRace === '') {
        return;
    }

    const prevRaceData = prevRace ? (DND_RACES_DATA[prevRace] || homebrewRaces.find(r => r.name === prevRace)) : null;
    const newRaceData = newRace ? (DND_RACES_DATA[newRace] || homebrewRaces.find(r => r.name === newRace)) : null;
    
    if (character && prevRace === undefined && newRace === character.race) {
        prevRaceRef.current = newRace;
        return;
    }

    setFormData(currentData => {
        const newScores = { ...currentData.abilityScores };

        if (prevRaceData && 'bonuses' in prevRaceData && prevRaceData.bonuses) {
            for (const key in prevRaceData.bonuses) {
                const ability = key as keyof Character['abilityScores'];
                newScores[ability] -= (prevRaceData.bonuses as any)[ability] || 0;
            }
        }
        
        if (newRaceData && 'bonuses' in newRaceData && newRaceData.bonuses) {
             for (const key in newRaceData.bonuses) {
                const ability = key as keyof Character['abilityScores'];
                newScores[ability] += (newRaceData.bonuses as any)[ability] || 0;
            }
        }

        const featuresWithoutRaceTraits = currentData.features.filter(f => f.source !== 'race');
        
        let newRaceTraits: Feature[] = [];
        if (newRaceData?.traits) {
            newRaceTraits = newRaceData.traits.map(trait => ({
                id: `${newRace}-${trait.name}`.replace(/\s+/g, '-'),
                name: trait.name,
                description: trait.description,
                source: 'race' as const,
            }));
        }
        
        const updatedFeatures = [...featuresWithoutRaceTraits, ...newRaceTraits];

        return { ...currentData, abilityScores: newScores, features: updatedFeatures };
    });

    prevRaceRef.current = newRace;
  }, [formData.race, character, homebrewRaces]);


  useEffect(() => {
    const classData = DND_CLASS_DATA[formData.characterClass];
    const getModifierAsNumber = (score: number) => Math.floor((score - 10) / 2);
    
    const resolveUses = (maxUses: number | 'level' | 'cha' | 'wis' | 'int' | 'str' | 'dex' | 'con' | 'prof') => {
        const proficiencyBonus = Math.floor((formData.level - 1) / 4) + 2;
        let resolvedValue: number;
        switch(maxUses) {
            case 'level': resolvedValue = formData.level; break;
            case 'prof': resolvedValue = proficiencyBonus; break;
            case 'cha': resolvedValue = getModifierAsNumber(formData.abilityScores.cha); break;
            case 'wis': resolvedValue = getModifierAsNumber(formData.abilityScores.wis); break;
            case 'int': resolvedValue = getModifierAsNumber(formData.abilityScores.int); break;
            case 'str': resolvedValue = getModifierAsNumber(formData.abilityScores.str); break;
            case 'dex': resolvedValue = getModifierAsNumber(formData.abilityScores.dex); break;
            case 'con': resolvedValue = getModifierAsNumber(formData.abilityScores.con); break;
            default: resolvedValue = maxUses as number; break;
        }
        return Math.max(1, resolvedValue);
    };


    if (classData && formData.level < classData.subclassLevel && formData.subclass !== '') {
        setFormData(prev => ({...prev, subclass: ''}));
    }

    const otherFeatures = formData.features.filter(f => f.source !== 'automatic');
    let autoFeatures: Feature[] = [];

    if (formData.characterClass && formData.level > 0) {
      autoFeatures = getFeaturesForClassLevel(formData.characterClass, formData.subclass, formData.level, formData.abilityScores);
      
      const homebrewSubclassData = homebrewSubclasses.find(hsc => hsc.name === formData.subclass && hsc.baseClassName === formData.characterClass);
      if (homebrewSubclassData && classData && formData.level >= classData.subclassLevel) {
          const homebrewFeatures = homebrewSubclassData.features
              .filter(f => f.level <= formData.level)
              .map(f => {
                  let featureUses: Feature['uses'] | undefined = undefined;
                  if (f.uses) {
                      const max = resolveUses(f.uses.max);
                      // On level up, we should preserve current uses if possible, but for simplicity here we reset.
                      featureUses = { max, current: max };
                  }
                  return {
                      id: `${homebrewSubclassData.id}-${f.name}-${f.level}`,
                      name: f.name,
                      description: f.description,
                      source: 'automatic' as const,
                      uses: featureUses,
                      recharge: f.recharge
                  };
              });
          autoFeatures.push(...homebrewFeatures);
      }
    }
    
    const newFeatures = [...otherFeatures, ...autoFeatures];
      
    const conMod = getModifierAsNumber(formData.abilityScores.con);
    const wisMod = getModifierAsNumber(formData.abilityScores.wis);
    const proficiencyBonus = Math.floor((formData.level - 1) / 4) + 2;
    const hitDie = classData?.hitDie || 0;
    
    let maxHp = 0;
    if(hitDie > 0) {
        maxHp = hitDie + conMod;
        if (formData.level > 1) {
            maxHp += (formData.level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
        }
    }
    
    const perceptionProficient = formData.skillProficiencies.includes("Perception");
    const passivePerception = 10 + wisMod + (perceptionProficient ? proficiencyBonus : 0);

    let currentHp = formData.currentHp;
    if (!character) {
      currentHp = maxHp;
    } else if (maxHp !== formData.maxHp) {
      const ratio = formData.maxHp > 0 ? formData.currentHp / formData.maxHp : 1;
      currentHp = Math.round(maxHp * ratio);
    }

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

  }, [formData.characterClass, formData.subclass, formData.level, formData.abilityScores, formData.skillProficiencies, character, homebrewSubclasses]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'characterClass' && formData.characterClass !== value) {
      setFormData(prev => ({ ...prev, subclass: '', spells: [] }));
    }

    const isNumber = type === 'number' && name !== 'age';
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

    const addCompanion = () => {
        setFormData(prev => ({...prev, companions: [...(prev.companions || []), createEmptyCompanion(String(Date.now() + Math.random()))] }));
    };
    const removeCompanion = (id: string) => {
        setFormData(prev => ({...prev, companions: prev.companions.filter(c => c.id !== id)}));
    };
    const handleCompanionChange = (index: number, field: keyof Omit<Companion, 'abilityScores' | 'actions'>, value: string | number) => {
        const newCompanions = [...formData.companions];
        (newCompanions[index] as any)[field] = value;
        setFormData(prev => ({...prev, companions: newCompanions}));
    };
    const handleCompanionAbilityScoreChange = (compIndex: number, field: keyof Companion['abilityScores'], value: string) => {
        const newCompanions = [...formData.companions];
        newCompanions[compIndex].abilityScores[field] = parseInt(value, 10) || 0;
        setFormData(prev => ({...prev, companions: newCompanions}));
    };
    const addCompanionAction = (compIndex: number) => {
        const newCompanions = [...formData.companions];
        newCompanions[compIndex].actions.push({ id: String(Date.now() + Math.random()), name: '', description: '' });
        setFormData(prev => ({ ...prev, companions: newCompanions }));
    };
    const removeCompanionAction = (compIndex: number, actionId: string) => {
        const newCompanions = [...formData.companions];
        newCompanions[compIndex].actions = newCompanions[compIndex].actions.filter(a => a.id !== actionId);
        setFormData(prev => ({ ...prev, companions: newCompanions }));
    };
    const handleCompanionActionChange = (compIndex: number, actionIndex: number, field: keyof CompanionAction, value: string) => {
        const newCompanions = [...formData.companions];
        newCompanions[compIndex].actions[actionIndex] = { ...newCompanions[compIndex].actions[actionIndex], [field]: value };
        setFormData(prev => ({ ...prev, companions: newCompanions }));
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
                <TabButton tabId="companions">Companions</TabButton>
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
                                <optgroup label="Official Races">
                                    {allRaces.official.map(raceName => (
                                        <option key={raceName} value={raceName}>{raceName}</option>
                                    ))}
                                </optgroup>
                                {allRaces.homebrew.length > 0 && (
                                    <optgroup label="Homebrew Races">
                                        {allRaces.homebrew.map(race => (
                                            <option key={race.id} value={race.name}>{race.name}</option>
                                        ))}
                                    </optgroup>
                                )}
                            </FormSelect>
                        </div>
                        <FormSelect label="Class" name="characterClass" value={formData.characterClass} onChange={handleChange} required>
                            <option value="">Select a Class</option>
                            {DND_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </FormSelect>
                        <FormInput label="Level" name="level" type="number" value={formData.level} onChange={handleChange} min="1" max="20" required/>
                        <FormSelect label="Subclass" name="subclass" value={formData.subclass} onChange={handleChange} disabled={officialSubclassOptions.length === 0 && relevantHomebrewSubclasses.length === 0}>
                            <option value="">Select Subclass (Lvl {DND_CLASS_DATA[formData.characterClass]?.subclassLevel || 'N/A'})</option>
                            {officialSubclassOptions.length > 0 && (
                                <optgroup label="Official Subclasses">
                                    {officialSubclassOptions.map(sc => <option key={sc.name} value={sc.name}>{sc.name}</option>)}
                                </optgroup>
                            )}
                            {relevantHomebrewSubclasses.length > 0 && (
                                <optgroup label="Homebrew Subclasses">
                                    {relevantHomebrewSubclasses.map(sc => <option key={sc.id} value={sc.name}>{sc.name}</option>)}
                                </optgroup>
                            )}
                        </FormSelect>
                        <FormInput label="Bloodline" name="bloodline" value={formData.bloodline} onChange={handleChange} placeholder="e.g., of Dragons" />
                        <FormInput label="Age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 28" />
                    </div>
                     {formData.race && <RaceInfoDisplay raceName={formData.race} homebrewRaces={homebrewRaces} />}
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
                <SpellSelector 
                    onSelect={addSpell} 
                    onRemove={removeSpell}
                    knownSpells={formData.spells}
                    characterClass={formData.characterClass}
                    subclass={formData.subclass}
                    characterLevel={formData.level}
                    abilityScores={formData.abilityScores}
                    homebrewSpells={homebrewSpells}
                        />
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
                                <input value={item.description || ''} onChange={(e) => handleInventoryItemChange(index, 'description', e.target.value)} placeholder="Description/Notes" className="flex-grow bg-[var(--bg-primary)]/80 p-2 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-primary-hover)] focus:border-[var(--accent-primary-hover)]"/>
                                <Button type="button" size="sm" onClick={() => removeInventoryItem(item.id)} variant="ghost" className="!p-2 aspect-square text-[var(--text-muted)] hover:text-red-500 hover:bg-red-900/30 self-center sm:self-auto"><TrashIcon className="h-5 w-5"/></Button>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>}

            {activeTab === 'companions' && <div className="animate-fade-in">
                 <Section title="Companions & Familiars">
                    <div className="space-y-6">
                        {(formData.companions || []).map((companion, compIndex) => (
                             <div key={companion.id} className="bg-[var(--bg-secondary)]/70 p-4 rounded-lg border border-[var(--border-primary)] space-y-4">
                                 <div className="flex justify-between items-start">
                                     <h4 className="text-lg font-medieval text-[var(--accent-secondary)]">{companion.name || 'New Companion'}</h4>
                                     <Button type="button" onClick={() => removeCompanion(companion.id)} variant="destructive" size="sm" className="!p-2 aspect-square"><TrashIcon className="h-5 w-5"/></Button>
                                 </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                     <FormInput label="Name" value={companion.name} onChange={e => handleCompanionChange(compIndex, 'name', e.target.value)} />
                                     <FormInput label="Type" value={companion.type} onChange={e => handleCompanionChange(compIndex, 'type', e.target.value)} placeholder="e.g. Beast, Familiar" />
                                     <FormInput label="Speed" value={companion.speed} onChange={e => handleCompanionChange(compIndex, 'speed', e.target.value)} placeholder="e.g. 30 ft., fly 60 ft." />
                                     <FormInput label="Current HP" type="number" value={companion.currentHp} onChange={e => handleCompanionChange(compIndex, 'currentHp', parseInt(e.target.value) || 0)} />
                                     <FormInput label="Max HP" type="number" value={companion.maxHp} onChange={e => handleCompanionChange(compIndex, 'maxHp', parseInt(e.target.value) || 0)} />
                                     <FormInput label="AC" type="number" value={companion.ac} onChange={e => handleCompanionChange(compIndex, 'ac', parseInt(e.target.value) || 0)} />
                                 </div>
                                 <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                     {(Object.keys(companion.abilityScores) as Array<keyof Companion['abilityScores']>).map(key => (
                                         <FormInput key={key} label={key.toUpperCase()} type="number" value={companion.abilityScores[key]} onChange={e => handleCompanionAbilityScoreChange(compIndex, key, e.target.value)} />
                                     ))}
                                 </div>
                                  <div>
                                     <h5 className="font-bold text-[var(--text-secondary)] mb-2">Actions</h5>
                                     <div className="space-y-2">
                                         {companion.actions.map((action, actionIndex) => (
                                             <div key={action.id} className="flex gap-2 items-end p-2 bg-[var(--bg-primary)]/50 rounded">
                                                 <div className="flex-grow space-y-1">
                                                     <input value={action.name} onChange={e => handleCompanionActionChange(compIndex, actionIndex, 'name', e.target.value)} placeholder="Action Name" className="w-full bg-[var(--bg-secondary)] p-1 rounded border border-[var(--border-secondary)]"/>
                                                     <textarea value={action.description} onChange={e => handleCompanionActionChange(compIndex, actionIndex, 'description', e.target.value)} placeholder="Description" rows={1} className="w-full bg-[var(--bg-secondary)] p-1 rounded text-sm border border-[var(--border-secondary)]"/>
                                                 </div>
                                                 <Button type="button" onClick={() => removeCompanionAction(compIndex, action.id)} variant="ghost" size="sm" className="!p-1.5 aspect-square text-[var(--text-muted)] hover:text-red-500"><TrashIcon className="h-4 w-4"/></Button>
                                             </div>
                                         ))}
                                     </div>
                                     <Button type="button" onClick={() => addCompanionAction(compIndex)} size="sm" variant="ghost" className="mt-2">Add Action</Button>
                                 </div>
                                 <FormTextarea label="Notes" value={companion.notes} onChange={e => handleCompanionChange(compIndex, 'notes', e.target.value)} rows={3}/>
                             </div>
                        ))}
                    </div>
                    <Button type="button" onClick={addCompanion} className="mt-6">Add Companion</Button>
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

interface SpellSelectorProps {
    onSelect: (spellName: string) => void;
    onRemove: (spellName: string) => void;
    knownSpells: string[];
    characterClass: string;
    subclass: string;
    characterLevel: number;
    abilityScores: Character['abilityScores'];
    homebrewSpells: HomebrewSpell[];
}

const SpellSelector: React.FC<SpellSelectorProps> = ({ onSelect, onRemove, knownSpells, characterClass, subclass, characterLevel, abilityScores, homebrewSpells }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState<string>('All');

    const allSpells: Spell[] = useMemo(() => [
        ...Object.values(DND_SPELLS),
        ...homebrewSpells.map(hs => ({...hs, source: 'Homebrew'} as Spell))
    ].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)), [homebrewSpells]);
    
    const classData = DND_CLASS_DATA[characterClass];
    const spellcastingData = useMemo(() => {
        if (!classData) return null;
        if (subclass && classData.subclasses[subclass]?.spellcasting) {
            return classData.subclasses[subclass].spellcasting;
        }
        return classData.spellcasting;
    }, [classData, subclass]);
    
    const maxSpellLevel = useMemo(() => {
        if (!spellcastingData?.spellSlots) return 0;
        const slotsForLevel = spellcastingData.spellSlots[characterLevel - 1] || [];
        for (let i = slotsForLevel.length - 1; i >= 0; i--) {
            if (slotsForLevel[i] > 0) {
                return i + 1;
            }
        }
        return 0; // No spell slots > level 0 for cantrips
    }, [spellcastingData, characterLevel]);

    const availableSpells = useMemo(() => {
        if (!characterClass) return [];
        
        const isProfaneSoul = characterClass === 'Blood Hunter' && subclass === 'Order of the Profane Soul';

        return allSpells.filter(spell => {
            let classMatch = spell.class.includes(characterClass) || (subclass && spell.class.includes(subclass));
            if (isProfaneSoul) classMatch = classMatch || spell.class.includes('Warlock');
            if (!classMatch) return false;

            const searchTermMatch = spell.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (!searchTermMatch) return false;

            if (levelFilter === 'All') return true;
            if (levelFilter === 'Cantrip') return spell.level === 0;
            return spell.level === parseInt(levelFilter.replace('Lvl ', ''));
        });
    }, [allSpells, characterClass, subclass, searchTerm, levelFilter]);
    
    const knownSpellsList = useMemo(() => 
        knownSpells.map(name => allSpells.find(s => s.name === name)).filter((s): s is Spell => s !== undefined),
        [knownSpells, allSpells]
    );

    const knownCantripsCount = useMemo(() => knownSpellsList.filter(s => s.level === 0).length, [knownSpellsList]);
    const knownLeveledSpellsCount = useMemo(() => knownSpellsList.filter(s => s.level > 0).length, [knownSpellsList]);

    const { maxCantrips, maxSpellsPrepared, spellsKnownOrPreparedLabel } = useMemo(() => {
        if (!spellcastingData) return { maxCantrips: 0, maxSpellsPrepared: 0, spellsKnownOrPreparedLabel: 'Spells' };

        const cantrips = spellcastingData.cantripsKnown?.[characterLevel - 1] || 0;
        
        let maxSpells = 0;
        let label = 'Spells Prepared';
        const abilityMod = spellcastingData.ability ? Math.max(0, Math.floor((abilityScores[spellcastingData.ability] - 10) / 2)) : 0;
        
        if (spellcastingData.spellsKnown) {
            maxSpells = spellcastingData.spellsKnown[characterLevel - 1] || 0;
            label = 'Spells Known';
        } 
        else {
            switch (characterClass) {
                case 'Cleric': case 'Druid': case 'Wizard':
                    maxSpells = Math.max(1, abilityMod + characterLevel);
                    break;
                case 'Paladin': case 'Artificer':
                    maxSpells = Math.max(1, abilityMod + Math.floor(characterLevel / 2));
                    break;
                default:
                    maxSpells = Math.max(1, abilityMod + characterLevel); // Fallback for homebrew
            }
        }

        return { maxCantrips: cantrips, maxSpellsPrepared: maxSpells, spellsKnownOrPreparedLabel: label };
    }, [spellcastingData, characterClass, characterLevel, abilityScores]);


    const handleToggleSpell = (spell: Spell) => {
        const isKnown = knownSpells.includes(spell.name);
        if (isKnown) {
            onRemove(spell.name);
        } else {
            if (spell.level === 0) {
                if (knownCantripsCount < maxCantrips) onSelect(spell.name);
            } else {
                if (knownLeveledSpellsCount < maxSpellsPrepared) onSelect(spell.name);
            }
        }
    };
    
    if (!spellcastingData) {
        return (
            <div className="bg-[var(--bg-primary)]/50 p-6 rounded-lg border border-[var(--border-primary)] text-center text-[var(--text-muted)]">
                 This class does not have spellcasting abilities, or spellcasting is gained at a higher level.
            </div>
        );
    }

    const filterButtons = ['All', 'Cantrip', ...Array.from({ length: 9 }, (_, i) => `Lvl ${i + 1}`)];

    return (
        <div className="bg-[var(--bg-primary)]/50 p-6 rounded-lg border border-[var(--border-primary)]">
            <h3 className="text-xl font-medieval text-[var(--accent-primary)] mb-4">Spellbook</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-center bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-secondary)]">
                <div>
                    <p className="text-sm text-[var(--text-secondary)]">Cantrips Known</p>
                    <p className="text-3xl font-bold">
                        <span className={knownCantripsCount > maxCantrips ? 'text-red-500' : 'text-[var(--accent-primary)]'}>{knownCantripsCount}</span>
                        <span className="text-xl text-[var(--text-muted)]"> / {maxCantrips}</span>
                    </p>
                </div>
                <div>
                    <p className="text-sm text-[var(--text-secondary)]">{spellsKnownOrPreparedLabel}</p>
                    <p className="text-3xl font-bold">
                       <span className={knownLeveledSpellsCount > maxSpellsPrepared ? 'text-red-500' : 'text-[var(--accent-primary)]'}>{knownLeveledSpellsCount}</span>
                       <span className="text-xl text-[var(--text-muted)]"> / {maxSpellsPrepared}</span>
                    </p>
                </div>
            </div>

            <input
                type="text"
                placeholder="Search available spells..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] mb-4"
            />

            <div className="flex flex-wrap gap-1 mb-4">
                {filterButtons.map(filter => {
                    return (
                        <Button
                            key={filter}
                            type="button"
                            size="sm"
                            onClick={() => setLevelFilter(filter)}
                            className={levelFilter === filter 
                                ? '!bg-[var(--border-accent-primary)] !text-[var(--bg-primary)] shadow-[0_0_8px_var(--glow-primary)]' 
                                : 'bg-[var(--bg-secondary)]/80 hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}
                        >
                            {filter}
                        </Button>
                    );
                })}
            </div>

            <div className="max-h-[400px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pr-2">
                {availableSpells.map(spell => {
                    const isKnown = knownSpells.includes(spell.name);
                    const isLocked = spellcastingData && spell.level > 0 && spell.level > maxSpellLevel;
                    const isCantrip = spell.level === 0;
                    const cantripsFull = knownCantripsCount >= maxCantrips;
                    const spellsFull = knownLeveledSpellsCount >= maxSpellsPrepared;
                    const isDisabled = isLocked || (!isKnown && ((isCantrip && cantripsFull) || (!isCantrip && spellsFull)));

                    return (
                        <button
                            type="button"
                            key={spell.name}
                            onClick={() => handleToggleSpell(spell)}
                            disabled={isDisabled}
                            className={`p-3 rounded-md text-left transition-all duration-200 w-full flex flex-col justify-between border-2 relative ${
                                isKnown 
                                ? 'bg-[var(--bg-tertiary)] border-[var(--border-accent-secondary)] shadow-[0_0_10px_var(--glow-secondary)]' 
                                : isDisabled
                                ? 'bg-[var(--bg-primary)]/50 border-[var(--border-primary)] opacity-60 cursor-not-allowed'
                                : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-secondary)]'
                            }`}
                        >
                            {isLocked && <LockIcon className="absolute top-2 right-2 h-4 w-4 text-[var(--text-muted)]"/>}
                            <p className={`font-bold text-[var(--text-primary)] ${isLocked ? 'pr-6' : ''}`}>{spell.name}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">{isCantrip ? 'Cantrip' : `Level ${spell.level}`}</p>
                        </button>
                    );
                })}
                 {availableSpells.length === 0 && (
                    <div className="col-span-full text-center text-[var(--text-muted)] italic py-8">
                        No spells match your criteria.
                    </div>
                 )}
            </div>
        </div>
    );
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
                    <option value="All">All Categories</option>
                    <option value="Weapon">Weapons</option>
                    <option value="Armor">Armor</option>
                    <option value="Gear">Gear</option>
                    <option value="Magic Item">Magic Items</option>
                </select>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {filteredItems.slice(0, 100).map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex justify-between items-center p-2 bg-[var(--bg-secondary)]/70 rounded-md">
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">{item.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{item.category}</p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddItem(item)}>Add</Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterForm;