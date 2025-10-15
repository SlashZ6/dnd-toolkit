
import { Character } from '../types';

export interface RaceData {
  name: string;
  bonuses: Partial<Character['abilityScores']>;
  asi_desc?: string; // For flexible ASI description
  description?: string; // For flavor text
  size?: 'Small' | 'Medium';
  speed?: number;
  traits?: { name: string; description: string }[];
  languages?: string[];
}

// Based on various official D&D 5e sourcebooks.
// Races with flexible ability scores have an asi_desc property.
export const DND_RACES_DATA: { [key: string]: RaceData } = {
  "Aarakocra": { 
    name: "Aarakocra", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Sequestered in high mountains atop tall trees, the Aarakocra, sometimes called birdfolk, evoke both fear and wonder.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Flight", description: "You have a flying speed equal to your walking speed. To use this speed, you can’t be wearing medium or heavy armor." },
      { name: "Talons", description: "You are proficient with your unarmed strikes, which deal 1d6 slashing damage on a hit." }
    ],
    languages: ["Common", "Aarakocra", "Auran"]
  },
  "Aasimar": { 
    name: "Aasimar",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Aasimar are placed in the world to serve as guardians of law and good, bearing a celestial light within their souls.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Celestial Resistance", description: "You have resistance to necrotic damage and radiant damage." },
        { name: "Healing Hands", description: "As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. You can use this trait a number of times equal to your proficiency bonus per long rest." },
        { name: "Light Bearer", description: "You know the Light cantrip. Charisma is your spellcasting ability for it." },
        { name: "Celestial Revelation", description: "At 3rd level, you can use a bonus action to unleash your divine energy. Choose Necrotic Shroud, Radiant Consumption, or Radiant Soul. This transformation lasts for 1 minute or until you end it." }
    ],
    languages: ["Common", "Celestial"]
  },
  "Aetherborn": {
    name: "Aetherborn",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Aetherborn are a race of beings made of aether. They are born of the aether, and they return to the aether when they die.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Born of Aether", description: "You have resistance to poison damage. You don't need to breathe, and you have advantage on saving throws against being poisoned." },
      { name: "Menacing", description: "You gain proficiency in the Intimidation skill." }
    ],
    languages: ["Common"]
  },
  "Astral Elf": {
    name: "Astral Elf",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Long-lived denizens of the Astral Plane, Astral Elves are familiar with the multiverse's wonders and secrets.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Keen Senses", description: "You have proficiency in the Perception skill." },
      { name: "Astral Trance", description: "You don’t need to sleep and are immune to magical sleep. You can finish a long rest in 4 hours if you spend those hours in a trancelike state." },
      { name: "Starlight Step", description: "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. You can use this a number of times equal to your proficiency bonus per long rest." }
    ],
    languages: ["Common", "Elvish"]
  },
  "Autognome": {
    name: "Autognome",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Autognomes are mechanical beings built by rock gnomes, possessing a spark of free will and a sturdy, metallic form.",
    size: 'Small',
    speed: 30,
    traits: [
      { name: "Constructed Resilience", description: "You are a construct. You have resistance to poison damage, immunity to disease, and advantage on saves against being paralyzed or poisoned. You don't need to eat, drink, or breathe." },
      { name: "Armored Casing", description: "Your body has built-in defensive layers. Your base AC is 13 + your Dexterity modifier." },
      { name: "Built for Success", description: "You can add a d4 to any attack roll, ability check, or saving throw you make. You can use this a number of times equal to your proficiency bonus per long rest." },
      { name: "Mechanical Nature", description: "You don’t need to sleep and magic can’t put you to sleep. You can finish a long rest in 6 hours of inactivity." }
    ],
    languages: ["Common", "Gnomish"]
  },
  "Aven": {
    name: "Aven",
    bonuses: { dex: 2 },
    asi_desc: "Your Dexterity score increases by 2.",
    description: "Aven are avian humanoids with the heads of ibises or hawks. They are known for their wisdom and their skill as warriors.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Wings", description: "You have a flying speed of 30 feet. To use this speed, you can't be wearing medium or heavy armor." }
    ],
    languages: ["Common", "Aven"]
  },
  "Bugbear": { 
    name: "Bugbear", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Bugbears are brutish goblinoids who delight in terrorizing their foes. Despite their intimidating appearance, they are surprisingly stealthy.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Long-Limbed", description: "When you make a melee attack on your turn, your reach for it is 5 feet greater than normal." },
      { name: "Powerful Build", description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift." },
      { name: "Sneaky", description: "You are proficient in the Stealth skill. You can move through and stop in a space large enough for a Small creature without squeezing." },
      { name: "Surprise Attack", description: "If you hit a creature with an attack roll, the creature takes an extra 2d6 damage if it hasn't taken a turn yet in the current combat." }
    ],
    languages: ["Common", "Goblin"]
  },
  "Centaur": { 
    name: "Centaur", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Centaurs are fey creatures with the upper body of a humanoid and the lower body of a horse. They are proud and noble, and revere nature.",
    size: 'Medium',
    speed: 40,
    traits: [
      { name: "Fey", description: "Your creature type is fey, rather than humanoid." },
      { name: "Charge", description: "If you move at least 30 feet in a straight line toward a target and then hit it with a melee weapon attack on the same turn, you can immediately follow that attack with a bonus action, making one attack with your hooves." },
      { name: "Hooves", description: "Your hooves are a natural melee weapon, which you can use to make unarmed strikes. If you hit with them, you deal bludgeoning damage equal to 1d6 + your Strength modifier." },
      { name: "Equine Build", description: "You count as one size larger when determining your carrying capacity. Also, any climb that requires hands and feet is especially difficult for you." }
    ],
    languages: ["Common", "Sylvan"]
  },
  "Changeling": { 
    name: "Changeling", 
    bonuses: {}, 
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Changelings are subtle shapeshifters capable of disguising their appearance. They can change their physical form with a thought.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Shapechanger", description: "As an action, you can change your appearance and your voice. You determine the specifics of the changes. You can't duplicate the appearance of a creature you've never seen, and you revert to your true form if you die." },
      { name: "Changeling Instincts", description: "You gain proficiency with two of the following skills of your choice: Deception, Insight, Intimidation, and Persuasion." }
    ],
    languages: ["Common", "Two other languages"]
  },
  "Custom Lineage": {
    name: "Custom Lineage",
    bonuses: {},
    asi_desc: "Increase one ability score of your choice by 2.",
    description: "Build a unique lineage with a custom set of abilities. You might be a mix of ancestries, or something entirely new.",
    size: 'Medium', // Or Small
    speed: 30,
    traits: [
      { name: "Feat", description: "You gain one feat of your choice for which you qualify." },
      { name: "Variable Trait", description: "You gain either darkvision with a range of 60 feet or proficiency in one skill of your choice." }
    ],
    languages: ["Common", "One extra language of your choice"]
  },
  "Dhampir": {
    name: "Dhampir",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Poised between the worlds of the living and the dead, dhampirs retain their grip on life yet are endlessly tested by vicious hungers.",
    size: 'Medium', // or small
    speed: 35,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light." },
      { name: "Deathless Nature", description: "You don't need to breathe." },
      { name: "Spider Climb", description: "You have a climbing speed equal to your walking speed. At 3rd level, you can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free." },
      { name: "Vampiric Bite", description: "Your fanged bite is a natural weapon which you can use to make unarmed strikes. You can empower yourself after biting a creature, gaining a bonus to the next attack roll or ability check." }
    ],
    languages: ["Common", "One other language"]
  },
  "Dragonborn": { 
    name: "Dragonborn", 
    bonuses: { str: 2, cha: 1 },
    description: "Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Draconic Ancestry", description: "You have a dragon ancestor, granting you a specific damage resistance and a powerful breath weapon." },
      { name: "Breath Weapon", description: "You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation." },
      { name: "Damage Resistance", description: "You have resistance to the damage type associated with your draconic ancestry." }
    ],
    languages: ["Common", "Draconic"]
  },
  "Dwarf (Hill)": { 
    name: "Dwarf (Hill)", 
    bonuses: { con: 2, wis: 1 },
    description: "As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.",
    size: 'Medium',
    speed: 25,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Dwarven Resilience", description: "You have advantage on saving throws against poison and resistance to poison damage." },
        { name: "Dwarven Combat Training", description: "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer." },
        { name: "Tool Proficiency", description: "You gain proficiency with smith's tools, brewer's supplies, or mason's tools." },
        { name: "Stonecunning", description: "When making an Intelligence (History) check related to stonework, you add double your proficiency bonus." },
        { name: "Dwarven Toughness", description: "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level." }
    ],
    languages: ["Common", "Dwarvish"]
  },
  "Dwarf (Mountain)": { 
    name: "Dwarf (Mountain)", 
    bonuses: { con: 2, str: 2 },
    description: "As a mountain dwarf, you're strong and hardy, accustomed to a difficult life in rugged terrain.",
    size: 'Medium',
    speed: 25,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Dwarven Resilience", description: "You have advantage on saving throws against poison and resistance to poison damage." },
        { name: "Dwarven Combat Training", description: "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer." },
        { name: "Tool Proficiency", description: "You gain proficiency with smith's tools, brewer's supplies, or mason's tools." },
        { name: "Stonecunning", description: "When making an Intelligence (History) check related to stonework, you add double your proficiency bonus." },
        { name: "Dwarven Armor Training", description: "You have proficiency with light and medium armor." }
    ],
    languages: ["Common", "Dwarvish"]
  },
  "Duergar": {
    name: "Dwarf (Duergar)", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "The duergar, or gray dwarves, are grim, subterranean-dwelling dwarves who were once enslaved by mind flayers.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Superior Darkvision", description: "Your darkvision has a radius of 120 feet." },
      { name: "Duergar Resilience", description: "You have advantage on saving throws against illusions and against being charmed or paralyzed." },
      { name: "Psionic Fortitude", description: "You have resistance to poison damage." },
      { name: "Duergar Magic", description: "At 3rd level, you can cast Enlarge/Reduce on yourself. At 5th level, you can cast Invisibility on yourself. Intelligence is your spellcasting ability for these. You can cast them once per long rest." },
      { name: "Sunlight Sensitivity", description: "You have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target, or whatever you are trying to perceive is in direct sunlight." }
    ],
    languages: ["Common", "Dwarvish", "Undercommon"]
  },
  "Eladrin": {
    name: "Elf (Eladrin)", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Eladrin are elves of the Feywild, a realm of beauty, unpredictable emotion, and boundless magic. An eladrin is associated with one of the four seasons and has coloration reminiscent of that season.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Trance", description: "You don't need to sleep. Instead, you meditate deeply for 4 hours a day." },
      { name: "Keen Senses", description: "You have proficiency in the Perception skill." },
      { name: "Fey Step", description: "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. You can use it a number of times equal to your proficiency bonus per long rest." }
    ],
    languages: ["Common", "Elvish"]
  },
  "Elf (High)": { 
    name: "Elf (High)", 
    bonuses: { dex: 2, int: 1 },
    description: "As a high elf, you have a keen mind and a mastery of at least the basics of magic.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
        { name: "Trance", description: "You don't need to sleep. Instead, you meditate deeply for 4 hours a day." },
        { name: "Keen Senses", description: "You have proficiency in the Perception skill." },
        { name: "Elf Weapon Training", description: "You have proficiency with the longsword, shortsword, shortbow, and longbow." },
        { name: "Cantrip", description: "You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it." }
    ],
    languages: ["Common", "Elvish", "One extra language of your choice"]
  },
  "Elf (Sea)": {
    name: "Elf (Sea)", 
    bonuses: { dex: 2, con: 1 },
    description: "Sea elves fell in love with the wild beauty of the ocean in the earliest days of the multiverse. They live in small, hidden communities in the sea.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Child of the Sea", description: "You have a swimming speed of 30 feet, and you can breathe air and water." },
      { name: "Friend of the Sea", description: "Using gestures and sounds, you can communicate simple ideas with any beast that has an innate swimming speed." }
    ],
    languages: ["Common", "Elvish", "Aquan"]
  },
  "Elf (Shadar-kai)": {
    name: "Elf (Shadar-kai)", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Shadar-kai are the elves of the Shadowfell, a realm of decay and sorrow. They are grim and nihilistic, but also fiercely loyal.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Necrotic Resistance", description: "You have resistance to necrotic damage." },
      { name: "Blessing of the Raven Queen", description: "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. You can use this a number of times equal to your proficiency bonus per long rest." },
      { name: "Keen Senses", description: "You have proficiency in the Perception skill." },
      { name: "Trance", description: "You don't need to sleep and magic can't put you to sleep. You can finish a long rest in 4 hours." }
    ],
    languages: ["Common", "Elvish"]
  },
  "Elf (Wood)": { 
    name: "Elf (Wood)", 
    bonuses: { dex: 2, wis: 1 },
    description: "As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests.",
    size: 'Medium',
    speed: 35,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
        { name: "Trance", description: "You don't need to sleep. Instead, you meditate deeply for 4 hours a day." },
        { name: "Keen Senses", description: "You have proficiency in the Perception skill." },
        { name: "Elf Weapon Training", description: "You have proficiency with the longsword, shortsword, shortbow, and longbow." },
        { name: "Mask of the Wild", description: "You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena." }
    ],
    languages: ["Common", "Elvish"]
  },
  "Fairy": { 
    name: "Fairy",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "The Feywild is home to many fantastic peoples, including fairies. Fairies are a wee folk, but not so tiny as their pixie and sprite friends.",
    size: 'Small',
    speed: 30,
    traits: [
      { name: "Flight", description: "You have a flying speed equal to your walking speed. To use this speed, you can't be wearing medium or heavy armor." },
      { name: "Fairy Magic", description: "You know the Druidcraft cantrip. At 3rd level, you can cast Faerie Fire once per long rest. At 5th level, you can cast Enlarge/Reduce once per long rest." }
    ],
    languages: ["Common", "Sylvan"]
  },
  "Firbolg": { 
    name: "Firbolg", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Firbolg tribes cloister in remote forest strongholds, preferring to spend their days in quiet harmony with the woods. When provoked, firbolgs demonstrate formidable strength.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Firbolg Magic", description: "You can cast Detect Magic and Disguise Self with this trait. You can cast each once per long rest." },
      { name: "Hidden Step", description: "As a bonus action, you can magically turn invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. You can use this a number of times equal to your proficiency bonus per long rest." },
      { name: "Powerful Build", description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift." },
      { name: "Speech of Beast and Leaf", description: "You have the ability to communicate in a limited manner with beasts and plants." }
    ],
    languages: ["Common", "Elvish", "Giant"]
  },
  "Genasi (Air)": { 
    name: "Genasi (Air)",
    bonuses: { con: 2, dex: 1 },
    description: "As an air genasi, you are descended from the djinn. As changeable as the weather, your moods shift from calm to wild and violent with little warning.",
    size: 'Medium',
    speed: 35,
    traits: [
      { name: "Unending Breath", description: "You can hold your breath indefinitely while you’re not incapacitated." },
      { name: "Mingle with the Wind", description: "You can cast the Levitate spell once per long rest, requiring no material components." }
    ],
    languages: ["Common", "Primordial"]
  },
  "Genasi (Earth)": { 
    name: "Genasi (Earth)", 
    bonuses: { con: 2, str: 1 },
    description: "As an earth genasi, you are descended from the cruel and greedy dao, though you aren't necessarily evil. You are patient, stubborn, and thoughtful.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Earth Walk", description: "You can move across difficult terrain made of earth or stone without expending extra movement." },
      { name: "Merge with Stone", description: "You can cast the Pass without Trace spell once per long rest, requiring no material components." }
    ],
    languages: ["Common", "Primordial"]
  },
  "Genasi (Fire)": { 
    name: "Genasi (Fire)", 
    bonuses: { con: 2, int: 1 },
    description: "As a fire genasi, you have inherited the volatile mood and keen mind of the efreet. You tend toward impatience and making snap judgments.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Fire Resistance", description: "You have resistance to fire damage." },
      { name: "Reach to the Blaze", description: "You know the Produce Flame cantrip. At 3rd level, you can cast Burning Hands once per long rest." }
    ],
    languages: ["Common", "Primordial"]
  },
  "Genasi (Water)": {
    name: "Genasi (Water)", 
    bonuses: { con: 2, wis: 1 },
    description: "As a water genasi, you are descended from the marids. You are patient and independent, preferring to go your own way.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Acid Resistance", description: "You have resistance to acid damage." },
      { name: "Amphibious", description: "You can breathe air and water." },
      { name: "Swim", description: "You have a swimming speed of 30 feet." },
      { name: "Call to the Wave", description: "You know the Shape Water cantrip. At 3rd level, you can cast Create or Destroy Water once per long rest." }
    ],
    languages: ["Common", "Primordial"]
  },
  "Giff": {
    name: "Giff",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Giff are hippo-headed humanoids of impressive size who are known for their love of firearms and explosives.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Astral Spark", description: "You can add your proficiency bonus to the damage of your attacks. You can deal this extra force damage to one creature you hit with an attack, once per turn." },
        { name: "Firearms Mastery", description: "You have proficiency with firearms, and you ignore the loading property of firearms." },
        { name: "Hippo Build", description: "You have advantage on Strength-based ability checks and Strength saving throws. You also count as one size larger for determining your carrying capacity." }
    ],
    languages: ["Common", "One other language"]
  },
  "Githyanki": { 
    name: "Githyanki", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Githyanki are peerless warriors from the Astral Plane, known for their psionic abilities and their red dragon mounts.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Astral Knowledge", description: "You gain proficiency in one skill and one weapon or tool of your choice. You can change these proficiencies after a long rest." },
      { name: "Githyanki Psionics", description: "You know the Mage Hand cantrip. At 3rd level, you can cast Jump once per long rest. At 5th level, you can cast Misty Step once per long rest. Intelligence is your spellcasting ability for these." }
    ],
    languages: ["Common", "Gith"]
  },
  "Githzerai": { 
    name: "Githzerai", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Githzerai are focused ascetics and philosophers, who pursue lives of rigid order and discipline in the chaotic plane of Limbo.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Mental Discipline", description: "You have advantage on saving throws against the charmed and frightened conditions." },
      { name: "Githzerai Psionics", description: "You know the Mage Hand cantrip. At 3rd level, you can cast Shield once per long rest. At 5th level, you can cast Detect Thoughts once per long rest. Wisdom is your spellcasting ability for these." }
    ],
    languages: ["Common", "Gith"]
  },
  "Gnome (Deep)": {
    name: "Gnome (Deep)",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Also known as svirfneblin, deep gnomes are a cautious and crafty people, at home in the deepest caves of the Underdark.",
    size: 'Small',
    speed: 30,
    traits: [
      { name: "Superior Darkvision", description: "Your darkvision has a radius of 120 feet." },
      { name: "Gnome Cunning", description: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic." },
      { name: "Gift of the Svirfneblin", description: "At 3rd level, you can cast Disguise Self. At 5th level, you can cast Nondetection on yourself. You can cast these spells once per long rest." },
      { name: "Stone Camouflage", description: "You have advantage on Dexterity (Stealth) checks to hide in rocky terrain." }
    ],
    languages: ["Common", "Gnomish", "Undercommon"]
  },
  "Gnome (Forest)": { 
    name: "Gnome (Forest)", 
    bonuses: { int: 2, dex: 1 },
    description: "As a forest gnome, you have a natural knack for illusion and inherent quickness.",
    size: 'Small',
    speed: 25,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Gnome Cunning", description: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic." },
      { name: "Natural Illusionist", description: "You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it." },
      { name: "Speak with Small Beasts", description: "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts." }
    ],
    languages: ["Common", "Gnomish"]
  },
  "Gnome (Rock)": { 
    name: "Gnome (Rock)", 
    bonuses: { int: 2, con: 1 },
    description: "As a rock gnome, you have a natural inventiveness and hardiness beyond that of other gnomes.",
    size: 'Small',
    speed: 25,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Gnome Cunning", description: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic." },
      { name: "Artificer's Lore", description: "When you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus." },
      { name: "Tinker", description: "You can spend 1 hour and 10 gp of materials to construct a Tiny clockwork device (Clockwork Toy, Fire Starter, or Music Box). The device ceases to function after 24 hours." }
    ],
    languages: ["Common", "Gnomish"]
  },
  "Goblin": { 
    name: "Goblin", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Goblins are small, black-hearted humanoids that lair in caves and ruins. They are cowardly and vicious, but can be dangerous in large numbers.",
    size: 'Small',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Fury of the Small", description: "When you damage a creature with an attack or a spell and the creature's size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your proficiency bonus. You can use this a number of times equal to your proficiency bonus per long rest." },
      { name: "Nimble Escape", description: "You can take the Disengage or Hide action as a bonus action on each of your turns." }
    ],
    languages: ["Common", "Goblin"]
  },
  "Goliath": {
    name: "Goliath", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Goliaths are massive humanoids who dwell in the highest mountain peaks. They are competitive and driven, seeing life as a challenge to be met.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Natural Athlete", description: "You have proficiency in the Athletics skill." },
      { name: "Stone's Endurance", description: "As a reaction, when you take damage, you can roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. You can use this a number of times equal to your proficiency bonus per long rest." },
      { name: "Powerful Build", description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift." },
      { name: "Mountain Born", description: "You’re acclimated to high altitude, including elevations above 20,000 feet. You’re also naturally adapted to cold climates." }
    ],
    languages: ["Common", "Giant"]
  },
  "Grung": {
    name: "Grung",
    bonuses: { dex: 2, con: 1 },
    description: "Grung are aggressive frog-like humanoids found in jungles and swamps. They are fiercely territorial and see themselves as superior to all other creatures.",
    size: 'Small',
    speed: 25,
    traits: [
      { name: "Amphibious", description: "You can breathe air and water." },
      { name: "Poisonous Skin", description: "Any creature that grapples you or otherwise comes into direct contact with your skin must succeed on a DC 12 Constitution saving throw or become poisoned for 1 minute." },
      { name: "Poison Immunity", description: "You are immune to poison damage and the poisoned condition." },
      { name: "Standing Leap", description: "Your long jump is up to 25 feet and your high jump is up to 15 feet, with or without a running start." },
      { name: "Water Dependency", description: "If you fail to immerse yourself in water for at least 1 hour during a day, you suffer one level of exhaustion at the end of that day." }
    ],
    languages: ["Grung"]
  },
  "Hadozee": {
    name: "Hadozee",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Hadozee are simian humanoids with wing-like membranes they can use to glide. They are often found as sailors and deckhands on spelljamming ships.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Dexterous Feet", description: "As a bonus action, you can use your feet to manipulate an object, open or close a door or container, or make a Dexterity (Sleight of Hand) check." },
      { name: "Glide", description: "If you are not incapacitated or wearing heavy armor, you can extend your skin membranes and glide. When you fall, you can subtract up to 100 feet from the fall when calculating falling damage and move up to 2 feet horizontally for every 1 foot you fall." },
      { name: "Hadozee Dodge", description: "As a reaction when you take damage, you can reduce the damage by 1d6 + your proficiency bonus." }
    ],
    languages: ["Common", "One other language"]
  },
  "Half-Elf": { 
    name: "Half-Elf", 
    bonuses: { cha: 2 }, 
    asi_desc: "Increase two other ability scores of your choice by 1.",
    description: "Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
        { name: "Skill Versatility", description: "You gain proficiency in two skills of your choice." }
    ],
    languages: ["Common", "Elvish", "One extra language of your choice"]
  },
  "Half-Orc": { 
    name: "Half-Orc", 
    bonuses: { str: 2, con: 1 },
    description: "Half-orcs’ grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Menacing", description: "You gain proficiency in the Intimidation skill." },
        { name: "Relentless Endurance", description: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can’t use this feature again until you finish a long rest." },
        { name: "Savage Attacks", description: "When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice one additional time and add it to the extra damage of the critical hit." }
    ],
    languages: ["Common", "Orc"]
  },
  "Halfling (Lightfoot)": { 
    name: "Halfling (Lightfoot)", 
    bonuses: { dex: 2, cha: 1 },
    description: "Lightfoot halflings are more prone to wanderlust than other halflings, and often dwell alongside other races.",
    size: 'Small',
    speed: 25,
    traits: [
        { name: "Lucky", description: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll." },
        { name: "Brave", description: "You have advantage on saving throws against being frightened." },
        { name: "Halfling Nimbleness", description: "You can move through the space of any creature that is of a size larger than yours." },
        { name: "Naturally Stealthy", description: "You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you." }
    ],
    languages: ["Common", "Halfling"]
  },
  "Halfling (Stout)": { 
    name: "Halfling (Stout)", 
    bonuses: { dex: 2, con: 1 },
    description: "Stout halflings are hardier than average and have some resistance to poison.",
    size: 'Small',
    speed: 25,
    traits: [
        { name: "Lucky", description: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll." },
        { name: "Brave", description: "You have advantage on saving throws against being frightened." },
        { name: "Halfling Nimbleness", description: "You can move through the space of any creature that is of a size larger than yours." },
        { name: "Stout Resilience", description: "You have advantage on saving throws against poison, and you have resistance against poison damage." }
    ],
    languages: ["Common", "Halfling"]
  },
  "Harengon": {
    name: "Harengon", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Harengons are rabbit-like humanoids who embody the spirit of freedom and travel. They are energetic and quick-witted.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Hare-Trigger", description: "You can add your proficiency bonus to your initiative rolls." },
      { name: "Leporine Senses", description: "You have proficiency in the Perception skill." },
      { name: "Lucky Footwork", description: "When you fail a Dexterity saving throw, you can use your reaction to roll a d4 and add it to the save, potentially turning a failure into a success." },
      { name: "Rabbit Hop", description: "As a bonus action, you can jump a number of feet equal to five times your proficiency bonus, without provoking opportunity attacks. You can use this a number of times equal to your proficiency bonus per long rest." }
    ],
    languages: ["Common", "One other language"]
  },
  "Hexblood": {
    name: "Hexblood",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Hexbloods are individuals infused with fey magic, granted by hags. They are marked by their strange, witchy abilities.",
    size: 'Medium', // or small
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light." },
      { name: "Eerie Token", description: "As a bonus action, you can harmlessly remove a lock of your hair, one of your nails, or one of your teeth. This token is imbued with magic. You can use it to telepathically communicate with someone holding it, or see and hear through it for a short time." },
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Hex Magic", description: "You can cast Disguise Self and Hex with this trait. Once you cast either spell, you can't cast it again with this trait until you finish a long rest." }
    ],
    languages: ["Common", "One other language"]
  },
  "Hobgoblin": { 
    name: "Hobgoblin", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Hobgoblins are militaristic and disciplined goblinoids who value strength and strategy, often forming well-organized armies.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Fey Gift", description: "You can use the Help action as a bonus action. You can also grant temporary hit points to the creature you help. You can use this a number of times equal to your proficiency bonus per long rest." },
      { name: "Fortune from the Many", description: "If you miss with an attack roll or fail an ability check or a saving throw, you can gain a bonus to the roll equal to the number of allies you can see within 30 feet of you (maximum bonus of +3). You can use this once per long rest." }
    ],
    languages: ["Common", "Goblin"]
  },
  "Human": { 
    name: "Human", 
    bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    description: "Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.",
    size: 'Medium',
    speed: 30,
    traits: [],
    languages: ["Common", "One extra language of your choice"]
  },
  "Human (Variant)": { 
    name: "Human (Variant)", 
    bonuses: { }, 
    asi_desc: "Increase two different ability scores of your choice by 1.",
    description: "This variant of the human race allows for more customization at character creation.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Skills", description: "You gain proficiency in one skill of your choice." },
        { name: "Feat", description: "You gain one feat of your choice." }
    ],
    languages: ["Common", "One extra language of your choice"]
  },
  "Kalashtar": {
    name: "Kalashtar",
    bonuses: { wis: 2, cha: 1 },
    description: "A compound race created from the fusion of humanity and renegade spirits from the plane of dreams.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Dual Mind", description: "You have advantage on all Wisdom saving throws." },
      { name: "Mental Discipline", description: "You have resistance to psychic damage." },
      { name: "Mind Link", description: "You can speak telepathically to any creature you can see within a number of feet equal to 10 times your level. You don't need to share a language." },
      { name: "Severed from Dreams", description: "Kalashtar sleep, but they don’t connect to the plane of dreams as other creatures do. Instead, their minds draw from the memories of their otherworldly spirit while they sleep." }
    ],
    languages: ["Common", "Quori", "One other language of your choice"]
  },
  "Kender": {
    name: "Kender",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Afflicted with an insatiable wanderlust and a fearlessness that borders on insanity, kender are a curiosity to many.",
    size: 'Small',
    speed: 30,
    traits: [
      { name: "Brave", description: "You have advantage on saving throws against being frightened." },
      { name: "Kender Aptitude", description: "You have proficiency in one of the following skills: Insight, Investigation, Sleight of Hand, Stealth, or Survival." },
      { name: "Taunt", description: "As a bonus action, you can unleash a string of provoking words at a creature within 60 feet. If the target can hear you, it must succeed on a Wisdom saving throw or have disadvantage on attack rolls against targets other than you until the start of your next turn." }
    ],
    languages: ["Common", "One other language"]
  },
  "Kenku": { 
    name: "Kenku", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Haunted by an ancient crime, the flightless kenku wander the world as vagabonds and burglars who live at the edge of human society.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Expert Forgery", description: "You can duplicate other creatures’ handwriting and craftwork. You have advantage on all checks made to produce forgeries or duplicates of existing objects." },
      { name: "Kenku Recall", description: "You have proficiency in two skills of your choice. You have advantage on ability checks using any of your skill proficiencies." },
      { name: "Mimicry", description: "You can mimic sounds you have heard, including voices. A creature that hears the sounds can tell they are imitations with a successful Wisdom (Insight) check." }
    ],
    languages: ["Common", "Auran", "but can only speak through mimicry"]
  },
  "Khenra": {
    name: "Khenra",
    bonuses: { dex: 2, str: 1 },
    asi_desc: "Your Dexterity score increases by 2, and your Strength score increases by 1.",
    description: "Khenra are a race of jackal-headed humanoids from the desert plane of Amonkhet. They are born as twins, and their lives are intertwined.",
    size: 'Medium',
    speed: 35,
    traits: [
      { name: "Khenra Weapons Training", description: "You have proficiency with the khopesh, spear, and javelin." },
      { name: "Twin-Mind", description: "You have advantage on all Wisdom saving throws." }
    ],
    languages: ["Common", "Khenra"]
  },
  "Kobold": {
    name: "Kobold", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Kobolds are craven reptilian humanoids that worship evil dragons as demigods and serve them as minions and sycophants.",
    size: 'Small',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light." },
      { name: "Draconic Cry", description: "As a bonus action, you can let out a cry at your enemies within 10 feet. Until the start of your next turn, you and your allies have advantage on attack rolls against any of those enemies. You can use this once per long rest." },
      { name: "Kobold Legacy", description: "You have proficiency in one of the following skills: Arcana, Investigation, Medicine, Sleight of Hand, or Survival." }
    ],
    languages: ["Common", "Draconic"]
  },
  "Kor": {
    name: "Kor",
    bonuses: { dex: 2, wis: 1 },
    asi_desc: "Your Dexterity score increases by 2, and your Wisdom score increases by 1.",
    description: "Kor are a race of tall, slender humanoids with light blue or white skin. They are known for their skill as climbers and their love of freedom.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Kor Climbing", description: "You have a climbing speed of 30 feet." },
      { name: "Lucky", description: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll." },
      { name: "Brave", description: "You have advantage on saving throws against being frightened." }
    ],
    languages: ["Common", "Kor"]
  },
  "Leonin": {
    name: "Leonin",
    bonuses: { con: 2, str: 1 },
    description: "Leonin are proud, lion-like humanoids who live in prides and value strength and courage above all else.",
    size: 'Medium',
    speed: 35,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light." },
        { name: "Claws", description: "Your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier." },
        { name: "Hunter's Instincts", description: "You have proficiency in one of the following skills of your choice: Athletics, Intimidation, Perception, or Survival." },
        { name: "Daunting Roar", description: "As a bonus action, you can let out an especially menacing roar. Creatures of your choice within 10 feet of you that can hear you must succeed on a Wisdom saving throw or become frightened of you until the end of your next turn. You can use this once per long rest." }
    ],
    languages: ["Common", "Leonin"]
  },
  "Lizardfolk": {
    name: "Lizardfolk", 
    bonuses: { con: 2, wis: 1 },
    description: "Lizardfolk are semi-aquatic reptilian humanoids. Their mindset is alien to most other humanoids, as they see the world in terms of predator and prey.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Bite", description: "Your fanged maw is a natural weapon, which you can use to make unarmed strikes. If you hit with it, you deal piercing damage equal to 1d6 + your Strength modifier." },
      { name: "Cunning Artisan", description: "As part of a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant creature of size Small or larger to create one of the following items: a shield, a club, a javelin, or 1d4 darts or blowgun needles." },
      { name: "Hold Breath", description: "You can hold your breath for up to 15 minutes at a time." },
      { name: "Natural Armor", description: "You have tough, scaly skin. When you aren't wearing armor, your AC is 13 + your Dexterity modifier." },
      { name: "Swim", description: "You have a swimming speed of 30 feet." }
    ],
    languages: ["Common", "Draconic"]
  },
  "Locathah": { 
    name: "Locathah", 
    bonuses: { str: 2, dex: 1 },
    description: "Locathah are resilient and proud fish-folk that have endured the sahuagin's enslavement for generations.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Natural Armor", description: "You have a natural armor class of 12 + your Dexterity modifier." },
      { name: "Observant & Athletic", description: "You have proficiency in the Athletics and Perception skills." },
      { name: "Leviathan Will", description: "You have advantage on saving throws against being charmed, frightened, paralyzed, poisoned, stunned, or put to sleep." },
      { name: "Limited Amphibiousness", description: "You can breathe air and water, but you need to be submerged in water for at least 1 hour out of every 4 hours." },
      { name: "Swim", description: "You have a swimming speed of 30 feet." }
    ],
    languages: ["Common", "Aquan"]
  },
  "Loxodon": {
    name: "Loxodon",
    bonuses: { con: 2, wis: 1 },
    description: "Loxodons are serene, elephant-like humanoids who value community and peace. Their imposing physical forms are matched by their tranquil wisdom.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Powerful Build", description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift." },
      { name: "Loxodon Serenity", description: "You have advantage on saving throws against being charmed or frightened." },
      { name: "Natural Armor", description: "Your thick hide provides a base AC of 12 + your Constitution modifier. You can use a shield and still gain this benefit." },
      { name: "Trunk", description: "You can grasp things with your trunk, which has a reach of 5 feet. You can use it to lift, drop, hold, push, or pull an object or a creature; open or close a door or a container; or make an unarmed strike." },
      { name: "Keen Smell", description: "You have advantage on Wisdom (Perception) checks that rely on smell." }
    ],
    languages: ["Common", "Loxodon"]
  },
  "Merfolk": {
    name: "Merfolk",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Merfolk are aquatic humanoids with the upper body of a humanoid and the lower body of a fish. They are graceful and charismatic, with a deep connection to the sea.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Amphibious", description: "You can breathe air and water." },
        { name: "Swim", description: "You have a swimming speed of 30 feet." },
        { name: "Cantrip", description: "You know one cantrip of your choice from the sorcerer spell list. Charisma is your spellcasting ability for it." },
        { name: "Friend of the Sea", description: "Using gestures and sounds, you can communicate simple ideas with any beast that has an innate swimming speed." }
    ],
    languages: ["Common", "Aquan"]
  },
  "Minotaur": { 
    name: "Minotaur", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Minotaurs are hulking, bull-headed humanoids who are known for their strength and ferocity. They are often found in labyrinths and other maze-like structures.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Horns", description: "Your horns are a natural weapon, which you can use to make unarmed strikes dealing 1d6 + your Strength modifier piercing damage." },
      { name: "Goring Rush", description: "When you use the Dash action, you can make one melee attack with your horns as a bonus action." },
      { name: "Hammering Horns", description: "Immediately after you hit a creature with a melee attack as part of the Attack action on your turn, you can use a bonus action to attempt to shove that target with your horns. The target must be no more than one size larger than you. Unless it succeeds on a Strength saving throw, you can push it up to 10 feet away from you." },
      { name: "Labyrinthine Recall", description: "You can perfectly recall any path you have traveled." }
    ],
    languages: ["Common", "Minotaur"]
  },
  "Naga": {
    name: "Naga",
    bonuses: { con: 2, int: 1 },
    asi_desc: "Your Constitution score increases by 2, and your Intelligence score increases by 1.",
    description: "Naga are serpentine creatures with a humanoid upper body and a snake-like lower body. They are known for their wisdom and their magical abilities.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Speed", description: "Your speed is 30 feet." },
      { name: "Natural Weapons", description: "You have a fanged maw, which you can use to make unarmed strikes. If you hit with it, you deal piercing damage equal to 1d4 + your Strength modifier, and the target must succeed on a DC 11 Constitution saving throw or take 2d4 poison damage." },
      { name: "Poison Immunity", description: "You are immune to poison damage and the poisoned condition." }
    ],
    languages: ["Common", "Naga"]
  },
  "Orc": {
    name: "Orc",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Orcs are savage humanoids with a lust for slaughter and conquest. They are known for their strength and ferocity, and their love of battle.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Adrenaline Rush", description: "As a bonus action, you can move up to your speed toward a hostile creature that you can see or hear. You can use this a number of times equal to your proficiency bonus per long rest." },
      { name: "Powerful Build", description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift." },
      { name: "Relentless Endurance", description: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest." }
    ],
    languages: ["Common", "Orc"]
  },
  "Owlin": { 
    name: "Owlin", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Owlin are owl-like humanoids who are known for their wisdom and stealth. They are often found in libraries and other places of knowledge.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 120 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Flight", description: "You have a flying speed equal to your walking speed. To use this speed, you can't be wearing medium or heavy armor." },
      { name: "Silent Feathers", description: "You have proficiency in the Stealth skill." }
    ],
    languages: ["Common", "One other language"]
  },
  "Plasmoid": {
    name: "Plasmoid",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Plasmoids are amorphous, ooze-like creatures that can reshape their bodies at will. They are curious and adaptable, often exploring the far reaches of the multiverse.",
    size: 'Medium', // or Small
    speed: 30,
    traits: [
        { name: "Amorphous", description: "You can squeeze through a space as narrow as 1 inch wide, provided you are wearing and carrying nothing. You have advantage on ability checks you make to initiate or escape a grapple." },
        { name: "Darkvision", description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light." },
        { name: "Hold Breath", description: "You can hold your breath for 1 hour." },
        { name: "Shape Self", description: "As an action, you can reshape your body to give yourself a head, one or two arms, one or two legs, and makeshift hands and feet, or you can revert to a limbless blob." }
    ],
    languages: ["Common", "One other language"]
  },
  "Reborn": {
    name: "Reborn",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Reborn are individuals who have died but, for some reason, have returned to life. They are living beings, but with a connection to death.",
    size: 'Medium', // or small
    speed: 30,
    traits: [
      { name: "Knowledge from a Past Life", description: "You can add a d6 to any ability check you make that uses a skill. You can use this feature a number of times equal to your proficiency bonus per long rest." },
      { name: "Deathless Nature", description: "You have escaped death, a fact represented by the following benefits:\n - You have advantage on saving throws against disease and being poisoned, and you have resistance to poison damage.\n - You have advantage on death saving throws.\n - You don’t need to eat, drink, or breathe.\n - You don’t need to sleep, and magic can’t put you to sleep. You can finish a long rest in 4 hours if you spend those hours in an inactive, motionless state, during which you retain consciousness." }
    ],
    languages: ["Common", "Two other languages"]
  },
  "Satyr": { 
    name: "Satyr", 
    bonuses: { cha: 2, dex: 1 },
    description: "Satyrs are fey creatures who love to celebrate and indulge in revelry. They are known for their charm and their love of music.",
    size: 'Medium',
    speed: 35,
    traits: [
      { name: "Magic Resistance", description: "You have advantage on saving throws against spells and other magical effects." },
      { name: "Ram", description: "You can use your head and horns to make unarmed strikes. If you hit with them, you deal bludgeoning damage equal to 1d4 + your Strength modifier." },
      { name: "Reveler", description: "You have proficiency in the Performance and Persuasion skills, and you are proficient with one musical instrument of your choice." }
    ],
    languages: ["Common", "Sylvan"]
  },
  "Shifter": {
    name: "Shifter",
    bonuses: { },
    asi_desc: "Ability scores vary by subrace.",
    description: "Shifters are humanoids with a bestial aspect. They are descended from humans and lycanthropes, and can take on animalistic features for a short time.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Shifting", description: "As a bonus action, you can assume a more bestial appearance. This transformation lasts for 1 minute. When you shift, you gain temporary hit points equal to your level + your Constitution modifier. This also grants additional benefits based on your Shifter subrace (Beasthide, Longtooth, Swiftstride, Wildhunt)." }
    ],
    languages: ["Common"]
  },
  "Simic Hybrid": {
    name: "Simic Hybrid",
    bonuses: { con: 2 },
    asi_desc: "Your Constitution score increases by 2, and one other ability score of your choice increases by 1.",
    description: "The Simic Combine uses magic to fuse different life forms together. As a Simic hybrid, you are a product of this magical science.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Darkvision", description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light." },
        { name: "Animal Enhancement", description: "Your body has been altered with animal characteristics. You choose one animal enhancement at 1st level and a second at 5th level. (e.g., Manta Glide, Nimble Climber, Underwater Adaptation, Grappling Appendages, Carapace, Acid Spit)." }
    ],
    languages: ["Common", "Elvish", "or Vedalken"]
  },
  "Siren": {
    name: "Siren",
    bonuses: { cha: 2 },
    asi_desc: "Your Charisma score increases by 2.",
    description: "Sirens are winged humanoids with an irresistible song. They are often found near coastlines, where they lure sailors to their doom.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Wings", description: "You have a flying speed of 30 feet." },
      { name: "Siren's Song", description: "You can use your action to sing a magical melody. Every humanoid and giant within 300 feet of you that can hear the song must succeed on a DC 11 Wisdom saving throw or be charmed until the song ends. You must take a bonus action on your subsequent turns to continue singing." }
    ],
    languages: ["Common"]
  },
  "Tabaxi": { 
    name: "Tabaxi", 
    bonuses: { dex: 2, cha: 1 },
    description: "Hailing from a strange and distant land, wandering tabaxi are catlike humanoids driven by curiosity to collect interesting artifacts, gather tales and stories, and lay eyes on all the world’s wonders.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Feline Agility", description: "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns." },
      { name: "Cat's Claws", description: "You can use your claws to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier." },
      { name: "Cat's Talent", description: "You have proficiency in the Perception and Stealth skills." },
      { name: "Climb", description: "You have a climbing speed of 20 feet." }
    ],
    languages: ["Common", "One other language"]
  },
  "Thri-kreen": {
    name: "Thri-kreen",
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Thri-kreen are insectoid humanoids, with a tough carapace and multiple arms. They are known for their psionic abilities and their pragmatic, collectivist mindset.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Chameleon Carapace", description: "While you aren't wearing heavy armor, your carapace gives you a base AC of 13 + your Dexterity modifier. As an action, you can change the color of your carapace to match your surroundings, giving you advantage on Dexterity (Stealth) checks." },
        { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
        { name: "Secondary Arms", description: "You have two smaller arms below your main arms. You can use these arms to manipulate an object, open or close a door or container, or wield a weapon that has the light property." },
        { name: "Sleepless", description: "You do not require sleep and can't be forced to sleep by any means. To gain the benefits of a long rest, you can spend 8 hours engaged in light activity." }
    ],
    languages: ["Common", "Thri-kreen"]
  },
  "Tiefling": { 
    name: "Tiefling", 
    bonuses: { int: 1, cha: 2 }, 
    description: "To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Hellish Resistance", description: "You have resistance to fire damage." },
      { name: "Infernal Legacy", description: "You know the Thaumaturgy cantrip. At 3rd level, you can cast Hellish Rebuke once per long rest. At 5th level, you can cast Darkness once per long rest. Charisma is your spellcasting ability for these spells." }
    ],
    languages: ["Common", "Infernal"]
  },
  "Tortle": { 
    name: "Tortle", 
    bonuses: { str: 2, wis: 1 },
    description: "Tortles are reptilian humanoids with large shells on their backs that they can withdraw into for protection. They are peaceful and reclusive.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Claws", description: "You can use your claws to make unarmed strikes, dealing 1d4 slashing damage." },
      { name: "Hold Breath", description: "You can hold your breath for up to 1 hour." },
      { name: "Natural Armor", description: "Your shell provides you a base AC of 17 (your Dexterity modifier doesn't affect this number). You can't wear light, medium, or heavy armor." },
      { name: "Shell Defense", description: "As an action, you can withdraw into your shell. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws." }
    ],
    languages: ["Common", "Aquan"]
  },
  "Triton": { 
    name: "Triton", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Tritons are an aquatic humanoid race, native to the Elemental Plane of Water. They are proud and noble, and see themselves as guardians of the sea.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Amphibious", description: "You can breathe air and water." },
      { name: "Swim", description: "You have a swimming speed of 30 feet." },
      { name: "Control Air and Water", description: "You can cast Fog Cloud. At 3rd level, you can cast Gust of Wind. At 5th level, you can cast Water Walk. You can cast each spell once per long rest. Charisma is your spellcasting ability for these." },
      { name: "Emissary of the Sea", description: "You can communicate simple ideas with beasts that can breathe water." },
      { name: "Guardians of the Depths", description: "You have resistance to cold damage." }
    ],
    languages: ["Common", "Primordial"]
  },
  "Vampire": {
    name: "Vampire",
    bonuses: { cha: 2, dex: 1 },
    asi_desc: "Your Charisma score increases by 2, and your Dexterity score increases by 1.",
    description: "Vampires are undead creatures that feed on the blood of the living. They are known for their supernatural charm and their deadly bite.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Vampiric Bite", description: "Your fanged bite is a natural weapon, which you can use to make unarmed strikes. If you hit with it, you deal piercing damage equal to 1d6 + your Strength modifier." }
    ],
    languages: ["Common", "the language of your homeland"]
  },
  "Vedalken": {
    name: "Vedalken",
    bonuses: { int: 2, wis: 1 },
    description: "Vedalken are tall, blue-skinned humanoids who are known for their intelligence and their calm, logical approach to life. They are often found in cities, where they work as scholars, scientists, and artisans.",
    size: 'Medium',
    speed: 30,
    traits: [
        { name: "Vedalken Dispassion", description: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws." },
        { name: "Tireless Precision", description: "You are proficient in one of the following skills: Arcana, History, Investigation, Medicine, Performance, or Sleight of Hand. You are also proficient with one tool of your choice." },
        { name: "Partially Amphibious", description: "You can breathe underwater for up to 1 hour. Once you've used this trait, you can't use it again until you finish a long rest." }
    ],
    languages: ["Common", "Vedalken", "One other language"]
  },
  "Verdan": { 
    name: "Verdan", 
    bonuses: { cha: 2, con: 1 },
    description: "Verdan are a curious and adaptable race of goblinoids who were transformed by a mysterious force. They are always eager to learn and explore.",
    size: 'Small', // They grow to Medium
    speed: 30,
    traits: [
      { name: "Telepathic Insight", description: "You can speak telepathically to any creature you can see within 30 feet of you. You also have advantage on all Wisdom and Charisma saving throws." },
      { name: "Persuasive", description: "You have proficiency in the Persuasion skill." },
      { name: "Black Blood Healing", description: "When you roll a 1 or 2 on any Hit Die you spend at the end of a short rest, you can reroll the die and must use the new roll." }
    ],
    languages: ["Common", "Goblin", "One other language"]
  },
  "Warforged": { 
    name: "Warforged", 
    bonuses: { con: 2 }, 
    asi_desc: "Your Constitution score increases by 2, and one other ability score of your choice increases by 1.",
    description: "Warforged are sentient constructs built for war. They are powerful and resilient, and are often found working as soldiers or mercenaries.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Constructed Resilience", description: "You were created to have remarkable fortitude. You have advantage on saving throws against being poisoned, and you have resistance to poison damage. You are immune to disease, do not need to eat, drink, or breathe, and do not need to sleep and can't be put to sleep by magic." },
      { name: "Sentry's Rest", description: "When you take a long rest, you must spend at least six hours in an inactive, motionless state, rather than sleeping. In this state, you appear inert, but it doesn't render you unconscious, and you can see and hear as normal." },
      { name: "Integrated Protection", description: "Your body has built-in defensive layers. You gain a +1 bonus to Armor Class." }
    ],
    languages: ["Common", "One other language"]
  },
  "Yuan-ti": { 
    name: "Yuan-ti", 
    bonuses: {},
    asi_desc: "Increase one ability score by 2, and another by 1; or three different scores by 1.",
    description: "Yuan-ti are serpentine humanoids with a mix of human and snake features, known for their cunning and lack of emotion.",
    size: 'Medium',
    speed: 30,
    traits: [
      { name: "Darkvision", description: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light." },
      { name: "Innate Spellcasting", description: "You know the Poison Spray cantrip. At 3rd level, you can cast Animal Friendship (snakes only) at will. At 5th level, you can cast Suggestion once per long rest. Charisma is your spellcasting ability for these spells." },
      { name: "Magic Resistance", description: "You have advantage on saving throws against spells and other magical effects." },
      { name: "Poison Immunity", description: "You are immune to poison damage and the poisoned condition." }
    ],
    languages: ["Common", "Abyssal", "Draconic"]
  },
};
