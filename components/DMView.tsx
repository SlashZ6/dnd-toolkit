
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Character, createEmptyCharacter, NPC, Monster, CampaignNote, TimelineEvent } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Loader from './ui/Loader';
import CharacterSheet from './CharacterSheet';
import { useDmCharacters } from '../hooks/useDmCharacters';
import { SwordsIcon } from './icons/SwordsIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MonsterIcon } from './icons/MonsterIcon';
import { BookIcon } from './icons/BookIcon';
import { D20Icon } from './icons/D20Icon';
import { QuillIcon } from './icons/QuillIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import DMNotesSection from './DMNotesSection';
import NpcManager from './NpcManager';
import BestiaryManager from './BestiaryManager';
import ThemeSwitcher, { Theme } from './ui/ThemeSwitcher';
import { DiceRoller, RollResult } from './DiceRoller';
import NotesManager from './NotesManager';
import GeneratorManager from './GeneratorManager';
import { useMqttChat } from '../hooks/useMqttChat';
import DMChat from './DMChat';
import { useNpcs } from '../hooks/useNpcs';
import { useBestiary } from '../hooks/useBestiary';
import { useCampaignNotes } from '../hooks/useCampaignNotes';
import { useTimeline } from '../hooks/useTimeline';
import TimelineManager from './TimelineManager';
import { MoreVerticalIcon } from './icons/MoreVerticalIcon';
import SRDSearch from './SRDSearch';
import { SearchIcon } from './icons/SearchIcon';
import EncounterManager from './EncounterManager';
import { MapIcon } from './icons/MapIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ImportIcon } from './icons/ImportIcon';
import DmDashboard from './DmDashboard';
import { DashboardIcon } from './icons/DashboardIcon';
import { useToast } from './ui/Toast';
import Footer from './Footer';


interface DMViewProps {
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  backgroundEffectsEnabled: boolean;
  setBackgroundEffectsEnabled: (enabled: boolean) => void;
}

type DMViewMode = 'dashboard' | 'characters' | 'npcs' | 'bestiary' | 'notes' | 'calendar' | 'generators' | 'dice' | 'encounter';

// --- DB UTILS FOR BACKUP ---
const DM_DB_NAME = 'dnd-dm-toolkit';
const PLAYER_DB_NAME = 'dnd-players-toolkit';

const DM_STORES = ['characters', 'dm_notes', 'npcs', 'bestiary', 'campaign_notes', 'timeline_events'];
const PLAYER_STORES = ['homebrew_races', 'homebrew_spells', 'homebrew_classes', 'homebrew_rules', 'homebrew_official_subclasses'];

const readAllFromDB = (dbName: string, stores: string[]): Promise<Record<string, any[]>> => {
    return new Promise((resolve) => {
        const request = indexedDB.open(dbName);
        request.onerror = () => resolve({}); // Fail gracefully
        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const result: Record<string, any[]> = {};
            let completed = 0;

            if (db.objectStoreNames.length === 0) {
                resolve({});
                return;
            }

            // Filter stores that actually exist in this version of DB
            const existingStores = stores.filter(s => db.objectStoreNames.contains(s));
            
            if (existingStores.length === 0) {
                resolve({});
                return;
            }

            const transaction = db.transaction(existingStores, 'readonly');

            existingStores.forEach(storeName => {
                const store = transaction.objectStore(storeName);
                const getAllReq = store.getAll();
                getAllReq.onsuccess = () => {
                    result[storeName] = getAllReq.result;
                    completed++;
                    if (completed === existingStores.length) {
                        resolve(result);
                    }
                };
                getAllReq.onerror = () => {
                    console.error(`Failed to read ${storeName}`);
                    completed++;
                    if (completed === existingStores.length) resolve(result);
                }
            });
        };
    });
};

