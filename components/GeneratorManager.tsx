

import React, { useState, useCallback } from 'react';
import * as ALL_GENERATORS from '../data/generatorData';
import Button from './ui/Button';

// Helper function to get a random item from an array
const randomItem = (arr: ReadonlyArray<string>): string => arr[Math.floor(Math.random() * arr.length)];

type ResultState = {
    jsx: React.ReactNode;
    text: string;
} | null;

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border-primary)] p-4 flex flex-col h-full ${className}`}>
        <h3 className="text-lg font-medieval text-[var(--text-secondary)] mb-2 border-b border-[var(--border-secondary)] pb-2">{title}</h3>
        {children}
    </div>
);

const ResultCard: React.FC<{
    title: string;
    result: React.ReactNode;
    onGenerate: () => void;
    textToCopy: string | null;
    children?: React.ReactNode;
}> = ({ title, result, onGenerate, textToCopy, children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Section title={title}>
            <div className="flex justify-between items-center mb-2">
                <Button onClick={onGenerate}>Generate</Button>
                {result && <Button onClick={handleCopy} variant="ghost" size="sm">{copied ? 'Copied!' : 'Copy Text'}</Button>}
            </div>
            <div className="bg-[var(--bg-primary)]/50 p-3 rounded-md min-h-[120px] text-[var(--text-secondary)] flex-grow">
                {result || <p className="text-[var(--text-muted)] italic">Click "Generate" for inspiration.</p>}
            </div>
            {children && <div className="mt-2">{children}</div>}
        </Section>
    );
};


const GeneratorManager: React.FC = () => {
    const [npc, setNpc] = useState<ResultState>(null);
    const [tavern, setTavern] = useState<ResultState>(null);
    const [plotHook, setPlotHook] = useState<ResultState>(null);
    const [magicItem, setMagicItem] = useState<ResultState>(null);
    const [dungeon, setDungeon] = useState<ResultState>(null);
    const [fantasyName, setFantasyName] = useState<ResultState>(null);
    
    const generateNpc = useCallback(() => {
        const firstName = randomItem(ALL_GENERATORS.GENERATOR_NPC_FIRST_NAMES);
        const lastName = randomItem(ALL_GENERATORS.GENERATOR_NPC_LAST_NAMES);
        const appearance = randomItem(ALL_GENERATORS.GENERATOR_NPC_APPEARANCE);
        const trait1 = randomItem(ALL_GENERATORS.GENERATOR_NPC_TRAITS);
        const trait2 = randomItem(ALL_GENERATORS.GENERATOR_NPC_TRAITS);
        const motivation = randomItem(ALL_GENERATORS.GENERATOR_NPC_MOTIVATIONS);

        setNpc({
            jsx: (
                <div className="space-y-1">
                    <p className="font-bold text-lg text-[var(--text-primary)]">{firstName} {lastName}</p>
                    <p className="italic text-[var(--text-muted)]">...{appearance}.</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Traits:</strong> {trait1}, {trait2}</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Motivation:</strong> {motivation}</p>
                </div>
            ),
            text: `Name: ${firstName} ${lastName}\nAppearance: ...${appearance}.\nTraits: ${trait1}, ${trait2}\nMotivation: ${motivation}`
        });
    }, []);

    const generateTavern = useCallback(() => {
        const adjective = randomItem(ALL_GENERATORS.GENERATOR_TAVERN_ADJECTIVES);
        const noun = randomItem(ALL_GENERATORS.GENERATOR_TAVERN_NOUNS);
        const atmosphere = randomItem(ALL_GENERATORS.GENERATOR_TAVERN_ATMOSPHERES);
        const quirk = randomItem(ALL_GENERATORS.GENERATOR_TAVERN_QUIRKS);

        setTavern({
            jsx: (
                <div className="space-y-1">
                    <p className="font-bold text-lg text-[var(--text-primary)]">{adjective} {noun}</p>
                    <p className="italic text-[var(--text-muted)]">{atmosphere}.</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Quirk:</strong> {quirk}.</p>
                </div>
            ),
            text: `Name: ${adjective} ${noun}\nAtmosphere: ${atmosphere}.\nQuirk: ${quirk}.`
        });
    }, []);

    const generatePlotHook = useCallback(() => {
        const patron = randomItem(ALL_GENERATORS.GENERATOR_PLOT_PATRONS);
        const action = randomItem(ALL_GENERATORS.GENERATOR_PLOT_ACTIONS);
        const macguffin = randomItem(ALL_GENERATORS.GENERATOR_PLOT_MACGUFFINS);
        const location = randomItem(ALL_GENERATORS.GENERATOR_PLOT_LOCATIONS);
        const antagonist = randomItem(ALL_GENERATORS.GENERATOR_PLOT_ANTAGONISTS);
        const twist = randomItem(ALL_GENERATORS.GENERATOR_PLOT_TWISTS);

        setPlotHook({
            jsx: (
                <div className="space-y-1 text-sm">
                    <p><strong className="text-[var(--accent-primary-hover)]">Patron:</strong> {patron}</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Task:</strong> needs the party to {action} <strong className="text-[var(--text-primary)]">{macguffin}</strong></p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Location:</strong> from {location},</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Antagonist:</strong> which is currently guarded by {antagonist}.</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Twist:</strong> However, {twist}.</p>
                </div>
            ),
            text: `Patron: ${patron} needs the party to ${action} ${macguffin} from ${location}, which is currently guarded by ${antagonist}. However, ${twist}.`
        });
    }, []);
    
    const generateMagicItem = useCallback(() => {
        const prefix = randomItem(ALL_GENERATORS.GENERATOR_ITEM_PREFIXES);
        const type = randomItem(ALL_GENERATORS.GENERATOR_ITEM_TYPES);
        const effect = randomItem(ALL_GENERATORS.GENERATOR_ITEM_EFFECTS);
        const quirk = randomItem(ALL_GENERATORS.GENERATOR_ITEM_QUIRKS);

        setMagicItem({
             jsx: (
                 <div className="space-y-1">
                    <p className="font-bold text-lg text-[var(--text-primary)]">{prefix} {type}</p>
                    <p className="italic text-[var(--text-muted)]">This item {effect}</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Quirk:</strong> {quirk}</p>
                </div>
            ),
            text: `Item: ${prefix} ${type}\nEffect: This item ${effect}\nQuirk: ${quirk}`
        });
    }, []);
    
    const generateDungeon = useCallback(() => {
        const prefix = randomItem(ALL_GENERATORS.GENERATOR_DUNGEON_PREFIXES);
        const type = randomItem(ALL_GENERATORS.GENERATOR_DUNGEON_TYPES);
        const inhabitants = randomItem(ALL_GENERATORS.GENERATOR_DUNGEON_INHABITANTS);
        const hazard = randomItem(ALL_GENERATORS.GENERATOR_DUNGEON_HAZARDS);
        const goal = randomItem(ALL_GENERATORS.GENERATOR_DUNGEON_GOALS);
        
        setDungeon({
             jsx: (
                 <div className="space-y-1">
                    <p className="font-bold text-lg text-[var(--text-primary)]">{prefix} {type}</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Inhabitants:</strong> It is currently occupied by {inhabitants}.</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Main Hazard:</strong> Intruders must contend with {hazard}.</p>
                    <p><strong className="text-[var(--accent-primary-hover)]">Primary Goal:</strong> The party must enter to {goal}.</p>
                </div>
            ),
            text: `Dungeon: ${prefix} ${type}\nInhabitants: It is currently occupied by ${inhabitants}.\nMain Hazard: Intruders must contend with ${hazard}.\nPrimary Goal: The party must enter to ${goal}.`
        });
    }, []);

    const generateName = useCallback((race: 'Elf' | 'Dwarf' | 'Orc') => {
        let name = '';
        if (race === 'Elf') {
            name = randomItem(ALL_GENERATORS.GENERATOR_NAME_ELF_PREFIX) + randomItem(ALL_GENERATORS.GENERATOR_NAME_ELF_SUFFIX);
        } else if (race === 'Dwarf') {
            name = randomItem(ALL_GENERATORS.GENERATOR_NAME_DWARF_PREFIX) + randomItem(ALL_GENERATORS.GENERATOR_NAME_DWARF_SUFFIX);
        } else {
            name = randomItem(ALL_GENERATORS.GENERATOR_NAME_ORC_PREFIX) + randomItem(ALL_GENERATORS.GENERATOR_NAME_ORC_SUFFIX);
        }
        
        setFantasyName({
            jsx: <p className="font-bold text-2xl text-[var(--text-primary)] text-center pt-8">{name}</p>,
            text: name
        });
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Generators</h2>
                <div className="w-32 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
                <p className="text-[var(--text-muted)] mt-4 text-lg">Instant inspiration for your campaign.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard title="NPC Generator" result={npc?.jsx} onGenerate={generateNpc} textToCopy={npc?.text ?? null} />
                <ResultCard title="Tavern Generator" result={tavern?.jsx} onGenerate={generateTavern} textToCopy={tavern?.text ?? null} />
                <ResultCard title="Plot Hook Generator" result={plotHook?.jsx} onGenerate={generatePlotHook} textToCopy={plotHook?.text ?? null} />
                <ResultCard title="Magic Item Generator" result={magicItem?.jsx} onGenerate={generateMagicItem} textToCopy={magicItem?.text ?? null} />
                <ResultCard title="Dungeon Generator" result={dungeon?.jsx} onGenerate={generateDungeon} textToCopy={dungeon?.text ?? null} />
                <ResultCard title="Fantasy Name Generator" result={fantasyName?.jsx} onGenerate={() => generateName('Elf')} textToCopy={fantasyName?.text ?? null}>
                    <div className="flex gap-2 justify-center">
                        <Button onClick={() => generateName('Elf')} variant="ghost" size="sm">Elf</Button>
                        <Button onClick={() => generateName('Dwarf')} variant="ghost" size="sm">Dwarf</Button>
                        <Button onClick={() => generateName('Orc')} variant="ghost" size="sm">Orc</Button>
                    </div>
                </ResultCard>
            </div>
        </div>
    );
};

export default GeneratorManager;