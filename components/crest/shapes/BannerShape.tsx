
import React from 'react';
import { CrestData } from '../../../types';

interface ShapeProps {
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  division: CrestData['division'];
}

export const BannerShape: React.FC<ShapeProps> = ({ primaryColor, secondaryColor, borderColor, division }) => {
  const bannerPath = "M4 22V4h16v12l-8 6-8-6";

  return (
    <g>
      {/* Background fill based on division */}
      {division === 'none' && <path d={bannerPath} fill={primaryColor} />}
      {division === 'perPale' && (
        <>
          <defs>
            <clipPath id="banner-left"><rect x="0" y="0" width="12" height="24" /></clipPath>
            <clipPath id="banner-right"><rect x="12" y="0" width="12" height="24" /></clipPath>
          </defs>
          <path d={bannerPath} fill={primaryColor} clipPath="url(#banner-left)" />
          <path d={bannerPath} fill={secondaryColor} clipPath="url(#banner-right)" />
        </>
      )}
      {division === 'perFess' && (
        <>
          <defs>
            <clipPath id="banner-top"><rect x="0" y="0" width="24" height="12" /></clipPath>
            <clipPath id="banner-bottom"><rect x="0" y="12" width="24" height="12" /></clipPath>
          </defs>
          <path d={bannerPath} fill={primaryColor} clipPath="url(#banner-top)" />
          <path d={bannerPath} fill={secondaryColor} clipPath="url(#banner-bottom)" />
        </>
      )}
      {division === 'perBend' && (
        <>
          <defs>
            <clipPath id="banner-bend"><path d="M2 2 L22 2 L22 22 Z" /></clipPath>
          </defs>
          <path d={bannerPath} fill={secondaryColor} />
          <path d={bannerPath} fill={primaryColor} clipPath="url(#banner-bend)" />
        </>
      )}

      {/* Border */}
      <path d={bannerPath} fill="none" stroke={division === 'none' ? secondaryColor : borderColor} strokeWidth="1.5" />
    </g>
  );
};
