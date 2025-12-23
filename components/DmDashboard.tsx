
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from './ui/Button';
import { D20Icon } from './icons/D20Icon';
import { TrashIcon } from './icons/TrashIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MonsterIcon } from './icons/MonsterIcon';
import { PlusIcon } from './icons/PlusIcon';
import { RollResult } from './DiceRoller';
import { Character, Monster, NPC } from '../types';
import * as GENERATORS from '../data/generatorData';
import { MapIcon } from './icons/MapIcon';
import { PlayIcon } from './icons/PlayIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { HeartIcon } from './icons/HeartIcon';

// --- Types ---

type WidgetType = 'SCRATCHPAD' | 'QUICK_DICE' | 'COUNTER' | 'IMAGE' | 'INITIATIVE' | 'CLOCK' | 'NAME_GEN' | 'TODO' | 'LINKS' | 'PINNED';
type WidgetTint = 'DEFAULT' | 'RED' | 'GREEN' | 'BLUE' | 'AMBER' | 'PURPLE';

interface WidgetRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  rect: WidgetRect;
  zIndex: number;
  tint: WidgetTint;
  data: any; 
}

interface DmDashboardProps {
  diceHistory: RollResult[];
  onRoll: (result: RollResult) => void;
  characters: Character[];
  npcs: NPC[];
  monsters: Monster[];
  onNavigate: (type: 'character' | 'npc' | 'monster', id: string) => void;
}

// --- Constants ---

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: '1', type: 'QUICK_DICE', title: 'Quick Roller', rect: { x: 20, y: 20, w: 300, h: 200 }, zIndex: 1, tint: 'DEFAULT', data: {} },
  { id: '2', type: 'SCRATCHPAD', title: 'Session Notes', rect: { x: 340, y: 20, w: 400, h: 300 }, zIndex: 2, tint: 'AMBER', data: { text: 'Remember to introduce the villain...' } },
  { id: '3', type: 'CLOCK', title: 'Session Timer', rect: { x: 20, y: 240, w: 300, h: 150 }, zIndex: 3, tint: 'BLUE', data: { seconds: 0, isRunning: false } },
];

// Glassmorphism styles
const TINTS: Record<WidgetTint, { base: string, border: string, glow: string, header: string, text: string, accent: string }> = {
    DEFAULT: { 
        base: 'bg-slate-900/60', 
        border: 'border-slate-600/50', 
        glow: 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]', 
        header: 'bg-slate-800/80',
        text: 'text-slate-200',
        accent: 'text-slate-400'
    },
    RED: { 
        base: 'bg-red-950/60', 
        border: 'border-red-500/50', 
        glow: 'shadow-[0_4px_20px_rgba(153,27,27,0.3)]', 
        header: 'bg-red-900/60',
        text: 'text-red-100',
        accent: 'text-red-400'
    },
    GREEN: { 
        base: 'bg-emerald-950/60', 
        border: 'border-emerald-500/50', 
        glow: 'shadow-[0_4px_20px_rgba(6,78,59,0.3)]', 
        header: 'bg-emerald-900/60',
        text: 'text-emerald-100',
        accent: 'text-emerald-400'
    },
    BLUE: { 
        base: 'bg-cyan-950/60', 
        border: 'border-cyan-500/50', 
        glow: 'shadow-[0_4px_20px_rgba(8,145,178,0.3)]', 
        header: 'bg-cyan-900/60',
        text: 'text-cyan-100',
        accent: 'text-cyan-400'
    },
    AMBER: { 
        base: 'bg-amber-950/60', 
        border: 'border-amber-500/50', 
        glow: 'shadow-[0_4px_20px_rgba(180,83,9,0.3)]', 
        header: 'bg-amber-900/60',
        text: 'text-amber-100',
        accent: 'text-amber-400'
    },
    PURPLE: { 
        base: 'bg-violet-950/60', 
        border: 'border-violet-500/50', 
        glow: 'shadow-[0_4px_20px_rgba(91,33,182,0.3)]', 
        header: 'bg-violet-900/60',
        text: 'text-violet-100',
        accent: 'text-violet-400'
    },
};

// --- Helpers ---
const randomItem = (arr: ReadonlyArray<string>): string => arr[Math.floor(Math.random() * arr.length)];

// --- Sub-Components ---

