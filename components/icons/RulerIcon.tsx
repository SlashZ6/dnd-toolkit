import React from 'react';

export const RulerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M21.1 6.7l-4.2-4.2a2 2 0 0 0-2.8 0L2.9 13.7a2 2 0 0 0 0 2.8l4.2 4.2a2 2 0 0 0 2.8 0l11.2-11.2a2 2 0 0 0 0-2.8z"/>
    <path d="m22 2-1.5 1.5"/>
    <path d="m15.5 8.5 2 2"/>
    <path d="m13 11 2 2"/>
    <path d="m10.5 13.5 2 2"/>
    <path d="m8 16 2 2"/>
    <path d="m5.5 18.5 2 2"/>
    <path d="m2 22 1.5-1.5"/>
  </svg>
);
