
import React, { useMemo } from 'react';

// --- Types ---
export interface ProceduralAssetProps {
  type: string;
  width: number;
  height: number;
  rotation?: number;
  imageUrl?: string;
}

export const ASSET_CATEGORIES = {
  STRUCTURE: ['stone_wall', 'wood_wall', 'brick_wall', 'door_closed', 'door_open', 'window', 'stairs_stone', 'stairs_wood', 'pillar_round', 'pillar_square', 'bridge'],
  NATURE: ['tree_pine', 'tree_oak', 'bush', 'rock_large', 'rock_cluster', 'mushroom_giant', 'log', 'stump'],
  FURNITURE: ['table_rect', 'table_round', 'chair', 'bed_common', 'chest_closed', 'chest_open', 'barrel', 'crate', 'bookshelf', 'rug_red', 'altar', 'throne', 'campfire', 'torch', 'magic_circle'],
  EFFECTS: ['blood_splatter', 'slime_puddle', 'scorch_mark', 'rubble', 'web', 'bones']
};

// --- Shared Defs (Patterns & Gradients) ---
const CommonDefs = () => (
    <defs>
        {/* Wood Grain Pattern */}
        <pattern id="pat-wood" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="20" height="20" fill="#5c4033" />
            <path d="M0,0 Q10,5 20,0 M0,10 Q10,15 20,10 M0,20 Q10,25 20,20" stroke="#3e2723" strokeWidth="0.5" fill="none" opacity="0.5"/>
            <path d="M0,5 Q10,0 20,5 M0,15 Q10,10 20,15" stroke="#8d6e63" strokeWidth="0.5" fill="none" opacity="0.3"/>
        </pattern>

        {/* Stone Texture */}
        <pattern id="pat-stone" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#78909c" />
            <path d="M0 10 L40 10 M10 0 L10 40 M20 0 L20 10 M30 10 L30 40 M0 30 L40 30" stroke="#546e7a" strokeWidth="1" opacity="0.5" fill="none" />
            <circle cx="5" cy="5" r="1" fill="#37474f" opacity="0.3" />
            <circle cx="25" cy="25" r="2" fill="#37474f" opacity="0.2" />
            <circle cx="35" cy="15" r="1.5" fill="#cfd8dc" opacity="0.2" />
        </pattern>

        {/* Brick Texture */}
        <pattern id="pat-brick" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
             <rect width="20" height="10" fill="#a1887f" />
             <path d="M0 0 H20 V10 H0 Z" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.5" />
             <line x1="10" y1="0" x2="10" y2="10" stroke="#5d4037" strokeWidth="0.5" />
        </pattern>
        
        {/* Cobblestone/Rubble */}
        <pattern id="pat-rubble" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
             <path d="M2,2 h8 v8 h-8 z M12,5 h10 v5 h-10 z M5,15 h10 v10 h-10 z M20,20 h8 v8 h-8 z" fill="#90a4ae" stroke="#546e7a" strokeWidth="1" />
        </pattern>

        {/* Metal */}
        <linearGradient id="grad-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cfd8dc" />
            <stop offset="50%" stopColor="#90a4ae" />
            <stop offset="100%" stopColor="#607d8b" />
        </linearGradient>

        {/* Fire */}
        <radialGradient id="grad-fire" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffff00" stopOpacity="1" />
            <stop offset="40%" stopColor="#ff9800" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#f44336" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#212121" stopOpacity="0" />
        </radialGradient>
        
        {/* Magic Glow */}
        <radialGradient id="grad-magic">
            <stop offset="0%" stopColor="#e040fb" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c4dff" stopOpacity="0" />
        </radialGradient>
        
        {/* Slime */}
        <radialGradient id="grad-slime">
            <stop offset="0%" stopColor="#ccff90" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#76ff03" stopOpacity="0.6" />
        </radialGradient>

        <filter id="shadow-soft">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
        </filter>
    </defs>
);

// --- Structure Components ---

const StoneWall: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x="0" y="0" width={w} height={h} fill="url(#pat-stone)" stroke="#37474f" strokeWidth="2" />
        {/* Highlights for 3D effect */}
        <path d={`M0 0 L${w} 0`} stroke="#cfd8dc" strokeWidth="2" opacity="0.5" />
        <path d={`M0 ${h} L${w} ${h}`} stroke="#263238" strokeWidth="4" opacity="0.5" />
    </g>
);

