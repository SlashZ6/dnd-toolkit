
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Character, ConnectedUser } from '../types';
import Button from './ui/Button';
import { useMqttChat } from '../hooks/useMqttChat';
import UserProfileModal from './UserProfileModal';
import { MonsterIcon } from './icons/MonsterIcon';
import { UsersIcon } from './icons/UsersIcon';
import { BookIcon } from './icons/BookIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CrestDisplay } from './crest/CrestDisplay';

interface CampaignChatProps {
    activeCharacter: Character;
    history: string[];
}

const StatShareButton: React.FC<{ onShare: (name: string, value: string | number) => void, character: Character }> = ({ onShare, character }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleShare = (statName: string, statValue: string | number) => {
        onShare(statName, statValue);
        setIsMenuOpen(false);
    };

    const abilityScores = character.abilityScores;

    return (
        <div className="relative">
            <Button
                ref={buttonRef}
                type="button"
                variant="ghost"
                size="sm"
                className="!p-2 aspect-square"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Share a stat"
                aria-label="Share a character stat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 12v-3"/><path d="M12 15h.01"/></svg>
            </Button>
            {isMenuOpen && (
                <div ref={menuRef} className="absolute bottom-full mb-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl z-10 p-2 animate-fade-in">
                    <button onClick={() => handleShare('HP', `${character.currentHp} / ${character.maxHp}`)} className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-[var(--bg-tertiary)]">HP</button>
                    <button onClick={() => handleShare('AC', character.ac)} className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-[var(--bg-tertiary)]">Armor Class</button>
                    <button onClick={() => handleShare('Passive Perception', character.passivePerception)} className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-[var(--bg-tertiary)]">Passive Perception</button>
                    <button onClick={() => handleShare('Ability Scores', `Str ${abilityScores.str}, Dex ${abilityScores.dex}, Con ${abilityScores.con}, Int ${abilityScores.int}, Wis ${abilityScores.wis}, Cha ${abilityScores.cha}`)} className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-[var(--bg-tertiary)]">Ability Scores</button>
                </div>
            )}
        </div>
    );
};

const HistoryShareButton: React.FC<{ onShare: (actionText: string) => void; history: string[] }> = ({ onShare, history }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleShare = (historyItem: string) => {
        let actionText = '';
        if (historyItem.startsWith('Used feature: ')) {
            actionText = `used ${historyItem.substring(14)}`;
        } else if (historyItem.startsWith('Used spell: ')) {
            actionText = `cast ${historyItem.substring(12)}`;
        } else if (historyItem.startsWith('Used action: ')) {
            actionText = `took the ${historyItem.substring(12)} action`;
        } else {
            actionText = historyItem; // fallback
        }
        onShare(actionText);
        setIsMenuOpen(false);
    };

    return (
        <div className="relative">
            <Button
                ref={buttonRef}
                type="button"
                variant="ghost"
                size="sm"
                className="!p-2 aspect-square"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Share from History"
                aria-label="Share an action from your history log"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M12 8v4l2 2"/></svg>
            </Button>
            {isMenuOpen && (
                <div ref={menuRef} className="absolute bottom-full mb-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl z-10 p-2 animate-fade-in max-h-60 overflow-y-auto">
                    {history.length > 0 ? history.slice(0, 10).map((item, index) => (
                        <button key={index} onClick={() => handleShare(item)} className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-[var(--bg-tertiary)] truncate" title={item}>
                            {item}
                        </button>
                    )) : (
                        <p className="px-3 py-1.5 text-sm text-[var(--text-muted)] text-center">No recent actions.</p>
                    )}
                </div>
            )}
        </div>
    );
};


