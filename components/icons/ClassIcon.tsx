import React from 'react';

export const ClassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 2l-5.5 3v6l5.5 3 5.5-3V5l-5.5-3z" />
    <path d="M12 4.3l3.5 1.9v3.6l-3.5 1.9-3.5-1.9V6.2L12 4.3z" />
    <path d="M2 11l10 5 10-5" />
    <path d="M2 17l10 5 10-5" />
  </svg>
);