const BrickWall: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x="0" y="0" width={w} height={h} fill="url(#pat-brick)" stroke="#3e2723" strokeWidth="2" />
        <path d={`M0 0 L${w} 0`} stroke="#d7ccc8" strokeWidth="2" opacity="0.3" />
        <path d={`M0 ${h} L${w} ${h}`} stroke="#3e2723" strokeWidth="4" opacity="0.5" />
    </g>
);

const WoodWall: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x="0" y="0" width={w} height={h} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="2" />
        <line x1="0" y1="0" x2={w} y2="0" stroke="#8d6e63" strokeWidth="2" opacity="0.5" />
        <line x1="0" y1={h} x2={w} y2={h} stroke="#210a04" strokeWidth="2" opacity="0.5" />
        {/* Nails */}
        <circle cx={4} cy={4} r={1} fill="#3e2723" />
        <circle cx={w-4} cy={4} r={1} fill="#3e2723" />
        <circle cx={4} cy={h-4} r={1} fill="#3e2723" />
        <circle cx={w-4} cy={h-4} r={1} fill="#3e2723" />
    </g>
);

const Door: React.FC<{w: number, h: number, open?: boolean}> = ({w, h, open}) => {
    // Top-down door: Frame + swinging part
    const frameDepth = Math.max(4, h * 0.2);
    return (
        <g>
            {/* Frame */}
            <rect x={0} y={0} width={w} height={h} fill="none" /> 
            <rect x={0} y={0} width={frameDepth} height={h} fill="#3e2723" stroke="black" />
            <rect x={w-frameDepth} y={0} width={frameDepth} height={h} fill="#3e2723" stroke="black" />
            
            {open ? (
                 <g transform={`rotate(-90, ${frameDepth}, ${h/2})`}>
                    <rect x={frameDepth} y={h/2 - 4} width={w - frameDepth*2} height={8} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="1" />
                    <path d={`M${frameDepth} ${h/2} Q${w/2} ${h*1.5} ${w-frameDepth} ${h/2}`} fill="none" stroke="#000" strokeDasharray="4 4" opacity="0.3" />
                 </g>
            ) : (
                <rect x={frameDepth} y={h/2 - 4} width={w - frameDepth*2} height={8} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="1" />
            )}
        </g>
    );
};

const Stairs: React.FC<{w: number, h: number, material: 'stone'|'wood'}> = ({w, h, material}) => {
    const steps = 6;
    const stepSize = w / steps;
    const fill = material === 'stone' ? 'url(#pat-stone)' : 'url(#pat-wood)';
    const stroke = material === 'stone' ? '#546e7a' : '#5d4037';
    
    return (
        <g>
            {Array.from({ length: steps }).map((_, i) => (
                <rect 
                    key={i} 
                    x={i * stepSize} 
                    y={0} 
                    width={stepSize} 
                    height={h} 
                    fill={fill} 
                    stroke={stroke}
                    strokeWidth="1"
                >
                </rect>
            ))}
            {/* Gradient Overlay for Depth */}
            <linearGradient id={`grad-stairs-${material}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#000" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#000" stopOpacity="0"/>
            </linearGradient>
            <rect x={0} y={0} width={w} height={h} fill={`url(#grad-stairs-${material})`} pointerEvents="none"/>
        </g>
    )
}

const Window: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g>
        <rect x={0} y={h/2 - 3} width={w} height={6} fill="#90caf9" stroke="#0d47a1" strokeWidth="1" />
        <rect x={0} y={h/2 - 4} width={w} height={1} fill="#5d4037" />
        <rect x={0} y={h/2 + 3} width={w} height={1} fill="#5d4037" />
        {/* Crossbars */}
        <line x1={w/2} y1={h/2-3} x2={w/2} y2={h/2+3} stroke="#0d47a1" strokeWidth="1" />
        <line x1={w*0.25} y1={h/2-3} x2={w*0.25} y2={h/2+3} stroke="#0d47a1" strokeWidth="1" />
        <line x1={w*0.75} y1={h/2-3} x2={w*0.75} y2={h/2+3} stroke="#0d47a1" strokeWidth="1" />
    </g>
);

const PillarRound: React.FC<{w: number, h: number}> = ({w, h}) => {
    const r = Math.min(w, h)/2 - 2;
    return (
        <g filter="url(#shadow-soft)">
             <circle cx={w/2} cy={h/2} r={r} fill="url(#pat-stone)" stroke="#37474f" strokeWidth="1"/>
             <circle cx={w/2} cy={h/2} r={r*0.8} fill="none" stroke="#546e7a" strokeWidth="1" strokeDasharray="4 2"/>
             <radialGradient id="pillar-shade">
                 <stop offset="0%" stopColor="white" stopOpacity="0.2"/>
                 <stop offset="100%" stopColor="black" stopOpacity="0.5"/>
             </radialGradient>
             <circle cx={w/2} cy={h/2} r={r} fill="url(#pillar-shade)"/>
        </g>
    )
};

const PillarSquare: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={2} y={2} width={w-4} height={h-4} fill="url(#pat-stone)" stroke="#37474f" strokeWidth="2"/>
        <rect x={6} y={6} width={w-12} height={h-12} fill="none" stroke="#546e7a" strokeWidth="1"/>
        {/* X bracing visual */}
        <path d={`M2 2 L${w-2} ${h-2} M${w-2} 2 L2 ${h-2}`} stroke="#546e7a" strokeWidth="1" opacity="0.3"/>
    </g>
);

