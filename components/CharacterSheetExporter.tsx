import React from 'react';
import { Character, Spell } from '../types';
import { DND_SKILLS, SKILL_ABILITY_MAP } from '../constants';
import { DND_SPELLS } from '../data/spellsData';
import { DND_CLASS_DATA } from '../data/dndData';
import { DND_RACES_DATA } from '../data/racesData';
import { SwordsIcon } from './icons/SwordsIcon';

// --- HELPER FUNCTIONS & COMPONENTS ---
const getModifier = (score: number): string => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
};

const getModifierAsNumber = (score: number): number => Math.floor((score - 10) / 2);

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-[var(--bg-primary)]/40 rounded-lg border-2 border-[var(--border-primary)]/80 p-3 flex flex-col ${className}`}>
    <h3 className="text-center font-medieval text-[var(--accent-primary)] text-xl mb-2 tracking-wide">{title}</h3>
    <div className="bg-[var(--bg-secondary)]/40 rounded p-2 flex-grow min-h-0">{children}</div>
  </div>
);

const AbilityScoreBox: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className="bg-[var(--bg-secondary)]/50 rounded-lg p-2 text-center border-2 border-[var(--border-primary)]">
    <div className="text-lg font-bold text-[var(--text-secondary)] uppercase font-medieval">{label}</div>
    <div className="text-4xl font-black text-[var(--text-primary)]">{score}</div>
    <div className="text-xl text-[var(--accent-secondary)] bg-[var(--bg-primary)]/70 rounded-full text-glow-cyan w-12 mx-auto">{getModifier(score)}</div>
  </div>
);

// --- MAIN COMPONENT ---
const CharacterSheetExporter: React.FC<{ character: Character }> = ({ character }) => {
  const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
  const initiative = getModifierAsNumber(character.abilityScores.dex);
  const speed = DND_RACES_DATA[character.race]?.speed || 30;
  
  const classData = DND_CLASS_DATA[character.characterClass];
  const spellcastingAbility = classData?.spellcasting?.ability || 'int';
  const spellcastingModifier = getModifierAsNumber(character.abilityScores[spellcastingAbility]);
  const spellSaveDC = classData?.spellcasting ? 8 + proficiencyBonus + spellcastingModifier : '-';
  const spellAttackBonus = classData?.spellcasting ? proficiencyBonus + spellcastingModifier : 0;

  const getSkillModifier = (skill: string) => {
    const ability = SKILL_ABILITY_MAP[skill];
    const abilityMod = getModifierAsNumber(character.abilityScores[ability]);
    const isProficient = character.skillProficiencies.includes(skill);
    const modifier = abilityMod + (isProficient ? proficiencyBonus : 0);
    return modifier >= 0 ? `+${modifier}` : String(modifier);
  };

  const spellsByLevel = character.spells
    .map(name => DND_SPELLS[name]).filter(Boolean)
    .reduce((acc, spell) => {
      const level = spell.level;
      if (!acc[level]) acc[level] = [];
      acc[level].push(spell);
      return acc;
    }, {} as Record<number, Spell[]>);
  
  return (
    <div className="w-[1200px] h-[3000px] bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 font-['Lato']" style={{ fontFamily: "'Lato', sans-serif" }}>
      <div className="h-full border-4 border-[var(--border-secondary)] bg-[var(--bg-secondary)]/20 rounded-lg p-4 flex flex-col gap-4">
        {/* --- HEADER --- */}
        <header className="text-center pb-2 border-b-4 border-[var(--border-secondary)]">
            <h1 className="text-7xl font-medieval text-[var(--accent-primary)] tracking-wider">{character.name || 'Unnamed Hero'}</h1>
            <div className="grid grid-cols-3 gap-3 text-sm mt-3 max-w-4xl mx-auto">
                <div className="bg-[var(--bg-primary)]/50 p-2 rounded border border-[var(--border-primary)]"><span className="block text-[var(--text-muted)] text-xs uppercase">Class & Level</span>{character.characterClass} {character.level}</div>
                <div className="bg-[var(--bg-primary)]/50 p-2 rounded border border-[var(--border-primary)]"><span className="block text-[var(--text-muted)] text-xs uppercase">Race</span>{character.race}</div>
                <div className="bg-[var(--bg-primary)]/50 p-2 rounded border border-[var(--border-primary)]"><span className="block text-[var(--text-muted)] text-xs uppercase">Subclass</span>{character.subclass || 'N/A'}</div>
            </div>
        </header>

        {/* --- BODY --- */}
        <main className="grid grid-cols-3 gap-4 flex-grow min-h-0">
          {/* Col 1: Stats & Skills */}
          <div className="flex flex-col gap-4">
            <div className="w-full h-80 bg-[var(--bg-primary)] rounded-lg border-2 border-[var(--border-primary)] flex items-center justify-center overflow-hidden shadow-lg">
                {character.appearanceImage ? (
                    <img src={character.appearanceImage} alt={character.name} className="w-full h-full object-cover object-top" />
                ) : (
                    <SwordsIcon className="h-32 w-32 text-[var(--bg-quaternary)]" />
                )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(character.abilityScores) as Array<keyof typeof character.abilityScores>).map(key => (
                  <AbilityScoreBox key={key} label={key.toUpperCase()} score={character.abilityScores[key]} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--bg-secondary)]/50 p-2 rounded-lg text-center border-2 border-[var(--border-primary)]">
                    <div className="text-2xl font-bold">+{proficiencyBonus}</div>
                    <div className="text-xs text-[var(--text-muted)] uppercase">Proficiency</div>
                </div>
                 <div className="bg-[var(--bg-secondary)]/50 p-2 rounded-lg text-center border-2 border-[var(--border-primary)]">
                    <div className="text-2xl font-bold">{character.passivePerception}</div>
                    <div className="text-xs text-[var(--text-muted)] uppercase">Passive Perception</div>
                </div>
            </div>
            <Section title="Skills" className="flex-grow min-h-0">
                <div className="space-y-1 text-sm columns-2 gap-x-4">
                    {DND_SKILLS.map(skill => (
                        <div key={skill} className="flex justify-between items-center border-b border-[var(--bg-secondary)]/80 py-0.5 break-inside-avoid">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full border border-[var(--text-muted)] ${character.skillProficiencies.includes(skill) ? 'bg-[var(--accent-secondary)]' : ''}`}></div>
                                <span className="text-[var(--text-secondary)]">{skill}</span>
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">{getSkillModifier(skill)}</span>
                        </div>
                    ))}
                </div>
            </Section>
          </div>
          
          {/* Col 2: Vitals, Actions, Equipment */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[var(--bg-secondary)]/50 p-2 rounded-lg border-2 border-[var(--border-primary)]"><div className="text-3xl font-bold">{character.ac}</div><div className="text-xs text-[var(--text-muted)] uppercase">Armor Class</div></div>
              <div className="bg-[var(--bg-secondary)]/50 p-2 rounded-lg border-2 border-[var(--border-primary)]"><div className="text-3xl font-bold">{initiative >= 0 ? `+${initiative}` : initiative}</div><div className="text-xs text-[var(--text-muted)] uppercase">Initiative</div></div>
              <div className="bg-[var(--bg-secondary)]/50 p-2 rounded-lg border-2 border-[var(--border-primary)]"><div className="text-3xl font-bold">{speed}ft</div><div className="text-xs text-[var(--text-muted)] uppercase">Speed</div></div>
            </div>
            <div className="bg-[var(--bg-secondary)]/50 p-2 rounded-lg border-2 border-[var(--border-primary)] text-center">
              <div className="text-[var(--text-muted)] text-xs uppercase">Hit Points</div>
              <div className="text-3xl font-bold">{character.currentHp} / {character.maxHp}</div>
            </div>
             <Section title="Features & Traits" className="flex-grow min-h-0">
                <div className={`space-y-3 text-sm text-pretty ${character.features.length > 8 ? 'columns-2 gap-x-4' : ''}`}>
                    {character.features.map(f => (
                        <div key={f.id} className="break-inside-avoid pb-2">
                            <strong className="text-[var(--accent-primary-hover)] font-bold">{f.name}:</strong>{' '}
                            <span className="text-[var(--text-muted)]">{f.description}</span>
                        </div>
                    ))}
                </div>
            </Section>
            <Section title="Equipment" className="flex-grow min-h-0">
                <div className="text-center font-bold text-lg text-[var(--accent-primary)] mb-2">{character.currency} GP</div>
                <div className="space-y-1 text-sm">
                    {character.inventory.map(item => (
                        <div key={item.id} className="flex justify-between">
                            <span className="text-[var(--text-secondary)]">{item.name} {item.quantity > 1 && `(x${item.quantity})`}</span>
                            <span className="text-[var(--text-muted)]">{item.weight * item.quantity} lbs</span>
                        </div>
                    ))}
                </div>
            </Section>
          </div>

          {/* Col 3: Spells & Notes */}
          <div className="flex flex-col gap-4">
            <Section title="Spellcasting" className="flex-grow min-h-0">
                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-2">
                    <div className="bg-[var(--bg-secondary)] p-1 rounded"><span className="text-[var(--text-muted)] text-xs block">Ability</span><span className="font-bold">{spellcastingAbility.toUpperCase()}</span></div>
                    <div className="bg-[var(--bg-secondary)] p-1 rounded"><span className="text-[var(--text-muted)] text-xs block">Save DC</span><span className="font-bold">{spellSaveDC}</span></div>
                    <div className="bg-[var(--bg-secondary)] p-1 rounded"><span className="text-[var(--text-muted)] text-xs block">Attack</span><span className="font-bold">{spellAttackBonus >= 0 ? `+${spellAttackBonus}` : spellAttackBonus}</span></div>
                </div>
                <div className="space-y-2 text-sm">
                    {Object.entries(spellsByLevel).sort(([a], [b]) => Number(a) - Number(b)).map(([level, spells]) => {
                         const lvl = Number(level);
                         const maxSlots = character.spellSlots.max[lvl - 1] || 0;
                         return (
                            <div key={level}>
                                <h4 className="font-medieval text-[var(--accent-secondary)]">{lvl === 0 ? "Cantrips" : `Level ${lvl} (${maxSlots} Slots)`}</h4>
                                <ul className="list-disc list-inside text-[var(--text-secondary)] pl-2 columns-2">
                                    {spells.sort((a, b) => a.name.localeCompare(b.name)).map(s => <li key={s.name} className="break-inside-avoid">{s.name}</li>)}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </Section>
            <Section title="Notes & Backstory" className="flex-grow min-h-0">
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed text-pretty">
                    {character.notes || 'No notes available.'}
                </p>
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CharacterSheetExporter;