import React, { useState, useEffect, useRef } from 'react';
import { Character, InventoryItem, Feature, Spell, SheetSection, Companion, CompanionAction } from '../types';
import Button from './ui/Button';
import { SwordsIcon } from './icons/SwordsIcon';
import { BookIcon } from './icons/BookIcon';
import { BackpackIcon } from './icons/BackpackIcon';
import { DND_SPELLS } from '../data/spellsData';
import CommonActions from './CommonActions';
import { D20Icon } from './icons/D20Icon';
import InfoDialog from './ui/InfoDialog';
import { DND_CLASS_DATA } from '../data/dndData';
import { ARMOR } from '../data/equipmentData';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { UsersIcon } from './icons/UsersIcon';
import CompanionSheetCard from './CompanionSheetCard';

interface CharacterSheetProps {
  character: Character;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdate?: (character: Character) => void;
  history?: string[];
  setHistory?: React.Dispatch<React.SetStateAction<string[]>>;
  isReadOnly?: boolean;
  onEditCrest?: () => void;
}

type ModalContent = Feature | Spell | { name: string; description: string };

const getModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
};

const AbilityScoreCard: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="bg-[var(--bg-primary)]/80 rounded-lg p-2 text-center border border-[var(--border-primary)]/80 shadow-inner flex flex-col items-center justify-center">
        <div className="text-sm font-bold text-[var(--text-secondary)] uppercase">{label}</div>
        <div className="text-2xl font-bold text-[var(--accent-secondary)] text-glow-cyan">{getModifier(score)}</div>
        <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-primary)] rounded-full px-2 mt-1">{score}</div>
    </div>
);

const VitalStat: React.FC<{ label: string; value: string | number, icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center gap-3 text-left bg-[var(--bg-primary)]/80 p-3 rounded-lg border border-[var(--border-primary)]">
        <div className="text-[var(--accent-secondary)] flex-shrink-0 text-glow-cyan">{icon}</div>
        <div>
            <span className="text-2xl font-bold text-[var(--text-primary)]">{value}</span>
            <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        </div>
    </div>
);

const HpTracker: React.FC<{ current: number; max: number; onUpdate?: (newHp: number) => void; isReadOnly?: boolean }> = ({ current, max, onUpdate, isReadOnly }) => {
    const [localHp, setLocalHp] = useState(current);

    useEffect(() => {
        setLocalHp(current);
    }, [current]);

    const handleHpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalHp(Number(e.target.value));
    };

    const handleHpBlur = () => {
        if (!onUpdate) return;
        let newHp = isNaN(localHp) ? current : localHp;
        if (newHp > max) newHp = max;
        if (newHp < 0) newHp = 0;
        onUpdate(newHp);
    };

    return (
         <div className="flex items-center gap-3 text-left bg-[var(--bg-primary)]/80 p-3 rounded-lg border border-[var(--border-primary)]">
            <div className="text-red-400 flex-shrink-0 text-glow-red"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>
            <div className="flex items-baseline gap-2">
                {isReadOnly ? (
                    <span className="w-16 text-2xl font-bold text-[var(--text-primary)] text-right">{current}</span>
                ) : (
                    <input 
                        type="number"
                        value={localHp}
                        onChange={handleHpChange}
                        onBlur={handleHpBlur}
                        className="w-16 bg-transparent text-2xl font-bold text-[var(--text-primary)] text-right border-none focus:ring-0 p-0"
                        aria-label="Current Hit Points"
                    />
                )}
                <span className="text-[var(--text-muted)]">/</span>
                <span className="text-2xl font-bold text-[var(--text-primary)]">{max}</span>
            </div>
            <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider self-end mb-1">Hit Points</span>
        </div>
    );
};

