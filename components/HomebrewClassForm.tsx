import React, { useState } from 'react';
import { HomebrewClass, HomebrewSubclass, ClassFeature, createEmptySubclass, createEmptyClassFeature, Character } from '../types';
import Button from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';

interface HomebrewClassFormProps {
    classDef: HomebrewClass,
    onSave: (classDef: HomebrewClass) => void,
    onCancel: () => void
}

// Reusable Components
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

// Feature Editor Component
const FeatureEditor: React.FC<{
    features: ClassFeature[],
    onFeaturesChange: (features: ClassFeature[]) => void,
    title: string,
}> = ({ features, onFeaturesChange, title }) => {

    const handleFeatureChange = (index: number, field: keyof ClassFeature, value: any) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        onFeaturesChange(newFeatures);
    };

    const addFeature = () => onFeaturesChange([...features, createEmptyClassFeature()]);
    const removeFeature = (id: string) => onFeaturesChange(features.filter(f => f.id !== id));

    return (
        <Section title={title}>
            <div className="space-y-4">
                {features.map((feature, index) => (
                    <div key={feature.id} className="p-3 bg-[var(--bg-secondary)]/50 rounded-md border border-[var(--border-secondary)] space-y-2">
                        <div className="flex gap-2 items-start">
                           <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <FormInput label="Level" type="number" value={feature.level} onChange={(e) => handleFeatureChange(index, 'level', parseInt(e.target.value) || 1)} min="1" max="20" />
                                <FormInput label="Name" value={feature.name} onChange={(e) => handleFeatureChange(index, 'name', e.target.value)} />
                           </div>
                           <Button type="button" onClick={() => removeFeature(feature.id)} variant="ghost" className="!p-2 mt-7 text-[var(--text-muted)] hover:text-red-500"><TrashIcon className="h-5 w-5"/></Button>
                        </div>
                        <FormTextarea label="Description" value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} rows={3} />
                    </div>
                ))}
            </div>
            <Button type="button" onClick={addFeature} className="mt-4">Add Feature</Button>
        </Section>
    );
};

