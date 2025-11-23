
export interface Race {
  name: string;
  description: string;
}

export interface Class {
  name: string;
  description: string;
}

export interface CharacterDetails {
  name: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  source?: 'automatic' | 'manual' | 'race';
  uses?: {
    max: number;
    current: number;
  };
  recharge?: 'short' | 'long';
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    description?: string;
    weight: number;
    equipped: boolean;
    category: 'Weapon' | 'Armor' | 'Gear' | 'Magic Item' | 'Other';
    cost?: string;
    properties?: string[];
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  class: string[];
}

export interface CrestData {
  shape: string;
  symbol: string;
  primaryColor: string;
  secondaryColor: string;
  symbolColor: string;
  division: 'none' | 'perPale' | 'perFess' | 'perBend';
}

export interface ChatMessage {
  id: string;
  user: string;
  timestamp: number;
  type: 'chat' | 'stat' | 'action' | 'npc_share' | 'beast_share' | 'note_share' | 'roll_share' | 'timeline_event_share';
  payload: {
    // For 'chat'
    message?: string;
    ooc?: boolean;
    asNPC?: { name: string };
    // For 'stat'
    statName?: string;
    statValue?: string | number;
    // For 'action'
    action?: string;
    // Common for stat/action
    characterName?: string;
    
    // DM Shares
    npc?: { name: string; race: string; classRole: string; alignment: string; backstorySummary: string; };
    beast?: { name: string; size: string; type: string; alignment: string; ac: number; hp: string; };
    note?: { title: string; content: string; };
    roll?: { title: string; total: number; formula: string; };
    event?: { day: number; description: string };
  };
}


export interface ConnectedUser {
  id: string;
  name: string;
  abilityScores: Character['abilityScores'];
  notes: string;
  crest?: CrestData;
}

export type PresencePayload = {
  type: 'join' | 'leave' | 'update';
  user: ConnectedUser;
}

export interface CompanionAction {
  id: string;
  name: string;
  description: string;
}

export interface Companion {
  id:string;
  name: string;
  type: string;
  currentHp: number;
  maxHp: number;
  ac: number;
  speed: string;
  abilityScores: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  actions: CompanionAction[];
  notes: string;
}

export type SheetSection = 'features' | 'spells' | 'inventory' | 'actions' | 'notes' | 'companions';

export interface Character {
  id:string;
  name: string;
  race: string;
  bloodline: string;
  characterClass: string;
  subclass: string;
  level: number;
  age: string;
  currentHp: number;
  maxHp: number;
  ac: number;
  passivePerception: number;
  abilityScores: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  features: Feature[];
  inventory: InventoryItem[];
  appearanceImage: string; // base64 string
  notes: string;
  currency: number; // Only Gold Pieces (GP)
  spells: string[]; // List of spell names
  skillProficiencies: string[];
  spellSlots: {
    max: number[];
    current: number[];
  };
  crest?: CrestData;
  companions: Companion[];
  sheetSectionOrder?: SheetSection[];
  // For data portability to DM
  embeddedHomebrew?: {
    race?: HomebrewRace;
    class?: HomebrewClass;
    spells?: HomebrewSpell[];
  }
}

export const createEmptyCompanion = (id: string): Companion => ({
    id,
    name: '',
    type: 'Beast',
    currentHp: 10,
    maxHp: 10,
    ac: 10,
    speed: '30 ft.',
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    actions: [],
    notes: '',
});

export const createEmptyCharacter = (id: string): Character => ({
  id,
  name: '',
  race: '',
  bloodline: '',
  characterClass: '',
  subclass: '',
  level: 1,
  age: '',
  currentHp: 10,
  maxHp: 10,
  ac: 10,
  passivePerception: 10,
  abilityScores: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  features: [],
  inventory: [],
  appearanceImage: '',
  notes: '',
  currency: 0,
  spells: [],
  skillProficiencies: [],
  spellSlots: {
    max: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    current: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  crest: undefined,
  companions: [],
  sheetSectionOrder: ['features', 'spells', 'inventory', 'actions', 'notes', 'companions'],
  embeddedHomebrew: {
    spells: []
  },
});

export interface HomebrewRace {
  id: string;
  name: string;
  asi_desc: string;
  size: 'Small' | 'Medium';
  speed: number;
  traits: { id: string; name: string; description: string }[];
  languages: string; // Comma-separated
}

export const createEmptyHomebrewRace = (): HomebrewRace => ({
  id: String(Date.now() + Math.random()),
  name: '',
  asi_desc: 'e.g., Increase one score by 2 and another by 1.',
  size: 'Medium',
  speed: 30,
  traits: [],
  languages: 'Common',
});

export interface HomebrewSpell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  class: string[]; // Array of class names
}

export const createEmptyHomebrewSpell = (): HomebrewSpell => ({
    id: String(Date.now() + Math.random()),
    name: '',
    level: 0,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Self',
    components: 'V, S',
    duration: 'Instantaneous',
    description: '',
    class: [],
});

// New Homebrew Types
export interface ClassFeature {
  id: string;
  level: number;
  name: string;
  description: string;
  uses?: {
    max: number | 'level' | 'cha' | 'wis' | 'int' | 'str' | 'dex' | 'con' | 'prof';
  };
  recharge?: 'short' | 'long';
}

export interface HomebrewSubclass {
  id: string;
  name: string;
  features: ClassFeature[];
}

export interface HomebrewOfficialSubclass {
  id: string;
  name: string;
  baseClassName: string;
  features: ClassFeature[];
}

export const createEmptyHomebrewOfficialSubclass = (): HomebrewOfficialSubclass => ({
  id: String(Date.now() + Math.random()),
  name: '',
  baseClassName: 'Fighter',
  features: [],
});


