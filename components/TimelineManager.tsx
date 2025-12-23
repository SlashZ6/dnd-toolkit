
import React, { useState, useMemo, useEffect } from 'react';
import { TimelineEvent, createEmptyTimelineEvent } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Loader from './ui/Loader';
import { TrashIcon } from './icons/TrashIcon';
import { useToast } from './ui/Toast';
import { SunSymbol, StarSymbol } from './crest/symbols';
import { CalendarIcon } from './icons/CalendarIcon';
import { PlusIcon } from './icons/PlusIcon';

interface TimelineManagerProps {
    events: TimelineEvent[];
    addEvent: (event: TimelineEvent) => Promise<void>;
    updateEvent: (event: TimelineEvent) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    isLoading: boolean;
}

// --- CALENDAR CONSTANTS & UTILS ---

const MONTHS = [
    { name: 'Hammer', label: 'Deepwinter' },
    { name: 'Alturiak', label: 'The Claw of Winter' },
    { name: 'Ches', label: 'The Claw of Sunsets' },
    { name: 'Tarsakh', label: 'The Claw of Storms' },
    { name: 'Mirtul', label: 'The Melting' },
    { name: 'Kythorn', label: 'The Time of Flowers' },
    { name: 'Flamerule', label: 'Summertide' },
    { name: 'Eleasis', label: 'Highsun' },
    { name: 'Eleint', label: 'The Fading' },
    { name: 'Marpenoth', label: 'Leaffall' },
    { name: 'Uktar', label: 'The Rotting' },
    { name: 'Nightal', label: 'The Drawing Down' }
];

const HOLIDAYS: Record<string, string> = {
    '1-15': 'Midwinter', // Hammer 15
    '3-19': 'Spring Equinox', // Ches 19
    '4-1': 'Greengrass', // Tarsakh 1
    '6-20': 'Summer Solstice', // Kythorn 20
    '7-1': 'Midsummer', // Flamerule 1
    '9-21': 'Autumn Equinox', // Eleint 21
    '10-1': 'Highharvestide', // Marpenoth 1
    '11-15': 'Feast of the Moon', // Uktar 15
    '12-20': 'Winter Solstice', // Nightal 20
};

const MOON_PHASES = ['Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent', 'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous'];
const WEATHER_TYPES = {
    WINTER: ['Blizzard', 'Heavy Snow', 'Light Snow', 'Freezing Fog', 'Clear & Frigid', 'Overcast', 'Bitter Wind'],
    SPRING: ['Heavy Rain', 'Light Rain', 'Thunderstorm', 'Foggy Morning', 'Clear & Breezy', 'Cloudy', 'Drizzle'],
    SUMMER: ['Scorching Heat', 'Clear & Sunny', 'Humid', 'Thunderstorm', 'Dry Wind', 'Warm Breeze', 'Overcast'],
    AUTUMN: ['Heavy Rain', 'Windy', 'Foggy', 'Clear & Cool', 'Light Rain', 'Overcast', 'Early Frost']
};

const getCalendarDate = (day: number) => {
    // 360 day standard year (12 months of 30 days)
    // We adjust day to be 0-indexed for calculation, then back up
    const d = Math.max(1, day);
    const year = Math.floor((d - 1) / 360) + 1;
    const dayOfYear = (d - 1) % 360;
    const monthIndex = Math.floor(dayOfYear / 30);
    const dayOfMonth = (dayOfYear % 30) + 1;
    
    return { year, monthIndex, month: MONTHS[monthIndex], dayOfMonth, dayOfYear };
};

const getMoonPhase = (day: number) => {
    const cycle = 28;
    const phaseIndex = Math.floor((day % cycle) / (cycle / 8));
    return MOON_PHASES[phaseIndex % 8];
};

const getWeather = (monthIndex: number) => {
    let season: keyof typeof WEATHER_TYPES = 'SPRING';
    if (monthIndex >= 10 || monthIndex <= 1) season = 'WINTER';
    else if (monthIndex >= 2 && monthIndex <= 4) season = 'SPRING';
    else if (monthIndex >= 5 && monthIndex <= 7) season = 'SUMMER';
    else season = 'AUTUMN';
    
    const options = WEATHER_TYPES[season];
    return options[Math.floor(Math.random() * options.length)];
};


