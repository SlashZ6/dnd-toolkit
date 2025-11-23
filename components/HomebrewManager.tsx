
import React, { useState } from 'react';
import { HomebrewRace, createEmptyHomebrewRace, HomebrewSpell, createEmptyHomebrewSpell, HomebrewClass, createEmptyHomebrewClass, HomebrewRule, createEmptyHomebrewRule, HomebrewOfficialSubclass, createEmptyHomebrewOfficialSubclass } from '../types';
import { useHomebrewRaces } from '../hooks/useHomebrewRaces';
import { useHomebrewSpells } from '../hooks/useHomebrewSpells';
import { useHomebrewClasses } from '../hooks/useHomebrewClasses';
import { useHomebrewRules } from '../hooks/useHomebrewRules';
import Button from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import Loader from './ui/Loader';
import Dialog from './ui/Dialog';
import HomebrewClassForm from './HomebrewClassForm';
import { DND_CLASSES } from '../constants';
import { RaceIcon } from './icons/RaceIcon';
import { SpellIcon } from './icons/SpellIcon';
import { ClassIcon } from './icons/ClassIcon';
import { RuleIcon } from './icons/RuleIcon';
import HomebrewOfficialSubclassForm from './HomebrewOfficialSubclassForm';
import { useHomebrewOfficialSubclasses } from '../hooks/useHomebrewOfficialSubclasses';
import { SubclassIcon } from './icons/SubclassIcon';
import { useToast } from './ui/Toast';


type View = 'LIST' | 'RACE_FORM' | 'SPELL_FORM' | 'CLASS_FORM' | 'SUBCLASS_FORM' | 'RULE_FORM';
type Tab = 'RACES' | 'SPELLS' | 'CLASSES' | 'SUBCLASSES' | 'RULES';

const SPELL_SCHOOLS = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];

