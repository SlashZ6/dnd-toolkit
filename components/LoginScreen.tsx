
import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Footer from './Footer';

interface LoginScreenProps {
  onLogin: (role: 'PLAYER' | 'DM') => void;
}

const PLAYER_CODE = 'dnd.player';
const DM_CODE = 'dnd.secretcode';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selection, setSelection] = useState<'PLAYER' | 'DM' | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "D&D Toolkit";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleSelect = (role: 'PLAYER' | 'DM') => {
    setSelection(role);
    setCode('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection) return;

    const correctCode = selection === 'PLAYER' ? PLAYER_CODE : DM_CODE;
    if (code === correctCode) {
      onLogin(selection);
    } else {
      setError('Incorrect code. Please try again.');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
  };

  const renderForm = () => {
    if (!selection) return null;
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-6 animate-fade-in">
        <h3 className="text-2xl font-medieval text-[var(--accent-primary)] mb-4">Enter Access Code for {selection}</h3>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border-primary)] rounded-lg p-3 text-lg text-center text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-secondary)] focus:outline-none transition-all"
          autoFocus
          aria-label="Access Code"
        />
        {error && <p className="text-red-400 text-sm mt-2 text-center h-5">{error}</p>}
        <Button type="submit" className="w-full mt-4" size="lg">
          Enter
        </Button>
        <Button variant="ghost" onClick={() => setSelection(null)} className="w-full mt-2">
          Back
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 text-center animate-fade-in">
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-6xl sm:text-7xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] text-glow-amber">D&D Toolkit</h1>
        <div className="w-48 h-1 mx-auto mt-4 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
        
        {!selection ? (
          <div className="mt-12">
            <h2 className="text-3xl font-medieval text-[var(--text-secondary)] mb-8">Choose your role</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={() => handleSelect('PLAYER')} className="group p-8 bg-[var(--bg-secondary)] rounded-xl border-2 border-[var(--border-primary)] hover:border-[var(--border-accent-secondary)] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_var(--glow-secondary)] hover:-translate-y-1 w-64">
                <h3 className="text-4xl font-medieval text-[var(--text-primary)] group-hover:text-[var(--accent-secondary)] transition-colors">Player</h3>
                <p className="text-[var(--text-muted)] mt-2">Manage your characters, track your adventures, and roll the dice.</p>
              </button>
              <button onClick={() => handleSelect('DM')} className="group p-8 bg-[var(--bg-secondary)] rounded-xl border-2 border-[var(--border-primary)] hover:border-[var(--border-accent-primary)] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_var(--glow-primary)] hover:-translate-y-1 w-64">
                <h3 className="text-4xl font-medieval text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">Dungeon Master</h3>
                <p className="text-[var(--text-muted)] mt-2">Craft your world, manage campaigns, and challenge your players.</p>
              </button>
            </div>
          </div>
        ) : (
          renderForm()
        )}
      </main>
      <Footer className="max-w-screen-2xl" />
    </div>
  );
};

export default LoginScreen;
