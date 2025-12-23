
export type AbilityScores = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

export type CrestData = {
  shape: string;
  symbol: string;
  primaryColor: string;
  secondaryColor: string;
  symbolColor: string;
  division: 'none' | 'perPale' | 'perFess' | 'perBend';
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  source: 'race' | 'class' | 'background' | 'feat' | 'manual' | 'automatic';
  uses?: {
    max: number;
    current: number;
  };
  recharge?: 'short' | 'long';
};

export type InventoryItem = {
  id: string;
  name: string;
  weight: number;
  quantity: number;
  category?: string;
  cost?: string;
  properties?: string[];
  description?: string;
  equipped?: boolean;
};

export type CompanionAction = {
  id: string;
  name: string;
  description: string;
};

export type Companion = {
  id: string;
  name: string;
  type: string;
  ac: number;
  hp: number; // legacy
  maxHp: number;
  currentHp: number;
  speed: string;
  abilityScores: AbilityScores;
  actions: CompanionAction[];
  notes: string;
};

export type SheetSection = 'features' | 'spells' | 'inventory' | 'actions' | 'notes' | 'companions';

export type Character = {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  subclass: string;
  level: number;
  alignment: string;
  background: string;
  appearanceImage?: string;
  crest: CrestData;
  abilityScores: AbilityScores;
  skillProficiencies: string[];
  features: Feature[];
  inventory: InventoryItem[];
  spells: string[];
  spellSlots: {
    max: number[];
    current: number[];
  };
  maxHp: number;
  currentHp: number;
  tempHp: number;
  ac: number;
  speed: number;
  initiative: number;
  passivePerception: number;
  proficiencyBonus: number;
  currency: number;
  notes: string;
  age: string;
  bloodline: string;
  companions: Companion[];
  sheetSectionOrder: SheetSection[];
  campaignId?: string;
};

export type CharacterDetails = {
    name: string;
};

export type Race = {
    name: string;
    description: string;
};

export type Class = {
    name: string;
    description: string;
};

export type Spell = {
    name: string;
    level: number;
    school: string;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    description: string;
    class: string[];
    source?: string;
};

export type HomebrewRace = {
    id: string;
    name: string;
    size: string;
    speed: number;
    languages: string;
    asi_desc: string;
    traits: Feature[];
};

export type HomebrewSpell = Spell & { id: string };

export type ClassFeature = {
    id: string;
    level: number;
    name: string;
    description: string;
    uses?: { max: number | string };
    recharge?: 'short' | 'long';
};

export type HomebrewSubclass = {
    id: string;
    name: string;
    features: ClassFeature[];
};

export type HomebrewClass = {
    id: string;
    name: string;
    hitDie: number;
    subclassLevel: number;
    armorProficiencies: string[];
    weaponProficiencies: string[];
    savingThrowProficiencies: string[];
    spellcastingAbility: 'none' | 'int' | 'wis' | 'cha';
    spellcastingProgression: 'none' | 'full' | 'half' | 'third' | 'pact';
    features: ClassFeature[];
    subclasses: HomebrewSubclass[];
};

export type HomebrewOfficialSubclass = {
    id: string;
    name: string;
    baseClassName: string;
    features: ClassFeature[];
};

export type HomebrewRule = {
    id: string;
    title: string;
    content: string;
};

export type ConnectedUser = {
    id: string;
    name: string;
    abilityScores: AbilityScores;
    crest?: CrestData;
    notes?: string;
    _peerId?: string;
};

export type ChatMessage = {
    id: string;
    user: string;
    timestamp: number;
    type: 'chat' | 'stat' | 'action' | 'roll_share' | 'npc_share' | 'beast_share' | 'note_share' | 'timeline_event_share' | 'session_control' | 'presence' | 'full_user_list' | 'ready_response' | 'inspiration_claim' | 'canvas_update';
    payload: any;
    targetId?: string;
};