const Bridge: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g>
        {/* Planks */}
        <defs>
             <pattern id="pat-bridge" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                <rect width="20" height="10" fill="#795548"/>
                <line x1="0" y1="0" x2="0" y2="10" stroke="#3e2723" strokeWidth="2"/>
                <line x1="0" y1="5" x2="20" y2="5" stroke="#4e342e" strokeWidth="1" opacity="0.5"/>
            </pattern>
        </defs>
        <rect x={0} y={0} width={w} height={h} fill="url(#pat-bridge)"/>
        {/* Rails */}
        <rect x={0} y={0} width={w} height={4} fill="#3e2723"/>
        <rect x={0} y={h-4} width={w} height={4} fill="#3e2723"/>
        {/* Posts */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => (
             <React.Fragment key={pct}>
                 <circle cx={w*pct} cy={2} r={3} fill="#5d4037"/>
                 <circle cx={w*pct} cy={h-2} r={3} fill="#5d4037"/>
             </React.Fragment>
        ))}
    </g>
);

// --- Nature Components ---

const TreePine: React.FC<{w: number, h: number}> = ({w, h}) => {
    const cx = w/2;
    const cy = h/2;
    const r = Math.min(w, h)/2;
    return (
        <g filter="url(#shadow-soft)">
             <circle cx={cx} cy={cy} r={r * 0.2} fill="#3e2723" />
            {[1, 0.8, 0.6, 0.4].map((scale, i) => (
                <path 
                    key={i}
                    d={`M${cx} ${cy - r * scale} L${cx + r * scale * 0.8} ${cy + r * scale * 0.5} L${cx + r * scale * 0.3} ${cy + r * scale * 0.2} L${cx + r * scale * 0.9} ${cy + r * scale * 0.8} L${cx} ${cy + r * scale} L${cx - r * scale * 0.9} ${cy + r * scale * 0.8} L${cx - r * scale * 0.3} ${cy + r * scale * 0.2} L${cx - r * scale * 0.8} ${cy + r * scale * 0.5} Z`} 
                    fill={i % 2 === 0 ? "#1b5e20" : "#2e7d32"}
                    stroke="#14532d"
                    strokeWidth="1"
                    transform={`rotate(${i * 45}, ${cx}, ${cy})`}
                />
            ))}
             <circle cx={cx} cy={cy} r={r * 0.1} fill="#4caf50" opacity="0.5" />
        </g>
    );
};

