

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Character, ConnectedUser, NPC, Monster, CampaignNote, TimelineEvent } from '../types';
import { RollResult } from './DiceRoller';
import Button from './ui/Button';
import UserProfileModal from './UserProfileModal';
import { UsersIcon } from './icons/UsersIcon';
import { MonsterIcon } from './icons/MonsterIcon';
import { BookIcon } from './icons/BookIcon';
import { D20Icon } from './icons/D20Icon';
import { PlusIcon } from './icons/PlusIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CrestDisplay } from './crest/CrestDisplay';

interface DMChatProps {
    activeCharacter: Character;
    messages: ChatMessage[];
    publishMessage: (type: ChatMessage['type'], payload: ChatMessage['payload']) => void;
    isConnected: boolean;
    connectedUsers: ConnectedUser[];
    npcs: NPC[];
    monsters: Monster[];
    notes: CampaignNote[];
    timelineEvents: TimelineEvent[];
    diceHistory: RollResult[];
}

type ShareCategory = 'npcs' | 'monsters' | 'notes' | 'rolls' | 'events';

const MultiShareButton: React.FC<{
    onShare: (type: ShareCategory, item: any) => void;
    items: {
        npcs: NPC[];
        monsters: Monster[];
        notes: CampaignNote[];
        rolls: RollResult[];
        events: TimelineEvent[];
    }
}> = ({ onShare, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ShareCategory>('npcs');
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleShare = (type: ShareCategory, item: any) => {
        onShare(type, item);
        setIsOpen(false);
    };

    const renderList = () => {
        const list = items[activeTab];
        if (!list || list.length === 0) {
            return <p className="p-4 text-center text-sm text-[var(--text-muted)]">No {activeTab} to share.</p>;
        }

        return (
            <div className="max-h-60 overflow-y-auto">
                {list.map((item: any, index: number) => (
                    <button key={item.id || index} onClick={() => handleShare(activeTab, item)} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--bg-tertiary)] truncate">
                        {item.name || item.title || `Day ${item.day}`}
                    </button>
                ))}
            </div>
        );
    };
    
    const TabButton: React.FC<{tab: ShareCategory, icon: React.ReactNode}> = ({tab, icon}) => (
        <button onClick={() => setActiveTab(tab)} className={`p-2 rounded-t-lg transition-colors ${activeTab === tab ? 'bg-[var(--bg-tertiary)] text-[var(--text-inverted)]' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'}`}>
            {icon}
        </button>
    );

    return (
        <div className="relative">
            <Button ref={buttonRef} type="button" variant="ghost" size="sm" className="!p-2 aspect-square" onClick={() => setIsOpen(!isOpen)} title="Share with party" aria-label="Share with party">
                <PlusIcon className="w-5 h-5" />
            </Button>
            {isOpen && (
                <div ref={menuRef} className="absolute bottom-full mb-2 w-64 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl z-10 animate-fade-in">
                    <div className="flex justify-around border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/50 rounded-t-lg">
                        <TabButton tab="npcs" icon={<UsersIcon className="w-5 h-5"/>} />
                        <TabButton tab="monsters" icon={<MonsterIcon className="w-5 h-5"/>} />
                        <TabButton tab="notes" icon={<BookIcon className="w-5 h-5"/>} />
                        <TabButton tab="events" icon={<CalendarIcon className="w-5 h-5"/>} />
                        <TabButton tab="rolls" icon={<D20Icon className="w-5 h-5"/>} />
                    </div>
                    {renderList()}
                </div>
            )}
        </div>
    );
};

