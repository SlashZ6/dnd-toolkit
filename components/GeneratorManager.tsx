
import React, { useState, useCallback } from 'react';
import * as ALL_GENERATORS from '../data/generatorData';
import Button from './ui/Button';
import { useToast } from './ui/Toast';

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
    const { addToast } = useToast();

    const handleCopy = () => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            addToast('Copied to clipboard!', 'success');
        }
    };

    return (
        <Section title={title}>
            <div className="flex justify-between items-center mb-2">
                <Button onClick={onGenerate}>Generate</Button>
                {result && <Button onClick={handleCopy} variant="ghost" size="sm">Copy Text</Button>}
            </div>
            <div className="bg-[var(--bg-primary)]/50 p-3 rounded-md min-h-[120px] text-[var(--text-secondary)] flex-grow">
                {result || <p className="text-[var(--text-muted)] italic">Click "Generate" for inspiration.</p>}
            </div>
            {children && <div className="mt-2">{children}</div>}
        </Section>
    );
};

// --- Advanced Name Generator Logic ---
const generateFantasyName = (race: string): { display: string, full: string } => {
    let name = '';
    
    // We access the data using the imported constant
    const data = ALL_GENERATORS.GENERATOR_NAME_DATA;

    switch (race) {
        case 'Elf':
            name = randomItem(data.Elf.prefixes) + randomItem(data.Elf.suffixes);
            name = name.charAt(0).toUpperCase() + name.slice(1);
            if (Math.random() > 0.5) name += ' ' + randomItem(data.Elf.surnames);
            break;
        case 'Dwarf':
            name = randomItem(data.Dwarf.prefixes) + randomItem(data.Dwarf.suffixes);
            name = name.charAt(0).toUpperCase() + name.slice(1);
            if (Math.random() > 0.3) name += ' ' + randomItem(data.Dwarf.clanNames);
            break;
        case 'Orc':
            name = randomItem(data.Orc.prefixes) + randomItem(data.Orc.suffixes);
            name = name.charAt(0).toUpperCase() + name.slice(1);
            if (Math.random() > 0.7) name += ' ' + randomItem(data.Orc.epithets);
            break;
        case 'Human':
            name = randomItem(data.Human.firstNames) + ' ' + randomItem(data.Human.surnames);
            break;
        case 'Halfling':
            name = randomItem(data.Halfling.firstNames) + ' ' + randomItem(data.Halfling.surnames);
            break;
        case 'Gnome':
            name = randomItem(data.Gnome.firstNames) + ' "' + randomItem(data.Gnome.nicknames) + '" ' + randomItem(data.Gnome.clanNames);
            break;
        case 'Tiefling':
            if (Math.random() > 0.5) name = randomItem(data.Tiefling.virtueNames);
            else name = randomItem(data.Tiefling.infernalNames);
            break;
        case 'Dragonborn':
            name = randomItem(data.Dragonborn.firstNames) + ' of Clan ' + randomItem(data.Dragonborn.clanNames);
            break;
        default:
            name = "Unknown";
    }

    return { display: name, full: name };
};