export type ContentPayload = {
    message?: string;
    ooc?: boolean;
    isFleeting?: boolean;
    asNPC?: { name: string };
    statName?: string;
    statValue?: string | number;
    characterName?: string;
    action?: string;
    roll?: { title: string; total: number; formula: string; isCrit?: boolean; isFumble?: boolean };
    npc?: { name: string; race: string; classRole: string; alignment: string; backstorySummary?: string };
    beast?: { name: string; size: string; type: string; alignment: string; hp: number; ac: number };
    note?: { title: string; content: string };
    event?: { day: number; description: string };
    control?: { type: string; value?: any; id?: string; x?: number; y?: number; spotlightData?: any; readyCheckId?: string };
    readyResponse?: { checkId: string; userId: string; isReady: boolean };
    canvasState?: any;
    type?: string; 
    user?: ConnectedUser; 
};

export type PresencePayload = {
    type: 'join' | 'leave' | 'update';
    user: ConnectedUser;
};

export type DMNotes = {
    characterId: string;
    proficiencyBonus: number;
    proficientSkills: string[];
    proficientSavingThrows: string[];
    conditions: string[];
    knownLanguages: string[];
    backstoryDetails: string;
    goalsSecrets: string;
    inspiration: number;
};

export type NPC = {
    id: string;
    name: string;
    race: string;
    classRole: string;
    alignment: string;
    image: string;
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    mb: number;
    maxMb: number;
    abilityScores: AbilityScores;
    personalityQuirks: string;
    motivationsGoals: string;
    backstorySummary: string;
    relationships: string;
    specialAbilities: string;
    inventory: string;
};

export type MonsterTrait = {
    id: string;
    name: string;
    description: string;
};

export type Monster = {
    id: string;
    name: string;
    size: string;
    type: string;
    alignment: string;
    ac: number;
    hp: number;
    speed: string;
    abilityScores: AbilityScores;
    savingThrows: MonsterTrait[];
    skills: MonsterTrait[];
    damageVulnerabilities: string;
    damageResistances: string;
    damageImmunities: string;
    conditionImmunities: string;
    senses: string;
    languages: string;
    cr: string;
    xp: number;
    specialAbilities: MonsterTrait[];
    attacks: MonsterTrait[];
    legendaryActions: MonsterTrait[];
    legendaryActionsDescription: string;
    image: string;
};

export type NoteType = 'general' | 'quest' | 'location' | 'npc' | 'item' | 'todo';
export type NoteStatus = 'active' | 'completed' | 'archived';

export type CampaignNote = {
    id: string;
    title: string;
    content: string;
    type: NoteType;
    status: NoteStatus;
    tags: string[];
    lastModified: number;
    linkedNoteIds: string[];
    dmSecrets: string;
};

export type TimelineEvent = {
    id: string;
    day: number;
    description: string;
    createdAt: number;
};

export type CanvasToken = {
    id: string;
    type: 'character' | 'npc' | 'monster';
    referenceId: string;
    x: number;
    y: number;
    size: number;
    label: string;
    color: string;
    image?: string;
};

