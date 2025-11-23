
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'roll';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const bgColors = {
    success: 'bg-[var(--bg-secondary)] border-green-500 text-green-400',
    error: 'bg-[var(--bg-secondary)] border-red-500 text-red-400',
    info: 'bg-[var(--bg-secondary)] border-blue-500 text-blue-400',
    roll: 'bg-[var(--bg-secondary)] border-[var(--accent-primary)] text-[var(--accent-primary)]',
  };

  const icons = {
    success: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    error: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    info: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    roll: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l10 7.5v9L12 22 2 18.5v-9L12 2z"/><path d="M12 22V12"/><path d="M22 9.5L12 12"/><path d="M2 9.5l10 2.5"/><path d="M7 15.5l5-3 5 3"/><path d="M7.5 9.8L9.7 4.6"/></svg>
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-xl mb-3 animate-slide-in-right backdrop-blur-md bg-opacity-95 min-w-[300px] max-w-md pointer-events-auto ${bgColors[toast.type]}`}>
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-grow text-sm font-medium text-[var(--text-primary)]">{toast.message}</div>
      <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        &times;
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
