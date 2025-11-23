

import React from 'react';
import Button from './Button';

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

const InfoDialog: React.FC<InfoDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actionText,
  onAction,
  actionDisabled = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-vignette flex items-center justify-center z-50 animate-fade-in"
      aria-labelledby="dialog-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl shadow-black/50 p-6 m-4 max-w-lg w-full border border-[var(--border-primary)] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 id="dialog-title" className="text-2xl font-medieval text-[var(--accent-primary)] break-words">{title}</h2>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-3xl leading-none flex-shrink-0 ml-4">&times;</button>
        </div>
        <div className="overflow-y-auto flex-grow mb-6 text-[var(--text-secondary)] whitespace-pre-wrap">
            {children}
        </div>
        <div className="flex justify-end gap-3 flex-shrink-0 pt-4 border-t border-[var(--border-primary)]">
          <Button onClick={onClose} variant="ghost">Close</Button>
          {actionText && onAction && (
              <Button onClick={onAction} disabled={actionDisabled}>{actionText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;