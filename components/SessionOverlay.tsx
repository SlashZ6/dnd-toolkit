
import React, { useState, useEffect } from 'react';
import { ChatMessage, Character, Theme, ContentPayload } from '../types';
import { StarSymbol, SkullSymbol } from './crest/symbols';
import Button from './ui/Button';
import { useToast } from './ui/Toast';
import { RollResult } from './DiceRoller';

interface SessionOverlayProps {
    isDM: boolean;
    currentUserId?: string; // New prop to identify sender for Ready checks
    messages: ChatMessage[];
    publishMessage: (type: ChatMessage['type'], payload: ChatMessage['payload']) => void;
    setTheme: (theme: Theme) => void;
    currentTheme: Theme;
}

interface Spark {
    id: string;
    x: number; // percentage
    y: number; // percentage
    createdAt: number;
    type: 'INSPIRATION' | 'DOOM';
}

interface SpotlightState {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    active: boolean;
}

interface ReadyCheckState {
    id: string;
    active: boolean;
}

interface InspirationNotificationState {
    active: boolean;
    playerName: string;
}

// Visual component for shared roll
const RollNotification: React.FC<{ roll: RollResult, userName: string }> = ({ roll, userName }) => {
    return (
        <div className={`
            flex flex-col items-center justify-center p-6 rounded-xl border-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] transform animate-scale-in backdrop-blur-md min-w-[280px]
            ${roll.isCrit ? 'bg-green-900/90 border-green-400' : roll.isFumble ? 'bg-red-900/90 border-red-500' : 'bg-slate-900/90 border-[var(--accent-primary)]'}
        `}>
            <div className="text-sm font-bold uppercase tracking-wider mb-2 text-white/80">{userName} rolled</div>
            <div className={`text-6xl font-black font-medieval drop-shadow-lg mb-2 ${roll.isCrit ? 'text-green-300' : roll.isFumble ? 'text-red-300' : 'text-[var(--accent-primary)]'}`}>
                {roll.total}
            </div>
            <div className="text-xs font-mono text-white/60 bg-black/30 px-2 py-1 rounded">
                {roll.title} • {roll.formula}
            </div>
            {roll.isCrit && <div className="text-green-400 font-bold mt-2 animate-pulse">NATURAL 20!</div>}
            {roll.isFumble && <div className="text-red-400 font-bold mt-2 animate-pulse">CRITICAL FAIL!</div>}
        </div>
    );
};

