import React from 'react';
import { useState } from 'react';
import { Monster, MonsterTrait, createEmptyMonster } from '../types';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Loader from './ui/Loader';
import { MonsterIcon } from './icons/MonsterIcon';
import { TrashIcon } from './icons/TrashIcon';

// --- CONSTANTS ---
const SIZES = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
const TYPES = ["Aberration", "Beast", "Celestial", "Construct", "Dragon", "Elemental", "Fey", "Fiend", "Giant", "Humanoid", "Monstrosity", "Ooze", "Plant", "Undead"];
const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good", 
  "Lawful Neutral", "True Neutral", "Chaotic Neutral", 
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
  "Unaligned"
];

// --- HELPER & REUSABLE FORM COMPONENTS ---

type TraitType = 'skills' | 'savingThrows' | 'specialAbilities' | 'attacks' | 'legendaryActions';

interface BestiaryManagerProps {
    monsters: Monster[];
    addMonster: (monster: Monster) => Promise<void>;
    updateMonster: (monster: Monster) => Promise<void>;
    deleteMonster: (id: string) => Promise<void>;
    isLoading: boolean;
}

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

const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`bg-slate-900/50 p-6 rounded-lg border border-slate-700 ${className}`}>
        <h3 className="text-xl font-medieval text-amber-300 mb-6 border-b border-slate-600 pb-2">
            {title}
        </h3>
        {children}
    </div>
);

const DynamicTraitList: React.FC<{
    title: string;
    traits: MonsterTrait[];
    traitType: TraitType;
    onAdd: () => void;
    onRemove: (id: string) => void;
    onChange: (index: number, field: keyof MonsterTrait, value: string) => void;
    namePlaceholder: string;
    descPlaceholder: string;
}> = ({ title, traits, onAdd, onRemove, onChange, namePlaceholder, descPlaceholder }) => (
    <div>
        <h4 className="font-bold text-slate-300 mb-2">{title}</h4>
        <div className="space-y-3">
            {traits.map((trait, index) => (
                <div key={trait.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start p-2 bg-slate-800/70 rounded-md border border-slate-700">
                    <div className="md:col-span-4">
                        <input value={trait.name} onChange={(e) => onChange(index, 'name', e.target.value)} placeholder={namePlaceholder} className="w-full bg-slate-900/80 p-2 rounded-md border border-slate-600"/>
                    </div>
                    <div className="md:col-span-7">
                        <textarea value={trait.description} onChange={(e) => onChange(index, 'description', e.target.value)} placeholder={descPlaceholder} rows={2} className="w-full bg-slate-900/80 p-2 rounded-md border border-slate-600 text-sm"/>
                    </div>
                    <div className="md:col-span-1 flex justify-end md:justify-center items-start pt-1">
                       <Button type="button" size="sm" onClick={() => onRemove(trait.id)} variant="ghost" className="!p-2 aspect-square text-slate-400 hover:text-red-500 hover:bg-red-900/30"><TrashIcon className="h-5 w-5"/></Button>
                    </div>
                </div>
            ))}
        </div>
        <Button type="button" onClick={onAdd} className="mt-4" size="sm">Add {title.slice(0, -1)}</Button>
    </div>
);


// --- NEW MONSTER VIEW COMPONENT ---
const StatBlockEntry: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  value ? <p><strong className="text-slate-200 font-bold">{label}</strong> {value}</p> : null
);

const TraitDisplay: React.FC<{ trait: MonsterTrait }> = ({ trait }) => (
    <p><strong className="text-amber-300 font-bold italic">{trait.name}.</strong> {trait.description}</p>
);

const StatBlockDivider = () => (
    <div className="border-b-2 border-red-500/50 my-3"></div>
);

