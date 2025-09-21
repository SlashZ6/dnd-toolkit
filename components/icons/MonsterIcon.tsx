
import React from 'react';

export const MonsterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M11.25 4.75a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5Z"/>
    <path d="M12.75 4.75a2.5 2.5 0 1 1 0 5 2.5 2.5 0 1 1 0-5Z"/>
    <path d="M14 10.5c-2.5-1-5.5-1-8 0"/>
    <path d="M5.5 13.5c1 2 2.5 3 4.5 3s3.5-1 4.5-3"/>
    <path d="M4 19.5c-1-2-1.5-4-1.5-6 0-3.5 2-6.5 5-8"/>
    <path d="M21.5 13.5c0-3.5-2-6.5-5-8-1.5 1-2.5 2.5-3 4"/>
    <path d="M20 19.5c1-2 1.5-4 1.5-6"/>
  </svg>
);
