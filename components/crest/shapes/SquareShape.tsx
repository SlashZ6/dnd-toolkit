
import React from 'react';
import { CrestData } from '../../../types';

interface ShapeProps {
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  division: CrestData['division'];
}

export const SquareShape: React.FC<ShapeProps> = ({ primaryColor, secondaryColor, borderColor, division }) => {
  const squarePath = "M4 4h16v16H4z";
  const roundedRect = <rect x="3" y="3" width="18" height="18" rx="2" />;

  return (
    <g>
      {/* Background fill based on division */}
      {division === 'none' && <rect x="3" y="3" width="18" height="18" rx="2" fill={primaryColor} />}
      {division === 'perPale' && (
        <>
          <defs><clipPath id="square-left"><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
          <rect x="3" y="3" width="18" height="18" rx="2" fill={primaryColor} clipPath="url(#square-left)" />
          <defs><clipPath id="square-right"><rect x="12" y="0" width="12" height="24" /></clipPath></defs>
          <rect x="3" y="3" width="18" height="18" rx="2" fill={secondaryColor} clipPath="url(#square-right)" />
        </>
      )}
      {division === 'perFess' && (
        <>
          <defs><clipPath id="square-top"><rect x="0" y="0" width="24" height="12" /></clipPath></defs>
          <rect x="3" y="3" width="18" height="18" rx="2" fill={primaryColor} clipPath="url(#square-top)" />
          <defs><clipPath id="square-bottom"><rect x="0" y="12" width="24" height="12" /></clipPath></defs>
          <rect x="3" y="3" width="18" height="18" rx="2" fill={secondaryColor} clipPath="url(#square-bottom)" />
        </>
      )}
      {division === 'perBend' && (
        <>
          <defs><clipPath id="square-bend"><path d="M3 3 L21 3 L21 21 Z" /></clipPath></defs>
          <rect x="3" y="3" width="18" height="18" rx="2" fill={secondaryColor} />
          <rect x="3" y="3" width="18" height="18" rx="2" fill={primaryColor} clipPath="url(#square-bend)" />
        </>
      )}
      {/* Border */}
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke={division === 'none' ? secondaryColor : borderColor} strokeWidth="1.5" />
    </g>
  );
};