const CampaignChat: React.FC<CampaignChatProps> = ({ activeCharacter, history }) => {
    const { messages, publishMessage, isConnected, connectedUsers } = useMqttChat(activeCharacter);
    const [newMessage, setNewMessage] = useState('');
    const [isOOC, setIsOOC] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ConnectedUser | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage) return;

        publishMessage('chat', { message: trimmedMessage, ooc: isOOC });
        
        setNewMessage('');
    };
    
    const handleShareStat = (statName: string, statValue: string | number) => {
        publishMessage('stat', {
            statName,
            statValue,
            characterName: activeCharacter?.name
        });
    };

    const handleShareAction = (actionText: string) => {
        publishMessage('action', {
            action: actionText,
            characterName: activeCharacter?.name,
        });
    };

    const formatTimestamp = (ts: number) => {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = (msg: ChatMessage) => {
        const time = formatTimestamp(msg.timestamp);
        switch (msg.type) {
            case 'stat':
                 return (
                    <div className="text-center my-3 text-sm text-[var(--accent-primary)] italic px-4 py-1.5 bg-[var(--bg-secondary)]/50 rounded-md">
                        <strong className="font-bold not-italic">{msg.payload.characterName}</strong> shares: {msg.payload.statName} is <strong className="font-bold not-italic">{msg.payload.statValue}</strong>
                    </div>
                );
            case 'action':
                return (
                    <div className="text-center my-3 text-sm text-[var(--accent-secondary)] italic px-4 py-1.5 bg-[var(--bg-secondary)]/50 rounded-md">
                        <strong className="font-bold not-italic">{msg.payload.characterName}</strong> {msg.payload.action}
                    </div>
                );
            case 'npc_share':
                return msg.payload.npc && (
                    <div className="flex flex-col items-start">
                        <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-amber-500 max-w-[85%] sm:max-w-[75%]">
                            <p className="font-bold text-amber-300">{msg.payload.npc.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">{msg.payload.npc.race}, {msg.payload.npc.classRole}, {msg.payload.npc.alignment}</p>
                            {msg.payload.npc.backstorySummary && <p className="text-sm text-[var(--text-secondary)] mt-2 italic">({msg.payload.npc.backstorySummary})</p>}
                            <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                        </div>
                    </div>
                );
             case 'beast_share':
                return msg.payload.beast && (
                    <div className="flex flex-col items-start">
                        <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-red-500 max-w-[85%] sm:max-w-[75%]">
                            <p className="font-bold text-red-400">{msg.payload.beast.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">{msg.payload.beast.size}, {msg.payload.beast.type}, {msg.payload.beast.alignment}</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-2">HP: {msg.payload.beast.hp}, AC: {msg.payload.beast.ac}</p>
                            <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                        </div>
                    </div>
                );
             case 'note_share':
                return msg.payload.note && (
                    <div className="flex flex-col items-start">
                        <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-cyan-500 max-w-[85%] sm:max-w-[75%]">
                            <div className="flex items-center gap-2 mb-2">
                                <BookIcon className="w-5 h-5 text-cyan-400" />
                                <p className="font-bold text-cyan-300">{msg.payload.note.title}</p>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] italic">"{msg.payload.note.content}"</p>
                            <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                        </div>
                    </div>
                );
            case 'roll_share':
                 return msg.payload.roll && (
                    <div className="flex flex-col items-start">
                        <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-violet-500 max-w-[85%] sm:max-w-[75%]">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-violet-300">{msg.payload.roll.title}</p>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{msg.payload.roll.total}</p>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] font-mono mt-1">{msg.payload.roll.formula}</p>
                            <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                        </div>
                    </div>
                );
            case 'timeline_event_share':
                return msg.payload.event && (
                    <div className="flex flex-col items-start">
                        <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-yellow-500 max-w-[85%] sm:max-w-[75%]">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarIcon className="w-5 h-5 text-yellow-400" />
                                <p className="font-bold text-yellow-300">Timeline Event: Day {msg.payload.event.day}</p>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] italic">"{msg.payload.event.description}"</p>
                            <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                        </div>
                    </div>
                );
            case 'chat':
            default:
                const isNpcMessage = msg.payload.asNPC;
                if (isNpcMessage) {
                    return (
                        <div className="flex flex-col items-start">
                            <div className="p-2 px-3 rounded-lg max-w-[85%] sm:max-w-[75%] shadow-md bg-[var(--bg-tertiary)]/60 text-[var(--text-primary)] rounded-bl-none border-l-4 border-amber-400">
                                <div className="flex items-baseline gap-2 text-xs mb-1">
                                    <p className="font-bold text-amber-300">{isNpcMessage.name}</p>
                                    <time className="text-[var(--text-muted)]">{time}</time>
                                </div>
                                <p className="whitespace-pre-wrap break-words">{msg.payload.message}</p>
                            </div>
                        </div>
                    );
                }

                const isCurrentUser = msg.user === activeCharacter.name;
                const isOOCMessage = msg.payload.ooc;

                return (
                     <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <div className={`p-2 px-3 rounded-lg max-w-[85%] sm:max-w-[75%] shadow-md ${isCurrentUser ? 'bg-[var(--bg-interactive)]/80 text-[var(--text-inverted)] rounded-br-none' : 'bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-bl-none'}`}>
                            <div className="flex items-baseline gap-2 text-xs mb-1">
                                <p className={`font-bold ${isCurrentUser ? 'text-[var(--accent-secondary)]' : 'text-[var(--accent-primary)]'}`}>{msg.user}</p>
                                <time className="text-[var(--text-muted)]">{time}</time>
                            </div>
                            {isOOCMessage ? (
                                <p className="whitespace-pre-wrap break-words text-[var(--text-muted)] italic"><span className="font-bold not-italic mr-1">(OOC)</span>{msg.payload.message}</p>
                            ) : (
                                <p className="whitespace-pre-wrap break-words">{msg.payload.message}</p>
                            )}
                        </div>
                    </div>
                );
        }
    }

    let connectionStatusText = "Connecting...";
    let connectionStatusColor = "bg-yellow-500";
    if(isConnected) {
        connectionStatusText = "Connected";
        connectionStatusColor = "bg-green-500 animate-pulse";
    } else {
        connectionStatusText = "Disconnected";
        connectionStatusColor = "bg-red-500";
    }

    return (
        <div 
            className="bg-[var(--bg-secondary)]/70 border border-[var(--border-primary)] rounded-xl shadow-2xl w-full h-full flex flex-col animate-fade-in"
        >
            <header className="p-3 border-b border-[var(--border-primary)] flex-shrink-0 bg-[var(--bg-primary)]/50">
                <h3 className="text-sm font-bold text-[var(--text-muted)] mb-2 px-1">Connected Adventurers</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {connectedUsers.map(user => (
                        <button 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            title={user.name} 
                            className="flex flex-col items-center flex-shrink-0 w-16 text-center group"
                        >
                            <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full border-2 border-[var(--border-secondary)] group-hover:border-[var(--accent-primary)] flex items-center justify-center overflow-hidden transition-colors">
                                {user.crest ? (
                                    <CrestDisplay crestData={user.crest} size={48} />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                                )}
                            </div>
                            <p className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] mt-1 truncate w-full transition-colors">{user.name}</p>
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-0">
                {messages.map((msg) => (
                    <div key={msg.id}>
                        {renderMessage(msg)}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-[var(--border-primary)] flex-shrink-0">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                    <StatShareButton onShare={handleShareStat} character={activeCharacter} />
                    <HistoryShareButton onShare={handleShareAction} history={history} />
                    
                    <button type="button" onClick={() => setIsOOC(!isOOC)} className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${isOOC ? 'bg-[var(--bg-quaternary)] text-[var(--text-primary)]' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'}`} title="Toggle Out-of-Character">OOC</button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder={isConnected ? "Send a message..." : "Connecting to chat..."}
                        className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-secondary)] focus:outline-none disabled:bg-[var(--bg-tertiary)]"
                        disabled={!isConnected}
                        aria-label="New Message"
                    />
                    <Button type="submit" disabled={!isConnected || !newMessage.trim()}>Send</Button>
                </form>
                 <div className="text-center text-xs text-[var(--text-muted)] mt-2 flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${connectionStatusColor}`}></span>
                    <span>{connectionStatusText}</span>
                </div>
            </footer>
            {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
};

export default CampaignChat;