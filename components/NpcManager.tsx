
import React, { useState, useEffect } from 'react';
import { NPC, createEmptyNPC } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Loader from './ui/Loader';
import { DND_RACES_DATA } from '../data/racesData';
import { TrashIcon } from './icons/TrashIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import SmartText from './ui/SmartText';
import { useToast } from './ui/Toast';

// --- HELPER COMPONENTS ---

interface NpcManagerProps {
    npcs: NPC[];
    addNpc: (npc: NPC) => Promise<void>;
    updateNpc: (npc: NPC) => Promise<void>;
    deleteNpc: (id: string) => Promise<void>;
    isLoading: boolean;
    focusId?: string | null;
}

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good", 
  "Lawful Neutral", "True Neutral", "Chaotic Neutral", 
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

type NpcFormTab = 'identity' | 'stats' | 'details' | 'abilities';

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-slate-300 mb-1">{label}</label>
        <input {...props} className={`w-full bg-slate-800 border border-slate-600 rounded p-2 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500 transition-all ${props.className}`}/>
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string, children: React.ReactNode}> = ({label, children, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-slate-300 mb-1">{label}</label>
        <select {...props} className={`w-full bg-slate-800 border border-slate-600 rounded p-2 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500 transition-all ${props.className}`}>
            {children}
        </select>
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-slate-300 mb-1">{label}</label>
        <textarea {...props} className={`w-full bg-slate-800 border border-slate-600 rounded p-2 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500 transition-all ${props.className}`}/>
    </div>
);

// --- NEW NPC VIEW COMPONENT ---
const ViewSection: React.FC<{ title: string; children: React.ReactNode; className?: string; useSmartText?: boolean }> = ({ title, children, className, useSmartText }) => (
  <div className={className}>
    <h4 className="font-medieval text-xl text-amber-300 mb-2 border-b border-slate-600 pb-1">{title}</h4>
    {useSmartText && typeof children === 'string' ? (
        <SmartText text={children || "Not specified."} className="text-slate-300 text-sm" />
    ) : (
        <div className="text-slate-300 whitespace-pre-wrap text-sm">{children || <span className="text-slate-500 italic">Not specified.</span>}</div>
    )}
  </div>
);

const StatDisplay: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-slate-900/50 p-2 rounded text-center border border-slate-700">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-slate-400 uppercase">{label}</div>
    </div>
);

const AbilityScoreDisplay: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="text-center">
        <div className="font-bold text-sm text-slate-400">{label}</div>
        <div className="font-bold text-xl">{score}</div>
    </div>
);