export interface HomebrewClass {
  id: string;
  name: string;
  hitDie: 6 | 8 | 10 | 12;
  armorProficiencies: Array<'light' | 'medium' | 'heavy' | 'shields'>;
  weaponProficiencies: Array<'simple' | 'martial'>;
  skillProficiencies: {
      count: number;
      options: 'any' | string[];
  };
  savingThrowProficiencies: Array<keyof Character['abilityScores']>;
  subclassLevel: number;
  spellcastingAbility: 'none' | keyof Omit<Character['abilityScores'], 'str' | 'dex' | 'con'>;
  spellcastingProgression: 'none' | 'full' | 'half' | 'third' | 'pact';
  features: ClassFeature[];
  subclasses: HomebrewSubclass[];
}

export const createEmptyClassFeature = (): ClassFeature => ({
    id: String(Date.now() + Math.random()),
    level: 1,
    name: '',
    description: '',
});

export const createEmptySubclass = (): HomebrewSubclass => ({
    id: String(Date.now() + Math.random()),
    name: 'New Subclass',
    features: [],
});

export const createEmptyHomebrewClass = (): HomebrewClass => ({
    id: String(Date.now() + Math.random()),
    name: '',
    hitDie: 8,
    armorProficiencies: [],
    weaponProficiencies: [],
    skillProficiencies: { count: 2, options: 'any' },
    savingThrowProficiencies: [],
    subclassLevel: 3,
    spellcastingAbility: 'none',
    spellcastingProgression: 'none',
    features: [],
    subclasses: [],
});

export interface HomebrewRule {
  id: string;
  title: string;
  content: string;
}

export const createEmptyHomebrewRule = (): HomebrewRule => ({
  id: String(Date.now() + Math.random()),
  title: '',
  content: '',
});

export type NoteType = 'general' | 'quest' | 'location' | 'npc' | 'item' | 'todo';
export type NoteStatus = 'active' | 'completed' | 'archived';

export interface CampaignNote {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  status: NoteStatus;
  tags: string[];
  createdAt: number;
  lastModified: number;
  linkedNoteIds?: string[];
  dmSecrets?: string;
}

export const createEmptyCampaignNote = (): CampaignNote => ({
  id: String(Date.now() + Math.random()),
  title: 'New Note',
  content: '',
  type: 'general',
  status: 'active',
  tags: [],
  createdAt: Date.now(),
  lastModified: Date.now(),
  linkedNoteIds: [],
  dmSecrets: '',
});

export interface TimelineEvent {
  id: string;
  day: number;
  description: string;
  createdAt: number;
}

export const createEmptyTimelineEvent = (): TimelineEvent => ({
  id: String(Date.now() + Math.random()),
  day: 1,
  description: '',
  createdAt: Date.now(),
});

export interface DMNotes {
  characterId: string;
  proficiencyBonus: number;
  proficientSkills: string[];
  proficientSavingThrows: string[];
  conditions: string[];
  knownLanguages: string[];
  backstoryDetails: string;
  goalsSecrets: string;
}

export const createEmptyDMNotes = (characterId: string): DMNotes => ({
  characterId,
  proficiencyBonus: 2,
  proficientSkills: [],
  proficientSavingThrows: [],
  conditions: [],
  knownLanguages: ['Common'],
  backstoryDetails: '',
  goalsSecrets: '',
});

export interface NPC {
  id: string;
  name: string;
  race: string;
  classRole: string;
  alignment: string;
  image: string; // base64
  personalityQuirks: string;
  motivationsGoals: string;
  backstorySummary: string;
  relationships: string;
  hp: number;
  maxHp: number;
  ac: number;
  speed: number;
  mb: number; // Mana / Resource
  maxMb: number;
  abilityScores: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  specialAbilities: string;
  inventory: string;
}

export const createEmptyNPC = (id: string): NPC => ({
  id,
  name: '',
  race: '',
  classRole: '',
  alignment: 'True Neutral',
  image: '',
  personalityQuirks: '',
  motivationsGoals: '',
  backstorySummary: '',
  relationships: '',
  hp: 10,
  maxHp: 10,
  ac: 10,
  speed: 30,
  mb: 0,
  maxMb: 0,
  abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  specialAbilities: '',
  inventory: '',
});

export interface MonsterTrait {
  id: string;
  name: string;
  description: string;
}

export interface Monster {
  id: string;
  name: string;
  image: string; // base64
  size: string;
  type: string;
  alignment: string;
  ac: number;
  hp: string; // e.g., "136 (16d10 + 48)"
  speed: string; // e.g., "30 ft., fly 60 ft."
  abilityScores: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills: MonsterTrait[];
  savingThrows: MonsterTrait[];
  damageVulnerabilities: string;
  damageResistances: string;
  damageImmunities: string;
  conditionImmunities: string;
  senses: string;
  languages: string;
  cr: string; // Challenge Rating
  xp: number;
  specialAbilities: MonsterTrait[];
  attacks: MonsterTrait[];
  legendaryActionsDescription: string;
  legendaryActions: MonsterTrait[];
}

export const createEmptyMonster = (id: string): Monster => ({
  id,
  name: '',
  image: '',
  size: 'Medium',
  type: 'Beast',
  alignment: 'Unaligned',
  ac: 10,
  hp: '10 (3d6)',
  speed: '30 ft.',
  abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skills: [],
  savingThrows: [],
  damageVulnerabilities: '',
  damageResistances: '',
  damageImmunities: '',
  conditionImmunities: '',
  senses: 'passive Perception 10',
  languages: '',
  cr: '1/4',
  xp: 50,
  specialAbilities: [],
  attacks: [],
  legendaryActionsDescription: '',
  legendaryActions: [],
});
