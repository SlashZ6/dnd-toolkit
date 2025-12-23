
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Character, NPC, Monster, CanvasToken, CanvasDrawing, CanvasAsset, SavedMap } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import { useToast } from './ui/Toast';
import { BrushIcon, EraserIcon, UndoIcon, RedoIcon, ZoomInIcon, ZoomOutIcon, SquareIcon, CircleIcon, WallIcon, HandIcon, MousePointerIcon, LibraryIcon, TransformIcon } from './icons/CanvasIcons';
import { RulerIcon } from './icons/RulerIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MonsterIcon } from './icons/MonsterIcon';
import { SearchIcon } from './icons/SearchIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ImportIcon } from './icons/ImportIcon';
import { compressImage } from '../utils/imageUtils';

// Import New Systems
import { AssetRenderer, ASSET_CATEGORIES } from './canvas/ProceduralAssets';
import { WeatherSystem } from './canvas/WeatherSystem';
import { useMaps } from '../hooks/useMaps';

interface CanvasViewProps {
    characters: Character[];
    npcs: NPC[];
    monsters: Monster[];
    onBroadcast: (payload: any) => void;
}

type Tool = 'select' | 'pan' | 'brush' | 'wall' | 'rect' | 'circle' | 'erase' | 'transform';

interface HistoryState {
    drawings: CanvasDrawing[];
    tokens: CanvasToken[];
    assets: CanvasAsset[];
}

interface TransformState {
    type: 'rotate' | 'scale';
    startAngle: number;
    startDist: number;
    initialW: number;
    initialH: number;
    initialRot: number;
    centerX: number;
    centerY: number;
}

