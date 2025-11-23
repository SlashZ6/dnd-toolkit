
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Character, NPC, Monster, MonsterTrait } from '../types';
import Button from './ui/Button';
import Loader from './ui/Loader';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MonsterIcon } from './icons/MonsterIcon';
import { ExportIcon } from './icons/ExportIcon';
import { TrashIcon } from './icons/TrashIcon';
import { RulerIcon } from './icons/RulerIcon';
import { PlayIcon } from './icons/PlayIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { HeartIcon } from './icons/HeartIcon';
import { D20Icon } from './icons/D20Icon';
import { MapIcon } from './icons/MapIcon';
import { RollResult } from './DiceRoller';
import { useToast } from './ui/Toast';

// Declare html-to-image library
declare const htmlToImage: {
  toPng: (node: HTMLElement, options?: any) => Promise<string>;
};

type DraggableEntityType = 'character' | 'npc' | 'monster';

interface PlacedItem {
  instanceId: string;
  type: DraggableEntityType;
  data: Character | NPC | Monster;
  position: { x: number; y: number };
  width: number;
  height: number;
}

interface DraggableItem {
    type: DraggableEntityType;
    data: Character | NPC | Monster;
}

interface CombatantState {
    instanceId: string;
    name: string;
    initiative: number;
    currentHp: number;
    maxHp: number;
    ac: number;
    conditions: string[];
}

interface FloatingText {
    id: string;
    x: number;
    y: number;
    text: string;
    color: string;
    opacity: number;
}

interface MeasureLine {
    id: string;
    start: { x: number; y: number; attachedTo?: string };
    end: { x: number; y: number; attachedTo?: string };
    manualText?: string;
}

const CARD_WIDTH = 160;
const CARD_HEIGHT = 192; // Slightly smaller for better grid fit
const GRID_SIZE = 25; // Visual grid size
const SNAP_SIZE = 50; // Logic snap size (5ft square usually maps to ~50px in UI scaling)

const CONDITIONS_LIST = [
    "Blinded", "Charmed", "Deafened", "Frightened", "Grappled", 
    "Incapacitated", "Invisible", "Paralyzed", "Petrified", 
    "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious", "Exhaustion"
];

// --- FLOATING TEXT COMPONENT ---
const FloatingTextDisplay: React.FC<{ items: FloatingText[] }> = ({ items }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {items.map(item => (
                <div
                    key={item.id}
                    className="absolute font-bold text-2xl drop-shadow-md transition-all duration-1000 ease-out"
                    style={{
                        left: item.x,
                        top: item.y,
                        color: item.color,
                        opacity: item.opacity,
                        transform: `translate(-50%, -100%) translateY(${item.opacity * -30}px)`
                    }}
                >
                    {item.text}
                </div>
            ))}
        </div>
    );
};