const TreeOak: React.FC<{w: number, h: number}> = ({w, h}) => {
    const cx = w/2;
    const cy = h/2;
    return (
        <g filter="url(#shadow-soft)">
             <circle cx={cx} cy={cy} r={w*0.15} fill="#5d4037" />
             <circle cx={cx} cy={cy} r={w*0.45} fill="#2e7d32" stroke="#1b5e20" strokeWidth="1" opacity="0.9"/>
             <circle cx={cx-w*0.2} cy={cy-h*0.2} r={w*0.25} fill="#388e3c" opacity="0.8"/>
             <circle cx={cx+w*0.2} cy={cy-h*0.2} r={w*0.25} fill="#43a047" opacity="0.8"/>
             <circle cx={cx-w*0.1} cy={cy+h*0.25} r={w*0.22} fill="#2e7d32" opacity="0.8"/>
             <circle cx={cx+w*0.15} cy={cy+h*0.15} r={w*0.24} fill="#4caf50" opacity="0.7"/>
        </g>
    )
};

const Bush: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <path d={`M${w*0.2} ${h*0.5} Q${w*0.1} ${h*0.2} ${w*0.5} ${h*0.1} Q${w*0.9} ${h*0.2} ${w*0.8} ${h*0.5} Q${w*0.9} ${h*0.9} ${w*0.5} ${h*0.9} Q${w*0.1} ${h*0.8} ${w*0.2} ${h*0.5}`} fill="#558b2f" stroke="#33691e" strokeWidth="1"/>
        <circle cx={w*0.3} cy={h*0.3} r={w*0.1} fill="#7cb342" opacity="0.6"/>
        <circle cx={w*0.7} cy={h*0.6} r={w*0.15} fill="#7cb342" opacity="0.6"/>
    </g>
);

const Rock: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <path d={`M${w*0.2} ${h*0.5} Q${w*0.1} ${h*0.2} ${w*0.5} ${h*0.1} Q${w*0.9} ${h*0.2} ${w*0.8} ${h*0.5} Q${w*0.9} ${h*0.9} ${w*0.5} ${h*0.9} Q${w*0.1} ${h*0.8} ${w*0.2} ${h*0.5}`} fill="url(#pat-stone)" stroke="#455a64" strokeWidth="2"/>
        <path d={`M${w*0.3} ${h*0.4} Q${w*0.5} ${h*0.3} ${w*0.7} ${h*0.4}`} stroke="#cfd8dc" strokeWidth="2" opacity="0.5" fill="none"/>
    </g>
);

const RockCluster: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <circle cx={w*0.3} cy={h*0.3} r={w*0.2} fill="#78909c" stroke="#455a64" />
        <circle cx={w*0.7} cy={h*0.4} r={w*0.25} fill="#607d8b" stroke="#37474f" />
        <circle cx={w*0.5} cy={h*0.75} r={w*0.15} fill="#90a4ae" stroke="#546e7a" />
    </g>
);

const Mushroom: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <circle cx={w/2} cy={h/2} r={w*0.4} fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />
        <circle cx={w*0.3} cy={h*0.3} r={w*0.08} fill="white" opacity="0.8" />
        <circle cx={w*0.7} cy={h*0.4} r={w*0.1} fill="white" opacity="0.8" />
        <circle cx={w*0.5} cy={h*0.7} r={w*0.06} fill="white" opacity="0.8" />
        <circle cx={w*0.2} cy={h*0.6} r={w*0.05} fill="white" opacity="0.8" />
        <circle cx={w*0.8} cy={h*0.2} r={w*0.05} fill="white" opacity="0.8" />
    </g>
);

const Log: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={w*0.1} y={h*0.3} width={w*0.8} height={h*0.4} rx={h*0.2} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="1"/>
        <line x1={w*0.2} y1={h*0.3} x2={w*0.2} y2={h*0.7} stroke="#3e2723" strokeWidth="1" opacity="0.5"/>
        <path d={`M${w*0.5} ${h*0.3} Q${w*0.6} ${h*0.5} ${w*0.5} ${h*0.7}`} stroke="#3e2723" strokeWidth="1" fill="none" opacity="0.5"/>
    </g>
);

