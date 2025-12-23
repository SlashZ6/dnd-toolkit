
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Character, CrestData, createEmptyCharacter, ContentPayload } from './types';
import { useCharacters } from './hooks/useCharacters';
import { useMqttChat } from './hooks/useMqttChat'; // Actually P2P now
import CharacterForm from './components/CharacterForm';
import CharacterSheet from './components/CharacterSheet';
import CharacterDashboard from './components/CharacterDashboard';
import CharacterSheetExporter from './components/CharacterSheetExporter';
import Button from './components/ui/Button';
import Dialog from './components/ui/Dialog';
import Loader from './components/ui/Loader';
import CampaignChat from './components/CampaignChat';
import LoginScreen from './components/LoginScreen';
import DMView from './components/DMView';
import ThemeSwitcher, { Theme } from './components/ui/ThemeSwitcher';
import CrestCreator from './components/crest/CrestCreator';
import SRDSearch from './components/SRDSearch';
import { SearchIcon } from './components/icons/SearchIcon';
import ToggleSwitch from './components/ui/ToggleSwitch';
import HomebrewManager from './components/HomebrewManager';
import { HomebrewIcon } from './components/icons/HomebrewIcon';
import { MoreVerticalIcon } from './components/icons/MoreVerticalIcon';
import { ToastProvider, useToast } from './components/ui/Toast';
import Footer from './components/Footer';
import { SessionOverlay } from './components/SessionOverlay';
import { MapIcon } from './components/icons/MapIcon';
import PlayerCanvasView from './components/PlayerCanvasView';
import PlayerDiceRoller from './components/PlayerDiceRoller'; // Import New Roller
import { D20Icon } from './components/icons/D20Icon';
import { RollResult } from './components/DiceRoller';

// Declare the html-to-image library for TypeScript
declare const htmlToImage: {
  toPng: (node: HTMLElement, options?: any) => Promise<string>;
};

type View = 'DASHBOARD' | 'SHEET' | 'FORM' | 'CREST_CREATOR' | 'HOMEBREW' | 'MAP';

interface PlayerViewProps {
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  backgroundEffectsEnabled: boolean;
  setBackgroundEffectsEnabled: (enabled: boolean) => void;
}