const MonsterView: React.FC<{ monster: Monster; onEdit: () => void; onBack: () => void; }> = ({ monster, onEdit, onBack }) => {
    return (
        <div className="animate-fade-in space-y-6">
            <header className="flex justify-between items-center">
                <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                    Back to Bestiary
                </Button>
                <Button onClick={onEdit}>Edit</Button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="aspect-square bg-slate-900/80 rounded-lg border-2 border-slate-600 flex items-center justify-center overflow-hidden sticky top-24 shadow-lg">
                        {monster.image ? <img src={monster.image} alt={monster.name} className="w-full h-full object-cover" /> : <MonsterIcon className="h-32 w-32 text-slate-600" />}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-lg border border-slate-700 font-sans text-slate-300 shadow-xl">
                    <h2 className="text-4xl font-medieval text-red-500">{monster.name}</h2>
                    <p className="italic text-sm text-slate-400 mt-1">{monster.size} {monster.type}, {monster.alignment}</p>
                    
                    <StatBlockDivider />

                    <p><strong className="text-slate-200 font-bold">Armor Class</strong> {monster.ac}</p>
                    <p><strong className="text-slate-200 font-bold">Hit Points</strong> {monster.hp}</p>
                    <p><strong className="text-slate-200 font-bold">Speed</strong> {monster.speed}</p>

                    <StatBlockDivider />

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center my-3">
                        {(Object.keys(monster.abilityScores) as Array<keyof typeof monster.abilityScores>).map(key => (
                            <div key={key}>
                                <strong className="text-slate-200 font-bold">{key.toUpperCase()}</strong>
                                <p>{monster.abilityScores[key]} ({Math.floor((monster.abilityScores[key] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((monster.abilityScores[key] - 10) / 2)})</p>
                            </div>
                        ))}
                    </div>

                    <StatBlockDivider />
                    
                    <div className="space-y-1 text-sm">
                        <StatBlockEntry label="Saving Throws" value={monster.savingThrows.map(t => `${t.name} ${t.description}`).join(', ')} />
                        <StatBlockEntry label="Skills" value={monster.skills.map(t => `${t.name} ${t.description}`).join(', ')} />
                        <StatBlockEntry label="Damage Vulnerabilities" value={monster.damageVulnerabilities} />
                        <StatBlockEntry label="Damage Resistances" value={monster.damageResistances} />
                        <StatBlockEntry label="Damage Immunities" value={monster.damageImmunities} />
                        <StatBlockEntry label="Condition Immunities" value={monster.conditionImmunities} />
                        <StatBlockEntry label="Senses" value={monster.senses} />
                        <StatBlockEntry label="Languages" value={monster.languages} />
                        <StatBlockEntry label="Challenge" value={`${monster.cr} (${monster.xp} XP)`} />
                    </div>

                    {monster.specialAbilities.length > 0 && <StatBlockDivider />}
                    <div className="space-y-2 text-sm">
                        {monster.specialAbilities.map(trait => <TraitDisplay key={trait.id} trait={trait} />)}
                    </div>

                    {monster.attacks.length > 0 && <h3 className="text-2xl font-medieval text-red-500 mt-4">Actions</h3>}
                    <div className="border-b border-red-500/50 my-2"></div>
                    <div className="space-y-2 text-sm">
                        {monster.attacks.map(trait => <TraitDisplay key={trait.id} trait={trait} />)}
                    </div>

                    {monster.legendaryActions.length > 0 && <h3 className="text-2xl font-medieval text-red-500 mt-4">Legendary Actions</h3>}
                    {monster.legendaryActions.length > 0 && <div className="border-b border-red-500/50 my-2"></div>}
                    <div className="space-y-2 text-sm">
                        {monster.legendaryActionsDescription && <p className="italic">{monster.legendaryActionsDescription}</p>}
                        {monster.legendaryActions.map(trait => <TraitDisplay key={trait.id} trait={trait} />)}
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- MONSTER FORM ---

const MonsterForm: React.FC<{ monster: Monster; onSave: (monster: Monster) => void; onCancel: () => void }> = ({ monster, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Monster>(monster);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const isNumber = type === 'number';
      setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value, 10) || 0 : value }));
    };
  
    const handleAbilityScoreChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Monster['abilityScores']) => {
        setFormData(prev => ({ ...prev, abilityScores: { ...prev.abilityScores, [field]: parseInt(e.target.value, 10) || 10 } }));
    };

    const handleTraitChange = (index: number, field: keyof MonsterTrait, value: string, type: TraitType) => {
        const newTraits = [...formData[type]];
        newTraits[index] = { ...newTraits[index], [field]: value };
        setFormData(prev => ({ ...prev, [type]: newTraits }));
    };
    
    const addTrait = (type: TraitType) => {
        const newTrait: MonsterTrait = { id: String(Date.now() + Math.random()), name: '', description: '' };
        setFormData(prev => ({ ...prev, [type]: [...prev[type], newTrait] }));
    };
    
    const removeTrait = (id: string, type: TraitType) => {
        setFormData(prev => ({ ...prev, [type]: prev[type].filter(t => t.id !== id) }));
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <h2 className="text-4xl font-medieval text-amber-300">{monster.id ? `Edit ${monster.name || 'Monster'}` : 'Create New Monster'}</h2>
                <div className="flex gap-2">
                    <Button type="button" onClick={onCancel} variant="ghost">Cancel</Button>
                    <Button type="submit">Save Monster</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Section title="Identity">
                        <div className="space-y-4">
                            <div className="aspect-square bg-slate-900/80 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden">
                                {formData.image ? <img src={formData.image} alt="Monster Portrait" className="w-full h-full object-cover" /> : <span className="text-slate-500 p-4 text-center">No image</span>}
                            </div>
                            <input id="monster-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                            <label htmlFor="monster-image-upload" className="cursor-pointer bg-cyan-800 hover:bg-cyan-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-colors w-full text-center block">Upload Image</label>
                            <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
                            <FormSelect label="Size" name="size" value={formData.size} onChange={handleChange}>{SIZES.map(s => <option key={s} value={s}>{s}</option>)}</FormSelect>
                            <FormSelect label="Type" name="type" value={formData.type} onChange={handleChange}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</FormSelect>
                            <FormSelect label="Alignment" name="alignment" value={formData.alignment} onChange={handleChange}>{ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}</FormSelect>
                        </div>
                    </Section>
                    <Section title="Core Stats">
                        <div className="space-y-4">
                            <FormInput label="Armor Class" name="ac" type="number" value={formData.ac} onChange={handleChange} />
                            <FormInput label="Hit Points" name="hp" value={formData.hp} onChange={handleChange} placeholder="e.g. 136 (16d10 + 48)" />
                            <FormInput label="Speed" name="speed" value={formData.speed} onChange={handleChange} placeholder="e.g. 30 ft., fly 60 ft." />
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {(Object.keys(formData.abilityScores) as Array<keyof typeof formData.abilityScores>).map(key => (
                                    <FormInput key={key} label={key.toUpperCase()} name={key} type="number" value={formData.abilityScores[key]} onChange={(e) => handleAbilityScoreChange(e, key)} />
                                ))}
                            </div>
                        </div>
                    </Section>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Section title="Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DynamicTraitList title="Skills" traits={formData.skills} traitType="skills" onAdd={() => addTrait('skills')} onRemove={(id) => removeTrait(id, 'skills')} onChange={(i, f, v) => handleTraitChange(i, f, v, 'skills')} namePlaceholder="e.g. Perception" descPlaceholder="+5" />
                            <DynamicTraitList title="Saving Throws" traits={formData.savingThrows} traitType="savingThrows" onAdd={() => addTrait('savingThrows')} onRemove={(id) => removeTrait(id, 'savingThrows')} onChange={(i, f, v) => handleTraitChange(i, f, v, 'savingThrows')} namePlaceholder="e.g. Dexterity" descPlaceholder="+9" />
                            <FormInput label="Damage Vulnerabilities" name="damageVulnerabilities" value={formData.damageVulnerabilities} onChange={handleChange} />
                            <FormInput label="Damage Resistances" name="damageResistances" value={formData.damageResistances} onChange={handleChange} />
                            <FormInput label="Damage Immunities" name="damageImmunities" value={formData.damageImmunities} onChange={handleChange} />
                            <FormInput label="Condition Immunities" name="conditionImmunities" value={formData.conditionImmunities} onChange={handleChange} />
                            <FormInput label="Senses" name="senses" value={formData.senses} onChange={handleChange} placeholder="e.g. darkvision 120 ft., passive Perception 17" />
                            <FormInput label="Languages" name="languages" value={formData.languages} onChange={handleChange} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Challenge (CR)" name="cr" value={formData.cr} onChange={handleChange} />
                                <FormInput label="XP" name="xp" type="number" value={formData.xp} onChange={handleChange} />
                            </div>
                        </div>
                    </Section>
                    <Section title="Abilities & Actions">
                         <div className="space-y-6">
                            <DynamicTraitList title="Special Abilities" traits={formData.specialAbilities} traitType="specialAbilities" onAdd={() => addTrait('specialAbilities')} onRemove={(id) => removeTrait(id, 'specialAbilities')} onChange={(i, f, v) => handleTraitChange(i, f, v, 'specialAbilities')} namePlaceholder="Ability Name" descPlaceholder="Ability description." />
                            <DynamicTraitList title="Attacks" traits={formData.attacks} traitType="attacks" onAdd={() => addTrait('attacks')} onRemove={(id) => removeTrait(id, 'attacks')} onChange={(i, f, v) => handleTraitChange(i, f, v, 'attacks')} namePlaceholder="Attack Name" descPlaceholder="Attack description, to hit, damage, etc." />
                            <div>
                                <h4 className="font-bold text-slate-300 mb-2">Legendary Actions</h4>
                                <FormTextarea label="Legendary Action Intro" name="legendaryActionsDescription" value={formData.legendaryActionsDescription} onChange={handleChange} rows={2} placeholder="e.g., The dragon can take 3 legendary actions..."/>
                                <div className="mt-4">
                                    <DynamicTraitList title="Actions" traits={formData.legendaryActions} traitType="legendaryActions" onAdd={() => addTrait('legendaryActions')} onRemove={(id) => removeTrait(id, 'legendaryActions')} onChange={(i, f, v) => handleTraitChange(i, f, v, 'legendaryActions')} namePlaceholder="Action Name" descPlaceholder="Action description."/>
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </form>
    );
};

