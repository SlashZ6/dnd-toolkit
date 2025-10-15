import React from 'react';

export const SpellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m12 3-1.5 3-3-1.5.5 3.5-3.5.5 1.5 3-3 1.5 3.5.5-.5 3.5 3-1.5 1.5 3 1.5-3 3 1.5-.5-3.5 3.5-.5-1.5-3 3-1.5-3.5-.5.5-3.5-3 1.5Z" />
  </svg>
);
