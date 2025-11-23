
import React, { useState, useMemo } from 'react';
import { TimelineEvent, createEmptyTimelineEvent } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Loader from './ui/Loader';
import { TrashIcon } from './icons/TrashIcon';
import { useToast } from './ui/Toast';

interface TimelineManagerProps {
    events: TimelineEvent[];
    addEvent: (event: TimelineEvent) => Promise<void>;
    updateEvent: (event: TimelineEvent) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    isLoading: boolean;
}

const TimelineManager: React.FC<TimelineManagerProps> = ({ events, addEvent, updateEvent, deleteEvent, isLoading }) => {
    const [newEvent, setNewEvent] = useState(createEmptyTimelineEvent());
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
    const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null);
    const { addToast } = useToast();

    const sortedEvents = useMemo(() => {
        return [...events].sort((a, b) => a.day - b.day || a.createdAt - b.createdAt);
    }, [events]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, eventToUpdate: TimelineEvent, setter: React.Dispatch<React.SetStateAction<TimelineEvent>>) => {
        const { name, value } = e.target;
        setter({ ...eventToUpdate, [name]: name === 'day' ? parseInt(value) || 1 : value });
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.description.trim()) return;
        await addEvent(newEvent);
        addToast('Event added to timeline.', 'success');
        setNewEvent(createEmptyTimelineEvent());
    };

    const handleUpdateEvent = async () => {
        if (!editingEvent || !editingEvent.description.trim()) return;
        await updateEvent(editingEvent);
        addToast('Event updated.', 'success');
        setEditingEvent(null);
    };

    const handleDeleteClick = (event: TimelineEvent) => {
        setEventToDelete(event);
    };

    const confirmDelete = async () => {
        if (eventToDelete) {
            await deleteEvent(eventToDelete.id);
            addToast('Event deleted.', 'info');
            setEventToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading Timeline..." /></div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Campaign Calendar</h2>
                <div className="w-32 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
                <p className="text-[var(--text-muted)] mt-4 text-lg">Track important events and plot points in your campaign.</p>
            </div>

            <form onSubmit={handleAddEvent} className="bg-[var(--bg-secondary)]/50 p-4 rounded-lg border border-[var(--border-primary)] mb-8 flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-24 flex-shrink-0">
                    <label htmlFor="day" className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Day</label>
                    <input
                        type="number"
                        name="day"
                        value={newEvent.day}
                        onChange={(e) => handleInputChange(e, newEvent, setNewEvent)}
                        min="1"
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)]"
                        required
                    />
                </div>
                <div className="flex-grow w-full">
                    <label htmlFor="description" className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Event Description</label>
                    <input
                        type="text"
                        name="description"
                        value={newEvent.description}
                        onChange={(e) => handleInputChange(e, newEvent, setNewEvent)}
                        placeholder="e.g., The Festival of the Sun begins."
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)]"
                        required
                    />
                </div>
                <Button type="submit">Add Event</Button>
            </form>

            <div className="space-y-4">
                {sortedEvents.map(event => (
                    editingEvent?.id === event.id ? (
                        <div key={event.id} className="bg-[var(--bg-tertiary)]/50 p-4 rounded-lg border border-amber-400 flex flex-col sm:flex-row gap-4 items-end">
                            <div className="w-24 flex-shrink-0">
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Day</label>
                                <input type="number" name="day" value={editingEvent.day} onChange={(e) => handleInputChange(e, editingEvent, setEditingEvent)} min="1" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2" required />
                            </div>
                            <div className="flex-grow w-full">
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Description</label>
                                <input type="text" name="description" value={editingEvent.description} onChange={(e) => handleInputChange(e, editingEvent, setEditingEvent)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2" required />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setEditingEvent(null)} variant="ghost" size="sm">Cancel</Button>
                                <Button onClick={handleUpdateEvent} size="sm">Save</Button>
                            </div>
                        </div>
                    ) : (
                        <div key={event.id} className="group bg-[var(--bg-primary)]/50 p-4 rounded-lg border border-[var(--border-primary)] flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-bold text-amber-300 w-16 text-center">Day {event.day}</div>
                                <p className="text-[var(--text-primary)]">{event.description}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button onClick={() => setEditingEvent(event)} variant="ghost" size="sm">Edit</Button>
                                <Button onClick={() => handleDeleteClick(event)} variant="ghost" size="sm" className="!p-2 aspect-square text-[var(--text-muted)] hover:text-red-500 hover:bg-red-900/30">
                                    <TrashIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )
                ))}
            </div>

             {events.length === 0 && (
                <div className="text-center mt-12 text-[var(--text-muted)]/70">
                    <p>Your timeline is empty.</p>
                    <p>Add an event above to start building your campaign's calendar.</p>
                </div>
            )}

             <Dialog
                isOpen={!!eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to delete this event? Day ${eventToDelete?.day}: "${eventToDelete?.description}"`}
                confirmText="Delete"
            />
        </div>
    );
};

export default TimelineManager;