const DMChat: React.FC<DMChatProps> = ({ activeCharacter, messages, publishMessage, isConnected, connectedUsers, npcs, monsters, notes, timelineEvents, diceHistory }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isOOC, setIsOOC] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ConnectedUser | null>(null);
    const [sendAs, setSendAs] = useState('dm'); // 'dm' or npc.id
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
        
        const payload: ChatMessage['payload'] = { message: trimmedMessage };
        if (sendAs === 'dm') {
            payload.ooc = isOOC;
        } else {
            const selectedNpc = npcs.find(n => n.id === sendAs);
            if (selectedNpc) {
                payload.asNPC = { name: selectedNpc.name };
            }
        }
        
        publishMessage('chat', payload);
        setNewMessage('');
    };

    const handleShare = (type: ShareCategory, item: any) => {
        switch (type) {
            case 'npcs':
                publishMessage('npc_share', { npc: { name: item.name, race: item.race, classRole: item.classRole, alignment: item.alignment, backstorySummary: item.backstorySummary } });
                break;
            case 'monsters':
                publishMessage('beast_share', { beast: { name: item.name, size: item.size, type: item.type, alignment: item.alignment, ac: item.ac, hp: item.hp } });
                break;
            case 'notes':
                const contentSnippet = item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '');
                publishMessage('note_share', { note: { title: item.title, content: contentSnippet } });
                break;
            case 'rolls':
                publishMessage('roll_share', { roll: { title: item.title, total: item.total, formula: item.formula } });
                break;
            case 'events':
                publishMessage('timeline_event_share', { event: { day: item.day, description: item.description } });
                break;
        }
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
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--border-accent-primary)]">
                        <p className="font-bold text-[var(--accent-primary)]">{msg.payload.npc.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{msg.payload.npc.race}, {msg.payload.npc.classRole}, {msg.payload.npc.alignment}</p>
                        {msg.payload.npc.backstorySummary && <p className="text-sm text-[var(--text-secondary)] mt-2 italic">({msg.payload.npc.backstorySummary})</p>}
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
             case 'beast_share':
                return msg.payload.beast && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--bg-destructive)]">
                        <p className="font-bold text-[var(--bg-destructive)]">{msg.payload.beast.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{msg.payload.beast.size}, {msg.payload.beast.type}, {msg.payload.beast.alignment}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-2">HP: {msg.payload.beast.hp}, AC: {msg.payload.beast.ac}</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
             case 'note_share':
                return msg.payload.note && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--border-accent-secondary)]">
                        <div className="flex items-center gap-2 mb-2">
                             <BookIcon className="w-5 h-5 text-[var(--accent-secondary)]" />
                            <p className="font-bold text-[var(--accent-secondary)]">{msg.payload.note.title}</p>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] italic">"{msg.payload.note.content}"</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
            case 'roll_share':
                 return msg.payload.roll && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--border-accent-violet)]">
                         <div className="flex justify-between items-start">
                            <p className="font-bold text-[var(--accent-violet)]">{msg.payload.roll.title}</p>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{msg.payload.roll.total}</p>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] font-mono mt-1">{msg.payload.roll.formula}</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
            case 'timeline_event_share':
                return msg.payload.event && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--border-accent-primary)]">
                        <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                            <p className="font-bold text-[var(--accent-primary)]">Timeline Event: Day {msg.payload.event.day}</p>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] italic">"{msg.payload.event.description}"</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
            case 'chat':
            default:
                const isNpcMessage = msg.payload.asNPC;
                if (isNpcMessage) {
                    return (
                         <div className="flex flex-col items-start">
                            <div className="p-2 px-3 rounded-lg max-w-[85%] sm:max-w-[75%] shadow-md bg-[var(--bg-tertiary)]/60 text-[var(--text-primary)] rounded-bl-none border-l-4 border-[var(--border-accent-primary)]">
                                <div className="flex items-baseline gap-2 text-xs mb-1">
                                    <p className="font-bold text-[var(--accent-primary)]">{isNpcMessage.name}</p>
                                    <time className="text-[var(--text-muted)]">{time}</time>
                                </div>
                                <p className="whitespace-pre-wrap break-words">{msg.payload.message}</p>
                            </div>
                        </div>
                    )
                }

                const isCurrentUser = msg.user === activeCharacter.name;
                const isOOCMessage = msg.payload.ooc;
                return (
                     <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <div className={`p-2 px-3 rounded-lg max-w-[85%] sm:max-w-[75%] shadow-md ${isCurrentUser ? 'bg-[var(--bg-destructive)]/70 text-[var(--text-inverted)] rounded-br-none' : 'bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-bl-none'}`}>
                            <div className="flex items-baseline gap-2 text-xs mb-1">
                                <p className={`font-bold ${isCurrentUser ? 'text-red-300' : 'text-[var(--accent-primary)]'}`}>{msg.user}</p>
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
                    <MultiShareButton 
                        onShare={handleShare}
                        items={{ 
                            npcs, 
                            monsters, 
                            notes, 
                            rolls: diceHistory,
                            events: timelineEvents,
                        }}
                    />

                    <div className="flex-grow flex items-center bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus-within:ring-2 focus-within:ring-[var(--accent-secondary)] transition-all">
                        <select
                            id="send-as"
                            value={sendAs}
                            onChange={e => setSendAs(e.target.value)}
                            className="bg-transparent border-0 rounded-l-lg p-2 text-sm text-[var(--text-primary)] focus:outline-none h-full appearance-none pr-8 bg-no-repeat bg-right"
                            style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center'}}
                        >
                            <option value="dm" className="bg-[var(--bg-secondary)]">DM</option>
                            {npcs.map(npc => (
                                <option key={npc.id} value={npc.id} className="bg-[var(--bg-secondary)]">{npc.name}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder={isConnected ? "Send a message..." : "Connecting to chat..."}
                            className="w-full bg-transparent border-0 border-l border-l-[var(--border-primary)] p-2 text-[var(--text-primary)] focus:outline-none"
                            disabled={!isConnected}
                            aria-label="New Message"
                        />
                         <button 
                            type="button" 
                            onClick={() => setIsOOC(!isOOC)} 
                            className={`px-3 text-xs font-bold shrink-0 ${isOOC ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'} disabled:opacity-50 disabled:cursor-not-allowed`} 
                            title="Toggle Out-of-Character"
                            disabled={sendAs !== 'dm'}
                        >
                            OOC
                        </button>
                    </div>
                    
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

export default DMChat;