export const SessionOverlay: React.FC<SessionOverlayProps> = ({ isDM, currentUserId, messages, publishMessage, setTheme, currentTheme }) => {
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [corruption, setCorruption] = useState(0); // 0 to 100
    
    const [spotlight, setSpotlight] = useState<SpotlightState>({ active: false, title: '' });
    const [readyCheck, setReadyCheck] = useState<ReadyCheckState>({ id: '', active: false });
    const [inspirationNotification, setInspirationNotification] = useState<InspirationNotificationState>({ active: false, playerName: '' });
    const [screenShake, setScreenShake] = useState(false);
    const [critFlash, setCritFlash] = useState<'CRIT' | 'FUMBLE' | null>(null);
    
    // Queue for rolls to show multiple in sequence/stack
    const [activeRolls, setActiveRolls] = useState<{ id: string, roll: RollResult, user: string }[]>([]);

    const { addToast } = useToast();

    // --- EFFECT: Listen for Control Messages & Rolls ---
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (!lastMsg) return;

        // Prevent processing really old messages on load
        if (Date.now() - lastMsg.timestamp > 3000) return;

        if (lastMsg.type === 'session_control') {
            const payload = lastMsg.payload as ContentPayload;
            if (payload.control) {
                const { type, value, id, x, y, spotlightData, readyCheckId } = payload.control;

                switch (type) {
                    case 'SET_THEME':
                        if (value && value !== currentTheme) {
                            setTheme(value as Theme);
                        }
                        break;
                    case 'SPAWN_SPARK':
                        if (!isDM) {
                             const newSpark: Spark = {
                                 id: id || String(Date.now()),
                                 x: x || 50,
                                 y: y || 50,
                                 createdAt: Date.now(),
                                 type: value === 'DOOM' ? 'DOOM' : 'INSPIRATION'
                             };
                             setSparks(prev => [...prev, newSpark]);
                             
                             if (navigator.vibrate) {
                                 navigator.vibrate(value === 'DOOM' ? [100, 50, 100, 50, 500] : 200);
                             }
                        }
                        break;
                    case 'SPOTLIGHT':
                        if (spotlightData) {
                            setSpotlight({ active: true, ...spotlightData });
                        } else {
                            // Empty data means clear
                            setSpotlight({ active: false, title: '' });
                        }
                        break;
                    case 'READY_CHECK':
                        // DM shouldn't see their own ready check modal
                        if (!isDM && readyCheckId) {
                            setReadyCheck({ id: readyCheckId, active: true });
                        }
                        break;
                }
            }
        } else if (lastMsg.type === 'roll_share') {
            const payload = lastMsg.payload as ContentPayload;
            if (payload.roll) {
                // Add to active rolls queue
                const rollId = String(Date.now() + Math.random());
                
                // Construct a complete RollResult object from the partial data
                const receivedRoll: RollResult = {
                    id: rollId,
                    title: payload.roll.title,
                    total: payload.roll.total,
                    formula: payload.roll.formula,
                    isCrit: !!payload.roll.isCrit,
                    isFumble: !!payload.roll.isFumble,
                    rolls: [], // No individual rolls data in simple share
                    finalRoll: payload.roll.total, // Fallback
                    timestamp: lastMsg.timestamp
                };

                setActiveRolls(prev => [...prev, { id: rollId, roll: receivedRoll, user: lastMsg.user }]);
                
                // Auto-remove after 4 seconds
                setTimeout(() => {
                    setActiveRolls(prev => prev.filter(r => r.id !== rollId));
                }, 4000);

                if (payload.roll.isCrit) {
                    setCritFlash('CRIT');
                    setScreenShake(true);
                    setTimeout(() => { setCritFlash(null); setScreenShake(false); }, 1500);
                    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                } else if (payload.roll.isFumble) {
                    setCritFlash('FUMBLE');
                    setScreenShake(true);
                    setTimeout(() => { setCritFlash(null); setScreenShake(false); }, 1500);
                    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
                }
            }
        } else if (lastMsg.type === 'inspiration_claim') {
            // Only DM listens for this
            if (isDM) {
                setInspirationNotification({ active: true, playerName: lastMsg.user });
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            }
        }

    }, [messages, isDM, currentTheme, setTheme, addToast]);

    // --- EFFECT: Spark Expiry & Doom Logic ---
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            
            setSparks(prev => {
                const remaining = [];
                let damageTaken = 0;

                prev.forEach(s => {
                    const age = now - s.createdAt;
                    const lifetime = s.type === 'DOOM' ? 5000 : 4000;
                    
                    if (age < lifetime) {
                        remaining.push(s);
                    } else {
                        // Expired!
                        if (s.type === 'DOOM') {
                            damageTaken += 100; // Full corruption
                        }
                    }
                });

                if (damageTaken > 0) {
                    setCorruption(100); 
                }
                
                return remaining;
            });

        }, 100);
        return () => clearInterval(interval);
    }, []);

    // --- ACTIONS ---

    const handleInteractSpark = (spark: Spark) => {
        setSparks(prev => prev.filter(s => s.id !== spark.id));
        if (spark.type === 'INSPIRATION') {
            // Send claim message to DM
            publishMessage('inspiration_claim', {});
        }
    };

    const handleRestoreSanity = () => {
        setCorruption(prev => Math.max(0, prev - 15)); 
    };
    
    const handleReadyCheck = (isReady: boolean) => {
        publishMessage('ready_response', {
            readyResponse: {
                checkId: readyCheck.id,
                userId: currentUserId || 'unknown',
                isReady
            }
        });
        setReadyCheck(prev => ({...prev, active: false}));
    };

    // --- RENDER ---

    return (
        <>
            {/* GLOBAL VFX CONTAINER */}
            <div className={`fixed inset-0 pointer-events-none z-[100] overflow-hidden ${screenShake ? 'animate-shake' : ''}`}>
                {critFlash === 'CRIT' && (
                     <div className="absolute inset-0 flex items-center justify-center animate-ping-once bg-green-500/20">
                         {/* Simple Particle Effect */}
                         <div className="absolute inset-0 explosion-particles-green"></div>
                     </div>
                )}
                {critFlash === 'FUMBLE' && (
                     <div className="absolute inset-0 flex items-center justify-center animate-ping-once bg-red-900/30"></div>
                )}
            </div>
            
            {/* ACTIVE ROLL NOTIFICATIONS */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[160] flex flex-col gap-4 pointer-events-none w-full max-w-md items-center px-4">
                {activeRolls.map(item => (
                    <RollNotification key={item.id} roll={item.roll} userName={item.user} />
                ))}
            </div>

            {/* SPOTLIGHT MODAL */}
            {spotlight.active && (
                <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 pointer-events-auto">
                    <div className="max-w-4xl w-full flex flex-col items-center">
                        {spotlight.image && (
                            <img 
                                src={spotlight.image} 
                                alt={spotlight.title} 
                                className="max-h-[60vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 mb-6 animate-scale-in" 
                            />
                        )}
                        <h2 className="text-4xl md:text-6xl font-medieval text-[var(--accent-primary)] text-center drop-shadow-lg mb-2 text-glow-amber">
                            {spotlight.title}
                        </h2>
                        {spotlight.subtitle && <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-serif italic mb-4">{spotlight.subtitle}</p>}
                        {spotlight.description && (
                            <div className="bg-black/60 p-6 rounded-xl border border-[var(--border-primary)] max-w-2xl text-center text-lg leading-relaxed text-[var(--text-primary)]">
                                {spotlight.description}
                            </div>
                        )}
                        <button 
                            onClick={() => setSpotlight({ active: false, title: '' })}
                            className="mt-8 px-6 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-full text-[var(--text-muted)] text-sm transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
            
            {/* READY CHECK MODAL */}
            {readyCheck.active && (
                <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in pointer-events-auto">
                    <div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] rounded-xl p-8 shadow-[0_0_50px_rgba(251,191,36,0.2)] text-center max-w-sm w-full transform transition-all animate-scale-in">
                        <h3 className="text-2xl font-medieval text-[var(--text-primary)] mb-6">Are you ready?</h3>
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={() => handleReadyCheck(false)}
                                className="px-6 py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-950/50 transition-colors font-bold"
                            >
                                Not Yet
                            </button>
                            <button 
                                onClick={() => handleReadyCheck(true)}
                                className="px-8 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors font-bold shadow-lg"
                            >
                                I'm Ready!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* INSPIRATION NOTIFICATION MODAL */}
            {inspirationNotification.active && (
                <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in pointer-events-auto">
                    <div className="bg-[var(--bg-secondary)] border-2 border-amber-400 rounded-xl p-8 shadow-[0_0_50px_rgba(251,191,36,0.4)] text-center max-w-sm w-full transform transition-all animate-scale-in">
                        <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-white shadow-[0_0_20px_var(--accent-primary)] flex items-center justify-center text-white">
                                <StarSymbol symbolColor="white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-medieval text-[var(--accent-primary)] mb-2 text-glow-amber">Inspiration Claimed!</h3>
                        <p className="text-[var(--text-secondary)] mb-8 text-lg">
                            <span className="font-bold text-white">{inspirationNotification.playerName}</span> has been inspired.
                        </p>
                        <button 
                            onClick={() => setInspirationNotification({ active: false, playerName: '' })}
                            className="px-8 py-3 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors font-bold shadow-lg w-full"
                        >
                            Acknowledge
                        </button>
                    </div>
                </div>
            )}

            {/* CORRUPTION OVERLAY (The Punishment) */}
            {corruption > 0 && (
                <div 
                    className="fixed inset-0 z-[190] pointer-events-auto flex flex-col items-center justify-center transition-all duration-300"
                    style={{
                        backdropFilter: `blur(${corruption / 10}px) grayscale(${corruption}%)`,
                        backgroundColor: `rgba(0, 0, 0, ${corruption / 200})`, // Dim the screen
                    }}
                >
                    <div className="text-center animate-pulse">
                        <h2 className="text-4xl font-medieval text-red-600 drop-shadow-[0_0_10px_rgba(0,0,0,1)] tracking-widest mb-4">
                            MIND SHATTERED
                        </h2>
                        <button 
                            onClick={handleRestoreSanity}
                            className="bg-red-900/80 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full border-4 border-red-500 shadow-[0_0_30px_red] active:scale-95 transition-transform text-xl uppercase tracking-widest cursor-pointer"
                        >
                            RESTORE SANITY
                        </button>
                        <p className="text-red-300 mt-4 text-sm font-bold bg-black/50 px-2 rounded">
                            Tap repeatedly to focus!
                        </p>
                    </div>
                </div>
            )}

            {/* SPARKS (Interactive Objects) */}
            <div className="fixed inset-0 z-[170] pointer-events-none overflow-hidden">
                {sparks.map(spark => (
                    <button
                        key={spark.id}
                        onClick={() => handleInteractSpark(spark)}
                        className="absolute pointer-events-auto transition-transform active:scale-95"
                        style={{
                            left: `${spark.x}%`,
                            top: `${spark.y}%`,
                            transform: 'translate(-50%, -50%)',
                            animation: spark.type === 'DOOM' ? 'doom-pulse 0.5s ease-in-out infinite' : 'spark-pulse 4s linear forwards'
                        }}
                    >
                        {spark.type === 'INSPIRATION' ? (
                            <div className="relative group cursor-crosshair">
                                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md animate-pulse"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-white shadow-[0_0_30px_var(--accent-primary)] flex items-center justify-center text-white">
                                    <StarSymbol symbolColor="white" />
                                </div>
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                    CLAIM INSPIRATION
                                </div>
                            </div>
                        ) : (
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-red-600 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-black via-red-900 to-black rounded-full border-4 border-red-500 shadow-[0_0_50px_red] flex items-center justify-center text-white overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJyZWQiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50 animate-spin-slow"></div>
                                    <SkullSymbol symbolColor="#ef4444" />
                                </div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold text-lg animate-bounce uppercase tracking-widest drop-shadow-md">
                                    BANISH!
                                </div>
                                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                                    <circle cx="50%" cy="50%" r="46%" fill="none" stroke="white" strokeWidth="2" strokeDasharray="300" strokeDashoffset="0" className="animate-countdown" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
            
            <style>{`
                @keyframes spark-pulse {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    10% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    20% { transform: translate(-50%, -50%) scale(1); }
                    80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; }
                }
                @keyframes doom-pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                }
                @keyframes countdown {
                    from { stroke-dashoffset: 0; }
                    to { stroke-dashoffset: 300; }
                }
                .animate-countdown {
                    animation: countdown 5s linear forwards;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes shake {
                  0% { transform: translate(1px, 1px) rotate(0deg); }
                  10% { transform: translate(-1px, -2px) rotate(-1deg); }
                  20% { transform: translate(-3px, 0px) rotate(1deg); }
                  30% { transform: translate(3px, 2px) rotate(0deg); }
                  40% { transform: translate(1px, -1px) rotate(1deg); }
                  50% { transform: translate(-1px, 2px) rotate(-1deg); }
                  60% { transform: translate(-3px, 1px) rotate(0deg); }
                  70% { transform: translate(3px, 1px) rotate(-1deg); }
                  80% { transform: translate(-1px, -1px) rotate(1deg); }
                  90% { transform: translate(1px, 2px) rotate(0deg); }
                  100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                    animation-iteration-count: infinite;
                }
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .animate-ping-once {
                    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) 1;
                }
            `}</style>
        </>
    );
};
