
import React, { useEffect } from 'react';

export const RollingDiceAnimation: React.FC<{ onComplete: () => void, diceCount?: number }> = ({ onComplete, diceCount = 1 }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1800); // Animation duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    const DiceCube = ({ delay = 0, className = "" }: { delay?: number, className?: string }) => (
        <div className={`dice-cube w-20 h-20 absolute transform-style-3d animate-tumble ${className}`} style={{ animationDelay: `${delay}s` }}>
            <div className="face front bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">20</div>
            <div className="face back bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">1</div>
            <div className="face right bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">15</div>
            <div className="face left bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">5</div>
            <div className="face top bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">10</div>
            <div className="face bottom bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_var(--glow-primary)]">12</div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-vignette animate-fade-in pointer-events-auto">
            <div className="relative w-60 h-40 perspective-1000 flex items-center justify-center">
                <DiceCube className={diceCount > 1 ? "-translate-x-12" : ""} />
                {diceCount > 1 && <DiceCube delay={-0.5} className="translate-x-12" />}
            </div>
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .face { position: absolute; width: 80px; height: 80px; opacity: 0.9; border-radius: 12px; backface-visibility: hidden; }
                .face.front  { transform: translateZ(40px); }
                .face.back   { transform: rotateY(180deg) translateZ(40px); }
                .face.right  { transform: rotateY(90deg) translateZ(40px); }
                .face.left   { transform: rotateY(-90deg) translateZ(40px); }
                .face.top    { transform: rotateX(90deg) translateZ(40px); }
                .face.bottom { transform: rotateX(-90deg) translateZ(40px); }
                .face.top { background-color: var(--bg-secondary); }
                @keyframes tumble {
                    0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
                    25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
                    50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
                    75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg); }
                    100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(360deg); }
                }
                .animate-tumble { animation: tumble 1.2s cubic-bezier(0.25, 1, 0.5, 1) infinite; }
            `}</style>
        </div>
    );
};
