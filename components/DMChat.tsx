
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Character, ConnectedUser, NPC, Monster, CampaignNote, TimelineEvent, ContentPayload } from '../types';
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
import { CrownIcon } from './icons/CrownIcon';
import { compressImage } from '../utils/imageUtils'; // Import utility

interface DMChatProps {
    activeCharacter: Character;
    messages: ChatMessage[];
    publishMessage: (type: ChatMessage['type'], payload: ChatMessage['payload'], targetPeerId?: string) => void;
    isConnected: boolean;
    connectedUsers: ConnectedUser[];
    npcs: NPC[];
    monsters: Monster[];
    notes: CampaignNote[];
    timelineEvents: TimelineEvent[];
    diceHistory: RollResult[];
    targetUser: ConnectedUser | null;
}

type ShareCategory = 'npcs' | 'monsters' | 'notes' | 'rolls' | 'events';

const MultiShareButton: React.FC<{
    onShare: (type: ShareCategory, item: any, asSpotlight?: boolean) => void;
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

    const handleShare = (type: ShareCategory, item: any, asSpotlight = false) => {
        onShare(type, item, asSpotlight);
        setIsOpen(false);
    };

    const renderList = () => {
        const list = items[activeTab];
        if (!list || list.length === 0) {
            return <p className="p-4 text-center text-sm text-[var(--text-muted)]">No {activeTab} to share.</p>;
        }

        const canSpotlight = activeTab === 'npcs' || activeTab === 'monsters' || activeTab === 'notes';

        return (
            <div className="max-h-60 overflow-y-auto">
                {list.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center gap-1 px-2 hover:bg-[var(--bg-tertiary)] group">
                        <button onClick={() => handleShare(activeTab, item)} className="flex-grow text-left py-2 text-sm truncate">
                            {item.name || item.title || `Day ${item.day}`}
                        </button>
                        {canSpotlight && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleShare(activeTab, item, true); }}
                                className="opacity-30 group-hover:opacity-100 hover:text-[var(--accent-primary)] transition-all p-1"
                                title="Spotlight: Force open on player screens"
                            >
                                <CrownIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
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

const DMChat: React.FC<DMChatProps> = ({ activeCharacter, messages, publishMessage, isConnected, connectedUsers, npcs, monsters, notes, timelineEvents, diceHistory, targetUser }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isOOC, setIsOOC] = useState(false);
    const [isFleeting, setIsFleeting] = useState(false);
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
        
        const payload: ChatMessage['payload'] = { 
            message: trimmedMessage,
            isFleeting 
        };
        
        if (sendAs === 'dm') {
            payload.ooc = isOOC;
        } else {
            const selectedNpc = npcs.find(n => n.id === sendAs);
            if (selectedNpc) {
                payload.asNPC = { name: selectedNpc.name };
            }
        }
        
        publishMessage('chat', payload, targetUser?._peerId);
        setNewMessage('');
        // Reset fleeting after send to prevent accidental next messages being fleeting
        setIsFleeting(false); 
    };

    const handleShare = async (type: ShareCategory, item: any, asSpotlight = false) => {
        const targetId = targetUser?._peerId;

        if (asSpotlight) {
             let spotlightData: { title: string, subtitle?: string, description?: string, image?: string } = { title: 'Unknown' };
             
             if (type === 'npcs') {
                 // Compress NPC image for spotlight
                 const compressedImg = item.image ? await compressImage(item.image, 600, 0.7) : undefined;
                 spotlightData = {
                     title: item.name,
                     subtitle: `${item.race} ${item.classRole}`,
                     description: item.backstorySummary,
                     image: compressedImg
                 };
             } else if (type === 'monsters') {
                 // Compress Monster image for spotlight
                 const compressedImg = item.image ? await compressImage(item.image, 600, 0.7) : undefined;
                 spotlightData = {
                     title: item.name,
                     subtitle: `${item.size} ${item.type}`,
                     description: `HP: ${item.hp}, AC: ${item.ac}`,
                     image: compressedImg
                 };
             } else if (type === 'notes') {
                 spotlightData = {
                     title: item.title,
                     description: item.content
                 };
             }

             publishMessage('session_control', {
                 control: {
                     type: 'SPOTLIGHT',
                     spotlightData
                 }
             }, targetId);
             
             return;
        }

        switch (type) {
            case 'npcs':
                publishMessage('npc_share', { npc: { name: item.name, race: item.race, classRole: item.classRole, alignment: item.alignment, backstorySummary: item.backstorySummary } }, targetId);
                break;
            case 'monsters':
                publishMessage('beast_share', { beast: { name: item.name, size: item.size, type: item.type, alignment: item.alignment, ac: item.ac, hp: item.hp } }, targetId);
                break;
            case 'notes':
                const contentSnippet = item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '');
                publishMessage('note_share', { note: { title: item.title, content: contentSnippet } }, targetId);
                break;
            case 'rolls':
                publishMessage('roll_share', { roll: { title: item.title, total: item.total, formula: item.formula } }, targetId);
                break;
            case 'events':
                publishMessage('timeline_event_share', { event: { day: item.day, description: item.description } }, targetId);
                break;
        }
    };


    const formatTimestamp = (ts: number) => {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = (msg: ChatMessage) => {
        const time = formatTimestamp(msg.timestamp);
        const payload = msg.payload as ContentPayload;
        
        const isPrivate = !!msg.targetId;
        const privateLabel = isPrivate ? <span className="text-[10px] text-[var(--accent-secondary)] italic ml-2">(Private)</span> : null;

        switch (msg.type) {
            case 'stat':
                 return (
                    <div className="text-center my-3 text-sm text-[var(--accent-primary)] italic px-4 py-1.5 bg-[var(--bg-secondary)]/50 rounded-md">
                        <strong className="font-bold not-italic">{payload.characterName}</strong> shares: {payload.statName} is <strong className="font-bold not-italic">{payload.statValue}</strong>
                    </div>
                );
            case 'action':
                return (
                    <div className="text-center my-3 text-sm text-[var(--accent-secondary)] italic px-4 py-1.5 bg-[var(--bg-secondary)]/50 rounded-md">
                        <strong className="font-bold not-italic">{payload.characterName}</strong> {payload.action}
                    </div>
                );
            case 'ready_response':
                 const readyPayload = payload.readyResponse;
                 if (readyPayload) {
                     return (
                         <div className="text-center my-2 text-xs text-[var(--text-muted)] bg-[var(--bg-primary)]/30 rounded py-1 border border-[var(--border-secondary)]">
                             <strong>{connectedUsers.find(u => u.id === readyPayload.userId)?.name || 'Someone'}</strong> is {readyPayload.isReady ? <span className="text-green-400 font-bold">READY</span> : <span className="text-red-400 font-bold">NOT READY</span>}
                         </div>
                     );
                 }
                 return null;
             case 'npc_share':
                return payload.npc && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--border-accent-primary)]">
                        <p className="font-bold text-[var(--accent-primary)]">{payload.npc.name} {privateLabel}</p>
                        <p className="text-sm text-[var(--text-muted)]">{payload.npc.race}, {payload.npc.classRole}, {payload.npc.alignment}</p>
                        {payload.npc.backstorySummary && <p className="text-sm text-[var(--text-secondary)] mt-2 italic">({payload.npc.backstorySummary})</p>}
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
             case 'beast_share':
                return payload.beast && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--bg-destructive)]">
                        <p className="font-bold text-[var(--bg-destructive)]">{payload.beast.name} {privateLabel}</p>
                        <p className="text-sm text-[var(--text-muted)]">{payload.beast.size}, {payload.beast.type}, {payload.beast.alignment}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-2">HP: {payload.beast.hp}, AC: {payload.beast.ac}</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
             case 'note_share':
                return payload.note && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--border-accent-secondary)]">
                        <div className="flex items-center gap-2 mb-2">
                             <BookIcon className="w-5 h-5 text-[var(--accent-secondary)]" />
                            <p className="font-bold text-[var(--accent-secondary)]">{payload.note.title} {privateLabel}</p>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] italic">"{payload.note.content}"</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
            case 'roll_share':
                 return payload.roll && (
                    <div className={`my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 ${payload.roll.isCrit ? 'border-green-500' : payload.roll.isFumble ? 'border-red-500' : 'border-[var(--border-accent-violet)]'}`}>
                         <div className="flex justify-between items-start">
                            <p className="font-bold text-[var(--accent-violet)]">{payload.roll.title} {privateLabel}</p>
                            <p className={`text-2xl font-bold ${payload.roll.isCrit ? 'text-green-400' : payload.roll.isFumble ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>{payload.roll.total}</p>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] font-mono mt-1">{payload.roll.formula}</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
            case 'timeline_event_share':
                return payload.event && (
                    <div className="my-2 p-3 bg-[var(--bg-primary)]/50 rounded-lg border-l-4 border-[var(--border-accent-primary)]">
                        <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                            <p className="font-bold text-[var(--accent-primary)]">Timeline Event: Day {payload.event.day} {privateLabel}</p>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] italic">"{payload.event.description}"</p>
                        <p className="text-xs text-[var(--text-muted)]/80 text-right mt-1">Shared by {msg.user}</p>
                    </div>
                );
            case 'chat':
            default:
                const isNpcMessage = payload.asNPC;
                if (isNpcMessage) {
                    return (
                         <div className="flex flex-col items-start">
                            <div className={`p-2 px-3 rounded-lg max-w-[85%] sm:max-w-[75%] shadow-md bg-[var(--bg-tertiary)]/60 text-[var(--text-primary)] rounded-bl-none border-l-4 border-[var(--border-accent-primary)] ${payload.isFleeting ? 'opacity-70 italic border-l-purple-500' : ''}`}>
                                <div className="flex items-baseline gap-2 text-xs mb-1">
                                    <p className="font-bold text-[var(--accent-primary)]">{isNpcMessage.name} {privateLabel}</p>
                                    <time className="text-[var(--text-muted)]">{time}</time>
                                </div>
                                <p className="whitespace-pre-wrap break-words">{payload.message}</p>
                                {payload.isFleeting && <p className="text-[10px] text-purple-400 mt-1 uppercase font-bold text-right">Fleeting Whisper</p>}
                            </div>
                        </div>
                    )
                }

                const isCurrentUser = msg.user === activeCharacter.name;
                const isOOCMessage = payload.ooc;
                return (
                     <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <div className={`p-2 px-3 rounded-lg max-w-[85%] sm:max-w-[75%] shadow-md ${isCurrentUser ? 'bg-[var(--bg-destructive)]/70 text-[var(--text-inverted)] rounded-br-none' : 'bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-bl-none'} ${payload.isFleeting ? 'border border-purple-500/50' : ''}`}>
                            <div className="flex items-baseline gap-2 text-xs mb-1">
                                <p className={`font-bold ${isCurrentUser ? 'text-red-300' : 'text-[var(--accent-primary)]'}`}>{msg.user} {privateLabel}</p>
                                <time className="text-[var(--text-muted)]">{time}</time>
                            </div>
                            {isOOCMessage ? (
                                <p className="whitespace-pre-wrap break-words text-[var(--text-muted)] italic"><span className="font-bold not-italic mr-1">(OOC)</span>{payload.message}</p>
                            ) : (
                                <p className="whitespace-pre-wrap break-words">{payload.message}</p>
                            )}
                             {payload.isFleeting && <p className="text-[10px] text-purple-400 mt-1 uppercase font-bold text-right">Fleeting Whisper</p>}
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
                {messages.slice(-10).map((msg) => (
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

                    <div className="flex-grow flex items-center bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus-within:ring-2 focus-within:ring-[var(--accent-secondary)] transition-all overflow-hidden">
                        <select
                            id="send-as"
                            value={sendAs}
                            onChange={e => setSendAs(e.target.value)}
                            className="bg-transparent border-0 rounded-l-lg p-2 text-sm text-[var(--text-primary)] focus:outline-none h-full appearance-none pr-8 bg-no-repeat bg-right max-w-[8rem] sm:max-w-[12rem] truncate cursor-pointer"
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
                            placeholder={isConnected ? (targetUser ? `Message ${targetUser.name}...` : "Message everyone...") : "Connecting..."}
                            className="flex-1 min-w-0 bg-transparent border-0 border-l border-l-[var(--border-primary)] p-2 text-[var(--text-primary)] focus:outline-none"
                            disabled={!isConnected}
                            aria-label="New Message"
                        />
                        <button 
                            type="button" 
                            onClick={() => setIsFleeting(!isFleeting)} 
                            className={`px-2 text-xs font-bold shrink-0 ${isFleeting ? 'text-purple-400' : 'text-[var(--text-muted)]'} disabled:opacity-50`} 
                            title="Fleeting: Message fades after 20s"
                        >
                            FADE
                        </button>
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