const WidgetWrapper: React.FC<{
    widget: DashboardWidget;
    isEditing: boolean;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<DashboardWidget>) => void;
    onBringToFront: (id: string) => void;
    snapToGrid: boolean;
    children: React.ReactNode;
}> = ({ widget, isEditing, onRemove, onUpdate, onBringToFront, snapToGrid, children }) => {
    const styles = TINTS[widget.tint];
    const containerRef = useRef<HTMLDivElement>(null);
    
    const handlePointerDown = (e: React.PointerEvent, action: 'MOVE' | 'RESIZE') => {
        // Allow moving always, resize only in edit mode
        if (action === 'RESIZE' && !isEditing) return;
        
        onBringToFront(widget.id);
        e.stopPropagation();
        
        const target = e.currentTarget; // Capture the element
        target.setPointerCapture(e.pointerId);

        const startX = e.clientX;
        const startY = e.clientY;
        const initialRect = { ...widget.rect };

        const onPointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            let newRect = { ...initialRect };

            if (action === 'MOVE') {
                newRect.x = initialRect.x + deltaX;
                newRect.y = initialRect.y + deltaY;
            } else {
                newRect.w = Math.max(150, initialRect.w + deltaX); // Min width
                newRect.h = Math.max(100, initialRect.h + deltaY); // Min height
            }

            // Soft Snap logic if enabled (snap to 20px grid)
            if (snapToGrid) {
                newRect.x = Math.round(newRect.x / 20) * 20;
                newRect.y = Math.round(newRect.y / 20) * 20;
                if (action === 'RESIZE') {
                    newRect.w = Math.round(newRect.w / 20) * 20;
                    newRect.h = Math.round(newRect.h / 20) * 20;
                }
            }

            onUpdate(widget.id, { rect: newRect });
        };

        const onPointerUp = (upEvent: PointerEvent) => {
            target.removeEventListener('pointermove', onPointerMove as any);
            target.removeEventListener('pointerup', onPointerUp as any);
            target.releasePointerCapture(e.pointerId);
        };

        target.addEventListener('pointermove', onPointerMove as any);
        target.addEventListener('pointerup', onPointerUp as any);
    };

    return (
        <div 
            ref={containerRef}
            className={`
                absolute flex flex-col rounded-xl border backdrop-blur-xl overflow-hidden transition-shadow duration-200
                ${styles.base} ${styles.border} ${styles.glow} ${styles.text}
                ${isEditing ? 'select-none' : ''}
            `}
            style={{ 
                left: widget.rect.x, 
                top: widget.rect.y, 
                width: widget.rect.w, 
                height: widget.rect.h,
                zIndex: widget.zIndex,
                touchAction: 'none'
            }}
            onPointerDown={() => onBringToFront(widget.id)}
        >
            {/* Header (Drag Handle) */}
            <div 
                className={`flex items-center justify-between px-3 py-2 border-b border-white/10 h-9 flex-shrink-0 transition-colors ${styles.header} cursor-grab active:cursor-grabbing`}
                onPointerDown={(e) => handlePointerDown(e, 'MOVE')}
            >
                {isEditing ? (
                    <input 
                        value={widget.title} 
                        onChange={(e) => onUpdate(widget.id, { title: e.target.value })}
                        className="bg-transparent border-b border-[var(--accent-primary)] text-xs font-bold font-medieval text-[var(--accent-primary)] focus:outline-none w-full mr-2"
                        onPointerDown={(e) => e.stopPropagation()} // Allow input interaction without drag
                    />
                ) : (
                    <h3 className="font-medieval font-bold tracking-widest text-xs uppercase flex items-center gap-2 opacity-90 pointer-events-none">
                         {widget.title}
                    </h3>
                )}
                
                {isEditing && (
                    <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                         {(Object.keys(TINTS) as WidgetTint[]).map(t => (
                             <button 
                                key={t} 
                                onClick={() => onUpdate(widget.id, { tint: t })}
                                className={`w-3 h-3 rounded-full border border-white/20 hover:scale-110 ${t === widget.tint ? 'ring-1 ring-white scale-110' : ''}`}
                                style={{ background: t === 'DEFAULT' ? '#334155' : TINTS[t].accent.replace('text-', 'bg-').replace('-400', '-600') }}
                                title={t}
                             />
                         ))}
                         <div className="w-px h-3 bg-white/20 mx-1"></div>
                        <button onClick={() => onRemove(widget.id)} className="text-red-400 hover:text-red-200 hover:bg-red-900/50 p-0.5 rounded transition-colors"><TrashIcon className="w-3 h-3" /></button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-grow p-2 overflow-y-auto min-h-0 relative custom-scrollbar">
                {children}
            </div>
            
            {/* Resize Handle */}
            {isEditing && (
                 <div 
                    className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 z-50"
                    onPointerDown={(e) => handlePointerDown(e, 'RESIZE')}
                 >
                     <div className="w-2 h-2 bg-white/30 rounded-br-sm group-hover:bg-[var(--accent-primary)]"></div>
                     <svg className="w-4 h-4 text-white/30 absolute bottom-0 right-0 pointer-events-none" viewBox="0 0 24 24" fill="currentColor"><path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM14 22H12V20H14V22ZM18 18H16V16H18V18Z"/></svg>
                 </div>
            )}
        </div>
    );
};

const ScratchpadWidget: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
    return (
        <textarea 
            className="w-full h-full bg-transparent resize-none focus:outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] font-sans leading-relaxed p-1"
            placeholder="Type notes here..."
            value={data.text || ''}
            onChange={(e) => onUpdate({ ...data, text: e.target.value })}
        />
    );
};