const GRID_SIZE = 50;
const TOKEN_SIZE = 60; 
const CANVAS_SIZE = 4000;
const COLORS = ['#e2e8f0', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];
const STROKE_WIDTHS = [2, 4, 8, 12];
const WALL_TYPES = ['stone_wall', 'wood_wall', 'brick_wall'];

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- Library Sidebar ---
const CanvasLibrary: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    characters: Character[];
    npcs: NPC[];
    monsters: Monster[];
    setWeather: (w: any) => void;
    currentWeather: string;
    assets: CanvasAsset[];
    onUpdateAssets: (assets: CanvasAsset[]) => void;
    onSelectAsset: (id: string) => void;
    selectedAssetId: string | null;
    onUploadImage: () => void;
}> = ({ isOpen, onClose, characters, npcs, monsters, setWeather, currentWeather, assets, onUpdateAssets, onSelectAsset, selectedAssetId, onUploadImage }) => {
    const [filter, setFilter] = useState('');
    const [tab, setTab] = useState<'tokens' | 'assets' | 'weather' | 'layers'>('assets');
    
    const onDragStart = (e: React.DragEvent, type: string, data: any) => {
        const payload = { 
            type, 
            id: data.id || generateId(), 
            name: data.name,
            assetType: type === 'asset' ? data.type : undefined, // specific asset type
            width: data.width,
            height: data.height,
            imageUrl: data.imageUrl
        };
        e.dataTransfer.setData('application/json', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const filterList = (list: any[]) => list.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));

    // Layer Management Functions
    const moveLayer = (index: number, direction: 'up' | 'down') => {
        const newAssets = [...assets];
        if (direction === 'up' && index < newAssets.length - 1) {
            [newAssets[index], newAssets[index + 1]] = [newAssets[index + 1], newAssets[index]];
        } else if (direction === 'down' && index > 0) {
            [newAssets[index], newAssets[index - 1]] = [newAssets[index - 1], newAssets[index]];
        }
        onUpdateAssets(newAssets);
    };
    
    const deleteLayer = (id: string) => {
        onUpdateAssets(assets.filter(a => a.id !== id));
    };

    return (
        <div 
            className={`absolute top-0 left-0 bottom-0 w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] shadow-2xl z-30 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
        >
            <div className="p-4 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-primary)]">
                <h3 className="font-medieval text-xl text-[var(--accent-primary)]">Library</h3>
                <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white">&times;</button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/30">
                <button onClick={() => setTab('assets')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${tab === 'assets' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>Assets</button>
                <button onClick={() => setTab('tokens')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${tab === 'tokens' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>Tokens</button>
                <button onClick={() => setTab('layers')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${tab === 'layers' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>Layers</button>
                <button onClick={() => setTab('weather')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${tab === 'weather' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>Weather</button>
            </div>

            {/* Filter (only for assets/tokens) */}
            {tab !== 'weather' && tab !== 'layers' && (
                <div className="p-2 border-b border-[var(--border-primary)]">
                    <div className="relative">
                        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded pl-8 pr-2 py-1 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto p-2 space-y-4 custom-scrollbar">
                
                {/* --- ASSETS TAB --- */}
                {tab === 'assets' && (
                    <>
                        <div className="mb-4 p-2 bg-[var(--bg-primary)] rounded border border-dashed border-[var(--border-secondary)]">
                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-2 text-center">Custom Image</p>
                            <div 
                                draggable
                                onDragStart={(e) => onDragStart(e, 'asset', { type: 'custom_image_placeholder', name: 'New Image', width: 200, height: 200 })}
                                onClick={onUploadImage}
                                className="w-full h-12 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded flex items-center justify-center cursor-pointer active:cursor-grabbing gap-2 group"
                            >
                                <div className="bg-[var(--accent-primary)] text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-lg shadow-sm">+</div>
                                <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Click or Drag</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 text-center">Click to browse or drag onto canvas</p>
                        </div>

                        {Object.entries(ASSET_CATEGORIES).map(([category, items]) => (
                            <div key={category}>
                                <div className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2 px-1">{category}</div>
                                <div className="grid grid-cols-3 gap-2">
                                     {items.filter(i => i.includes(filter.toLowerCase()) || filter === '').map(assetType => (
                                         <div 
                                            key={assetType}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, 'asset', { type: assetType, name: assetType, width: 100, height: 100 })}
                                            className="aspect-square bg-[var(--bg-primary)] rounded border border-[var(--border-secondary)] hover:border-[var(--accent-primary)] cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-1 group"
                                         >
                                             <div className="w-10 h-10 overflow-visible flex items-center justify-center">
                                                 <AssetRenderer type={assetType} width={40} height={40} />
                                             </div>
                                             <span className="text-[9px] mt-1 text-[var(--text-muted)] truncate w-full text-center group-hover:text-white">{assetType.replace(/_/g, ' ')}</span>
                                         </div>
                                     ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* --- TOKENS TAB --- */}
                {tab === 'tokens' && (
                    <>
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase text-blue-400 px-2"><UserCircleIcon className="w-4 h-4"/> Characters</div>
                            <div className="space-y-1">
                                {filterList(characters).map(c => (
                                    <div key={c.id} draggable onDragStart={(e) => onDragStart(e, 'character', c)} className="p-2 bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] rounded cursor-grab active:cursor-grabbing border border-transparent hover:border-blue-500/30 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-black/50 flex-shrink-0">
                                            {c.appearanceImage ? <img src={c.appearanceImage} className="w-full h-full object-cover pointer-events-none" /> : <div className="w-full h-full flex items-center justify-center text-xs">?</div>}
                                        </div>
                                        <span className="truncate text-sm">{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase text-amber-400 px-2 mt-4"><UsersIcon className="w-4 h-4"/> NPCs</div>
                            <div className="space-y-1">
                                {filterList(npcs).map(n => (
                                    <div key={n.id} draggable onDragStart={(e) => onDragStart(e, 'npc', n)} className="p-2 bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] rounded cursor-grab active:cursor-grabbing border border-transparent hover:border-amber-500/30 flex items-center gap-2">
                                         <div className="w-8 h-8 rounded-full overflow-hidden bg-black/50 flex-shrink-0">
                                            {n.image ? <img src={n.image} className="w-full h-full object-cover pointer-events-none" /> : <div className="w-full h-full flex items-center justify-center text-xs">?</div>}
                                        </div>
                                        <span className="truncate text-sm">{n.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase text-red-400 px-2 mt-4"><MonsterIcon className="w-4 h-4"/> Monsters</div>
                            <div className="space-y-1">
                                {filterList(monsters).map(m => (
                                    <div key={m.id} draggable onDragStart={(e) => onDragStart(e, 'monster', m)} className="p-2 bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] rounded cursor-grab active:cursor-grabbing border border-transparent hover:border-red-500/30 flex items-center gap-2">
                                         <div className="w-8 h-8 rounded-full overflow-hidden bg-black/50 flex-shrink-0">
                                            {m.image ? <img src={m.image} className="w-full h-full object-cover pointer-events-none" /> : <div className="w-full h-full flex items-center justify-center text-xs">?</div>}
                                        </div>
                                        <span className="truncate text-sm">{m.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* --- LAYERS TAB --- */}
                {tab === 'layers' && (
                    <div className="space-y-1">
                        <div className="text-[10px] text-[var(--text-muted)] italic px-2 mb-2">Assets are rendered bottom-to-top.</div>
                        {[...assets].reverse().map((asset, i) => {
                             // index in original array is length - 1 - i
                             const originalIndex = assets.length - 1 - i;
                             const isSelected = selectedAssetId === asset.id;
                             
                             return (
                                <div 
                                    key={asset.id} 
                                    onClick={() => onSelectAsset(asset.id)}
                                    className={`flex items-center justify-between p-2 rounded border cursor-pointer ${isSelected ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]' : 'bg-[var(--bg-primary)] border-transparent hover:bg-[var(--bg-tertiary)]'}`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-black/20 rounded">
                                            <AssetRenderer type={asset.type} width={20} height={20} imageUrl={asset.imageUrl} />
                                        </div>
                                        <span className="text-xs truncate">{asset.label || asset.type.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100">
                                        <button onClick={(e) => { e.stopPropagation(); moveLayer(originalIndex, 'up'); }} className="p-1 hover:text-white" title="Move Up">↑</button>
                                        <button onClick={(e) => { e.stopPropagation(); moveLayer(originalIndex, 'down'); }} className="p-1 hover:text-white" title="Move Down">↓</button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteLayer(asset.id); }} className="p-1 hover:text-red-400" title="Delete">&times;</button>
                                    </div>
                                </div>
                             )
                        })}
                        {assets.length === 0 && <div className="text-xs text-center text-[var(--text-muted)] py-4">No assets on canvas.</div>}
                    </div>
                )}

                {/* --- WEATHER TAB --- */}
                {tab === 'weather' && (
                    <div className="space-y-2">
                        <div className="text-xs text-[var(--text-muted)] mb-4">Set the atmosphere for the scene.</div>
                        {['none', 'rain', 'snow', 'embers', 'fog'].map(w => (
                            <button
                                key={w}
                                onClick={() => setWeather(w)}
                                className={`w-full text-left p-3 rounded border transition-all ${currentWeather === w ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold' : 'bg-[var(--bg-primary)] border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                            >
                                <div className="capitalize">{w}</div>
                                <div className="text-[10px] opacity-70 font-normal">
                                    {w === 'none' ? 'Clear skies' : w === 'rain' ? 'Heavy downpour' : w === 'snow' ? 'Gentle snowfall' : w === 'embers' ? 'Rising ash and heat' : 'Thick rolling mist'}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const CanvasView: React.FC<CanvasViewProps> = ({ characters, npcs, monsters, onBroadcast }) => {
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: -1500, y: -1500 });
    const [tool, setTool] = useState<Tool>('select');
    const [activeColor, setActiveColor] = useState(COLORS[0]);
    const [activeWidth, setActiveWidth] = useState(4);
    const [activeWallType, setActiveWallType] = useState('stone_wall'); 
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    
    // Canvas State
    const [tokens, setTokens] = useState<CanvasToken[]>([]);
    const [assets, setAssets] = useState<CanvasAsset[]>([]);
    const [drawings, setDrawings] = useState<CanvasDrawing[]>([]);
    const [weather, setWeather] = useState<'none' | 'rain' | 'snow' | 'embers' | 'fog'>('none');

    // Load Modal State
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

    // Drawing State
    const [currentPath, setCurrentPath] = useState<{x:number, y:number}[]>([]);
    const [tempShape, setTempShape] = useState<{start:{x:number, y:number}, end:{x:number, y:number}} | null>(null);
    
    // Transformation State
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const transformStateRef = useRef<TransformState | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pendingAssetDropRef = useRef<{x: number, y: number} | null>(null);

    // History
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const isSpacePressed = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const isDrawing = useRef(false);
    const draggedItemId = useRef<{id: string, type: 'token'|'asset'} | null>(null);
    
    const { addToast } = useToast();
    const { maps, deleteMap } = useMaps();

    // --- Save/Load LocalStorage (Auto-save) ---
    useEffect(() => {
        const saved = localStorage.getItem('dm-canvas-data-v2');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setTokens(data.tokens || []);
                setDrawings(data.drawings || []);
                setAssets(data.assets || []);
                setWeather(data.weather || 'none');
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('dm-canvas-data-v2', JSON.stringify({ tokens, drawings, assets, weather }));
    }, [tokens, drawings, assets, weather]);

    // Clear selection when tool changes
    useEffect(() => {
        if (tool !== 'transform') setSelectedAssetId(null);
    }, [tool]);

    // --- History ---
    const pushHistory = useCallback(() => {
        const newState = { tokens: [...tokens], drawings: [...drawings], assets: [...assets] };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        if (newHistory.length > 20) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [tokens, drawings, assets, history, historyIndex]);

    const undo = () => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setTokens(prevState.tokens);
            setDrawings(prevState.drawings);
            setAssets(prevState.assets);
            setHistoryIndex(historyIndex - 1);
            setSelectedAssetId(null);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setTokens(nextState.tokens);
            setDrawings(nextState.drawings);
            setAssets(nextState.assets);
            setHistoryIndex(historyIndex + 1);
            setSelectedAssetId(null);
        }
    };
    
    useEffect(() => {
        if (history.length === 0 && (tokens.length > 0 || drawings.length > 0 || assets.length > 0)) {
            pushHistory();
        }
    }, []); 

     // --- Keyboard Listeners ---
     useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
            if (e.code === 'Space' && !isSpacePressed.current) {
                isSpacePressed.current = true;
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedAssetId && tool === 'transform') {
                    pushHistory();
                    setAssets(prev => prev.filter(a => a.id !== selectedAssetId));
                    setSelectedAssetId(null);
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                isSpacePressed.current = false;
                isDragging.current = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [history, historyIndex, selectedAssetId, tool]);

    // --- Coord Utils ---
    const getWorldCoords = (e: React.MouseEvent | React.DragEvent) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - pan.x) / scale,
            y: (e.clientY - rect.top - pan.y) / scale
        };
    };
    
    const snap = (val: number) => Math.round(val / (GRID_SIZE / 2)) * (GRID_SIZE / 2);

    // --- Transformation Handlers ---
    const startTransform = (e: React.MouseEvent, type: 'rotate' | 'scale', asset: CanvasAsset) => {
        e.stopPropagation();
        e.preventDefault();
        const { x, y } = getWorldCoords(e);
        const centerX = asset.x + asset.width / 2;
        const centerY = asset.y + asset.height / 2;
        
        transformStateRef.current = {
            type,
            startAngle: Math.atan2(y - centerY, x - centerX),
            startDist: Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)),
            initialW: asset.width,
            initialH: asset.height,
            initialRot: asset.rotation || 0,
            centerX,
            centerY
        };
    };

    // --- Interaction Handlers ---

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const s = Math.exp(e.deltaY * -0.001);
        setScale(prev => Math.min(3, Math.max(0.2, prev * s)));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || isSpacePressed.current || tool === 'pan') {
            isDragging.current = true;
            dragStart.current = { x: e.clientX, y: e.clientY };
            e.preventDefault();
            return;
        }

        const { x, y } = getWorldCoords(e);
        
        if (tool === 'transform') {
             // Handle explicit transform interactions on handles is done via stopPropagation on handles
             // Check if clicking an asset to select it
             const clickedAsset = [...assets].reverse().find(a => 
                x >= a.x && x <= a.x + a.width && y >= a.y && y <= a.y + a.height
            );
            
            if (clickedAsset) {
                setSelectedAssetId(clickedAsset.id);
                // Also allow drag moving of asset in transform mode
                draggedItemId.current = { id: clickedAsset.id, type: 'asset' };
                isDragging.current = true;
            } else {
                setSelectedAssetId(null);
            }
            return;
        }

        if (tool === 'select') {
            // Check tokens first (top layer)
            const clickedToken = [...tokens].reverse().find(t => {
                const dist = Math.sqrt(Math.pow(t.x - x, 2) + Math.pow(t.y - y, 2));
                return dist <= t.size;
            });
            
            if (clickedToken) {
                draggedItemId.current = { id: clickedToken.id, type: 'token' };
                isDragging.current = true;
                return;
            }

            // Check assets (middle layer)
            const clickedAsset = [...assets].reverse().find(a => 
                x >= a.x && x <= a.x + a.width && y >= a.y && y <= a.y + a.height
            );

            if (clickedAsset) {
                draggedItemId.current = { id: clickedAsset.id, type: 'asset' };
                isDragging.current = true;
            }

        } else if (tool === 'erase') {
             const eraserRadius = 20 / scale;
             
             // Try erase tokens
             const tokenToRemove = tokens.find(t => Math.sqrt(Math.pow(t.x - x, 2) + Math.pow(t.y - y, 2)) <= t.size);
             if(tokenToRemove) {
                 pushHistory();
                 setTokens(prev => prev.filter(t => t.id !== tokenToRemove.id));
                 return;
             }
             
             // Try erase assets
             const assetToRemove = assets.find(a => x >= a.x && x <= a.x + a.width && y >= a.y && y <= a.y + a.height);
             if (assetToRemove) {
                 pushHistory();
                 setAssets(prev => prev.filter(a => a.id !== assetToRemove.id));
                 return;
             }
             
             // Try erase drawings
             const drawingToRemove = drawings.find(d => {
                 if (d.type === 'path' || d.type === 'wall') {
                     return d.points.some(p => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) <= eraserRadius * 2);
                 } else if (d.type === 'circle' && d.x !== undefined && d.y !== undefined && d.radius !== undefined) {
                     const dist = Math.sqrt(Math.pow(d.x - x, 2) + Math.pow(d.y - y, 2));
                     return dist < d.radius + eraserRadius;
                 } else if (d.type === 'rect' && d.x !== undefined && d.y !== undefined && d.width !== undefined && d.height !== undefined) {
                     return x >= d.x && x <= d.x + d.width && y >= d.y && y <= d.y + d.height;
                 }
                 return false;
             });
             
             if(drawingToRemove) {
                 pushHistory();
                 setDrawings(prev => prev.filter(d => d.id !== drawingToRemove.id));
             }

        } else if (tool === 'brush') {
            isDrawing.current = true;
            setCurrentPath([{x, y}]);
        } else if (tool === 'wall') {
            isDrawing.current = true;
            setTempShape({ start: {x, y}, end: {x, y} });
        } else if (tool === 'rect' || tool === 'circle') {
            isDrawing.current = true;
            setTempShape({ start: {x, y}, end: {x, y} });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const { x, y } = getWorldCoords(e);

        if (transformStateRef.current && selectedAssetId) {
            // Handle Transformation
            const ts = transformStateRef.current;
            
            if (ts.type === 'rotate') {
                const currentAngle = Math.atan2(y - ts.centerY, x - ts.centerX);
                const deltaAngle = (currentAngle - ts.startAngle) * (180 / Math.PI);
                const newRotation = (ts.initialRot + deltaAngle) % 360;
                
                setAssets(prev => prev.map(a => a.id === selectedAssetId ? { ...a, rotation: newRotation } : a));
            } else if (ts.type === 'scale') {
                const currentDist = Math.sqrt(Math.pow(x - ts.centerX, 2) + Math.pow(y - ts.centerY, 2));
                const scaleFactor = currentDist / ts.startDist;
                
                const newWidth = Math.max(20, ts.initialW * scaleFactor);
                const newHeight = Math.max(20, ts.initialH * scaleFactor);
                
                // Adjust x/y to keep center roughly same (for center scaling feel)
                const newX = ts.centerX - newWidth / 2;
                const newY = ts.centerY - newHeight / 2;
                
                setAssets(prev => prev.map(a => a.id === selectedAssetId ? { 
                    ...a, 
                    width: newWidth, 
                    height: newHeight,
                    x: newX,
                    y: newY
                } : a));
            }
            return;
        }

        if (isDragging.current) {
            const draggedItem = draggedItemId.current;

            if (draggedItem && !isSpacePressed.current && (tool === 'select' || tool === 'transform')) {
                if (draggedItem.type === 'token') {
                    setTokens(prev => prev.map(t => t.id === draggedItem.id ? { ...t, x: snap(x), y: snap(y) } : t));
                } else {
                     setAssets(prev => prev.map(a => a.id === draggedItem.id ? { ...a, x: snap(x - a.width/2), y: snap(y - a.height/2) } : a));
                }
            } else {
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                dragStart.current = { x: e.clientX, y: e.clientY };
            }
        } else if (isDrawing.current) {
            if (tool === 'brush') {
                setCurrentPath(prev => [...prev, {x, y}]);
            } else if (tool === 'rect' || tool === 'circle' || tool === 'wall') {
                setTempShape(prev => prev ? { ...prev, end: {x, y} } : null);
            }
        }
    };

    const handleMouseUp = () => {
        if (transformStateRef.current) {
            pushHistory();
            transformStateRef.current = null;
        }

        if (isDragging.current) {
            if (draggedItemId.current) {
                pushHistory();
            }
            isDragging.current = false;
            draggedItemId.current = null;
        }
        
        if (isDrawing.current) {
            isDrawing.current = false;
            
            if (tool === 'brush') {
                if (currentPath.length > 1) {
                    pushHistory();
                    setDrawings(prev => [...prev, {
                        id: generateId(),
                        type: 'path',
                        points: currentPath,
                        color: activeColor,
                        strokeWidth: activeWidth
                    }]);
                }
                setCurrentPath([]);
            } else if (tool === 'wall' && tempShape) {
                 pushHistory();
                 const { start, end } = tempShape;
                 setDrawings(prev => [...prev, {
                    id: generateId(),
                    type: 'wall',
                    points: [start, end],
                    color: '#ef4444',
                    strokeWidth: 8,
                    assetType: activeWallType
                }]);
                setTempShape(null);
            } else if ((tool === 'rect' || tool === 'circle') && tempShape) {
                pushHistory();
                const { start, end } = tempShape;
                const width = Math.abs(end.x - start.x);
                const height = Math.abs(end.y - start.y);
                const x = Math.min(start.x, end.x);
                const y = Math.min(start.y, end.y);
                const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

                setDrawings(prev => [...prev, {
                    id: generateId(),
                    type: tool,
                    x: tool === 'rect' ? x : start.x,
                    y: tool === 'rect' ? y : start.y,
                    width,
                    height,
                    radius,
                    color: activeColor,
                    strokeWidth: activeWidth,
                    points: []
                }]);
                setTempShape(null);
            }
        }
    };

    const processFileAsAsset = async (file: File, x: number, y: number) => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = async (ev) => {
             const result = ev.target?.result as string;
             const compressed = await compressImage(result, 1000, 0.8);
             
             pushHistory();
             const newAsset: CanvasAsset = {
                 id: generateId(),
                 type: 'custom_image',
                 x: snap(x),
                 y: snap(y),
                 width: 200,
                 height: 200,
                 rotation: 0,
                 imageUrl: compressed,
                 label: file.name
             };
             setAssets(prev => [...prev, newAsset]);
             addToast("Image added to canvas.", "success");
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        
        // 1. Handle File Drops from Desktop
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const { x, y } = getWorldCoords(e);
            Array.from(e.dataTransfer.files).forEach(file => {
                processFileAsAsset(file, x - 100, y - 100); // Center offset
            });
            return;
        }

        const dataJson = e.dataTransfer.getData('application/json');
        
        if (!dataJson) return;

        try {
            const data = JSON.parse(dataJson);
            const { x, y } = getWorldCoords(e);
            
            if (!data.id) return;
            
            pushHistory();

            if (data.type === 'asset') {
                if (data.type === 'custom_image_placeholder') {
                    // Trigger file upload for custom image
                    pendingAssetDropRef.current = { x: snap(x - 50), y: snap(y - 50) };
                    fileInputRef.current?.click();
                    return;
                }

                const newAsset: CanvasAsset = {
                    id: generateId(),
                    type: data.assetType,
                    x: snap(x - 50),
                    y: snap(y - 50),
                    width: 100,
                    height: 100,
                    rotation: 0
                };
                setAssets(prev => [...prev, newAsset]);
            } else {
                const newToken: CanvasToken = {
                    id: generateId(),
                    type: data.type,
                    referenceId: data.id,
                    x: snap(x),
                    y: snap(y),
                    size: TOKEN_SIZE / 2, 
                    label: data.name || "Unknown",
                    color: data.type === 'monster' ? '#ef4444' : data.type === 'npc' ? '#f59e0b' : '#3b82f6'
                };
                setTokens(prev => [...prev, newToken]);
            }
            
        } catch (err) {
            console.error("Drop Error:", err);
            addToast("Failed to place item.", "error");
        }
    };
    
    // Explicit upload via button
    const handleTriggerFileUpload = () => {
         // Default center
         const centerX = -pan.x + (window.innerWidth / 2) / scale;
         const centerY = -pan.y + (window.innerHeight / 2) / scale;
         pendingAssetDropRef.current = { x: snap(centerX - 100), y: snap(centerY - 100) };
         fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && pendingAssetDropRef.current) {
             const { x, y } = pendingAssetDropRef.current;
             processFileAsAsset(file, x, y);
             pendingAssetDropRef.current = null;
        }
        if (e.target) e.target.value = '';
    };

    const handleBroadcast = async () => {
        setIsBroadcasting(true);
        try {
            const hydratedTokens = await Promise.all(tokens.map(async t => {
                let img = t.image;
                if(!img) {
                     if (t.type === 'character') img = characters.find(c => c.id === t.referenceId)?.appearanceImage;
                     else if (t.type === 'npc') img = npcs.find(n => n.id === t.referenceId)?.image;
                     else if (t.type === 'monster') img = monsters.find(m => m.id === t.referenceId)?.image;
                }
                const compressedImg = img ? await compressImage(img, 64, 0.6) : undefined;
                return { ...t, image: compressedImg };
            }));
            
            // Compress large asset images for broadcast (don't save compressed state, just send)
            const hydratedAssets = await Promise.all(assets.map(async a => {
                 if (a.type === 'custom_image' && a.imageUrl) {
                      const compressed = await compressImage(a.imageUrl, 400, 0.6);
                      return { ...a, imageUrl: compressed };
                 }
                 return a;
            }));

            onBroadcast({
                canvasState: {
                    tokens: hydratedTokens,
                    drawings,
                    assets: hydratedAssets,
                    weather,
                    view: { x: pan.x, y: pan.y, scale }
                }
            });
            addToast("Map broadcasted.", "success");
        } catch (error) {
            console.error("Broadcast failed", error);
            addToast("Failed to broadcast.", "error");
        } finally {
            setIsBroadcasting(false);
        }
    }
    
    const handleClearCanvas = () => {
        setTokens([]);
        setDrawings([]);
        setAssets([]);
        setWeather('none');
        setHistory([]);
        setHistoryIndex(-1); 
        setPan({ x: -1500, y: -1500 });
        setScale(1);
        setSelectedAssetId(null);
        setIsClearModalOpen(false);
        addToast("Canvas cleared.", "info");
    };

    const handleLoadMap = (map: SavedMap) => {
        setTokens(map.tokens || []);
        setDrawings(map.drawings || []);
        setAssets(map.assets || []);
        setWeather(map.weather as any || 'none');
        setPan(map.view ? { x: map.view.x, y: map.view.y } : { x: -1500, y: -1500 });
        setScale(map.view ? map.view.scale : 1);
        setHistory([]);
        setHistoryIndex(-1);
        setIsLoadModalOpen(false);
        addToast("Map loaded.", "success");
    };

    // --- Render Helpers ---

    const renderDrawings = () => (
        <>
            {drawings.map(d => {
                if (d.type === 'path') {
                     const dStr = `M ${d.points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                     return <path key={d.id} d={dStr} stroke={d.color} strokeWidth={d.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />;
                } else if (d.type === 'wall') {
                    if (d.assetType) {
                        const start = d.points[0];
                        const end = d.points[1];
                        const dx = end.x - start.x;
                        const dy = end.y - start.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                        
                        const segmentLength = 40;
                        const segmentHeight = 15;
                        const count = Math.ceil(distance / segmentLength);
                        
                        const segments = [];
                        for (let i = 0; i < count; i++) {
                            const t = (i + 0.5) / count;
                            const cx = start.x + dx * t;
                            const cy = start.y + dy * t;
                            segments.push(
                                <g key={`${d.id}-${i}`} transform={`translate(${cx}, ${cy}) rotate(${angle}) translate(${-segmentLength / 2}, ${-segmentHeight / 2})`}>
                                    <AssetRenderer type={d.assetType} width={segmentLength} height={segmentHeight} />
                                </g>
                            );
                        }
                        return <g key={d.id} filter="url(#shadow-soft)">{segments}</g>;
                    } else {
                        const dStr = `M ${d.points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                        return <path key={d.id} d={dStr} stroke={d.color || '#ef4444'} strokeWidth={d.strokeWidth || 8} fill="none" strokeLinecap="round" className="drop-shadow-md"/>;
                    }
                } else if (d.type === 'rect') {
                    return <rect key={d.id} x={d.x} y={d.y} width={d.width} height={d.height} stroke={d.color} strokeWidth={d.strokeWidth} fill={d.color} fillOpacity="0.2" />;
                } else if (d.type === 'circle') {
                    return <circle key={d.id} cx={d.x} cy={d.y} r={d.radius} stroke={d.color} strokeWidth={d.strokeWidth} fill={d.color} fillOpacity="0.2" />;
                }
                return null;
            })}
            
            {isDrawing.current && currentPath.length > 1 && tool === 'brush' && (
                <path d={`M ${currentPath.map(p => `${p.x},${p.y}`).join(' L ')}`} stroke={activeColor} strokeWidth={activeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
        </>
    );

    const renderAssets = () => (
        assets.map(asset => {
            const isSelected = selectedAssetId === asset.id;
            return (
                 <g key={asset.id} transform={`translate(${asset.x}, ${asset.y})`}>
                     <g style={{ transformOrigin: `${asset.width/2}px ${asset.height/2}px`, transform: `rotate(${asset.rotation || 0}deg)` }}>
                         <AssetRenderer type={asset.type} width={asset.width} height={asset.height} imageUrl={asset.imageUrl} />
                         
                         {/* Selection Overlay */}
                         {isSelected && tool === 'transform' && (
                             <g pointerEvents="all">
                                 {/* Bounding Box */}
                                 <rect x={-5} y={-5} width={asset.width+10} height={asset.height+10} fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="5,5" />
                                 {/* Rotation Handle */}
                                 <line x1={asset.width/2} y1={0} x2={asset.width/2} y2={-30} stroke="var(--accent-primary)" strokeWidth="2" />
                                 <circle cx={asset.width/2} cy={-30} r={6} fill="var(--accent-primary)" stroke="white" strokeWidth="2" cursor="grab" onMouseDown={(e) => startTransform(e, 'rotate', asset)} />
                                 {/* Scale Handles */}
                                 <circle cx={-5} cy={-5} r={5} fill="var(--accent-primary)" stroke="white" strokeWidth="2" cursor="nwse-resize" onMouseDown={(e) => startTransform(e, 'scale', asset)} />
                                 <circle cx={asset.width+5} cy={-5} r={5} fill="var(--accent-primary)" stroke="white" strokeWidth="2" cursor="nesw-resize" onMouseDown={(e) => startTransform(e, 'scale', asset)} />
                                 <circle cx={asset.width+5} cy={asset.height+5} r={5} fill="var(--accent-primary)" stroke="white" strokeWidth="2" cursor="nwse-resize" onMouseDown={(e) => startTransform(e, 'scale', asset)} />
                                 <circle cx={-5} cy={asset.height+5} r={5} fill="var(--accent-primary)" stroke="white" strokeWidth="2" cursor="nesw-resize" onMouseDown={(e) => startTransform(e, 'scale', asset)} />
                             </g>
                         )}
                     </g>
                 </g>
            )
        })
    );

    const renderTokens = () => (
        tokens.map(token => {
            let image = token.image; 
            if (!image) {
                if (token.type === 'character') image = characters.find(c => c.id === token.referenceId)?.appearanceImage;
                else if (token.type === 'npc') image = npcs.find(n => n.id === token.referenceId)?.image;
                else if (token.type === 'monster') image = monsters.find(m => m.id === token.referenceId)?.image;
            }

            return (
                <div
                    key={token.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                    style={{ 
                        left: token.x * scale + pan.x, 
                        top: token.y * scale + pan.y, 
                        width: token.size * 2 * scale, 
                        height: token.size * 2 * scale,
                        zIndex: 20
                    }}
                >
                    <div 
                        className="w-full h-full rounded-full border-4 overflow-hidden bg-black/50 shadow-lg pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform aspect-square"
                        style={{ borderColor: token.color }}
                    >
                        {image ? <img src={image} className="w-full h-full object-cover" draggable={false} /> : <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">{token.label[0]}</div>}
                    </div>
                    <div className="mt-1 bg-black/60 text-white text-[10px] px-1 rounded whitespace-nowrap overflow-hidden max-w-[150%]">{token.label}</div>
                </div>
            );
        })
    );


    return (
        <div className="relative w-full h-full bg-[#1a1a1a] overflow-hidden select-none">
            
            <CanvasLibrary 
                isOpen={isLibraryOpen} 
                onClose={() => setIsLibraryOpen(false)} 
                characters={characters} 
                npcs={npcs} 
                monsters={monsters} 
                setWeather={setWeather}
                currentWeather={weather}
                assets={assets}
                onUpdateAssets={setAssets}
                onSelectAsset={(id) => { setSelectedAssetId(id); setTool('transform'); }}
                selectedAssetId={selectedAssetId}
                onUploadImage={handleTriggerFileUpload}
            />
            
            {!isLibraryOpen && (
                <button 
                    onClick={() => setIsLibraryOpen(true)}
                    className="absolute top-4 left-4 z-20 bg-[var(--bg-secondary)] p-2 rounded-lg border border-[var(--border-primary)] shadow-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-primary)]"
                    title="Open Library"
                >
                    <LibraryIcon className="w-6 h-6" />
                </button>
            )}
            
            {/* Weather Overlay */}
            {weather !== 'none' && <WeatherSystem width={window.innerWidth} height={window.innerHeight} type={weather} scale={scale} />}
            
            {/* Hidden Input for Custom Image Upload */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className={`w-full h-full ${tool === 'pan' || isSpacePressed.current ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
            >
                {/* Grid Layer */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        width: CANVAS_SIZE,
                        height: CANVAS_SIZE,
                        backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)`,
                        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
                    }}
                />

                {/* SVG Drawing Layer (Includes Assets as SVG G elements) */}
                <svg 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        width: CANVAS_SIZE,
                        height: CANVAS_SIZE,
                    }}
                >
                    <defs>
                        <filter id="shadow-soft">
                            <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3"/>
                        </filter>
                    </defs>
                    {renderDrawings()}
                    {renderAssets()}
                </svg>

                {renderTokens()}

            </div>

            {/* Toolbar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full px-4 py-2 shadow-2xl flex items-center gap-4 z-20 animate-slide-up">
                <div className="flex gap-2 border-r border-[var(--border-secondary)] pr-4">
                    <Button variant="ghost" size="sm" onClick={() => setTool('select')} className={tool === 'select' ? 'bg-[var(--accent-primary)] text-black' : ''} title="Select/Move (V)"><MousePointerIcon className="w-5 h-5"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => setTool('transform')} className={tool === 'transform' ? 'bg-[var(--accent-primary)] text-black' : ''} title="Transform Asset"><TransformIcon className="w-5 h-5"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => setTool('pan')} className={tool === 'pan' ? 'bg-[var(--accent-primary)] text-black' : ''} title="Pan (Spacebar)"><HandIcon className="w-5 h-5"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => setTool('brush')} className={tool === 'brush' ? 'bg-[var(--accent-primary)] text-black' : ''} title="Draw (B)"><BrushIcon className="w-5 h-5"/></Button>
                    <div className="relative group">
                        <Button variant="ghost" size="sm" onClick={() => setTool('wall')} className={tool === 'wall' ? 'bg-red-500 text-white' : ''} title="Wall/Line (W)"><WallIcon className="w-5 h-5"/></Button>
                         {tool === 'wall' && (
                             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded p-1 flex gap-1 shadow-xl">
                                 {WALL_TYPES.map(wType => (
                                     <button 
                                        key={wType}
                                        onClick={() => setActiveWallType(wType)}
                                        className={`w-6 h-6 rounded border ${activeWallType === wType ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                        title={wType.replace('_', ' ')}
                                     >
                                         <div className="w-full h-full overflow-hidden flex items-center justify-center">
                                             <AssetRenderer type={wType} width={20} height={20} />
                                         </div>
                                     </button>
                                 ))}
                             </div>
                         )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setTool('rect')} className={tool === 'rect' ? 'bg-[var(--accent-primary)] text-black' : ''} title="Rectangle (R)"><SquareIcon className="w-5 h-5"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => setTool('circle')} className={tool === 'circle' ? 'bg-[var(--accent-primary)] text-black' : ''} title="Circle (C)"><CircleIcon className="w-5 h-5"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => setTool('erase')} className={tool === 'erase' ? 'bg-[var(--accent-primary)] text-black' : ''} title="Eraser (E)"><EraserIcon className="w-5 h-5"/></Button>
                </div>
                
                {['brush', 'rect', 'circle'].includes(tool) && (
                    <div className="flex gap-2 items-center border-r border-[var(--border-secondary)] pr-4">
                        <div className="flex gap-1">
                            {COLORS.map(c => (
                                <button 
                                    key={c} 
                                    onClick={() => setActiveColor(c)} 
                                    className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${activeColor === c ? 'scale-125 ring-2 ring-white' : ''}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                        <div className="w-px h-6 bg-[var(--border-secondary)] mx-1"></div>
                        <div className="flex gap-1 items-end">
                            {STROKE_WIDTHS.map(w => (
                                <button 
                                    key={w} 
                                    onClick={() => setActiveWidth(w)}
                                    className={`bg-[var(--text-muted)] rounded-sm transition-colors ${activeWidth === w ? 'bg-[var(--accent-primary)]' : ''}`}
                                    style={{ width: 6, height: w * 1.5 + 4 }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex < 0} className="!p-1.5"><UndoIcon className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} className="!p-1.5"><RedoIcon className="w-4 h-4"/></Button>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1"></div>
                    <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.max(0.2, s - 0.1))} className="!p-1.5"><ZoomOutIcon className="w-4 h-4"/></Button>
                    <span className="text-xs font-mono w-8 text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.min(3, s + 0.1))} className="!p-1.5"><ZoomInIcon className="w-4 h-4"/></Button>
                     <div className="w-px h-6 bg-[var(--border-secondary)] mx-1"></div>
                     <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setIsLoadModalOpen(true)} className="!p-1.5" title="Load Map"><ImportIcon className="w-4 h-4"/></Button>
                     </div>
                     <div className="w-px h-6 bg-[var(--border-secondary)] mx-1"></div>
                     <Button variant="ghost" size="sm" onClick={() => setIsClearModalOpen(true)} className="text-red-400 hover:bg-red-900/50 !p-1.5" title="Clear Canvas"><TrashIcon className="w-4 h-4"/></Button>
                </div>
                
                <div className="border-l border-[var(--border-secondary)] pl-4 ml-2">
                     <Button 
                        onClick={handleBroadcast} 
                        disabled={isBroadcasting}
                        className="bg-green-600 hover:bg-green-500 text-white flex items-center gap-2"
                        title="Send view to players"
                    >
                         {isBroadcasting ? (
                             <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                         ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.93 4.93 19.07 19.07"/><circle cx="12" cy="12" r="10"/></svg>
                         )}
                         Broadcast
                    </Button>
                </div>
            </div>

            <Dialog 
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={handleClearCanvas}
                title="Clear Canvas?"
                description="This will remove all drawings, assets, and tokens. This action cannot be undone."
                confirmText="Clear All"
            />
            
            {isLoadModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-vignette animate-fade-in" onClick={() => setIsLoadModalOpen(false)}>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-medieval text-[var(--accent-primary)] mb-4 flex-shrink-0">Load Saved Map</h3>
                        <div className="overflow-y-auto flex-grow space-y-2 mb-4 pr-1 custom-scrollbar">
                            {maps.length === 0 ? (
                                <p className="text-[var(--text-muted)] text-center py-4">No saved maps found.</p>
                            ) : (
                                maps.map(map => (
                                    <div key={map.id} className="flex justify-between items-center p-3 bg-[var(--bg-primary)] rounded hover:bg-[var(--bg-tertiary)] group">
                                        <div onClick={() => handleLoadMap(map)} className="cursor-pointer flex-grow">
                                            <p className="font-bold text-sm">{map.name}</p>
                                            <p className="text-[10px] text-[var(--text-muted)]">{new Date(map.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <button onClick={() => deleteMap(map.id)} className="text-[var(--text-muted)] hover:text-red-400 p-1"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-end flex-shrink-0">
                            <Button onClick={() => setIsLoadModalOpen(false)} variant="ghost">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CanvasView;
