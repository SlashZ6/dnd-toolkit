
import React from 'react';
import { CrestData } from '../../../types';

interface ShapeProps {
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  division: CrestData['division'];
}

export const DiamondShape: React.FC<ShapeProps> = ({ primaryColor, secondaryColor, borderColor, division }) => {
  const diamondPath = "M12 2 22 12 12 22 2 12 12 2Z";

  return (
    <g>
      {/* Background fill based on division */}
      {division === 'none' && <path d={diamondPath} fill={primaryColor} />}
      {division === 'perPale' && (
        <>
          <defs><clipPath id="diamond-left"><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
          <path d={diamondPath} fill={primaryColor} clipPath="url(#diamond-left)" />
          <defs><clipPath id="diamond-right"><rect x="12" y="0" width="12" height="24" /></clipPath></defs>
          <path d={diamondPath} fill={secondaryColor} clipPath="url(#diamond-right)" />
        </>
      )}
      {division === 'perFess' && (
        <>
          <defs><clipPath id="diamond-top"><rect x="0" y="0" width="24" height="12" /></clipPath></defs>
          <path d={diamondPath} fill={primaryColor} clipPath="url(#diamond-top)" />
          <defs><clipPath id="diamond-bottom"><rect x="0" y="12" width="24" height="12" /></clipPath></defs>
          <path d={diamondPath} fill={secondaryColor} clipPath="url(#diamond-bottom)" />
        </>
      )}
      {division === 'perBend' && (
        <>
          <defs><clipPath id="diamond-bend"><path d="M2 2 L22 2 L22 22 Z" /></clipPath></defs>
          <path d={diamondPath} fill={secondaryColor} />
          <path d={diamondPath} fill={primaryColor} clipPath="url(#diamond-bend)" />
        </>
      )}
      {/* Border */}
      <path d={diamondPath} fill="none" stroke={division === 'none' ? secondaryColor : borderColor} strokeWidth="1.5" />
    </g>
  );
};
