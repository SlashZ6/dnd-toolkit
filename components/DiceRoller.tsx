
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Character, NPC, Monster, MonsterTrait } from '../types';
import { useDmCharacters } from '../hooks/useDmCharacters';
import { useDmNotes } from '../hooks/useDmNotes';
import { useNpcs } from '../hooks/useNpcs';
import { useBestiary } from '../hooks/useBestiary';
import { DND_SKILLS, SKILL_ABILITY_MAP } from '../constants';
import Button from './ui/Button';
import { D20Icon } from './icons/D20Icon';
import { TrashIcon } from './icons/TrashIcon';

export type RollBreakdown = {
  label: string;
  value: number;
};

export type RollResult = {
  id: string;
  title: string;
  formula: string; // Legacy support
  total: number;
  rolls: number[];
  finalRoll: number; // The d20 result (or sum of damage dice)
  isCrit: boolean;
  isFumble: boolean;
  breakdown?: RollBreakdown[];
  timestamp: number;
  metadata?: {
      mode: 'd20' | 'damage';
      type?: 'normal' | 'advantage' | 'disadvantage';
      diceCount?: number;
  };
};

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border-primary)] p-4 flex flex-col h-full ${className}`}>
        <h3 className="text-lg font-medieval text-[var(--text-secondary)] mb-4 border-b border-[var(--border-secondary)] pb-2">{title}</h3>
        {children}
    </div>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{label}</label>
        <input {...props} className={`w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all ${props.className}`}/>
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string, children: React.ReactNode}> = ({label, children, ...props}) => (
    <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{label}</label>
        <select {...props} className={`w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all ${props.className}`}>
            {children}
        </select>
    </div>
);

// --- HELPER FUNCTIONS ---

const getAbilityMod = (score: number) => Math.floor((score - 10) / 2);

const parseCR = (cr: string): number => {
    if (cr.includes('/')) {
        const [num, den] = cr.split('/');
        return parseInt(num) / parseInt(den);
    }
    return parseFloat(cr) || 0;
};

const getProficiencyFromCR = (cr: number): number => {
    if (cr >= 29) return 9;
    if (cr >= 25) return 8;
    if (cr >= 21) return 7;
    if (cr >= 17) return 6;
    if (cr >= 13) return 5;
    if (cr >= 9) return 4;
    if (cr >= 5) return 3;
    return 2;
};

// Try to extract a bonus from a string like "Stealth +6" or "Perception +4"
const extractBonusFromTrait = (traits: MonsterTrait[], nameToFind: string): number | null => {
    const trait = traits.find(t => t.name.toLowerCase().includes(nameToFind.toLowerCase()));
    if (!trait) return null;
    
    // Look for numbers prefixed with + or - in the name or description
    const regex = /[+-]\s*(\d+)/;
    const matchName = trait.name.match(regex);
    if (matchName) return parseInt(matchName[0].replace(/\s/g, ''));
    
    const matchDesc = trait.description.match(regex);
    if (matchDesc) return parseInt(matchDesc[0].replace(/\s/g, ''));
    
    return null;
};

const extractAttackBonus = (traits: MonsterTrait[], attackName: string): number | null => {
    const trait = traits.find(t => t.name === attackName);
    if (!trait) return null;
    
    // Standard 5e syntax: "Melee Weapon Attack: +6 to hit"
    const regex = /[+-]\s*(\d+)\s+to\s+hit/i;
    const match = trait.description.match(regex);
    if (match) return parseInt(match[1]);
    
    return null;
}

// --- 3D DICE ANIMATION COMPONENT ---
const RollingDiceAnimation: React.FC<{ onComplete: () => void, diceCount?: number }> = ({ onComplete, diceCount = 1 }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1800); // Animation duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    const DiceCube = ({ delay = 0, className = "" }: { delay?: number, className?: string }) => (
        <div className={`dice-cube w-20 h-20 absolute transform-style-3d animate-tumble ${className}`} style={{ animationDelay: `${delay}s` }}>
            <div className="face front bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">20</div>
            <div className="face back bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">1</div>
            <div className="face right bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">15</div>
            <div className="face left bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">5</div>
            <div className="face top bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">10</div>
            <div className="face bottom bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">12</div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-vignette animate-fade-in">
            <div className="relative w-60 h-40 perspective-1000 flex items-center justify-center">
                <DiceCube className={diceCount > 1 ? "-translate-x-12" : ""} />
                {diceCount > 1 && <DiceCube delay={-0.5} className="translate-x-12" />}
            </div>
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .face { position: absolute; width: 80px; height: 80px; opacity: 0.9; border-radius: 12px; backface-visibility: hidden; }
                .face.front  { transform: translateZ(40px); }
                .face.back   { transform: rotateY(180deg) translateZ(40px); }
                .face.right  { transform: rotateY(90deg) translateZ(40px); }
                .face.left   { transform: rotateY(-90deg) translateZ(40px); }
                .face.top    { transform: rotateX(90deg) translateZ(40px); }
                .face.bottom { transform: rotateX(-90deg) translateZ(40px); }
                .face.top { background-color: var(--bg-secondary); }
                @keyframes tumble {
                    0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
                    25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
                    50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
                    75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg); }
                    100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(360deg); }
                }
                .animate-tumble { animation: tumble 1.2s cubic-bezier(0.25, 1, 0.5, 1) infinite; }
            `}</style>
        </div>
    );
};