// --- MONSTER DASHBOARD & CARDS ---

const MonsterCard: React.FC<{ monster: Monster; onSelect: () => void; onDelete: () => void }> = ({ monster, onSelect, onDelete }) => (
    <div className="group bg-[var(--bg-secondary)] rounded-lg overflow-hidden border-2 border-[var(--border-primary)] hover:border-[var(--border-accent-primary)] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_var(--glow-primary)] flex flex-col">
        <div onClick={onSelect} className="cursor-pointer flex-grow">
            <div className="h-40 bg-[var(--bg-primary)]/70 flex items-center justify-center overflow-hidden">
                {monster.image ? (
                    <img src={monster.image} alt={monster.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <MonsterIcon className="h-24 w-24 text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" />
                )}
            </div>
            <div className="p-4">
                <h3 className="text-xl font-medieval text-[var(--text-primary)] truncate">{monster.name || 'Unnamed Monster'}</h3>
                <p className="text-sm text-[var(--text-muted)] truncate">{monster.type} (CR {monster.cr})</p>
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

const NewMonsterCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="group bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--border-accent-primary)] transition-all duration-300 flex items-center justify-center min-h-[304px] hover:shadow-[0_0_15px_var(--glow-primary)] hover:-translate-y-1">
        <div className="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="mt-4 text-xl font-medieval text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">Create New Monster</p>
        </div>
    </button>
);

// --- MAIN MANAGER COMPONENT ---

const BestiaryManager: React.FC<BestiaryManagerProps> = ({ monsters, addMonster, updateMonster, deleteMonster, isLoading }) => {
    const [viewMode, setViewMode] = useState<'DASHBOARD' | 'VIEW' | 'FORM'>('DASHBOARD');
    const [activeMonster, setActiveMonster] = useState<Monster | null>(null);
    const [monsterToDelete, setMonsterToDelete] = useState<Monster | null>(null);
  
    const handleNewMonster = () => {
        setActiveMonster(createEmptyMonster(String(Date.now() + Math.random())));
        setViewMode('FORM');
    };
    
    const handleViewMonster = (monster: Monster) => {
        setActiveMonster(monster);
        setViewMode('VIEW');
    };
    
    const handleEditMonster = () => {
        if (activeMonster) {
            setViewMode('FORM');
        }
    };
  
    const handleSave = async (monsterToSave: Monster) => {
      const isNew = !monsters.some(m => m.id === monsterToSave.id);
      if (isNew) {
        await addMonster(monsterToSave);
      } else {
        await updateMonster(monsterToSave);
      }
      setActiveMonster(monsterToSave);
      setViewMode('VIEW');
    };
    
    const handleCancelForm = () => {
        if (activeMonster && monsters.some(m => m.id === activeMonster.id)) {
            setViewMode('VIEW');
        } else {
            setActiveMonster(null);
            setViewMode('DASHBOARD');
        }
    };
    
    const handleBackFromView = () => {
        setActiveMonster(null);
        setViewMode('DASHBOARD');
    };
  
    const handleDelete = (monster: Monster) => setMonsterToDelete(monster);
    const confirmDelete = async () => {
        if (monsterToDelete) {
            await deleteMonster(monsterToDelete.id);
            setMonsterToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader message="Loading Bestiary..." /></div>;
    }

    if (viewMode === 'FORM' && activeMonster) {
        return <MonsterForm monster={activeMonster} onSave={handleSave} onCancel={handleCancelForm} />;
    }

    if (viewMode === 'VIEW' && activeMonster) {
        return <MonsterView monster={activeMonster} onEdit={handleEditMonster} onBack={handleBackFromView} />;
    }

    return (
        <div className="animate-fade-in">
             <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Bestiary</h2>
                <div className="w-32 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
                <p className="text-[var(--text-muted)] mt-4 text-lg">Your personal collection of monsters.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {monsters.map(monster => <MonsterCard key={monster.id} monster={monster} onSelect={() => handleViewMonster(monster)} onDelete={() => handleDelete(monster)} />)}
                <NewMonsterCard onClick={handleNewMonster} />
            </div>
            {monsters.length === 0 && (
                <div className="text-center mt-12 text-[var(--text-muted)]/70">
                    <p>Your bestiary is empty.</p>
                    <p>Click the card above to create your first monster!</p>
                </div>
            )}
             <Dialog
                isOpen={!!monsterToDelete}
                onClose={() => setMonsterToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to permanently delete ${monsterToDelete?.name || 'this monster'}?`}
                confirmText="Delete"
            />
        </div>
    );
};

export default BestiaryManager;