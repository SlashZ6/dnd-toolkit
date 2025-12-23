
import React, { useRef, useEffect, useState } from 'react';
import { CanvasToken, CanvasDrawing, CanvasAsset } from '../types';
import Button from './ui/Button';
import { ZoomInIcon, ZoomOutIcon, HandIcon } from './icons/CanvasIcons';
import { AssetRenderer } from './canvas/ProceduralAssets';
import { WeatherSystem } from './canvas/WeatherSystem';

interface PlayerCanvasViewProps {
    canvasState: {
        tokens: CanvasToken[];
        drawings: CanvasDrawing[];
        assets?: CanvasAsset[];
        weather?: 'none' | 'rain' | 'snow' | 'embers' | 'fog';
        view?: { x: number; y: number; scale: number };
    };
    onClose: () => void;
}

const CANVAS_SIZE = 4000;
const GRID_SIZE = 50;

const PlayerCanvasView: React.FC<PlayerCanvasViewProps> = ({ canvasState, onClose }) => {
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: -1500, y: -1500 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Initialize View from State (if broadcasted)
    useEffect(() => {
        if (canvasState.view) {
            setPan({ x: canvasState.view.x, y: canvasState.view.y });
            setScale(canvasState.view.scale);
        }
    }, [canvasState.view]);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current) {
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            dragStart.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const s = Math.exp(e.deltaY * -0.001);
        setScale(prev => Math.min(3, Math.max(0.2, prev * s)));
    };

    const renderDrawings = () => (
        <>
            {canvasState.drawings.map(d => {
                if (d.type === 'path') {
                    const dStr = `M ${d.points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                    return (
                        <path 
                            key={d.id} 
                            d={dStr} 
                            stroke={d.color} 
                            strokeWidth={d.strokeWidth} 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            opacity={0.7}
                        />
                    );
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
                         return (
                            <path 
                                key={d.id} 
                                d={dStr} 
                                stroke={d.color} 
                                strokeWidth={d.strokeWidth} 
                                fill="none" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="drop-shadow-md"
                            />
                        );
                    }
                } else if (d.type === 'rect') {
                    return <rect key={d.id} x={d.x} y={d.y} width={d.width} height={d.height} stroke={d.color} strokeWidth={d.strokeWidth} fill={d.color} fillOpacity="0.2" />;
                } else if (d.type === 'circle') {
                    return <circle key={d.id} cx={d.x} cy={d.y} r={d.radius} stroke={d.color} strokeWidth={d.strokeWidth} fill={d.color} fillOpacity="0.2" />;
                }
                return null;
            })}
        </>
    );

    const renderAssets = () => (
        canvasState.assets?.map(asset => (
             <g key={asset.id} transform={`translate(${asset.x}, ${asset.y})`}>
                 <AssetRenderer type={asset.type} width={asset.width} height={asset.height} rotation={asset.rotation} />
             </g>
        ))
    );

    return (
        <div className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
                    <h2 className="font-medieval text-xl text-[var(--accent-primary)]">Game Map</h2>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-2 rounded-lg border border-[var(--border-primary)] shadow-lg pointer-events-auto transition-colors font-bold"
                >
                    Close Map
                </button>
            </div>

            {/* Weather Overlay */}
            {canvasState.weather && canvasState.weather !== 'none' && (
                <WeatherSystem width={window.innerWidth} height={window.innerHeight} type={canvasState.weather} scale={scale} />
            )}

            {/* Canvas */}
            <div 
                ref={containerRef}
                className="flex-grow relative overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                {/* Grid */}
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

                {/* Content */}
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

                {/* Tokens */}
                {canvasState.tokens.map(token => (
                    <div
                        key={token.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 ease-out"
                        style={{ 
                            left: token.x * scale + pan.x, 
                            top: token.y * scale + pan.y, 
                            width: token.size * 2 * scale, 
                            height: token.size * 2 * scale,
                            zIndex: 10
                        }}
                    >
                        <div 
                            className="w-full h-full rounded-full border-4 overflow-hidden bg-black/50 shadow-lg aspect-square relative"
                            style={{ borderColor: token.color }}
                        >
                            {token.image ? (
                                <img src={token.image} className="w-full h-full object-cover" draggable={false} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">{token.label[0]}</div>
                            )}
                        </div>
                        <div className="mt-1 bg-black/60 text-white text-[10px] px-1 rounded whitespace-nowrap overflow-hidden max-w-[150%] backdrop-blur-sm">{token.label}</div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full px-4 py-2 shadow-2xl flex items-center gap-4 z-20">
                <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.max(0.2, s - 0.1))} className="!p-1.5"><ZoomOutIcon className="w-4 h-4"/></Button>
                <span className="text-xs font-mono w-8 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.min(3, s + 0.1))} className="!p-1.5"><ZoomInIcon className="w-4 h-4"/></Button>
                <div className="w-px h-6 bg-[var(--border-secondary)] mx-1"></div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase font-bold">
                    <HandIcon className="w-4 h-4" /> Pan to move
                </div>
            </div>
        </div>
    );
};

export default PlayerCanvasView;
