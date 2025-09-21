
import React from 'react';
import { CrestData } from '../../../types';

interface ShapeProps {
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  division: CrestData['division'];
}

export const CircleShape: React.FC<ShapeProps> = ({ primaryColor, secondaryColor, borderColor, division }) => {
  return (
    <g>
      {/* Background fill based on division */}
      {division === 'none' && <circle cx="12" cy="12" r="11" fill={primaryColor} />}
      {division === 'perPale' && ( // Vertical split
        <>
          <defs>
            <clipPath id="circle-left"><rect x="0" y="0" width="12" height="24" /></clipPath>
            <clipPath id="circle-right"><rect x="12" y="0" width="12" height="24" /></clipPath>
          </defs>
          <circle cx="12" cy="12" r="11" fill={primaryColor} clipPath="url(#circle-left)" />
          <circle cx="12" cy="12" r="11" fill={secondaryColor} clipPath="url(#circle-right)" />
        </>
      )}
      {division === 'perFess' && ( // Horizontal split
        <>
          <defs>
            <clipPath id="circle-top"><rect x="0" y="0" width="24" height="12" /></clipPath>
            <clipPath id="circle-bottom"><rect x="0" y="12" width="24" height="12" /></clipPath>
          </defs>
          <circle cx="12" cy="12" r="11" fill={primaryColor} clipPath="url(#circle-top)" />
          <circle cx="12" cy="12" r="11" fill={secondaryColor} clipPath="url(#circle-bottom)" />
        </>
      )}
      {division === 'perBend' && ( // Diagonal split
        <>
          <defs>
            <clipPath id="circle-bend"><path d="M1 1 L23 1 L23 23 Z" /></clipPath>
          </defs>
          <circle cx="12" cy="12" r="11" fill={secondaryColor} />
          <circle cx="12" cy="12" r="11" fill={primaryColor} clipPath="url(#circle-bend)" />
        </>
      )}
      {/* Border and inner ring */}
      <circle cx="12" cy="12" r="11" fill="none" stroke={borderColor} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="9" fill="none" stroke={division === 'none' ? secondaryColor : borderColor} strokeWidth="1" />
    </g>
  );
};
