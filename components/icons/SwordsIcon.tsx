
import React from 'react';

export const SwordsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M14.5 17.5l-5-5" />
    <path d="M21 3l-6 6" />
    <path d="M3 3l6 6" />
    <path d="M11 21V10c0-1.7 1.3-3 3-3s3 1.3 3 3v2" />
    <path d="M13 3V10c0 1.7-1.3 3-3 3s-3-1.3-3-3V1" />
  </svg>
);
