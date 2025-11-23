
import React, { useState, useRef, useEffect } from 'react';
import { Character, CrestData, createEmptyCharacter } from './types';
import { useCharacters } from './hooks/useCharacters';
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
import { ToastProvider, useToast } from './components/ui/Toast';
import Footer from './components/Footer';

// Declare the html-to-image library for TypeScript
declare const htmlToImage: {
  toPng: (node: HTMLElement, options?: any) => Promise<string>;
};

type View = 'DASHBOARD' | 'SHEET' | 'FORM' | 'CREST_CREATOR' | 'HOMEBREW';

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
  
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const [characterToUpdate, setCharacterToUpdate] = useState<Character | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const { addToast } = useToast();


  const activeCharacter = characters.find(c => c.id === activeCharacterId);

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
    } else if (currentView === 'SHEET' || currentView === 'HOMEBREW') {
        setCurrentView('DASHBOARD');
    }
  };

  const backButtonText = () => {
    if (currentView === 'FORM' || currentView === 'CREST_CREATOR') {
        return activeCharacterId ? 'Back to Sheet' : 'Back to Dashboard';
    }
    if (currentView === 'SHEET' || currentView === 'HOMEBREW') {
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

      // Dynamically get the theme's primary background color for the export
      const primaryBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();

      const dataUrl = await htmlToImage.toPng(node, {
        quality: 0.98,
        backgroundColor: primaryBg || '#0f172a', // Fallback to default slate
        pixelRatio: 2, // Higher resolution for crisp text
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

        // Delay to allow images and styles to fully render
        const timer = setTimeout(() => {
            generateImage(node, characterToExport.name);
        }, 500);

        return () => clearTimeout(timer);
    }
  }, [characterToExport]);
  
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
    <div className="h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center">
       <header className="w-full max-w-screen-2xl mb-4 flex justify-between items-center flex-shrink-0">
         {currentView !== 'DASHBOARD' ? (
            <Button onClick={handleBack} variant="ghost" size="sm" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                {backButtonText()}
            </Button>
         ) : <div /> }
         
         <div className="flex items-center gap-2 sm:gap-4">
            <Button onClick={() => setCurrentView('HOMEBREW')} variant="ghost" size="sm" className="!p-2" aria-label="Homebrew Collection">
              <HomebrewIcon className="h-5 w-5" />
            </Button>
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
      <main className="w-full max-w-screen-2xl flex-grow min-h-0">
        {renderContent()}
      </main>
      <Footer className="max-w-screen-2xl mt-4" />
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
    // Default to true if not set
    return saved === null ? true : saved === 'true';
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