// --- MEASUREMENT LABEL COMPONENT ---
const MeasurementLabel: React.FC<{
    line: MeasureLine;
    onChange: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}> = ({ line, onChange, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(line.manualText || "");

    const dist = Math.sqrt(Math.pow(line.end.x - line.start.x, 2) + Math.pow(line.end.y - line.start.y, 2));
    const feet = Math.round(dist / SNAP_SIZE * 5);
    
    const display = line.manualText || `${feet} ft`;

    const midX = (line.start.x + line.end.x) / 2;
    const midY = (line.start.y + line.end.y) / 2;

    useEffect(() => {
        setValue(line.manualText || "");
    }, [line.manualText]);

    const handleSave = () => {
        onChange(line.id, value);
        setIsEditing(false);
    };

    return (
        <div 
            className="absolute bg-[var(--bg-secondary)] border border-[var(--accent-primary)] rounded shadow-lg z-40 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto min-w-[90px]"
            style={{ left: midX, top: midY }}
        >
             {isEditing ? (
                 <div className="flex items-center p-1 gap-1">
                    <input 
                        autoFocus
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={e => { if(e.key === 'Enter') handleSave(); }}
                        className="w-16 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded px-1 text-xs text-[var(--text-primary)] focus:outline-none"
                        placeholder="Custom"
                    />
                    <button onMouseDown={handleSave} className="text-green-500 font-bold px-1 hover:text-green-400">✓</button>
                 </div>
             ) : (
                 <div className="flex items-center justify-between w-full p-1 gap-2">
                    <span 
                        onClick={() => { setValue(line.manualText || ""); setIsEditing(true); }}
                        className={`text-xs font-bold cursor-pointer hover:text-[var(--text-primary)] px-1 flex-grow text-center ${line.manualText ? 'text-[var(--accent-secondary)] italic' : 'text-[var(--accent-primary)]'}`}
                        title="Click to set manual distance"
                    >
                        {display}
                    </span>
                    <button 
                        onClick={() => onDelete(line.id)}
                        className="text-[var(--text-muted)] hover:text-[var(--bg-destructive)] font-bold leading-none px-1 border-l border-[var(--border-secondary)]"
                        title="Delete line"
                    >
                        &times;
                    </button>
                 </div>
             )}
        </div>
    )
};

// --- INITIATIVE RIBBON ---
const InitiativeRibbon: React.FC<{
    combatData: Record<string, CombatantState>;
    turnOrder: string[];
    activeCombatantId: string | null;
    placedItems: PlacedItem[];
    onSelect: (id: string) => void;
}> = ({ combatData, turnOrder, activeCombatantId, placedItems, onSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeCombatantId && scrollRef.current) {
            const index = turnOrder.indexOf(activeCombatantId);
            if (index !== -1) {
                // Center the active item
                const itemWidth = 80; // Approximate width + margin
                const scrollPos = (index * itemWidth) - (scrollRef.current.clientWidth / 2) + (itemWidth / 2);
                scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }
    }, [activeCombatantId, turnOrder]);

    return (
        <div className="w-full bg-[var(--bg-secondary)]/90 border-b border-[var(--border-primary)] h-24 flex items-center relative shadow-lg z-20">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
            
            <div 
                ref={scrollRef}
                className="flex items-center gap-4 px-4 overflow-x-auto no-scrollbar w-full h-full snap-x"
                style={{ scrollBehavior: 'smooth' }}
            >
                {turnOrder.map(id => {
                    const state = combatData[id];
                    const item = placedItems.find(p => p.instanceId === id);
                    if (!state || !item) return null;
                    
                    const isActive = id === activeCombatantId;
                    const isDead = state.currentHp <= 0;
                    const img = (item.data as any).appearanceImage || (item.data as any).image;

                    return (
                        <button
                            key={id}
                            onClick={() => onSelect(id)}
                            className={`
                                relative flex-shrink-0 transition-all duration-300 snap-center group
                                ${isActive ? 'scale-110 mx-4' : 'opacity-70 hover:opacity-100 hover:scale-105'}
                                ${isDead ? 'grayscale' : ''}
                            `}
                        >
                            {isActive && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[var(--accent-primary)] font-bold text-xs animate-bounce">
                                    ACTIVE
                                </div>
                            )}
                            <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${isActive ? 'border-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-primary)]' : 'border-[var(--border-secondary)]'} bg-[var(--bg-primary)]`}>
                                {img ? <img src={img} alt={state.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{state.name.substring(0, 2)}</div>}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[var(--bg-tertiary)] text-xs border border-[var(--border-primary)] rounded-full w-6 h-6 flex items-center justify-center font-bold z-10">
                                {state.initiative}
                            </div>
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap max-w-[80px] truncate bg-black/50 px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {state.name}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- DYNAMIC CARD COMPONENT ---
const EncounterCard: React.FC<{ 
    item: PlacedItem;
    combatState: CombatantState | undefined;
    isActive: boolean;
    onUpdate: (id: string, updates: Partial<Pick<PlacedItem, 'position' | 'width' | 'height'>>) => void;
    onRemove: (id: string) => void;
    onCardClick: (id: string) => void;
    isMeasureMode: boolean;
    onMeasureStart: (id: string, e: React.MouseEvent) => void;
    onMeasureEnd: (id: string, e: React.MouseEvent) => void;
    snapToGrid: boolean;
}> = ({ item, combatState, isActive, onUpdate, onRemove, onCardClick, isMeasureMode, onMeasureStart, onMeasureEnd, snapToGrid }) => {
    
    const cardRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });

    // Use Pointer events for unified touch/mouse handling
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isMeasureMode) {
            e.stopPropagation();
            onMeasureStart(item.instanceId, e);
            return;
        }
        
        // Don't drag if clicking delete button
        if ((e.target as HTMLElement).closest('.delete-btn')) return;

        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        startPos.current = { x: item.position.x, y: item.position.y };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
        
        // Calculate rough new position for visual feedback (optional, but we update state directly here)
        // For smoother high-freq updates, usually requestAnimationFrame is better, but for this app direct updates might suffice if not too many items.
        // Actually, let's debounce or just update. React 18 batching handles this well usually.
        
        const newRawX = startPos.current.x + deltaX;
        const newRawY = startPos.current.y + deltaY;
        
        onUpdate(item.instanceId, { position: { x: newRawX, y: newRawY } });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isMeasureMode) {
            e.stopPropagation();
            onMeasureEnd(item.instanceId, e);
            return;
        }

        if (!isDragging.current) return;
        
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);

        // Snap on release
        if (snapToGrid) {
            const finalX = Math.round(item.position.x / SNAP_SIZE) * SNAP_SIZE;
            const finalY = Math.round(item.position.y / SNAP_SIZE) * SNAP_SIZE;
            onUpdate(item.instanceId, { position: { x: finalX, y: finalY } });
        }
    };

    // Handle click vs drag differentiation
    const handleClick = (e: React.MouseEvent) => {
        if (isMeasureMode) return;
        // Simple check: if we moved significantly, it was a drag, not a click.
        // But pointer events handle movement. Let's assume if we are here, it wasn't a huge drag if we want to select.
        // Actually, let's just allow selection on pointer down or up if no move occurred. 
        // For now, standard onClick works if no drag happened.
        e.stopPropagation();
        onCardClick(item.instanceId);
    };

    let name, image, borderColorClass;
    const currentHp = combatState ? combatState.currentHp : (item.data as any).currentHp || (item.data as any).hp || 10;
    const maxHp = combatState ? combatState.maxHp : (item.data as any).maxHp || (item.data as any).hp || 10;
    
    const parseHp = (val: any) => {
        if (typeof val === 'string') return parseInt(val.split(' ')[0]) || 10;
        return val || 10;
    };
    const safeCurrentHp = typeof currentHp === 'string' ? parseHp(currentHp) : currentHp;
    const safeMaxHp = typeof maxHp === 'string' ? parseHp(maxHp) : maxHp;
    
    const hpPercent = Math.min(100, Math.max(0, (safeCurrentHp / safeMaxHp) * 100));
    let hpColor = 'bg-green-500';
    if (hpPercent < 50) hpColor = 'bg-yellow-500';
    if (hpPercent < 25) hpColor = 'bg-red-500';

    if (item.type === 'character') {
        const char = item.data as Character;
        name = char.name;
        image = char.appearanceImage;
        borderColorClass = 'border-[var(--border-accent-secondary)]';
    } else if (item.type === 'npc') {
        const npc = item.data as NPC;
        name = npc.name;
        image = npc.image;
        borderColorClass = 'border-[var(--border-accent-primary)]';
    } else { // Monster
        const monster = item.data as Monster;
        name = monster.name;
        image = monster.image;
        borderColorClass = 'border-red-500';
    }

    const isDead = safeCurrentHp <= 0;

    return (
        <div 
            ref={cardRef}
            className={`group absolute rounded-lg border-2 shadow-lg flex flex-col touch-none select-none ${isMeasureMode ? 'cursor-crosshair hover:ring-2 hover:ring-[var(--accent-primary)]' : 'cursor-grab active:cursor-grabbing'} ${isActive ? 'ring-4 ring-amber-400 z-20' : 'hover:z-10 z-0'} ${isDead ? 'grayscale opacity-80' : 'bg-[var(--bg-secondary)]/90 backdrop-blur-sm'}`}
            style={{ 
                left: item.position.x, 
                top: item.position.y,
                width: `${item.width}px`,
                height: `${item.height}px`,
                borderColor: isActive ? 'var(--accent-primary)' : `var(--border-primary)`,
                transition: isDragging.current ? 'none' : 'border-color 0.2s, box-shadow 0.2s, transform 0.1s, left 0.1s ease-out, top 0.1s ease-out' // Animate snap
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={handleClick}
        >
            <div className={`h-3/5 bg-[var(--bg-primary)]/50 flex items-center justify-center overflow-hidden rounded-t-md border-b-2 ${borderColorClass} relative pointer-events-none`}>
                 {image ? 
                    <img src={image} alt={name} className="w-full h-full object-cover object-top" draggable={false} /> 
                    : <div className="text-5xl text-[var(--text-muted)] opacity-50 font-medieval">{name.charAt(0)}</div>}
                 
                 {/* Condition Badges */}
                 {combatState && combatState.conditions.length > 0 && (
                     <div className="absolute top-1 right-1 flex flex-col gap-1 items-end">
                         {combatState.conditions.slice(0, 3).map((c, i) => (
                             <span key={i} className="text-[9px] bg-red-950/90 text-red-200 px-1.5 py-0.5 rounded shadow-sm border border-red-800 truncate max-w-[100px]">{c}</span>
                         ))}
                         {combatState.conditions.length > 3 && <span className="text-[9px] bg-red-950/90 text-red-200 px-1.5 py-0.5 rounded shadow-sm border border-red-800">+More</span>}
                     </div>
                 )}
                 {isDead && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <span className="text-red-500 font-medieval text-4xl font-bold drop-shadow-md">KO</span>
                     </div>
                 )}
            </div>
            <div className="p-2 flex-grow flex flex-col justify-between pointer-events-none">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="font-medieval text-sm font-bold text-[var(--text-primary)] truncate w-full leading-tight">{name}</h4>
                    </div>
                    
                    {/* HP Bar */}
                    <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full mt-2 overflow-hidden border border-[var(--border-secondary)]">
                        <div className={`h-full ${hpColor} transition-all duration-500`} style={{ width: `${hpPercent}%` }} />
                    </div>
                </div>
                
                <div className="text-xs text-[var(--text-muted)] flex justify-between items-center font-mono mt-1 border-t border-[var(--border-secondary)]/50 pt-1">
                     <div className="flex items-center gap-1" title="Armor Class"><ShieldIcon className="w-3 h-3"/> {combatState?.ac || (item.data as any).ac}</div>
                     <div className="flex items-center gap-1" title="Hit Points"><HeartIcon className="w-3 h-3"/> {safeCurrentHp}</div>
                </div>
            </div>
             <button 
                onClick={(e) => { e.stopPropagation(); onRemove(item.instanceId); }}
                className="absolute -top-2 -right-2 bg-[var(--bg-destructive)] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 delete-btn shadow-md border border-[var(--bg-primary)] pointer-events-auto"
                aria-label="Remove card"
            >
                &times;
            </button>
        </div>
    );
};


// --- SIDEBAR COMPONENT ---
const EncounterSidebar: React.FC<{ 
    characters: Character[],
    npcs: NPC[],
    monsters: Monster[],
}> = ({ characters, npcs, monsters }) => {
    
    const onDragStart = (e: React.DragEvent, item: DraggableItem) => {
        e.dataTransfer.setData('application/json', JSON.stringify(item));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const DraggableListItem: React.FC<{ item: DraggableItem, icon: React.ReactNode }> = ({ item, icon }) => (
        <div 
            draggable 
            onDragStart={(e) => onDragStart(e, item)}
            className="flex items-center gap-3 p-2 bg-[var(--bg-secondary)] rounded-md cursor-grab active:cursor-grabbing hover:bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-secondary)] transition-colors touch-none"
        >
            <div className="w-6 h-6 flex-shrink-0 text-[var(--text-muted)]">{icon}</div>
            <div className="overflow-hidden">
                <p className="text-[var(--text-primary)] font-bold truncate text-sm">{item.data.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">
                    {item.type === 'character' ? `Lvl ${(item.data as Character).level}` :
                     item.type === 'npc' ? (item.data as NPC).classRole :
                     `CR ${(item.data as Monster).cr}`}
                </p>
            </div>
        </div>
    );
    
    return (
        <aside className="hidden lg:flex w-64 bg-[var(--bg-secondary)]/30 border-r border-[var(--border-primary)] flex-shrink-0 flex-col h-full overflow-hidden">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/50">Library</h3>
            <div className="overflow-y-auto flex-grow p-2 space-y-4 scrollbar-thin scrollbar-thumb-[var(--border-secondary)] scrollbar-track-transparent">
                <div>
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <UserCircleIcon className="w-4 h-4 text-[var(--accent-secondary)]"/>
                        <h4 className="font-bold text-xs text-[var(--text-secondary)] uppercase">Characters</h4>
                    </div>
                    <div className="space-y-1">{characters.map(c => <DraggableListItem key={c.id} item={{type: 'character', data: c}} icon={<UserCircleIcon className="w-4 h-4"/>} />)}</div>
                </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2 px-1 mt-4">
                        <UsersIcon className="w-4 h-4 text-[var(--accent-primary)]"/>
                        <h4 className="font-bold text-xs text-[var(--text-secondary)] uppercase">NPCs</h4>
                    </div>
                    <div className="space-y-1">{npcs.map(n => <DraggableListItem key={n.id} item={{type: 'npc', data: n}} icon={<UsersIcon className="w-4 h-4"/>} />)}</div>
                </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2 px-1 mt-4">
                        <MonsterIcon className="w-4 h-4 text-red-400"/>
                        <h4 className="font-bold text-xs text-[var(--text-secondary)] uppercase">Monsters</h4>
                    </div>
                    <div className="space-y-1">{monsters.map(m => <DraggableListItem key={m.id} item={{type: 'monster', data: m}} icon={<MonsterIcon className="w-4 h-4"/>} />)}</div>
                </div>
            </div>
        </aside>
    );
};

const SmartDiceRoller: React.FC<{
    activeCombatant: { item: PlacedItem, state: CombatantState };
    onRoll: (result: RollResult) => void;
}> = ({ activeCombatant, onRoll }) => {
    const [rollMode, setRollMode] = useState<'d20' | 'damage'>('d20');
    const [adv, setAdv] = useState<'none' | 'adv' | 'dis'>('none');
    const [modifier, setModifier] = useState(0);
    const [numDice, setNumDice] = useState(1);
    const [dieType, setDieType] = useState(6);
    const [reason, setReason] = useState('');

    const data = activeCombatant.item.data;
    
    const getMod = (score: number) => Math.floor((score - 10) / 2);
    const abilities = (data as any).abilityScores || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

    // Parse monster attacks to create smart buttons
    const monsterAttacks = useMemo(() => {
        if (activeCombatant.item.type !== 'monster') return [];
        const m = data as Monster;
        return m.attacks.map(atk => {
            // Attempt to parse "Hit: 5 (1d6 + 2) damage"
            const damageRegex = /Hit:.*?(\d+)\s*\(([\d]+d[\d]+)(?:\s*([+-]\s*\d+))?\)/i;
            const match = atk.description.match(damageRegex);
            const damageDice = match ? match[2] : null;
            const damageBonus = match ? (match[3] ? parseInt(match[3].replace(/\s/g, '')) : 0) : 0;
            
            // Attempt to parse "+X to hit"
            const hitRegex = /\+([0-9]+)\s+to\s+hit/i;
            const hitMatch = atk.description.match(hitRegex);
            const hitBonus = hitMatch ? parseInt(hitMatch[1]) : 0;

            return {
                name: atk.name,
                hitBonus,
                damageDice,
                damageBonus
            };
        });
    }, [data, activeCombatant.item.type]);

    const handleRoll = (overrideMode?: 'd20' | 'damage', overrideMod?: number, overrideReason?: string, overrideDice?: string) => {
        const mode = overrideMode || rollMode;
        let result: RollResult;
        const id = String(Date.now());

        if (mode === 'd20') {
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

            const effMod = overrideMod !== undefined ? overrideMod : modifier;
            const total = final + effMod;
            formula += effMod !== 0 ? ` ${effMod >= 0 ? '+' : '-'} ${Math.abs(effMod)}` : '';
            
            result = {
                id,
                title: overrideReason || reason || `${activeCombatant.state.name} Check`,
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
            // Damage
            let total = 0;
            const rolls = [];
            let dNum = numDice;
            let dType = dieType;
            let dMod = overrideMod !== undefined ? overrideMod : modifier;

            if (overrideDice) {
                // Parse "2d6"
                const parts = overrideDice.split('d');
                if (parts.length === 2) {
                    dNum = parseInt(parts[0]);
                    dType = parseInt(parts[1]);
                }
            }

            for(let i=0; i<dNum; i++) {
                const r = Math.floor(Math.random() * dType) + 1;
                rolls.push(r);
                total += r;
            }
            const sumOfRolls = rolls.reduce((a, b) => a + b, 0);
            total = sumOfRolls + dMod;
            const formula = `${dNum}d${dType} [${rolls.join(', ')}] ${dMod !== 0 ? (dMod > 0 ? '+' : '') + dMod : ''}`;
             result = {
                id,
                title: overrideReason || reason || `${activeCombatant.state.name} Damage`,
                formula,
                total,
                rolls,
                finalRoll: sumOfRolls,
                isCrit: false,
                isFumble: false,
                timestamp: Date.now(),
                metadata: {
                    mode: 'damage',
                    diceCount: dNum
                }
            };
        }
        onRoll(result);
        if(!overrideReason) setReason('');
    };

    return (
        <div className="space-y-4 p-3 bg-[var(--bg-primary)]/30 rounded-lg border border-[var(--border-primary)]">
            
            {/* Quick Actions Strip */}
            <div className="mb-2">
                <h5 className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Abilities</h5>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {Object.entries(abilities).map(([key, val]) => {
                        const mod = getMod(val as number);
                        return (
                            <button 
                                key={key} 
                                onClick={() => handleRoll('d20', mod, `${key.toUpperCase()} Check`)} 
                                className="whitespace-nowrap px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded text-xs hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors"
                            >
                                {key.toUpperCase()} ({mod >= 0 ? '+' : ''}{mod})
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Monster Actions */}
            {monsterAttacks.length > 0 && (
                <div className="mb-2">
                    <h5 className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Actions</h5>
                    <div className="space-y-2">
                        {monsterAttacks.map((atk, i) => (
                            <div key={i} className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded p-1 border border-[var(--border-secondary)]">
                                <button 
                                    onClick={() => handleRoll('d20', atk.hitBonus, `Attack: ${atk.name}`)}
                                    className="flex-grow text-left text-xs font-bold px-2 py-1 hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    {atk.name} <span className="text-[var(--text-muted)] font-normal">({atk.hitBonus >= 0 ? '+' : ''}{atk.hitBonus})</span>
                                </button>
                                {atk.damageDice && (
                                    <button 
                                        onClick={() => handleRoll('damage', atk.damageBonus, `Damage: ${atk.name}`, atk.damageDice)}
                                        className="bg-[var(--bg-tertiary)] text-[10px] px-2 py-1 rounded hover:bg-red-900 hover:text-white transition-colors"
                                        title={`Roll ${atk.damageDice}${atk.damageBonus >= 0 ? '+' : ''}${atk.damageBonus}`}
                                    >
                                        Dmg
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t border-[var(--border-secondary)] my-2"></div>

            {/* Manual Roller */}
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <button onClick={() => setRollMode('d20')} className={`p-1 rounded ${rollMode === 'd20' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>d20 Check</button>
                    <button onClick={() => setRollMode('damage')} className={`p-1 rounded ${rollMode === 'damage' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>Damage / Custom</button>
                </div>

                {rollMode === 'd20' ? (
                    <div className="flex justify-between bg-[var(--bg-secondary)] p-1 rounded border border-[var(--border-secondary)]">
                        <button onClick={() => setAdv('none')} className={`flex-1 text-[10px] py-1 rounded ${adv === 'none' ? 'bg-[var(--bg-tertiary)] text-white' : 'text-[var(--text-muted)]'}`}>Normal</button>
                        <button onClick={() => setAdv('adv')} className={`flex-1 text-[10px] py-1 rounded ${adv === 'adv' ? 'bg-green-600 text-white' : 'text-[var(--text-muted)]'}`}>Adv</button>
                        <button onClick={() => setAdv('dis')} className={`flex-1 text-[10px] py-1 rounded ${adv === 'dis' ? 'bg-red-600 text-white' : 'text-[var(--text-muted)]'}`}>Dis</button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <input type="number" value={numDice} onChange={e => setNumDice(parseInt(e.target.value)||1)} className="w-10 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded px-1 text-center text-sm"/>
                        <span className="text-xs text-[var(--text-muted)]">d</span>
                        <select value={dieType} onChange={e => setDieType(parseInt(e.target.value))} className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded px-1 py-1 text-sm text-[var(--text-primary)]">
                            {[4,6,8,10,12,20,100].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold w-8">Mod</span>
                    <input type="number" value={modifier} onChange={e => setModifier(parseInt(e.target.value)||0)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded px-2 py-1 text-sm text-[var(--text-primary)]"/>
                </div>
                
                <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Label (optional)" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded px-2 py-1 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)]"/>

                <Button onClick={() => handleRoll()} className="w-full py-1.5 flex items-center justify-center gap-2 text-sm">
                    <D20Icon className="w-4 h-4"/> Roll
                </Button>
            </div>
        </div>
    );
};


const ActiveEntityPanel: React.FC<{
    combatant: { item: PlacedItem, state: CombatantState };
    onUpdateState: (id: string, updates: Partial<CombatantState>) => void;
    onRoll: (result: RollResult) => void;
    history: RollResult[];
    onSpawnFloatText: (text: string, color: string, x: number, y: number) => void;
}> = ({ combatant, onUpdateState, onRoll, history, onSpawnFloatText }) => {
    const { item, state } = combatant;
    
    const handleHpChange = (val: string) => {
        const intVal = parseInt(val);
        if (!isNaN(intVal)) {
            const diff = intVal - state.currentHp;
            if (diff !== 0) {
                onUpdateState(state.instanceId, { currentHp: intVal });
                const color = diff < 0 ? '#ef4444' : '#22c55e'; // Red for damage, green for heal
                const text = diff > 0 ? `+${diff}` : `${diff}`;
                // Center of token approximately
                onSpawnFloatText(text, color, item.position.x + item.width/2, item.position.y);
            }
        }
    };

    const adjustHp = (amount: number) => {
        const newHp = Math.max(0, Math.min(state.maxHp, state.currentHp + amount));
        handleHpChange(String(newHp));
    };

    const handleConditionToggle = (condition: string) => {
        const has = state.conditions.includes(condition);
        const newConditions = has 
            ? state.conditions.filter(c => c !== condition)
            : [...state.conditions, condition];
        onUpdateState(state.instanceId, { conditions: newConditions });
    };

    return (
        <div className="w-80 bg-[var(--bg-secondary)]/80 border-l border-[var(--border-primary)] flex flex-col h-full flex-shrink-0 shadow-2xl z-30">
            <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/30">
                <h3 className="font-medieval text-2xl text-[var(--accent-primary)] truncate">{state.name}</h3>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-bold">{item.type}</p>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-[var(--border-secondary)]">
                {/* Vitals */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="col-span-3 flex gap-2 items-center bg-[var(--bg-tertiary)] p-2 rounded-lg border border-[var(--border-secondary)]">
                        <div className="flex flex-col items-center justify-center w-1/3 border-r border-[var(--border-secondary)] pr-2">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Hit Points</span>
                            <div className="flex items-baseline gap-1">
                                <input 
                                    type="number" 
                                    value={state.currentHp} 
                                    onChange={e => handleHpChange(e.target.value)}
                                    className="w-12 bg-transparent text-xl font-bold text-right focus:outline-none focus:text-[var(--accent-primary)]"
                                />
                                <span className="text-sm text-[var(--text-muted)]">/ {state.maxHp}</span>
                            </div>
                        </div>
                        <div className="flex-grow grid grid-cols-4 gap-1">
                            <button onClick={() => adjustHp(-1)} className="bg-red-900/50 text-red-200 rounded hover:bg-red-800 text-xs font-bold border border-red-800">-1</button>
                            <button onClick={() => adjustHp(-5)} className="bg-red-900/50 text-red-200 rounded hover:bg-red-800 text-xs font-bold border border-red-800">-5</button>
                            <button onClick={() => adjustHp(1)} className="bg-green-900/50 text-green-200 rounded hover:bg-green-800 text-xs font-bold border border-green-800">+1</button>
                            <button onClick={() => adjustHp(5)} className="bg-green-900/50 text-green-200 rounded hover:bg-green-800 text-xs font-bold border border-green-800">+5</button>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-tertiary)] p-2 rounded border border-[var(--border-secondary)]">
                        <div className="flex items-center justify-center gap-1 text-[var(--text-muted)] text-[10px] font-bold uppercase mb-1"><ShieldIcon className="w-3 h-3"/> AC</div>
                        <input 
                            type="number" 
                            value={state.ac} 
                            onChange={e => onUpdateState(state.instanceId, { ac: parseInt(e.target.value) || 10 })}
                            className="w-full bg-transparent text-center font-bold focus:outline-none text-lg"
                        />
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-2 rounded border border-[var(--border-secondary)]">
                         <div className="flex items-center justify-center gap-1 text-[var(--text-muted)] text-[10px] font-bold uppercase mb-1">Init</div>
                        <input 
                            type="number" 
                            value={state.initiative} 
                            onChange={e => onUpdateState(state.instanceId, { initiative: parseInt(e.target.value) || 0 })}
                            className="w-full bg-transparent text-center font-bold focus:outline-none text-[var(--accent-primary)] text-lg"
                        />
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-2 rounded border border-[var(--border-secondary)] flex items-center justify-center">
                        <button className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase font-bold">Edit</button>
                    </div>
                </div>

                {/* Dice Roller */}
                <div>
                    <h4 className="font-bold text-xs text-[var(--text-muted)] uppercase mb-2 border-b border-[var(--border-secondary)] pb-1">Actions & Rolls</h4>
                    <SmartDiceRoller activeCombatant={combatant} onRoll={onRoll} />
                </div>

                {/* Conditions */}
                <div>
                    <h4 className="font-bold text-xs text-[var(--text-muted)] uppercase mb-2 border-b border-[var(--border-secondary)] pb-1">Conditions</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {CONDITIONS_LIST.map(c => (
                            <button 
                                key={c} 
                                onClick={() => handleConditionToggle(c)}
                                className={`px-2 py-1 text-[10px] rounded border transition-colors ${state.conditions.includes(c) ? 'bg-red-900 border-red-500 text-white shadow-sm' : 'bg-[var(--bg-primary)] border-[var(--border-secondary)] text-[var(--text-muted)] hover:border-[var(--text-secondary)] hover:text-[var(--text-secondary)]'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Roll History Snippet */}
                 {history.length > 0 && (
                    <div className="border-t border-[var(--border-secondary)] pt-4">
                         <h4 className="font-bold text-xs text-[var(--text-muted)] uppercase mb-2">Recent Rolls</h4>
                         <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                             {history.slice(0, 5).map(roll => (
                                 <div key={roll.id} className="bg-[var(--bg-primary)]/50 p-2 rounded text-xs border-l-2" style={{borderColor: roll.isCrit ? '#22c55e' : roll.isFumble ? '#ef4444' : 'gray'}}>
                                     <div className="flex justify-between font-bold">
                                         <span className="truncate pr-2">{roll.title}</span>
                                         <span className={`text-[var(--accent-primary)] ${roll.isCrit ? 'text-green-400' : roll.isFumble ? 'text-red-400' : ''}`}>{roll.total}</span>
                                     </div>
                                     <div className="text-[var(--text-muted)] text-[10px]">{roll.formula}</div>
                                 </div>
                             ))}
                         </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

// Helper to find data reference
const findEntityData = (type: DraggableEntityType, id: string, lists: { characters: Character[], npcs: NPC[], monsters: Monster[] }) => {
    if (type === 'character') return lists.characters.find(c => c.id === id);
    if (type === 'npc') return lists.npcs.find(n => n.id === id);
    if (type === 'monster') return lists.monsters.find(m => m.id === id);
    return undefined;
}

// --- MAIN MANAGER COMPONENT ---

const EncounterManager: React.FC<{ 
    characters: Character[], npcs: NPC[], monsters: Monster[], isLoading: boolean 
}> = ({ characters, npcs, monsters, isLoading }) => {
    
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
    const [rehydrated, setRehydrated] = useState(false);
    const { addToast } = useToast();

    // Rehydrate effect
    useEffect(() => {
        if (isLoading || rehydrated) return;
        
        const saved = localStorage.getItem('dm-encounter-items');
        if (saved) {
            try {
                const stored: any[] = JSON.parse(saved);
                const hydrated = stored.map(item => {
                    let data = item.data;
                    // If data is missing (new storage format) or incomplete, try to fetch from props
                    if (!data || !data.name) {
                         if (item.referenceId) {
                            data = findEntityData(item.type, item.referenceId, { characters, npcs, monsters });
                         } else if (item.data && item.data.id) {
                             // Legacy fallback
                             data = findEntityData(item.type, item.data.id, { characters, npcs, monsters });
                         }
                    }
                    
                    // If still no data, skip (item was likely deleted from library)
                    if (!data) return null;

                    return {
                        ...item,
                        data
                    };
                }).filter(Boolean) as PlacedItem[];
                setPlacedItems(hydrated);
            } catch (e) {
                console.error("Failed to load encounter items", e);
            }
        }
        setRehydrated(true);
    }, [isLoading, rehydrated, characters, npcs, monsters]);

    // Save effect
    useEffect(() => {
        if (!rehydrated) return;
        
        const toStore = placedItems.map(item => ({
            instanceId: item.instanceId,
            type: item.type,
            referenceId: item.data.id,
            position: item.position,
            width: item.width,
            height: item.height
        }));
        
        try {
            localStorage.setItem('dm-encounter-items', JSON.stringify(toStore));
        } catch (e) {
            console.error("LocalStorage Error", e);
        }
    }, [placedItems, rehydrated]);

    // Map of instanceId -> CombatantState
    const [combatData, setCombatData] = useState<Record<string, CombatantState>>({});
    const [floatTexts, setFloatTexts] = useState<FloatingText[]>([]);
    
    const [isMeasureMode, setIsMeasureMode] = useState(false);
    const [measureLines, setMeasureLines] = useState<MeasureLine[]>([]);
    const [activeMeasurement, setActiveMeasurement] = useState<MeasureLine | null>(null);

    const [snapToGrid, setSnapToGrid] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Combat Flow State
    const [activeCombatantId, setActiveCombatantId] = useState<string | null>(null);
    const [round, setRound] = useState(1);
    const [turnOrder, setTurnOrder] = useState<string[]>([]);
    const [combatActive, setCombatActive] = useState(false);
    const [diceHistory, setDiceHistory] = useState<RollResult[]>([]);

    // Initialize combat data for new items
    useEffect(() => {
        if (!rehydrated) return;
        const newData = { ...combatData };
        let changed = false;
        placedItems.forEach(item => {
            if (!newData[item.instanceId]) {
                const data = item.data as any;
                let hp = data.currentHp || data.hp || 10;
                if (typeof hp === 'string') hp = parseInt(hp.split(' ')[0]) || 10;
                let max = data.maxHp || data.hp || 10;
                if (typeof max === 'string') max = parseInt(max.split(' ')[0]) || 10;

                const dex = data.abilityScores?.dex || 10;
                const dexMod = Math.floor((dex - 10) / 2);

                newData[item.instanceId] = {
                    instanceId: item.instanceId,
                    name: data.name,
                    initiative: Math.floor(Math.random() * 20) + 1 + dexMod,
                    currentHp: hp,
                    maxHp: max,
                    ac: data.ac || 10,
                    conditions: []
                };
                changed = true;
            }
        });
        if (changed) setCombatData(newData);
    }, [placedItems, rehydrated]);

    // Cleanup float text
    useEffect(() => {
        const interval = setInterval(() => {
            setFloatTexts(prev => prev.map(t => ({...t, opacity: t.opacity - 0.05})).filter(t => t.opacity > 0));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleSpawnFloatText = (text: string, color: string, x: number, y: number) => {
        const newText: FloatingText = {
            id: String(Date.now() + Math.random()),
            x, y, text, color, opacity: 1
        };
        setFloatTexts(prev => [...prev, newText]);
    };
    
    const toggleMeasureMode = () => {
        setIsMeasureMode(prev => {
            if (prev) { // Turning it OFF
                setActiveMeasurement(null);
            }
            return !prev;
        });
    };

    const handleMeasureStart = (x: number, y: number, attachedTo?: string) => {
        if (!isMeasureMode) return;
        
        // Snap start point if attached
        let startX = x;
        let startY = y;
        if (attachedTo) {
            const item = placedItems.find(p => p.instanceId === attachedTo);
            if (item) {
                startX = item.position.x + item.width / 2;
                startY = item.position.y + item.height / 2;
            }
        }

        setActiveMeasurement({
            id: String(Date.now()),
            start: { x: startX, y: startY, attachedTo },
            end: { x: startX, y: startY }, // Initially same point
        });
    };

    const handleMeasureMove = (x: number, y: number) => {
        if (!isMeasureMode || !activeMeasurement) return;

        // Check for snapping to cards while dragging
        let endX = x;
        let endY = y;
        let attachedTo = undefined;

        for (const item of placedItems) {
            if (x >= item.position.x && x <= item.position.x + item.width &&
                y >= item.position.y && y <= item.position.y + item.height) {
                endX = item.position.x + item.width / 2;
                endY = item.position.y + item.height / 2;
                attachedTo = item.instanceId;
                break; // Snap to first found
            }
        }

        setActiveMeasurement(prev => prev ? ({
            ...prev,
            end: { x: endX, y: endY, attachedTo }
        }) : null);
    };

    const handleMeasureEnd = (x: number, y: number, attachedTo?: string) => {
        if (!isMeasureMode || !activeMeasurement) return;

        // If explicit attachedTo is provided (from mouseUp on card), use it
        let finalLine = { ...activeMeasurement };
        if (attachedTo) {
             const item = placedItems.find(p => p.instanceId === attachedTo);
             if (item) {
                 finalLine.end.x = item.position.x + item.width / 2;
                 finalLine.end.y = item.position.y + item.height / 2;
                 finalLine.end.attachedTo = attachedTo;
             }
        }

        // Don't add very short lines (clicks) unless they connect two cards
        const dist = Math.sqrt(Math.pow(finalLine.end.x - finalLine.start.x, 2) + Math.pow(finalLine.end.y - finalLine.start.y, 2));
        const isConnecting = finalLine.start.attachedTo && finalLine.end.attachedTo && finalLine.start.attachedTo !== finalLine.end.attachedTo;
        
        if (dist > 10 || isConnecting) {
            setMeasureLines(prev => [...prev, finalLine]);
        }
        setActiveMeasurement(null);
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMeasureMode || !canvasRef.current || e.button !== 0) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        handleMeasureStart(x, y);
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMeasureMode || !canvasRef.current) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        handleMeasureMove(x, y);
    };

    const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMeasureMode || e.button !== 0) return;
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        handleMeasureEnd(x, y);
    };

    // Card Event Handlers for Measurement
    const onCardMeasureStart = (id: string, e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        handleMeasureStart(0, 0, id);
    };

    const onCardMeasureEnd = (id: string, e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        handleMeasureEnd(0, 0, id);
    };

    const updateLineManualText = (id: string, text: string) => {
        setMeasureLines(prev => prev.map(l => l.id === id ? { ...l, manualText: text } : l));
    };

    const deleteMeasureLine = (id: string) => {
        setMeasureLines(prev => prev.filter(l => l.id !== id));
    };


    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedItemJson = e.dataTransfer.getData('application/json');
        
        if (droppedItemJson) {
            const droppedItem: DraggableItem = JSON.parse(droppedItemJson);
            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (!canvasRect) return;

            let x = e.clientX - canvasRect.left - (CARD_WIDTH / 2);
            let y = e.clientY - canvasRect.top - (CARD_HEIGHT / 2);

            if (snapToGrid) {
                x = Math.round(x / SNAP_SIZE) * SNAP_SIZE;
                y = Math.round(y / SNAP_SIZE) * SNAP_SIZE;
            }

            const newPlacedItem: PlacedItem = {
                instanceId: `${Date.now()}-${Math.random()}`,
                type: droppedItem.type,
                data: droppedItem.data,
                position: { x, y },
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
            };
            setPlacedItems(prev => [...prev, newPlacedItem]);
        }
    };
    
    const handleUpdateItem = useCallback((id: string, updates: Partial<Pick<PlacedItem, 'position' | 'width' | 'height'>>) => {
        setPlacedItems(prev => prev.map(item => {
            if (item.instanceId === id) {
                const updatedItem = { ...item, ...updates };
                
                // Update Attached Lines
                setMeasureLines(currentLines => currentLines.map(line => {
                    const centerX = updatedItem.position.x + updatedItem.width / 2;
                    const centerY = updatedItem.position.y + updatedItem.height / 2;
                    let newLine = { ...line };
                    
                    if (line.start.attachedTo === id) {
                        newLine.start = { ...newLine.start, x: centerX, y: centerY };
                    }
                    if (line.end.attachedTo === id) {
                        newLine.end = { ...newLine.end, x: centerX, y: centerY };
                    }
                    return newLine;
                }));

                return updatedItem;
            }
            return item;
        }));
    }, []);

    const handleRemoveItem = useCallback((id: string) => {
        setPlacedItems(prev => prev.filter(item => item.instanceId !== id));
        
        setMeasureLines(prev => prev.map(line => ({
            ...line,
            start: { ...line.start, attachedTo: line.start.attachedTo === id ? undefined : line.start.attachedTo },
            end: { ...line.end, attachedTo: line.end.attachedTo === id ? undefined : line.end.attachedTo }
        })));

        const newCombatData = { ...combatData };
        delete newCombatData[id];
        setCombatData(newCombatData);
        setTurnOrder(prev => prev.filter(tid => tid !== id));
        if (activeCombatantId === id) setActiveCombatantId(null);
        addToast('Combatant removed.', 'info');
    }, [combatData, activeCombatantId]);

    const handleClearCanvas = () => {
        setPlacedItems([]);
        setCombatData({});
        setTurnOrder([]);
        setMeasureLines([]);
        setCombatActive(false);
        setActiveCombatantId(null);
        addToast('Encounter cleared.', 'info');
    };
    
    const handleStartCombat = () => {
        const sortedIds = Object.values(combatData)
            .sort((a, b) => b.initiative - a.initiative)
            .map(c => c.instanceId);
        
        setTurnOrder(sortedIds);
        setCombatActive(true);
        setRound(1);
        if (sortedIds.length > 0) setActiveCombatantId(sortedIds[0]);
        addToast('Combat started! Initiative rolled.', 'success');
    };

    const handleNextTurn = () => {
        if (turnOrder.length === 0) return;
        const currentIndex = activeCombatantId ? turnOrder.indexOf(activeCombatantId) : -1;
        const nextIndex = (currentIndex + 1) % turnOrder.length;
        if (nextIndex === 0) setRound(r => r + 1);
        setActiveCombatantId(turnOrder[nextIndex]);
    };

    const handleUpdateCombatant = (id: string, updates: Partial<CombatantState>) => {
        setCombatData(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
    };
    
    const handleManualRoll = (result: RollResult) => {
        setDiceHistory(prev => [result, ...prev]);
    };

    // Export Feature
    const handleExport = async () => {
        if (!canvasRef.current || typeof htmlToImage === 'undefined') return;
        setIsExporting(true);
        try {
            document.body.classList.add('exporting-encounter');
            const dataUrl = await htmlToImage.toPng(canvasRef.current, {
                quality: 0.98,
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim(),
                pixelRatio: 2,
                filter: (node) => {
                    if (node instanceof Element) {
                        return !node.classList.contains('delete-btn');
                    }
                    return true;
                },
            });
            const link = document.createElement('a');
            link.download = 'dnd-encounter-scene.png';
            link.href = dataUrl;
            link.click();
            addToast('Encounter map exported successfully.', 'success');
        } catch (error) {
            console.error('Failed to export encounter image:', error);
            addToast('Failed to export encounter map.', 'error');
        } finally {
            setIsExporting(false);
            document.body.classList.remove('exporting-encounter');
        }
    };

    if (isLoading && !rehydrated) {
        return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading Encounter Data..." /></div>;
    }

    const activeCombatant = activeCombatantId && placedItems.find(i => i.instanceId === activeCombatantId);
    const activeCombatantState = activeCombatantId && combatData[activeCombatantId];

    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            <style>{`.exporting-encounter .group:hover { transform: none; box-shadow: none; } .exporting-encounter .delete-btn { display: none; }`}</style>
            
            <EncounterSidebar characters={characters} npcs={npcs} monsters={monsters} />
            
            <main className="flex-1 flex flex-col relative min-h-0">
                {/* Combat Ribbon (Visible only when combat active) */}
                {combatActive && (
                    <InitiativeRibbon 
                        combatData={combatData} 
                        turnOrder={turnOrder} 
                        activeCombatantId={activeCombatantId}
                        placedItems={placedItems}
                        onSelect={setActiveCombatantId}
                    />
                )}

                {/* Top Control Bar */}
                <div className="flex flex-wrap justify-between items-center p-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 flex-shrink-0 gap-2 z-10 shadow-sm">
                    <div className="flex items-center gap-2">
                        {!combatActive ? (
                             <Button onClick={handleStartCombat} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 border-green-500 text-white shadow-md">
                                <PlayIcon className="w-4 h-4"/> Roll Initiative
                             </Button>
                        ) : (
                            <>
                                <div className="bg-[var(--bg-primary)] px-3 py-1.5 rounded border border-[var(--border-secondary)] font-bold text-[var(--accent-primary)] font-medieval text-lg">
                                    Round {round}
                                </div>
                                <Button onClick={handleNextTurn} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border-blue-500 text-white">
                                    Next Turn
                                </Button>
                                <Button onClick={() => setCombatActive(false)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                    End Combat
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex gap-2 items-center">
                         <Button onClick={() => setSnapToGrid(prev => !prev)} variant={snapToGrid ? 'default' : 'ghost'} size="sm" className="flex items-center gap-2" title="Snap to Grid"><MapIcon className="h-4 w-4" /></Button>
                         <Button onClick={toggleMeasureMode} variant={isMeasureMode ? 'default' : 'ghost'} size="sm" className={`flex items-center gap-2 ${isMeasureMode ? 'ring-2 ring-[var(--accent-primary)]' : ''}`}><RulerIcon className="h-4 w-4" /> {isMeasureMode ? 'Measuring' : 'Measure'}</Button>
                         {measureLines.length > 0 && isMeasureMode && (
                             <Button onClick={() => setMeasureLines([])} variant="ghost" size="sm" className="text-[var(--bg-destructive)] hover:bg-[var(--bg-destructive)]/10">Clear Lines</Button>
                         )}
                         <div className="h-6 w-px bg-[var(--border-primary)] mx-1"></div>
                         <Button onClick={handleClearCanvas} variant="ghost" size="sm" className="text-red-400 hover:text-red-500"><TrashIcon className="h-4 w-4" /></Button>
                         <Button onClick={handleExport} variant="ghost" size="sm"><ExportIcon className="h-4 w-4" /></Button>
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-grow relative overflow-hidden flex">
                    {/* The Grid */}
                    <div
                        ref={canvasRef}
                        className={`flex-grow h-full relative overflow-auto ${isMeasureMode ? 'cursor-crosshair' : ''}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => { if (isMeasureMode) return; setActiveCombatantId(null); }}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        style={{ 
                            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`, 
                            backgroundImage: 'radial-gradient(var(--border-secondary) 1px, transparent 1px)',
                            backgroundColor: 'var(--bg-primary-alt)' 
                        }}
                    >
                        {placedItems.map(item => (
                            <EncounterCard 
                                key={item.instanceId} 
                                item={item} 
                                combatState={combatData[item.instanceId]}
                                isActive={activeCombatantId === item.instanceId}
                                onUpdate={handleUpdateItem} 
                                onRemove={handleRemoveItem} 
                                onCardClick={(id) => { if (!isMeasureMode) setActiveCombatantId(id); }}
                                isMeasureMode={isMeasureMode}
                                onMeasureStart={onCardMeasureStart}
                                onMeasureEnd={onCardMeasureEnd}
                                snapToGrid={snapToGrid}
                            />
                        ))}
                        
                        {/* Measurements */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" style={{overflow: 'visible'}}>
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-primary)" />
                                </marker>
                            </defs>
                            {[...measureLines, activeMeasurement].filter(Boolean).map((line) => {
                                if (!line) return null;
                                return (
                                    <g key={line.id}>
                                        <line
                                            x1={line.start.x}
                                            y1={line.start.y}
                                            x2={line.end.x}
                                            y2={line.end.y}
                                            stroke="var(--accent-primary)"
                                            strokeWidth="2"
                                            strokeDasharray="6,4"
                                            strokeLinecap="round"
                                            markerEnd="url(#arrowhead)"
                                        />
                                        <circle cx={line.start.x} cy={line.start.y} r="4" fill="var(--accent-primary)" />
                                        <circle cx={line.end.x} cy={line.end.y} r="4" fill="var(--accent-primary)" />
                                    </g>
                                )
                            })}
                        </svg>

                        {/* Measurement Labels */}
                        {measureLines.map(line => (
                            <MeasurementLabel 
                                key={line.id} 
                                line={line} 
                                onChange={updateLineManualText} 
                                onDelete={deleteMeasureLine} 
                            />
                        ))}
                        
                        <FloatingTextDisplay items={floatTexts} />
                    </div>

                    {/* Right Panel: Active Stats & Dice */}
                    {activeCombatant && activeCombatantState ? (
                        <ActiveEntityPanel 
                            combatant={{item: activeCombatant, state: activeCombatantState}} 
                            onUpdateState={handleUpdateCombatant}
                            onRoll={handleManualRoll}
                            history={diceHistory}
                            onSpawnFloatText={handleSpawnFloatText}
                        />
                    ) : (
                        <div className="hidden lg:flex w-80 bg-[var(--bg-secondary)]/30 border-l border-[var(--border-primary)] items-center justify-center text-[var(--text-muted)] p-8 text-center shadow-inner">
                            <div>
                                <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                                <p className="font-bold text-lg">Command Center</p>
                                <p className="text-sm mt-2">Select a token to manage stats, roll attacks, and track conditions.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EncounterManager;