const Stump: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <circle cx={w/2} cy={h/2} r={w*0.4} fill="#795548" stroke="#3e2723" strokeWidth="2"/>
        <circle cx={w/2} cy={h/2} r={w*0.3} fill="none" stroke="#5d4037" strokeWidth="1"/>
        <circle cx={w/2} cy={h/2} r={w*0.2} fill="none" stroke="#5d4037" strokeWidth="1"/>
        <circle cx={w/2} cy={h/2} r={w*0.1} fill="none" stroke="#5d4037" strokeWidth="1"/>
        {/* Cracks */}
        <line x1={w/2} y1={h/2} x2={w*0.8} y2={h*0.8} stroke="#3e2723" strokeWidth="1"/>
    </g>
);

// --- Furniture Components ---

const TableRect: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={2} y={2} width={w-4} height={h-4} rx="4" fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="2" />
        {/* Clutter: Scroll */}
        <rect x={w*0.2} y={h*0.3} width={w*0.2} height={h*0.4} fill="#fff9c4" transform={`rotate(15, ${w*0.3}, ${h*0.5})`} stroke="#fbc02d" strokeWidth="0.5"/>
        {/* Clutter: Mug */}
        <circle cx={w*0.7} cy={h*0.6} r={w*0.08} fill="#8d6e63" stroke="#3e2723" strokeWidth="1" />
        <circle cx={w*0.7} cy={h*0.6} r={w*0.06} fill="#3e2723" opacity="0.5" />
    </g>
);

const TableRound: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <circle cx={w/2} cy={h/2} r={w/2-2} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="2"/>
        <circle cx={w/2} cy={h/2} r={w/4} fill="none" stroke="#5d4037" strokeWidth="1" opacity="0.5"/>
    </g>
);

const Chair: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={w*0.2} y={h*0.2} width={w*0.6} height={h*0.6} rx="2" fill="#8d6e63" stroke="#3e2723" strokeWidth="1"/>
        <rect x={w*0.2} y={0} width={w*0.6} height={h*0.2} fill="#5d4037" stroke="#3e2723" strokeWidth="1"/>
    </g>
);

const Bed: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={0} y={0} width={w} height={h} rx="2" fill="#5d4037" />
        <rect x={2} y={2} width={w-4} height={h-4} rx="2" fill="#eceff1" />
        <rect x={4} y={4} width={w-8} height={h*0.2} rx="4" fill="#cfd8dc" stroke="#b0bec5" />
        <path d={`M2 ${h*0.4} L${w-2} ${h*0.4} L${w-2} ${h-2} Q${w/2} ${h} 2 ${h-2} Z`} fill="#ef5350" />
    </g>
);

const Chest: React.FC<{w: number, h: number, open?: boolean}> = ({w, h, open}) => (
    <g filter="url(#shadow-soft)">
        <rect x={0} y={0} width={w} height={h} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="2" rx="2" />
        <rect x={w*0.1} y={0} width={w*0.1} height={h} fill="url(#grad-metal)" />
        <rect x={w*0.8} y={0} width={w*0.1} height={h} fill="url(#grad-metal)" />
        
        {open ? (
            <g>
                <rect x={4} y={4} width={w-8} height={h-8} fill="#1a1a1a" />
                <circle cx={w*0.3} cy={h*0.3} r={3} fill="#ffeb3b" />
                <circle cx={w*0.5} cy={h*0.5} r={3} fill="#ffeb3b" />
                <circle cx={w*0.7} cy={h*0.4} r={3} fill="#ffeb3b" />
                <circle cx={w*0.4} cy={h*0.7} r={3} fill="#ffeb3b" />
            </g>
        ) : (
            <line x1={0} y1={h/2} x2={w} y2={h/2} stroke="#3e2723" strokeWidth="1" />
        )}
    </g>
);

const Barrel: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <circle cx={w/2} cy={h/2} r={w/2-2} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="1"/>
        <circle cx={w/2} cy={h/2} r={w/2-6} fill="none" stroke="#90a4ae" strokeWidth="2"/> {/* Metal band */}
        <circle cx={w/2} cy={h/2} r={2} fill="#3e2723"/> {/* Plug */}
    </g>
);

