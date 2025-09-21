

import React, { useState, useEffect, useMemo } from 'react';
import { Character } from '../types';
import { useDmCharacters } from '../hooks/useDmCharacters';
import { useDmNotes } from '../hooks/useDmNotes';
import { DND_SKILLS, SKILL_ABILITY_MAP } from '../constants';
import Button from './ui/Button';
import { D20Icon } from './icons/D20Icon';

export type RollResult = {
  id: string;
  title: string;
  formula: string;
  total: number;
  rolls: number[];
  finalRoll: number;
  isCrit: boolean;
  isFumble: boolean;
};

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border-primary)] p-4 flex flex-col h-full ${className}`}>
        <h3 className="text-lg font-medieval text-[var(--text-secondary)] mb-4 border-b border-[var(--border-secondary)] pb-2">{title}</h3>
        {children}
    </div>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <input {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500 transition-all ${props.className}`}/>
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string, children: React.ReactNode}> = ({label, children, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <select {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500 transition-all ${props.className}`}>
            {children}
        </select>
    </div>
);


export const DiceRoller: React.FC<{ history: RollResult[], setHistory: React.Dispatch<React.SetStateAction<RollResult[]>> }> = ({ history, setHistory }) => {
    const { characters } = useDmCharacters();
    
    // Character Context State
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
    const { dmNotes } = useDmNotes(selectedCharacterId);
    
    // Form State
    const [rollMode, setRollMode] = useState<'d20-check' | 'damage'>('d20-check');
    const [checkCategory, setCheckCategory] = useState<'ability' | 'save' | 'attack'>('ability');
    const [abilityScore, setAbilityScore] = useState<keyof Character['abilityScores']>('str');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [customModifier, setCustomModifier] = useState<number>(0);
    const [advantage, setAdvantage] = useState(false);
    const [disadvantage, setDisadvantage] = useState(false);

    // Damage Roll State
    const [numDice, setNumDice] = useState<number>(1);
    const [dieType, setDieType] = useState<number>(6);
    const [damageMod, setDamageMod] = useState<number>(0);
    
    const selectedCharacter = useMemo(() => {
        return characters.find(c => c.id === selectedCharacterId) || null;
    }, [selectedCharacterId, characters]);
    
    const proficiencyBonus = useMemo(() => {
        if (dmNotes) return dmNotes.proficiencyBonus;
        if (selectedCharacter) return Math.floor((selectedCharacter.level - 1) / 4) + 2;
        return 2;
    }, [selectedCharacter, dmNotes]);

    useEffect(() => {
        if (selectedSkill) {
            const correspondingAbility = SKILL_ABILITY_MAP[selectedSkill];
            if (correspondingAbility && correspondingAbility !== abilityScore) {
                setAbilityScore(correspondingAbility);
            }
        }
    }, [selectedSkill, abilityScore]);

    const handleAdvantageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdvantage(e.target.checked);
        if (e.target.checked) setDisadvantage(false);
    };

    const handleDisadvantageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisadvantage(e.target.checked);
        if (e.target.checked) setAdvantage(false);
    };

    const addToHistory = (result: RollResult) => {
        setHistory(prev => [result, ...prev].slice(0, 20));
    };

    const handleQuickRoll = (sides: number) => {
        const roll = Math.floor(Math.random() * sides) + 1;
        addToHistory({
            id: String(Date.now()),
            title: `Quick d${sides} Roll`,
            formula: `(d${sides}) ${roll}`,
            total: roll,
            rolls: [roll],
            finalRoll: roll,
            isCrit: sides === 20 && roll === 20,
            isFumble: sides === 20 && roll === 1,
        });
    };

    const handleRollDice = () => {
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
            const formulaParts: string[] = [];

            const abilityMod = selectedCharacter ? Math.floor((selectedCharacter.abilityScores[abilityScore] - 10) / 2) : 0;
            let profMod = 0;
            const abilityName = abilityScore.toUpperCase();
            
            switch(checkCategory) {
                case 'ability':
                    if (selectedSkill) {
                        title = `${abilityName} (${selectedSkill}) Check`;
                        if (dmNotes?.proficientSkills.includes(selectedSkill)) {
                            profMod = proficiencyBonus;
                        }
                    } else {
                        title = `${abilityName} Ability Check`;
                    }
                    break;
                case 'save':
                    title = `${abilityName} Saving Throw`;
                    const savingThrowName = abilityScore.charAt(0).toUpperCase() + abilityScore.slice(1);
                    if (dmNotes?.proficientSavingThrows.includes(savingThrowName)) {
                        profMod = proficiencyBonus;
                    }
                    break;
                case 'attack':
                    title = `Attack Roll`;
                    if (selectedCharacter) profMod = proficiencyBonus;
                    break;
            }

            const total = finalRoll + abilityMod + profMod + customModifier;

            if (advantage) formulaParts.push(`(d20) [${rolls.join(', ')}] ↑ ${finalRoll}`);
            else if (disadvantage) formulaParts.push(`(d20) [${rolls.join(', ')}] ↓ ${finalRoll}`);
            else formulaParts.push(`(d20) ${finalRoll}`);

            if (abilityMod !== 0) formulaParts.push(`(${abilityName}) ${abilityMod > 0 ? '+' : ''}${abilityMod}`);
            if (profMod !== 0) formulaParts.push(`(Prof) +${profMod}`);
            if (customModifier !== 0) formulaParts.push(`(Mod) ${customModifier > 0 ? '+' : ''}${customModifier}`);

            addToHistory({
                id: String(Date.now()),
                title: title,
                formula: formulaParts.join(' '),
                total,
                rolls,
                finalRoll,
                isCrit,
                isFumble,
            });
        } else if (rollMode === 'damage') {
            const rolls: number[] = [];
            const clampedNumDice = Math.max(1, Math.min(100, numDice));
            for (let i = 0; i < clampedNumDice; i++) {
                rolls.push(Math.floor(Math.random() * dieType) + 1);
            }
            const sumOfRolls = rolls.reduce((a, b) => a + b, 0);
            const total = sumOfRolls + damageMod;
            
            const formula = `(${clampedNumDice}d${dieType}) [${rolls.join(', ')}] ${damageMod !== 0 ? (damageMod > 0 ? '+ ' : '') + damageMod : ''}`;
            
            addToHistory({
                id: String(Date.now()),
                title: `${clampedNumDice}d${dieType}${damageMod > 0 ? `+${damageMod}` : damageMod < 0 ? `${damageMod}` : ''} Roll`,
                formula,
                total,
                rolls,
                finalRoll: sumOfRolls,
                isCrit: false,
                isFumble: false,
            });
        }
    };

    return (
        <div className="animate-fade-in flex flex-col xl:flex-row gap-6">
            <div className="xl:w-1/4 space-y-6">
                <Section title="Character Context">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-[var(--text-muted)]">Roll As Character</label>
                            <select value={selectedCharacterId} onChange={e => setSelectedCharacterId(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-2 mt-1">
                                <option value="">None (Generic Roll)</option>
                                {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-[var(--text-muted)]">Proficiency Bonus</label>
                            <input type="text" value={`+${proficiencyBonus}`} readOnly className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-2 mt-1 text-center font-bold" />
                        </div>
                    </div>
                </Section>
                <Section title="Quick Rolls">
                    <div className="grid grid-cols-3 gap-3">
                        {[4, 6, 8, 10, 12, 20, 100].map(sides => (
                            <button key={sides} onClick={() => handleQuickRoll(sides)} className="p-4 rounded-lg text-lg font-bold transition-transform transform hover:-translate-y-px" style={{backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)'}}>
                                D{sides}
                            </button>
                        ))}
                    </div>
                </Section>
            </div>

            <div className="xl:w-2/4">
                <Section title="Custom Roll Builder">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-[var(--text-muted)]">Roll Mode</label>
                            <select value={rollMode} onChange={(e) => setRollMode(e.target.value as any)} className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-2 mt-1">
                                <option value="d20-check">D20 Check (Ability/Save/Attack)</option>
                                <option value="damage">Damage / Custom Roll</option>
                            </select>
                        </div>
                        
                        {rollMode === 'd20-check' && (
                            <div className="bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)] space-y-4">
                                <h4 className="font-bold text-[var(--text-secondary)] text-center">D20 Check Setup</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-sm text-[var(--text-muted)]">Check Category</label>
                                        <select value={checkCategory} onChange={e => setCheckCategory(e.target.value as any)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 mt-1">
                                            <option value="ability">Ability Check</option>
                                            <option value="save">Saving Throw</option>
                                            <option value="attack">Attack Roll</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--text-muted)]">Ability Score</label>
                                        <select value={abilityScore} onChange={e => setAbilityScore(e.target.value as any)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 mt-1">
                                            {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(score => <option key={score} value={score}>{score.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--text-muted)]">Skill (Optional)</label>
                                        <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)} disabled={checkCategory !== 'ability'} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 mt-1 disabled:bg-[var(--bg-primary)] disabled:cursor-not-allowed">
                                            <option value="">-- No Skill --</option>
                                            {DND_SKILLS.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <div>
                                        <label className="text-sm text-[var(--text-muted)]">Custom Modifier</label>
                                        <input type="number" value={customModifier} onChange={e => setCustomModifier(parseInt(e.target.value) || 0)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 mt-1" />
                                    </div>
                                    <div className="flex justify-around pt-6">
                                        <label className="flex items-center gap-2 text-green-400 cursor-pointer">
                                            <input type="checkbox" checked={advantage} onChange={handleAdvantageChange} className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-green-500 focus:ring-green-600" />
                                            Advantage
                                        </label>
                                        <label className="flex items-center gap-2 text-red-400 cursor-pointer">
                                            <input type="checkbox" checked={disadvantage} onChange={handleDisadvantageChange} className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-red-500 focus:ring-red-600" />
                                            Disadvantage
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {rollMode === 'damage' && (
                            <div className="bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)] space-y-4">
                                <h4 className="font-bold text-[var(--text-secondary)] text-center">Damage / Custom Roll Setup</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <FormInput label="Num. Dice" type="number" value={numDice} onChange={e => setNumDice(parseInt(e.target.value) || 1)} min="1" max="100"/>
                                    <FormSelect label="Die Type" value={dieType} onChange={e => setDieType(parseInt(e.target.value))}>
                                        <option value="4">d4</option>
                                        <option value="6">d6</option>
                                        <option value="8">d8</option>
                                        <option value="10">d10</option>
                                        <option value="12">d12</option>
                                        <option value="20">d20</option>
                                        <option value="100">d100</option>
                                    </FormSelect>
                                    <FormInput label="Modifier" type="number" value={damageMod} onChange={e => setDamageMod(parseInt(e.target.value) || 0)}/>
                                </div>
                            </div>
                        )}
                        
                        <Button type="button" onClick={handleRollDice} size="lg" className="w-full flex items-center justify-center gap-2">
                            <D20Icon className="h-6 w-6"/>
                            Roll Dice
                        </Button>
                    </div>
                </Section>
            </div>

            <div className="xl:w-1/4">
                <Section title="Roll History">
                    <div className="space-y-3 overflow-y-auto h-full">
                        {history.length > 0 ? history.map(result => (
                            <div key={result.id} className="bg-[var(--bg-primary)]/50 p-2 rounded-md border-l-4" style={{borderColor: result.isCrit ? '#22c55e' : result.isFumble ? '#ef4444' : 'var(--border-secondary)'}}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)] text-sm">{result.title}</p>
                                        <p className="text-xs text-[var(--text-muted)] font-mono">{result.formula}</p>
                                    </div>
                                    <p className="text-xl font-bold text-amber-300">{result.total}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-[var(--text-muted)]/70 pt-8">No rolls yet.</p>
                        )}
                    </div>
                </Section>
            </div>
        </div>
    );
};