// --- SUB-COMPONENTS ---

const CalendarDay: React.FC<{
    dayNum: number;
    monthIndex: number;
    year: number;
    events: TimelineEvent[];
    isToday: boolean;
    isSelected: boolean;
    onClick: () => void;
}> = ({ dayNum, monthIndex, year, events, isToday, isSelected, onClick }) => {
    const holidayKey = `${monthIndex + 1}-${dayNum}`;
    const holiday = HOLIDAYS[holidayKey];

    return (
        <button 
            onClick={onClick}
            className={`
                relative h-24 p-1 border border-[var(--border-primary)] flex flex-col items-start transition-all
                ${isToday ? 'bg-[var(--accent-primary)]/10 ring-2 ring-[var(--accent-primary)] z-10' : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'}
                ${isSelected ? 'ring-2 ring-[var(--accent-secondary)]' : ''}
            `}
        >
            <div className="flex justify-between w-full">
                <span className={`text-xs font-bold ${isToday ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>{dayNum}</span>
                {holiday && <span className="text-[9px] text-amber-400 font-bold uppercase truncate max-w-[80px]" title={holiday}>★ {holiday}</span>}
            </div>
            
            <div className="flex-grow w-full overflow-hidden mt-1 space-y-1">
                {events.map(ev => (
                    <div key={ev.id} className="text-[10px] bg-[var(--bg-primary)]/80 text-[var(--text-primary)] px-1 rounded truncate border-l-2 border-[var(--accent-secondary)]" title={ev.description}>
                        {ev.description}
                    </div>
                ))}
            </div>
        </button>
    );
};

const WeatherWidget: React.FC<{ day: number, monthIndex: number }> = ({ day, monthIndex }) => {
    const [weather, setWeather] = useState('');
    
    useEffect(() => {
        setWeather(getWeather(monthIndex));
    }, [day, monthIndex]); // Re-roll when day changes

    const handleReroll = (e: React.MouseEvent) => {
        e.stopPropagation();
        setWeather(getWeather(monthIndex));
    };

    return (
        <div className="flex items-center gap-3 bg-[var(--bg-primary)]/50 p-2 rounded-lg border border-[var(--border-secondary)]">
            <div className="flex flex-col items-center w-16 text-center">
                <div className="text-amber-400 w-6 h-6"><SunSymbol symbolColor="currentColor" /></div>
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Weather</span>
            </div>
            <div className="flex-grow">
                <p className="text-sm font-bold text-[var(--text-primary)]">{weather}</p>
                <p className="text-xs text-[var(--text-muted)]">{getMoonPhase(day)}</p>
            </div>
            <button onClick={handleReroll} className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-[var(--text-muted)] hover:text-white" title="Reroll Weather">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            </button>
        </div>
    );
};


const TimelineManager: React.FC<TimelineManagerProps> = ({ events, addEvent, updateEvent, deleteEvent, isLoading }) => {
    // Constants for view
    const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
    const [currentDay, setCurrentDay] = useState<number>(1);
    const [viewDate, setViewDate] = useState<{year: number, monthIndex: number}>(getCalendarDate(1));
    
    // Selection
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEventDesc, setNewEventDesc] = useState('');
    const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null);

    const { addToast } = useToast();

    // Determine "Today" (Maximum day in events, or 1)
    useEffect(() => {
        if (events.length > 0) {
            const maxDay = Math.max(...events.map(e => e.day));
            if (maxDay > 0) {
                setCurrentDay(maxDay);
                setSelectedDay(maxDay);
                const date = getCalendarDate(maxDay);
                setViewDate({ year: date.year, monthIndex: date.monthIndex });
            }
        }
    }, [events.length]); // Only run when events load initially roughly

    // Helpers
    const handleTimeAdvance = (days: number) => {
        const nextDay = currentDay + days;
        setCurrentDay(nextDay);
        setSelectedDay(nextDay);
        
        const date = getCalendarDate(nextDay);
        // Auto switch view if month changes
        if (date.monthIndex !== viewDate.monthIndex || date.year !== viewDate.year) {
            setViewDate({ year: date.year, monthIndex: date.monthIndex });
        }
        
        // Optional: Auto-log "Day X" note? No, leave that to user.
        addToast(`Advanced to Day ${nextDay}`, 'info');
    };

    const handlePrevMonth = () => {
        let newMonth = viewDate.monthIndex - 1;
        let newYear = viewDate.year;
        if (newMonth < 0) { newMonth = 11; newYear--; }
        if (newYear < 1) return;
        setViewDate({ year: newYear, monthIndex: newMonth });
    };

    const handleNextMonth = () => {
        let newMonth = viewDate.monthIndex + 1;
        let newYear = viewDate.year;
        if (newMonth > 11) { newMonth = 0; newYear++; }
        setViewDate({ year: newYear, monthIndex: newMonth });
    };

    const handleAddEvent = async () => {
        if (!newEventDesc.trim()) return;
        await addEvent({
            id: String(Date.now()),
            day: selectedDay,
            description: newEventDesc.trim(),
            createdAt: Date.now()
        });
        setNewEventDesc('');
        setIsAddModalOpen(false);
        addToast('Event logged.', 'success');
        
        // If adding an event in the future, update "Current Day"
        if (selectedDay > currentDay) {
            setCurrentDay(selectedDay);
        }
    };

    const handleDelete = async () => {
        if (eventToDelete) {
            await deleteEvent(eventToDelete.id);
            addToast('Event deleted.', 'info');
            setEventToDelete(null);
        }
    };

    // Filter events for the current view
    const currentMonthEvents = useMemo(() => {
        const startDay = ((viewDate.year - 1) * 360) + (viewDate.monthIndex * 30) + 1;
        const endDay = startDay + 29;
        return events.filter(e => e.day >= startDay && e.day <= endDay);
    }, [events, viewDate]);

    const selectedDayEvents = useMemo(() => {
        return events.filter(e => e.day === selectedDay).sort((a,b) => b.createdAt - a.createdAt);
    }, [events, selectedDay]);

    if (isLoading) return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading Calendar..." /></div>;

    const calendarDate = getCalendarDate(currentDay);

    return (
        <div className="animate-fade-in h-full flex flex-col">
            
            {/* --- TOP BAR: CONTROLS & INFO --- */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] p-4 flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0">
                
                {/* Current Date Display */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full border-2 border-[var(--accent-primary)] flex items-center justify-center shadow-[0_0_15px_var(--glow-primary)]">
                        <span className="text-xl font-bold font-medieval text-[var(--accent-primary)]">{calendarDate.dayOfMonth}</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-medieval text-[var(--text-primary)] leading-none">{calendarDate.month.name}</h2>
                        <p className="text-sm text-[var(--accent-secondary)] font-bold">{calendarDate.month.label}, Year {calendarDate.year}</p>
                    </div>
                </div>

                {/* Time Controls */}
                <div className="flex items-center gap-2 bg-[var(--bg-primary)]/50 p-1 rounded-lg border border-[var(--border-secondary)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] px-2">Advance:</span>
                    <button onClick={() => handleTimeAdvance(1)} className="px-3 py-1 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] rounded text-xs font-bold transition-colors">+1 Day</button>
                    <button onClick={() => handleTimeAdvance(10)} className="px-3 py-1 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] rounded text-xs font-bold transition-colors">+1 Week</button>
                    <button onClick={() => handleTimeAdvance(30)} className="px-3 py-1 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] rounded text-xs font-bold transition-colors">+1 Month</button>
                </div>

                {/* View Toggle */}
                <div className="flex bg-[var(--bg-primary)] rounded-lg p-1 border border-[var(--border-secondary)]">
                    <button onClick={() => setViewMode('CALENDAR')} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'CALENDAR' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Calendar</button>
                    <button onClick={() => setViewMode('LIST')} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'LIST' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>List</button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
                
                {/* CALENDAR GRID */}
                {viewMode === 'CALENDAR' && (
                    <div className="flex-grow p-4 overflow-y-auto flex flex-col bg-[var(--bg-primary)]/20">
                        
                        {/* Month Nav */}
                        <div className="flex justify-between items-center mb-4">
                            <Button onClick={handlePrevMonth} variant="ghost" size="sm">← Previous</Button>
                            <h3 className="text-xl font-bold font-medieval text-[var(--text-secondary)]">{MONTHS[viewDate.monthIndex].name} <span className="text-[var(--text-muted)] text-sm font-sans opacity-60">Year {viewDate.year}</span></h3>
                            <Button onClick={handleNextMonth} variant="ghost" size="sm">Next →</Button>
                        </div>

                        {/* The Grid */}
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-1 auto-rows-fr">
                            {Array.from({length: 30}).map((_, i) => {
                                const dayNum = i + 1;
                                const absDay = ((viewDate.year - 1) * 360) + (viewDate.monthIndex * 30) + dayNum;
                                const dayEvents = currentMonthEvents.filter(e => e.day === absDay);
                                const isToday = absDay === currentDay;
                                const isSelected = absDay === selectedDay;

                                return (
                                    <CalendarDay
                                        key={dayNum}
                                        dayNum={dayNum}
                                        monthIndex={viewDate.monthIndex}
                                        year={viewDate.year}
                                        events={dayEvents}
                                        isToday={isToday}
                                        isSelected={isSelected}
                                        onClick={() => setSelectedDay(absDay)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* LIST VIEW FALLBACK */}
                {viewMode === 'LIST' && (
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="max-w-3xl mx-auto space-y-4">
                             {events.sort((a,b) => b.day - a.day).map(ev => {
                                 const d = getCalendarDate(ev.day);
                                 return (
                                     <div key={ev.id} className="bg-[var(--bg-secondary)] p-4 rounded border border-[var(--border-secondary)] flex justify-between items-center">
                                         <div>
                                             <div className="text-xs text-[var(--accent-primary)] font-bold uppercase mb-1">
                                                 Day {ev.day} • {d.month.name} {d.dayOfMonth}, {d.year}
                                             </div>
                                             <div className="text-[var(--text-primary)]">{ev.description}</div>
                                         </div>
                                         <button onClick={() => setEventToDelete(ev)} className="text-[var(--text-muted)] hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                     </div>
                                 )
                             })}
                        </div>
                    </div>
                )}

                {/* SIDEBAR: DAY DETAILS */}
                <div className="w-full md:w-80 bg-[var(--bg-secondary)] border-l border-[var(--border-primary)] flex-shrink-0 flex flex-col h-full shadow-xl">
                    <div className="p-4 border-b border-[var(--border-primary)]">
                        <h4 className="font-medieval text-lg text-[var(--accent-primary)] mb-1">
                            Day {selectedDay}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)]">
                            {(() => {
                                const d = getCalendarDate(selectedDay);
                                return `${d.month.name} ${d.dayOfMonth}, Year ${d.year}`;
                            })()}
                        </p>
                        <div className="mt-4">
                            <WeatherWidget day={selectedDay} monthIndex={getCalendarDate(selectedDay).monthIndex} />
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3">
                        {selectedDayEvents.length === 0 ? (
                            <div className="text-center text-[var(--text-muted)] italic text-sm mt-10">
                                No events recorded for this day.
                            </div>
                        ) : (
                            selectedDayEvents.map(ev => (
                                <div key={ev.id} className="bg-[var(--bg-primary)] p-3 rounded border border-[var(--border-secondary)] group">
                                    <p className="text-sm text-[var(--text-primary)]">{ev.description}</p>
                                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEventToDelete(ev)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                            <TrashIcon className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/30">
                        <Button onClick={() => setIsAddModalOpen(true)} className="w-full flex items-center justify-center gap-2">
                            <PlusIcon className="w-4 h-4" /> Add Event
                        </Button>
                    </div>
                </div>
            </div>

            {/* ADD EVENT MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-vignette animate-fade-in" onClick={() => setIsAddModalOpen(false)}>
                     <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                         <h3 className="text-xl font-medieval text-[var(--accent-primary)] mb-4">Log Event for Day {selectedDay}</h3>
                         <textarea
                            value={newEventDesc}
                            onChange={e => setNewEventDesc(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] min-h-[100px]"
                            placeholder="What happened today?"
                            autoFocus
                         />
                         <div className="flex justify-end gap-3 mt-4">
                             <Button onClick={() => setIsAddModalOpen(false)} variant="ghost">Cancel</Button>
                             <Button onClick={handleAddEvent}>Save Log</Button>
                         </div>
                     </div>
                </div>
            )}

            <Dialog
                isOpen={!!eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Event?"
                description="This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
};

export default TimelineManager;
