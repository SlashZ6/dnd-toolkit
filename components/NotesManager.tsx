
import React, { useState, useMemo, useEffect } from 'react';
import { CampaignNote, createEmptyCampaignNote, NoteType, NoteStatus } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Loader from './ui/Loader';
import { TrashIcon } from './icons/TrashIcon';
import { BookIcon } from './icons/BookIcon';
import { MapIcon } from './icons/MapIcon';
import { MonsterIcon } from './icons/MonsterIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SearchIcon } from './icons/SearchIcon';
import { PlusIcon } from './icons/PlusIcon';
import { EyeSymbol } from './crest/symbols';
import { useToast } from './ui/Toast';

interface NotesManagerProps {
    notes: CampaignNote[];
    addNote: (note: CampaignNote) => Promise<void>;
    updateNote: (note: CampaignNote) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    isLoading: boolean;
}

// --- UTILITIES & CONSTANTS ---

const NOTE_TYPES: { id: NoteType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
    { id: 'general', label: 'General', icon: <BookIcon className="w-4 h-4" />, color: 'text-slate-300', bg: 'bg-slate-500/20' },
    { id: 'quest', label: 'Quest', icon: <span className="font-medieval font-bold">!</span>, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { id: 'location', label: 'Location', icon: <MapIcon className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { id: 'npc', label: 'NPC', icon: <UsersIcon className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'item', label: 'Item', icon: <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center"><div className="w-2 h-1 bg-current rounded-t-sm"></div></div>, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { id: 'todo', label: 'To-Do', icon: <div className="w-4 h-4 border-2 border-current rounded flex items-center justify-center text-[10px]">✓</div>, color: 'text-red-400', bg: 'bg-red-500/20' },
];

const getNoteMeta = (type: NoteType) => NOTE_TYPES.find(t => t.id === type) || NOTE_TYPES[0];

const getTypePlaceholder = (type: NoteType) => {
    switch(type) {
        case 'quest': return "Objective:\n\nRewards:\n\nKey NPCs:";
        case 'location': return "Atmosphere:\n\nSights, Sounds, Smells:\n\nSecrets:";
        case 'npc': return "Appearance:\n\nVoice:\n\nRelation to Party:";
        case 'item': return "Description:\n\nMagical Properties:\n\nHistory:";
        case 'todo': return "- [ ] Task 1\n- [ ] Task 2";
        default: return "Start writing your notes...";
    }
};

// --- SUB-COMPONENTS ---

const NoteCard = ({ note, onSelect, onToggleStatus }: { note: CampaignNote; onSelect: () => void; onToggleStatus: (note: CampaignNote) => void }) => {
    const meta = getNoteMeta(note.type || 'general'); // Fallback for old notes
    const contentSnippet = note.content.substring(0, 80) + (note.content.length > 80 ? '...' : '');
    const lastModifiedDate = new Date(note.lastModified).toLocaleDateString();
    const isCompleted = note.status === 'completed';
    const hasSecrets = note.dmSecrets && note.dmSecrets.trim().length > 0;

    return (
        <div 
            onClick={onSelect} 
            className={`group relative bg-[var(--bg-secondary)] rounded-lg p-4 border-l-4 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col h-44 ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
            style={{ borderLeftColor: isCompleted ? 'gray' : `var(--${meta.color.split('-')[1]}-500, #64748b)` }}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${meta.bg} ${meta.color}`}>
                    {meta.icon}
                    <span>{meta.label}</span>
                </div>
                <div className="flex gap-1">
                    {(note.type === 'quest' || note.type === 'todo') && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleStatus(note); }}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-[var(--text-muted)] hover:border-[var(--accent-primary)]'}`}
                            title={isCompleted ? "Mark Active" : "Mark Complete"}
                        >
                            {isCompleted && <span className="font-bold text-xs">✓</span>}
                        </button>
                    )}
                </div>
            </div>
            
            <h3 className={`text-lg font-bold truncate mb-1 ${isCompleted ? 'text-[var(--text-muted)] line-through decoration-2' : 'text-[var(--text-primary)]'}`}>
                {note.title}
            </h3>
            
            <p className="text-xs text-[var(--text-secondary)] flex-grow whitespace-pre-wrap overflow-hidden leading-relaxed mb-2">
                {contentSnippet || <span className="italic text-[var(--text-muted)]">No content.</span>}
            </p>
            
            <div className="flex justify-between items-end mt-auto pt-2 border-t border-[var(--border-secondary)]/50">
                <div className="flex gap-1 overflow-hidden max-w-[60%]">
                    {note.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-muted)] px-1.5 py-0.5 rounded truncate">#{tag}</span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    {hasSecrets && (
                        <div className="text-[var(--text-muted)]" title="Has DM Secrets">
                            <EyeSymbol symbolColor="currentColor" />
                        </div>
                    )}
                    <p className="text-[10px] text-[var(--text-muted)]">{lastModifiedDate}</p>
                </div>
            </div>
        </div>
    );
};