const Crate: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={0} y={0} width={w} height={h} fill="url(#pat-wood)" stroke="#3e2723" strokeWidth="1"/>
        <rect x={4} y={4} width={w-8} height={h-8} fill="none" stroke="#5d4037" strokeWidth="1"/>
        <line x1={0} y1={0} x2={w} y2={h} stroke="#5d4037" strokeWidth="1"/>
        <line x1={w} y1={0} x2={0} y2={h} stroke="#5d4037" strokeWidth="1"/>
    </g>
);

const Bookshelf: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={0} y={0} width={w} height={h} fill="#5d4037" stroke="#3e2723" strokeWidth="1"/>
        {/* Books */}
        {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((x, i) => (
             <rect key={i} x={w*x} y={2} width={w*0.1} height={h-4} fill={['#b71c1c', '#0d47a1', '#1b5e20', '#f57f17'][i%4]} stroke="black" strokeWidth="0.5"/>
        ))}
    </g>
);

const Rug: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g>
        <rect x={0} y={0} width={w} height={h} fill="#b71c1c" />
        <rect x={4} y={4} width={w-8} height={h-8} fill="none" stroke="#ffc107" strokeWidth="2" />
        <circle cx={w/2} cy={h/2} r={Math.min(w,h)*0.2} fill="none" stroke="#ffc107" strokeWidth="2" />
        <path d={`M0 0 L-2 -2 M${w} 0 L${w+2} -2 M0 ${h} L-2 ${h+2} M${w} ${h} L${w+2} ${h+2}`} stroke="#ffc107" strokeWidth="2" />
    </g>
);

const Altar: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={0} y={0} width={w} height={h} fill="url(#pat-stone)" stroke="#37474f" strokeWidth="2"/>
        <rect x={w*0.1} y={h*0.1} width={w*0.8} height={h*0.8} fill="none" stroke="#546e7a" strokeWidth="1"/>
        <circle cx={w/2} cy={h/2} r={w*0.15} fill="none" stroke="red" strokeWidth="1"/>
        <path d={`M${w*0.3} ${h*0.3} L${w*0.7} ${h*0.7} M${w*0.7} ${h*0.3} L${w*0.3} ${h*0.7}`} stroke="red" strokeWidth="1" opacity="0.6"/>
    </g>
);

const Throne: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g filter="url(#shadow-soft)">
        <rect x={w*0.1} y={h*0.1} width={w*0.8} height={h*0.8} fill="#311b92" stroke="#ffd700" strokeWidth="2"/>
        <rect x={w*0.1} y={0} width={w*0.8} height={h*0.3} fill="#ffd700" stroke="#b8860b" strokeWidth="1"/> {/* Back high */}
        <circle cx={w*0.2} cy={h*0.8} r={w*0.1} fill="#ffd700"/> {/* Armrest L */}
        <circle cx={w*0.8} cy={h*0.8} r={w*0.1} fill="#ffd700"/> {/* Armrest R */}
    </g>
);

const Torch: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g>
        <circle cx={w/2} cy={h/2} r={w*0.4} fill="url(#grad-fire)" opacity="0.6">
             <animate attributeName="opacity" values="0.6;0.8;0.6" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={w/2} cy={h/2} r={w*0.1} fill="#ff5722"/>
    </g>
);

// --- Light & Effects ---

const Campfire: React.FC<{w: number, h: number}> = ({w, h}) => {
    const cx = w/2;
    const cy = h/2;
    return (
        <g>
            <circle cx={cx} cy={cy} r={w} fill="url(#grad-fire)" opacity="0.3" />
            <circle cx={cx} cy={cy} r={w*0.6} fill="url(#grad-fire)" opacity="0.5">
                 <animate attributeName="r" values={`${w*0.6};${w*0.65};${w*0.6}`} dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x={cx-w*0.3} y={cy-2} width={w*0.6} height={4} fill="#3e2723" transform={`rotate(45, ${cx}, ${cy})`} rx="2"/>
            <rect x={cx-w*0.3} y={cy-2} width={w*0.6} height={4} fill="#3e2723" transform={`rotate(-45, ${cx}, ${cy})`} rx="2"/>
            <circle cx={cx} cy={cy} r={w*0.2} fill="#ff5722" />
        </g>
    )
};