const writeAllToDB = (dbName: string, data: Record<string, any[]>, stores: string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
        request.onerror = () => reject("Could not open DB");
        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const existingStores = stores.filter(s => db.objectStoreNames.contains(s));
            
            if (existingStores.length === 0) {
                resolve();
                return;
            }

            const transaction = db.transaction(existingStores, 'readwrite');
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);

            existingStores.forEach(storeName => {
                if (data[storeName]) {
                    const store = transaction.objectStore(storeName);
                    data[storeName].forEach(item => {
                        store.put(item);
                    });
                }
            });
        };
    });
};


const NavItem: React.FC<{
  label: string;
  view: DMViewMode;
  activeView: DMViewMode;
  setView: (view: DMViewMode) => void;
  children: React.ReactNode;
}> = ({ label, view, activeView, setView, children }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full p-1 lg:p-3 rounded-lg transition-colors duration-200 h-full lg:h-auto lg:my-1 ${
        isActive
          ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
          : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
      }`}
      aria-label={label}
    >
      <div className="w-6 h-6">{children}</div>
      <span className="text-[11px] lg:text-base mt-1 lg:mt-0 lg:ml-4 lg:font-bold">{label}</span>
    </button>
  );
};

const DMCharacterCard: React.FC<{ 
  character: Character, 
  onSelect: () => void, 
  onDelete: () => void 
}> = ({ character, onSelect, onDelete }) => (
  <div className="group bg-[var(--bg-secondary)] rounded-lg overflow-hidden border-2 border-[var(--border-primary)] hover:border-[var(--border-accent-secondary)] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_var(--glow-secondary)] flex flex-col">
    <div onClick={onSelect} className="cursor-pointer flex-grow">
      <div className="h-40 bg-[var(--bg-primary)]/70 flex items-center justify-center overflow-hidden">
        {character.appearanceImage ? (
          <img src={character.appearanceImage} alt={character.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cover bg-center">
            <SwordsIcon className="h-20 w-20 text-[var(--bg-quaternary)] group-hover:text-[var(--accent-secondary)] transition-colors duration-300" />
          </div>
        )}
      </div>
      <div className="p-4 bg-gradient-to-t from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <h3 className="text-xl font-medieval text-[var(--text-primary)] truncate">{character.name || 'Unnamed Hero'}</h3>
        <p className="text-sm text-[var(--text-muted)] truncate">
          Level {character.level} {character.race} {character.characterClass}
        </p>
      </div>
    </div>
    <div className="p-2 bg-[var(--bg-primary)] border-t border-[var(--border-primary)] flex gap-2">
      <Button onClick={onSelect} variant="ghost" size="sm" className="w-full">View Sheet</Button>
      <Button onClick={(e) => { e.stopPropagation(); onDelete(); }} variant="ghost" size="sm" className="!p-2 aspect-square text-[var(--text-muted)] hover:text-red-500 hover:bg-red-900/30">
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  </div>
);

const CharactersView: React.FC<{ focusId?: string | null }> = ({ focusId }) => {
  const { characters, addCharacter, updateCharacter, deleteCharacter, isLoading } = useDmCharacters();
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [characterToUpdate, setCharacterToUpdate] = useState<Character | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Auto-focus logic
  useEffect(() => {
      if (focusId && characters.length > 0 && !activeCharacter) {
          const char = characters.find(c => c.id === focusId);
          if (char) setActiveCharacter(char);
      }
  }, [focusId, characters, activeCharacter]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedData = JSON.parse(text);

        if (typeof importedData.id !== 'string' || typeof importedData.name !== 'string') {
          throw new Error('Invalid character file format.');
        }

        const characterToSave = {
          ...createEmptyCharacter(importedData.id),
          ...importedData
        };

        const existing = characters.find(c => c.id === characterToSave.id);
        if (existing) {
          setCharacterToUpdate(characterToSave);
        } else {
          addCharacter(characterToSave);
          addToast('Character imported successfully.', 'success');
        }

      } catch (error) {
        console.error("Failed to import character:", error);
        addToast("Failed to import character file.", 'error');
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteClick = (character: Character) => {
    setCharacterToDelete(character);
  };
  
  const confirmDelete = async () => {
    if (characterToDelete) {
      await deleteCharacter(characterToDelete.id);
      setCharacterToDelete(null);
      addToast('Character deleted.', 'info');
    }
  };

  const confirmUpdate = async () => {
    if (characterToUpdate) {
      await updateCharacter(characterToUpdate);
      setCharacterToUpdate(null);
      addToast('Character updated successfully.', 'success');
    }
  };

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading Characters..." /></div>;
  }
  
  if (activeCharacter) {
    return (
      <div className="animate-fade-in">
         <header className="w-full mb-4 flex">
             <Button onClick={() => setActiveCharacter(null)} variant="ghost" size="sm" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                Back to All Characters
            </Button>
         </header>
         <main className="w-full max-w-5xl mx-auto space-y-6">
            <CharacterSheet character={activeCharacter} isReadOnly={true} />
            <DMNotesSection characterId={activeCharacter.id} />
         </main>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Characters</h2>
        <div className="w-32 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
        <p className="text-[var(--text-muted)] mt-4 text-lg">Oversee your players' characters.</p>
        <div className="mt-6">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".json" />
            <Button onClick={handleImportClick} size="lg">Import Character File</Button>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map(char => (
            <DMCharacterCard key={char.id} character={char} onSelect={() => setActiveCharacter(char)} onDelete={() => handleDeleteClick(char)} />
          ))}
      </div>

       {characters.length === 0 && (
          <div className="text-center mt-12 text-[var(--text-muted)]/70">
              <p>You haven't imported any characters yet.</p>
              <p>Ask your players to use the "Export Data" button and send you the file!</p>
          </div>
      )}

       <Dialog
        isOpen={!!characterToDelete}
        onClose={() => setCharacterToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to remove ${characterToDelete?.name || 'this character'} from your dashboard? This will not affect the player's character.`}
        confirmText="Delete"
      />
      <Dialog
        isOpen={!!characterToUpdate}
        onClose={() => setCharacterToUpdate(null)}
        onConfirm={confirmUpdate}
        title="Update Character Sheet?"
        description={`A character file for "${characterToUpdate?.name}" already exists on your dashboard. Would you like to update it with the new file? Your private DM notes for this character will be preserved.`}
        confirmText="Update"
        confirmVariant="default"
      />
    </div>
  );
};

