
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
}

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
});

export interface CampaignNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  lastModified: number;
}

export const createEmptyCampaignNote = (): CampaignNote => ({
  id: String(Date.now() + Math.random()),
  title: 'New Note',
  content: '',
  createdAt: Date.now(),
  lastModified: Date.now(),
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
