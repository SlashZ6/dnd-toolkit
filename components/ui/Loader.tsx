
import React from 'react';
import { D20Icon } from '../icons/D20Icon';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)]">
      <D20Icon className="h-16 w-16 text-[var(--accent-secondary)] animate-spin" />
      <p className="mt-4 text-xl font-medieval text-[var(--accent-primary)]">{message}</p>
    </div>
  );
};

export default Loader;