const ActionItemCard: React.FC<{
  name: string;
  onClick: () => void;
  isLocked?: boolean;
  recharge?: string;
  uses?: string;
  type: 'feature' | 'spell' | 'action';
  isReadOnly?: boolean;
}> = ({ name, onClick, isLocked = false, recharge, uses, type, isReadOnly }) => {
    const typeColor = {
        feature: 'border-amber-400/50 text-amber-300 hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]',
        spell: 'border-violet-400/50 text-violet-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.4)]',
        action: 'border-[var(--border-secondary)]/50 text-[var(--text-secondary)]'
    };

    return (
        <button
            onClick={onClick}
            disabled={isLocked || isReadOnly}
            className={`
                p-3 rounded-md text-left transition-all duration-200 w-full h-full flex flex-col justify-between
                border-l-4
                ${isLocked || isReadOnly ? 'bg-[var(--bg-primary)]/50 cursor-not-allowed' : `bg-[var(--bg-secondary)]/70 hover:bg-[var(--bg-tertiary)]/80 hover:border-l-4`}
                ${isLocked || isReadOnly ? 'border-[var(--border-primary)]' : typeColor[type]}
            `}
        >
            <strong className={`font-bold ${isLocked || isReadOnly ? 'text-[var(--text-muted)]' : typeColor[type].split(' ')[1]}`}>{name}</strong>
            {(uses || recharge) && (
                 <div className="text-xs text-[var(--text-muted)] mt-2 text-right">
                    {uses && <span className={`font-mono px-2 py-0.5 rounded ${isLocked || isReadOnly ? 'bg-[var(--bg-primary)]/80 text-[var(--text-muted)]' : 'bg-[var(--bg-primary)]/80'}`}>{uses}</span>}
                    {recharge && <span className="ml-2 capitalize">{recharge} Rest</span>}
                </div>
            )}
        </button>
    );
};

const SpellSlotTracker: React.FC<{
  level: number;
  current: number;
  max: number;
  onExpend?: (level: number) => void;
  isReadOnly?: boolean;
}> = ({ level, current, max, onExpend, isReadOnly }) => {
  if (max === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <h4 className="font-bold text-lg w-20 shrink-0">Lvl {level}:</h4>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            onClick={() => onExpend?.(level)}
            disabled={i >= current || isReadOnly}
            className={`h-6 w-6 rounded-md border-2 transition-all ${
              i < current
                ? 'bg-violet-500 border-violet-300 hover:bg-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.7)]'
                : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] cursor-not-allowed'
            }`}
            aria-label={`Expend level ${level} spell slot. ${current} of ${max} remaining.`}
          />
        ))}
      </div>
    </div>
  );
};