const QuickDiceWidget: React.FC<{ onRoll: (res: RollResult) => void }> = ({ onRoll }) => {
    const roll = (sides: number) => {
        const val = Math.floor(Math.random() * sides) + 1;
        const isCrit = sides === 20 && val === 20;
        const isFumble = sides === 20 && val === 1;
        
        onRoll({
            id: String(Date.now()),
            title: `d${sides} Roll`,
            total: val,
            rolls: [val],
            finalRoll: val,
            formula: `1d${sides}`,
            isCrit, isFumble,
            timestamp: Date.now(),
            metadata: { mode: sides === 20 ? 'd20' : 'damage' }
        });
    };

    return (
        <div className="grid grid-cols-3 gap-2 h-full content-center p-1">
            {[4, 6, 8, 10, 12, 20].map(d => (
                <button 
                    key={d} 
                    onClick={() => roll(d)}
                    className="group relative flex flex-col items-center justify-center p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-[var(--accent-primary)]/20 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all active:scale-95 active:bg-[var(--accent-primary)]/40 h-full"
                >
                    <span className="text-xs font-bold relative z-10 font-medieval">d{d}</span>
                </button>
            ))}
        </div>
    );
};

const CounterWidget: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
    const val = data.value || 0;
    const change = (delta: number) => onUpdate({ ...data, value: val + delta });

    return (
        <div className="flex flex-col items-center justify-center h-full gap-1">
            <input 
                type="text" 
                value={data.label || 'Counter'} 
                onChange={(e) => onUpdate({...data, label: e.target.value})}
                className="bg-transparent text-center text-[10px] text-white/60 focus:text-white focus:outline-none w-full font-bold uppercase tracking-wider border-b border-transparent focus:border-white/20 transition-colors"
            />
            <div className="text-4xl font-bold font-mono text-[var(--text-primary)] drop-shadow-md my-1">{val}</div>
            <div className="flex gap-3 w-full justify-center">
                <button onClick={() => change(-1)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-lg font-bold flex items-center justify-center transition-colors border border-white/10 hover:border-red-500/50 text-red-200">-</button>
                <button onClick={() => change(1)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-green-500/20 text-lg font-bold flex items-center justify-center transition-colors border border-white/10 hover:border-green-500/50 text-green-200">+</button>
            </div>
        </div>
    );
};

const ImageWidget: React.FC<{ data: any; onUpdate: (data: any) => void; isEditing: boolean }> = ({ data, onUpdate, isEditing }) => {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden group rounded bg-black/30">
            {data.url ? (
                <img src={data.url} alt="Widget" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" draggable={false} />
            ) : (
                <div className="text-[var(--text-muted)] text-xs text-center p-4 flex flex-col items-center gap-2 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">?</div>
                    <span>No Image</span>
                </div>
            )}
            
            {(isEditing || !data.url) && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/90 backdrop-blur-md border-t border-white/10">
                    <input 
                        type="text" 
                        placeholder="Paste Image URL..." 
                        value={data.url || ''} 
                        onChange={(e) => onUpdate({ ...data, url: e.target.value })}
                        className="w-full bg-transparent border-b border-[var(--border-secondary)] px-1 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] placeholder-white/20"
                    />
                </div>
            )}
        </div>
    );
};

