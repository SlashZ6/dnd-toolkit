
import React, { useState } from 'react';
import { RollResult } from './DiceRoller';
import Button from './ui/Button';
import { D20Icon } from './icons/D20Icon';
import { RollingDiceAnimation } from './ui/DiceAnimation';

interface PlayerDiceRollerProps {
    onRoll: (result: RollResult) => void;
    characterName: string;
}

const PlayerDiceRoller: React.FC<PlayerDiceRollerProps> = ({ onRoll, characterName }) => {
    const [rollMode, setRollMode] = useState<'d20' | 'damage'>('d20');
    const [adv, setAdv] = useState<'none' | 'adv' | 'dis'>('none');
    const [modifier, setModifier] = useState(0);
    const [numDice, setNumDice] = useState(1);
    const [dieType, setDieType] = useState(6);
    const [label, setLabel] = useState('');
    const [isRolling, setIsRolling] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleRollClick = () => {
        if (cooldown > 0) return;
        setIsRolling(true);
    };

    const performRoll = () => {
        setIsRolling(false);
        
        // Cooldown to prevent spam (3 seconds)
        setCooldown(3);
        const interval = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const id = String(Date.now());
        let result: RollResult;

        if (rollMode === 'd20') {
            const r1 = Math.floor(Math.random() * 20) + 1;
            let final = r1;
            let rolls = [r1];
            let formula = `1d20 (${r1})`;

            if (adv === 'adv') {
                const r2 = Math.floor(Math.random() * 20) + 1;
                rolls.push(r2);
                final = Math.max(r1, r2);
                formula = `2d20kh1 (${r1}, ${r2})`;
            } else if (adv === 'dis') {
                const r2 = Math.floor(Math.random() * 20) + 1;
                rolls.push(r2);
                final = Math.min(r1, r2);
                formula = `2d20kl1 (${r1}, ${r2})`;
            }

            const total = final + modifier;
            formula += modifier !== 0 ? ` ${modifier >= 0 ? '+' : '-'} ${Math.abs(modifier)}` : '';

            result = {
                id,
                title: label || `${characterName} Check`,
                formula,
                total,
                rolls,
                finalRoll: final,
                isCrit: final === 20,
                isFumble: final === 1,
                timestamp: Date.now(),
                metadata: {
                    mode: 'd20',
                    type: adv === 'adv' ? 'advantage' : adv === 'dis' ? 'disadvantage' : 'normal',
                    diceCount: adv === 'adv' || adv === 'dis' ? 2 : 1
                }
            };
        } else {
            const rolls: number[] = [];
            const clampedNumDice = Math.max(1, Math.min(50, numDice));
            for (let i = 0; i < clampedNumDice; i++) {
                rolls.push(Math.floor(Math.random() * dieType) + 1);
            }
            const sumOfRolls = rolls.reduce((a, b) => a + b, 0);
            const total = sumOfRolls + modifier;
            const formula = `${clampedNumDice}d${dieType} [${rolls.join(', ')}] ${modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : ''}`;

            result = {
                id,
                title: label || `${characterName} Damage`,
                formula,
                total,
                rolls,
                finalRoll: sumOfRolls,
                isCrit: false,
                isFumble: false,
                timestamp: Date.now(),
                metadata: {
                    mode: 'damage',
                    diceCount: clampedNumDice
                }
            };
        }

        onRoll(result);
    };

    return (
        <div className="space-y-4">
             {isRolling && <RollingDiceAnimation onComplete={performRoll} diceCount={adv !== 'none' ? 2 : 1} />}

             <div className="flex gap-2 bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-secondary)]">
                <button 
                    onClick={() => setRollMode('d20')} 
                    className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${rollMode === 'd20' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                    d20 Check
                </button>
                <button 
                    onClick={() => setRollMode('damage')} 
                    className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${rollMode === 'damage' ? 'bg-[var(--accent-secondary)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                    Damage / Other
                </button>
             </div>

             {rollMode === 'd20' ? (
                 <div className="flex justify-between bg-[var(--bg-secondary)] p-1 rounded border border-[var(--border-secondary)]">
                    <button onClick={() => setAdv('none')} className={`flex-1 text-xs py-1.5 rounded transition-colors ${adv === 'none' ? 'bg-[var(--bg-tertiary)] text-white font-bold' : 'text-[var(--text-muted)] hover:bg-white/5'}`}>Normal</button>
                    <button onClick={() => setAdv('adv')} className={`flex-1 text-xs py-1.5 rounded transition-colors ${adv === 'adv' ? 'bg-green-600 text-white font-bold' : 'text-[var(--text-muted)] hover:bg-white/5'}`}>Advantage</button>
                    <button onClick={() => setAdv('dis')} className={`flex-1 text-xs py-1.5 rounded transition-colors ${adv === 'dis' ? 'bg-red-600 text-white font-bold' : 'text-[var(--text-muted)] hover:bg-white/5'}`}>Disadvantage</button>
                 </div>
             ) : (
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">Count</label>
                        <input type="number" value={numDice} onChange={e => setNumDice(parseInt(e.target.value)||1)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-center" min="1" max="50" />
                     </div>
                     <div>
                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">Type</label>
                        <select value={dieType} onChange={e => setDieType(parseInt(e.target.value))} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2">
                             {[4, 6, 8, 10, 12, 20, 100].map(d => <option key={d} value={d}>d{d}</option>)}
                        </select>
                     </div>
                </div>
             )}

             <div className="grid grid-cols-3 gap-2">
                 <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">Modifier</label>
                    <input type="number" value={modifier} onChange={e => setModifier(parseInt(e.target.value)||0)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-center font-mono" />
                 </div>
                 <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">Label (Optional)</label>
                    <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder={rollMode === 'd20' ? "Stealth Check" : "Fireball"} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2" />
                 </div>
             </div>

             <Button 
                onClick={handleRollClick} 
                disabled={cooldown > 0 || isRolling} 
                size="lg" 
                className={`w-full py-4 flex items-center justify-center gap-2 mt-4 text-lg transition-all ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            >
                {cooldown > 0 ? (
                    <span>Wait {cooldown}s...</span>
                ) : (
                    <>
                        <D20Icon className="w-6 h-6 animate-pulse" />
                        ROLL
                    </>
                )}
            </Button>
        </div>
    );
};

export default PlayerDiceRoller;
