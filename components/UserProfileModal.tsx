
import React from 'react';
import { ConnectedUser } from '../types';
import Button from './ui/Button';
import { CrestDisplay } from './crest/CrestDisplay';

const AbilityScoreDisplay: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="text-center">
        <div className="text-xs text-[var(--text-muted)]">{label}</div>
        <div className="font-bold text-lg text-[var(--text-primary)]">{score}</div>
    </div>
);

const UserProfileModal: React.FC<{ user: ConnectedUser, onClose: () => void }> = ({ user, onClose }) => {
    const isDM = user.id === 'dm-user-007';
    const displayScores = isDM 
        ? { str: 99, dex: 99, con: 99, int: 99, wis: 99, cha: 99 } 
        : user.abilityScores;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            aria-labelledby="user-profile-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl shadow-black/50 p-6 m-4 max-w-md w-full border border-[var(--border-primary)] flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-start gap-4 mb-4 pb-4 border-b border-[var(--border-primary)]">
                    <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-full border-2 border-[var(--border-secondary)] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.crest ? (
                            <CrestDisplay crestData={user.crest} size={96} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                        )}
                    </div>
                    <div>
                         <h2 id="user-profile-title" className="text-3xl font-medieval text-[var(--accent-primary)] break-words">{user.name}</h2>
                    </div>
                </header>

                <div className="overflow-y-auto flex-grow mb-4 pr-2">
                    <section className="mb-4">
                        <h3 className="font-bold text-[var(--text-secondary)] mb-2">Ability Scores</h3>
                        <div className="grid grid-cols-6 gap-2 bg-[var(--bg-primary)]/50 p-2 rounded-lg">
                            <AbilityScoreDisplay label="STR" score={displayScores.str} />
                            <AbilityScoreDisplay label="DEX" score={displayScores.dex} />
                            <AbilityScoreDisplay label="CON" score={displayScores.con} />
                            <AbilityScoreDisplay label="INT" score={displayScores.int} />
                            <AbilityScoreDisplay label="WIS" score={displayScores.wis} />
                            <AbilityScoreDisplay label="CHA" score={displayScores.cha} />
                        </div>
                    </section>
                    <section>
                        <h3 className="font-bold text-[var(--text-secondary)] mb-2">Background</h3>
                        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                            {user.notes || 'No background information provided.'}
                        </p>
                    </section>
                </div>
                
                <div className="flex justify-end flex-shrink-0">
                    <Button onClick={onClose} variant="ghost">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