const MagicCircle: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g>
        <circle cx={w/2} cy={h/2} r={w/2} fill="url(#grad-magic)" opacity="0.3" />
        <circle cx={w/2} cy={h/2} r={w/2-2} fill="none" stroke="#d500f9" strokeWidth="2" />
        <path d={`M${w/2} ${4} L${w-4} ${h-4} L${4} ${h-4} Z`} fill="none" stroke="#aa00ff" strokeWidth="2" />
        <path d={`M${w/2} ${h-4} L${4} ${4} L${w-4} ${4} Z`} fill="none" stroke="#aa00ff" strokeWidth="2" opacity="0.5" />
        <circle cx={w/2} cy={h/2} r={w/5} fill="none" stroke="#ea80fc" strokeWidth="1">
             <animateTransform attributeName="transform" type="rotate" from={`0 ${w/2} ${h/2}`} to={`360 ${w/2} ${h/2}`} dur="10s" repeatCount="indefinite" />
        </circle>
    </g>
);

const BloodSplatter: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g opacity="0.8">
        <path d={`M${w/2} ${h/2} Q${w*0.8} ${h*0.2} ${w*0.9} ${h*0.5} T${w*0.7} ${h*0.9} T${w*0.2} ${h*0.8} T${w*0.1} ${h*0.4} Z`} fill="#b71c1c" />
        <circle cx={w*0.2} cy={h*0.3} r={w*0.05} fill="#b71c1c" />
        <circle cx={w*0.8} cy={h*0.8} r={w*0.08} fill="#b71c1c" />
        <circle cx={w*0.9} cy={h*0.2} r={w*0.03} fill="#b71c1c" />
    </g>
);

const SlimePuddle: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g opacity="0.8">
        <path d={`M${w/2} ${h/2} Q${w*0.9} ${h*0.1} ${w*0.8} ${h*0.6} T${w*0.5} ${h*0.9} T${w*0.1} ${h*0.5} Z`} fill="url(#grad-slime)" />
        <circle cx={w*0.4} cy={h*0.4} r={w*0.05} fill="white" opacity="0.5"/>
        <circle cx={w*0.6} cy={h*0.7} r={w*0.03} fill="white" opacity="0.5"/>
    </g>
);

const ScorchMark: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g opacity="0.7">
        <radialGradient id="grad-scorch">
            <stop offset="0%" stopColor="#000" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        <circle cx={w/2} cy={h/2} r={w/2} fill="url(#grad-scorch)"/>
    </g>
);

const Rubble: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g>
         <path d={`M${w*0.2} ${h*0.2} L${w*0.4} ${h*0.1} L${w*0.5} ${h*0.3} Z`} fill="#9e9e9e"/>
         <rect x={w*0.6} y={h*0.6} width={w*0.2} height={h*0.2} fill="#757575" transform={`rotate(15, ${w*0.7}, ${h*0.7})`}/>
         <circle cx={w*0.4} cy={h*0.7} r={w*0.1} fill="#bdbdbd"/>
         <path d={`M${w*0.8} ${h*0.2} L${w*0.9} ${h*0.4} L${w*0.7} ${h*0.3} Z`} fill="#616161"/>
    </g>
);

const Web: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g opacity="0.6">
        <line x1={0} y1={0} x2={w} y2={h} stroke="#e0e0e0" strokeWidth="1" />
        <line x1={w} y1={0} x2={0} y2={h} stroke="#e0e0e0" strokeWidth="1" />
        <line x1={w/2} y1={0} x2={w/2} y2={h} stroke="#e0e0e0" strokeWidth="1" />
        <line x1={0} y1={h/2} x2={w} y2={h/2} stroke="#e0e0e0" strokeWidth="1" />
        <circle cx={w/2} cy={h/2} r={w*0.15} fill="none" stroke="#e0e0e0" strokeWidth="0.5" />
        <circle cx={w/2} cy={h/2} r={w*0.3} fill="none" stroke="#e0e0e0" strokeWidth="0.5" />
        <circle cx={w/2} cy={h/2} r={w*0.45} fill="none" stroke="#e0e0e0" strokeWidth="0.5" />
    </g>
);

