
import React, { useState, useMemo, useEffect } from 'react';
import { CampaignNote, createEmptyCampaignNote } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Loader from './ui/Loader';
import { TrashIcon } from './icons/TrashIcon';

interface NotesManagerProps {
    notes: CampaignNote[];
    addNote: (note: CampaignNote) => Promise<void>;
    updateNote: (note: CampaignNote) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    isLoading: boolean;
}

const NoteCard = ({ note, onSelect }: { note: CampaignNote; onSelect: () => void }) => {
    const contentSnippet = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');
    const lastModifiedDate = new Date(note.lastModified).toLocaleDateString();

    return (
        <div onClick={onSelect} className="group bg-[var(--bg-secondary)] rounded-lg p-4 border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_var(--glow-primary)] flex flex-col cursor-pointer h-48">
            <h3 className="text-xl font-medieval text-[var(--text-primary)] truncate">{note.title}</h3>
            <p className="text-sm text-[var(--text-muted)] flex-grow my-2">{contentSnippet}</p>
            <p className="text-xs text-[var(--text-muted)]/70 text-right">Last modified: {lastModifiedDate}</p>
        </div>
    );
};

const NewNoteCard = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="group bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 flex items-center justify-center min-h-[192px] hover:shadow-[0_0_15px_var(--glow-primary)] hover:-translate-y-1">
        <div className="text-center p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="mt-4 text-xl font-medieval text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">New Note</p>
        </div>
    </button>
);

const NoteEditor = ({ note, onSave, onCancel, onDelete }: { note: CampaignNote; onSave: (note: CampaignNote) => void; onCancel: () => void; onDelete: () => void }) => {
    const [localNote, setLocalNote] = useState(note);
    const isNewNote = !note.content && !note.title.replace('New Note','');

    useEffect(() => {
        setLocalNote(note);
    }, [note]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalNote({ ...localNote, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave({ ...localNote, lastModified: Date.now() });
    };

    return (
        <div className="animate-fade-in space-y-4 max-w-4xl mx-auto">
            <input
                type="text"
                name="title"
                value={localNote.title}
                onChange={handleChange}
                placeholder="Note Title"
                className="w-full bg-transparent text-4xl font-medieval text-amber-300 border-b-2 border-[var(--border-secondary)] focus:border-amber-400 focus:outline-none p-2"
            />
            <textarea
                name="content"
                value={localNote.content}
                onChange={handleChange}
                placeholder="Start writing your notes..."
                className="w-full h-[60vh] bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 text-[var(--text-primary)] focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <div className="flex justify-between items-center">
                <Button onClick={onDelete} variant="destructive" disabled={isNewNote}>
                    <TrashIcon className="h-5 w-5" />
                </Button>
                <div className="flex gap-4">
                    <Button onClick={onCancel} variant="ghost">Cancel</Button>
                    <Button onClick={handleSave}>Save Note</Button>
                </div>
            </div>
        </div>
    );
};


const NotesManager: React.FC<NotesManagerProps> = ({ notes, addNote, updateNote, deleteNote, isLoading }) => {
    const [activeNote, setActiveNote] = useState<CampaignNote | null>(null);
    const [noteToDelete, setNoteToDelete] = useState<CampaignNote | null>(null);

    const sortedNotes = useMemo(() => {
        return [...notes].sort((a, b) => b.lastModified - a.lastModified);
    }, [notes]);

    const handleNewNote = () => {
        setActiveNote(createEmptyCampaignNote());
    };

    const handleSelectNote = (note: CampaignNote) => {
        setActiveNote(note);
    };

    const handleSave = async (noteToSave: CampaignNote) => {
        const isNew = !notes.some(n => n.id === noteToSave.id);
        if (isNew) {
            await addNote(noteToSave);
        } else {
            await updateNote(noteToSave);
        }
        setActiveNote(null);
    };

    const handleCancel = () => {
        setActiveNote(null);
    };

    const handleDelete = () => {
        if (activeNote) {
            setNoteToDelete(activeNote);
        }
    };

    const confirmDelete = async () => {
        if (noteToDelete) {
            await deleteNote(noteToDelete.id);
            setNoteToDelete(null);
            setActiveNote(null);
        }
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading Notes..." /></div>;
    }

    if (activeNote) {
        return <NoteEditor note={activeNote} onSave={handleSave} onCancel={handleCancel} onDelete={handleDelete} />;
    }

    return (
        <div className="animate-fade-in">
             <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Campaign Notes</h2>
                <div className="w-32 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
                <p className="text-[var(--text-muted)] mt-4 text-lg">Your secret campaign chronicles and ideas.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <NewNoteCard onClick={handleNewNote} />
                {sortedNotes.map(note => (
                    <NoteCard key={note.id} note={note} onSelect={() => handleSelectNote(note)} />
                ))}
            </div>
            {notes.length === 0 && (
                <div className="text-center mt-12 text-[var(--text-muted)]/70">
                    <p>No notes yet.</p>
                    <p>Click the card above to create your first note!</p>
                </div>
            )}
             <Dialog
                isOpen={!!noteToDelete}
                onClose={() => setNoteToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to permanently delete "${noteToDelete?.title}"?`}
                confirmText="Delete"
            />
        </div>
    );
};

export default NotesManager;