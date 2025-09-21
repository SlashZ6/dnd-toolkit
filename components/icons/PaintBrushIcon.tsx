
import React from 'react';

export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M12.5 2.5a2.5 2.5 0 0 0-5 0v3h5v-3z" />
        <path d="M16.5 6.5a2.5 2.5 0 0 0-5 0v3h5v-3z" />
        <path d="M12 12.5a2.5 2.5 0 0 1 5 0v3h-5v-3z" />
        <path d="M7.5 12.5a2.5 2.5 0 0 0-5 0v3h5v-3z" />
        <path d="M12 13h-2.5a1.5 1.5 0 0 0-1.5 1.5V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6.5a1.5 1.5 0 0 0-1.5-1.5H12Z" />
    </svg>
);
