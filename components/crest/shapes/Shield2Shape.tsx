
import React from 'react';
import { CrestData } from '../../../types';

interface ShapeProps {
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  division: CrestData['division'];
}

export const Shield2Shape: React.FC<ShapeProps> = ({ primaryColor, secondaryColor, borderColor, division }) => {
  const shieldPath = "M4 4.75C4 3.7835 4.7835 3 5.75 3h12.5C19.2165 3 20 3.7835 20 4.75v10.5c0 3.235-3.0844 5.923-7.5342 6.6713a.75.75 0 0 1-.9316 0C7.0844 21.173 4 18.485 4 15.25V4.75Z";

  return (
    <g>
      {/* Background fill based on division */}
      {division === 'none' && <path d={shieldPath} fill={primaryColor} />}
      {division === 'perPale' && (
        <>
          <defs>
            <clipPath id="shield2-left"><rect x="0" y="0" width="12" height="24" /></clipPath>
            <clipPath id="shield2-right"><rect x="12" y="0" width="12" height="24" /></clipPath>
          </defs>
          <path d={shieldPath} fill={primaryColor} clipPath="url(#shield2-left)" />
          <path d={shieldPath} fill={secondaryColor} clipPath="url(#shield2-right)" />
        </>
      )}
      {division === 'perFess' && (
        <>
          <defs>
            <clipPath id="shield2-top"><rect x="0" y="0" width="24" height="12" /></clipPath>
            <clipPath id="shield2-bottom"><rect x="0" y="12" width="24" height="12" /></clipPath>
          </defs>
          <path d={shieldPath} fill={primaryColor} clipPath="url(#shield2-top)" />
          <path d={shieldPath} fill={secondaryColor} clipPath="url(#shield2-bottom)" />
        </>
      )}
      {division === 'perBend' && (
        <>
          <defs>
            <clipPath id="shield2-bend"><path d="M2 2 L22 2 L22 22 Z" /></clipPath>
          </defs>
          <path d={shieldPath} fill={secondaryColor} />
          <path d={shieldPath} fill={primaryColor} clipPath="url(#shield2-bend)" />
        </>
      )}

      {/* Border on top */}
      <path d={shieldPath} fill="none" stroke={division === 'none' ? secondaryColor : borderColor} strokeWidth="1.5" />
    </g>
  );
};