const DMView: React.FC<DMViewProps> = ({ onLogout, theme, setTheme, backgroundEffectsEnabled, setBackgroundEffectsEnabled }) => {
  const [view, setView] = useState<DMViewMode>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [isSrdSearchOpen, setSrdSearchOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  
  // Lifted state
  const { characters, isLoading: charactersLoading } = useDmCharacters();
  const { npcs, addNpc, updateNpc, deleteNpc, isLoading: npcsLoading } = useNpcs();
  const { monsters, addMonster, updateMonster, deleteMonster, isLoading: monstersLoading } = useBestiary();
  const { notes, addNote, updateNote, deleteNote, isLoading: notesLoading } = useCampaignNotes();
  const { events, addEvent, updateEvent, deleteEvent, isLoading: eventsLoading } = useTimeline();
  const [diceHistory, setDiceHistory] = useState<RollResult[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMoreMenuOpen &&
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  const dmCharacter: Character = useMemo(() => ({
    ...createEmptyCharacter('dm-user-007'),
    name: 'Dungeon Master'
  }), []);

  const { messages, publishMessage, isConnected, connectedUsers } = useMqttChat(dmCharacter);

  const handleSetView = (newView: DMViewMode) => {
    setView(newView);
    setFocusId(null); // Clear focus when manually changing view
    setIsMoreMenuOpen(false);
  };
  
  const handleNavigate = (type: 'character' | 'npc' | 'monster', id: string) => {
      if (type === 'character') setView('characters');
      if (type === 'npc') setView('npcs');
      if (type === 'monster') setView('bestiary');
      setFocusId(id);
  };

  const handleExportCampaign = async () => {
      setIsExporting(true);
      // Using setTimeout to yield to the event loop so React can render the Loader
      setTimeout(async () => {
          try {
              const dmData = await readAllFromDB(DM_DB_NAME, DM_STORES);
              const homebrewData = await readAllFromDB(PLAYER_DB_NAME, PLAYER_STORES);
              
              const fullBackup = {
                  timestamp: Date.now(),
                  version: '1.0',
                  ...dmData,
                  ...homebrewData
              };

              const jsonString = JSON.stringify(fullBackup, null, 2);
              const blob = new Blob([jsonString], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              const dateStr = new Date().toISOString().slice(0, 10);
              link.download = `campaign_backup_${dateStr}.json`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              addToast('Campaign backup exported successfully.', 'success');
          } catch (err) {
              console.error("Export failed", err);
              addToast("Failed to export campaign data.", 'error');
          } finally {
              setIsExporting(false);
          }
      }, 100);
  };

  const handleImportCampaignClick = () => {
      importInputRef.current?.click();
  };

  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      
      setTimeout(() => {
          const reader = new FileReader();
          reader.onload = async (ev) => {
              try {
                  const text = ev.target?.result as string;
                  const data = JSON.parse(text);
                  
                  // Basic Validation
                  if (!data.timestamp) throw new Error("Invalid backup file.");

                  // Write to DM DB
                  await writeAllToDB(DM_DB_NAME, data, DM_STORES);
                  
                  // Write to Player DB (Homebrew)
                  await writeAllToDB(PLAYER_DB_NAME, data, PLAYER_STORES);

                  addToast("Campaign imported successfully. Reloading...", 'success');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);

              } catch (err) {
                  console.error("Import failed", err);
                  addToast("Failed to import campaign data.", 'error');
                  setIsImporting(false);
              }
          };
          reader.readAsText(file);
      }, 100);
      
      if (e.target) e.target.value = '';
  };

  const handleDiceRoll = (result: RollResult) => {
      setDiceHistory(prev => [result, ...prev]);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <DmDashboard diceHistory={diceHistory} onRoll={handleDiceRoll} characters={characters} npcs={npcs} monsters={monsters} onNavigate={handleNavigate} />;
      case 'characters':
        return <CharactersView focusId={focusId} />;
      case 'npcs':
        return <NpcManager npcs={npcs} addNpc={addNpc} updateNpc={updateNpc} deleteNpc={deleteNpc} isLoading={npcsLoading} focusId={focusId} />;
      case 'bestiary':
        return <BestiaryManager monsters={monsters} addMonster={addMonster} updateMonster={updateMonster} deleteMonster={deleteMonster} isLoading={monstersLoading} focusId={focusId} />;
      case 'notes':
        return <NotesManager notes={notes} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} isLoading={notesLoading} />;
      case 'calendar':
        return <TimelineManager 
                  events={events}
                  addEvent={addEvent}
                  updateEvent={updateEvent}
                  deleteEvent={deleteEvent}
                  isLoading={eventsLoading} 
               />;
      case 'generators':
        return <GeneratorManager />;
      case 'dice':
        return <DiceRoller history={diceHistory} setHistory={setDiceHistory} />;
      case 'encounter':
        return <EncounterManager characters={characters} npcs={npcs} monsters={monsters} isLoading={charactersLoading || npcsLoading || monstersLoading} />;
      default:
        return <DmDashboard diceHistory={diceHistory} onRoll={handleDiceRoll} characters={characters} npcs={npcs} monsters={monsters} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen text-[var(--text-primary)]">
      {isImporting && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
              <Loader message="Importing Campaign Data... (This may take a moment)" />
          </div>
      )}
      
      {isExporting && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
              <Loader message="Generating Backup File..." />
          </div>
      )}
      
      <input type="file" ref={importInputRef} onChange={handleImportFileSelect} className="hidden" accept=".json" />

      {/* Sidebar on Desktop, Bottom Bar on Mobile */}
      <aside className="fixed bottom-0 left-0 right-0 z-20 h-16 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] lg:static lg:h-screen lg:w-56 lg:flex lg:flex-col lg:justify-between lg:border-t-0 lg:border-r lg:p-2 lg:shadow-lg shrink-0">
        {/* Desktop Sidebar Content */}
        <div className="hidden lg:block">
          <h2 className="text-2xl font-medieval text-center text-amber-300 mb-4 mt-2">DM Toolkit</h2>
          <nav>
            <NavItem label="Dashboard" view="dashboard" activeView={view} setView={handleSetView}><DashboardIcon /></NavItem>
            <NavItem label="Characters" view="characters" activeView={view} setView={handleSetView}><UserCircleIcon /></NavItem>
            <NavItem label="Encounter" view="encounter" activeView={view} setView={handleSetView}><MapIcon /></NavItem>
            <NavItem label="NPCs" view="npcs" activeView={view} setView={handleSetView}><UsersIcon /></NavItem>
            <NavItem label="Beasts" view="bestiary" activeView={view} setView={handleSetView}><MonsterIcon /></NavItem>
            <NavItem label="Notes" view="notes" activeView={view} setView={handleSetView}><BookIcon /></NavItem>
            <NavItem label="Calendar" view="calendar" activeView={view} setView={handleSetView}><CalendarIcon /></NavItem>
          </nav>
        </div>
        <div className="hidden lg:block space-y-2">
          <nav className="border-t border-slate-700 pt-2">
            <NavItem label="Generators" view="generators" activeView={view} setView={handleSetView}><QuillIcon /></NavItem>
            <NavItem label="Dice Roller" view="dice" activeView={view} setView={handleSetView}><D20Icon /></NavItem>
          </nav>
          <div className="border-t border-slate-700 pt-2 flex gap-2">
              <button onClick={handleExportCampaign} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[10px]" title="Export Campaign">
                  <DownloadIcon className="h-5 w-5 mb-1" /> Export
              </button>
              <button onClick={handleImportCampaignClick} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[10px]" title="Import Campaign">
                  <ImportIcon className="h-5 w-5 mb-1" /> Import
              </button>
          </div>
        </div>
        
        {/* Mobile Bottom Bar Content */}
        <nav className="lg:hidden flex justify-around items-center h-full px-1 relative">
          <NavItem label="Home" view="dashboard" activeView={view} setView={handleSetView}><DashboardIcon /></NavItem>
          <NavItem label="Chars" view="characters" activeView={view} setView={handleSetView}><UserCircleIcon /></NavItem>
          <NavItem label="Map" view="encounter" activeView={view} setView={handleSetView}><MapIcon /></NavItem>
          <NavItem label="NPCs" view="npcs" activeView={view} setView={handleSetView}><UsersIcon /></NavItem>
          
          <div className="relative h-full flex items-center justify-center w-full">
              <button
                ref={moreButtonRef}
                onClick={() => setIsMoreMenuOpen(prev => !prev)}
                className={`flex flex-col items-center justify-center w-full p-1 rounded-lg transition-colors duration-200 h-full ${
                  ['bestiary', 'notes', 'calendar', 'generators', 'dice'].includes(view)
                    ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
                aria-label="More options"
              >
                <div className="w-6 h-6"><MoreVerticalIcon /></div>
                <span className="text-[11px] mt-1">More</span>
              </button>
  
              {isMoreMenuOpen && (
                <div
                  ref={moreMenuRef}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl z-30 p-2 animate-fade-in"
                  style={{ animationDuration: '150ms' }}
                >
                  <ul className="space-y-1">
                    <li>
                      <button onClick={() => handleSetView('bestiary')} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white">
                        <MonsterIcon className="w-5 h-5" /> Beasts
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleSetView('notes')} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white">
                        <BookIcon className="w-5 h-5" /> Notes
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleSetView('calendar')} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white">
                        <CalendarIcon className="w-5 h-5" /> Calendar
                      </button>
                    </li>
                      <li>
                      <button onClick={() => handleSetView('generators')} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white">
                        <QuillIcon className="w-5 h-5" /> Generators
                      </button>
                    </li>
                     <li>
                      <button onClick={() => handleSetView('dice')} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white">
                        <D20Icon className="w-5 h-5" /> Dice
                      </button>
                    </li>
                    <li className="border-t border-[var(--border-primary)] my-1"></li>
                    <li>
                        <button onClick={handleExportCampaign} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white">
                            <DownloadIcon className="w-5 h-5" /> Export Campaign
                        </button>
                    </li>
                    <li>
                        <button onClick={handleImportCampaignClick} className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white">
                            <ImportIcon className="w-5 h-5" /> Import Campaign
                        </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pb-16 lg:pb-0">
        <header className="w-full p-4 flex justify-between items-center bg-[var(--bg-secondary)]/80 backdrop-blur-sm border-b border-[var(--border-primary)] sticky top-0 z-10">
          <h2 className="text-2xl font-medieval capitalize text-[var(--text-primary)]">{view === 'bestiary' ? 'Beasts' : view}</h2>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button onClick={() => setSrdSearchOpen(true)} variant="ghost" size="sm" className="!p-2" aria-label="SRD Search">
                <SearchIcon className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-[var(--border-primary)]" />
            <div className="w-40">
              <ThemeSwitcher 
                currentTheme={theme} 
                onThemeChange={setTheme}
                backgroundEffectsEnabled={backgroundEffectsEnabled}
                onBackgroundEffectsChange={setBackgroundEffectsEnabled}
              />
            </div>
            <Button onClick={onLogout} variant="ghost" size="sm">Log Out</Button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          {isChatOpen ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full p-4 sm:p-6 lg:p-8">
              <div className="xl:col-span-2 h-full overflow-y-auto">
                {renderContent()}
              </div>
              <div className="xl:col-span-1 h-full">
                <div className="relative h-full animate-fade-in">
                  <button 
                    onClick={() => setIsChatOpen(false)} 
                    className="absolute top-2 right-2 z-10 bg-[var(--bg-secondary)]/70 rounded-full p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    aria-label="Close Chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  <DMChat
                    activeCharacter={dmCharacter}
                    messages={messages}
                    publishMessage={publishMessage}
                    isConnected={isConnected}
                    connectedUsers={connectedUsers}
                    npcs={npcs}
                    monsters={monsters}
                    notes={notes}
                    diceHistory={diceHistory}
                    timelineEvents={events}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <div className={`h-full overflow-y-auto ${view === 'dashboard' || view === 'encounter' ? '' : 'p-4 sm:p-6 lg:p-8'}`}>
                {renderContent()}
              </div>
              <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="bg-[var(--bg-secondary)] border-2 border-r-0 border-[var(--border-primary)] rounded-l-lg p-3 py-4 hover:bg-[var(--bg-tertiary)] transition-all shadow-lg hover:shadow-xl flex flex-col items-center gap-2"
                  aria-label="Open Chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  <span 
                    className="font-medieval text-sm tracking-wider text-[var(--text-secondary)] [writing-mode:vertical-rl] [text-orientation:mixed]"
                  >
                    Chat
                  </span>
                </button>
              </div>
            </div>
          )}
        </main>
        <Footer className="lg:p-4" />
      </div>
      <SRDSearch isOpen={isSrdSearchOpen} onClose={() => setSrdSearchOpen(false)} />
    </div>
  );
};

export default DMView;
