
import React from 'react';
import { CrestData } from '../../../types';

interface ShapeProps {
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  division: CrestData['division'];
}

export const Shield1Shape: React.FC<ShapeProps> = ({ primaryColor, secondaryColor, borderColor, division }) => {
  const shieldPath = "M12 2L3 5v6c0 5 9 11 9 11s9-6 9-11V5L12 2Z";

  return (
    <g>
      {/* Background fill based on division */}
      {division === 'none' && <path d={shieldPath} fill={primaryColor} />}
      {division === 'perPale' && ( // Vertical split
        <>
          <defs>
            <clipPath id="shield1-left"><rect x="0" y="0" width="12" height="24" /></clipPath>
            <clipPath id="shield1-right"><rect x="12" y="0" width="12" height="24" /></clipPath>
          </defs>
          <path d={shieldPath} fill={primaryColor} clipPath="url(#shield1-left)" />
          <path d={shieldPath} fill={secondaryColor} clipPath="url(#shield1-right)" />
        </>
      )}
      {division === 'perFess' && ( // Horizontal split
        <>
          <defs>
            <clipPath id="shield1-top"><rect x="0" y="0" width="24" height="12" /></clipPath>
            <clipPath id="shield1-bottom"><rect x="0" y="12" width="24" height="12" /></clipPath>
          </defs>
          <path d={shieldPath} fill={primaryColor} clipPath="url(#shield1-top)" />
          <path d={shieldPath} fill={secondaryColor} clipPath="url(#shield1-bottom)" />
        </>
      )}
      {division === 'perBend' && ( // Diagonal split
        <>
          <defs>
            <clipPath id="shield1-bend"><path d="M2 2 L22 2 L22 22 Z" /></clipPath>
          </defs>
          <path d={shieldPath} fill={secondaryColor} />
          <path d={shieldPath} fill={primaryColor} clipPath="url(#shield1-bend)" />
        </>
      )}

      {/* Border on top */}
      <path d={shieldPath} fill="none" stroke={division === 'none' ? secondaryColor : borderColor} strokeWidth="1.5" />
    </g>
  );
};
