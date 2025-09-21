
import React from 'react';

export const D20Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 2l10 7.5v9L12 22 2 18.5v-9L12 2z" />
    <path d="M12 22V12" />
    <path d="M22 9.5L12 12" />
    <path d="M2 9.5l10 2.5" />
    <path d="M7 15.5l5-3 5 3" />
    <path d="M7.5 9.8L9.7 4.6" />
  </svg>
);