const ClockWidget: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
    const seconds = data.seconds || 0;
    const isRunning = data.isRunning || false;

    useEffect(() => {
        let interval: number;
        if (isRunning) {
            interval = window.setInterval(() => {
                onUpdate({ ...data, seconds: seconds + 1, isRunning: true });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, seconds]); 

    const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggle = () => onUpdate({ ...data, isRunning: !isRunning });
    const reset = () => onUpdate({ ...data, seconds: 0, isRunning: false });

    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 relative overflow-hidden">
            {isRunning && <div className="absolute inset-0 bg-cyan-500/10 animate-pulse pointer-events-none" />}
            <div className={`text-3xl font-mono font-bold drop-shadow-lg tracking-widest transition-colors duration-500 ${isRunning ? 'text-cyan-300 text-glow-cyan' : 'text-slate-400'}`}>
                {formatTime(seconds)}
            </div>
            <div className="flex gap-3 relative z-10">
                <button onClick={toggle} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isRunning ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 hover:bg-amber-500/30' : 'bg-green-500/20 border-green-500/50 text-green-200 hover:bg-green-500/30'}`}>
                    {isRunning ? (
                        <div className="w-2 h-3 border-l-2 border-r-2 border-current ml-px" />
                    ) : (
                        <PlayIcon className="w-3 h-3 ml-0.5" />
                    )}
                </button>
                <button onClick={reset} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-200 text-[var(--text-muted)] transition-colors">
                    <div className="w-2.5 h-2.5 bg-current rounded-[1px]" />
                </button>
            </div>
        </div>
    );
};

const InitiativeWidget: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
    const list: { id: string; name: string; value: number; active: boolean }[] = data.list || [];
    const [newName, setNewName] = useState('');
    const [newVal, setNewVal] = useState('');

    const add = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName) return;
        const newItem = { 
            id: String(Date.now()), 
            name: newName, 
            value: parseInt(newVal) || 0, 
            active: false 
        };
        const newList = [...list, newItem].sort((a, b) => b.value - a.value);
        onUpdate({ ...data, list: newList });
        setNewName('');
        setNewVal('');
    };

    const remove = (id: string) => {
        onUpdate({ ...data, list: list.filter(i => i.id !== id) });
    };

    const nextTurn = () => {
        if (list.length === 0) return;
        const currentIndex = list.findIndex(i => i.active);
        const newList = list.map(i => ({ ...i, active: false }));
        let nextIndex = 0;
        if (currentIndex !== -1) {
            nextIndex = (currentIndex + 1) % list.length;
        }
        newList[nextIndex].active = true;
        onUpdate({ ...data, list: newList });
    };
    
    const clear = () => {
         onUpdate({ ...data, list: [] });
    }

    return (
        <div className="flex flex-col h-full">
            <form onSubmit={add} className="flex gap-1 mb-2 p-1 bg-white/5 rounded border border-white/5">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" className="w-full min-w-0 bg-transparent px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none" />
                <input value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="#" type="number" className="w-10 bg-transparent border-l border-white/10 px-1 py-1 text-xs text-center text-white placeholder-white/30 focus:outline-none" />
                <button type="submit" className="bg-white/10 hover:bg-[var(--accent-primary)] hover:text-black text-white px-2 rounded-r font-bold text-xs transition-colors">+</button>
            </form>
            <div className="flex-grow overflow-y-auto space-y-1 pr-1 mb-2 custom-scrollbar">
                {list.map(item => (
                    <div key={item.id} className={`flex justify-between items-center p-1.5 rounded text-xs transition-all border ${item.active ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold shadow-[0_0_10px_var(--glow-primary)] scale-[1.02] mx-0.5' : 'bg-white/5 border-transparent text-[var(--text-secondary)] hover:bg-white/10'}`}>
                        <span className="truncate px-1 flex-grow">{item.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono opacity-80">{item.value}</span>
                            <button onClick={() => remove(item.id)} className="hover:text-red-400 opacity-30 hover:opacity-100 transition-opacity px-1">&times;</button>
                        </div>
                    </div>
                ))}
                {list.length === 0 && <div className="text-[var(--text-muted)] text-xs text-center italic pt-4 opacity-50">Waiting for combat...</div>}
            </div>
            <div className="flex gap-2 pt-2 border-t border-white/10">
                <button onClick={clear} className="px-3 py-1 text-[10px] bg-white/5 hover:bg-red-900/50 hover:text-red-200 hover:border-red-800 border border-transparent rounded transition-colors uppercase font-bold tracking-wider">Clear</button>
                <button onClick={nextTurn} className="flex-grow py-1 text-xs bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-white rounded font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1">
                    <PlayIcon className="w-3 h-3" /> Next Turn
                </button>
            </div>
        </div>
    );
};

