
import React from 'react';
import Button from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'ghost';
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'destructive',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      aria-labelledby="dialog-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl shadow-black/50 p-6 m-4 max-w-sm w-full border border-[var(--border-primary)]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        <h2 id="dialog-title" className="text-2xl font-medieval text-[var(--accent-primary)] mb-2">{title}</h2>
        <p className="text-[var(--text-secondary)] mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost">{cancelText}</Button>
          <Button onClick={onConfirm} variant={confirmVariant}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;