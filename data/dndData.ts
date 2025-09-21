
import { Feature, Character } from '../types';

interface SpellcastingData {
  ability: 'int' | 'wis' | 'cha';
  cantripsKnown?: number[];
  spellsKnown?: number[];
  spellSlots?: number[][];
}

interface ClassFeature {
  level: number;
  name: string;
  description: string;
  uses?: {
    max: number | 'level' | 'cha' | 'wis' | 'int' | 'str' | 'dex' | 'con' | 'prof';
  };
  recharge?: 'short' | 'long';
}

interface Subclass {
  name:string;
  features: ClassFeature[];
  spellcasting?: SpellcastingData;
}

interface ClassData {
  name: string;
  hitDie: number;
  subclassLevel: number;
  subclasses: { [key: string]: Subclass };
  features: ClassFeature[];
  spellcasting?: SpellcastingData;
}

// A summarized database of D&D 5e class and subclass features
// Source: dnd5e.wikidot.com
export const DND_CLASS_DATA: { [key: string]: ClassData } = {
  "Artificer": {
    name: "Artificer",
    hitDie: 8,
    subclassLevel: 3,
    features: [
        { level: 1, name: "Magical Tinkering", description: "You can imbue a Tiny nonmagical object with one of four magical properties: shed light, emit a recorded message, emit an odor or nonverbal sound, or a static visual effect. You can have a number of these objects equal to your Intelligence modifier." },
        { level: 2, name: "Infuse Item", description: "You gain the ability to imbue mundane items with certain magical infusions. You know a number of infusions and can have a number of infused items at one time, both scaling with your Artificer level. You learn new infusions at levels 6, 10, 14, and 18." },
        { level: 7, name: "Flash of Genius", description: "As a reaction, when you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can add your Intelligence modifier to the roll.", uses: { max: 'int' }, recharge: 'long' },
        { level: 10, name: "Magic Item Adept", description: "You can attune to up to 4 magic items at once. Crafting a common or uncommon magic item takes you a quarter of the normal time, and it costs you half as much gold." },
        { level: 11, name: "Spell-Storing Item", description: "You can store a 1st or 2nd-level spell with a casting time of 1 action into a weapon or spellcasting focus. A creature holding the item can cast the spell from it, using your spellcasting ability. The item can be used a number of times equal to twice your INT modifier." },
        { level: 14, name: "Magic Item Savant", description: "You can attune to up to 5 magic items at once. You can also ignore all class, race, spell, and level requirements on attuning to or using a magic item." },
        { level: 18, name: "Magic Item Master", description: "You can attune to up to 6 magic items at once." },
        { level: 20, name: "Soul of Artifice", description: "You gain a +1 bonus to all saving throws for each magic item you are currently attuned to. As a reaction, if you are reduced to 0 HP, you can end one of your infusions to drop to 1 HP instead." },
    ],
    spellcasting: {
      ability: 'int',
      cantripsKnown: [2,2,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
      spellSlots: [
        //1, 2, 3, 4, 5
        [2,0,0,0,0], [2,0,0,0,0], [3,0,0,0,0], [3,0,0,0,0], [4,2,0,0,0], [4,2,0,0,0], [4,3,0,0,0], [4,3,0,0,0], [4,3,2,0,0], [4,3,2,0,0],
        [4,3,3,0,0], [4,3,3,0,0], [4,3,3,1,0], [4,3,3,1,0], [4,3,3,2,0], [4,3,3,2,0], [4,3,3,3,1], [4,3,3,3,1], [4,3,3,3,2], [4,3,3,3,2]
      ]
    },
    subclasses: {
        "Alchemist": { name: "Alchemist", features: [
            { level: 3, name: "Experimental Elixir", description: "After a long rest, you can magically produce an Experimental Elixir for free in an empty flask. Roll a d6 to determine the elixir's effect. As an action, a creature can drink the elixir or administer it to an incapacitated creature. You can create additional elixirs by expending a spell slot of 1st level or higher for each one.", uses: {max: 1}, recharge: 'long'},
            { level: 5, name: "Alchemical Savant", description: "When you cast a spell using your alchemist's supplies as the spellcasting focus, you gain a bonus to one roll of the spell. That roll must restore hit points or be a damage roll that deals acid, fire, necrotic, or poison damage, and the bonus equals your Intelligence modifier."},
            { level: 9, name: "Restorative Reagents", description: "When a creature drinks one of your Experimental Elixirs, it gains temporary hit points equal to 2d6 + your Intelligence modifier. You can also cast Lesser Restoration without a spell slot a number of times equal to your INT mod per long rest."},
            { level: 15, name: "Chemical Mastery", description: "You gain resistance to acid and poison damage, and you are immune to the poisoned condition. You can also cast Greater Restoration and Heal once each without expending a spell slot."}
        ]},
        "Armorer": { name: "Armorer", features: [
            { level: 3, name: "Tools of the Trade", description: "You gain proficiency with heavy armor and smith's tools. You can turn a suit of heavy armor into Arcane Armor."},
            { level: 3, name: "Arcane Armor", description: "Your Arcane Armor attaches to you and can't be removed against your will. It has no strength requirement and you can use it as a spellcasting focus. You can customize its model: Guardian (Thunder Gauntlets) or Infiltrator (Lightning Launcher)."},
            { level: 5, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
            { level: 9, name: "Armor Modifications", description: "You can infuse the special weapon, armor, helmet, and boots of your Arcane Armor separately. You can also add one additional infusion to the armor." },
            { level: 15, name: "Perfected Armor", description: "The special weapons of your Arcane Armor are now more powerful. Guardian gauntlets can pull a creature on hit. Infiltrator launcher can provide temporary hit points."}
        ]},
        "Artillerist": { name: "Artillerist", features: [
            { level: 3, name: "Eldritch Cannon", description: "As an action, you can magically create a Small or Tiny Eldritch Cannon in an unoccupied space. The cannon has its own HP and AC. On each of your turns, you can command the cannon (no action required) to activate. It can be a Flamethrower, Force Ballista, or Protector.", uses: {max: 1}, recharge: 'long' },
            { level: 5, name: "Arcane Firearm", description: "You can turn a wand, staff, or rod into an Arcane Firearm. When you cast a spell using this firearm, you can roll a d8, and you gain a bonus to one of the spell's damage rolls equal to the number rolled."},
            { level: 9, name: "Explosive Cannon", description: "Your Eldritch Cannon's damage rolls increase by 1d8. You can also command your cannon to detonate as an action."},
            { level: 15, name: "Fortified Position", description: "You and your allies have half cover while within 10 feet of your Eldritch Cannon. You can also summon two cannons with the same action."}
        ]},
        "Battle Smith": { name: "Battle Smith", features: [
            { level: 3, name: "Battle Ready", description: "When you attack with a magic weapon, you can use your Intelligence modifier, instead of Strength or Dexterity, for the attack and damage rolls."},
            { level: 3, name: "Steel Defender", description: "You build a loyal beast companion that aids you in combat. It has its own stat block and acts on your bonus action to take the Dodge, Help, or Attack action."},
            { level: 5, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
            { level: 9, name: "Arcane Jolt", description: "When you or your Steel Defender hits a target with a magic weapon attack, you can channel magical energy through the strike to create one of two effects: deal an extra 2d6 force damage, or heal an ally you can see within 30 feet for 2d6 HP.", uses: {max: 'int'}, recharge: 'long'},
            { level: 15, name: "Improved Defender", description: "Your Steel Defender's Deflect Attack now deals 1d4 + your INT modifier in force damage. Your Arcane Jolt damage and healing increase to 4d6."}
        ]}
    }
  },
  "Barbarian": {
    name: "Barbarian",
    hitDie: 12,
    subclassLevel: 3,
    features: [
      { level: 1, name: "Rage", description: "Bonus Action to enter a rage for 1 minute. You gain advantage on Strength checks and saves, +2 bonus to damage with STR melee attacks, and resistance to bludgeoning, piercing, and slashing damage. Rage ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then.", uses: {max: 2}, recharge: 'long' },
      { level: 1, name: "Unarmored Defense", description: "While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit." },
      { level: 2, name: "Reckless Attack", description: "On your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn." },
      { level: 2, name: "Danger Sense", description: "You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated." },
      { level: 3, name: "Rage Uses", description: "You can rage 3 times per long rest.", uses: {max: 3}, recharge: 'long' },
      { level: 5, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
      { level: 5, name: "Fast Movement", description: "Your speed increases by 10 feet while you aren't wearing heavy armor." },
      { level: 6, name: "Rage Uses", description: "You can rage 4 times per long rest.", uses: {max: 4}, recharge: 'long' },
      { level: 7, name: "Feral Instinct", description: "You have advantage on initiative rolls. Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn if you enter your rage before doing anything else on that turn." },
      { level: 9, name: "Brutal Critical (1 die)", description: "You can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack." },
      { level: 9, name: "Rage Damage", description: "Your Rage damage bonus increases to +3." },
      { level: 11, name: "Relentless Rage", description: "If you drop to 0 HP while raging and don't die outright, you can make a DC 10 Constitution save. If you succeed, you drop to 1 HP instead. Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10." },
      { level: 12, name: "Rage Uses", description: "You can rage 5 times per long rest.", uses: {max: 5}, recharge: 'long' },
      { level: 13, name: "Brutal Critical (2 dice)", description: "You can roll two additional weapon damage dice for a critical hit." },
      { level: 15, "name": "Persistent Rage", "description": "Your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it." },
      { level: 16, name: "Rage Damage", description: "Your Rage damage bonus increases to +4." },
      { level: 17, name: "Brutal Critical (3 dice)", description: "You can roll three additional weapon damage dice for a critical hit." },
      { level: 17, name: "Rage Uses", description: "You can rage 6 times per long rest.", uses: {max: 6}, recharge: 'long' },
      { level: 18, name: "Indomitable Might", description: "If your total for a Strength check is less than your Strength score, you can use that score in place of the total." },
      { level: 20, name: "Primal Champion", description: "Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24. Your rages are unlimited." },
    ],
    subclasses: {
      "Path of the Ancestral Guardian": { name: "Path of the Ancestral Guardian", features: [
        { level: 3, name: "Ancestral Protectors", description: "While raging, the first creature you hit on your turn becomes the target of your ancestral protectors. It has disadvantage on any attack roll that isn't against you, and if it hits another creature, that creature has resistance to the damage." },
        { level: 6, name: "Spirit Shield", description: "As a reaction when an ally you can see within 30 ft takes damage, you can reduce that damage by 2d6. This improves to 3d6 at level 10, and 4d6 at level 14." },
        { level: 10, name: "Consult the Spirits", description: "You can cast Augury or Clairvoyance as a ritual without material components, contacting your ancestral spirits for guidance." },
        { level: 14, name: "Vengeful Ancestors", description: "When you use your Spirit Shield to reduce damage, the attacker takes force damage equal to the damage prevented." }
      ]},
      "Path of the Battlerager": { name: "Path of the Battlerager", features: [
        { level: 3, name: "Battlerager Armor", description: "You gain proficiency with spiked armor. While raging in it, you can use a bonus action to make one armor spike attack (1d4 piercing). You also gain 3 temporary HP if you do." },
        { level: 6, name: "Reckless Abandon", description: "When you use Reckless Attack while raging, you also gain temporary hit points equal to your Constitution modifier." },
        { level: 10, name: "Battlerager Charge", description: "You can take the Dash action as a bonus action while you are raging." },
        { level: 14, name: "Spiked Retribution", description: "When a creature within 5 feet of you hits you with a melee attack, the attacker takes 3 piercing damage if you are raging, aren't incapacitated, and are wearing spiked armor." }
      ]},
      "Path of the Beast": { name: "Path of the Beast", features: [
        { level: 3, name: "Form of the Beast", description: "When you rage, you manifest a natural weapon. You can choose from Bite (heal on hit once per turn), Claws (one extra claw attack), or Tail (add reach and d8 AC reaction)." },
        { level: 6, name: "Bestial Soul", description: "Your natural weapons count as magical. You can also adapt to an environment, gaining a swimming speed and breathing underwater, a climbing speed, or increased jump distance." },
        { level: 10, name: "Infectious Fury", description: "When you hit a creature with your natural weapons while raging, you can force the target to make a Wisdom save. On a failure, it must use its reaction to make a melee attack against another creature of your choice." },
        { level: 14, name: "Call the Hunt", description: "When you rage, you can choose allies up to your CON mod to gain 5 temporary HP. Once on each of their turns, when an affected ally hits a creature with an attack, they can deal an extra 1d6 force damage." }
      ]},
      "Path of the Berserker": { name: "Path of the Berserker", features: [
          { level: 3, name: "Frenzy", description: "When you rage, you can go into a frenzy. For the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns. When your rage ends, you suffer one level of exhaustion." },
          { level: 6, name: "Mindless Rage", description: "You can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage." },
          { level: 10, name: "Intimidating Presence", description: "As an action, you can frighten one creature within 30 feet of you until the end of your next turn. Target must make a Wisdom save (DC 8 + Prof + CHA mod). You can use your action on subsequent turns to extend the duration." },
          { level: 14, name: "Retaliation", description: "When you take damage from a creature within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature." }
      ]},
      "Path of the Giant": { name: "Path of the Giant", features: [
        { level: 3, name: "Giant's Power", description: "You learn the Giant's Might feature, which you can use when you rage. You become Large, your reach increases by 5 feet, and you deal an extra 1d6 damage once on your turn." },
        { level: 6, name: "Elemental Cleaver", description: "As a bonus action, you can imbue one weapon you're holding with elemental power (acid, cold, fire, lightning, or thunder). When you hit with the weapon, you deal an extra 1d6 damage of the chosen type and can change its damage type." },
        { level: 10, name: "Mighty Impel", description: "As a bonus action while raging, you can throw a willing or unwilling (contested Athletics check) Medium or smaller creature up to 30 feet." },
        { level: 14, name: "Demiurgic Colossus", description: "Your Giant's Might feature improves: you can become Huge, reach increases by 10 feet, and rage damage bonus is doubled against objects and structures." }
      ]},
      "Path of the Storm Herald": { name: "Path of the Storm Herald", features: [
        { level: 3, name: "Storm Aura", description: "When you rage, you manifest a stormy aura. Choose Desert (fire damage to foes), Sea (lightning damage to one foe), or Tundra (temp HP to allies)." },
        { level: 6, name: "Storm Soul", description: "You gain resistance to a damage type based on your storm aura (Fire, Lightning, or Cold) and an environmental benefit (e.g., breathe underwater)." },
        { level: 10, name: "Shielding Storm", description: "You and allies within your aura gain the damage resistance of your Storm Soul feature." },
        { level: 14, name: "Raging Storm", description: "Your Storm Aura becomes more powerful, with enhanced effects such as knocking enemies prone or restraining them." }
      ]},
      "Path of the Totem Warrior": { name: "Path of the Totem Warrior", features: [
          { level: 3, name: "Spirit Seeker", description: "You gain the ability to cast Beast Sense and Speak with Animals as rituals." },
          { level: 3, name: "Totem Spirit", description: "Choose a totem spirit (Bear, Eagle, Elk, Tiger, or Wolf). While raging, you gain a feature based on that choice, such as Bear's resistance to all damage except psychic." },
          { level: 6, name: "Aspect of the Beast", description: "Choose a totem spirit (Bear, Eagle, Elk, Tiger, or Wolf). You gain a passive benefit, such as Bear's double carrying capacity." },
          { level: 10, name: "Spirit Walker", description: "You can cast Commune with Nature as a ritual." },
          { level: 14, name: "Totemic Attunement", description: "Choose a totem spirit (Bear, Eagle, Elk, Tiger, or Wolf). You gain a powerful benefit while raging, such as Bear's disadvantage on attacks against your allies." }
      ]},
      "Path of Wild Magic": { name: "Path of Wild Magic", features: [
        { level: 3, name: "Magic Awareness", description: "As an action, you can open your awareness to the presence of concentrated magic, sensing its location and school. Usable a number of times equal to your proficiency bonus per long rest." },
        { level: 3, name: "Wild Surge", description: "When you enter your rage, roll on the Wild Magic table to create a random magical effect." },
        { level: 6, name: "Bolstering Magic", description: "As an action, you can touch a creature (including yourself) and grant them one of two benefits: restore a spell slot up to 3rd level, or add a 1d3 bonus to attack rolls and ability checks for 10 minutes." },
        { level: 10, name: "Unstable Backlash", description: "As a reaction when you take damage or fail a saving throw while raging, you can roll on the Wild Magic table and immediately use the result." },
        { level: 14, name: "Controlled Surge", description: "When you roll on the Wild Magic table, you can roll twice and choose which of the two effects to unleash." }
      ]},
      "Path of the Zealot": { name: "Path of the Zealot", features: [
        { level: 3, name: "Divine Fury", description: "While raging, the first creature you hit on each of your turns with a weapon attack takes extra damage equal to 1d6 + half your barbarian level. The extra damage is necrotic or radiant; you choose when you gain the feature." },
        { level: 3, name: "Warrior of the Gods", description: "If a spell like Revivify is cast on you, it requires no material components." },
        { level: 6, name: "Fanatical Focus", description: "If you fail a saving throw while raging, you can reroll it, and you must use the new roll. You can use this feature once per rage." },
        { level: 10, name: "Zealous Presence", description: "As a bonus action, you can unleash a battle cry that gives up to 10 other creatures of your choice within 60 feet advantage on attack rolls and saving throws until the start of your next turn.", uses: {max: 1}, recharge: 'long'},
        { level: 14, name: "Rage beyond Death", description: "While raging, having 0 hit points doesn't knock you unconscious. You still must make death saving throws, and you suffer the normal effects of taking damage at 0 hit points. However, if you would die due to failing death saving throws, you don't die until your rage ends." }
      ]},
    }
  },
  "Bard": {
    name: "Bard",
    hitDie: 8,
    subclassLevel: 3,
    spellcasting: {
      ability: 'cha',
      cantripsKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spellsKnown:   [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
      spellSlots: [
        // 1, 2, 3, 4, 5, 6, 7, 8, 9
        [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0],
        [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1]
      ]
    },
    features: [
        { level: 1, name: "Bardic Inspiration (d6)", description: "As a bonus action, give one creature within 60 feet a Bardic Inspiration die (a d6). Once within the next 10 minutes, the creature can roll the die and add the number to one ability check, attack roll, or saving throw. You can use this feature a number of times equal to your Charisma modifier.", uses: {max: 'cha'}, recharge: 'long' },
        { level: 2, name: "Jack of All Trades", description: "You can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus." },
        { level: 2, name: "Song of Rest (d6)", description: "If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points." },
        { level: 3, name: "Expertise (1)", description: "Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies." },
        { level: 5, name: "Bardic Inspiration (d8)", description: "Your Bardic Inspiration die turns into a d8." },
        { level: 5, name: "Font of Inspiration", description: "You regain all of your expended uses of Bardic Inspiration when you finish a short or long rest." },
        { level: 6, name: "Countercharm", description: "As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed." },
        { level: 9, name: "Song of Rest (d8)", description: "The extra hit points from Song of Rest increase to 1d8." },
        { level: 10, name: "Expertise (2)", description: "Choose two more skill proficiencies to gain expertise in." },
        { level: 10, name: "Bardic Inspiration (d10)", description: "Your Bardic Inspiration die becomes a d10." },
        { level: 10, name: "Magical Secrets", description: "Choose two spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table." },
        { level: 13, name: "Song of Rest (d10)", description: "The extra hit points from Song of Rest increase to 1d10." },
        { level: 14, name: "Magical Secrets (2)", description: "Choose two more spells from any class." },
        { level: 15, name: "Bardic Inspiration (d12)", description: "Your Bardic Inspiration die becomes a d12." },
        { level: 17, name: "Song of Rest (d12)", description: "The extra hit points from Song of Rest increase to 1d12." },
        { level: 18, name: "Magical Secrets (3)", description: "Choose two more spells from any class." },
        { level: 20, name: "Superior Inspiration", description: "When you roll initiative and have no uses of Bardic Inspiration left, you regain one use." },
    ],
    subclasses: {
      "College of Creation": { name: "College of Creation", features: [
        { level: 3, name: "Mote of Potential", description: "When a creature uses your Bardic Inspiration die, they gain an additional effect: on an ability check, they roll the die twice and take the higher; on an attack, it creates a burst of sound damaging nearby enemies; on a save, it grants temporary HP." },
        { level: 3, name: "Performance of Creation", description: "As an action, you can create one nonmagical item of your choice in an unoccupied space within 10 feet of you. The item's value cannot exceed 20 gp x your bard level, and it disappears after a number of hours equal to your proficiency bonus." },
        { level: 6, name: "Animating Performance", description: "As an action, you can animate one Large or smaller nonmagical item within 30 feet. It becomes a Dancing Item (with its own stats) for 1 hour, is friendly to you, and obeys your commands." },
        { level: 14, name: "Creative Crescendo", description: "When you use your Performance of Creation, you can create more than one item at once. The number of items equals your Charisma modifier (minimum of two items). The total value of all items cannot exceed the normal limit." }
      ]},
      "College of Eloquence": { name: "College of Eloquence", features: [
        { level: 3, name: "Silver Tongue", description: "When you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a d20 roll of 9 or lower as a 10." },
        { level: 3, name: "Unsettling Words", description: "As a bonus action, you can expend one use of Bardic Inspiration. Choose one creature you can see within 60 feet. Roll the die and subtract the number from the target's next saving throw before the start of your next turn." },
        { level: 6, name: "Unfailing Inspiration", description: "When a creature adds one of your Bardic Inspiration dice to a roll and it fails, the creature can keep the Bardic Inspiration die for a future roll." },
        { level: 14, name: "Infectious Inspiration", description: "When a creature succeeds on a roll using one of your Bardic Inspiration dice, you can use your reaction to give a Bardic Inspiration die to another creature you can see within 60 feet, without expending any of your uses." }
      ]},
      "College of Glamour": { name: "College of Glamour", features: [
        { level: 3, name: "Mantle of Inspiration", description: "As a bonus action, spend one Bardic Inspiration use to grant temporary HP equal to your die roll to allies (up to your CHA mod) within 60 ft. They can also immediately use their reaction to move up to their speed without provoking opportunity attacks." },
        { level: 3, name: "Enthralling Performance", description: "If you perform for at least 1 minute, you can attempt to charm humanoids (up to your CHA mod) within 60 feet. On a failed Wisdom save, they are charmed by you for 1 hour." },
        { level: 6, name: "Mantle of Majesty", description: "As a bonus action, you can cast Command without expending a spell slot. Any creature charmed by you automatically fails its saving throw against this spell." },
        { level: 14, name: "Unbreakable Majesty", description: "As a bonus action, you assume a majestic presence for 1 minute. Any creature that tries to attack you must make a Charisma saving throw. On a failed save, it can't attack you and must choose a new target. On a success, it's immune for 24 hours." }
      ]},
      "College of Lore": { name: "College of Lore", features: [
          { level: 3, name: "Bonus Proficiencies", description: "You gain proficiency with three skills of your choice." },
          { level: 3, name: "Cutting Words", description: "As a reaction when a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, you can expend one use of Bardic Inspiration, roll the die, and subtract the number from the creature's roll." },
          { level: 6, name: "Additional Magical Secrets", description: "You learn two spells of your choice from any class. A spell you choose must be of a level you can cast. The chosen spells count as bard spells for you but don't count against the number of bard spells you know." },
          { level: 14, name: "Peerless Skill", description: "When you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the d20, but before the DM tells you whether you succeed or fail." }
      ]},
      "College of Spirits": { name: "College of Spirits", features: [
        { level: 3, name: "Guiding Whispers", description: "You learn the Guidance cantrip, which doesn't count against your known cantrips." },
        { level: 3, name: "Tales from Beyond", description: "As a bonus action, you can expend one use of your Bardic Inspiration to roll on the Spirit Tales table. You can then use your action to choose a creature or yourself, and apply the tale's effect (e.g., deal damage, teleport, grant temp HP)." },
        { level: 6, name: "Spirit Session", description: "You can conduct a 1-hour ritual to channel spirits. At the end, you temporarily learn a spell of your choice from any class, which must be divination or necromancy. The spell level can be no higher than your number of proficiency bonus." },
        { level: 14, name: "Mystical Connection", description: "When you use your Tales from Beyond feature, you can roll a d6. On any roll, you can choose to use that tale's effect instead of the one you rolled on the Bardic Inspiration die." }
      ]},
      "College of Swords": { name: "College of Swords", features: [
        { level: 3, name: "Bonus Proficiencies", description: "You gain proficiency with medium armor and the scimitar. If you're proficient with a simple or martial melee weapon, you can use it as a spellcasting focus." },
        { level: 3, name: "Fighting Style", description: "You learn either the Dueling or Two-Weapon Fighting style." },
        { level: 3, name: "Blade Flourish", description: "When you take the Attack action, you can use one of your Blade Flourish options. You expend a use of Bardic Inspiration to do so. Options include Defensive Flourish (add die roll to AC), Slashing Flourish (damage another creature), or Mobile Flourish (push target and follow)." },
        { level: 6, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
        { level: 14, name: "Master's Flourish", description: "Whenever you use a Blade Flourish option, you can roll a d6 and use it instead of expending a Bardic Inspiration die." }
      ]},
      "College of Valor": { name: "College of Valor", features: [
          { level: 3, name: "Bonus Proficiencies", description: "You gain proficiency with medium armor, shields, and martial weapons." },
          { level: 3, name: "Combat Inspiration", description: "A creature with a Bardic Inspiration die from you can choose to add it to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the die and add the number to its AC against that attack." },
          { level: 6, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
          { level: 14, name: "Battle Magic", description: "When you use your action to cast a Bard spell, you can make one weapon attack as a bonus action." },
      ]},
      "College of Whispers": { name: "College of Whispers", features: [
        { level: 3, name: "Psychic Blades", description: "When you hit a creature with a weapon attack, you can expend one use of your Bardic Inspiration to deal an extra psychic damage. The damage is 2d6, increasing to 3d6 at 5th level, 5d6 at 10th level, and 8d6 at 15th level." },
        { level: 3, name: "Words of Terror", description: "If you speak to a humanoid alone for at least 1 minute, you can attempt to seed paranoia. The target must succeed on a Wisdom save or be frightened of you or a creature of your choice for 1 hour." },
        { level: 6, name: "Mantle of Whispers", description: "As a reaction when a humanoid dies within 30 feet of you, you can magically capture its shadow. You can then use this shadow to disguise yourself as the dead person for 1 hour, gaining access to some of its memories." },
        { level: 14, name: "Shadow Lore", description: "As an action, you can magically whisper a phrase to one creature within 30 feet. It must make a Wisdom save or be charmed by you for 8 hours. The creature believes it is a trusted friend, but this belief does not give you control over it." }
      ]},
    }
  },
  "Blood Hunter": {
      name: "Blood Hunter",
      hitDie: 10,
      subclassLevel: 3,
      features: [
          { level: 1, name: "Hunter's Bane", description: "You have advantage on Wisdom (Survival) checks to track Fey, Fiends, or Undead, as well as on Intelligence checks to recall information about them." },
          { level: 1, name: "Blood Maledict", description: "You can use a bonus action to curse one creature you can see within 30 feet. This curse lasts for 1 minute. You learn Blood Curses as you level up. Uses scale with your proficiency bonus.", uses: {max: 'prof'}, recharge: 'short' },
          { level: 2, name: "Fighting Style", description: "You adopt a particular style of fighting as your specialty (Archery, Dueling, Great Weapon Fighting, Two-Weapon Fighting)." },
          { level: 2, name: "Crimson Rite", description: "As a bonus action, you can activate a rite on a single weapon. You take damage equal to your level, and for 1 hour the weapon's damage becomes magical and deals an extra 1d4 damage of a chosen type (fire, cold, lightning). Damage die increases to 1d6 at 5th, 1d8 at 11th, and 1d10 at 17th level." },
          { level: 5, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
          { level: 6, name: "Brand of Castigation", description: "When you damage a creature with a Crimson Rite, you can brand them. The branded creature takes psychic damage whenever it deals damage to you or a creature you can see within 5 feet of you. You also always know the direction to the branded creature." },
      ],
      subclasses: {
          "Order of the Ghostslayer": { name: "Order of the Ghostslayer", features: [
            { level: 3, name: "Rite of the Dawn", description: "Your Crimson Rite can deal radiant damage. While your rite is active against an undead, you have resistance to necrotic damage and your weapon deals an additional Crimson Rite die of damage." },
            { level: 7, name: "Hallowed Veins", description: "Your brand can be applied to any creature. Your body is now hallowed, making you immune to being frightened or charmed by undead. Your speed increases by 10 feet." },
            { level: 11, name: "Supernal Surge", description: "You can make one additional attack when you use the Attack action. You can do this a number of times equal to your Intelligence modifier per long rest." },
            { level: 15, name: "Blood Curse of the Exorcist", description: "You gain a new Blood Curse that allows you to damage and potentially banish creatures that attempt to charm, frighten, or possess an ally." }
          ]},
          "Order of the Lycan": { name: "Order of the Lycan", features: [
            { level: 3, name: "Heightened Senses", description: "You gain advantage on Wisdom (Perception) checks that rely on hearing or smell." },
            { level: 3, name: "Hybrid Transformation", description: "As a bonus action, you can transform into a monstrous hybrid form for up to 10 minutes, gaining a +1 bonus to AC, resistance to bludgeoning/piercing/slashing damage, and advantage on Strength checks/saves. You use unarmed strikes with claws that deal 1d6 slashing damage." },
            { level: 7, name: "Stalker's Prowess", description: "While transformed, your speed increases by 10 feet, and you gain a bonus to your Strength (Athletics) checks equal to your Intelligence modifier." },
            { level: 11, name: "Advanced Transformation", description: "Your hybrid form's attacks count as magical, and you regenerate hit points equal to 1 + your Intelligence modifier each turn." },
            { level: 15, name: "Iron Volition", description: "You gain advantage on saving throws against being charmed or frightened." }
          ]},
          "Order of the Mutant": { name: "Order of the Mutant", features: [
            { level: 3, name: "Formulas", description: "You learn four mutagen formulas, which allow you to create powerful alchemical concoctions with potent effects and side effects (mutagens)." },
            { level: 3, name: "Mutagencraft", description: "You can create one mutagen during a short or long rest. It remains potent for 1 hour." },
            { level: 7, name: "Strange Metabolism", description: "You gain immunity to poison and the poisoned condition. You can also ignore the negative side effects of a single mutagen." },
            { level: 11, name: "Robust Physiology", description: "You can use your reaction to expend a Hit Die and regain hit points equal to the roll + your Constitution modifier." },
            { level: 15, name: "Exalted Mutation", description: "Your mutagen effects are enhanced, and you can create an additional mutagen. The side effects of your mutagens are also reduced." }
          ]},
          "Order of the Profane Soul": { name: "Order of the Profane Soul", features: [
            { level: 3, name: "Otherworldly Patron", description: "You choose a patron (Archfey, Fiend, Great Old One, Celestial, etc.) and gain access to its associated spells." },
            { level: 7, name: "Mystic Frenzy", description: "When you use your action to cast a cantrip, you can make one weapon attack as a bonus action." },
            { level: 11, name: "Diabolic Channel", description: "You can imbue your weapon with a spell that has a casting time of 1 action. The spell must be from your pact magic feature. The next time you hit a creature with the weapon, the spell is cast on them." },
            { level: 15, name: "Blood Curse of the Souleater", description: "You gain a Blood Curse that allows you to regain an expended warlock spell slot when a cursed creature dies." }
          ]}
      }
  },
  "Cleric": {
    name: "Cleric",
    hitDie: 8,
    subclassLevel: 1,
    spellcasting: {
      ability: 'wis',
      cantripsKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      spellSlots: [
        // 1, 2, 3, 4, 5, 6, 7, 8, 9
        [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0],
        [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1]
      ]
    },
    features: [
      { level: 2, name: "Channel Divinity (1/rest)", description: "You gain the ability to channel divine energy directly from your deity. You get one use of this feature, which you regain on a short or long rest. You gain one effect: Turn Undead.", uses: { max: 1 }, recharge: 'short' },
      { level: 5, name: "Destroy Undead (CR 1/2)", description: "When an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below 1/2." },
      { level: 6, name: "Channel Divinity (2/rest)", description: "You can use your Channel Divinity twice between rests.", uses: { max: 2 }, recharge: 'short' },
      { level: 8, name: "Destroy Undead (CR 1)", description: "Your Destroy Undead feature now affects undead of CR 1 or lower." },
      { level: 10, name: "Divine Intervention", description: "As an action, you can implore your deity for aid. The DM chooses the nature of the intervention. If you succeed (roll d100 <= your cleric level), you can't use this feature again for 7 days. Otherwise, you can use it again after a long rest.", uses: { max: 1 }, recharge: 'long' },
      { level: 11, name: "Destroy Undead (CR 2)", description: "Your Destroy Undead feature now affects undead of CR 2 or lower." },
      { level: 14, name: "Destroy Undead (CR 3)", description: "Your Destroy Undead feature now affects undead of CR 3 or lower." },
      { level: 17, name: "Destroy Undead (CR 4)", description: "Your Destroy Undead feature now affects undead of CR 4 or lower." },
      { level: 18, name: "Channel Divinity (3/rest)", description: "You can use your Channel Divinity three times between rests.", uses: { max: 3 }, recharge: 'short' },
      { level: 20, name: "Divine Intervention Improvement", description: "Your call for intervention succeeds automatically, no roll needed." }
    ],
    subclasses: {
      "Arcana Domain": { name: "Arcana Domain", features: [
        { level: 1, name: "Arcane Initiate", description: "You gain proficiency in the Arcana skill, and you learn two cantrips of your choice from the wizard spell list. They count as cleric cantrips for you." },
        { level: 2, name: "Channel Divinity: Arcane Abjuration", description: "As an action, you can present your holy symbol and turn one celestial, elemental, fey, or fiend within 30 feet of you. The creature must make a Wisdom saving throw or be turned for 1 minute." },
        { level: 6, name: "Spell Breaker", description: "When you restore hit points to an ally with a spell of 1st level or higher, you can also end one spell of your choice on that creature. The level of the spell you end must be equal to or lower than the level of the spell slot you used." },
        { level: 8, name: "Potent Spellcasting", description: "You add your Wisdom modifier to the damage you deal with any cleric cantrip." },
        { level: 17, name: "Arcane Mastery", description: "You can choose one 6th, 7th, 8th, and 9th level wizard spell and add them to your domain spells. You can cast each of these once per long rest." }
      ]},
      "Death Domain": { name: "Death Domain", features: [
        { level: 1, name: "Bonus Proficiency", description: "You gain proficiency with martial weapons." },
        { level: 1, name: "Reaper", description: "You learn one necromancy cantrip from any spell list. When you cast a necromancy cantrip that targets only one creature, you can have it target two creatures within 5 feet of each other instead." },
        { level: 2, name: "Channel Divinity: Touch of Death", description: "When you hit a creature with a melee attack, you can use Channel Divinity to deal extra necrotic damage equal to 5 + twice your cleric level." },
        { level: 6, name: "Inescapable Destruction", description: "Your spells and Channel Divinity that deal necrotic damage ignore resistance to necrotic damage." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 necrotic damage. This damage increases to 2d8 at 14th level." },
        { level: 17, name: "Improved Reaper", description: "When you cast a necromancy spell of 1st through 5th level that targets only one creature, it can instead target two creatures within 5 feet of each other." }
      ]},
      "Forge Domain": { name: "Forge Domain", features: [
        { level: 1, name: "Bonus Proficiencies", description: "You gain proficiency with heavy armor and smith's tools." },
        { level: 1, name: "Blessing of the Forge", description: "After a long rest, you can touch one nonmagical weapon or suit of armor and imbue it with a +1 bonus to AC (if armor) or attack/damage rolls (if weapon) until your next long rest." },
        { level: 2, name: "Channel Divinity: Artisan's Blessing", description: "You can conduct an hour-long ritual to create a nonmagical item that is at least partly metal. The item can be worth up to 100 gp." },
        { level: 6, name: "Soul of the Forge", description: "You gain resistance to fire damage. While wearing heavy armor, you gain a +1 bonus to AC." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 fire damage. This damage increases to 2d8 at 14th level." },
        { level: 17, name: "Saint of Forge and Fire", description: "You gain immunity to fire damage. While wearing heavy armor, you have resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks." }
      ]},
      "Grave Domain": { name: "Grave Domain", features: [
        { level: 1, name: "Circle of Mortality", description: "You learn the Spare the Dying cantrip (range 30 ft, bonus action). When you cast a healing spell on a creature at 0 HP, it heals for the maximum possible amount." },
        { level: 1, name: "Eyes of the Grave", description: "As an action, you can detect the presence of undead within 60 feet until the end of your next turn. Usable a number of times equal to your WIS mod per long rest." },
        { level: 2, name: "Channel Divinity: Path to the Grave", description: "As an action, you can curse a creature within 30 feet. The next time that creature takes damage from an attack from you or an ally, it has vulnerability to that damage, and the curse ends." },
        { level: 6, name: "Sentinel at Death's Door", description: "As a reaction, when you or an ally you can see within 30 feet takes a critical hit, you can turn that hit into a normal hit." },
        { level: 8, name: "Potent Spellcasting", description: "You add your Wisdom modifier to the damage you deal with any cleric cantrip." },
        { level: 17, name: "Keeper of Souls", description: "When a hostile creature you can see dies within 30 feet of you, you or an ally of your choice within 30 feet regains hit points equal to the enemy's number of Hit Dice." }
      ]},
      "Knowledge Domain": { name: "Knowledge Domain", features: [
        { level: 1, name: "Blessings of Knowledge", description: "You learn two languages of your choice. You also become proficient in your choice of two skills from: Arcana, History, Nature, or Religion. Your proficiency bonus is doubled for these skills (expertise)." },
        { level: 2, name: "Channel Divinity: Knowledge of the Ages", description: "As an action, you can use your Channel Divinity to gain proficiency with one skill or tool for 10 minutes." },
        { level: 6, name: "Channel Divinity: Read Thoughts", description: "As an action, you can use your Channel Divinity to read a creature's thoughts for 1 minute (contested Insight vs. Deception). You can also cast Suggestion on the creature without expending a spell slot." },
        { level: 8, name: "Potent Spellcasting", description: "You add your Wisdom modifier to the damage you deal with any cleric cantrip." },
        { level: 17, name: "Visions of the Past", description: "You can call up visions of the past related to an object you hold or a place you are in. You can meditate for 1 minute to see recent events as if you were there." }
      ]},
      "Life Domain": { name: "Life Domain", features: [
          { level: 1, name: "Bonus Proficiency", description: "You gain proficiency with heavy armor." },
          { level: 1, name: "Disciple of Life", description: "Whenever you use a spell of 1st level or higher to restore hit points, the creature regains additional hit points equal to 2 + the spell's level." },
          { level: 2, name: "Channel Divinity: Preserve Life", description: "As an action, you can restore a number of hit points equal to 5 times your cleric level. You can divide these hit points among any creatures within 30 feet of you. Cannot heal a creature above half its maximum HP." },
          { level: 6, name: "Blessed Healer", description: "When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell's level." },
          { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage. This increases to 2d8 at 14th level." },
          { level: 17, name: "Supreme Healing", description: "When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die." }
      ]},
       "Light Domain": { name: "Light Domain", features: [
          { level: 1, name: "Bonus Cantrip", description: "You learn the Light cantrip if you don't already know it." },
          { level: 1, name: "Warding Flare", description: "When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll. You can use this a number of times equal to your Wisdom modifier per long rest.", uses: {max: 'wis'}, recharge: 'long' },
          { level: 2, name: "Channel Divinity: Radiance of the Dawn", description: "As an action, you can dispel any magical darkness within 30 feet. Additionally, each hostile creature within 30 feet of you must make a Constitution saving throw or take 2d10 + your cleric level in radiant damage." },
          { level: 6, name: "Improved Flare", description: "You can also use your Warding Flare feature when a creature that you can see within 30 feet of you attacks a creature other than you." },
          { level: 8, name: "Potent Spellcasting", description: "You add your Wisdom modifier to the damage you deal with any cleric cantrip." },
          { level: 17, name: "Corona of Light", description: "As an action, you can activate an aura of sunlight that lasts for 1 minute. You emit bright light in a 60-foot radius. Your enemies in the bright light have disadvantage on saving throws against any spell that deals fire or radiant damage." }
      ]},
      "Nature Domain": { name: "Nature Domain", features: [
        { level: 1, name: "Acolyte of Nature", description: "You learn one druid cantrip of your choice. You also gain proficiency in Animal Handling, Nature, or Survival." },
        { level: 1, name: "Bonus Proficiency", description: "You gain proficiency with heavy armor." },
        { level: 2, name: "Channel Divinity: Charm Animals and Plants", description: "As an action, you can use your Channel Divinity to charm any beast or plant creature that can see you within 30 feet. They are charmed for 1 minute." },
        { level: 6, name: "Dampen Elements", description: "As a reaction when you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can grant resistance to the creature against that instance of the damage." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can deal an extra 1d8 cold, fire, or lightning damage. This damage increases to 2d8 at 14th level." },
        { level: 17, name: "Master of Nature", description: "As a bonus action, you can command any creature charmed by your Charm Animals and Plants feature." }
      ]},
      "Order Domain": { name: "Order Domain", features: [
        { level: 1, name: "Bonus Proficiencies", description: "You gain proficiency with heavy armor and your choice of Intimidation or Persuasion." },
        { level: 1, name: "Voice of Authority", description: "When you cast a spell of 1st level or higher that targets an ally, that ally can use their reaction to make one weapon attack against a creature of your choice that you can see." },
        { level: 2, name: "Channel Divinity: Order's Demand", description: "As an action, each creature of your choice within 30 feet must make a Wisdom save. On a failed save, a creature drops whatever it is holding and is charmed by you for 1 minute." },
        { level: 6, name: "Embodiment of the Law", description: "You can cast an enchantment spell that has a casting time of 1 action as a bonus action instead, as long as you didn't cast another spell this turn other than a cantrip. You can do this a number of times equal to your WIS mod per long rest." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can deal an extra 1d8 psychic damage. This damage increases to 2d8 at 14th level." },
        { level: 17, name: "Order's Wrath", description: "When you deal your Divine Strike damage to a creature, the creature's allies within 10 feet of it take 1d8 psychic damage." }
      ]},
      "Peace Domain": { name: "Peace Domain", features: [
        { level: 1, name: "Implement of Peace", description: "You gain proficiency in the Insight, Performance, or Persuasion skill." },
        { level: 1, name: "Emboldening Bond", description: "As an action, you can bond a number of willing creatures up to your proficiency bonus for 10 minutes. When any bonded creature makes an attack roll, ability check, or saving throw, they can add a d4 to the roll. A creature can only use this once per turn." },
        { level: 2, name: "Channel Divinity: Balm of Peace", description: "As an action, you can move up to your speed, and heal each creature of your choice within 5 feet of you for 2d6 + your Wisdom modifier. This doesn't provoke opportunity attacks." },
        { level: 6, name: "Protective Bond", description: "When a creature with your Emboldening Bond is about to take damage, a second bonded creature within 30 feet can use its reaction to teleport to within 5 feet of the first and take all of that damage instead." },
        { level: 8, name: "Potent Spellcasting", description: "You add your Wisdom modifier to the damage you deal with any cleric cantrip." },
        { level: 17, name: "Expansive Bond", description: "The range of your Emboldening Bond and Protective Bond increases to 60 feet. When a creature uses Protective Bond to take another's damage, they have resistance to that damage." }
      ]},
      "Tempest Domain": { name: "Tempest Domain", features: [
        { level: 1, name: "Bonus Proficiencies", description: "You gain proficiency with martial weapons and heavy armor." },
        { level: 1, name: "Wrath of the Storm", description: "As a reaction when a creature within 5 feet of you hits you with an attack, you can cause it to make a Dexterity save. It takes 2d8 lightning or thunder damage on a failed save, half on a success. Usable a number of times equal to your WIS mod per long rest." },
        { level: 2, name: "Channel Divinity: Destructive Wrath", description: "When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling." },
        { level: 6, name: "Thunderbolt Strike", description: "When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can deal an extra 1d8 thunder damage. This damage increases to 2d8 at 14th level." },
        { level: 17, name: "Stormborn", description: "You gain a flying speed equal to your current walking speed whenever you are not underground or indoors." }
      ]},
      "Trickery Domain": { name: "Trickery Domain", features: [
        { level: 1, name: "Blessing of the Trickster", description: "As an action, you can touch a willing creature other than yourself to give it advantage on Dexterity (Stealth) checks for 1 hour or until you use this feature again." },
        { level: 2, name: "Channel Divinity: Invoke Duplicity", description: "As an action, you create a perfect illusion of yourself that lasts for 1 minute (concentration). As a bonus action, you can move the illusion. You can cast spells as though you were in the illusion's space. You also gain advantage on attacks if both you and your illusion are within 5 feet of the target." },
        { level: 6, name: "Channel Divinity: Cloak of Shadows", description: "As an action, you can use your Channel Divinity to become invisible until the end of your next turn. You become visible if you attack or cast a spell." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can deal an extra 1d8 poison damage. This damage increases to 2d8 at 14th level." },
        { level: 17, name: "Improved Duplicity", description: "You can create up to four duplicates of yourself instead of one when you use Invoke Duplicity." }
      ]},
      "Twilight Domain": { name: "Twilight Domain", features: [
        { level: 1, name: "Bonus Proficiencies", description: "You gain proficiency with martial weapons and heavy armor." },
        { level: 1, name: "Eyes of Night", description: "You have darkvision out to 300 feet. As an action, you can magically share this darkvision with willing creatures you can see within 10 feet for 1 hour." },
        { level: 1, name: "Vigilant Blessing", description: "As an action, you give one creature you touch (including yourself) advantage on the next initiative roll it makes." },
        { level: 2, name: "Channel Divinity: Twilight Sanctuary", description: "As an action, you create a 30-foot-radius sphere of twilight for 1 minute. When a creature (including you) ends its turn in the sphere, you can grant it 1d6 + your cleric level in temporary hit points or end one effect causing it to be charmed or frightened." },
        { level: 6, name: "Steps of Night", description: "As a bonus action while in dim light or darkness, you can give yourself a flying speed equal to your walking speed for 1 minute. Usable a number of times equal to your proficiency bonus per long rest." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can deal an extra 1d8 radiant damage. This damage increases to 2d8 at 14th level." },
        { level: 17, name: "Twilight Shroud", description: "Your Twilight Sanctuary grants allies half cover while inside it." }
      ]},
      "War Domain": { name: "War Domain", features: [
        { level: 1, name: "Bonus Proficiencies", description: "You gain proficiency with martial weapons and heavy armor." },
        { level: 1, name: "War Priest", description: "When you use the Attack action, you can make one weapon attack as a bonus action. Usable a number of times equal to your Wisdom modifier per long rest." },
        { level: 2, name: "Channel Divinity: Guided Strike", description: "When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses." },
        { level: 6, name: "Channel Divinity: War God's Blessing", description: "As a reaction when a creature within 30 feet of you makes an attack roll, you can grant that creature a +10 bonus to the roll." },
        { level: 8, name: "Divine Strike", description: "Once on each of your turns when you hit a creature with a weapon attack, you can deal extra damage of the same type as the weapon. The damage is 1d8, increasing to 2d8 at 14th level." },
        { level: 17, name: "Avatar of Battle", description: "You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks." }
      ]},
    }
  },
  "Druid": {
    name: "Druid",
    hitDie: 8,
    subclassLevel: 2,
    spellcasting: {
      ability: 'wis',
      cantripsKnown: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
      spellSlots: [
        // 1, 2, 3, 4, 5, 6, 7, 8, 9
        [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0],
        [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1]
      ]
    },
    features: [
      { level: 2, name: "Wild Shape", description: "As an action, you can transform into a beast you have seen before. Your beast form's CR cannot be higher than 1/4 and it cannot have a flying or swimming speed. You can use this feature twice per short or long rest.", uses: { max: 2 }, recharge: 'short' },
      { level: 4, name: "Wild Shape Improvement", description: "Your beast form's max CR increases to 1/2 and it can have a swimming speed."},
      { level: 8, name: "Wild Shape Improvement", description: "Your beast form's max CR increases to 1 and it can have a flying speed."},
      { level: 18, name: "Timeless Body", description: "For every 10 years that pass, your body ages only 1 year."},
      { level: 18, name: "Beast Spells", description: "You can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast form, but you aren't able to provide material components."},
      { level: 20, name: "Archdruid", description: "You can use your Wild Shape an unlimited number of times. You can also ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren't consumed by a spell."}
    ],
    subclasses: {
      "Circle of Dreams": { name: "Circle of Dreams", features: [
        { level: 2, name: "Balm of the Summer Court", description: "As a bonus action, you can heal a creature you can see within 120 feet of you. You have a pool of d6s equal to your druid level. You can spend dice from this pool to heal, up to a maximum of half your druid level in dice at once." },
        { level: 6, name: "Hearth of Moonlight and Shadow", description: "During a short or long rest, you can create a 30-foot-radius sphere of magical protection. This area is lightly obscured, provides +5 to Perception and Stealth checks for allies, and blocks sound from escaping." },
        { level: 10, name: "Hidden Paths", description: "As a bonus action, you can teleport up to 60 feet to an unoccupied space you can see. Usable a number of times equal to your WIS mod per long rest." },
        { level: 14, name: "Walker in Dreams", description: "You can cast Dream, Scrying, or Teleportation Circle once without expending a spell slot as part of a long rest. The casting time becomes 1 minute." }
      ]},
      "Circle of the Land": {
        name: "Circle of the Land",
        features: [
          { level: 2, name: "Bonus Cantrip", description: "You learn one additional druid cantrip of your choice." },
          { level: 2, name: "Natural Recovery", description: "During a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can't use this feature again until you finish a long rest." },
          { level: 3, name: "Circle Spells", description: "You gain access to circle spells connected to a chosen land type (Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, Underdark). These spells are always prepared." },
          { level: 6, name: "Land's Stride", description: "Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed or taking damage from them." },
          { level: 10, name: "Nature's Ward", description: "You can't be charmed or frightened by elementals or fey, and you are immune to poison and disease." },
          { level: 14, name: "Nature's Sanctuary", description: "When a beast or plant creature attacks you, that creature must make a Wisdom saving throw. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours." }
        ]
      },
      "Circle of the Moon": {
        name: "Circle of the Moon",
        features: [
          { level: 2, name: "Combat Wild Shape", description: "You can use Wild Shape as a Bonus Action. As a bonus action while transformed, you can expend one spell slot to regain 1d8 hit points per level of the spell slot." },
          { level: 2, name: "Circle Forms", description: "Your Wild Shape forms can have a CR as high as 1. Starting at 6th level, you can transform into a beast with a challenge rating as high as your druid level divided by 3, rounded down."},
          { level: 6, name: "Primal Strike", description: "Your attacks in beast form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage."},
          { level: 10, name: "Elemental Wild Shape", description: "You can expend two uses of Wild Shape at the same time to transform into an air, earth, fire, or water elemental."},
          { level: 14, name: "Thousand Forms", description: "You can cast the Alter Self spell at will."}
        ]
      },
      "Circle of the Shepherd": { name: "Circle of the Shepherd", features: [
        { level: 2, name: "Speech of the Woods", description: "You learn Sylvan and can speak with beasts as if you were under the effects of a speak with animals spell." },
        { level: 2, name: "Spirit Totem", description: "As a bonus action, you can magically summon an incorporeal spirit to a point you can see within 60 feet. The spirit creates a 30-foot aura. Choose Bear (temp HP & ADV on STR checks), Hawk (ADV on Perception & reaction attack), or Unicorn (healing)." },
        { level: 6, name: "Mighty Summoner", description: "Beasts and fey that you conjure have +2 HP per hit die and their attacks count as magical." },
        { level: 10, name: "Guardian Spirit", description: "Your summoned creatures that are within your Spirit Totem aura regain hit points equal to half your druid level at the start of their turn." },
        { level: 14, name: "Faithful Summons", description: "If you are reduced to 0 hit points or are incapacitated against your will, you can immediately cast conjure animals as if it were cast with a 9th-level spell slot. It summons four beasts of your choice that are challenge rating 2 or lower. They appear within 20 feet of you and protect you." }
      ]},
      "Circle of Spores": { name: "Circle of Spores", features: [
        { level: 2, name: "Circle Spells", description: "You learn the chill touch cantrip. You also gain access to certain spells like animate dead, which are always prepared." },
        { level: 2, name: "Halo of Spores", description: "As a reaction when a creature you can see starts its turn within 10 feet of you, you can deal 1d4 poison damage to it. This damage increases as you gain levels." },
        { level: 2, name: "Symbiotic Entity", description: "As an action, you can expend a use of Wild Shape to awaken your spores. You gain 4 temporary hit points per druid level, your Halo of Spores deals double damage, and your melee weapon attacks deal an extra 1d6 poison damage. This lasts for 10 minutes." },
        { level: 6, name: "Fungal Infestation", description: "As a reaction when a beast or humanoid dies within 10 feet of you, you can animate its corpse. It becomes a zombie with 1 hit point that lasts for 1 hour." },
        { level: 10, name: "Spreading Spores", description: "As a bonus action while your Symbiotic Entity feature is active, you can hurl a cloud of spores up to 30 feet away which deals your Halo of Spores damage in a 10-foot cube." },
        { level: 14, name: "Fungal Body", description: "You become immune to being blinded, deafened, frightened, and poisoned. Any critical hit against you becomes a normal hit." }
      ]},
      "Circle of Stars": { name: "Circle of Stars", features: [
        { level: 2, name: "Star Map", description: "You've created a star map which acts as your spellcasting focus. You learn the Guidance cantrip and gain Guiding Bolt as a prepared spell." },
        { level: 2, name: "Starry Form", description: "As a bonus action, you can expend a use of Wild Shape to take on a starry form for 10 minutes. While in this form, you can choose one of three constellations to gain a benefit: Archer (bonus action ranged spell attack), Chalice (bonus healing when casting a healing spell), or Dragon (maintain concentration on a save of 9 or lower)." },
        { level: 6, name: "Cosmic Omen", description: "When you finish a long rest, you can roll a d6. You gain a special reaction based on whether you rolled an even (Weal) or odd (Woe) number. You can use this reaction to add or subtract a d6 from a creature's attack, save, or check." },
        { level: 10, name: "Twinkling Constellations", description: "Your Starry Form constellations become more powerful. For example, the Dragon constellation also gives you a flying speed of 20 feet." },
        { level: 14, name: "Full of Stars", description: "While in your Starry Form, you become partially incorporeal and have resistance to bludgeoning, piercing, and slashing damage." }
      ]},
      "Circle of Wildfire": { name: "Circle of Wildfire", features: [
        { level: 2, name: "Circle Spells", description: "You gain access to certain fire-themed spells like Burning Hands and Fireball, which are always prepared." },
        { level: 2, name: "Summon Wildfire Spirit", description: "As an action, you can expend one use of your Wild Shape feature to summon a wildfire spirit for 1 hour. It has its own stats and acts on your turn. It can teleport and take its own Fire Seed action." },
        { level: 6, name: "Enhanced Bond", description: "When you cast a spell that deals fire damage or restores hit points while your spirit is summoned, you can add 1d8 to one damage or healing roll of the spell." },
        { level: 10, name: "Cauterizing Flames", description: "When a creature dies within 30 feet of you or your spirit, a spectral flame springs forth. As a reaction, you can use this flame to heal or damage another creature within 5 feet of it." },
        { level: 14, name: "Blazing Revival", description: "If your wildfire spirit is within 120 feet of you when you are reduced to 0 hit points, you can cause the spirit to drop to 0 hit points. You then return to 1 hit point and rise to your feet." }
      ]},
    }
  },
  "Fighter": {
    name: "Fighter",
    hitDie: 10,
    subclassLevel: 3,
    features: [
      { level: 1, name: "Fighting Style", description: "Choose a fighting style: Archery (+2 to ranged attacks), Blind Fighting (blindsight), Defense (+1 AC), Dueling (+2 damage with one-handed weapon), Great Weapon Fighting (reroll 1s and 2s on damage), Interception (reaction to reduce ally damage), Protection (reaction to impose disadvantage), Superior Technique (gain one maneuver), Thrown Weapon Fighting (+2 damage), Two-Weapon Fighting (add ability mod to off-hand attack), Unarmed Fighting (d6/d8 unarmed damage)." },
      { level: 1, name: "Second Wind", description: "As a bonus action, you can regain hit points equal to 1d10 + your fighter level.", uses: { max: 1 }, recharge: 'short' },
      { level: 2, name: "Action Surge (1 use)", description: "On your turn, you can take one additional action.", uses: { max: 1 }, recharge: 'short' },
      { level: 5, name: "Extra Attack (1)", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
      { level: 9, name: "Indomitable (1 use)", description: "You can reroll a saving throw that you fail. If you do so, you must use the new roll.", uses: { max: 1 }, recharge: 'long' },
      { level: 11, name: "Extra Attack (2)", description: "You can attack three times when you take the Attack action." },
      { level: 13, name: "Indomitable (2 uses)", description: "You can use Indomitable twice per long rest.", uses: { max: 2 }, recharge: 'long' },
      { level: 17, name: "Action Surge (2 uses)", description: "You can use Action Surge twice before a rest, but only once on the same turn.", uses: { max: 2 }, recharge: 'short' },
      { level: 17, name: "Indomitable (3 uses)", description: "You can use Indomitable three times per long rest.", uses: { max: 3 }, recharge: 'long' },
      { level: 20, name: "Extra Attack (3)", description: "You can attack four times when you take the Attack action." }
    ],
    subclasses: {
      "Arcane Archer": { name: "Arcane Archer", features: [
        { level: 3, name: "Arcane Archer Lore", description: "You gain proficiency in Arcana or Nature, and you learn either Prestidigitation or Druidcraft." },
        { level: 3, name: "Arcane Shot", description: "You can create magical effects on some of your arrows. You learn two Arcane Shot options. When you fire an arrow, you can apply one of your options. You can use this twice per short rest." },
        { level: 7, name: "Magic Arrow", description: "Every arrow you fire from a shortbow or longbow is magical." },
        { level: 7, name: "Curving Shot", description: "When you miss with a magic arrow attack, you can use a bonus action to reroll the attack against a different target within 60 feet." },
        { level: 18, name: "Ever-Ready Shot", description: "If you have no uses of Arcane Shot left at the start of your turn, you regain one use." }
      ]},
      "Banneret": { name: "Banneret", features: [
        { level: 3, name: "Rallying Cry", description: "When you use your Second Wind, you can choose up to three allies within 60 feet. Each one regains hit points equal to your fighter level." },
        { level: 7, name: "Royal Envoy", description: "You gain proficiency in Persuasion. If already proficient, you gain expertise." },
        { level: 10, name: "Inspiring Surge", description: "When you use your Action Surge, you can choose one ally within 60 feet. That ally can use its reaction to make one melee or ranged weapon attack." },
        { level: 15, name: "Bulwark", description: "When you use your Indomitable feature to reroll a saving throw and succeed, you can choose an ally within 60 feet to also succeed on their saving throw against the same effect." }
      ]},
      "Battle Master": {
        name: "Battle Master",
        features: [
          { level: 3, name: "Combat Superiority", description: "You gain a set of superiority dice (d8s). You start with four dice and gain more at higher levels. You can expend a die to use various maneuvers to control the battlefield or enhance your attacks.", uses: {max: 4}, recharge: 'short' },
          { level: 3, name: "Student of War", description: "You gain proficiency with one type of artisan's tools of your choice."},
          { level: 7, name: "Know Your Enemy", description: "After observing or interacting with a creature for 1 minute, you can learn if it is your equal, superior, or inferior in regard to two characteristics of your choice (e.g., STR score, AC, Current HP)."},
          { level: 10, name: "Improved Combat Superiority (d10)", description: "Your superiority dice turn into d10s."},
          { level: 15, name: "Relentless", description: "When you roll initiative and have no superiority dice remaining, you regain 1 superiority die."},
          { level: 18, name: "Improved Combat Superiority (d12)", description: "Your superiority dice turn into d12s."}
        ]
      },
      "Cavalier": { name: "Cavalier", features: [
        { level: 3, name: "Bonus Proficiency", description: "You gain proficiency in Animal Handling or one of several social skills." },
        { level: 3, name: "Born to the Saddle", description: "You have advantage on saves to avoid falling off your mount. Mounting or dismounting costs only 5 feet of movement." },
        { level: 3, name: "Unwavering Mark", description: "When you hit a creature, you can mark it. The marked creature has disadvantage on attacks against anyone but you. If the marked creature deals damage to someone else, you can make a special bonus action attack against it on your next turn." },
        { level: 7, name: "Warding Maneuver", description: "As a reaction when you or an ally within 5 feet is hit by an attack, you can increase the target's AC by 1d8, potentially causing the attack to miss. Usable a number of times equal to your CON mod per long rest." },
        { level: 10, name: "Hold the Line", description: "Creatures provoke an opportunity attack from you when they move while within your reach, and if you hit, their speed becomes 0 for the rest of the turn." },
        { level: 15, name: "Ferocious Charger", description: "If you move at least 10 feet in a straight line before hitting a creature, it must succeed on a Strength save or be knocked prone." },
        { level: 18, name: "Vigilant Defender", description: "You can make an opportunity attack on every creature's turn, not just your own." }
      ]},
      "Champion": {
        name: "Champion",
        features: [
          { level: 3, name: "Improved Critical", description: "Your weapon attacks score a critical hit on a roll of 19 or 20." },
          { level: 7, name: "Remarkable Athlete", description: "You can add half your proficiency bonus to any Strength, Dexterity, or Constitution check you make that doesn't already use your proficiency bonus. In addition, when you make a running long jump, the distance you can cover increases by a number of feet equal to half your Strength modifier."},
          { level: 10, name: "Additional Fighting Style", description: "You can choose a second option from the Fighting Style class feature."},
          { level: 15, name: "Superior Critical", description: "Your weapon attacks score a critical hit on a roll of 18-20."},
          { level: 18, name: "Survivor", description: "At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don't gain this benefit if you have 0 hit points."}
        ]
      },
      "Echo Knight": { name: "Echo Knight", features: [
        { level: 3, name: "Manifest Echo", description: "As a bonus action, you can manifest an echo of yourself in an unoccupied space within 15 feet. It has 1 HP, an AC of 14 + your proficiency bonus, and uses your saving throws. You can swap places with it, and make attacks as if you were in its space. You can manifest it a number of times equal to your CON mod per long rest." },
        { level: 7, name: "Echo Avatar", description: "As an action, you can transfer your consciousness to your echo, perceiving through its senses for up to 10 minutes." },
        { level: 10, name: "Shadow Martyr", description: "As a reaction when an ally you can see within 5 feet of your echo is hit by an attack, you can have your echo teleport and take the hit instead." },
        { level: 15, name: "Reclaim Potential", description: "When your echo is destroyed by taking damage, you gain temporary hit points equal to 2d6 + your Constitution modifier." },
        { level: 18, name: "Legion of One", description: "You can have two echoes at once. When you use your Action Surge, you can make one additional attack from each of your echoes' positions." }
      ]},
      "Eldritch Knight": { 
        name: "Eldritch Knight",
        spellcasting: {
            ability: 'int',
            cantripsKnown: [0,0,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3],
            spellsKnown: [0,0,3,4,4,4,5,6,6,7,8,8,9,10,10,11,11,11,12,13],
            spellSlots: [
                // 1, 2, 3, 4
                [0,0,0,0],[0,0,0,0],[2,0,0,0],[3,0,0,0],[3,0,0,0],[3,0,0,0],[4,2,0,0],[4,2,0,0],[4,2,0,0],[4,3,0,0],
                [4,3,0,0],[4,3,0,0],[4,3,2,0],[4,3,2,0],[4,3,2,0],[4,3,3,0],[4,3,3,0],[4,3,3,0],[4,3,3,1],[4,3,3,1]
            ]
        },
        features: [
        { level: 3, name: "Weapon Bond", description: "As a 1-hour ritual, you can bond with up to two weapons. You can't be disarmed of a bonded weapon, and you can summon it to your hand as a bonus action." },
        { level: 7, name: "War Magic", description: "When you use your action to cast a cantrip, you can make one weapon attack as a bonus action." },
        { level: 10, name: "Eldritch Strike", description: "When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn." },
        { level: 15, name: "Arcane Charge", description: "When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see before or after the additional action." },
        { level: 18, name: "Improved War Magic", description: "When you use your action to cast a spell, you can make one weapon attack as a bonus action." }
      ]},
      "Psi Warrior": { name: "Psi Warrior", features: [
        { level: 3, name: "Psionic Power", description: "You harbor a wellspring of psionic energy, represented by Psionic Energy dice. You start with a number of d6s equal to twice your proficiency bonus." },
        { level: 3, name: "Protective Field", description: "As a reaction when you or an ally within 30 feet takes damage, you can expend one Psionic Energy die and reduce the damage taken by the number rolled plus your Intelligence modifier." },
        { level: 7, name: "Psionic Strike", description: "Once per turn when you hit with a weapon, you can expend one Psionic Energy die to deal extra force damage equal to the number rolled plus your Intelligence modifier." },
        { level: 10, name: "Telekinetic Movement", description: "As an action, you can move an object or a creature with your mind up to 30 feet. An unwilling creature must succeed on a Strength saving throw." },
        { level: 15, name: "Guarded Mind", description: "You have resistance to psychic damage. As an action, you can end one effect on you that is causing you to be charmed or frightened." },
        { level: 18, name: "Bulwark of Force", description: "As a bonus action, you can choose creatures within 30 feet to grant them half cover for 1 minute. You must maintain concentration." }
      ]},
      "Rune Knight": { name: "Rune Knight", features: [
        { level: 3, name: "Bonus Proficiencies", description: "You gain proficiency with smith's tools and learn to speak, read, and write Giant." },
        { level: 3, name: "Rune Carver", description: "You learn to inscribe runes onto your equipment. You know two runes and learn more at higher levels. Each rune provides a passive benefit and can be invoked for an active effect once per short rest." },
        { level: 3, name: "Giant's Might", description: "As a bonus action, you can magically gain the might of a giant for 1 minute. You become Large, gain advantage on Strength checks and saving throws, and deal an extra 1d6 damage once on your turn. Usable a number of times equal to your proficiency bonus per long rest." },
        { level: 7, name: "Runic Shield", description: "As a reaction when an ally within 60 feet is hit by an attack, you can force the attacker to reroll the d20 and use the new roll. Usable a number of times equal to your proficiency bonus per long rest." },
        { level: 10, name: "Great Stature", description: "Your Giant's Might damage increases to 1d8. Your height also increases by 3d4 inches." },
        { level: 15, name: "Master of Runes", description: "You can invoke each rune you know twice, instead of once, between rests." },
        { level: 18, name: "Runic Juggernaut", description: "Your Giant's Might damage increases to 1d10, and your reach increases by 5 feet while it's active." }
      ]},
      "Samurai": { name: "Samurai", features: [
        { level: 3, name: "Bonus Proficiency", description: "You gain proficiency in History, Insight, Performance, or Persuasion." },
        { level: 3, name: "Fighting Spirit", description: "As a bonus action, you can give yourself 5 temporary HP and advantage on all weapon attack rolls until the end of the current turn. The temporary HP increases to 10 at 10th level and 15 at 15th level. Usable 3 times per long rest." },
        { level: 7, name: "Elegant Courtier", description: "You can add your Wisdom modifier to any Charisma (Persuasion) check you make. You also gain proficiency in Wisdom saving throws." },
        { level: 10, name: "Tireless Spirit", description: "When you roll initiative and have no uses of Fighting Spirit left, you regain one use." },
        { level: 15, name: "Rapid Strike", description: "If you take the Attack action and have advantage on an attack roll against a target, you can forgo that advantage to make one additional weapon attack against that same target as part of the same action." },
        { level: 18, name: "Strength before Death", description: "If you take damage that would reduce you to 0 hit points, you can use your reaction to delay falling unconscious and immediately take an extra turn. If you still have 0 HP after that extra turn, you fall unconscious." }
      ]},
    }
  },
   "Monk": {
    name: "Monk",
    hitDie: 8,
    subclassLevel: 3,
    features: [
      { level: 1, name: "Unarmored Defense", description: "While not wearing armor or a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier." },
      { level: 1, name: "Martial Arts", description: "You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons. You can roll a d4 in place of the normal damage, and this die size increases as you gain monk levels. When you use the Attack action with an unarmed strike or a monk weapon, you can make one unarmed strike as a bonus action." },
      { level: 2, name: "Ki", description: "You have a pool of Ki points equal to your monk level, which you can spend on various abilities. You regain all expended Ki on a short or long rest.", uses: { max: 'level' }, recharge: 'short' },
      { level: 2, name: "Unarmored Movement", description: "Your speed increases by 10 feet. This bonus increases as you gain monk levels."},
      { level: 3, name: "Deflect Missiles", description: "As a reaction when you are hit by a ranged weapon attack, you can reduce the damage by 1d10 + your Dexterity modifier + your monk level. If you reduce the damage to 0, you can catch the missile and spend 1 ki point to make a ranged attack with it." },
      { level: 4, name: "Slow Fall", description: "As a reaction when you fall, you can reduce any falling damage you take by an amount equal to five times your monk level."},
      { level: 5, name: "Extra Attack", description: "You can attack twice, instead of once, when taking the Attack action on your turn." },
      { level: 5, name: "Stunning Strike", description: "When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn." },
      { level: 6, name: "Ki-Empowered Strikes", description: "Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage." },
      { level: 7, name: "Evasion", description: "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed, and only half damage if you fail." },
      { level: 10, name: "Purity of Body", description: "You are immune to disease and poison." },
      { level: 13, name: "Tongue of the Sun and Moon", description: "You can understand all spoken languages, and any creature that can understand a language can understand what you say." },
      { level: 14, name: "Diamond Soul", description: "You gain proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result." },
      { level: 15, name: "Timeless Body", description: "You no longer suffer the frailty of old age, can't be aged magically, and no longer need food or water." },
      { level: 18, name: "Empty Body", description: "You can spend 4 ki points to become invisible for 1 minute (action). You can also spend 8 ki points to cast the Astral Projection spell without material components (action)." },
      { level: 20, name: "Perfect Self", description: "When you roll for initiative and have no ki points remaining, you regain 4 ki points." }
    ],
    subclasses: {
       "Way of Mercy": { name: "Way of Mercy", features: [
         { level: 3, name: "Implements of Mercy", description: "You gain proficiency in Insight, Medicine, and with the herbalism kit." },
         { level: 3, name: "Hand of Healing", description: "When you use your Flurry of Blows, you can replace one unarmed strike with a healing touch, restoring HP equal to a roll of your Martial Arts die + your WIS modifier." },
         { level: 3, name: "Hand of Harm", description: "When you hit a creature with an unarmed strike, you can spend 1 ki point to deal extra necrotic damage equal to a roll of your Martial Arts die + your WIS modifier." },
         { level: 6, name: "Physician's Touch", description: "When you use Hand of Healing on a creature, you can also end one disease or one condition (blinded, deafened, paralyzed, poisoned, or stunned)." },
         { level: 11, name: "Flurry of Healing and Harm", description: "You can now use Hand of Healing and Hand of Harm as part of the same Flurry of Blows. When you use Flurry of Blows, you can replace each of the unarmed strikes with a use of your Hand of Healing." },
         { level: 17, name: "Hand of Ultimate Mercy", description: "As an action, you can touch a creature that has died within the last 24 hours. You spend 5 ki points, and the creature returns to life with 4d10 + your WIS modifier HP." }
       ]},
       "Way of the Ascendant Dragon": { name: "Way of the Ascendant Dragon", features: [
         { level: 3, name: "Draconic Disciple", description: "You can channel draconic power. You learn Draconic, and can reroll a failed Charisma (Intimidation) or (Persuasion) check by using your reaction." },
         { level: 3, name: "Breath of the Dragon", description: "When you take the Attack action, you can replace one of your attacks with an exhalation of draconic energy in a 20-foot cone (or 30-ft line). Damage is 2x your Martial Arts die. Usable a number of times equal to your proficiency bonus per long rest." },
         { level: 6, name: "Wings Unfurled", description: "When you use your Step of the Wind, you can unfurl spectral dragon wings that grant you a flying speed equal to your walking speed for the turn." },
         { level: 11, name: "Aspect of the Wyrm", description: "As a bonus action, you can spend 3 ki points to create an aura of draconic power that radiates 10 feet from you for 1 minute. Choose an aura of either draconic dread (frighten enemies) or draconic resistance (grant allies resistance)." },
         { level: 17, name: "Ascendant Aspect", description: "You gain blindsight of 30 feet. Your Breath of the Dragon is more powerful (damage is 3x Martial Arts die), and you can create an explosion of draconic energy when you use your Aspect of the Wyrm." }
       ]},
       "Way of the Astral Self": { name: "Way of the Astral Self", features: [
         { level: 3, name: "Arms of the Astral Self", description: "As a bonus action, you can spend 1 ki point to summon the arms of your astral self for 10 minutes. You can use your Wisdom modifier instead of Strength for Strength checks and saves, and your unarmed strikes can use these spectral arms, which have a reach of 10 feet and deal force damage." },
         { level: 6, name: "Visage of the Astral Self", description: "As a bonus action for 1 ki point, you can summon the visage of your astral self for 10 minutes. You gain advantage on Wisdom (Insight) and Charisma (Intimidation) checks, and can see in magical and non-magical darkness up to 120 feet." },
         { level: 11, name: "Body of the Astral Self", description: "When you have both your astral arms and visage summoned, you can spend 1 ki point to summon the full body of your astral self. You can deflect or catch ranged spell attacks with a reaction, reducing damage by 1d10 + your WIS modifier + your monk level. Your unarmed strikes also deal an extra Martial Arts die of damage." },
         { level: 17, name: "Awakened Astral Self", description: "Your connection to your astral self is complete. You gain a +2 bonus to AC while your astral self is summoned. When you use the Attack action and have your astral arms summoned, you can make three attacks instead of two." }
       ]},
       "Way of the Drunken Master": { name: "Way of the Drunken Master", features: [
         { level: 3, name: "Bonus Proficiencies", description: "You gain proficiency in Performance and with brewer's supplies." },
         { level: 3, name: "Drunken Technique", description: "When you use your Flurry of Blows, you gain the benefit of the Disengage action and your walking speed increases by 10 feet until the end of your turn." },
         { level: 6, name: "Tipsy Sway", description: "You can move in sudden, swaying ways. You gain two benefits: Leap to Your Feet (stand up from prone for 5 ft of movement) and Redirect Attack (reaction to cause a missed melee attack against you to hit another creature within 5 feet)." },
         { level: 11, name: "Drunkard's Luck", description: "When you make an ability check, an attack roll, or a saving throw with disadvantage, you can spend 2 ki points to cancel the disadvantage for that roll." },
         { level: 17, name: "Intoxicated Frenzy", description: "When you use your Flurry of Blows, you can make up to three additional attacks with it (for a total of five), provided that each Flurry of Blows attack targets a different creature this turn." }
       ]},
       "Way of the Four Elements": { name: "Way of the Four Elements", features: [
         { level: 3, name: "Disciple of the Elements", description: "You learn magical disciplines that harness the power of the four elements. You learn the Elemental Attunement discipline and one other elemental discipline of your choice. You learn additional disciplines at higher levels. Using a discipline requires you to spend ki points." },
         { level: 6, name: "Additional Discipline", description: "You learn one additional elemental discipline of your choice." },
         { level: 11, name: "Additional Discipline", description: "You learn one additional elemental discipline of your choice." },
         { level: 17, name: "Additional Discipline", description: "You learn one additional elemental discipline of your choice." }
       ]},
       "Way of the Kensei": { name: "Way of the Kensei", features: [
         { level: 3, name: "Path of the Kensei", description: "You choose two types of weapons to be your kensei weapons: one melee and one ranged. These weapons count as monk weapons for you. You gain proficiency if you don't have it." },
         { level: 3, name: "Agile Parry", description: "If you make an unarmed strike as part of the Attack action and are holding a kensei weapon, you can use it to defend yourself, gaining a +2 bonus to AC until the start of your next turn." },
         { level: 6, name: "One with the Blade", description: "Your attacks with kensei weapons count as magical. As a bonus action, you can spend 1 ki point to have your kensei weapon deal extra damage equal to your Martial Arts die for 1 minute." },
         { level: 11, name: "Sharpen the Blade", description: "As a bonus action, you can expend up to 3 ki points to grant a kensei weapon a bonus to attack and damage rolls equal to the number of ki points you spent. This bonus lasts for 1 minute." },
         { level: 17, name: "Unerring Accuracy", description: "Once on each of your turns, if you miss with an attack roll using a monk weapon, you can reroll it." }
       ]},
       "Way of the Long Death": { name: "Way of the Long Death", features: [
         { level: 3, name: "Touch of Death", description: "When you reduce a creature within 5 feet of you to 0 hit points, you gain temporary hit points equal to your Wisdom modifier + your monk level." },
         { level: 6, name: "Hour of Reaping", description: "As an action, you can frighten creatures within 30 feet of you until the end of your next turn if they fail a Wisdom saving throw." },
         { level: 11, name: "Mastery of Death", description: "When you are reduced to 0 hit points, you can expend 1 ki point (no action required) to have 1 hit point instead." },
         { level: 17, name: "Touch of the Long Death", description: "As an action, you can touch one creature and expend 1 to 10 ki points. The target must make a Constitution saving throw and takes 2d10 necrotic damage per ki point spent on a failed save, or half as much on a successful one." }
       ]},
       "Way of the Open Hand": { name: "Way of the Open Hand", features: [
          { level: 3, name: "Open Hand Technique", description: "When you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects: it must succeed on a Dexterity save or be knocked prone; it must make a Strength save or you can push it up to 15 feet away; it can't take reactions until the end of your next turn." },
          { level: 6, name: "Wholeness of Body", description: "As an action, you can regain hit points equal to three times your monk level.", uses: {max: 1}, recharge: 'long' },
          { level: 11, name: "Tranquility", description: "At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest (the spell can end early as normal)." },
          { level: 17, name: "Quivering Palm", description: "When you hit a creature with an unarmed strike, you can spend 3 ki points to start imperceptible vibrations, which last for a number of days equal to your monk level. As an action, you can end these vibrations. The target must make a Constitution saving throw. On a failed save, it is reduced to 0 hit points. On a successful save, it takes 10d10 necrotic damage."}
        ] },
       "Way of Shadow": { name: "Way of Shadow", features: [
         { level: 3, name: "Shadow Arts", description: "You can use your ki to duplicate the effects of certain spells. As an action, you can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence, without providing material components." },
         { level: 6, name: "Shadow Step", description: "When you are in dim light or darkness, as a bonus action you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You then have advantage on the first melee attack you make before the end of the turn." },
         { level: 11, name: "Cloak of Shadows", description: "When you are in an area of dim light or darkness, you can use your action to become invisible. You remain invisible until you make an attack, cast a spell, or are in an area of bright light." },
         { level: 17, name: "Opportunist", description: "When a creature within 5 feet of you is hit by an attack made by a creature other than you, you can use your reaction to make a melee attack against that creature." }
       ]},
       "Way of the Sun Soul": { name: "Way of the Sun Soul", features: [
         { level: 3, name: "Radiant Sun Bolt", description: "You can make a ranged spell attack as part of your Attack action, hurling a bolt of radiant energy. The bolt has a range of 30 feet and deals radiant damage equal to your Martial Arts die + your Dexterity modifier. You can spend 1 ki point to make two additional bolts." },
         { level: 6, name: "Searing Arc Strike", description: "Immediately after you take the Attack action, you can spend 2 ki points to cast the burning hands spell as a bonus action. You can spend additional ki points to increase the damage." },
         { level: 11, name: "Searing Sunburst", description: "As an action, you can create an orb of light that explodes in a 20-foot radius sphere. Creatures in the area take 2d6 radiant damage on a failed Constitution saving throw. You can spend up to 3 ki points to increase the damage by 2d6 per point." },
         { level: 17, name: "Sun Shield", description: "As a bonus action, you can wreathe yourself in a luminous aura that sheds bright light in a 30-foot radius. When a creature hits you with a melee attack while this aura is active, you can use your reaction to deal radiant damage to it equal to 5 + your Wisdom modifier." }
       ]},
    }
  },
  "Paladin": {
    name: "Paladin",
    hitDie: 10,
    subclassLevel: 3,
    spellcasting: { 
      ability: 'cha',
      spellSlots: [
        // 1, 2, 3, 4, 5
        [0,0,0,0,0], [2,0,0,0,0], [3,0,0,0,0], [3,0,0,0,0], [4,2,0,0,0], [4,2,0,0,0], [4,3,0,0,0], [4,3,0,0,0], [4,3,2,0,0], [4,3,2,0,0],
        [4,3,3,0,0], [4,3,3,0,0], [4,3,3,1,0], [4,3,3,1,0], [4,3,3,2,0], [4,3,3,2,0], [4,3,3,3,1], [4,3,3,3,1], [4,3,3,3,2], [4,3,3,3,2]
      ]
    },
    features: [
        { level: 1, name: "Divine Sense", description: "As an action, you can open your awareness to detect strong evil and good. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. Usable a number of times equal to 1 + your CHA modifier per long rest.", uses: {max: 'cha'}, recharge: 'long'},
        { level: 1, name: "Lay on Hands", description: "You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5. As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.", recharge: 'long' },
        { level: 2, name: "Fighting Style", description: "Choose a fighting style (e.g., Defense, Dueling, Great Weapon Fighting, Protection)." },
        { level: 2, name: "Divine Smite", description: "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend." },
        { level: 3, name: "Divine Health", description: "By 3rd level, the divine magic flowing through you makes you immune to disease." },
        { level: 5, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
        { level: 6, name: "Aura of Protection", description: "Whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus." },
        { level: 10, name: "Aura of Courage", description: "You and friendly creatures within 10 feet of you can't be frightened while you are conscious." },
        { level: 11, name: "Improved Divine Smite", description: "Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage." },
        { level: 14, name: "Cleansing Touch", description: "As an action, you can end one spell on yourself or on one willing creature that you touch. Usable a number of times equal to your Charisma modifier per long rest.", uses: { max: 'cha' }, recharge: 'long' },
        { level: 18, name: "Aura Improvements", description: "The ranges of your Aura of Protection and Aura of Courage increase to 30 feet." }
    ],
    subclasses: {
        "Oath of the Ancients": { name: "Oath of the Ancients", features: [
          { level: 3, name: "Channel Divinity: Nature's Wrath", description: "As an action, you can cause spectral vines to spring up and restrain a creature within 10 feet that you can see. The creature must succeed on a Strength or Dexterity save or be restrained." },
          { level: 3, name: "Channel Divinity: Turn the Faithless", description: "As an action, you can turn fey and fiends that can see or hear you within 30 feet." },
          { level: 7, name: "Aura of Warding", description: "You and friendly creatures within 10 feet of you have resistance to damage from spells. At 18th level, this aura's range increases to 30 feet." },
          { level: 15, name: "Undying Sentinel", description: "When you are reduced to 0 hit points and are not killed outright, you can choose to drop to 1 hit point instead. Once you use this ability, you can't use it again until you finish a long rest." },
          { level: 20, name: "Elder Champion", description: "As an action, you can become a champion of nature for 1 minute. You regain 10 HP at the start of each of your turns, can cast paladin spells with a casting time of 1 action as a bonus action, and enemies have disadvantage on saving throws against your spells and Channel Divinity." }
        ]},
        "Oath of Conquest": { name: "Oath of Conquest", features: [
          { level: 3, name: "Channel Divinity: Conquering Presence", description: "As an action, you can cause each creature of your choice within 30 feet to become frightened of you for 1 minute on a failed Wisdom save." },
          { level: 3, name: "Channel Divinity: Guided Strike", description: "When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll." },
          { level: 7, name: "Aura of Conquest", description: "You emanate a menacing aura in a 10-foot radius. Any creature frightened of you has its speed reduced to 0 while in the aura and takes psychic damage equal to half your paladin level if it starts its turn there." },
          { level: 15, name: "Scornful Rebuke", description: "When a creature hits you with an attack, you can use your reaction to deal psychic damage to it equal to your Charisma modifier." },
          { level: 20, name: "Invincible Conqueror", description: "For 1 minute, you gain resistance to all damage, an extra attack on your turn, and your weapon attacks score a critical hit on a roll of 19 or 20." }
        ]},
        "Oath of the Crown": { name: "Oath of the Crown", features: [
          { level: 3, name: "Channel Divinity: Champion Challenge", description: "As an action, you issue a challenge that compels creatures of your choice within 30 feet to make a Wisdom save. On a failed save, a creature can't willingly move more than 30 feet away from you." },
          { level: 3, name: "Channel Divinity: Turn the Tide", description: "As a bonus action, you can heal allies of your choice within 30 feet that are below half HP. Each creature regains hit points equal to 1d6 + your Charisma modifier." },
          { level: 7, name: "Divine Allegiance", description: "When a creature within 5 feet of you takes damage, you can use your reaction to substitute your own health for that of the target creature, taking the damage yourself." },
          { level: 15, name: "Unyielding Spirit", description: "You have advantage on saving throws to avoid being paralyzed or stunned." },
          { level: 20, name: "Exalted Champion", description: "For 1 hour, you gain resistance to nonmagical bludgeoning, piercing, and slashing damage, and your allies have advantage on death saving throws and regain 1 HP if they start their turn at 0 HP while within 30 feet of you." }
        ]},
        "Oath of Devotion": { name: "Oath of Devotion", features: [
          { level: 3, name: "Channel Divinity: Sacred Weapon", description: "As an action, you can imbue one weapon you are holding with positive energy for 1 minute. You add your Charisma modifier to attack rolls made with that weapon, and it emits bright light." },
          { level: 3, name: "Channel Divinity: Turn the Unholy", description: "As an action, you can turn fiends and undead within 30 feet." },
          { level: 7, name: "Aura of Devotion", description: "You and friendly creatures within 10 feet of you can't be charmed while you are conscious." },
          { level: 15, name: "Purity of Spirit", description: "You are always under the effects of a protection from evil and good spell." },
          { level: 20, name: "Holy Nimbus", description: "As an action, you can emanate an aura of sunlight for 1 minute. You shed bright light in a 30-foot radius. At the end of each of your turns, each hostile creature within this light takes 10 radiant damage, and you have advantage on saving throws against spells cast by fiends or undead." }
        ]},
        "Oath of Glory": { name: "Oath of Glory", features: [
          { level: 3, name: "Channel Divinity: Peerless Athlete", description: "As a bonus action, you can use your Channel Divinity to gain advantage on Strength (Athletics) and Dexterity (Acrobatics) checks for 10 minutes. You can also push, pull, or lift up to twice your normal capacity." },
          { level: 3, name: "Channel Divinity: Inspiring Smite", description: "Immediately after you deal damage with your Divine Smite, you can use your Channel Divinity as a bonus action to distribute temporary hit points equal to 2d8 + your paladin level to allies within 30 feet." },
          { level: 7, name: "Aura of Alacrity", description: "Your walking speed increases by 10 feet. Any ally who starts their turn within 5 feet of you also has their speed increased by 10 feet for that turn." },
          { level: 15, name: "Glorious Defense", description: "As a reaction when you or an ally you can see within 10 feet is hit by an attack, you can add your Charisma modifier to the target's AC. If this causes the attack to miss, you can make one weapon attack against the attacker as part of the same reaction." },
          { level: 20, name: "Living Legend", description: "For 1 minute, you gain two benefits: you have advantage on all Charisma checks, and once on each of your turns when you miss with an attack, you can choose to hit instead." }
        ]},
        "Oath of Redemption": { name: "Oath of Redemption", features: [
          { level: 3, name: "Channel Divinity: Emissary of Peace", description: "As an action, you can use your Channel Divinity to gain a +5 bonus to Charisma (Persuasion) checks for 10 minutes." },
          { level: 3, name: "Channel Divinity: Rebuke the Violent", description: "As a reaction when an attacker within 30 feet deals damage to an ally, you can force the attacker to make a Wisdom save. On a failed save, the attacker takes radiant damage equal to the damage it just dealt." },
          { level: 7, name: "Aura of the Guardian", description: "When a creature within 10 feet of you takes damage, you can use your reaction to magically take that damage instead of the creature taking it." },
          { level: 15, name: "Protective Spirit", description: "You regain hit points equal to 1d6 + half your paladin level at the start of your turn if you are below half your hit point maximum and not incapacitated." },
          { level: 20, "name": "Emissary of Redemption", "description": "You have resistance to all damage dealt by other creatures. Whenever a creature hits you with an attack, it takes radiant damage equal to half the damage you take." }
        ]},
        "Oath of Vengeance": { name: "Oath of Vengeance", features: [
          { level: 3, name: "Channel Divinity: Abjure Enemy", description: "As an action, you can frighten one creature within 60 feet for 1 minute and reduce its speed to 0 if it fails a Wisdom save." },
          { level: 3, name: "Channel Divinity: Vow of Enmity", description: "As a bonus action, you can utter a vow of enmity against a creature within 10 feet. You gain advantage on attack rolls against that creature for 1 minute." },
          { level: 7, name: "Relentless Avenger", description: "When you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack as part of the same reaction." },
          { level: 15, name: "Soul of Vengeance", description: "When a creature under your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature if it is within range." },
          { level: 20, name: "Avenging Angel", description: "As an action, you can transform for 1 hour. You gain a flying speed of 60 feet and emanate an aura of menace in a 30-foot radius. Enemies that start their turn in the aura must succeed on a Wisdom save or be frightened of you for 1 minute." }
        ]},
        "Oath of the Watchers": { name: "Oath of the Watchers", features: [
          { level: 3, name: "Channel Divinity: Watcher's Will", description: "As an action, you can choose creatures up to your CHA mod within 30 feet. For 1 minute, you and the chosen creatures have advantage on Intelligence, Wisdom, and Charisma saving throws." },
          { level: 3, name: "Channel Divinity: Abjure the Extraplanar", description: "As an action, you can turn aberrations, celestials, elementals, fey, and fiends." },
          { level: 7, name: "Aura of the Sentinel", description: "You and any allies within 10 feet of you gain a bonus to initiative rolls equal to your proficiency bonus." },
          { level: 15, name: "Vigilant Rebuke", description: "As a reaction when you or an ally within 30 feet succeeds on an INT, WIS, or CHA save, you can deal 2d8 + your CHA modifier force damage to the creature that forced the save." },
          { level: 20, name: "Mortal Bulwark", description: "As a bonus action, you gain several benefits for 1 minute, including true sight 120 ft, advantage on attacks against extraplanar creatures, and dealing an extra 2d8 force damage on a hit against them." }
        ]},
        "Oathbreaker": { name: "Oathbreaker", features: [
          { level: 3, name: "Channel Divinity: Control Undead", description: "As an action, you can target one undead creature within 30 feet. The target must make a Wisdom save. On a failed save, it must obey your commands for 24 hours." },
          { level: 3, name: "Channel Divinity: Dreadful Aspect", description: "As an action, you can frighten each creature of your choice within 30 feet of you for 1 minute if they fail a Wisdom save." },
          { level: 7, name: "Aura of Hate", description: "You and any fiends or undead within 10 feet of you gain a bonus to melee weapon damage rolls equal to your Charisma modifier." },
          { level: 15, name: "Supernatural Resistance", description: "You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons." },
          { level: 20, name: "Dread Lord", description: "As an action, you can surround yourself with an aura of gloom for 1 minute. You gain resistance to all damage, and any enemy that starts its turn in the aura takes 10 psychic damage. You can also control an undead or fiend that is frightened of you as a bonus action." }
        ]}
    }
  },
  "Ranger": {
    name: "Ranger",
    hitDie: 10,
    subclassLevel: 3,
    spellcasting: { 
        ability: 'wis',
        spellsKnown: [0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11],
        spellSlots: [
        // 1, 2, 3, 4, 5
        [0,0,0,0,0], [2,0,0,0,0], [3,0,0,0,0], [3,0,0,0,0], [4,2,0,0,0], [4,2,0,0,0], [4,3,0,0,0], [4,3,0,0,0], [4,3,2,0,0], [4,3,2,0,0],
        [4,3,3,0,0], [4,3,3,0,0], [4,3,3,1,0], [4,3,3,1,0], [4,3,3,2,0], [4,3,3,2,0], [4,3,3,3,1], [4,3,3,3,1], [4,3,3,3,2], [4,3,3,3,2]
      ]
    },
    features: [
        { level: 1, name: "Favored Foe", description: "As a free action when you hit a creature, you can mark it as your favored foe for 1 minute (concentration). The first time you hit it on each of your turns, you deal an extra 1d4 damage. Usable a number of times equal to your proficiency bonus per long rest.", uses: {max: 'prof'}, recharge: 'long' },
        { level: 1, name: "Deft Explorer", description: "Choose one: Canny (expertise in one skill, and two languages), Roving (+5 ft speed, and a climbing and swimming speed), or Tireless (gain temp HP on short rest, and reduce exhaustion on short rest)." },
        { level: 2, name: "Fighting Style", description: "Choose a fighting style (e.g., Archery, Defense, Dueling, Two-Weapon Fighting)." },
        { level: 3, name: "Primal Awareness", description: "You learn additional spells at certain levels (e.g., speak with animals, beast sense). You can cast each of these once per long rest without a spell slot." },
        { level: 5, name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
        { level: 6, name: "Favored Foe (1d6)", description: "Your Favored Foe damage increases to 1d6." },
        { level: 8, name: "Land's Stride", description: "Moving through nonmagical difficult terrain costs you no extra movement. You also have advantage on saving throws against plants that are magically created or manipulated to impede movement." },
        { level: 10, name: "Nature's Veil", description: "As a bonus action, you can magically become invisible, along with any equipment you are wearing or carrying, until the start of your next turn. Usable a number of times equal to your proficiency bonus per long rest.", uses: {max: 'prof'}, recharge: 'long' },
        { level: 14, name: "Vanish", description: "You can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail." },
        { level: 14, name: "Favored Foe (1d8)", description: "Your Favored Foe damage increases to 1d8." },
        { level: 18, name: "Feral Senses", description: "You gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it. You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened." },
        { level: 20, name: "Foe Slayer", description: "Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make. You can choose to use this feature before or after the roll, but before any effects of the roll are applied." }
    ],
    subclasses: {
        "Beast Master Conclave": { name: "Beast Master Conclave", features: [
          { level: 3, name: "Ranger's Companion", description: "You establish a bond with a beast companion (CR 1/4 or lower). It acts on your initiative and obeys your commands. If you don't issue a command, it takes the Dodge action." },
          { level: 5, name: "Coordinated Attack", description: "When you use the Attack action on your turn, if your companion can see you, it can use its reaction to make a melee attack." },
          { level: 7, name: "Beast's Defense", description: "While your companion can see you, it has advantage on all saving throws." },
          { level: 11, name: "Storm of Claws and Fangs", description: "Your companion can use its action to make a melee attack against each creature of its choice within 5 feet of it, with a separate attack roll for each target." },
          { level: 15, name: "Superior Beast's Defense", description: "As a reaction when an attacker your companion can see hits it with an attack, your companion can halve the attack's damage against it." }
        ]},
        "Drakewarden": { name: "Drakewarden", features: [
          { level: 3, name: "Draconic Gift", description: "You learn the Thaumaturgy cantrip and can speak, read, and write Draconic." },
          { level: 3, name: "Drake Companion", description: "As an action, you can summon a drake companion, which has its own stats and acts on your initiative. As a bonus action, you can command it to take an action." },
          { level: 7, name: "Bond of Fang and Scale", description: "Your drake companion gains resistance to a damage type of your choice, and you can mount it if it is at least Medium size. While mounted, it can use its own reaction instead of yours." },
          { level: 11, name: "Drake's Breath", description: "As an action, you can exhale a 30-foot cone of damaging breath, or command your drake do so. The damage type matches the drake's essence." },
          { level: 15, name: "Perfected Bond", description: "Your bond with your drake is complete. It grows to Large size, you both gain a flying speed of 40 feet, and its bite attack deals an extra 1d6 damage of its elemental type." }
        ]},
        "Fey Wanderer": { name: "Fey Wanderer", features: [
          { level: 3, name: "Dreadful Strikes", description: "Once on each of your turns when you hit a creature with a weapon, you can deal an extra 1d4 psychic damage. This increases to 1d6 at 11th level." },
          { level: 3, name: "Feywild Gifts", description: "You gain proficiency in Deception, Performance, or Persuasion. You add your WIS mod to your CHA checks. You also learn Sylvan." },
          { level: 7, name: "Beguiling Twist", description: "As a reaction when a creature within 120 feet succeeds on a save against being charmed or frightened, you can force a different creature to make a WIS save or be charmed/frightened by you for 1 minute." },
          { level: 11, name: "Fey Reinforcements", description: "You can cast summon fey once per long rest without expending a spell slot. When you cast it, it does not require concentration." },
          { level: 15, name: "Misty Wanderer", description: "You can cast misty step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier per long rest." }
        ]},
        "Gloom Stalker Conclave": { name: "Gloom Stalker Conclave", features: [
          { level: 3, name: "Dread Ambusher", description: "You add your WIS mod to your initiative rolls. At the start of your first turn of each combat, your walking speed increases by 10 feet. If you take the Attack action on that turn, you can make one additional weapon attack that deals an extra 1d8 damage on hit." },
          { level: 3, name: "Umbral Sight", description: "You gain darkvision out to 60 feet. While in darkness, you are invisible to any creature that relies on darkvision to see you." },
          { level: 7, name: "Iron Mind", description: "You have proficiency in Wisdom saving throws. If you already have this, you can choose INT or CHA instead." },
          { level: 11, name: "Stalker's Flurry", description: "Once on each of your turns when you miss with a weapon attack, you can make another weapon attack as part of the same action." },
          { level: 15, name: "Shadowy Dodge", description: "As a reaction when a creature makes an attack roll against you and doesn't have advantage, you can impose disadvantage on it." }
        ]},
        "Horizon Walker Conclave": { name: "Horizon Walker Conclave", features: [
          { level: 3, name: "Detect Portal", description: "As an action, you can magically sense the presence of a planar portal within 1 mile of you for 1 minute." },
          { level: 3, name: "Planar Warrior", description: "As a bonus action, choose one creature you can see within 30 feet. The next time you hit that creature with a weapon attack, all damage becomes force damage, and the creature takes an extra 1d8 force damage. This increases to 2d8 at 11th level." },
          { level: 7, name: "Ethereal Step", description: "As a bonus action, you can cast the etherealness spell, but it ends at the end of the current turn. Usable a number of times equal to your proficiency bonus per long rest." },
          { level: 11, name: "Distant Strike", description: "When you take the Attack action, you can teleport up to 10 feet before each attack. If you attack at least two different creatures with the action, you can make one additional attack against a third creature." },
          { level: 15, name: "Spectral Defense", description: "When you take damage from an attack, you can use your reaction to give yourself resistance to all of that attack's damage on this turn." }
        ]},
    }
  },
  "Rogue": {
    name: "Rogue",
    hitDie: 8,
    subclassLevel: 3,
    features: [
      { level: 1, name: "Expertise", description: "Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies." },
      { level: 1, name: "Sneak Attack (1d6)", description: "Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll." },
      { level: 1, name: "Thieves' Cant", description: "You have learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation." },
      { level: 2, name: "Cunning Action", description: "You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action." },
      { level: 3, name: "Sneak Attack (2d6)", description: "Your Sneak Attack damage increases to 2d6." },
      { level: 5, name: "Uncanny Dodge", description: "When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you." },
      { level: 5, name: "Sneak Attack (3d6)", description: "Your Sneak Attack damage increases to 3d6." },
      { level: 6, name: "Expertise (2)", description: "Choose two more of your skill proficiencies, or one skill proficiency and thieves' tools, to gain expertise in." },
      { level: 7, name: "Evasion", description: "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail." },
      { level: 7, name: "Sneak Attack (4d6)", description: "Your Sneak Attack damage increases to 4d6." },
      { level: 9, name: "Sneak Attack (5d6)", description: "Your Sneak Attack damage increases to 5d6." },
      { level: 11, name: "Reliable Talent", description: "Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10." },
      { level: 11, name: "Sneak Attack (6d6)", description: "Your Sneak Attack damage increases to 6d6." },
      { level: 13, name: "Sneak Attack (7d6)", description: "Your Sneak Attack damage increases to 7d6." },
      { level: 14, name: "Blindsense", description: "If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you." },
      { level: 15, name: "Slippery Mind", description: "You have gained proficiency in Wisdom saving throws." },
      { level: 15, name: "Sneak Attack (8d6)", description: "Your Sneak Attack damage increases to 8d6." },
      { level: 17, name: "Sneak Attack (9d6)", description: "Your Sneak Attack damage increases to 9d6." },
      { level: 18, name: "Elusive", description: "No attack roll has advantage against you while you aren't incapacitated." },
      { level: 20, name: "Stroke of Luck", description: "If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20. Once you use this feature, you can't use it again until you finish a short or long rest.", uses: {max: 1}, recharge: 'short' }
    ],
    subclasses: {
      "Arcane Trickster": {
        name: "Arcane Trickster",
        features: [
            { level: 3, name: "Mage Hand Legerdemain", description: "When you cast mage hand, you can make the spectral hand invisible, and you can perform additional tasks with it: stow or retrieve an object, use thieves' tools, and pour the contents of a vial." },
            { level: 9, name: "Magical Ambush", description: "If you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell this turn." },
            { level: 13, name: "Versatile Trickster", description: "As a bonus action on your turn, you can designate a creature within 5 feet of your spectral hand created by the mage hand spell. You have advantage on attack rolls against that creature until the end of the turn." },
            { level: 17, name: "Spell Thief", description: "When a creature casts a spell that targets you, you can use your reaction to force the creature to make a saving throw with its spellcasting ability modifier. On a failed save, you negate the spell's effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast. For the next 8 hours, you know the spell and can cast it using your spell slots." }
        ],
        spellcasting: {
            ability: 'int',
            cantripsKnown: [0,0,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
            spellsKnown:   [0,0,3,4,4,4,5,6,6,7,8,8,9,10,10,11,11,11,12,13],
            spellSlots: [
                [0,0,0,0],[0,0,0,0],[2,0,0,0],[3,0,0,0],[3,0,0,0],[3,0,0,0],[4,2,0,0],[4,2,0,0],[4,2,0,0],[4,3,0,0],
                [4,3,0,0],[4,3,0,0],[4,3,2,0],[4,3,2,0],[4,3,2,0],[4,3,3,0],[4,3,3,0],[4,3,3,0],[4,3,3,1],[4,3,3,1]
            ]
        }
      },
      "Assassin": {
        name: "Assassin",
        features: [
            { level: 3, name: "Bonus Proficiencies", description: "You gain proficiency with the disguise kit and the poisoner's kit." },
            { level: 3, name: "Assassinate", description: "You have advantage on attack rolls against any creature that hasn't taken a turn in the combat yet. In addition, any hit you score against a creature that is surprised is a critical hit." },
            { level: 9, name: "Infiltration Expertise", description: "You can spend one minute to create a false identity, which stands up to cursory inspection. To pass as a specific person requires 7 days of observation and 25 gp." },
            { level: 13, name: "Impostor", description: "You can unerringly mimic the speech, writing, and behavior of another person. You must spend at least three hours studying these three components of the person's behavior." },
            { level: 17, name: "Death Strike", description: "When you attack and hit a creature that is surprised, it must make a Constitution saving throw (DC 8 + your Dexterity modifier + your proficiency bonus). On a failed save, double the damage of your attack against the creature." }
        ]
      },
      "Inquisitive": {
        name: "Inquisitive",
        features: [
            { level: 3, name: "Ear for Deceit", description: "When you make a Wisdom (Insight) check to determine if a creature is lying, treat a roll of 7 or lower on the d20 as an 8." },
            { level: 3, name: "Eye for Detail", description: "You can use a bonus action to make a Wisdom (Perception) check to spot a hidden creature or object or an Intelligence (Investigation) check to uncover or decipher clues." },
            { level: 3, name: "Insightful Fighting", description: "As a bonus action, you can make a Wisdom (Insight) check against a creature you can see that isn't incapacitated, contested by the target's Charisma (Deception) check. If you succeed, you can use your Sneak Attack against that creature even if you don't have advantage on the attack roll, but not if you have disadvantage on it." }
        ]
      },
      "Mastermind": {
        name: "Mastermind",
        features: [
            { level: 3, name: "Master of Intrigue", description: "You gain proficiency with the disguise kit, the forgery kit, and one gaming set of your choice. You also learn two languages of your choice." },
            { level: 3, name: "Master of Tactics", description: "You can use the Help action as a bonus action. Additionally, when you use the Help action to aid an ally in attacking a creature, the target of that attack can be within 30 feet of you, rather than 5 feet of you, if the target can see or hear you." }
        ]
      },
      "Phantom": {
        name: "Phantom",
        features: [
            { level: 3, name: "Whispers of the Dead", description: "You can gain one skill or tool proficiency of your choice at the end of a short or long rest. This proficiency lasts until you use this feature again." },
            { level: 3, name: "Wails from the Grave", description: "Immediately after you deal Sneak Attack damage to a creature, you can target a second creature within 30 feet and deal psychic damage equal to half the number of Sneak Attack dice rolled." }
        ]
      },
      "Scout": {
        name: "Scout",
        features: [
            { level: 3, name: "Skirmisher", description: "You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks." },
            { level: 3, name: "Survivalist", description: "You gain proficiency in the Nature and Survival skills. If you are already proficient in either skill, your proficiency bonus is doubled for any ability check you make with that skill." }
        ]
      },
      "Soulknife": {
        name: "Soulknife",
        features: [
            { level: 3, name: "Psychic Blades", description: "You can manifest a psychic blade from your free hand and make an attack with it. It is a simple melee weapon with the finesse and thrown properties. On a hit, it deals 1d6 psychic damage. After you attack, you can make a bonus action attack with a second psychic blade, which deals 1d4 psychic damage." }
        ]
      },
       "Thief": {
        name: "Thief",
        features: [
            { level: 3, name: "Fast Hands", description: "You can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools to disarm a trap or open a lock, or take the Use an Object action." },
            { level: 3, name: "Second-Story Work", description: "Climbing no longer costs you extra movement. In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier." },
            { level: 9, name: "Supreme Sneak", description: "You have advantage on a Dexterity (Stealth) check if you move no more than half your speed on the same turn." },
            { level: 13, name: "Use Magic Device", description: "You ignore all class, race, and level requirements on the use of magic items." },
            { level: 17, name: "Thief's Reflexes", description: "You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can't use this feature when you are surprised." }
        ]
      },
      "Swashbuckler": {
        name: "Swashbuckler",
        features: [
            { level: 3, name: "Fancy Footwork", description: "During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn." },
            { level: 3, name: "Rakish Audacity", description: "You can add your Charisma modifier to your initiative rolls. In addition, you don't need advantage on your attack roll to use your Sneak Attack if no other creature is within 5 feet of you, you are not incapacitated, and you don't have disadvantage." },
            { level: 9, name: "Panache", description: "As an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. If you succeed, the target is charmed by you for 1 minute or until it takes damage. In combat, the creature has disadvantage on attack rolls against targets other than you." },
            { level: 13, name: "Elegant Maneuver", description: "As a bonus action on your turn, you can gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check you make during the same turn." },
            { level: 17, name: "Master Duelist", description: "If you miss with an attack roll, you can roll it again with advantage. Once you do so, you can't use this feature again until you finish a short or long rest.", uses: {max: 1}, recharge: 'short' }
        ]
      }
    }
  },
  "Sorcerer": {
    name: "Sorcerer",
    hitDie: 6,
    subclassLevel: 1,
    spellcasting: {
      ability: 'cha',
      cantripsKnown: [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
      spellsKnown:   [2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
      spellSlots: [
        [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0],
        [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1]
      ]
    },
    features: [
      { level: 2, name: "Font of Magic", description: "You have a pool of sorcery points equal to your sorcerer level, which you can use to gain additional spell slots, or sacrifice spell slots to gain more sorcery points. You regain all spent sorcery points when you finish a long rest.", uses: {max: 'level'}, recharge: 'long'},
      { level: 3, name: "Metamagic", description: "You gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options: Careful Spell, Distant Spell, Empowered Spell, Extended Spell, Heightened Spell, Quickened Spell, Subtle Spell, or Twinned Spell." },
      { level: 10, name: "Metamagic (3rd option)", description: "You learn one additional Metamagic option." },
      { level: 17, name: "Metamagic (4th option)", description: "You learn one additional Metamagic option." },
      { level: 20, name: "Sorcerous Restoration", description: "You regain 4 expended sorcery points whenever you finish a short rest." }
    ],
    subclasses: {
        "Aberrant Mind": {
            name: "Aberrant Mind",
            features: [
                { level: 1, name: "Psionic Spells", description: "You learn additional spells from the Aberrant Mind spell list, such as dissonant whispers and detect thoughts." },
                { level: 1, name: "Telepathic Speech", description: "As a bonus action, you can form a telepathic connection with one creature you can see within 30 feet of you. You can speak telepathically with the creature for a number of minutes equal to your sorcerer level." },
                { level: 6, name: "Psionic Sorcery", description: "When you cast any spell of 1st level or higher from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of sorcery points equal to the spell's level." }
            ]
        },
        "Clockwork Soul": {
            name: "Clockwork Soul",
            features: [
                { level: 1, name: "Clockwork Magic", description: "You learn additional spells from the Clockwork Magic spell list, such as alarm and protection from evil and good." },
                { level: 1, name: "Restore Balance", description: "As a reaction when a creature you can see within 60 feet is about to roll a d20 with advantage or disadvantage, you can prevent the roll from being affected by advantage and disadvantage." }
            ]
        },
        "Divine Soul": {
            name: "Divine Soul",
            features: [
                { level: 1, name: "Divine Magic", description: "Your link to the divine allows you to learn spells from the cleric spell list. When you gain a sorcerer level, you can choose a new sorcerer spell to learn, and that spell can be from the cleric spell list or the sorcerer spell list." },
                { level: 1, name: "Favored by the Gods", description: "If you fail a saving throw or miss with an attack roll, you can roll 2d4 and add it to the total, possibly changing the outcome. Once you use this feature, you can't use it again until you finish a short or long rest.", uses: {max: 1}, recharge: 'short' }
            ]
        },
        "Draconic Bloodline": {
            name: "Draconic Bloodline",
            features: [
                { level: 1, name: "Dragon Ancestor", description: "Choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later." },
                { level: 1, name: "Draconic Resilience", description: "Your hit point maximum increases by 1 and increases by 1 again whenever you gain a level in this class. Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier." },
                { level: 6, name: "Elemental Affinity", description: "When you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour." },
                { level: 14, name: "Dragon Wings", description: "You can use a bonus action to manifest a pair of dragon wings from your back, gaining a flying speed equal to your current speed. You can't manifest your wings while wearing armor unless the armor is made to accommodate them." },
                { level: 18, name: "Draconic Presence", description: "As an action, you can spend 5 sorcery points to draw on your draconic ancestry, creating an aura of awe or fear. For 1 minute, each hostile creature that starts its turn within 60 feet of you must succeed on a Wisdom saving throw or be charmed or frightened by you." }
            ]
        },
        "Shadow Magic": {
            name: "Shadow Magic",
            features: [
                { level: 1, name: "Eyes of the Dark", description: "You have darkvision with a range of 120 feet. You can also cast the darkness spell by spending 2 sorcery points. If you do, you can see through this magical darkness." },
                { level: 1, name: "Strength of the Grave", description: "When damage reduces you to 0 hit points, you can make a Charisma saving throw (DC 5 + the damage taken). On a success, you instead drop to 1 hit point." }
            ]
        },
        "Storm Sorcery": {
            name: "Storm Sorcery",
            features: [
                { level: 1, name: "Tempestuous Magic", description: "As a bonus action immediately before or after you cast a sorcerer spell of 1st level or higher, you can fly up to 10 feet without provoking opportunity attacks." },
                { level: 6, name: "Heart of the Storm", description: "You gain resistance to lightning and thunder damage. In addition, when you cast a spell that deals lightning or thunder damage, you can cause a small storm to erupt around you, damaging nearby creatures." }
            ]
        },
        "Wild Magic": {
            name: "Wild Magic",
            features: [
                { level: 1, name: "Wild Magic Surge", description: "Immediately after you cast a sorcerer spell of 1st level or higher, the DM can have you roll a d20. If you roll a 1, roll on the Wild Magic Surge table to create a random magical effect." },
                { level: 1, name: "Tides of Chaos", description: "You can gain advantage on one attack roll, ability check, or saving throw. You must finish a long rest before you can use this feature again. However, after using it, the DM can have you roll on the Wild Magic Surge table immediately after you cast a sorcerer spell of 1st level or higher, which lets you regain the use of this feature.", uses: {max: 1}, recharge: 'long'},
                { level: 6, name: "Bend Luck", description: "When another creature you can see makes an attack roll, an ability check, or a saving throw, you can use your reaction and spend 2 sorcery points to roll a d4 and apply the number as a bonus or penalty to the creature's roll." },
                { level: 14, name: "Controlled Chaos", description: "Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number." },
                { level: 18, name: "Spell Bombardment", description: "When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again, and add that roll to the damage." }
            ]
        }
    }
  },
  "Warlock": {
    name: "Warlock",
    hitDie: 8,
    subclassLevel: 1,
    spellcasting: {
      ability: 'cha',
      cantripsKnown: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
      spellsKnown:   [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
      spellSlots: [
        [1,0,0,0,0], [2,0,0,0,0], [0,2,0,0,0], [0,2,0,0,0], [0,0,2,0,0], [0,0,2,0,0], [0,0,0,2,0], [0,0,0,2,0], [0,0,0,0,2], [0,0,0,0,2],
        [0,0,0,0,3], [0,0,0,0,3], [0,0,0,0,3], [0,0,0,0,3], [0,0,0,0,3], [0,0,0,0,3], [0,0,0,0,4], [0,0,0,0,4], [0,0,0,0,4], [0,0,0,0,4]
      ]
    },
    features: [
      { level: 2, name: "Eldritch Invocations", description: "You learn two eldritch invocations of your choice. You learn additional invocations as you gain levels." },
      { level: 3, name: "Pact Boon", description: "Your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice: Pact of the Chain, Pact of the Blade, or Pact of the Tome." },
      { level: 11, name: "Mystic Arcanum (6th Level)", description: "You can cast one 6th-level warlock spell once without expending a spell slot. You must finish a long rest before you can do so again.", uses: {max: 1}, recharge: 'long' },
      { level: 13, name: "Mystic Arcanum (7th Level)", description: "You can cast one 7th-level warlock spell once without expending a spell slot.", uses: {max: 1}, recharge: 'long' },
      { level: 15, name: "Mystic Arcanum (8th Level)", description: "You can cast one 8th-level warlock spell once without expending a spell slot.", uses: {max: 1}, recharge: 'long' },
      { level: 17, name: "Mystic Arcanum (9th Level)", description: "You can cast one 9th-level warlock spell once without expending a spell slot.", uses: {max: 1}, recharge: 'long' },
      { level: 20, name: "Eldritch Master", description: "As an action, you can draw on your inner reserve of mystical power while entreating your patron to regain all your expended spell slots from your Pact Magic feature. You can't use this feature again until you finish a long rest.", uses: {max: 1}, recharge: 'long'}
    ],
    subclasses: {
        "The Archfey": {
            name: "The Archfey",
            features: [
                { level: 1, name: "Fey Presence", description: "As an action, you can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw. The creatures that fail their saving throws are all charmed or frightened by you (your choice) until the end of your next turn." },
                { level: 6, name: "Misty Escape", description: "When you take damage, you can use your reaction to turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn or until you attack or cast a spell.", uses: {max: 1}, recharge: 'short' },
                { level: 10, name: "Beguiling Defenses", description: "You are immune to being charmed, and when another creature attempts to charm you, you can use your reaction to attempt to turn the charm back on that creature." },
                { level: 14, name: "Dark Delirium", description: "As an action, you can choose a creature you can see within 60 feet of you. It must make a Wisdom saving throw. On a failed save, it is charmed or frightened by you (your choice) for 1 minute." }
            ]
        },
        "The Celestial": {
            name: "The Celestial",
            features: [
                { level: 1, name: "Bonus Cantrips", description: "You learn the light and sacred flame cantrips. They count as warlock cantrips for you, but they don't count against your number of cantrips known." },
                { level: 1, name: "Healing Light", description: "You have a pool of d6s that you can use to heal creatures. The number of dice in the pool equals 1 + your warlock level. As a bonus action, you can heal one creature you can see within 60 feet of you, spending dice from the pool." },
                { level: 6, name: "Radiant Soul", description: "You have resistance to radiant damage. When you cast a spell that deals radiant or fire damage, you can add your Charisma modifier to one radiant or fire damage roll of that spell against one of its targets." }
            ]
        },
        "The Fathomless": {
            name: "The Fathomless",
            features: [
                { level: 1, name: "Tentacle of the Deeps", description: "As a bonus action, you can magically manifest a spectral tentacle at a point you can see within 60 feet. The tentacle lasts for 1 minute. When you create the tentacle, you can make a melee spell attack against one creature within 10 feet of it. On a hit, the target takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn." },
                { level: 1, name: "Gift of the Sea", description: "You gain a swimming speed of 40 feet, and you can breathe underwater." }
            ]
        },
        "The Fiend": {
            name: "The Fiend",
            features: [
                { level: 1, name: "Dark One's Blessing", description: "When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level." },
                { level: 6, name: "Dark One's Own Luck", description: "When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur. You can't use this feature again until you finish a short or long rest.", uses: {max: 1}, recharge: 'short' },
                { level: 10, name: "Fiendish Resilience", description: "When you finish a short or long rest, you can choose one damage type and gain resistance to it until you choose a different one with this feature." },
                { level: 14, name: "Hurl Through Hell", description: "When you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape, taking 10d10 psychic damage before returning to the space it previously occupied at the end of your next turn. You can't use this feature again until you finish a long rest.", uses: {max: 1}, recharge: 'long' }
            ]
        },
        "The Genie": {
            name: "The Genie",
            features: [
                { level: 1, name: "Genie's Vessel", description: "Your patron gifts you a magical vessel that grants you a measure of the genie's power. You can use it as a spellcasting focus, and as an action, you can magically vanish and enter your vessel, which remains in the spot you left it." },
                { level: 6, name: "Elemental Gift", description: "You gain resistance to a damage type determined by your patron's kind (bludgeoning, fire, lightning, or thunder). You can also give yourself a flying speed of 30 feet for 10 minutes." }
            ]
        },
        "The Great Old One": {
            name: "The Great Old One",
            features: [
                { level: 1, name: "Awakened Mind", description: "You can telepathically speak to any creature you can see within 30 feet of you. You don't need to share a language with the creature for it to understand your telepathic utterances, but the creature must be able to understand at least one language." },
                { level: 6, name: "Entropic Ward", description: "When a creature makes an attack roll against you, you can use your reaction to impose disadvantage on that roll. If the attack misses you, your next attack roll against the creature has advantage if you make it before the end of your next turn. You can't use this feature again until you finish a short or long rest.", uses: {max: 1}, recharge: 'short' },
                { level: 10, name: "Thought Shield", description: "Your thoughts can't be read by telepathy or other means unless you allow it. You also have resistance to psychic damage, and whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do." },
                { level: 14, name: "Create Thrall", description: "As an action, you can touch an incapacitated humanoid. That creature is then charmed by you until a remove curse spell is cast on it, the charmed condition is removed from it, or you use this feature again." }
            ]
        },
         "Hexblade": {
            name: "Hexblade",
            features: [
                { level: 1, name: "Hexblade's Curse", description: "As a bonus action, choose one creature you can see within 30 feet of you. The target is cursed for 1 minute. You gain a bonus to damage rolls against the cursed target equal to your proficiency bonus, any attack roll you make against the cursed target is a critical hit on a roll of 19 or 20, and if the cursed target dies, you regain hit points equal to your warlock level + your Charisma modifier.", uses: {max: 1}, recharge: 'short'},
                { level: 1, name: "Hex Warrior", description: "You acquire the training necessary to effectively arm yourself for battle. You gain proficiency with medium armor, shields, and martial weapons. The influence of your patron also allows you to mystically channel your will through a particular weapon. Whenever you finish a long rest, you can touch one weapon that you are proficient with and that lacks the two-handed property. When you attack with that weapon, you can use your Charisma modifier, instead of Strength or Dexterity, for the attack and damage rolls." },
                { level: 6, name: "Accursed Specter", description: "When you slay a humanoid, you can cause its spirit to rise from its corpse as a specter. The specter is under your control and gains temporary hit points equal to half your warlock level. It obeys your commands and remains in your service until the end of your next long rest." },
                { level: 10, name: "Armor of Hexes", description: "If a creature cursed by your Hexblade's Curse hits you with an attack roll, you can use your reaction to roll a d6. On a 4 or higher, the attack instead misses you, regardless of its roll." },
                { level: 14, name: "Master of Hexes", description: "When the target of your Hexblade's Curse dies, you can apply the curse to a different creature you can see within 30 feet of you, provided you aren't incapacitated. When you apply the curse in this way, you don't regain hit points from the death of the previously cursed creature." }
            ]
        },
        "The Undead": {
            name: "The Undead",
            features: [
                { level: 1, name: "Form of Dread", description: "As a bonus action, you can transform for 1 minute. You gain temporary hit points, you are immune to the frightened condition, and once during each of your turns when you hit a creature with an attack, you can force it to make a Wisdom saving throw or be frightened of you until the end of your next turn." },
                { level: 6, name: "Grave Touched", description: "You are no longer required to eat, drink, or breathe. In addition, when you hit a creature with an attack and roll a 6 on the damage die, you can change the damage type to necrotic and add one additional necrotic damage die to the roll." }
            ]
        }
    }
  },
  "Wizard": {
    name: "Wizard",
    hitDie: 6,
    subclassLevel: 2,
    spellcasting: {
      ability: 'int',
      cantripsKnown: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
      spellSlots: [
        [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0],
        [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1]
      ]
    },
    features: [
      { level: 1, name: "Arcane Recovery", description: "Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.", uses: {max: 1}, recharge: 'long' },
      { level: 18, name: "Spell Mastery", description: "You have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared." },
      { level: 20, name: "Signature Spells", description: "You gain a mastery of two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don't count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest.", uses: {max: 2}, recharge: 'short' }
    ],
    subclasses: {
      "School of Abjuration": {
        name: "School of Abjuration",
        features: [
            { level: 2, name: "Abjuration Savant", description: "The gold and time you must spend to copy an abjuration spell into your spellbook is halved." },
            { level: 2, name: "Arcane Ward", description: "When you cast an abjuration spell of 1st level or higher, you can simultaneously use a strand of magic to create a magical ward on yourself that lasts until you finish a long rest. The ward has a hit point maximum equal to twice your wizard level + your Intelligence modifier." }
        ]
      },
      "School of Bladesinging": {
        name: "School of Bladesinging",
        features: [
            { level: 2, name: "Training in War and Song", description: "You gain proficiency with light armor, one one-handed melee weapon of your choice, and the Performance skill." },
            { level: 2, name: "Bladesong", description: "As a bonus action, you can start the Bladesong, which lasts for 1 minute. You gain a bonus to your AC equal to your Intelligence modifier, your walking speed increases by 10 feet, and you have advantage on Dexterity (Acrobatics) checks. You can use this feature a number of times equal to your proficiency bonus per long rest." }
        ]
      },
      "School of Conjuration": {
        name: "School of Conjuration",
        features: [
            { level: 2, name: "Conjuration Savant", description: "The gold and time you must spend to copy a conjuration spell into your spellbook is halved." },
            { level: 2, name: "Minor Conjuration", description: "As an action, you can conjure up an inanimate object in your hand or on the ground in an unoccupied space that you can see within 10 feet of you. The object can be no larger than 3 feet on a side and weigh no more than 10 pounds, and its form must be that of a nonmagical object that you have seen." }
        ]
      },
      "School of Divination": {
        name: "School of Divination",
        features: [
            { level: 2, name: "Divination Savant", description: "The gold and time you must spend to copy a divination spell into your spellbook is halved." },
            { level: 2, name: "Portent", description: "When you finish a long rest, roll two d20s and record the numbers rolled. You can replace any attack roll, saving throw, or ability check made by you or a creature that you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn.", uses: {max: 2}, recharge: 'long'},
            { level: 6, name: "Expert Divination", description: "When you cast a divination spell of 2nd level or higher, you regain one expended spell slot. The slot you regain must be of a level lower than the spell you cast and can't be higher than 5th." },
            { level: 10, name: "The Third Eye", description: "As an action, you can gain one of the following benefits until you are incapacitated or you take a short or long rest: Darkvision, Ethereal Sight, Greater Comprehension, or See Invisibility." },
            { level: 14, name: "Greater Portent", description: "You roll three d20s for your Portent feature, rather than two.", uses: {max: 3}, recharge: 'long' }
        ]
      },
      "School of Enchantment": {
        name: "School of Enchantment",
        features: [
            { level: 2, name: "Enchantment Savant", description: "The gold and time you must spend to copy an enchantment spell into your spellbook is halved." },
            { level: 2, name: "Hypnotic Gaze", description: "As an action, choose one humanoid you can see within 5 feet of you. If the target can see or hear you, it must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn." }
        ]
      },
      "School of Evocation": {
        name: "School of Evocation",
        features: [
          { level: 2, name: "Evocation Savant", description: "The gold and time you must spend to copy an evocation spell into your spellbook is halved." },
          { level: 2, name: "Sculpt Spells", description: "When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save." },
          { level: 6, name: "Potent Cantrip", description: "When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip." },
          { level: 10, name: "Empowered Evocation", description: "You can add your Intelligence modifier to the damage roll of any one evocation spell you cast." },
          { level: 14, name: "Overchannel", description: "When you cast a wizard spell of 1st through 5th level that deals damage, you can deal maximum damage with that spell. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12." }
        ]
      },
      "School of Illusion": {
        name: "School of Illusion",
        features: [
            { level: 2, name: "Illusion Savant", description: "The gold and time you must spend to copy an illusion spell into your spellbook is halved." },
            { level: 2, name: "Improved Minor Illusion", description: "You learn the minor illusion cantrip. If you already know this cantrip, you learn a different wizard cantrip of your choice. When you cast minor illusion, you can create both a sound and an image with a single casting of the spell." }
        ]
      },
      "School of Necromancy": {
        name: "School of Necromancy",
        features: [
            { level: 2, name: "Necromancy Savant", description: "The gold and time you must spend to copy a necromancy spell into your spellbook is halved." },
            { level: 2, name: "Grim Harvest", description: "Once per turn when you kill one or more creatures with a spell of 1st level or higher, you regain hit points equal to twice the spell's level, or three times its level if the spell belongs to the School of Necromancy." }
        ]
      },
      "School of Transmutation": {
        name: "School of Transmutation",
        features: [
            { level: 2, name: "Transmutation Savant", description: "The gold and time you must spend to copy a transmutation spell into your spellbook is halved." },
            { level: 2, name: "Minor Alchemy", description: "You can temporarily alter the physical properties of one nonmagical object, changing it from one substance into another, such as turning a copper piece into a silver piece. This transformation lasts for 1 hour." }
        ]
      },
      "School of War Magic": {
        name: "School of War Magic",
        features: [
            { level: 2, name: "Arcane Deflection", description: "As a reaction when you are hit by an attack or fail a saving throw, you can gain a +2 bonus to your AC against that attack or a +4 bonus to that saving throw. If you do, you can only cast cantrips until the end of your next turn." },
            { level: 2, name: "Tactical Wit", description: "You can give yourself a bonus to your initiative rolls equal to your Intelligence modifier." }
        ]
      }
    }
  }
};

const getModifierAsNumber = (score: number) => Math.floor((score - 10) / 2);

export const getFeaturesForClassLevel = (
  className: string,
  subclassName: string,
  level: number,
  abilityScores: Character['abilityScores']
): Feature[] => {
  if (!className || !DND_CLASS_DATA[className]) {
    return [];
  }

  const classData = DND_CLASS_DATA[className];
  
  const classFeatures = classData.features
    .filter(f => f.level <= level)
    .map(f => ({
      ...f,
      source: 'automatic' as const,
      id: `${className}-${f.name}-${f.level}`,
    }));

  let subclassFeatures: (ClassFeature & {source: 'automatic', id: string})[] = [];
  if (subclassName && classData.subclasses[subclassName] && level >= classData.subclassLevel) {
    subclassFeatures = classData.subclasses[subclassName].features
      .filter(f => f.level <= level)
      .map(f => ({
        ...f,
        source: 'automatic' as const,
        id: `${subclassName}-${f.name}-${f.level}`,
      }));
  }
  
  const allFeaturesRaw = [...classFeatures, ...subclassFeatures];

  const resolveUses = (maxUses: number | 'level' | 'cha' | 'wis' | 'int' | 'str' | 'dex' | 'con' | 'prof') => {
      const proficiencyBonus = Math.floor((level - 1) / 4) + 2;
      let resolvedValue: number;
      switch(maxUses) {
          case 'level': resolvedValue = level; break;
          case 'prof': resolvedValue = proficiencyBonus; break;
          case 'cha': resolvedValue = getModifierAsNumber(abilityScores.cha); break;
          case 'wis': resolvedValue = getModifierAsNumber(abilityScores.wis); break;
          case 'int': resolvedValue = getModifierAsNumber(abilityScores.int); break;
          case 'str': resolvedValue = getModifierAsNumber(abilityScores.str); break;
          case 'dex': resolvedValue = getModifierAsNumber(abilityScores.dex); break;
          case 'con': resolvedValue = getModifierAsNumber(abilityScores.con); break;
          default: resolvedValue = maxUses as number; break;
      }
      return Math.max(1, resolvedValue);
  };

  return allFeaturesRaw.map(f => {
    let featureUses: Feature['uses'] | undefined = undefined;
    if (f.uses) {
      const max = resolveUses(f.uses.max);
      featureUses = {
        max: max,
        current: max,
      };
    }

    return {
      id: f.id,
      name: f.name,
      description: f.description,
      source: 'automatic',
      uses: featureUses,
      recharge: f.recharge,
    };
  });
};