const NpcView: React.FC<{ npc: NPC; onEdit: () => void; onBack: () => void; }> = ({ npc, onEdit, onBack }) => {
    return (
        <div className="animate-fade-in space-y-6">
            <header className="flex justify-between items-center">
                <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                    Back to All NPCs
                </Button>
                <Button onClick={onEdit}>Edit</Button>
            </header>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="aspect-square bg-slate-900/80 rounded-lg border-2 border-slate-600 flex items-center justify-center overflow-hidden">
                            {npc.image ? <img src={npc.image} alt={npc.name} className="w-full h-full object-cover" /> : <UserCircleIcon className="h-32 w-32 text-slate-600" />}
                        </div>
                        <h2 className="text-4xl font-medieval text-amber-300 text-center break-words">{npc.name}</h2>
                        <p className="text-center text-slate-400 text-lg">{npc.race} {npc.classRole}</p>
                        <p className="text-center text-slate-300 font-bold">{npc.alignment}</p>
                    </div>
                    {/* Right Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <StatDisplay label="HP" value={`${npc.hp} / ${npc.maxHp}`} />
                            <StatDisplay label="AC" value={npc.ac} />
                            <StatDisplay label="Speed" value={`${npc.speed}ft`} />
                            <StatDisplay label="MB" value={`${npc.mb} / ${npc.maxMb}`} />
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                            {(Object.keys(npc.abilityScores) as Array<keyof typeof npc.abilityScores>).map(key => (
                                <AbilityScoreDisplay key={key} label={key.toUpperCase()} score={npc.abilityScores[key]} />
                            ))}
                        </div>
                        <div className="space-y-4 pt-4">
                           <ViewSection title="Personality & Quirks">{npc.personalityQuirks}</ViewSection>
                           <ViewSection title="Motivations & Goals">{npc.motivationsGoals}</ViewSection>
                           <ViewSection title="Backstory">{npc.backstorySummary}</ViewSection>
                           <ViewSection title="Relationships">{npc.relationships}</ViewSection>
                           <ViewSection title="Special Abilities" useSmartText>{npc.specialAbilities}</ViewSection>
                           <ViewSection title="Loot & Inventory" useSmartText>{npc.inventory}</ViewSection>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- NPC FORM ---

const NpcForm: React.FC<{ npc: NPC; onSave: (npc: NPC) => void; onCancel: () => void }> = ({ npc, onSave, onCancel }) => {
    const [formData, setFormData] = useState<NPC>(npc);
    const [activeTab, setActiveTab] = useState<NpcFormTab>('identity');
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const isNumber = type === 'number';
      setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value, 10) || 0 : value }));
    };
  
    const handleAbilityScoreChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof NPC['abilityScores']) => {
      setFormData(prev => ({
          ...prev,
          abilityScores: { ...prev.abilityScores, [field]: parseInt(e.target.value, 10) || 0 }
      }));
    };
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => setFormData(prev => ({ ...prev, image: event.target?.result as string }));
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const TabButton: React.FC<{tabId: NpcFormTab, children: React.ReactNode}> = ({tabId, children}) => (
        <button type="button" onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-lg font-medieval rounded-t-lg transition-all ${activeTab === tabId ? 'bg-slate-800 border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-white'}`}>
            {children}
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <h2 className="text-4xl font-medieval text-amber-300">{npc.id ? `Edit ${npc.name || 'NPC'}` : 'Create New NPC'}</h2>
                <div className="flex gap-2">
                    <Button type="button" onClick={onCancel} variant="ghost">Cancel</Button>
                    <Button type="submit">Save NPC</Button>
                </div>
            </header>

            <div className="border-b border-slate-700">
                <div className="flex space-x-2">
                    <TabButton tabId="identity">Identity</TabButton>
                    <TabButton tabId="stats">Stats</TabButton>
                    <TabButton tabId="details">Details</TabButton>
                    <TabButton tabId="abilities">Abilities & Loot</TabButton>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-b-lg border border-slate-700 border-t-0">
                {activeTab === 'identity' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <div className="md:col-span-1 space-y-4">
                            <div className="aspect-square bg-slate-900/80 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden">
                                {formData.image ? <img src={formData.image} alt="NPC Portrait" className="w-full h-full object-cover" /> : <span className="text-slate-500 p-4 text-center">No image</span>}
                            </div>
                            <input id="npc-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                            <label htmlFor="npc-image-upload" className="cursor-pointer bg-cyan-800 hover:bg-cyan-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-colors w-full text-center block">Upload Portrait</label>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2"><FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required /></div>
                            <FormSelect label="Race" name="race" value={formData.race} onChange={handleChange}>
                                <option value="">Select Race</option>
                                {Object.keys(DND_RACES_DATA).sort().map(r => <option key={r} value={r}>{r}</option>)}
                            </FormSelect>
                            <FormInput label="Class / Role" name="classRole" value={formData.classRole} onChange={handleChange} placeholder="e.g. Guard Captain"/>
                            <div className="sm:col-span-2">
                                <FormSelect label="Alignment" name="alignment" value={formData.alignment} onChange={handleChange}>
                                    {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                </FormSelect>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Current HP" name="hp" type="number" value={formData.hp} onChange={handleChange} />
                                <FormInput label="Max HP" name="maxHp" type="number" value={formData.maxHp} onChange={handleChange} />
                                <FormInput label="Armor Class" name="ac" type="number" value={formData.ac} onChange={handleChange} />
                                <FormInput label="Speed (ft)" name="speed" type="number" value={formData.speed} onChange={handleChange} />
                                <FormInput label="Resource (MB)" name="mb" type="number" value={formData.mb} onChange={handleChange} />
                                <FormInput label="Max Resource" name="maxMb" type="number" value={formData.maxMb} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {(Object.keys(formData.abilityScores) as Array<keyof typeof formData.abilityScores>).map(key => (
                                <FormInput key={key} label={key.toUpperCase()} name={key} type="number" value={formData.abilityScores[key]} onChange={(e) => handleAbilityScoreChange(e, key)} />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'details' && (
                    <div className="space-y-4 animate-fade-in">
                        <FormTextarea label="Personality / Quirks" name="personalityQuirks" value={formData.personalityQuirks} onChange={handleChange} rows={4} />
                        <FormTextarea label="Motivations / Goals" name="motivationsGoals" value={formData.motivationsGoals} onChange={handleChange} rows={4} />
                        <FormTextarea label="Backstory Summary" name="backstorySummary" value={formData.backstorySummary} onChange={handleChange} rows={6} />
                        <FormTextarea label="Relationships" name="relationships" value={formData.relationships} onChange={handleChange} rows={4} placeholder="e.g. Allies, enemies, family..." />
                    </div>
                )}
                {activeTab === 'abilities' && (
                     <div className="space-y-4 animate-fade-in">
                        <FormTextarea label="Special Abilities & Actions" name="specialAbilities" value={formData.specialAbilities} onChange={handleChange} rows={10} placeholder="e.g. Multiattack. The NPC makes two melee attacks."/>
                        <FormTextarea label="Loot & Inventory" name="inventory" value={formData.inventory} onChange={handleChange} rows={6} placeholder="e.g. 25 gp, Potion of Healing, Shortsword"/>
                    </div>
                )}
            </div>
        </form>
    );
};

// --- NPC DASHBOARD & CARDS ---

const NpcCard: React.FC<{ npc: NPC; onSelect: () => void; onDelete: () => void }> = ({ npc, onSelect, onDelete }) => (
    <div className="group bg-[var(--bg-secondary)] rounded-lg overflow-hidden border-2 border-[var(--border-primary)] hover:border-[var(--border-accent-primary)] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_var(--glow-primary)] flex flex-col">
        <div onClick={onSelect} className="cursor-pointer flex-grow">
            <div className="h-40 bg-[var(--bg-primary)]/70 flex items-center justify-center overflow-hidden">
                {npc.image ? (
                    <img src={npc.image} alt={npc.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <UserCircleIcon className="h-24 w-24 text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" />
                )}
            </div>
            <div className="p-4">
                <h3 className="text-xl font-medieval text-[var(--text-primary)] truncate">{npc.name || 'Unnamed NPC'}</h3>
                <p className="text-sm text-[var(--text-muted)] truncate">{npc.race} {npc.classRole}</p>
            </div>
        </div>
        <div className="p-2 bg-[var(--bg-primary)] border-t border-[var(--border-primary)] flex gap-2">
            <Button onClick={onSelect} variant="ghost" size="sm" className="w-full">View</Button>
            <Button onClick={(e) => { e.stopPropagation(); onDelete(); }} variant="ghost" size="sm" className="!p-2 aspect-square text-slate-400 hover:text-red-500 hover:bg-red-900/30">
                <TrashIcon className="h-5 w-5" />
            </Button>
        </div>
    </div>
);

const NewNpcCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="group bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--border-accent-primary)] transition-all duration-300 flex items-center justify-center min-h-[288px] hover:shadow-[0_0_15px_var(--glow-primary)] hover:-translate-y-1">
        <div className="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="mt-4 text-xl font-medieval text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">Create New NPC</p>
        </div>
    </button>
);

// --- MAIN MANAGER COMPONENT ---

const NpcManager: React.FC<NpcManagerProps> = ({ npcs, addNpc, updateNpc, deleteNpc, isLoading, focusId }) => {
    const [viewMode, setViewMode] = useState<'DASHBOARD' | 'VIEW' | 'FORM'>('DASHBOARD');
    const [activeNpc, setActiveNpc] = useState<NPC | null>(null);
    const [npcToDelete, setNpcToDelete] = useState<NPC | null>(null);
    const { addToast } = useToast();
  
    useEffect(() => {
        if (focusId && npcs.length > 0 && !activeNpc) {
            const npc = npcs.find(n => n.id === focusId);
            if (npc) {
                setActiveNpc(npc);
                setViewMode('VIEW');
            }
        }
    }, [focusId, npcs, activeNpc]);

    const handleNewNpc = () => {
        setActiveNpc(createEmptyNPC(String(Date.now() + Math.random())));
        setViewMode('FORM');
    };
    
    const handleViewNpc = (npc: NPC) => {
        setActiveNpc(npc);
        setViewMode('VIEW');
    };

    const handleEditNpc = () => {
        if (activeNpc) {
            setViewMode('FORM');
        }
    };
  
    const handleSave = async (npcToSave: NPC) => {
        const isNew = !npcs.some(n => n.id === npcToSave.id);
        if (isNew) {
            await addNpc(npcToSave);
        } else {
            await updateNpc(npcToSave);
        }
        addToast(isNew ? 'NPC created successfully.' : 'NPC updated successfully.', 'success');
        setActiveNpc(npcToSave);
        setViewMode('VIEW');
    };

    const handleCancelForm = () => {
        if (activeNpc && npcs.some(n => n.id === activeNpc.id)) {
            setViewMode('VIEW');
        } else {
            setActiveNpc(null);
            setViewMode('DASHBOARD');
        }
    };

    const handleBackFromView = () => {
        setActiveNpc(null);
        setViewMode('DASHBOARD');
    };
  
    const handleDelete = (npc: NPC) => setNpcToDelete(npc);
    const confirmDelete = async () => {
        if (npcToDelete) {
            await deleteNpc(npcToDelete.id);
            addToast('NPC deleted.', 'info');
            setNpcToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading NPCs..." /></div>;
    }

    if (viewMode === 'FORM' && activeNpc) {
        return <NpcForm npc={activeNpc} onSave={handleSave} onCancel={handleCancelForm} />;
    }

    if (viewMode === 'VIEW' && activeNpc) {
        return <NpcView npc={activeNpc} onEdit={handleEditNpc} onBack={handleBackFromView} />;
    }

    return (
        <div className="animate-fade-in">
             <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">NPCs</h2>
                <div className="w-32 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
                <p className="text-[var(--text-muted)] mt-4 text-lg">Manage your cast of characters.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {npcs.map(npc => <NpcCard key={npc.id} npc={npc} onSelect={() => handleViewNpc(npc)} onDelete={() => handleDelete(npc)} />)}
                <NewNpcCard onClick={handleNewNpc} />
            </div>
            {npcs.length === 0 && (
                <div className="text-center mt-12 text-[var(--text-muted)]/70">
                    <p>No NPCs created yet.</p>
                    <p>Click the card above to create your first NPC!</p>
                </div>
            )}
             <Dialog
                isOpen={!!npcToDelete}
                onClose={() => setNpcToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to permanently delete ${npcToDelete?.name || 'this NPC'}?`}
                confirmText="Delete"
            />
        </div>
    );
};

export default NpcManager;