// --- DETAILED RESULT COMPONENT ---
const ResultDetail: React.FC<{ result: RollResult }> = ({ result }) => {
    // Show individual dice if it's advantage/disadvantage OR if it's a damage roll with multiple dice
    const showIndividualDice = (result.metadata?.mode === 'd20' && result.rolls.length > 1) || result.metadata?.mode === 'damage';

    return (
        <div className="bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-accent-primary)] animate-fade-in mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <D20Icon className="w-24 h-24" />
            </div>
            
            <div className="relative z-10">
                <h4 className="text-lg font-medieval text-[var(--text-primary)] border-b border-[var(--border-secondary)] pb-2 mb-4 flex justify-between items-center">
                    <span>{result.title}</span>
                    <span className="text-xs font-sans text-[var(--text-muted)]">{new Date(result.timestamp).toLocaleTimeString()}</span>
                </h4>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center my-6">
                    {/* The Die Rolls */}
                    <div className="flex gap-4 flex-wrap justify-center">
                        {showIndividualDice ? (
                            result.rolls.map((roll, idx) => {
                                // For d20 Advantage/Disadvantage, verify which one was used.
                                // For Damage, all are used.
                                let isUsed = true;
                                if (result.metadata?.mode === 'd20') {
                                    isUsed = roll === result.finalRoll;
                                }

                                const styleClass = isUsed 
                                    ? `border-[var(--accent-primary)] text-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-[0_0_15px_var(--glow-primary)] scale-110 z-10` 
                                    : `border-[var(--border-secondary)] text-[var(--text-muted)] bg-[var(--bg-primary)] opacity-60 scale-90 grayscale`;
                                
                                return (
                                    <div key={idx} className="flex flex-col items-center transition-all duration-500">
                                        <div className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-xl border-4 ${styleClass}`}>
                                            {roll}
                                        </div>
                                        {result.metadata?.mode === 'd20' && isUsed && <span className="text-[10px] text-[var(--accent-primary)] mt-2 uppercase font-bold">Used</span>}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className={`w-20 h-20 flex items-center justify-center text-4xl font-bold rounded-xl border-4 ${result.isCrit ? 'border-green-500 text-green-400 bg-green-900/20 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : result.isFumble ? 'border-red-500 text-red-400 bg-red-900/20 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-[var(--accent-primary)] text-[var(--text-primary)] bg-[var(--bg-secondary)]'}`}>
                                    {result.finalRoll}
                                </div>
                                <span className="text-xs text-[var(--text-muted)] mt-2 uppercase font-bold tracking-wider">Base Roll</span>
                            </div>
                        )}
                    </div>

                    {/* The Modifiers */}
                    {result.breakdown && result.breakdown.length > 0 && (
                        <>
                            <div className="text-[var(--text-muted)] text-2xl font-bold hidden sm:block">+</div>
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                {result.breakdown.map((mod, idx) => (
                                    <div key={idx} className="flex justify-between sm:justify-start items-center gap-3 bg-[var(--bg-secondary)] px-3 py-1.5 rounded border border-[var(--border-secondary)]">
                                        <span className="text-sm text-[var(--text-secondary)]">{mod.label}</span>
                                        <span className={`font-mono font-bold ${mod.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {mod.value >= 0 ? '+' : ''}{mod.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-[var(--text-muted)] text-2xl font-bold hidden sm:block">=</div>
                        </>
                    )}
                </div>

                {/* Final Result */}
                <div className="text-center bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-secondary)]">
                    <span className="text-sm text-[var(--text-muted)] uppercase tracking-widest block mb-1">Final Result</span>
                    <span className="text-5xl font-medieval font-bold text-[var(--accent-secondary)] text-glow-cyan">{result.total}</span>
                </div>
                {result.metadata?.type && result.metadata.type !== 'normal' && (
                    <div className="text-center mt-2">
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${result.metadata.type === 'advantage' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                            {result.metadata.type}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};


export const DiceRoller: React.FC<{ history: RollResult[], setHistory: React.Dispatch<React.SetStateAction<RollResult[]>> }> = ({ history, setHistory }) => {
    // Data Sources
    const { characters } = useDmCharacters();
    const { npcs } = useNpcs();
    const { monsters } = useBestiary();
    
    // Selection State
    const [sourceType, setSourceType] = useState<'generic' | 'character' | 'npc' | 'monster'>('generic');
    const [selectedEntityId, setSelectedEntityId] = useState<string>('');
    
    // DM Notes for Characters
    const { dmNotes } = useDmNotes(sourceType === 'character' ? selectedEntityId : '');
    
    // Form State
    const [rollMode, setRollMode] = useState<'d20-check' | 'damage'>('d20-check');
    const [checkCategory, setCheckCategory] = useState<'ability' | 'save' | 'attack'>('ability');
    const [abilityScore, setAbilityScore] = useState<keyof Character['abilityScores']>('str');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedAttack, setSelectedAttack] = useState<string>(''); // New State for Monsters
    const [customModifier, setCustomModifier] = useState<number>(0);
    const [advantage, setAdvantage] = useState(false);
    const [disadvantage, setDisadvantage] = useState(false);
    const [isRolling, setIsRolling] = useState(false);

    // Damage Roll State
    const [numDice, setNumDice] = useState<number>(1);
    const [dieType, setDieType] = useState<number>(6);

    const selectedEntity = useMemo(() => {
        if (sourceType === 'character') return characters.find(c => c.id === selectedEntityId);
        if (sourceType === 'npc') return npcs.find(n => n.id === selectedEntityId);
        if (sourceType === 'monster') return monsters.find(m => m.id === selectedEntityId);
        return null;
    }, [sourceType, selectedEntityId, characters, npcs, monsters]);

    // Calculate Modifiers Automatically
    const computedModifiers = useMemo(() => {
        let mod = 0;
        let prof = 0;
        let specificBonus = null;

        if (!selectedEntity) return { abilityMod: 0, profBonus: 0, specificBonus: null };

        // 1. Base Ability Modifier
        const score = selectedEntity.abilityScores[abilityScore];
        mod = getAbilityMod(score);

        // 2. Proficiency Bonus
        if (sourceType === 'character') {
            const level = (selectedEntity as Character).level;
            prof = Math.floor((level - 1) / 4) + 2;
        } else {
            // NPC / Monster (use CR)
            const crStr = (selectedEntity as Monster).cr || "0";
            const cr = parseCR(crStr);
            prof = getProficiencyFromCR(cr);
        }

        // 3. Specific Bonuses (Skills / Saves / Attacks)
        if (rollMode === 'd20-check') {
            if (checkCategory === 'ability' && selectedSkill) {
                if (sourceType === 'character') {
                    const isProficient = (selectedEntity as Character).skillProficiencies.includes(selectedSkill);
                    if (isProficient || dmNotes?.proficientSkills.includes(selectedSkill)) {
                        // Add Prof
                    } else {
                        prof = 0; // Not proficient
                    }
                } else {
                    // Monster/NPC: Check traits
                    const traitBonus = extractBonusFromTrait((selectedEntity as Monster).skills || [], selectedSkill);
                    if (traitBonus !== null) {
                        specificBonus = traitBonus; // Overrides everything
                    } else {
                        prof = 0;
                    }
                }
            } else if (checkCategory === 'save') {
                const saveName = abilityScore.charAt(0).toUpperCase() + abilityScore.slice(1);
                 if (sourceType === 'character') {
                     if (dmNotes?.proficientSavingThrows.includes(saveName)) {
                         // Keep Prof
                     } else {
                         prof = 0; 
                     }
                 } else {
                     const traitBonus = extractBonusFromTrait((selectedEntity as Monster).savingThrows || [], abilityScore);
                     if (traitBonus !== null) {
                         specificBonus = traitBonus;
                     } else {
                         prof = 0;
                     }
                 }
            } else if (checkCategory === 'attack') {
                if (sourceType === 'character') {
                    // Character logic
                } else if (sourceType === 'monster' && selectedAttack) {
                    // New Monster Logic
                    const attackBonus = extractAttackBonus((selectedEntity as Monster).attacks || [], selectedAttack);
                    if (attackBonus !== null) {
                        specificBonus = attackBonus;
                    } else {
                        prof = 0; // Fallback to just ability mod if attack not found/parsed
                    }
                } else {
                    prof = 0;
                }
            } else {
                prof = 0;
            }
        }

        return { abilityMod: mod, profBonus: prof, specificBonus };
    }, [selectedEntity, sourceType, abilityScore, checkCategory, selectedSkill, selectedAttack, rollMode, dmNotes]);


    const handleRollDice = () => {
        setIsRolling(true); // Trigger animation
    };

    const performRoll = () => {
        setIsRolling(false);
        const id = String(Date.now());
        
        if (rollMode === 'd20-check') {
            const roll1 = Math.floor(Math.random() * 20) + 1;
            let finalRoll = roll1;
            let rolls = [roll1];
            
            if (advantage || disadvantage) {
                const roll2 = Math.floor(Math.random() * 20) + 1;
                rolls.push(roll2);
                if (advantage) finalRoll = Math.max(roll1, roll2);
                if (disadvantage) finalRoll = Math.min(roll1, roll2);
            }

            const isCrit = finalRoll === 20;
            const isFumble = finalRoll === 1;

            let title = '';
            let total = 0;
            const breakdown: RollBreakdown[] = [];

            const abilityName = abilityScore.toUpperCase();
            
            // Construct Title
            if (selectedEntity) title += `${selectedEntity.name}: `;
            
            if (checkCategory === 'ability') {
                title += selectedSkill ? `${selectedSkill} Check` : `${abilityName} Check`;
            } else if (checkCategory === 'save') {
                title += `${abilityName} Save`;
            } else if (checkCategory === 'attack') {
                title += selectedAttack ? `Attack: ${selectedAttack}` : `Attack Roll`;
            }

            // Calculate Total
            total = finalRoll;

            if (computedModifiers.specificBonus !== null) {
                total += computedModifiers.specificBonus;
                breakdown.push({ label: 'Stat Block Mod', value: computedModifiers.specificBonus });
            } else {
                if (computedModifiers.abilityMod !== 0) {
                    total += computedModifiers.abilityMod;
                    breakdown.push({ label: `${abilityName} Mod`, value: computedModifiers.abilityMod });
                }
                if (computedModifiers.profBonus !== 0) {
                    total += computedModifiers.profBonus;
                    breakdown.push({ label: 'Proficiency', value: computedModifiers.profBonus });
                }
            }

            if (customModifier !== 0) {
                total += customModifier;
                breakdown.push({ label: 'Custom Mod', value: customModifier });
            }

            const result: RollResult = {
                id,
                title,
                formula: breakdown.map(b => `${b.value >= 0 ? '+' : ''}${b.value} (${b.label})`).join(' '), // simplified
                total,
                rolls,
                finalRoll,
                isCrit,
                isFumble,
                breakdown,
                timestamp: Date.now(),
                metadata: {
                    mode: 'd20',
                    type: advantage ? 'advantage' : disadvantage ? 'disadvantage' : 'normal',
                    diceCount: advantage || disadvantage ? 2 : 1
                }
            };
            
            setHistory(prev => [result, ...prev].slice(0, 50));

        } else if (rollMode === 'damage') {
            const rolls: number[] = [];
            const clampedNumDice = Math.max(1, Math.min(100, numDice));
            for (let i = 0; i < clampedNumDice; i++) {
                rolls.push(Math.floor(Math.random() * dieType) + 1);
            }
            const sumOfRolls = rolls.reduce((a, b) => a + b, 0);
            const total = sumOfRolls + customModifier;
            
            const breakdown: RollBreakdown[] = [];
            if (customModifier !== 0) breakdown.push({ label: 'Custom Mod', value: customModifier });

            const result: RollResult = {
                id,
                title: `${selectedEntity ? selectedEntity.name + ': ' : ''}Damage Roll`,
                formula: `${clampedNumDice}d${dieType} (${rolls.join(', ')}) ${customModifier !== 0 ? (customModifier > 0 ? '+' : '') + customModifier : ''}`,
                total,
                rolls,
                finalRoll: sumOfRolls,
                isCrit: false,
                isFumble: false,
                breakdown,
                timestamp: Date.now(),
                metadata: {
                    mode: 'damage',
                    diceCount: clampedNumDice
                }
            };
            setHistory(prev => [result, ...prev].slice(0, 50));
        }
    };

    // Auto-update ability score if skill changes
    useEffect(() => {
        if (selectedSkill) {
            const correspondingAbility = SKILL_ABILITY_MAP[selectedSkill];
            if (correspondingAbility && correspondingAbility !== abilityScore) {
                setAbilityScore(correspondingAbility);
            }
        }
    }, [selectedSkill]);

    const handleQuickRoll = (sides: number) => {
        const roll = Math.floor(Math.random() * sides) + 1;
        const result: RollResult = {
            id: String(Date.now()),
            title: `Quick d${sides} Roll`,
            formula: `(d${sides})`,
            total: roll,
            rolls: [roll],
            finalRoll: roll,
            isCrit: sides === 20 && roll === 20,
            isFumble: sides === 20 && roll === 1,
            timestamp: Date.now(),
            metadata: { mode: sides === 20 ? 'd20' : 'damage', type: 'normal', diceCount: 1 }
        };
        setHistory(prev => [result, ...prev].slice(0, 50));
    };

    return (
        <div className="animate-fade-in flex flex-col xl:flex-row gap-6 h-full">
            {isRolling && <RollingDiceAnimation onComplete={performRoll} diceCount={advantage || disadvantage ? 2 : 1} />}
            
            {/* Left Column: Controls */}
            <div className="xl:w-1/3 space-y-4 flex flex-col">
                <Section title="Who is rolling?">
                    <div className="space-y-3">
                        <div className="flex gap-2 p-1 bg-[var(--bg-primary)] rounded-md border border-[var(--border-secondary)]">
                            {(['generic', 'character', 'npc', 'monster'] as const).map(t => (
                                <button 
                                    key={t}
                                    onClick={() => { setSourceType(t); setSelectedEntityId(''); setSelectedAttack(''); }}
                                    className={`flex-1 py-1 rounded text-xs font-bold uppercase transition-colors ${sourceType === t ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    {t === 'generic' ? 'None' : t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        {sourceType !== 'generic' && (
                            <FormSelect label={`Select ${sourceType}`} value={selectedEntityId} onChange={e => { setSelectedEntityId(e.target.value); setSelectedAttack(''); }}>
                                <option value="">-- Select --</option>
                                {sourceType === 'character' && characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                {sourceType === 'npc' && npcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                                {sourceType === 'monster' && monsters.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </FormSelect>
                        )}
                        
                        {selectedEntity && (
                            <div className="grid grid-cols-6 gap-1 text-center bg-[var(--bg-primary)]/50 p-2 rounded border border-[var(--border-secondary)]">
                                {Object.entries(selectedEntity.abilityScores).map(([key, val]) => (
                                    <div key={key} className="flex flex-col">
                                        <span className="text-[9px] uppercase text-[var(--text-muted)]">{key}</span>
                                        <span className="text-xs font-bold">{getAbilityMod(val as number) >= 0 ? '+' : ''}{getAbilityMod(val as number)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Section>

                <Section title="Roll Setup" className="flex-grow">
                    <div className="space-y-4">
                        <div className="flex gap-2 border-b border-[var(--border-secondary)] pb-4">
                            <button 
                                onClick={() => setRollMode('d20-check')} 
                                className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${rollMode === 'd20-check' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                            >
                                d20 Check
                            </button>
                            <button 
                                onClick={() => setRollMode('damage')} 
                                className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${rollMode === 'damage' ? 'bg-[var(--accent-secondary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                            >
                                Damage / Die
                            </button>
                        </div>

                        {rollMode === 'd20-check' && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormSelect label="Type" value={checkCategory} onChange={e => setCheckCategory(e.target.value as any)}>
                                        <option value="ability">Ability Check</option>
                                        <option value="save">Saving Throw</option>
                                        <option value="attack">Attack Roll</option>
                                    </FormSelect>
                                    <FormSelect label="Ability" value={abilityScore} onChange={e => setAbilityScore(e.target.value as any)}>
                                        {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                    </FormSelect>
                                </div>
                                {checkCategory === 'ability' && (
                                    <FormSelect label="Skill (Optional)" value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
                                        <option value="">-- None --</option>
                                        {DND_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </FormSelect>
                                )}
                                {checkCategory === 'attack' && sourceType === 'monster' && selectedEntity && (
                                    <FormSelect label="Specific Attack (Optional)" value={selectedAttack} onChange={e => setSelectedAttack(e.target.value)}>
                                        <option value="">-- Generic --</option>
                                        {(selectedEntity as Monster).attacks.map((atk, idx) => (
                                            <option key={idx} value={atk.name}>{atk.name}</option>
                                        ))}
                                    </FormSelect>
                                )}
                                <div className="flex gap-4 pt-2">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border transition-all ${advantage ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-[var(--bg-primary)] border-[var(--border-secondary)] text-[var(--text-muted)]'}`}>
                                        <input type="checkbox" checked={advantage} onChange={e => { setAdvantage(e.target.checked); if(e.target.checked) setDisadvantage(false); }} className="hidden" />
                                        <span className="font-bold">Advantage</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border transition-all ${disadvantage ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-[var(--bg-primary)] border-[var(--border-secondary)] text-[var(--text-muted)]'}`}>
                                        <input type="checkbox" checked={disadvantage} onChange={e => { setDisadvantage(e.target.checked); if(e.target.checked) setAdvantage(false); }} className="hidden" />
                                        <span className="font-bold">Disadvantage</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {rollMode === 'damage' && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput label="Count" type="number" value={numDice} onChange={e => setNumDice(parseInt(e.target.value) || 1)} min="1" max="100"/>
                                    <FormSelect label="Die Type" value={dieType} onChange={e => setDieType(parseInt(e.target.value))}>
                                        {[4, 6, 8, 10, 12, 20, 100].map(d => <option key={d} value={d}>d{d}</option>)}
                                    </FormSelect>
                                </div>
                            </div>
                        )}

                        <FormInput label="Custom Modifier" type="number" value={customModifier} onChange={e => setCustomModifier(parseInt(e.target.value) || 0)} />

                        <Button onClick={handleRollDice} size="lg" className="w-full py-4 mt-4 flex items-center justify-center gap-3 text-lg shadow-lg hover:scale-[1.02] transition-transform">
                            <D20Icon className="w-6 h-6" />
                            ROLL
                        </Button>
                    </div>
                </Section>
            </div>

            {/* Right Column: Results */}
            <div className="xl:w-2/3 flex flex-col h-full overflow-hidden">
                <div className="flex-shrink-0 mb-4">
                    <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase mb-2">Quick Rolls</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {[4, 6, 8, 10, 12, 20, 100].map(d => (
                            <button 
                                key={d} 
                                onClick={() => handleQuickRoll(d)}
                                className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded text-xs font-bold hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--accent-primary)] transition-colors"
                            >
                                d{d}
                            </button>
                        ))}
                    </div>
                </div>

                <Section title="History" className="flex-grow overflow-hidden flex flex-col">
                    <div className="overflow-y-auto flex-grow pr-2 space-y-4 scrollbar-thin scrollbar-thumb-[var(--border-secondary)]">
                        {history.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50">
                                <D20Icon className="w-16 h-16 mb-4" />
                                <p>Ready to roll...</p>
                            </div>
                        ) : (
                            history.map(result => <ResultDetail key={result.id} result={result} />)
                        )}
                    </div>
                    {history.length > 0 && (
                        <div className="pt-4 mt-2 border-t border-[var(--border-secondary)] flex justify-end">
                            <Button onClick={() => setHistory([])} variant="ghost" size="sm" className="text-red-400 hover:text-red-500 flex items-center gap-2">
                                <TrashIcon className="w-4 h-4" /> Clear History
                            </Button>
                        </div>
                    )}
                </Section>
            </div>
        </div>
    );
};