const NameGenWidget: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
    const lastGenerated = data.lastGenerated || '';
    const race = data.race || 'Elf';

    const generate = () => {
        let name = '';
        const nameData = GENERATORS.GENERATOR_NAME_DATA;

        if (race === 'Elf') {
            name = randomItem(nameData.Elf.prefixes) + randomItem(nameData.Elf.suffixes);
            if (Math.random() > 0.5) name += ' ' + randomItem(nameData.Elf.surnames);
        } else if (race === 'Dwarf') {
            name = randomItem(nameData.Dwarf.prefixes) + randomItem(nameData.Dwarf.suffixes);
            if (Math.random() > 0.3) name += ' ' + randomItem(nameData.Dwarf.clanNames);
        } else if (race === 'Orc') {
            name = randomItem(nameData.Orc.prefixes) + randomItem(nameData.Orc.suffixes);
            if (Math.random() > 0.7) name += ' ' + randomItem(nameData.Orc.epithets);
        } else if (race === 'Human') {
            name = randomItem(nameData.Human.firstNames) + ' ' + randomItem(nameData.Human.surnames);
        } else if (race === 'Halfling') {
             name = randomItem(nameData.Halfling.firstNames) + ' ' + randomItem(nameData.Halfling.surnames);
        } else if (race === 'Gnome') {
             name = randomItem(nameData.Gnome.firstNames) + ' "' + randomItem(nameData.Gnome.nicknames) + '" ' + randomItem(nameData.Gnome.clanNames);
        } else if (race === 'Tiefling') {
             if (Math.random() > 0.5) name = randomItem(nameData.Tiefling.virtueNames);
             else name = randomItem(nameData.Tiefling.infernalNames);
        } else if (race === 'Dragonborn') {
             name = randomItem(nameData.Dragonborn.firstNames) + ' of Clan ' + randomItem(nameData.Dragonborn.clanNames);
        }

        // Capitalize first letter if it was simple prefix/suffix logic
        if (!name.includes(' ')) {
             name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        onUpdate({ ...data, lastGenerated: name, race });
    };

    return (
        <div className="flex flex-col h-full justify-center gap-3">
            <div className="text-center bg-black/20 rounded-lg p-2 border border-white/5 flex-grow flex flex-col justify-center">
                <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1 tracking-widest font-bold opacity-50">Result</p>
                <div 
                    className="text-base font-bold text-[var(--text-primary)] break-words cursor-pointer hover:text-[var(--accent-primary)] transition-colors drop-shadow-sm select-all"
                    onClick={() => navigator.clipboard.writeText(lastGenerated)}
                    title="Click to copy"
                >
                    {lastGenerated || '---'}
                </div>
            </div>
            <div className="flex gap-2">
                <select 
                    value={race} 
                    onChange={e => onUpdate({...data, race: e.target.value})}
                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs flex-grow text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer hover:bg-white/5"
                >
                    {Object.keys(GENERATORS.GENERATOR_NAME_DATA).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button onClick={generate} className="bg-white/10 hover:bg-[var(--accent-primary)] hover:text-black text-[var(--text-primary)] px-3 py-1 rounded text-xs font-bold transition-colors uppercase tracking-wider">Roll</button>
            </div>
        </div>
    );
};

const TodoWidget: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
    const tasks: { id: string; text: string; done: boolean }[] = data.tasks || [];
    const [input, setInput] = useState('');

    const add = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newTasks = [...tasks, { id: String(Date.now()), text: input, done: false }];
        onUpdate({ ...data, tasks: newTasks });
        setInput('');
    };

    const toggle = (id: string) => {
        const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
        onUpdate({ ...data, tasks: newTasks });
    };

    const remove = (id: string) => {
        onUpdate({ ...data, tasks: tasks.filter(t => t.id !== id) });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto space-y-1 pr-1 mb-2 custom-scrollbar">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-sm group hover:bg-white/5 p-1.5 rounded transition-colors">
                        <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} className="cursor-pointer accent-[var(--accent-primary)] w-3.5 h-3.5 bg-black/20 border-white/20" />
                        <span className={`flex-grow truncate text-xs transition-all ${task.done ? 'line-through text-[var(--text-muted)] opacity-50' : 'text-[var(--text-primary)]'}`}>{task.text}</span>
                        <button onClick={() => remove(task.id)} className="text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-1">&times;</button>
                    </div>
                ))}
                {tasks.length === 0 && <div className="text-xs text-[var(--text-muted)] text-center pt-8 italic opacity-50">Add tasks below</div>}
            </div>
            <form onSubmit={add} className="flex gap-1 pt-2 border-t border-white/10">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="New task..." className="flex-grow bg-transparent border-b border-white/10 px-1 py-1 text-xs focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] placeholder-white/20" />
                <button type="submit" className="text-[var(--accent-primary)] hover:text-white font-bold px-2 transition-colors">+</button>
            </form>
        </div>
    );
};