export type CanvasDrawing = {
    id: string;
    type: 'path' | 'rect' | 'circle' | 'wall';
    points: { x: number; y: number }[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
    color: string;
    strokeWidth: number;
    fill?: string;
    assetType?: string;
};

export type CanvasAsset = {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    imageUrl?: string;
    label?: string;
};

export type SavedMap = {
    id: string;
    name: string;
    timestamp: number;
    tokens: CanvasToken[];
    drawings: CanvasDrawing[];
    assets: CanvasAsset[];
    weather: string;
    view: { x: number, y: number, scale: number };
};

export type Theme = 'slate' | 'parchment' | 'feywild' | 'darkness' | 'crimson';

// Factories
export const createEmptyCharacter = (id: string): Character => ({
    id,
    name: '',
    race: '',
    characterClass: '',
    subclass: '',
    level: 1,
    alignment: '',
    background: '',
    crest: { shape: 'shield1', symbol: 'star', primaryColor: '#475569', secondaryColor: '#e2e8f0', symbolColor: '#ffffff', division: 'none' },
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skillProficiencies: [],
    features: [],
    inventory: [],
    spells: [],
    spellSlots: { max: [], current: [] },
    maxHp: 10,
    currentHp: 10,
    tempHp: 0,
    ac: 10,
    speed: 30,
    initiative: 0,
    passivePerception: 10,
    proficiencyBonus: 2,
    currency: 0,
    notes: '',
    age: '',
    bloodline: '',
    companions: [],
    sheetSectionOrder: ['features', 'spells', 'inventory', 'actions', 'notes', 'companions'],
});

export const createEmptyCompanion = (id: string): Companion => ({
    id,
    name: '',
    type: '',
    ac: 10,
    hp: 0,
    maxHp: 10,
    currentHp: 10,
    speed: '',
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    actions: [],
    notes: ''
});

export const createEmptyDMNotes = (characterId: string): DMNotes => ({
    characterId,
    proficiencyBonus: 2,
    proficientSkills: [],
    proficientSavingThrows: [],
    conditions: [],
    knownLanguages: [],
    backstoryDetails: '',
    goalsSecrets: '',
    inspiration: 0,
});

export const createEmptyNPC = (id: string): NPC => ({
    id,
    name: '',
    race: '',
    classRole: '',
    alignment: '',
    image: '',
    hp: 10,
    maxHp: 10,
    ac: 10,
    speed: 30,
    mb: 0,
    maxMb: 0,
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    personalityQuirks: '',
    motivationsGoals: '',
    backstorySummary: '',
    relationships: '',
    specialAbilities: '',
    inventory: '',
});

export const createEmptyMonster = (id: string): Monster => ({
    id,
    name: '',
    size: 'Medium',
    type: '',
    alignment: '',
    ac: 10,
    hp: 10,
    speed: '30 ft.',
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    savingThrows: [],
    skills: [],
    damageVulnerabilities: '',
    damageResistances: '',
    damageImmunities: '',
    conditionImmunities: '',
    senses: '',
    languages: '',
    cr: '0',
    xp: 0,
    specialAbilities: [],
    attacks: [],
    legendaryActions: [],
    legendaryActionsDescription: '',
    image: '',
});

export const createEmptyCampaignNote = (): CampaignNote => ({
    id: String(Date.now()),
    title: '',
    content: '',
    type: 'general',
    status: 'active',
    tags: [],
    lastModified: Date.now(),
    linkedNoteIds: [],
    dmSecrets: ''
});

export const createEmptyTimelineEvent = (): TimelineEvent => ({
    id: String(Date.now()),
    day: 1,
    description: '',
    createdAt: Date.now()
});

export const createEmptyHomebrewRace = (): HomebrewRace => ({
    id: String(Date.now()),
    name: '',
    size: 'Medium',
    speed: 30,
    languages: '',
    asi_desc: '',
    traits: []
});

export const createEmptyHomebrewSpell = (): HomebrewSpell => ({
    id: String(Date.now()),
    name: '',
    level: 0,
    school: '',
    castingTime: '',
    range: '',
    components: '',
    duration: '',
    description: '',
    class: []
});

export const createEmptyClassFeature = (): ClassFeature => ({
    id: String(Date.now()),
    level: 1,
    name: '',
    description: ''
});

export const createEmptySubclass = (): HomebrewSubclass => ({
    id: String(Date.now()),
    name: '',
    features: []
});

export const createEmptyHomebrewClass = (): HomebrewClass => ({
    id: String(Date.now()),
    name: '',
    hitDie: 8,
    subclassLevel: 3,
    armorProficiencies: [],
    weaponProficiencies: [],
    savingThrowProficiencies: [],
    spellcastingAbility: 'none',
    spellcastingProgression: 'none',
    features: [],
    subclasses: []
});

export const createEmptyHomebrewOfficialSubclass = (): HomebrewOfficialSubclass => ({
    id: String(Date.now()),
    name: '',
    baseClassName: '',
    features: []
});

export const createEmptyHomebrewRule = (): HomebrewRule => ({
    id: String(Date.now()),
    title: '',
    content: ''
});