const Bones: React.FC<{w: number, h: number}> = ({w, h}) => (
    <g>
        <line x1={w*0.2} y1={h*0.2} x2={w*0.8} y2={h*0.8} stroke="#eeeeee" strokeWidth="3" strokeLinecap="round"/>
        <line x1={w*0.8} y1={h*0.2} x2={w*0.2} y2={h*0.8} stroke="#eeeeee" strokeWidth="3" strokeLinecap="round"/>
        <circle cx={w/2} cy={h*0.2} r={w*0.1} fill="#eeeeee"/> {/* Skull */}
    </g>
);

// --- Main Exported Component ---

export const AssetRenderer: React.FC<ProceduralAssetProps> = ({ type, width, height, rotation = 0, imageUrl }) => {
    
    // Fallback for non-specific dimensions if needed
    const w = width || 100;
    const h = height || 100;

    const Component = useMemo(() => {
        if (type === 'custom_image' && imageUrl) {
             return <image href={imageUrl} width={w} height={h} preserveAspectRatio="none" />;
        }

        switch (type) {
            case 'stone_wall': return <StoneWall w={w} h={h} />;
            case 'wood_wall': return <WoodWall w={w} h={h} />;
            case 'brick_wall': return <BrickWall w={w} h={h} />;
            case 'door_closed': return <Door w={w} h={h} open={false} />;
            case 'door_open': return <Door w={w} h={h} open={true} />;
            case 'stairs_stone': return <Stairs w={w} h={h} material="stone" />;
            case 'stairs_wood': return <Stairs w={w} h={h} material="wood" />;
            case 'pillar_round': return <PillarRound w={w} h={h} />;
            case 'pillar_square': return <PillarSquare w={w} h={h} />;
            case 'bridge': return <Bridge w={w} h={h} />;
            case 'window': return <Window w={w} h={h} />;
            
            case 'tree_pine': return <TreePine w={w} h={h} />;
            case 'tree_oak': return <TreeOak w={w} h={h} />;
            case 'bush': return <Bush w={w} h={h} />;
            case 'rock_large': return <Rock w={w} h={h} />;
            case 'rock_cluster': return <RockCluster w={w} h={h} />;
            case 'log': return <Log w={w} h={h} />;
            case 'stump': return <Stump w={w} h={h} />;
            case 'mushroom_giant': return <Mushroom w={w} h={h} />;
            
            case 'table_rect': return <TableRect w={w} h={h} />;
            case 'table_round': return <TableRound w={w} h={h} />;
            case 'chair': return <Chair w={w} h={h} />;
            case 'bed_common': return <Bed w={w} h={h} />;
            case 'chest_closed': return <Chest w={w} h={h} open={false} />;
            case 'chest_open': return <Chest w={w} h={h} open={true} />;
            case 'barrel': return <Barrel w={w} h={h} />;
            case 'crate': return <Crate w={w} h={h} />;
            case 'bookshelf': return <Bookshelf w={w} h={h} />;
            case 'rug_red': return <Rug w={w} h={h} />;
            case 'altar': return <Altar w={w} h={h} />;
            case 'throne': return <Throne w={w} h={h} />;
            case 'campfire': return <Campfire w={w} h={h} />;
            case 'torch': return <Torch w={w} h={h} />;
            case 'magic_circle': return <MagicCircle w={w} h={h} />;
            
            case 'blood_splatter': return <BloodSplatter w={w} h={h} />;
            case 'slime_puddle': return <SlimePuddle w={w} h={h} />;
            case 'scorch_mark': return <ScorchMark w={w} h={h} />;
            case 'rubble': return <Rubble w={w} h={h} />;
            case 'web': return <Web w={w} h={h} />;
            case 'bones': return <Bones w={w} h={h} />;
            
            // Fallbacks for unimplemented types to avoid crashes
            default: return (
                <g>
                    <rect width={w} height={h} fill="#e0e0e0" stroke="black" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
                    <text x={w/2} y={h/2} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="black">{type}</text>
                </g>
            );
        }
    }, [type, w, h, imageUrl]);

    return (
        <svg 
            width={width} 
            height={height} 
            viewBox={`0 0 ${width} ${height}`} 
            style={{ transform: `rotate(${rotation}deg)`, overflow: 'visible' }}
        >
            <CommonDefs />
            {Component}
        </svg>
    );
};