const NoteEditor = ({ 
    note, 
    onSave, 
    onCancel, 
    onDelete,
    allNotes,
    onJumpToNote
}: { 
    note: CampaignNote; 
    onSave: (note: CampaignNote) => void; 
    onCancel: () => void; 
    onDelete: () => void;
    allNotes: CampaignNote[];
    onJumpToNote: (id: string) => void;
}) => {
    const [localNote, setLocalNote] = useState<CampaignNote>({
        ...note,
        type: note.type || 'general',
        status: note.status || 'active',
        tags: note.tags || [],
        linkedNoteIds: note.linkedNoteIds || [],
        dmSecrets: note.dmSecrets || ''
    });
    const [tagInput, setTagInput] = useState('');
    const [showSecrets, setShowSecrets] = useState(false);
    const [linkSearchTerm, setLinkSearchTerm] = useState('');
    const [showLinkDropdown, setShowLinkDropdown] = useState(false);

    const meta = getNoteMeta(localNote.type);

    // Auto-populate placeholder content if empty and new
    useEffect(() => {
        if (!note.id.includes('-') && !note.content && !note.title.replace('New Note','')) { 
             // Rough check for "is new"
        }
    }, [note]);

    const handleChange = (field: keyof CampaignNote, value: any) => {
        setLocalNote(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!localNote.tags.includes(tagInput.trim())) {
                setLocalNote(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setLocalNote(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const handleSave = () => {
        onSave({ ...localNote, lastModified: Date.now() });
    };

    const handleArchive = () => {
        onSave({ ...localNote, status: 'archived', lastModified: Date.now() });
    };

    // Linking Logic
    const handleAddLink = (targetId: string) => {
        if (localNote.linkedNoteIds?.includes(targetId)) return;
        setLocalNote(prev => ({
            ...prev,
            linkedNoteIds: [...(prev.linkedNoteIds || []), targetId]
        }));
        setLinkSearchTerm('');
        setShowLinkDropdown(false);
    };

    const handleRemoveLink = (targetId: string) => {
        setLocalNote(prev => ({
            ...prev,
            linkedNoteIds: prev.linkedNoteIds?.filter(id => id !== targetId) || []
        }));
    };

    const linkSearchResults = useMemo(() => {
        if (!linkSearchTerm) return [];
        return allNotes.filter(n => 
            n.id !== localNote.id && 
            !localNote.linkedNoteIds?.includes(n.id) &&
            n.title.toLowerCase().includes(linkSearchTerm.toLowerCase())
        ).slice(0, 5);
    }, [linkSearchTerm, allNotes, localNote.linkedNoteIds, localNote.id]);

    const linkedNotes = useMemo(() => {
        return localNote.linkedNoteIds?.map(id => allNotes.find(n => n.id === id)).filter(Boolean) as CampaignNote[] || [];
    }, [localNote.linkedNoteIds, allNotes]);


    return (
        <div className="h-full flex flex-col animate-fade-in bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/30 flex flex-col gap-3 flex-shrink-0">
                <div className="flex justify-between items-start">
                    <input
                        type="text"
                        value={localNote.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Note Title"
                        className="bg-transparent text-2xl font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none flex-grow min-w-0"
                    />
                    <div className="flex gap-2">
                        {localNote.status !== 'archived' && (
                            <Button onClick={handleArchive} variant="ghost" size="sm" title="Archive Note">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs">Archive</span>
                                </div>
                            </Button>
                        )}
                        <Button onClick={onCancel} variant="ghost" size="sm">Close</Button>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Type Selector */}
                    <div className="flex items-center bg-[var(--bg-primary)] rounded-md border border-[var(--border-secondary)] p-1">
                        {NOTE_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => handleChange('type', type.id)}
                                className={`p-1.5 rounded transition-all ${localNote.type === type.id ? type.bg + ' ' + type.color + ' ring-1 ring-current' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'}`}
                                title={type.label}
                            >
                                {type.icon}
                            </button>
                        ))}
                    </div>

                    {/* Status Selector (for Quests/ToDos) */}
                    <select 
                        value={localNote.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className={`text-xs font-bold uppercase px-2 py-1.5 rounded border bg-[var(--bg-primary)] focus:outline-none ${localNote.status === 'completed' ? 'border-green-500 text-green-500' : localNote.status === 'archived' ? 'border-gray-500 text-gray-500' : 'border-amber-500 text-amber-500'}`}
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                    {localNote.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full border border-[var(--border-secondary)]">
                            #{tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-red-400 ml-1">&times;</button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="+ Add tag"
                        className="text-xs bg-transparent border-b border-transparent focus:border-[var(--accent-primary)] focus:outline-none w-20 text-[var(--text-muted)] focus:text-[var(--text-primary)] transition-all"
                    />
                </div>
            </div>

            {/* Editor Body & Extras */}
            <div className="flex-grow overflow-y-auto">
                <div className="min-h-[300px] h-full relative">
                    <textarea
                        value={localNote.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder={getTypePlaceholder(localNote.type)}
                        className="w-full h-full bg-[var(--bg-secondary)] p-6 text-[var(--text-primary)] resize-none focus:outline-none leading-relaxed min-h-[300px]"
                    />
                </div>

                {/* Linked Notes Section */}
                <div className="px-6 pb-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                    <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase mb-2 mt-4">Linked Notes</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {linkedNotes.map(ln => (
                            <span key={ln.id} className="flex items-center gap-1 text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-1 rounded-full border border-[var(--border-secondary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer group">
                                <span onClick={() => onJumpToNote(ln.id)} className="hover:underline">{ln.title}</span>
                                <button onClick={() => handleRemoveLink(ln.id)} className="ml-1 text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                            </span>
                        ))}
                    </div>
                    <div className="relative max-w-xs">
                        <div className="flex items-center gap-2 border-b border-[var(--border-secondary)] focus-within:border-[var(--accent-primary)]">
                            <SearchIcon className="w-4 h-4 text-[var(--text-muted)]" />
                            <input 
                                type="text" 
                                value={linkSearchTerm}
                                onChange={e => { setLinkSearchTerm(e.target.value); setShowLinkDropdown(true); }}
                                onFocus={() => setShowLinkDropdown(true)}
                                placeholder="Link another note..."
                                className="bg-transparent text-sm py-1 focus:outline-none w-full"
                            />
                        </div>
                        {showLinkDropdown && linkSearchTerm && (
                            <div className="absolute bottom-full mb-1 left-0 w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md shadow-lg max-h-40 overflow-y-auto z-20">
                                {linkSearchResults.length > 0 ? linkSearchResults.map(res => (
                                    <button 
                                        key={res.id} 
                                        onClick={() => handleAddLink(res.id)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] truncate"
                                    >
                                        {res.title}
                                    </button>
                                )) : (
                                    <div className="px-3 py-2 text-sm text-[var(--text-muted)]">No matching notes found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* DM Secrets Section */}
                <div className="border-t border-red-900/30 bg-red-950/10">
                    <button 
                        onClick={() => setShowSecrets(!showSecrets)}
                        className="w-full flex items-center justify-between px-6 py-3 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <EyeSymbol symbolColor="currentColor" /> DM-Only Secrets
                        </span>
                        <span>{showSecrets ? 'Hide' : 'Show'}</span>
                    </button>
                    {showSecrets && (
                        <div className="px-6 pb-6 animate-fade-in">
                            <textarea
                                value={localNote.dmSecrets}
                                onChange={(e) => handleChange('dmSecrets', e.target.value)}
                                placeholder="Hidden details, DC checks, plot twists..."
                                className="w-full bg-[var(--bg-primary)]/50 border border-red-900/30 rounded p-4 text-sm text-[var(--text-secondary)] resize-y min-h-[100px] focus:ring-1 focus:ring-red-500 focus:outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/30 flex justify-between items-center flex-shrink-0">
                <Button onClick={onDelete} variant="destructive" size="sm" className="flex items-center gap-2">
                    <TrashIcon className="w-4 h-4" /> Delete
                </Button>
                <div className="flex gap-3 text-xs text-[var(--text-muted)] items-center">
                    <span>{localNote.content.length} chars</span>
                    <Button onClick={handleSave} size="md" className="ml-2">Save Changes</Button>
                </div>
            </div>
        </div>
    );
};


const NotesManager: React.FC<NotesManagerProps> = ({ notes, addNote, updateNote, deleteNote, isLoading }) => {
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<NoteType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<NoteStatus | 'all'>('active');
    const [searchTerm, setSearchTerm] = useState('');
    const [noteToDelete, setNoteToDelete] = useState<CampaignNote | null>(null);
    const { addToast } = useToast();

    // Ensure notes have default fields if migrating from old version
    const safeNotes = useMemo(() => notes.map(n => ({
        ...n,
        type: n.type || 'general',
        status: n.status || 'active',
        tags: n.tags || [],
        linkedNoteIds: n.linkedNoteIds || [],
        dmSecrets: n.dmSecrets || ''
    })), [notes]);

    const filteredNotes = useMemo(() => {
        return safeNotes
            .filter(n => filterType === 'all' || n.type === filterType)
            .filter(n => statusFilter === 'all' || n.status === statusFilter)
            .filter(n => 
                n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => b.lastModified - a.lastModified);
    }, [safeNotes, filterType, statusFilter, searchTerm]);

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: 0 };
        NOTE_TYPES.forEach(t => c[t.id] = 0);
        safeNotes.forEach(n => {
            if (statusFilter === 'all' || n.status === statusFilter) {
                c.all++;
                if (c[n.type] !== undefined) c[n.type]++;
            }
        });
        return c;
    }, [safeNotes, statusFilter]);

    const handleCreate = async () => {
        const newNote = createEmptyCampaignNote();
        // Default to current filter type if specific
        if (filterType !== 'all') newNote.type = filterType;
        newNote.status = 'active'; // Always create as active
        
        await addNote(newNote);
        setActiveNoteId(newNote.id);
    };

    const handleSaveActive = async (updatedNote: CampaignNote) => {
        const exists = notes.some(n => n.id === updatedNote.id);
        if (exists) {
            await updateNote(updatedNote);
        } else {
            await addNote(updatedNote);
        }
        addToast(exists ? 'Note saved.' : 'Note created.', 'success');
        setActiveNoteId(null);
    };

    const handleToggleStatus = async (note: CampaignNote) => {
        const newStatus = note.status === 'completed' ? 'active' : 'completed';
        await updateNote({ ...note, status: newStatus, lastModified: Date.now() });
        addToast(`Note marked as ${newStatus}.`, 'info');
    };

    const confirmDelete = async () => {
        if (noteToDelete) {
            await deleteNote(noteToDelete.id);
            addToast('Note deleted.', 'info');
            if (activeNoteId === noteToDelete.id) setActiveNoteId(null);
            setNoteToDelete(null);
        }
    };

    if (isLoading) return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading Notes..." /></div>;

    const activeNote = activeNoteId ? safeNotes.find(n => n.id === activeNoteId) : null;

    return (
        <div className="animate-fade-in h-full flex flex-col lg:flex-row gap-4 lg:gap-6">
            
            {/* Sidebar / Filters (Desktop) & Mobile Nav */}
            <div className="lg:w-64 flex-shrink-0 flex flex-col gap-4">
                
                <div className="bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border-primary)] p-3">
                    <div className="relative mb-4">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input 
                            type="text" 
                            placeholder="Search notes..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-full py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex mb-4 bg-[var(--bg-primary)] p-1 rounded-md">
                        {(['active', 'completed', 'archived', 'all'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 text-xs py-1.5 rounded-sm capitalize transition-colors ${statusFilter === status ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-thin scrollbar-thumb-[var(--border-secondary)] pb-2 lg:pb-0">
                        <button 
                            onClick={() => setFilterType('all')}
                            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${filterType === 'all' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                        >
                            <span>All Notes</span>
                            <span className="text-xs bg-[var(--bg-primary)] px-1.5 rounded-full opacity-70">{counts.all}</span>
                        </button>
                        {NOTE_TYPES.map(t => (
                            <button 
                                key={t.id}
                                onClick={() => setFilterType(t.id)}
                                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${filterType === t.id ? t.bg + ' ' + t.color + ' font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                            >
                                <div className="flex items-center gap-2">
                                    {t.icon}
                                    <span>{t.label}s</span>
                                </div>
                                <span className="text-xs bg-[var(--bg-primary)] px-1.5 rounded-full opacity-70">{counts[t.id]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Button onClick={handleCreate} size="lg" className="w-full flex items-center justify-center gap-2 shadow-lg">
                    <PlusIcon className="w-5 h-5" /> Create Note
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow min-h-0 relative">
                {activeNote ? (
                    <div className="absolute inset-0 z-10">
                        <NoteEditor 
                            note={activeNote} 
                            onSave={handleSaveActive} 
                            onCancel={() => setActiveNoteId(null)} 
                            onDelete={() => setNoteToDelete(activeNote)}
                            allNotes={safeNotes}
                            onJumpToNote={setActiveNoteId}
                        />
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--border-secondary)]">
                        {filteredNotes.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-60">
                                <div className="w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center mb-4 border-current">
                                    <PlusIcon className="w-8 h-8" />
                                </div>
                                <p>No notes found in this view.</p>
                                <button onClick={handleCreate} className="mt-2 text-[var(--accent-primary)] hover:underline">Create one?</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                                {filteredNotes.map(note => (
                                    <NoteCard 
                                        key={note.id} 
                                        note={note} 
                                        onSelect={() => setActiveNoteId(note.id)} 
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Dialog
                isOpen={!!noteToDelete}
                onClose={() => setNoteToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Note?"
                description={`Are you sure you want to delete "${noteToDelete?.title}"? This cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default NotesManager;