// Main Form Component
const HomebrewClassForm: React.FC<HomebrewClassFormProps> = ({ classDef, onSave, onCancel }) => {
    const [formData, setFormData] = useState<HomebrewClass>(classDef);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            setFormData(prev => ({...prev, [name]: parseInt(value) || 0}));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleProficiencyChange = (type: 'armor' | 'weapon' | 'savingThrow', value: string) => {
        const field = `${type}Proficiencies` as 'armorProficiencies' | 'weaponProficiencies' | 'savingThrowProficiencies';
        const current = formData[field] as string[];
        const newProficiencies = current.includes(value) ? current.filter(p => p !== value) : [...current, value];
        setFormData(prev => ({...prev, [field]: newProficiencies}));
    };
    
    const handleSubclassChange = (index: number, field: keyof HomebrewSubclass, value: any) => {
        const newSubclasses = [...formData.subclasses];
        newSubclasses[index] = {...newSubclasses[index], [field]: value};
        setFormData(prev => ({...prev, subclasses: newSubclasses}));
    };

    const addSubclass = () => setFormData(prev => ({ ...prev, subclasses: [...prev.subclasses, createEmptySubclass()] }));
    const removeSubclass = (id: string) => setFormData(prev => ({ ...prev, subclasses: prev.subclasses.filter(s => s.id !== id)}));
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const abilityScores: Array<keyof Character['abilityScores']> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const spellcastingAbilities: Array<keyof Omit<Character['abilityScores'], 'str' | 'dex' | 'con'>> = ['int', 'wis', 'cha'];


    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-6xl mx-auto">
             <header className="flex justify-between items-center">
                <h2 className="text-4xl font-medieval text-amber-300">{classDef.name ? `Edit ${classDef.name}` : 'Create New Class'}</h2>
                <div className="flex gap-2">
                    <Button type="button" onClick={onCancel} variant="ghost">Cancel</Button>
                    <Button type="submit">Save Class</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Section title="Core Details">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2"><FormInput label="Class Name" name="name" value={formData.name} onChange={handleChange} required /></div>
                            <FormSelect label="Hit Die" name="hitDie" value={formData.hitDie} onChange={handleChange}>
                                <option value={6}>d6</option><option value={8}>d8</option><option value={10}>d10</option><option value={12}>d12</option>
                            </FormSelect>
                            <FormInput label="Subclass Level" name="subclassLevel" type="number" min="1" max="20" value={formData.subclassLevel} onChange={handleChange} />
                        </div>
                    </Section>

                    <Section title="Proficiencies">
                         <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-[var(--text-secondary)] mb-2">Armor</h4>
                                <div className="flex flex-wrap gap-4">
                                    {(['light', 'medium', 'heavy', 'shields'] as const).map(p => 
                                        <label key={p} className="flex items-center gap-2"><input type="checkbox" checked={formData.armorProficiencies.includes(p)} onChange={() => handleProficiencyChange('armor', p)} className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"/> {p.charAt(0).toUpperCase() + p.slice(1)}</label>)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-[var(--text-secondary)] mb-2">Weapons</h4>
                                <div className="flex flex-wrap gap-4">
                                    {(['simple', 'martial'] as const).map(p => 
                                        <label key={p} className="flex items-center gap-2"><input type="checkbox" checked={formData.weaponProficiencies.includes(p)} onChange={() => handleProficiencyChange('weapon', p)} className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"/> {p.charAt(0).toUpperCase() + p.slice(1)}</label>)}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-bold text-[var(--text-secondary)] mb-2">Saving Throws (Choose 2)</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {abilityScores.map(p => 
                                        <label key={p} className="flex items-center gap-2"><input type="checkbox" checked={formData.savingThrowProficiencies.includes(p)} onChange={() => handleProficiencyChange('savingThrow', p)} disabled={formData.savingThrowProficiencies.length >= 2 && !formData.savingThrowProficiencies.includes(p)} className="h-4 w-4 rounded-sm bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"/> {p.toUpperCase()}</label>)}
                                </div>
                            </div>
                        </div>
                    </Section>
                    
                     <Section title="Spellcasting">
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Spellcasting Ability" name="spellcastingAbility" value={formData.spellcastingAbility} onChange={handleChange}>
                                <option value="none">None</option>
                                {spellcastingAbilities.map(score => <option key={score} value={score}>{score.toUpperCase()}</option>)}
                            </FormSelect>
                            <FormSelect label="Spell Slot Progression" name="spellcastingProgression" value={formData.spellcastingProgression} onChange={handleChange} disabled={formData.spellcastingAbility === 'none'}>
                                <option value="none">None</option>
                                <option value="full">Full Caster (Wizard)</option>
                                <option value="half">Half Caster (Ranger)</option>
                                <option value="third">Third Caster (Arcane Trickster)</option>
                                <option value="pact">Pact Magic (Warlock)</option>
                            </FormSelect>
                        </div>
                    </Section>
                </div>
                
                <div className="space-y-6">
                    <FeatureEditor title="Class Features" features={formData.features} onFeaturesChange={(f) => setFormData(prev => ({...prev, features: f}))} />
                    
                    <Section title="Subclasses">
                        <div className="space-y-4">
                            {formData.subclasses.map((sub, index) => (
                                <div key={sub.id} className="p-3 bg-[var(--bg-secondary)]/50 rounded-md border border-[var(--border-secondary)] space-y-2">
                                    <div className="flex gap-2 items-start">
                                        <div className="flex-grow">
                                            <FormInput label="Subclass Name" value={sub.name} onChange={(e) => handleSubclassChange(index, 'name', e.target.value)} />
                                        </div>
                                        <Button type="button" onClick={() => removeSubclass(sub.id)} variant="ghost" className="!p-2 mt-7 text-[var(--text-muted)] hover:text-red-500"><TrashIcon className="h-5 w-5"/></Button>
                                    </div>
                                    <FeatureEditor title="Subclass Features" features={sub.features} onFeaturesChange={(f) => handleSubclassChange(index, 'features', f)} />
                                </div>
                            ))}
                        </div>
                        <Button type="button" onClick={addSubclass} className="mt-4">Add Subclass</Button>
                    </Section>
                </div>
            </div>
        </form>
    );
};

export default HomebrewClassForm;
