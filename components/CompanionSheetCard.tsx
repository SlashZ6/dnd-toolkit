import React, { useState, useEffect } from 'react';
import { Companion, CompanionAction } from '../types';

interface CompanionSheetCardProps {
    companion: Companion;
    onUpdate: (updatedCompanion: Companion) => void;
    onOpenModal: (content: { name: string, description: string }) => void;
    isReadOnly?: boolean;
}

const getModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
};

const AbilityScore: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="text-center">
        <div className="text-xs text-[var(--text-muted)]">{label}</div>
        <div className="font-bold text-lg text-[var(--text-primary)]">{score}</div>
        <div className="font-bold text-base text-[var(--accent-secondary)]">{getModifier(score)}</div>
    </div>
);

const CompanionHpTracker: React.FC<{ current: number; max: number; onUpdate?: (newHp: number) => void; isReadOnly?: boolean }> = ({ current, max, onUpdate, isReadOnly }) => {
    const [localHp, setLocalHp] = useState(current);

    useEffect(() => { setLocalHp(current); }, [current]);

    const handleHpBlur = () => {
        if (!onUpdate) return;
        let newHp = isNaN(localHp) ? current : localHp;
        if (newHp > max) newHp = max;
        if (newHp < 0) newHp = 0;
        onUpdate(newHp);
    };

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-[var(--text-secondary)]">HP:</label>
            {isReadOnly ? (
                <span className="text-lg font-bold">{current} / {max}</span>
            ) : (
                <>
                    <input type="number" value={localHp} onChange={e => setLocalHp(Number(e.target.value))} onBlur={handleHpBlur} className="w-16 bg-transparent text-lg font-bold text-right border-none focus:ring-0 p-0" />
                    <span className="text-lg font-bold">/ {max}</span>
                </>
            )}
        </div>
    );
};

const CompanionSheetCard: React.FC<CompanionSheetCardProps> = ({ companion, onUpdate, onOpenModal, isReadOnly }) => {
    
    const handleHpUpdate = (newHp: number) => {
        onUpdate({ ...companion, currentHp: newHp });
    };

    return (
        <div className="bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)]">
            <header className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-2xl font-medieval text-[var(--accent-primary)]">{companion.name}</h3>
                    <p className="text-sm italic text-[var(--text-muted)]">{companion.type}</p>
                </div>
                <div className="flex gap-4 text-center">
                    <div>
                        <div className="text-xs text-[var(--text-muted)] uppercase">AC</div>
                        <div className="font-bold text-2xl">{companion.ac}</div>
                    </div>
                    <div>
                        <div className="text-xs text-[var(--text-muted)] uppercase">Speed</div>
                        <div className="font-bold text-lg">{companion.speed}</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <CompanionHpTracker current={companion.currentHp} max={companion.maxHp} onUpdate={handleHpUpdate} isReadOnly={isReadOnly} />
                    <div className="grid grid-cols-3 gap-2 bg-[var(--bg-secondary)]/50 p-2 rounded-md">
                        <AbilityScore label="STR" score={companion.abilityScores.str} />
                        <AbilityScore label="DEX" score={companion.abilityScores.dex} />
                        <AbilityScore label="CON" score={companion.abilityScores.con} />
                        <AbilityScore label="INT" score={companion.abilityScores.int} />
                        <AbilityScore label="WIS" score={companion.abilityScores.wis} />
                        <AbilityScore label="CHA" score={companion.abilityScores.cha} />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-secondary)] mb-2">Actions</h4>
                    <div className="space-y-2">
                        {companion.actions.length > 0 ? companion.actions.map(action => (
                            <button key={action.id} onClick={() => onOpenModal(action)} className="w-full text-left p-2 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                                <p className="font-bold text-[var(--text-primary)]">{action.name}</p>
                            </button>
                        )) : <p className="text-sm text-[var(--text-muted)] italic">No actions defined.</p>}
                    </div>
                </div>
            </div>
            {companion.notes && (
                <div className="mt-3 pt-3 border-t border-[var(--border-secondary)]">
                    <h4 className="font-bold text-[var(--text-secondary)] mb-1">Notes</h4>
                    <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap">{companion.notes}</p>
                </div>
            )}
        </div>
    );
};

export default CompanionSheetCard;