const LinksWidget: React.FC<{ data: any; onUpdate: (data: any) => void, isEditing: boolean }> = ({ data, onUpdate, isEditing }) => {
    const links: { id: string; label: string; url: string }[] = data.links || [];
    const [newLabel, setNewLabel] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const add = () => {
        if (!newLabel || !newUrl) return;
        const newLinks = [...links, { id: String(Date.now()), label: newLabel, url: newUrl }];
        onUpdate({ ...data, links: newLinks });
        setNewLabel('');
        setNewUrl('');
    };

    const remove = (id: string) => {
        onUpdate({ ...data, links: links.filter(l => l.id !== id) });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {links.map(link => (
                    <div key={link.id} className="flex gap-1 group">
                        <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-grow bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 text-[var(--text-primary)] px-3 py-2 rounded text-xs font-bold text-center truncate block transition-all"
                        >
                            {link.label}
                        </a>
                        {isEditing && (
                            <button onClick={() => remove(link.id)} className="text-red-400 hover:bg-red-900/50 px-2 rounded transition-colors">
                                <TrashIcon className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
                {links.length === 0 && !isEditing && <div className="text-xs text-[var(--text-muted)] text-center pt-8 italic opacity-50">No links</div>}
            </div>
            
            {isEditing && (
                <div className="mt-2 pt-2 border-t border-white/10 space-y-2 bg-black/20 p-2 rounded">
                    <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label" className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none" />
                    <div className="flex gap-1">
                        <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL" className="flex-grow bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none" />
                        <button onClick={add} className="bg-[var(--accent-primary)]/80 hover:bg-[var(--accent-primary)] text-black px-2 rounded text-xs font-bold">Add</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PinnedEntityWidget: React.FC<{ 
    data: any; 
    characters: Character[]; 
    npcs: NPC[]; 
    monsters: Monster[]; 
    onNavigate: (type: 'character' | 'npc' | 'monster', id: string) => void 
}> = ({ data, characters, npcs, monsters, onNavigate }) => {
    const entityId = data.entityId;
    const type = data.entityType as 'character' | 'npc' | 'monster';

    let entity: any = null;
    let icon = null;
    let colorClass = 'text-[var(--text-primary)]';

    if (type === 'character') {
        entity = characters.find(c => c.id === entityId);
        icon = <UserCircleIcon className="w-6 h-6" />;
        colorClass = 'text-blue-300';
    } else if (type === 'npc') {
        entity = npcs.find(n => n.id === entityId);
        icon = <UsersIcon className="w-6 h-6" />;
        colorClass = 'text-amber-300';
    } else if (type === 'monster') {
        entity = monsters.find(m => m.id === entityId);
        icon = <MonsterIcon className="w-6 h-6" />;
        colorClass = 'text-red-400';
    }

    if (!entity) {
        return <div className="text-xs text-[var(--text-muted)] italic text-center h-full flex items-center justify-center opacity-50">Entity missing</div>;
    }

    const image = entity.appearanceImage || entity.image;
    const subtitle = type === 'character' ? `Lvl ${entity.level} ${entity.characterClass}` : type === 'npc' ? entity.classRole : `CR ${entity.cr} ${entity.type}`;
    const hp = entity.currentHp !== undefined ? entity.currentHp : entity.hp;
    const ac = entity.ac;

    return (
        <div 
            onClick={() => onNavigate(type, entityId)}
            className="h-full flex flex-col cursor-pointer group rounded transition-colors"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[var(--accent-primary)] bg-black/30 flex-shrink-0 shadow-md transition-colors relative">
                    {image ? (
                        <img src={image} alt={entity.name} className="w-full h-full object-cover" draggable={false} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] opacity-70">{icon}</div>
                    )}
                </div>
                <div className="overflow-hidden">
                    <p className={`font-bold text-sm truncate group-hover:text-[var(--accent-primary)] transition-colors ${colorClass} leading-tight`}>{entity.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate opacity-70">{subtitle}</p>
                </div>
            </div>
            
            <div className="flex justify-around items-center mt-auto pt-2 border-t border-white/5">
                 <div className="flex items-center gap-1.5" title="Armor Class">
                    <ShieldIcon className="w-3 h-3 text-slate-400" />
                    <span className="font-mono font-bold text-sm text-slate-200">{ac}</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-1.5" title="Hit Points">
                    <HeartIcon className="w-3 h-3 text-red-400" />
                    <span className="font-mono font-bold text-sm text-slate-200">{hp}</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const DmDashboard: React.FC<DmDashboardProps> = ({ diceHistory, onRoll, characters, npcs, monsters, onNavigate }) => {
    // Load widgets, defaulting to free-form but migrating if necessary
    const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
        try {
            const saved = localStorage.getItem('dm-dashboard-widgets-v2');
            if (saved) {
                return JSON.parse(saved);
            }
            
            // Migration logic for old grid-based widgets
            const oldSaved = localStorage.getItem('dm-dashboard-widgets');
            if (oldSaved) {
                const oldWidgets = JSON.parse(oldSaved);
                // Convert grid (w/h) to pixel (rect)
                const GRID_W = 300;
                const GRID_H = 150;
                return oldWidgets.map((w: any, i: number) => ({
                    ...w,
                    rect: { 
                        x: (i % 3) * (GRID_W + 20) + 20, // Simple staggering
                        y: Math.floor(i / 3) * (GRID_H + 20) + 20, 
                        w: (w.dimensions?.w || 1) * GRID_W,
                        h: (w.dimensions?.h || 1) * GRID_H 
                    },
                    zIndex: i + 1
                }));
            }
        } catch (e) {
            console.error("Failed to load widgets", e);
        }
        return DEFAULT_WIDGETS;
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isPinMenuOpen, setIsPinMenuOpen] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(false);

    useEffect(() => {
        localStorage.setItem('dm-dashboard-widgets-v2', JSON.stringify(widgets));
    }, [widgets]);

    const getNextZIndex = () => {
        if (widgets.length === 0) return 1;
        return Math.max(...widgets.map(w => w.zIndex || 0)) + 1;
    };

    const bringToFront = (id: string) => {
        setWidgets(prev => {
            const maxZ = Math.max(...prev.map(w => w.zIndex || 0));
            return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
        });
    };

    const addWidget = (type: WidgetType, extraData: any = {}) => {
        const titles: Record<WidgetType, string> = {
            'SCRATCHPAD': 'Notes',
            'QUICK_DICE': 'Quick Dice',
            'COUNTER': 'Counter',
            'IMAGE': 'Reference Image',
            'INITIATIVE': 'Tracker',
            'CLOCK': 'Session Timer',
            'NAME_GEN': 'Name Generator',
            'TODO': 'To-Do List',
            'LINKS': 'Bookmarks',
            'PINNED': 'Shortcut'
        };
        
        // Default size based on type
        let defaultRect = { x: 50, y: 50, w: 300, h: 200 };
        if (type === 'QUICK_DICE') defaultRect = { x: 50, y: 50, w: 280, h: 180 };
        if (type === 'CLOCK') defaultRect = { x: 50, y: 50, w: 250, h: 150 };
        if (type === 'COUNTER') defaultRect = { x: 50, y: 50, w: 200, h: 150 };
        if (type === 'PINNED') defaultRect = { x: 50, y: 50, w: 220, h: 120 };

        // Random slight offset so they don't stack perfectly
        defaultRect.x += Math.random() * 50;
        defaultRect.y += Math.random() * 50;

        const newWidget: DashboardWidget = {
            id: String(Date.now()),
            type,
            title: extraData.title || titles[type],
            rect: defaultRect,
            zIndex: getNextZIndex(),
            tint: 'DEFAULT',
            data: type === 'COUNTER' ? { value: 0, label: 'Label' } : { ...extraData }
        };
        setWidgets(prev => [...prev, newWidget]);
        setIsAddMenuOpen(false);
        setIsPinMenuOpen(false);
    };

    const removeWidget = (id: string) => {
        setWidgets(prev => prev.filter(w => w.id !== id));
    };

    const updateWidget = (id: string, updates: Partial<DashboardWidget>) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    };

    const updateWidgetData = (id: string, dataUpdates: any) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, data: { ...w.data, ...dataUpdates } } : w));
    };

    return (
        <div className="h-full flex flex-col animate-fade-in overflow-hidden relative bg-[var(--bg-primary-alt)]">
            {/* Edit Mode Overlay Background */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isEditing ? 'opacity-100' : 'opacity-0'}`} 
                 style={{ 
                     backgroundImage: 'radial-gradient(var(--border-secondary) 1px, transparent 1px)', 
                     backgroundSize: '20px 20px',
                     backgroundColor: 'rgba(0,0,0,0.2)' 
                 }}></div>
            
            {/* Header / Controls */}
            <div className="p-4 border-b border-white/10 bg-slate-900/30 backdrop-blur-md flex justify-between items-center flex-shrink-0 z-20 shadow-lg">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">DM Dashboard</h2>
                    <label className="flex items-center gap-2 cursor-pointer select-none group bg-black/40 px-3 py-1 rounded-full border border-white/5 hover:border-white/20 transition-all">
                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isEditing ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>Edit Mode</span>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${isEditing ? 'bg-[var(--accent-primary)]' : 'bg-white/20'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isEditing ? 'translate-x-4' : ''}`} />
                        </div>
                        <input type="checkbox" checked={isEditing} onChange={e => setIsEditing(e.target.checked)} className="hidden" />
                    </label>
                    {isEditing && (
                        <label className="flex items-center gap-2 cursor-pointer select-none ml-2">
                            <input type="checkbox" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)} className="cursor-pointer accent-[var(--accent-primary)]" />
                            <span className="text-xs text-[var(--text-secondary)]">Snap to Grid</span>
                        </label>
                    )}
                </div>

                {isEditing && (
                    <div className="flex gap-2 relative animate-fade-in">
                        <Button onClick={() => setIsAddMenuOpen(!isAddMenuOpen)} size="sm" className="shadow-lg shadow-[var(--accent-primary)]/20">
                             <PlusIcon className="w-4 h-4 mr-1" /> Add Widget
                        </Button>
                        
                        {isAddMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900/95 border border-[var(--border-primary)] rounded-lg shadow-2xl z-50 p-2 grid grid-cols-1 gap-1 animate-fade-in backdrop-blur-xl">
                                <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold px-2 py-1">Tools</div>
                                <button onClick={() => addWidget('SCRATCHPAD')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Note</button>
                                <button onClick={() => addWidget('TODO')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">To-Do List</button>
                                <button onClick={() => addWidget('INITIATIVE')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Initiative Tracker</button>
                                <button onClick={() => addWidget('QUICK_DICE')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Dice Roller</button>
                                <button onClick={() => addWidget('CLOCK')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Timer</button>
                                <button onClick={() => addWidget('NAME_GEN')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Name Gen</button>
                                <button onClick={() => addWidget('COUNTER')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Counter</button>
                                <button onClick={() => addWidget('LINKS')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Quick Links</button>
                                <button onClick={() => addWidget('IMAGE')} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded transition-colors">Image</button>
                                <div className="border-t border-white/10 my-1"></div>
                                <button onClick={() => setIsPinMenuOpen(true)} className="text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] rounded text-[var(--accent-primary)] font-bold transition-colors flex items-center justify-between">Pin Entity... <span className="text-xs">→</span></button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Free-form Canvas */}
            <div className="flex-grow relative overflow-hidden bg-[var(--bg-primary)]/20">
                {/* Desktop-style container (limited to viewport) */}
                <div className="w-full h-full relative p-4 overflow-hidden">
                        {widgets.length === 0 ? (
                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-60 border-4 border-dashed border-white/5 rounded-xl p-12 bg-black/20 backdrop-blur-sm">
                                <MapIcon className="w-20 h-20 mb-6 opacity-50" />
                                <p className="text-2xl font-medieval mb-2 text-[var(--text-secondary)]">Your dashboard is empty.</p>
                                <p className="text-sm">Toggle "Edit Mode" to add widgets.</p>
                            </div>
                        ) : (
                            widgets.map(widget => (
                                <WidgetWrapper
                                    key={widget.id}
                                    widget={widget}
                                    isEditing={isEditing}
                                    onRemove={removeWidget}
                                    onUpdate={updateWidget}
                                    onBringToFront={bringToFront}
                                    snapToGrid={snapToGrid}
                                >
                                    {widget.type === 'SCRATCHPAD' && <ScratchpadWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} />}
                                    {widget.type === 'QUICK_DICE' && <QuickDiceWidget onRoll={onRoll} />}
                                    {widget.type === 'COUNTER' && <CounterWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} />}
                                    {widget.type === 'IMAGE' && <ImageWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} isEditing={isEditing} />}
                                    {widget.type === 'CLOCK' && <ClockWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} />}
                                    {widget.type === 'INITIATIVE' && <InitiativeWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} />}
                                    {widget.type === 'NAME_GEN' && <NameGenWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} />}
                                    {widget.type === 'TODO' && <TodoWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} />}
                                    {widget.type === 'LINKS' && <LinksWidget data={widget.data} onUpdate={(d) => updateWidgetData(widget.id, d)} isEditing={isEditing} />}
                                    {widget.type === 'PINNED' && <PinnedEntityWidget data={widget.data} characters={characters} npcs={npcs} monsters={monsters} onNavigate={onNavigate} />}
                                </WidgetWrapper>
                            ))
                        )}
                </div>
            </div>

            {/* Pin Entity Modal */}
            {isPinMenuOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-vignette animate-fade-in" onClick={() => setIsPinMenuOpen(false)}>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                            <h3 className="font-medieval text-xl text-[var(--accent-primary)]">Pin Shortcut</h3>
                            <button onClick={() => setIsPinMenuOpen(false)} className="text-[var(--text-muted)] hover:text-white text-2xl leading-none">&times;</button>
                        </div>
                        <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar bg-black/10">
                            {/* Characters */}
                            <div>
                                <h4 className="text-xs uppercase font-bold text-[var(--text-muted)] mb-2 sticky top-0 bg-[var(--bg-secondary)] py-1 z-10 shadow-sm">Characters</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {characters.map(c => (
                                        <button key={c.id} onClick={() => addWidget('PINNED', { entityType: 'character', entityId: c.id, title: c.name })} className="flex items-center gap-3 p-2 hover:bg-[var(--bg-tertiary)] rounded text-left text-sm border border-transparent hover:border-[var(--border-secondary)] transition-all bg-white/5">
                                            <UserCircleIcon className="w-5 h-5 text-[var(--accent-secondary)]"/> <span className="truncate">{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* NPCs */}
                            <div>
                                <h4 className="text-xs uppercase font-bold text-[var(--text-muted)] mb-2 sticky top-0 bg-[var(--bg-secondary)] py-1 z-10 shadow-sm">NPCs</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {npcs.map(n => (
                                        <button key={n.id} onClick={() => addWidget('PINNED', { entityType: 'npc', entityId: n.id, title: n.name })} className="flex items-center gap-3 p-2 hover:bg-[var(--bg-tertiary)] rounded text-left text-sm border border-transparent hover:border-[var(--border-secondary)] transition-all bg-white/5">
                                            <UsersIcon className="w-5 h-5 text-[var(--accent-primary)]"/> <span className="truncate">{n.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Monsters */}
                            <div>
                                <h4 className="text-xs uppercase font-bold text-[var(--text-muted)] mb-2 sticky top-0 bg-[var(--bg-secondary)] py-1 z-10 shadow-sm">Monsters</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {monsters.map(m => (
                                        <button key={m.id} onClick={() => addWidget('PINNED', { entityType: 'monster', entityId: m.id, title: m.name })} className="flex items-center gap-3 p-2 hover:bg-[var(--bg-tertiary)] rounded text-left text-sm border border-transparent hover:border-[var(--border-secondary)] transition-all bg-white/5">
                                            <MonsterIcon className="w-5 h-5 text-red-400"/> <span className="truncate">{m.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DmDashboard;