const PlayerView: React.FC<PlayerViewProps> = ({ onLogout, theme, setTheme, backgroundEffectsEnabled, setBackgroundEffectsEnabled }) => {
  const { characters, addCharacter, updateCharacter, deleteCharacter, isLoading } = useCharacters();
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [isExporting, setIsExporting] = useState(false);
  const [characterToExport, setCharacterToExport] = useState<Character | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSrdSearchOpen, setSrdSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false); // New State
  
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const [characterToUpdate, setCharacterToUpdate] = useState<Character | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  
  // P2P Connection State
  const activeCharacter = characters.find(c => c.id === activeCharacterId);
  const [dmId, setDmId] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [targetDmId, setTargetDmId] = useState('');

  // Canvas State
  const [canvasState, setCanvasState] = useState<any>(null);

  const { addToast } = useToast();

  // Update dmId when active character changes
  useEffect(() => {
      if (activeCharacter?.campaignId) {
          setDmId(activeCharacter.campaignId);
      } else {
          setDmId('');
      }
  }, [activeCharacter]);
  
  const sessionCharacter = useMemo(() => {
      if (activeCharacter) return activeCharacter;
      return { 
          ...createEmptyCharacter('player-observer'), 
          name: 'Observer' 
      };
  }, [activeCharacter]);
  
  // Initialize P2P Connection
  const { messages, publishMessage, isConnected, connectedUsers, error, connectionStatus } = useMqttChat(sessionCharacter, 'PLAYER', dmId);

  // Listen for canvas updates
  useEffect(() => {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.type === 'canvas_update') {
          const payload = lastMsg.payload as ContentPayload;
          if (payload.canvasState) {
              setCanvasState(payload.canvasState);
              addToast('Map updated by DM.', 'info');
          }
      }
  }, [messages, addToast]);

  // Close mobile menu when view changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const handleNewCharacter = () => {
    setActiveCharacterId(null);
    setCurrentView('FORM');
  };
  
  const handleSelectCharacter = (id: string) => {
    setActiveCharacterId(id);
    setCurrentView('SHEET');
  };

  const handleEdit = () => {
    if (activeCharacterId) {
      setCurrentView('FORM');
    }
  };
  
  const handleDelete = () => {
    if (activeCharacter) {
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
     if (activeCharacter) {
      await deleteCharacter(activeCharacter.id);
      setActiveCharacterId(null);
      setCurrentView('DASHBOARD');
      setDeleteModalOpen(false);
      addToast('Character deleted.', 'info');
    }
  };

  const handleSave = async (charToSave: Character) => {
    if (characters.some(c => c.id === charToSave.id)) {
      await updateCharacter(charToSave);
      addToast('Character updated successfully.', 'success');
    } else {
      await addCharacter(charToSave);
      addToast('Character created successfully!', 'success');
    }
    setActiveCharacterId(charToSave.id);
    setCurrentView('SHEET');
  };

  const handleCancelForm = () => {
    if (currentView === 'CREST_CREATOR' && activeCharacterId) {
        setCurrentView('SHEET');
    } else {
        setCurrentView(activeCharacterId ? 'SHEET' : 'DASHBOARD');
    }
  };
  
  const handleBack = () => {
    if (currentView === 'FORM' || currentView === 'CREST_CREATOR') {
        handleCancelForm();
    } else if (currentView === 'SHEET' || currentView === 'HOMEBREW' || currentView === 'MAP') {
        setCurrentView('DASHBOARD');
    }
  };

  const backButtonText = () => {
    if (currentView === 'FORM' || currentView === 'CREST_CREATOR') {
        return activeCharacterId ? 'Back to Sheet' : 'Back to Dashboard';
    }
    if (currentView === 'SHEET' || currentView === 'HOMEBREW' || currentView === 'MAP') {
        return 'Dashboard';
    }
    return 'Back';
  };

  const handleExportCharacterSheet = (characterId: string) => {
    const char = characters.find(c => c.id === characterId);
    if (char) {
      setCharacterToExport(char);
      setIsExporting(true);
    }
  };

  const handleExportDataFile = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    try {
        const jsonString = JSON.stringify(character, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeName = character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `${safeName || 'character'}_dnd_data.json`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addToast('Character data exported.', 'success');
    } catch (error) {
        console.error('Error exporting character data:', error);
        addToast('Error exporting character data.', 'error');
    }
  };
  
  const handleImportCharacter = () => {
    importFileInputRef.current?.click();
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const importedData = JSON.parse(text);

        if (typeof importedData.id !== 'string' || typeof importedData.name !== 'string') {
          throw new Error('Invalid character file format.');
        }
        
        const characterToSave: Character = {
            ...createEmptyCharacter(importedData.id),
            ...importedData
        };

        const existing = characters.find(c => c.id === characterToSave.id);
        if (existing) {
          setCharacterToUpdate(characterToSave);
          setUpdateModalOpen(true);
        } else {
          await addCharacter(characterToSave);
          handleSelectCharacter(characterToSave.id);
          addToast('Character imported successfully!', 'success');
        }

      } catch (error) {
        console.error("Failed to import character:", error);
        addToast("Failed to import. Invalid file format.", 'error');
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };
  
  const confirmUpdate = async () => {
     if (characterToUpdate) {
      await updateCharacter(characterToUpdate);
      setUpdateModalOpen(false);
      setCharacterToUpdate(null);
      handleSelectCharacter(characterToUpdate.id);
      addToast('Character updated from file.', 'success');
    }
  };

  const generateImage = async (node: HTMLElement, characterName: string) => {
    try {
      if (typeof htmlToImage === 'undefined') {
        console.error('html-to-image library not loaded. Make sure the script is in index.html.');
        addToast('Export library failed to load.', 'error');
        return;
      }

      const primaryBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();

      const dataUrl = await htmlToImage.toPng(node, {
        quality: 0.98,
        backgroundColor: primaryBg || '#0f172a',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      const safeName = characterName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${safeName || 'character'}_sheet.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Character sheet image exported!', 'success');
    } catch (error) {
        console.error('Error generating character sheet image:', error);
        addToast('Error generating character sheet image.', 'error');
    } finally {
        setIsExporting(false);
        setCharacterToExport(null);
    }
  };
  
  useEffect(() => {
    if (characterToExport && exportRef.current) {
        const node = exportRef.current.firstChild as HTMLElement;
        if (!node) {
            setIsExporting(false);
            setCharacterToExport(null);
            return;
        };

        const timer = setTimeout(() => {
            generateImage(node, characterToExport.name);
        }, 500);

        return () => clearTimeout(timer);
    }
  }, [characterToExport]);
  
  const handleJoinSession = async () => {
      const code = targetDmId.trim().toUpperCase();
      if(code) {
          setDmId(code);
          if (activeCharacter) {
              await updateCharacter({ ...activeCharacter, campaignId: code });
              addToast(`Character linked to Campaign: ${code}`, 'success');
          }
          setIsJoinModalOpen(false);
      }
  };
  
  const handleLeaveSession = async () => {
      setDmId('');
      if (activeCharacter) {
          await updateCharacter({ ...activeCharacter, campaignId: '' });
          addToast('Disconnected from campaign.', 'info');
      }
  };

  const handlePlayerRoll = (result: RollResult) => {
    // 1. Add to local history (optional, currently app history is for sheet actions)
    // You could add it to a separate roll history if desired.
    
    // 2. Broadcast to DM/Players
    if (isConnected) {
        publishMessage('roll_share', {
            roll: result
        });
        addToast(`Rolled ${result.total}!`, 'success');
    } else {
        addToast(`Rolled ${result.total} (Offline)`, 'info');
    }
    
    // Auto-close modal after a short delay so user can see result? 
    // Or keep open for multiple rolls. Keeping open is usually better UX for combat.
  };

  const renderContent = () => {
    switch (currentView) {
      case 'FORM':
        return <CharacterForm
          character={activeCharacter}
          onSave={handleSave}
          onCancel={handleCancelForm}
          key={activeCharacter?.id || 'new-character'}
        />;
      case 'CREST_CREATOR':
        return activeCharacter ? <CrestCreator
          character={activeCharacter}
          onSave={handleSave}
          onCancel={handleCancelForm}
        /> : null;
      case 'HOMEBREW':
        return <HomebrewManager />;
      case 'MAP':
        return canvasState ? (
          <div className="absolute inset-0 bg-black z-50">
            <PlayerCanvasView canvasState={canvasState} onClose={() => setCurrentView('SHEET')} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
             <div className="text-center">
                 <MapIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                 <p>No map data received from DM yet.</p>
             </div>
          </div>
        );
      case 'SHEET':
        if (activeCharacter) {
          return (
            <>
              {isChatOpen ? (
                // --- CHAT OPEN VIEW ---
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full animate-fade-in">
                  <div className="xl:col-span-2 h-full overflow-y-auto">
                    <CharacterSheet
                      character={activeCharacter}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onUpdate={updateCharacter}
                      history={history}
                      setHistory={setHistory}
                      onEditCrest={() => setCurrentView('CREST_CREATOR')}
                    />
                  </div>
                  <div className="xl:col-span-1 h-full">
                    <div className="relative h-full animate-fade-in">
                      <button 
                        onClick={() => setIsChatOpen(false)} 
                        className="absolute top-2 right-2 z-10 bg-[var(--bg-secondary)]/70 rounded-full p-1 text-[var(--text-muted)] hover:text-[var(--text-inverted)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        aria-label="Close Chat"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                      <CampaignChat
                        activeCharacter={activeCharacter}
                        history={history}
                        messages={messages}
                        publishMessage={publishMessage}
                        isConnected={isConnected}
                        connectedUsers={connectedUsers}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // --- CHAT CLOSED VIEW ---
                <div className="h-full animate-fade-in">
                  <div className="w-full max-w-5xl mx-auto h-full overflow-y-auto">
                    <CharacterSheet
                      character={activeCharacter}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onUpdate={updateCharacter}
                      history={history}
                      setHistory={setHistory}
                      onEditCrest={() => setCurrentView('CREST_CREATOR')}
                    />
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
            </>
          );
        }
        setCurrentView('DASHBOARD');
        return null;
      case 'DASHBOARD':
      default:
        return <CharacterDashboard 
          characters={characters}
          onSelectCharacter={handleSelectCharacter}
          onNewCharacter={handleNewCharacter}
          onExportCharacterSheet={handleExportCharacterSheet}
          onExportDataFile={handleExportDataFile}
          onHomebrew={() => setCurrentView('HOMEBREW')}
          onImportCharacter={handleImportCharacter}
        />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading your adventurers..." />
      </div>
    );
  }

  return (
    <div className="h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center relative">
       <SessionOverlay 
          isDM={false}
          currentUserId={activeCharacterId || 'unknown-player'}
          messages={messages}
          publishMessage={publishMessage}
          setTheme={setTheme} 
          currentTheme={theme} 
       />
       
       {/* Special Full Screen for Map */}
       {currentView === 'MAP' && (
           <div className="fixed inset-0 z-50">
               <PlayerCanvasView canvasState={canvasState} onClose={() => setCurrentView('SHEET')} />
           </div>
       )}

       <header className="w-full max-w-screen-2xl mb-4 flex-shrink-0 z-40 relative">
          <div className="flex justify-between items-center">
             {/* Left Side: Navigation & Status */}
             <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                {currentView !== 'DASHBOARD' ? (
                    <Button onClick={handleBack} variant="ghost" size="sm" className="flex items-center gap-2 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                        <span className="hidden sm:inline">{backButtonText()}</span>
                        <span className="sm:hidden">Back</span>
                    </Button>
                ) : <div className="w-1 h-1" /> }

                {/* Connection Status Indicator */}
                {activeCharacterId && (
                    <button 
                        onClick={() => setIsJoinModalOpen(true)}
                        className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-bold border transition-colors shrink-0 max-w-[140px] sm:max-w-none ${isConnected ? 'bg-green-900/50 border-green-500 text-green-300' : error ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                    >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isConnected ? 'bg-green-400 animate-pulse' : error ? 'bg-red-500' : 'bg-slate-400'}`} />
                        <span className="truncate">{connectionStatus}</span>
                    </button>
                )}
             </div>
             
             {/* Right Side Controls */}
             <div className="flex items-center gap-2">
                 
                 {/* Map Button (Only if canvas data exists and connected) */}
                 {isConnected && canvasState && activeCharacterId && (
                     <Button 
                        onClick={() => setCurrentView('MAP')} 
                        variant="ghost" 
                        size="sm" 
                        className={`!p-2 relative ${currentView === 'MAP' ? 'bg-[var(--accent-primary)] text-black' : 'text-[var(--text-secondary)]'}`}
                        title="Open Map"
                    >
                         <MapIcon className="h-5 w-5" />
                         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse border border-black"></span>
                     </Button>
                 )}

                 {/* Dice Roller Button */}
                 {activeCharacterId && (
                     <Button 
                         onClick={() => setIsDiceRollerOpen(true)} 
                         variant="ghost" 
                         size="sm" 
                         className="!p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)]"
                         aria-label="Dice Roller"
                         title="Roll Dice"
                     >
                         <D20Icon className="h-5 w-5" />
                     </Button>
                 )}

                 {/* Search accessible on mobile top bar */}
                <Button onClick={() => setSrdSearchOpen(true)} variant="ghost" size="sm" className="!p-2 text-[var(--text-secondary)]" aria-label="SRD Search">
                  <SearchIcon className="h-5 w-5" />
                </Button>

                {/* Desktop Toolbar */}
                <div className="hidden md:flex items-center gap-2 sm:gap-4">
                    <Button onClick={() => setCurrentView('HOMEBREW')} variant="ghost" size="sm" className="!p-2" aria-label="Homebrew Collection">
                        <HomebrewIcon className="h-5 w-5" />
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

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="sm" className="!p-2">
                        <MoreVerticalIcon className="h-5 w-5" />
                    </Button>
                </div>
             </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl p-4 flex flex-col gap-4 animate-fade-in md:hidden z-50">
                  <div className="flex flex-col gap-2">
                      <Button onClick={() => { setCurrentView('HOMEBREW'); setIsMobileMenuOpen(false); }} variant="ghost" className="justify-start gap-3">
                          <HomebrewIcon className="h-5 w-5" /> Homebrew Collection
                      </Button>
                  </div>
                  
                  <div className="border-t border-[var(--border-primary)] pt-4">
                      <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-2">Theme & Settings</p>
                      <ThemeSwitcher 
                          currentTheme={theme} 
                          onThemeChange={setTheme}
                          backgroundEffectsEnabled={backgroundEffectsEnabled}
                          onBackgroundEffectsChange={setBackgroundEffectsEnabled}
                      />
                  </div>

                  <div className="border-t border-[var(--border-primary)] pt-2">
                      <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
                          Log Out
                      </Button>
                  </div>
              </div>
          )}
        </header>

      <main className="w-full max-w-screen-2xl flex-grow min-h-0 z-10">
        {renderContent()}
      </main>
      <Footer className="max-w-screen-2xl mt-4" />
      
      {/* Dice Roller Modal */}
      {isDiceRollerOpen && activeCharacter && (
        <div className="fixed inset-0 backdrop-vignette flex items-center justify-center z-[80] animate-fade-in" onClick={() => setIsDiceRollerOpen(false)}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-medieval text-[var(--accent-primary)]">Dice Roller</h3>
                    <button onClick={() => setIsDiceRollerOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none">&times;</button>
                </div>
                <PlayerDiceRoller 
                    onRoll={handlePlayerRoll}
                    characterName={activeCharacter.name}
                />
            </div>
        </div>
      )}

      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${activeCharacter?.name || 'this character'} forever? This action cannot be undone.`}
        confirmText="Delete Forever"
      />
       <Dialog
        isOpen={isUpdateModalOpen}
        onClose={() => { setUpdateModalOpen(false); setCharacterToUpdate(null); }}
        onConfirm={confirmUpdate}
        title="Update Character?"
        description={`A character with the same ID already exists (${characterToUpdate?.name}). Would you like to overwrite it with the imported data?`}
        confirmText="Update"
        confirmVariant="default"
      />
      
      {/* Join Session Modal */}
      {isJoinModalOpen && (
          <div className="fixed inset-0 backdrop-vignette flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsJoinModalOpen(false)}>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 rounded-xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-medieval text-[var(--accent-primary)] mb-4">Campaign Connection</h3>
                  {dmId ? (
                      <div className="mb-4">
                          <p className="text-sm text-[var(--text-secondary)] mb-2">Currently linked to campaign:</p>
                          <div className="p-3 bg-[var(--bg-primary)] rounded border border-[var(--border-secondary)] text-center font-bold font-mono text-[var(--accent-secondary)]">
                              {dmId}
                          </div>
                          <div className="mt-4 flex flex-col gap-2">
                              <p className="text-xs text-[var(--text-muted)] text-center">Status: <span className={isConnected ? "text-green-400" : "text-amber-400"}>{connectionStatus}</span></p>
                              <Button onClick={handleLeaveSession} variant="destructive" className="w-full">Disconnect</Button>
                          </div>
                          <div className="mt-6 border-t border-[var(--border-primary)] pt-4">
                              <p className="text-sm text-[var(--text-secondary)] mb-2">Switch Campaign:</p>
                              <input 
                                type="text" 
                                value={targetDmId} 
                                onChange={e => setTargetDmId(e.target.value.toUpperCase())}
                                placeholder="New Room Code"
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] text-center font-bold tracking-widest text-lg focus:ring-2 focus:ring-[var(--accent-primary)] uppercase mb-2"
                              />
                              <Button onClick={handleJoinSession} disabled={!targetDmId} className="w-full">Switch</Button>
                          </div>
                      </div>
                  ) : (
                      <>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Enter the Room Code provided by your DM to join the session. This will be saved to your character.</p>
                        <input 
                            type="text" 
                            value={targetDmId} 
                            onChange={e => setTargetDmId(e.target.value.toUpperCase())}
                            placeholder="Room Code (e.g. CAMPAIGN-A1B2)"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] text-center font-bold tracking-widest text-lg focus:ring-2 focus:ring-[var(--accent-primary)] uppercase mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setIsJoinModalOpen(false)} variant="ghost">Cancel</Button>
                            <Button onClick={handleJoinSession} disabled={!targetDmId}>Connect</Button>
                        </div>
                      </>
                  )}
              </div>
          </div>
      )}

      <input type="file" ref={importFileInputRef} onChange={handleFileSelect} className="hidden" accept=".json" />
      {isExporting && (
         <div className="fixed inset-0 backdrop-vignette flex items-center justify-center z-50">
            <Loader message="Generating Character Sheet PNG..." />
         </div>
      )}
      {characterToExport && (
          <div ref={exportRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 }}>
              <CharacterSheetExporter character={characterToExport} />
          </div>
      )}
      <SRDSearch isOpen={isSrdSearchOpen} onClose={() => setSrdSearchOpen(false)} />
    </div>
  );
};


const App: React.FC = () => {
  const [userRole, setUserRole] = useState<'PLAYER' | 'DM' | null>(() => localStorage.getItem('dnd-user-role') as 'PLAYER' | 'DM' | null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('dnd-theme') as Theme) || 'slate');
  const [backgroundEffectsEnabled, setBackgroundEffectsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('dnd-bg-effects');
    // Default to false if not set (User requested default disabled)
    return saved === null ? false : saved === 'true';
  });

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('dnd-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    if (backgroundEffectsEnabled) {
      document.body.classList.remove('background-effects-disabled');
      localStorage.setItem('dnd-bg-effects', 'true');
    } else {
      document.body.classList.add('background-effects-disabled');
      localStorage.setItem('dnd-bg-effects', 'false');
    }
  }, [backgroundEffectsEnabled]);

  const handleLogin = (role: 'PLAYER' | 'DM') => {
    localStorage.setItem('dnd-user-role', role);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('dnd-user-role');
    setUserRole(null);
  };

  return (
    <ToastProvider>
      {!userRole ? (
        <LoginScreen onLogin={handleLogin} />
      ) : userRole === 'DM' ? (
        <DMView 
          onLogout={handleLogout} 
          theme={theme} 
          setTheme={setTheme} 
          backgroundEffectsEnabled={backgroundEffectsEnabled} 
          setBackgroundEffectsEnabled={setBackgroundEffectsEnabled} 
        />
      ) : (
        <PlayerView 
          onLogout={handleLogout} 
          theme={theme} 
          setTheme={setTheme} 
          backgroundEffectsEnabled={backgroundEffectsEnabled} 
          setBackgroundEffectsEnabled={setBackgroundEffectsEnabled} 
        />
      )}
    </ToastProvider>
  );
};

export default App;
