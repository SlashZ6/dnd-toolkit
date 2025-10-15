import React, { useState } from 'react';
import { HomebrewOfficialSubclass, ClassFeature, createEmptyClassFeature } from '../types';
import Button from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import { DND_CLASSES } from '../constants';

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
const HomebrewOfficialSubclassForm: React.FC<{
    subclass: HomebrewOfficialSubclass,
    onSave: (subclass: HomebrewOfficialSubclass) => void,
    onCancel: () => void
}> = ({ subclass, onSave, onCancel }) => {
    const [formData, setFormData] = useState<HomebrewOfficialSubclass>(subclass);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-4xl mx-auto">
             <header className="flex justify-between items-center">
                <h2 className="text-4xl font-medieval text-amber-300">{subclass.name ? `Edit ${subclass.name}` : 'Create New Subclass'}</h2>
                <div className="flex gap-2">
                    <Button type="button" onClick={onCancel} variant="ghost">Cancel</Button>
                    <Button type="submit">Save Subclass</Button>
                </div>
            </header>
            <Section title="Core Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Subclass Name" name="name" value={formData.name} onChange={handleChange} required />
                    <FormSelect label="Base Class" name="baseClassName" value={formData.baseClassName} onChange={handleChange}>
                        {DND_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </FormSelect>
                </div>
            </Section>
            <FeatureEditor title="Subclass Features" features={formData.features} onFeaturesChange={(f) => setFormData(prev => ({...prev, features: f}))} />
        </form>
    );
};

export default HomebrewOfficialSubclassForm;