// Shared UI Components
const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-[var(--bg-primary)]/50 p-6 rounded-lg border border-[var(--border-primary)] ${className}`}>
        <h3 className="text-xl font-medieval text-[var(--accent-primary)] mb-6 border-b border-[var(--border-secondary)] pb-2">{title}</h3>
        {children}
    </div>
);
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <input {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none focus:border-[var(--accent-primary-hover)] transition-all ${props.className}`}/>
    </div>
);
const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string, children: React.ReactNode}> = ({label, children, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <select {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none focus:border-[var(--accent-primary-hover)] transition-all ${props.className}`}>
            {children}
        </select>
    </div>
);
const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">{label}</label>
        <textarea {...props} className={`w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none focus:border-[var(--accent-primary-hover)] transition-all ${props.className}`}/>
    </div>
);


// --- Homebrew Rule Form (Simple, so it lives here) ---
const HomebrewRuleForm: React.FC<{
    rule: HomebrewRule,
    onSave: (rule: HomebrewRule) => void,
    onCancel: () => void
}> = ({ rule, onSave, onCancel }) => {
    const [formData, setFormData] = useState(rule);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <Section title={rule.title ? `Edit ${rule.title}` : 'Create New Rule'}>
                <div className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Rule Title" required className="w-full bg-transparent border-b-2 border-[var(--border-secondary)] focus:border-[var(--accent-primary)] p-2 text-2xl font-medieval text-[var(--accent-primary)] focus:outline-none"/>
                    <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Rule description. You can use markdown for basic formatting." rows={15} required className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded p-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary-hover)] focus:outline-none"/>
                </div>
            </Section>
            <div className="flex justify-end gap-4"><Button type="button" onClick={onCancel} variant="ghost">Cancel</Button><Button type="submit">Save Rule</Button></div>
        </form>
    )
}


// --- Homebrew Race Components ---
const HomebrewRaceForm: React.FC<{
    race: HomebrewRace,
    onSave: (race: HomebrewRace) => void,
    onCancel: () => void
}> = ({ race, onSave, onCancel }) => {
    const [formData, setFormData] = useState(race);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'speed' ? parseInt(value) || 0 : value }));
    };

    const handleTraitChange = (index: number, field: 'name' | 'description', value: string) => {
        const newTraits = [...formData.traits];
        newTraits[index] = { ...newTraits[index], [field]: value };
        setFormData(prev => ({ ...prev, traits: newTraits }));
    };

    const addTrait = () => {
        setFormData(prev => ({ ...prev, traits: [...prev.traits, { id: String(Date.now() + Math.random()), name: '', description: '' }] }));
    };

    const removeTrait = (id: string) => {
        setFormData(prev => ({ ...prev, traits: prev.traits.filter(t => t.id !== id) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <Section title={race.name ? `Edit ${race.name}` : 'Create New Race'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Race Name" name="name" value={formData.name} onChange={handleChange} required />
                    <FormInput label="Ability Score Info" name="asi_desc" value={formData.asi_desc} onChange={handleChange} placeholder="e.g., +2 Dexterity, +1 Charisma" />
                    <FormSelect label="Size" name="size" value={formData.size} onChange={handleChange}>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                    </FormSelect>
                    <FormInput label="Speed" name="speed" type="number" value={formData.speed} onChange={handleChange} />
                    <div className="md:col-span-2"><FormInput label="Languages" name="languages" value={formData.languages} onChange={handleChange} placeholder="e.g., Common, Elvish" /></div>
                </div>
            </Section>
            <Section title="Racial Traits">
                <div className="space-y-4">
                    {formData.traits.map((trait, index) => (
                        <div key={trait.id} className="flex gap-2 items-start p-2 bg-[var(--bg-secondary)]/50 rounded">
                            <div className="flex-grow space-y-2">
                                <FormInput label={`Trait ${index + 1} Name`} value={trait.name} onChange={(e) => handleTraitChange(index, 'name', e.target.value)} placeholder="Trait Name" />
                                <FormTextarea label="Description" value={trait.description} onChange={(e) => handleTraitChange(index, 'description', e.target.value)} rows={2} />
                            </div>
                            <Button type="button" onClick={() => removeTrait(trait.id)} variant="ghost" className="!p-2 mt-7 text-[var(--text-muted)] hover:text-red-500"><TrashIcon className="h-5 w-5"/></Button>
                        </div>
                    ))}
                </div>
                <Button type="button" onClick={addTrait} className="mt-4">Add Trait</Button>
            </Section>
            <div className="flex justify-end gap-4"><Button type="button" onClick={onCancel} variant="ghost">Cancel</Button><Button type="submit">Save Race</Button></div>
        </form>
    );
};

// --- Homebrew Spell Components ---
const HomebrewSpellForm: React.FC<{
    spell: HomebrewSpell,
    onSave: (spell: HomebrewSpell) => void,
    onCancel: () => void
}> = ({ spell, onSave, onCancel }) => {
    const [formData, setFormData] = useState(spell);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'level' ? parseInt(value) : value }));
    };

    const handleClassChange = (className: string) => {
        const newClasses = formData.class.includes(className)
            ? formData.class.filter(c => c !== className)
            : [...formData.class, className];
        setFormData(prev => ({...prev, class: newClasses}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <Section title={spell.name ? `Edit ${spell.name}` : 'Create New Spell'}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-3"><FormInput label="Spell Name" name="name" value={formData.name} onChange={handleChange} required /></div>
                    <FormSelect label="Level" name="level" value={formData.level} onChange={handleChange}>
                        {[...Array(10).keys()].map(i => <option key={i} value={i}>{i === 0 ? 'Cantrip' : `Level ${i}`}</option>)}
                    </FormSelect>
                     <FormSelect label="School" name="school" value={formData.school} onChange={handleChange}>
                        {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </FormSelect>
                    <FormInput label="Casting Time" name="castingTime" value={formData.castingTime} onChange={handleChange} />
                    <FormInput label="Range" name="range" value={formData.range} onChange={handleChange} />
                    <FormInput label="Components" name="components" value={formData.components} onChange={handleChange} placeholder="V, S, M (a feather)"/>
                    <FormInput label="Duration" name="duration" value={formData.duration} onChange={handleChange} />
                    <div className="lg:col-span-3"><FormTextarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={6} required /></div>
                </div>
            </Section>
            <Section title="Available to Classes">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {DND_CLASSES.map(c => (
                        <label key={c} className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded-md cursor-pointer hover:bg-[var(--bg-tertiary)]">
                            <input type="checkbox" checked={formData.class.includes(c)} onChange={() => handleClassChange(c)} className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]" />
                            <span className="text-[var(--text-secondary)]">{c}</span>
                        </label>
                    ))}
                </div>
            </Section>
             <div className="flex justify-end gap-4"><Button type="button" onClick={onCancel} variant="ghost">Cancel</Button><Button type="submit">Save Spell</Button></div>
        </form>
    );
};

// --- List Card Components ---
const HomebrewRaceCard: React.FC<{ race: HomebrewRace; onEdit: () => void; onDelete: () => void; }> = ({ race, onEdit, onDelete }) => (
    <div className="group bg-[var(--bg-secondary)] rounded-lg p-4 border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between min-h-[160px] shadow-lg hover:shadow-[0_0_10px_var(--glow-primary)]">
        <div>
            <h4 className="font-medieval text-lg text-[var(--text-primary)]">{race.name}</h4>
            <p className="text-sm text-[var(--text-muted)]">Size: {race.size}, Speed: {race.speed}ft</p>
            <p className="text-sm text-[var(--text-muted)]">{race.traits.length} racial trait(s)</p>
        </div>
        <div className="flex gap-2 mt-4">
            <Button onClick={onEdit} size="sm" className="w-full">Edit</Button>
            <Button onClick={onDelete} variant="destructive" size="sm" className="!p-2"><TrashIcon className="h-5 w-5"/></Button>
        </div>
    </div>
);

const HomebrewSpellCard: React.FC<{ spell: HomebrewSpell; onEdit: () => void; onDelete: () => void; }> = ({ spell, onEdit, onDelete }) => (
     <div className="group bg-[var(--bg-secondary)] rounded-lg p-4 border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between min-h-[160px] shadow-lg hover:shadow-[0_0_10px_var(--glow-primary)]">
        <div>
            <h4 className="font-medieval text-lg text-[var(--text-primary)]">{spell.name}</h4>
            <p className="text-sm text-[var(--text-muted)]">
                {spell.level === 0 ? `${spell.school} Cantrip` : `Level ${spell.level} ${spell.school}`}
            </p>
            <p className="text-sm text-[var(--text-muted)] line-clamp-2">{spell.description}</p>
        </div>
        <div className="flex gap-2 mt-4">
            <Button onClick={onEdit} size="sm" className="w-full">Edit</Button>
            <Button onClick={onDelete} variant="destructive" size="sm" className="!p-2"><TrashIcon className="h-5 w-5"/></Button>
        </div>
    </div>
);

const HomebrewClassCard: React.FC<{ classDef: HomebrewClass; onEdit: () => void; onDelete: () => void; }> = ({ classDef, onEdit, onDelete }) => (
     <div className="group bg-[var(--bg-secondary)] rounded-lg p-4 border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between min-h-[160px] shadow-lg hover:shadow-[0_0_10px_var(--glow-primary)]">
        <div>
            <h4 className="font-medieval text-lg text-[var(--text-primary)]">{classDef.name}</h4>
            <p className="text-sm text-[var(--text-muted)]">Hit Die: d{classDef.hitDie}</p>
            <p className="text-sm text-[var(--text-muted)]">{classDef.subclasses.length} subclass(es)</p>
        </div>
        <div className="flex gap-2 mt-4">
            <Button onClick={onEdit} size="sm" className="w-full">Edit</Button>
            <Button onClick={onDelete} variant="destructive" size="sm" className="!p-2"><TrashIcon className="h-5 w-5"/></Button>
        </div>
    </div>
);

const HomebrewSubclassCard: React.FC<{ subclass: HomebrewOfficialSubclass; onEdit: () => void; onDelete: () => void; }> = ({ subclass, onEdit, onDelete }) => (
    <div className="group bg-[var(--bg-secondary)] rounded-lg p-4 border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between min-h-[160px] shadow-lg hover:shadow-[0_0_10px_var(--glow-primary)]">
        <div>
            <h4 className="font-medieval text-lg text-[var(--text-primary)]">{subclass.name}</h4>
            <p className="text-sm text-[var(--text-muted)]">Subclass for {subclass.baseClassName}</p>
            <p className="text-sm text-[var(--text-muted)]">{subclass.features.length} feature(s)</p>
        </div>
        <div className="flex gap-2 mt-4">
            <Button onClick={onEdit} size="sm" className="w-full">Edit</Button>
            <Button onClick={onDelete} variant="destructive" size="sm" className="!p-2"><TrashIcon className="h-5 w-5"/></Button>
        </div>
    </div>
);


const HomebrewRuleCard: React.FC<{ rule: HomebrewRule; onEdit: () => void; onDelete: () => void; }> = ({ rule, onEdit, onDelete }) => (
     <div className="group bg-[var(--bg-secondary)] rounded-lg p-4 border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between min-h-[160px] shadow-lg hover:shadow-[0_0_10px_var(--glow-primary)]">
        <div>
            <h4 className="font-medieval text-lg text-[var(--text-primary)]">{rule.title}</h4>
            <p className="text-sm text-[var(--text-muted)] line-clamp-3">{rule.content}</p>
        </div>
        <div className="flex gap-2 mt-4">
            <Button onClick={onEdit} size="sm" className="w-full">View/Edit</Button>
            <Button onClick={onDelete} variant="destructive" size="sm" className="!p-2"><TrashIcon className="h-5 w-5"/></Button>
        </div>
    </div>
);


const NewHomebrewCard: React.FC<{ type: string, icon: React.ReactNode, onClick: () => void }> = ({ type, icon, onClick }) => (
    <button onClick={onClick} className="group bg-transparent rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all flex items-center justify-center min-h-[160px] hover:shadow-[0_0_15px_var(--glow-primary)]">
        <div className="text-center p-4">
            <div className="h-12 w-12 mx-auto text-[var(--bg-quaternary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                {icon}
            </div>
            <p className="mt-2 text-lg font-medieval text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">Create New {type}</p>
        </div>
    </button>
);

// --- Main Manager ---
const HomebrewManager: React.FC = () => {
    const [view, setView] = useState<View>('LIST');
    const [activeTab, setActiveTab] = useState<Tab>('RACES');
    const [editingItem, setEditingItem] = useState<HomebrewRace | HomebrewSpell | HomebrewClass | HomebrewOfficialSubclass | HomebrewRule | null>(null);
    const [itemToDelete, setItemToDelete] = useState<HomebrewRace | HomebrewSpell | HomebrewClass | HomebrewOfficialSubclass | HomebrewRule | null>(null);

    const { races, addRace, updateRace, deleteRace, isLoading: racesLoading } = useHomebrewRaces();
    const { spells, addSpell, updateSpell, deleteSpell, isLoading: spellsLoading } = useHomebrewSpells();
    const { classes, addClass, updateClass, deleteClass, isLoading: classesLoading } = useHomebrewClasses();
    const { subclasses, addSubclass, updateSubclass, deleteSubclass, isLoading: subclassesLoading } = useHomebrewOfficialSubclasses();
    const { rules, addRule, updateRule, deleteRule, isLoading: rulesLoading } = useHomebrewRules();
    const { addToast } = useToast();

    const handleCreate = () => {
        if (activeTab === 'RACES') {
            setEditingItem(createEmptyHomebrewRace());
            setView('RACE_FORM');
        } else if (activeTab === 'SPELLS') {
            setEditingItem(createEmptyHomebrewSpell());
            setView('SPELL_FORM');
        } else if (activeTab === 'CLASSES') {
            setEditingItem(createEmptyHomebrewClass());
            setView('CLASS_FORM');
        } else if (activeTab === 'SUBCLASSES') {
            setEditingItem(createEmptyHomebrewOfficialSubclass());
            setView('SUBCLASS_FORM');
        } else {
            setEditingItem(createEmptyHomebrewRule());
            setView('RULE_FORM');
        }
    };

    const handleEdit = (item: HomebrewRace | HomebrewSpell | HomebrewClass | HomebrewOfficialSubclass | HomebrewRule) => {
        setEditingItem(item);
        if (activeTab === 'RACES') setView('RACE_FORM');
        else if (activeTab === 'SPELLS') setView('SPELL_FORM');
        else if (activeTab === 'CLASSES') setView('CLASS_FORM');
        else if (activeTab === 'SUBCLASSES') setView('SUBCLASS_FORM');
        else setView('RULE_FORM');
    };

    const handleSave = (item: HomebrewRace | HomebrewSpell | HomebrewClass | HomebrewOfficialSubclass | HomebrewRule) => {
        let typeLabel = 'Item';
        if (activeTab === 'RACES') {
            const isNew = !races.some(r => r.id === item.id);
            isNew ? addRace(item as HomebrewRace) : updateRace(item as HomebrewRace);
            typeLabel = 'Race';
        } else if (activeTab === 'SPELLS') {
            const isNew = !spells.some(s => s.id === item.id);
            isNew ? addSpell(item as HomebrewSpell) : updateSpell(item as HomebrewSpell);
            typeLabel = 'Spell';
        } else if (activeTab === 'CLASSES') {
            const isNew = !classes.some(c => c.id === item.id);
            isNew ? addClass(item as HomebrewClass) : updateClass(item as HomebrewClass);
            typeLabel = 'Class';
        } else if (activeTab === 'SUBCLASSES') {
            const isNew = !subclasses.some(s => s.id === item.id);
            isNew ? addSubclass(item as HomebrewOfficialSubclass) : updateSubclass(item as HomebrewOfficialSubclass);
            typeLabel = 'Subclass';
        } else {
            const isNew = !rules.some(r => r.id === item.id);
            isNew ? addRule(item as HomebrewRule) : updateRule(item as HomebrewRule);
            typeLabel = 'Rule';
        }
        addToast(`${typeLabel} saved successfully.`, 'success');
        setView('LIST');
        setEditingItem(null);
    };

    const handleCancel = () => {
        setView('LIST');
        setEditingItem(null);
    };

    const handleDelete = (item: HomebrewRace | HomebrewSpell | HomebrewClass | HomebrewOfficialSubclass | HomebrewRule) => {
        setItemToDelete(item);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        
        let typeLabel = 'Item';
        if (activeTab === 'RACES') { deleteRace(itemToDelete.id); typeLabel = 'Race'; }
        else if (activeTab === 'SPELLS') { deleteSpell(itemToDelete.id); typeLabel = 'Spell'; }
        else if (activeTab === 'CLASSES') { deleteClass(itemToDelete.id); typeLabel = 'Class'; }
        else if (activeTab === 'SUBCLASSES') { deleteSubclass(itemToDelete.id); typeLabel = 'Subclass'; }
        else { deleteRule(itemToDelete.id); typeLabel = 'Rule'; }

        addToast(`${typeLabel} deleted.`, 'info');
        setItemToDelete(null);
    };

    if (view === 'RACE_FORM') return <HomebrewRaceForm race={editingItem as HomebrewRace} onSave={handleSave} onCancel={handleCancel} />;
    if (view === 'SPELL_FORM') return <HomebrewSpellForm spell={editingItem as HomebrewSpell} onSave={handleSave} onCancel={handleCancel} />;
    if (view === 'CLASS_FORM') return <HomebrewClassForm classDef={editingItem as HomebrewClass} onSave={handleSave} onCancel={handleCancel} />;
    if (view === 'SUBCLASS_FORM') return <HomebrewOfficialSubclassForm subclass={editingItem as HomebrewOfficialSubclass} onSave={handleSave} onCancel={handleCancel} />;
    if (view === 'RULE_FORM') return <HomebrewRuleForm rule={editingItem as HomebrewRule} onSave={handleSave} onCancel={handleCancel} />;
    
    const TabButton: React.FC<{tab: Tab, label: string}> = ({tab, label}) => (
        <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xl font-medieval rounded-t-lg transition-all border-b-2 ${activeTab === tab ? 'border-[var(--border-accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
            {label}
        </button>
    );

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
             <div className="text-center mb-8">
                <h2 className="text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Homebrew Collection</h2>
                <p className="text-[var(--text-muted)] mt-2">Create and manage your custom content.</p>
            </div>
            <div className="border-b border-[var(--border-primary)] mb-6">
                <div className="flex gap-2">
                    <TabButton tab="RACES" label="Races" />
                    <TabButton tab="CLASSES" label="Classes" />
                    <TabButton tab="SUBCLASSES" label="Subclasses" />
                    <TabButton tab="SPELLS" label="Spells" />
                    <TabButton tab="RULES" label="Rules" />
                </div>
            </div>

            {activeTab === 'RACES' && (
                racesLoading ? <Loader message="Loading Races..." /> :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NewHomebrewCard type="Race" icon={<RaceIcon />} onClick={handleCreate} />
                    {races.map(race => (
                        <HomebrewRaceCard key={race.id} race={race} onEdit={() => handleEdit(race)} onDelete={() => handleDelete(race)} />
                    ))}
                </div>
            )}
            {activeTab === 'CLASSES' && (
                 classesLoading ? <Loader message="Loading Classes..." /> :
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <NewHomebrewCard type="Class" icon={<ClassIcon />} onClick={handleCreate} />
                     {classes.map(classDef => (
                         <HomebrewClassCard key={classDef.id} classDef={classDef} onEdit={() => handleEdit(classDef)} onDelete={() => handleDelete(classDef)} />
                     ))}
                 </div>
            )}
            {activeTab === 'SUBCLASSES' && (
                subclassesLoading ? <Loader message="Loading Subclasses..." /> :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NewHomebrewCard type="Subclass" icon={<SubclassIcon />} onClick={handleCreate} />
                    {subclasses.map(subclass => (
                        <HomebrewSubclassCard key={subclass.id} subclass={subclass} onEdit={() => handleEdit(subclass)} onDelete={() => handleDelete(subclass)} />
                    ))}
                </div>
            )}
            {activeTab === 'SPELLS' && (
                 spellsLoading ? <Loader message="Loading Spells..." /> :
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <NewHomebrewCard type="Spell" icon={<SpellIcon />} onClick={handleCreate} />
                     {spells.map(spell => (
                         <HomebrewSpellCard key={spell.id} spell={spell} onEdit={() => handleEdit(spell)} onDelete={() => handleDelete(spell)} />
                     ))}
                 </div>
            )}
            {activeTab === 'RULES' && (
                 rulesLoading ? <Loader message="Loading Rules..." /> :
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <NewHomebrewCard type="Rule" icon={<RuleIcon />} onClick={handleCreate} />
                     {rules.map(rule => (
                         <HomebrewRuleCard key={rule.id} rule={rule} onEdit={() => handleEdit(rule)} onDelete={() => handleDelete(rule)} />
                     ))}
                 </div>
            )}

            <Dialog
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to permanently delete "${(itemToDelete as any)?.name || (itemToDelete as any)?.title}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default HomebrewManager;
