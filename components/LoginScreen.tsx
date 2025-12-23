
import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Footer from './Footer';

interface LoginScreenProps {
  onLogin: (role: 'PLAYER' | 'DM') => void;
}

const PLAYER_CODE = 'dnd.player';
const DM_CODE = 'dnd.secretcode';

// Custom Filled Icons for the Login Screen Graphic
const ShieldGraphic = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z" />
  </svg>
);

const CrownGraphic = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V18H19V19Z" />
  </svg>
);

const RoleCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300 w-full md:w-72 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-[#0b0d14]"
    >
        <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
            {icon}
        </div>
        <h3 className="text-2xl font-medieval text-slate-200 mb-3 tracking-wide group-hover:text-white transition-colors">
            {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
            {description}
        </p>
    </button>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selection, setSelection] = useState<'PLAYER' | 'DM' | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "D&D Toolkit - Login";
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

  return (
    <div className="min-h-screen bg-[#0b0d14] flex flex-col items-center font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      
      {/* Ambient Light Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top center blue glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen opacity-60" />
        {/* Subtle amber glow near bottom/center for warmth */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-amber-500/5 rounded-full blur-[130px] mix-blend-screen opacity-40" />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center w-full px-4 py-12 animate-fade-in max-w-7xl mx-auto z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-medieval text-amber-400 drop-shadow-md mb-4 tracking-wider">
                D&D Toolkit
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-4 opacity-50">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-500"></div>
                <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-500"></div>
            </div>

            <p className="text-slate-500 font-serif italic text-lg tracking-wide">
                Your adventure begins here.
            </p>
        </div>

        {/* Dynamic Content: Selection or Form */}
        <div className="w-full flex justify-center min-h-[300px]">
            {!selection ? (
                <div className="w-full flex flex-col items-center animate-fade-in">
                    <h2 className="text-slate-400 font-serif mb-8 tracking-widest uppercase text-xs font-bold">
                        Choose your path
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-stretch">
                        <RoleCard 
                            title="Player"
                            description="Manage your hero, track your loot, and roll for glory."
                            icon={<ShieldGraphic className="w-16 h-16 text-blue-500" />}
                            onClick={() => handleSelect('PLAYER')}
                        />
                        <RoleCard 
                            title="Dungeon Master"
                            description="Craft worlds, manage monsters, and guide the story."
                            icon={<CrownGraphic className="w-16 h-16 text-amber-500" />}
                            onClick={() => handleSelect('DM')}
                        />
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-sm animate-fade-in flex flex-col items-center">
                    <div className="mb-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-800">
                             {selection === 'PLAYER' 
                                ? <ShieldGraphic className="w-8 h-8 text-blue-500" /> 
                                : <CrownGraphic className="w-8 h-8 text-amber-500" />
                             }
                        </div>
                        <h3 className="text-2xl font-medieval text-slate-200">
                            {selection === 'PLAYER' ? 'Player Access' : 'DM Access'}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="space-y-1">
                            <input
                                type="password"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-center text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all duration-200 font-mono text-lg"
                                placeholder="Enter Access Code"
                                autoFocus
                                aria-label="Access Code"
                            />
                            <div className="h-5 text-center">
                                {error && <span className="text-red-400 text-xs font-medium">{error}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                type="submit"
                                className="w-full bg-slate-200 hover:bg-white text-slate-900 font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                Enter
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setSelection(null)}
                                className="w-full text-slate-500 hover:text-slate-300 py-2 text-sm transition-colors"
                            >
                                ← Go Back
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>

      </main>

      {/* Footer */}
      <Footer className="pb-6 pt-0 border-t-0 opacity-40 hover:opacity-100 transition-opacity duration-500 relative z-10" />
    </div>
  );
};

export default LoginScreen;