const SpellbookTab: React.FC<{ character: Character; onUpdate?: (char: Character) => void; onOpenModal: (content: ModalContent) => void, isReadOnly?: boolean }> = ({ character, onUpdate, onOpenModal, isReadOnly }) => {
  const { characterClass, subclass, level, abilityScores, spells: knownSpellNames, spellSlots } = character;
  
  const classData = DND_CLASS_DATA[characterClass];
  let spellcastingData = classData?.spellcasting;
  if (subclass && classData?.subclasses[subclass]?.spellcasting) {
    spellcastingData = classData.subclasses[subclass].spellcasting;
  }
  
  if (!spellcastingData) {
    return <p className="text-[var(--text-muted)] text-center py-8 col-span-full">This character does not have spellcasting abilities.</p>;
  }

  const proficiencyBonus = Math.floor((level - 1) / 4) + 2;
  const spellcastingAbility = spellcastingData.ability;
  const abilityModifier = Math.floor((abilityScores[spellcastingAbility] - 10) / 2);

  const spellSaveDC = 8 + proficiencyBonus + abilityModifier;
  const spellAttackBonus = proficiencyBonus + abilityModifier;

  const handleExpendSlot = (level: number) => {
    if (!onUpdate) return;
    const slotIndex = level - 1;
    if (spellSlots.current[slotIndex] > 0) {
      const newSlots = { ...spellSlots };
      newSlots.current[slotIndex] -= 1;
      onUpdate({ ...character, spellSlots: newSlots });
    }
  };

  const knownSpells = knownSpellNames.map(name => DND_SPELLS[name]).filter(Boolean);
  
  const spellsByLevel = knownSpells.reduce((acc, spell) => {
    const level = spell.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(spell);
    return acc;
  }, {} as Record<number, Spell[]>);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-2 gap-4 text-center bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)]">
        <div>
          <p className="text-sm text-[var(--text-muted)] uppercase">Spell Save DC</p>
          <p className="text-4xl font-bold text-[var(--accent-secondary)] text-glow-cyan">{spellSaveDC}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--text-muted)] uppercase">Spell Attack Bonus</p>
          <p className="text-4xl font-bold text-[var(--accent-secondary)] text-glow-cyan">+{spellAttackBonus}</p>
        </div>
      </div>

      <div className="bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)] space-y-3">
        <h3 className="text-xl font-medieval text-amber-300 mb-2">Spell Slots</h3>
        {spellSlots.max.map((max, i) => (
          <SpellSlotTracker
            key={i}
            level={i + 1}
            max={max}
            current={spellSlots.current[i] || 0}
            onExpend={handleExpendSlot}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>

      {Object.entries(spellsByLevel).sort(([a], [b]) => Number(a) - Number(b)).map(([level, spells]) => (
        <div key={level}>
          <h3 className="text-xl font-medieval text-amber-300 mb-3 border-b border-[var(--border-primary)] pb-2">
            {Number(level) === 0 ? 'Cantrips' : `Level ${level}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {spells.sort((a,b) => a.name.localeCompare(b.name)).map(spell => (
              <ActionItemCard
                key={spell.name}
                name={spell.name}
                onClick={() => onOpenModal(spell)}
                type="spell"
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        </div>
      ))}
       {knownSpells.length === 0 && <p className="text-[var(--text-muted)] text-center py-8">No spells known.</p>}
    </div>
  );
};

const calculateAC = (character: Character): number => {
    let baseAC = 10;
    const dexMod = Math.floor((character.abilityScores.dex - 10) / 2);
    
    const equippedArmor = character.inventory.find(i => i.equipped && (i.category === 'Armor'));
    const equippedShield = character.inventory.find(i => i.equipped && i.name.toLowerCase().includes('shield'));

    if (equippedArmor) {
        const armorData = ARMOR.find(a => a.name === equippedArmor.name);
        if (armorData && armorData.armorClass.base > 10) { // Check it's not a shield miscategorized
            baseAC = armorData.armorClass.base;
            if (armorData.armorClass.dexBonus) {
                const maxDex = armorData.armorClass.maxBonus === undefined ? Infinity : armorData.armorClass.maxBonus;
                baseAC += Math.min(dexMod, maxDex);
            }
        } else {
             baseAC += dexMod; // Fallback for custom armor
        }
    } else {
        baseAC += dexMod; // Unarmored
    }

    if (equippedShield) {
        baseAC += 2; // Standard shield bonus
    }
    
    // Monk/Barbarian unarmored defense can be added here in the future
    
    return baseAC;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onEdit, onDelete, onUpdate, history = [], setHistory, isReadOnly = false, onEditCrest }) => {
  const [activeTab, setActiveTab] = useState<SheetSection>('features');
  const [modalContent, setModalContent] = useState<ModalContent | CompanionAction | null>(null);
  const [isPortraitModalOpen, setPortraitModalOpen] = useState(false);

  const defaultTabs: SheetSection[] = ['features', 'spells', 'inventory', 'actions', 'notes', 'companions'];
  const [tabs, setTabs] = useState<SheetSection[]>(character.sheetSectionOrder || defaultTabs);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  useEffect(() => {
      const characterTabs = character.sheetSectionOrder || defaultTabs;
      const allTabs = [...new Set([...characterTabs, ...defaultTabs])];
      const finalTabs = allTabs.filter(t => t !== 'companions' || (character.companions && character.companions.length > 0));
      setTabs(finalTabs);
      if (!finalTabs.includes(activeTab)) {
        setActiveTab('features');
      }
  }, [character.sheetSectionOrder, character.companions]);

  const handleDragSort = () => {
    if (isReadOnly || dragItem.current === null || dragOverItem.current === null) return;
    
    const newTabs = [...tabs];
    const draggedItemContent = newTabs.splice(dragItem.current, 1)[0];
    newTabs.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    setTabs(newTabs);

    if (onUpdate) {
        const fullSheetOrder = [...new Set([...newTabs, ...defaultTabs])];
        onUpdate({ ...character, sheetSectionOrder: fullSheetOrder });
    }
  };


  const handleHpUpdate = (newHp: number) => {
    if (onUpdate) {
      onUpdate({ ...character, currentHp: newHp });
    }
  };

  const handleCompanionUpdate = (updatedCompanion: Companion) => {
    if (onUpdate) {
        const newCompanions = character.companions.map(c => c.id === updatedCompanion.id ? updatedCompanion : c);
        onUpdate({ ...character, companions: newCompanions });
    }
  };
  
  const tabConfig: Record<SheetSection, { label: string, icon: React.ReactNode }> = {
    features: { label: 'Features', icon: <SwordsIcon className="h-5 w-5"/> },
    spells: { label: 'Spellbook', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M4 5h16v12H6.5A2.5 2.5 0 0 0 4 19.5V5zM14 9l-2 2-2-2"/><path d="m10 13 2 2 2-2"/></svg> },
    inventory: { label: 'Inventory', icon: <BackpackIcon className="h-5 w-5"/> },
    actions: { label: 'Actions', icon: <D20Icon className="h-5 w-5"/> },
    notes: { label: 'Notes', icon: <BookIcon className="h-5 w-5"/> },
    companions: { label: 'Companions', icon: <UsersIcon className="h-5 w-5"/> },
  };

  const TabButton: React.FC<{tabId: SheetSection, children: React.ReactNode, icon: React.ReactNode}> = ({tabId, children, icon}) => (
      <button onClick={() => setActiveTab(tabId)} className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-medieval rounded-t-lg transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === tabId ? 'bg-[var(--bg-secondary)]/80 border-amber-400 text-amber-300 shadow-[0_3px_12px_rgba(251,191,36,0.4)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/50'}`}>
          {icon} {children}
      </button>
  );
  
  const handleOpenModal = (content: ModalContent | CompanionAction) => {
    setModalContent(content);
  };

  const handleUseFeature = () => {
    if (!modalContent || !('id' in modalContent) || !onUpdate || !setHistory) return;

    const feature = modalContent as Feature;
    const updatedChar = { ...character };
    const charFeature = updatedChar.features.find(f => f.id === feature.id);
    let shouldUpdate = false;
    
    if (charFeature?.uses && charFeature.uses.current > 0) {
      charFeature.uses.current -= 1;
      shouldUpdate = true;
    }

    if(shouldUpdate) {
        onUpdate(updatedChar);
    }

    setHistory(prev => [`Used feature: ${feature.name}`, ...prev]);
    setModalContent(null);
  };
  
  const handleUseSpell = () => {
    if (!modalContent || !('level' in modalContent) || !setHistory) return;
    const spell = modalContent as Spell;
    setHistory(prev => [`Used spell: ${spell.name}`, ...prev]);
    setModalContent(null);
  };

  const handleUseAction = () => {
      if (!modalContent || 'id' in modalContent || 'level' in modalContent || !setHistory) return;
      setHistory(prev => [`Used action: ${modalContent.name}`, ...prev]);
      setModalContent(null);
  }

  const handleUpdateCurrency = (value: number) => {
      if (!onUpdate) return;
      onUpdate({ ...character, currency: isNaN(value) ? 0 : value });
  }

  const handleToggleEquip = (itemId: string) => {
    if (!onUpdate) return;
    const newInventory = character.inventory.map(item => {
        if (item.id === itemId) {
            return {...item, equipped: !item.equipped};
        }
        // If equipping armor, unequip other armor
        if (item.category === 'Armor' && item.id !== itemId) {
             return {...item, equipped: false};
        }
        return item;
    });

    const tempChar = { ...character, inventory: newInventory };
    const newAC = calculateAC(tempChar);
    onUpdate({ ...tempChar, ac: newAC });
  }
  
  const handleShortRest = () => {
    if (!onUpdate || !setHistory) return;
    const updatedChar = {...character};
    updatedChar.features.forEach(f => {
      if(f.recharge === 'short' && f.uses) {
        f.uses.current = f.uses.max;
      }
    });

    if (updatedChar.characterClass === 'Warlock') {
        updatedChar.spellSlots.current = [...updatedChar.spellSlots.max];
    }

    setHistory([]);
    onUpdate(updatedChar);
  };
  
  const handleLongRest = () => {
    if (!onUpdate || !setHistory) return;
    const updatedChar = {...character};
    updatedChar.features.forEach(f => {
      if((f.recharge === 'short' || f.recharge === 'long') && f.uses) {
        f.uses.current = f.uses.max;
      }
    });
    updatedChar.currentHp = updatedChar.maxHp;
    updatedChar.spellSlots.current = [...updatedChar.spellSlots.max];
    setHistory([]);
    onUpdate(updatedChar);
  };

  const getModalAction = () => {
    if (!modalContent || isReadOnly) return {};

    const isFeature = 'id' in modalContent && 'source' in modalContent;
    const isSpell = 'level' in modalContent;
    const isCompanionAction = 'id' in modalContent && !('source' in modalContent);

    if (isFeature) {
        const feature = modalContent as Feature;
        return {
            actionText: "Use",
            onAction: handleUseFeature,
            actionDisabled: feature.uses ? feature.uses.current === 0 : false
        };
    }
    if (isSpell) {
       return {
            actionText: "Use",
            onAction: handleUseSpell,
            actionDisabled: false
      };
    }
    if (isCompanionAction) {
        return {}; // No action for companion abilities yet
    }
    // It's a common action
    return {
        actionText: "Use",
        onAction: handleUseAction,
        actionDisabled: false
    };
  };

  const totalWeight = character.inventory.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
  const carryingCapacity = character.abilityScores.str * 15;

  const inventoryByCategory = character.inventory.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <div className="w-full animate-fade-in bg-[var(--bg-secondary)]/70 backdrop-blur-sm rounded-xl shadow-2xl shadow-black/50 p-4 sm:p-6 lg:p-8 border border-[var(--border-primary)]">
        <header className="mb-6 border-b-4 border-[var(--border-primary)] pb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
                {/* Portrait */}
                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => character.appearanceImage && setPortraitModalOpen(true)}
                        className={`group relative w-24 h-24 sm:w-32 sm:h-32 bg-[var(--bg-primary)]/80 rounded-lg border-4 border-[var(--border-primary)] flex items-center justify-center overflow-hidden shadow-lg ${character.appearanceImage ? 'cursor-pointer' : 'cursor-default'}`}
                        aria-label="Show character portrait"
                        disabled={!character.appearanceImage}
                    >
                        {character.appearanceImage ? (
                            <img src={character.appearanceImage} alt={character.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                            <div className="text-[var(--text-muted)]">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>
                            </div>
                        )}
                        {character.appearanceImage && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white font-bold text-lg">Show</span>
                            </div>
                        )}
                    </button>
                    {!isReadOnly && onEditCrest && (
                        <Button onClick={onEditCrest} variant="ghost" size="sm" className="!absolute -bottom-2 -right-2 !p-2 rounded-full shadow-lg" aria-label="Edit Crest">
                            <PaintBrushIcon className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                {/* Info and Actions */}
                <div className="flex-grow w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start w-full">
                        <div className="text-center sm:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medieval text-[var(--text-primary)] break-words">{character.name || "Unnamed Hero"}</h1>
                            <p className="text-xl sm:text-2xl text-[var(--text-secondary)] mt-2">
                                Level {character.level} {character.race} {character.characterClass}
                                {character.subclass && ` (${character.subclass})`}
                            </p>
                        </div>
                        {!isReadOnly && onEdit && onDelete && (
                            <div className="flex gap-2 mt-4 sm:mt-2 flex-shrink-0 mx-auto sm:mx-0">
                                <Button onClick={onEdit}>Edit</Button>
                                <Button onClick={onDelete} variant="destructive">Delete</Button>
                            </div>
                        )}
                    </div>
                     {!isReadOnly && (
                        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[var(--border-primary)]/80">
                            <Button onClick={handleShortRest} size="sm" variant="ghost">Short Rest</Button>
                            <Button onClick={handleLongRest} size="sm" variant="ghost">Long Rest</Button>
                        </div>
                     )}
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* --- LEFT COLUMN --- */}
            <div className="lg:col-span-3 space-y-6">
                <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    <HpTracker current={character.currentHp} max={character.maxHp} onUpdate={handleHpUpdate} isReadOnly={isReadOnly} />
                    <VitalStat label="Armor Class" value={character.ac} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
                    <VitalStat label="Passive Perception" value={character.passivePerception} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>} />
                </section>
                 <section>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                        <AbilityScoreCard label="STR" score={character.abilityScores.str} />
                        <AbilityScoreCard label="DEX" score={character.abilityScores.dex} />
                        <AbilityScoreCard label="CON" score={character.abilityScores.con} />
                        <AbilityScoreCard label="INT" score={character.abilityScores.int} />
                        <AbilityScoreCard label="WIS" score={character.abilityScores.wis} />
                        <AbilityScoreCard label="CHA" score={character.abilityScores.cha} />
                    </div>
                </section>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="lg:col-span-9">
                <div className="border-b border-[var(--border-primary)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-px">
                         {tabs.map((tabId, index) => (
                            <div
                                key={tabId}
                                draggable={!isReadOnly}
                                onDragStart={() => dragItem.current = index}
                                onDragEnter={() => dragOverItem.current = index}
                                onDragEnd={handleDragSort}
                                onDragOver={(e) => e.preventDefault()}
                                className={!isReadOnly ? 'cursor-move' : ''}
                            >
                                <TabButton tabId={tabId} icon={tabConfig[tabId].icon}>
                                    {tabConfig[tabId].label}
                                </TabButton>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[var(--bg-secondary)]/80 rounded-b-lg p-4 min-h-[400px]">
                    {activeTab === 'features' && (
                        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {character.features.length > 0 ? (
                                character.features.map(f => <ActionItemCard 
                                    key={f.id} 
                                    name={f.name} 
                                    onClick={() => handleOpenModal(f)}
                                    isLocked={f.uses ? f.uses.current === 0 : false}
                                    uses={f.uses ? `${f.uses.current}/${f.uses.max}` : undefined}
                                    recharge={f.recharge}
                                    type="feature" 
                                    isReadOnly={isReadOnly} />)
                            ) : <p className="text-[var(--text-muted)] text-center py-8 col-span-full">No features added.</p>}
                        </div>
                    )}
                    {activeTab === 'spells' && (
                        <SpellbookTab character={character} onUpdate={onUpdate} onOpenModal={handleOpenModal} isReadOnly={isReadOnly} />
                    )}
                    {activeTab === 'inventory' && (
                         <div className="animate-fade-in space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--bg-primary)]/50 p-3 rounded-lg border border-[var(--border-primary)]">
                                <div className="flex items-center gap-2">
                                     <label className="text-sm text-[var(--text-muted)] uppercase">GP:</label>
                                     <input 
                                        type="number" 
                                        value={character.currency} 
                                        onChange={(e) => handleUpdateCurrency(Number(e.target.value))} 
                                        readOnly={isReadOnly}
                                        className="w-28 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded p-1 text-center font-bold text-xl text-amber-300 focus:ring-amber-400 focus:border-amber-400 read-only:bg-[var(--bg-primary)]/50 read-only:cursor-default" 
                                        aria-label="Gold Pieces"
                                    />
                                </div>
                               <div className="text-center">
                                    <p className="text-sm text-[var(--text-muted)] uppercase">Weight / Capacity</p>
                                    <p className="text-lg font-bold text-[var(--text-primary)]">{totalWeight.toFixed(1)} / {carryingCapacity} lbs</p>
                                </div>
                            </div>

                            {Object.entries(inventoryByCategory).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="text-xl font-medieval text-amber-300 mb-2 border-b border-[var(--border-primary)] pb-1">{category}</h3>
                                    <ul className="space-y-2">
                                        {items.map(item => (
                                            <li key={item.id} className={`flex justify-between items-center p-3 rounded-md transition-colors ${item.equipped ? 'bg-[var(--bg-equipped)]' : 'bg-[var(--bg-primary)]/50 hover:bg-[var(--bg-tertiary)]/50'}`}>
                                                <div className="flex items-center gap-4 flex-grow">
                                                     {(item.category === 'Armor' || item.name.toLowerCase().includes('shield')) && (
                                                        <input type="checkbox" checked={item.equipped} onChange={() => handleToggleEquip(item.id)} disabled={isReadOnly} title="Equip" className="h-5 w-5 rounded bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-cyan-500 focus:ring-cyan-600 shrink-0 cursor-pointer disabled:cursor-not-allowed" />
                                                     )}
                                                    <div className="flex-grow">
                                                        <strong className="text-[var(--text-secondary)]">{item.name} {item.quantity > 1 ? <span className="text-sm text-[var(--text-muted)]">(x{item.quantity})</span> : ''}</strong>
                                                        {item.description && <p className="text-[var(--text-muted)] text-sm italic">{item.description}</p>}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-[var(--text-muted)] ml-4 whitespace-nowrap">{item.weight * item.quantity} lbs</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            {character.inventory.length === 0 && <p className="text-[var(--text-muted)] text-center py-8">Inventory is empty.</p>}
                        </div>
                    )}
                    {activeTab === 'actions' && (
                        <div className="animate-fade-in">
                          <CommonActions onActionSelect={handleOpenModal} isReadOnly={isReadOnly} />
                        </div>
                    )}
                    {activeTab === 'notes' && (
                        <div className="animate-fade-in bg-[var(--bg-primary)]/50 p-4 rounded-lg">
                            <h3 className="text-xl font-medieval text-amber-300 mb-2">Notes & Backstory</h3>
                            <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{character.notes || 'No notes or backstory entered.'}</p>
                        </div>
                    )}
                    {activeTab === 'companions' && (
                        <div className="animate-fade-in space-y-4">
                            {character.companions && character.companions.length > 0 ? (
                                character.companions.map(companion => (
                                    <CompanionSheetCard
                                        key={companion.id}
                                        companion={companion}
                                        onUpdate={handleCompanionUpdate}
                                        onOpenModal={handleOpenModal}
                                        isReadOnly={isReadOnly}
                                    />
                                ))
                            ) : (
                                <p className="text-[var(--text-muted)] text-center py-8 col-span-full">No companions added. You can add them in the character editor.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {!isReadOnly && setHistory && (
          <section className="mt-8">
              <h2 className="text-2xl font-medieval text-amber-300 mb-3">History Log</h2>
              <div className="bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)] h-32 overflow-y-auto">
                  {history.length > 0 ? (
                      <ul className="text-[var(--text-muted)] text-sm space-y-1">
                          {history.map((entry, index) => <li key={index} className="animate-fade-in">{entry}</li>)}
                      </ul>
                  ) : (
                      <p className="text-[var(--text-muted)]/70 text-center pt-8">No actions taken yet.</p>
                  )}
              </div>
          </section>
        )}

        {modalContent && <InfoDialog
            isOpen={!!modalContent}
            onClose={() => setModalContent(null)}
            title={modalContent.name}
            {...getModalAction()}
        >
          {modalContent.description}
        </InfoDialog>}

        {isPortraitModalOpen && character.appearanceImage && (
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
                onClick={() => setPortraitModalOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="portrait-modal-title"
            >
                <div className="relative max-w-3xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
                    <h2 id="portrait-modal-title" className="sr-only">{character.name}'s Portrait</h2>
                    <img 
                        src={character.appearanceImage} 
                        alt={`${character.name}'s portrait`} 
                        className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                    />
                    <button
                        onClick={() => setPortraitModalOpen(false)}
                        className="absolute top-0 right-0 mt-1 mr-1 text-white bg-[var(--bg-secondary)]/70 rounded-full p-2 hover:bg-[var(--bg-primary)]/90 transition-colors"
                        aria-label="Close portrait view"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default CharacterSheet;