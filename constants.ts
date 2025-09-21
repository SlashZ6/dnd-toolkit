import type { Character } from './types';
import { DND_RACES_DATA } from './data/racesData';

export const DND_RACES = Object.keys(DND_RACES_DATA).sort();

export const DND_CLASSES = [
  "Artificer",
  "Barbarian",
  "Bard",
  "Blood Hunter",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

export const DND_SKILLS = [
    "Acrobatics", // DEX
    "Animal Handling", // WIS
    "Arcana", // INT
    "Athletics", // STR
    "Deception", // CHA
    "History", // INT
    "Insight", // WIS
    "Intimidation", // CHA
    "Investigation", // INT
    "Medicine", // WIS
    "Nature", // INT
    "Perception", // WIS
    "Performance", // CHA
    "Persuasion", // CHA
    "Religion", // INT
    "Sleight of Hand", // DEX
    "Stealth", // DEX
    "Survival", // WIS
];

export const SKILL_ABILITY_MAP: { [key: string]: keyof Character['abilityScores'] } = {
    "Acrobatics": "dex",
    "Animal Handling": "wis",
    "Arcana": "int",
    "Athletics": "str",
    "Deception": "cha",
    "History": "int",
    "Insight": "wis",
    "Intimidation": "cha",
    "Investigation": "int",
    "Medicine": "wis",
    "Nature": "int",
    "Perception": "wis",
    "Performance": "cha",
    "Persuasion": "cha",
    "Religion": "int",
    "Sleight of Hand": "dex",
    "Stealth": "dex",
    "Survival": "wis",
}