const GeneratorManager: React.FC = () => {
    const [npc, setNpc] = useState<ResultState>(null);
    const [tavern, setTavern] = useState<ResultState>(null);
    const [plotHook, setPlotHook] = useState<ResultState>(null);
    const [magicItem, setMagicItem] = useState<ResultState>(null);
    const [dungeon, setDungeon] = useState<ResultState>(null);
    const [fantasyName, setFantasyName] = useState<ResultState>(null);
    const [settlement, setSettlement] = useState<ResultState>(null);
    const [treasure, setTreasure] = useState<ResultState>(null);
    const [rumor, setRumor] = useState<ResultState>(null);

    const [selectedRace, setSelectedRace] = useState<string>('Elf');
    
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

    const generateName = useCallback(() => {
        const result = generateFantasyName(selectedRace);
        setFantasyName({
            jsx: <p className="font-bold text-2xl text-[var(--text-primary)] text-center pt-8 break-words">{result.display}</p>,
            text: result.full
        });
    }, [selectedRace]);

    const generateSettlement = useCallback(() => {
        const prefix = randomItem(ALL_GENERATORS.GENERATOR_CITY_PREFIX);
        const suffix = randomItem(ALL_GENERATORS.GENERATOR_CITY_SUFFIX);
        const name = prefix + suffix;
        const quirk = randomItem(ALL_GENERATORS.GENERATOR_TAVERN_ATMOSPHERES); // Reuse atmosphere for now as vibe
        
        setSettlement({
            jsx: (
                <div className="space-y-1">
                    <p className="font-bold text-lg text-[var(--text-primary)]">{name}</p>
                    <p className="italic text-[var(--text-muted)]">A settlement that is {quirk}.</p>
                </div>
            ),
            text: `${name} - A settlement that is {quirk}.`
        });
    }, []);

    const generateTreasure = useCallback(() => {
        const coins = randomItem(ALL_GENERATORS.GENERATOR_TREASURE_COINS);
        const art = randomItem(ALL_GENERATORS.GENERATOR_TREASURE_ART);
        const gems = randomItem(ALL_GENERATORS.GENERATOR_TREASURE_GEMS);
        
        setTreasure({
            jsx: (
                <ul className="space-y-1 list-disc list-inside text-sm">
                    <li>{coins}</li>
                    <li>{art}</li>
                    <li>{gems}</li>
                </ul>
            ),
            text: `Loot:\n- ${coins}\n- ${art}\n- ${gems}`
        });
    }, []);

    const generateRumor = useCallback(() => {
        const subject = randomItem(ALL_GENERATORS.GENERATOR_RUMOR_SUBJECTS);
        const verb = randomItem(ALL_GENERATORS.GENERATOR_RUMOR_VERBS);
        const location = randomItem(ALL_GENERATORS.GENERATOR_RUMOR_LOCATIONS);
        
        setRumor({
            jsx: (
                <p className="italic text-[var(--text-primary)]">
                    "I heard that <strong className="text-[var(--accent-primary)]">{subject}</strong> {verb} {location}."
                </p>
            ),
            text: `"I heard that ${subject} ${verb} ${location}."`
        });
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-4xl sm:text-5xl font-medieval text-[var(--accent-primary)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Generators</h2>
                <div className="w-32 h-1 mx-auto mt-2 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>
                <p className="text-[var(--text-muted)] mt-4 text-lg">Instant inspiration for your campaign.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Row 1 */}
                <ResultCard title="Fantasy Name Generator" result={fantasyName?.jsx} onGenerate={generateName} textToCopy={fantasyName?.text ?? null}>
                    <div className="flex gap-2 justify-center">
                        <select 
                            value={selectedRace} 
                            onChange={(e) => setSelectedRace(e.target.value)}
                            className="bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] w-full"
                        >
                            {Object.keys(ALL_GENERATORS.GENERATOR_NAME_DATA).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </ResultCard>

                <ResultCard title="NPC Generator" result={npc?.jsx} onGenerate={generateNpc} textToCopy={npc?.text ?? null} />
                <ResultCard title="Tavern Generator" result={tavern?.jsx} onGenerate={generateTavern} textToCopy={tavern?.text ?? null} />
                
                {/* Row 2 */}
                <ResultCard title="Plot Hook Generator" result={plotHook?.jsx} onGenerate={generatePlotHook} textToCopy={plotHook?.text ?? null} />
                <ResultCard title="Magic Item Generator" result={magicItem?.jsx} onGenerate={generateMagicItem} textToCopy={magicItem?.text ?? null} />
                <ResultCard title="Dungeon Generator" result={dungeon?.jsx} onGenerate={generateDungeon} textToCopy={dungeon?.text ?? null} />
                
                {/* Row 3 (New) */}
                <ResultCard title="Settlement Name Generator" result={settlement?.jsx} onGenerate={generateSettlement} textToCopy={settlement?.text ?? null} />
                <ResultCard title="Treasure Hoard Generator" result={treasure?.jsx} onGenerate={generateTreasure} textToCopy={treasure?.text ?? null} />
                <ResultCard title="Rumor Mill" result={rumor?.jsx} onGenerate={generateRumor} textToCopy={rumor?.text ?? null} />
            </div>
        </div>
    );
};

export default GeneratorManager;
