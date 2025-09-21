import React from 'react';
import { CrestData } from '../../types';
import { Shield1Shape } from './shapes/Shield1Shape';
import { Shield2Shape } from './shapes/Shield2Shape';
import { CircleShape } from './shapes/CircleShape';
import { SquareShape } from './shapes/SquareShape';
import { DiamondShape } from './shapes/DiamondShape';
import { BannerShape } from './shapes/BannerShape';
import * as Symbols from './symbols';


interface CrestDisplayProps {
  crestData: Partial<CrestData>;
  size?: number;
}

const SHAPES: { [key: string]: React.FC<any> } = {
  shield1: Shield1Shape,
  shield2: Shield2Shape,
  circle: CircleShape,
  square: SquareShape,
  diamond: DiamondShape,
  banner: BannerShape,
};

const SYMBOLS: { [key: string]: React.FC<any> } = {
  lion: Symbols.LionSymbol,
  dragon: Symbols.DragonSymbol,
  griffin: Symbols.GriffinSymbol,
  wolf: Symbols.WolfSymbol,
  sword: Symbols.SwordSymbol,
  tower: Symbols.TowerSymbol,
  skull: Symbols.SkullSymbol,
  sun: Symbols.SunSymbol,
  flame: Symbols.FlameSymbol,
  mountain: Symbols.MountainSymbol,
  tree: Symbols.TreeSymbol,
  ship: Symbols.ShipSymbol,
  book: Symbols.BookSymbol,
  key: Symbols.KeySymbol,
  crown: Symbols.CrownSymbol,
  eye: Symbols.EyeSymbol,
  star: Symbols.StarSymbol, // Added new symbol
};

// Utility to darken a hex color
const darkenColor = (hex: string, percent: number): string => {
  if (!/^#([A-Fa-f09]{3}){1,2}$/.test(hex)) {
    return hex; // Return original if not a valid hex
  }
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = Math.floor(R * (100 - percent) / 100);
  G = Math.floor(G * (100 - percent) / 100);
  B = Math.floor(B * (100 - percent) / 100);

  R = (R < 255) ? R : 255;  
  G = (G < 255) ? G : 255;  
  B = (B < 255) ? B : 255;  

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};


export const CrestDisplay: React.FC<CrestDisplayProps> = ({ crestData, size = 100 }) => {
  const { 
    shape = 'shield1', 
    symbol = 'star', 
    primaryColor = '#475569', 
    secondaryColor = '#e2e8f0', 
    symbolColor = '#1e293b', 
    division = 'none' 
  } = crestData;

  const ShapeComponent = SHAPES[shape];
  const SymbolComponent = SYMBOLS[symbol];
  
  const borderColor = darkenColor(primaryColor, 30);

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.1))' }}>
      {ShapeComponent && <ShapeComponent 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
        borderColor={borderColor}
        division={division}
      />}
      {SymbolComponent && <SymbolComponent symbolColor={symbolColor} />}
    </svg>
  );
};