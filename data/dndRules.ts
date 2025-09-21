export interface Rule {
  id: string;
  title: string;
  content: string;
  subsections?: Rule[];
}

export const DND_RULES: Rule[] = [
  {
    id: "using-ability-scores",
    title: "Using Ability Scores",
    content: "Six abilities provide a quick description of every creature’s physical and mental characteristics: Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. They are the foundation of every character's and monster's capabilities.",
    subsections: [
      {
        id: "ability-scores-and-modifiers",
        title: "Ability Scores and Modifiers",
        content: "Each of a creature's abilities has a score, a number that defines the magnitude of that ability. An ability score is not just a measure of innate capabilities, but also encompasses a creature's training and competence in activities related to that ability.\n\nA score of 10 or 11 is the normal human average, but adventurers and many monsters are a cut above average in some abilities. A score of 20 is the highest that a person usually reaches, although exceptional beings can achieve higher scores.\n\nEach ability also has a modifier, derived from the score and ranging from −5 (for an ability score of 1) to +10 (for a score of 30). The Ability Scores and Modifiers table notes the ability modifiers for the range of possible ability scores.\n\n| Score | Modifier |\n| :--- | :--- |\n| 1 | -5 |\n| 2–3 | -4 |\n| 4–5 | -3 |\n| 6–7 | -2 |\n| 8–9 | -1 |\n| 10–11 | +0 |\n| 12–13 | +1 |\n| 14–15 | +2 |\n| 16–17 | +3 |\n| 18–19 | +4 |\n| 20–21 | +5 |\n| 22–23 | +6 |\n| 24–25 | +7 |\n| 26–27 | +8 |\n| 28–29 | +9 |\n| 30 | +10 |\n\nTo determine an ability modifier without consulting the table, subtract 10 from the ability score and then divide the total by 2 (round down)."
      },
      {
        id: "advantage-and-disadvantage",
        title: "Advantage and Disadvantage",
        content: "Sometimes a special ability or spell tells you that you have advantage or disadvantage on an ability check, a saving throw, or an attack roll. When that happens, you roll a second d20 when you make the roll. Use the higher of the two rolls if you have advantage, and use the lower of the two rolls if you have disadvantage. For example, if you have disadvantage and roll a 17 and a 5, you use the 5. If you have advantage and roll those numbers, you use the 17.\n\nIf multiple situations affect a roll and each one grants advantage or imposes disadvantage on it, you don’t roll more than one additional d20. If two favorable situations grant advantage, for example, you still roll only one additional d20.\n\nIf circumstances cause a roll to have both advantage and disadvantage, you are considered to have neither of them, and you roll one d20. This is true even if multiple circumstances impose disadvantage and only one grants advantage or vice versa. In such a situation, you have neither advantage nor disadvantage."
      },
      {
        id: "proficiency-bonus",
        title: "Proficiency Bonus",
        content: "Characters have a proficiency bonus determined by level. Monsters also have this bonus, which is incorporated in their stat blocks. The bonus is used in the rolls of attacks, ability checks, and saving throws.\n\nYour proficiency bonus can’t be added to a die roll or other number more than once. For example, if two different rules say you can add your proficiency bonus to a Wisdom saving throw, you nevertheless add the bonus only once when you make the save.\n\n| Level | Proficiency Bonus |\n| :--- | :--- |\n| 1–4 | +2 |\n| 5–8 | +3 |\n| 9–12 | +4 |\n| 13–16 | +5 |\n| 17–20 | +6 |"
      },
      {
        id: "ability-checks",
        title: "Ability Checks",
        content: "An ability check tests a character’s or monster’s innate talent and training in an effort to overcome a challenge. The DM calls for an ability check when a character or monster attempts an action (other than an attack) that has a chance of failure. When the outcome is uncertain, the dice determine the results.\n\nFor every ability check, the DM decides which of the 6 abilities is relevant to the task at hand and the difficulty of the task, represented by a Difficulty Class (DC). To make an ability check, roll a d20 and add the relevant ability modifier. If the total equals or exceeds the DC, the ability check is a success. Otherwise, it's a failure.\n\n**Difficulty Class (DC)**\n| Task Difficulty | DC |\n| :--- | :--- |\n| Very Easy | 5 |\n| Easy | 10 |\n| Medium | 15 |\n| Hard | 20 |\n| Very Hard | 25 |\n| Nearly Impossible | 30 |",
        subsections: [
          {
            id: "contests",
            title: "Contests",
            content: "Sometimes one character’s or monster’s efforts are directly opposed to another’s. This can occur when both of them are trying to do the same thing and only one can succeed, such as attempting to snatch up a magic ring that has fallen on the floor. This situation also applies when one of them is trying to prevent the other one from accomplishing a goal—for example, when a monster tries to force open a door that an adventurer is holding closed.\n\nIn these situations, the outcome is determined by a special form of ability check, called a contest. Both participants in a contest make ability checks appropriate to their efforts. They apply all appropriate bonuses and penalties, but instead of comparing the total to a DC, they compare the totals of their two checks. The participant with the higher check total wins the contest. That character or monster either succeeds at the action or prevents the other one from succeeding.\n\nIf the contest results in a tie, the situation remains the same as it was before the contest."
          },
          {
            id: "skills",
            title: "Skills",
            content: "Each ability covers a broad range of capabilities, including skills that a character or a monster can be proficient in. A skill represents a specific aspect of an ability score, and a character’s proficiency in a skill demonstrates a focus on that aspect.\n\nSometimes, the DM might ask for an ability check using a specific skill—for example, “Make a Wisdom (Perception) check.” At other times, a player might ask the DM if proficiency in a particular skill applies to a check. In either case, proficiency in a skill means an individual can add his or her proficiency bonus to ability checks that involve that skill."
          },
          {
            id: "passive-checks",
            title: "Passive Checks",
            content: "A passive check is a special kind of ability check that doesn’t involve any die rolls. Such a check can represent the average result for a task done repeatedly, such as searching for secret doors over and over again, or can be used when the DM wants to secretly determine whether the characters succeed at something without rolling dice, such as noticing a hidden monster.\n\nHere’s how to determine a character’s total for a passive check: **10 + all modifiers that normally apply to the check**. If the character has advantage on the check, add 5. For disadvantage, subtract 5."
          },
        ]
      },
      {
        id: "saving-throws",
        title: "Saving Throws",
        content: "A saving throw—or save—represents an attempt to resist a spell, a trap, a poison, a disease, or a similar threat. You don’t normally decide to make a saving throw; you are forced to make one because your character or monster is at risk of harm.\n\nTo make a saving throw, roll a d20 and add the appropriate ability modifier. For example, you use your Dexterity modifier for a Dexterity saving throw. A saving throw can be modified by a situational bonus or penalty and can be affected by advantage and disadvantage, as determined by the DM.\n\nThe result of a successful or failed saving throw is also detailed in the effect that causes the save. Usually, a successful save means that a creature suffers no harm, or reduced harm, from an effect."
      }
    ]
  },
  {
    id: "adventuring",
    title: "Adventuring",
    content: "Adventuring involves exploring dangerous and mysterious places, interacting with strange creatures, and facing challenges that test a character's skills and resolve.",
    subsections: [
      {
        id: "movement",
        title: "Movement",
        content: "On your turn, you can move a distance up to your speed. You can use as much or as little of your speed as you like on your turn, following the rules here.\n\n**Difficult Terrain**: Combat rarely takes place in bare rooms or on featureless plains. Boulder-strewn caverns, briar-choked forests, treacherous staircases—the setting of a typical fight contains difficult terrain. Every foot of movement in difficult terrain costs 1 extra foot. This rule is true even if multiple things in a space count as difficult terrain.\n\n**Other Movement**: Creatures might have climbing, swimming, or flying speeds. A creature with a climbing or swimming speed doesn't have to spend extra movement to climb or swim."
      },
       {
        id: "travel",
        title: "Travel",
        content: "While traveling, a group of adventurers can move at a normal, fast, or slow pace.",
        subsections: [
          {
            id: "travel-pace",
            title: "Travel Pace",
            content: "The Travel Pace table assumes a group of adventurers is traveling for 8 hours in a day.\n\n| Pace | Distance per Minute | Distance per Hour | Distance per Day | Effect |\n| :--- | :--- | :--- | :--- | :--- |\n| Fast | 400 feet | 4 miles | 30 miles | -5 penalty to passive Wisdom (Perception) scores |\n| Normal | 300 feet | 3 miles | 24 miles | — |\n| Slow | 200 feet | 2 miles | 18 miles | Able to use stealth |"
          }
        ]
      },
      {
        id: "the-environment",
        title: "The Environment",
        content: "The environment can present challenges and hazards to adventurers.",
        subsections: [
          {
            id: "vision-and-light",
            title: "Vision and Light",
            content: "**Bright Light**: In bright light, most creatures can see normally.\n\n**Dim Light**: Also called shadows, creates a lightly obscured area. An area of dim light is usually a boundary between a source of bright light and surrounding darkness.\n\n**Darkness**: Creates a heavily obscured area. Characters face darkness outdoors at night (even most moonlit nights), within the confines of an unlit dungeon or a subterranean vault, or in an area of magical darkness.\n\n**Blindsight**: A creature with blindsight can perceive its surroundings without relying on sight, within a specific radius.\n\n**Darkvision**: A creature with darkvision can see in darkness as if the darkness were dim light, so areas of darkness are only lightly obscured as far as that creature is concerned. However, the creature can’t discern color in darkness, only shades of gray.\n\n**Truesight**: A creature with truesight can, out to a specific range, see in normal and magical darkness, see invisible creatures and objects, automatically detect visual illusions and succeed on saving throws against them, and perceive the original form of a shapechanger or a creature that is transformed by magic."
          },
          {
            id: "food-and-water",
            title: "Food and Water",
            content: "A character needs one pound of food and one gallon of water per day. A character can go without food for a number of days equal to 3 + his or her Constitution modifier (minimum 1). At the end of each day beyond that limit, a character automatically suffers one level of exhaustion.\n\nA character can drink half the required amount of water, or half that amount per day if the character is in a hot climate, but suffers one level of exhaustion at the end of the day. A character with no water at all automatically suffers one level of exhaustion at the end of the day."
          },
          {
            id: "interacting-with-objects",
            title: "Interacting with Objects",
            content: "A character’s interaction with objects in an environment is often simple to resolve in the game. The player tells the DM that his or her character is doing something, such as pulling a lever, and the DM describes what, if anything, happens.\n\nFor example, a character might decide to pull a lever, which might, in turn, raise a portcullis, cause a room to flood with water, or open a secret door in a nearby wall. If the lever is rusted in position, though, a character might need to make a Strength check to force it to move. The DM sets the DC for any such check based on the difficulty of the task."
          }
        ]
      },
      {
        id: "resting",
        title: "Resting",
        content: "Adventurers can take short rests in the midst of an adventuring day and a long rest to end the day.\n\n**Short Rest**: A short rest is a period of downtime, at least 1 hour long, during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds. A character can spend one or more Hit Dice at the end of a short rest, up to the character’s maximum number of Hit Dice, which is equal to the character’s level.\n\n**Long Rest**: A long rest is a period of extended downtime, at least 8 hours long, during which a character sleeps or performs light activity: reading, talking, eating, or standing watch for no more than 2 hours. A character regains all lost hit points at the end of a long rest. The character also regains spent Hit Dice, up to a number of dice equal to half of the character’s total number of them (minimum of one die). A character must have at least 1 hit point at the start of the rest to gain its benefits."
      }
    ]
  },
  {
    id: "combat",
    title: "Combat",
    content: "A typical combat encounter is a clash between two sides, a flurry of weapon swings, feints, parries, footwork, and spellcasting. The game organizes the chaos of combat into a cycle of rounds and turns.",
    subsections: [
      {
        id: "order-of-combat",
        title: "The Order of Combat",
        content: "A round represents about 6 seconds in the game world. During a round, each participant in a battle takes a turn. The order of turns is determined at the beginning of a combat encounter, when everyone rolls initiative. Once everyone has taken a turn, the fight continues to the next round if neither side has defeated the other.",
        subsections: [
          {
            id: "surprise",
            title: "Surprise",
            content: "If you’re surprised, you can’t move or take an action on your first turn of the combat, and you can’t take a reaction until that turn ends. A member of a group can be surprised even if the other members aren’t."
          },
          {
            id: "initiative",
            title: "Initiative",
            content: "At the beginning of every combat, you roll a d20 for your character's initiative. This is a Dexterity check. The DM ranks all combatants from the one with the highest initiative total to the one with the lowest. This is the order in which they act during each round."
          }
        ]
      },
      {
        id: "your-turn",
        title: "Your Turn",
        content: "On your turn, you can **move** a distance up to your speed and **take one action**.\n\nYou can also take a **bonus action** if a special ability, spell, or feature allows it. You can take only one bonus action on your turn.\n\nYou can also interact with one object or feature of the environment for free, either during your move or during your action. For example, you could open a door during your move as you stride toward a foe, or you could draw your weapon as part of the same action you use to attack.\n\nFinally, you can take a **reaction** once per round (not on your turn). A reaction is an instant response to a trigger of some kind, which can occur on your turn or on someone else’s. The opportunity attack is the most common type of reaction."
      },
      {
        id: "actions-in-combat",
        title: "Actions in Combat",
        content: "When you take your action on your turn, you can take one of the actions presented here, an action you gained from your class or a special feature, or an action that you improvise.\n\n- **Attack**: The most common action to take in combat is the Attack action, whether you are swinging a sword, firing an arrow from a bow, or brawling with your fists.\n- **Cast a Spell**: Many characters have access to spells and can use their action in combat to cast one.\n- **Dash**: When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers.\n- **Disengage**: If you take the Disengage action, your movement doesn’t provoke opportunity attacks for the rest of the turn.\n- **Dodge**: When you take the Dodge action, until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage.\n- **Help**: You can lend your aid to another creature in the completion of a task. The creature you help gains advantage on the next ability check it makes. Alternatively, you can aid a friendly creature in attacking a creature within 5 feet of you.\n- **Hide**: When you take the Hide action, you make a Dexterity (Stealth) check in an attempt to become unseen.\n- **Ready**: You prepare to take an action as a reaction to a specified trigger. First, you decide what perceivable circumstance will trigger your reaction. Then, you choose the action you will take in response to that trigger, or you choose to move up to your speed.\n- **Search**: You devote your attention to finding something. The DM might require you to make a Wisdom (Perception) check or an Intelligence (Investigation) check.\n- **Use an Object**: You normally interact with an object while doing something else, but when an object requires your action for its use, you take the Use an Object action."
      },
      {
        id: "making-an-attack",
        title: "Making an Attack",
        content: "Whether you’re striking with a melee weapon, firing a weapon at range, or making an attack roll as part of a spell, an attack has a simple structure.\n1. **Choose a target**.\n2. **Determine modifiers**. The three most common modifiers to an attack roll are ability modifiers, proficiency bonus, and situational penalties/bonuses.\n3. **Resolve the attack**. You make the attack roll. On a hit, you roll damage, unless the particular attack has rules that specify otherwise.\n\n**Attack Rolls**: To make an attack roll, roll a d20 and add the appropriate modifiers. If the total of the roll plus modifiers equals or exceeds the target’s Armor Class (AC), the attack hits.\n\n**Unseen Attackers and Targets**: When you attack a target that you can’t see, you have disadvantage on the attack roll. When a creature can’t see you, you have advantage on attack rolls against it.\n\n**Melee Attacks**: Used in hand-to-hand combat, a melee attack allows you to attack a foe within your reach. Most melee attacks use Strength. Finesse weapons can use Dexterity instead.\n\n**Ranged Attacks**: Used for attacking a target at a distance. Most ranged attacks use Dexterity. Thrown weapons can use Strength.",
        subsections: [
          {
            id: "opportunity-attacks",
            title: "Opportunity Attacks",
            content: "You can make an opportunity attack when a hostile creature that you can see moves out of your reach. To make the opportunity attack, you use your reaction to make one melee attack against the provoking creature. The attack occurs right before the creature leaves your reach.\n\nYou can avoid provoking an opportunity attack by taking the Disengage action. You also don’t provoke an opportunity attack when you teleport or when someone or something moves you without using your movement, action, or reaction."
          },
          {
            id: "grappling",
            title: "Grappling",
            content: "When you want to grab a creature or wrestle with it, you can use the Attack action to make a special melee attack, a grapple. If you’re able to make multiple attacks with the Attack action, this attack replaces one of them. The target of your grapple must be no more than one size larger than you and must be within your reach. Using at least one free hand, you try to seize the target by making a grapple check instead of an attack roll: a Strength (Athletics) check contested by the target’s Strength (Athletics) or Dexterity (Acrobatics) check. If you succeed, you subject the target to the grappled condition."
          },
          {
            id: "shoving",
            title: "Shoving a Creature",
            content: "Using the Attack action, you can make a special melee attack to shove a creature, either to knock it prone or push it away from you. If you’re able to make multiple attacks with the Attack action, this attack replaces one of them. The target must be no more than one size larger than you and must be within your reach. Instead of making an attack roll, you make a Strength (Athletics) check contested by the target’s Strength (Athletics) or Dexterity (Acrobatics) check. If you win the contest, you either knock the target prone or push it 5 feet away from you."
          }
        ]
      },
      {
        id: "cover",
        title: "Cover",
        content: "Walls, trees, creatures, and other obstacles can provide cover during combat, making a target more difficult to harm. A target can benefit from cover only when an attack or other effect originates on the opposite side of the cover.\n\n- **Half cover**: A target with half cover has a +2 bonus to AC and Dexterity saving throws.\n- **Three-quarters cover**: A target with three-quarters cover has a +5 bonus to AC and Dexterity saving throws.\n- **Total cover**: A target with total cover can’t be targeted directly by an attack or a spell, although some spells can reach such a target by including it in an area of effect."
      },
      {
        id: "damage-and-healing",
        title: "Damage and Healing",
        content: "**Damage Rolls**: Each weapon, spell, and harmful monster ability specifies the damage it deals. You roll the damage die or dice, add any modifiers, and apply the damage to your target. When attacking with a weapon, you add your ability modifier—the same modifier used for the attack roll—to the damage.\n\n**Critical Hits**: When you score a critical hit, you get to roll extra dice for the attack’s damage against the target. Roll all of the attack’s damage dice twice and add them together. Then add any relevant modifiers as normal.\n\n**Resistance and Vulnerability**: Some creatures and objects are exceedingly difficult or unusually easy to hurt with certain types of damage. If a creature or an object has resistance to a damage type, damage of that type is halved against it. If a creature or an object has vulnerability to a damage type, damage of that type is doubled against it.\n\n**Healing**: Unless it results in death, damage isn’t permanent. Rest can restore a creature’s hit points, and magical methods like a cure wounds spell or a potion of healing can remove damage in an instant.\n\n**Dropping to 0 Hit Points**: When you drop to 0 hit points, you either die outright or fall unconscious. If damage reduces you to 0 hit points and fails to kill you, you fall unconscious. This unconsciousness ends if you regain any hit points.\n\n**Death Saving Throws**: Whenever you start your turn with 0 hit points, you must make a special saving throw, called a death saving throw, to determine whether you creep closer to death or hang onto life. Roll a d20. If the roll is 10 or higher, you succeed. Otherwise, you fail. On your third success, you become stable. On your third failure, you die. Rolling a 1 counts as two failures. Rolling a 20 means you regain 1 hit point."
      },
    ]
  },
  {
    id: "spellcasting",
    title: "Spellcasting",
    content: "Magic permeates the worlds of D&D and most often appears in the form of a spell.",
    subsections: [
      {
        id: "what-is-a-spell",
        title: "What Is a Spell?",
        content: "A spell is a discrete magical effect, a single shaping of the magical energies that suffuse the multiverse into a specific, limited expression. In casting a spell, a character carefully plucks at the invisible strands of raw magic suffusing the world, pins them in place in a particular pattern, sets them vibrating in a specific way, and then releases them to unleash the desired effect—in most cases, all in the span of seconds.\n\n**Spell Level**: Every spell has a level from 0 to 9. A spell’s level is a general indicator of how powerful it is. Cantrips—simple but powerful spells that characters can cast almost by rote—are level 0.\n\n**Known and Prepared Spells**: Before a spellcaster can use a spell, he or she must have the spell firmly fixed in mind, or must have access to the spell in a magic item. Members of a few classes, including bards and sorcerers, have a limited list of spells they know that are always fixed in mind. The number of spells a wizard can prepare is equal to the wizard’s Intelligence modifier + his or her wizard level."
      },
      {
        id: "casting-a-spell",
        title: "Casting a Spell",
        content: "When a character casts any spell, the same basic rules are followed, regardless of the character’s class or the spell’s effects.",
        subsections: [
          {
            id: "casting-time",
            title: "Casting Time",
            content: "Most spells require a single action to cast, but some spells require a bonus action, a reaction, or much more time to cast."
          },
          {
            id: "components",
            title: "Components",
            content: "- **Verbal (V)**: Most spells require the chanting of mystic words. A character who is gagged or in an area of silence can’t cast a spell with a verbal component.\n- **Somatic (S)**: Spellcasting gestures might include a forceful gesticulation or an intricate set of gestures. If a spell requires a somatic component, the caster must have free use of at least one hand to perform these gestures.\n- **Material (M)**: Casting some spells requires particular objects, specified in parentheses in the component entry. A character can use a component pouch or a spellcasting focus in place of the components specified for a spell. But if a cost is indicated for a component, a character must have that specific component before he or she can cast the spell."
          },
          {
            id: "range",
            title: "Range",
            content: "The target of a spell must be within the spell’s range. For a spell that targets a creature of your choice, you must be able to see the creature."
          },
          {
            id: "duration",
            title: "Duration",
            content: "Many spells have instantaneous durations. Many spells, however, have durations of seconds, minutes, hours, or even days.",
            subsections: [
              {
                id: "concentration",
                title: "Concentration",
                content: "Some spells require you to maintain concentration in order to keep their magic active. If you lose concentration, such a spell ends.\n\nYou lose concentration on a spell if you cast another spell that requires concentration, if you take damage (you must make a Constitution saving throw with a DC of 10 or half the damage taken, whichever is higher), if you are incapacitated or die, or if the DM rules that you are distracted by an environmental phenomenon."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "equipment",
    title: "Equipment",
    content: "The marketplace of a city or town can provide a wealth of goods, from mundane supplies to exotic treasures. This section details common equipment and their costs.",
    subsections: [
        {
            id: "armor-and-shields",
            title: "Armor and Shields",
            content: "Fantasy gaming worlds are a vast tapestry of many different cultures, each with its own technology level. For this reason, adventurers have access to a variety of armor types, ranging from leather armor to chain mail to costly plate armor, with several other kinds of armor in between. The Armor table collects the most commonly available types of armor found in the game and separates them into three categories: light armor, medium armor, and heavy armor. Many warriors supplement their armor with a shield.\n\n**Armor Proficiency**: Anyone can put on a suit of armor or strap a shield to an arm. Only those proficient in the armor’s use know how to wear it effectively, however. Your class gives you proficiency with certain types of armor. If you wear armor that you lack proficiency with, you have disadvantage on any ability check, saving throw, or attack roll that involves Strength or Dexterity, and you can’t cast spells.\n\n**Armor Class (AC)**: Armor protects its wearer from attacks. The armor (and shield) you wear determines your base Armor Class.\n\n**Stealth**: If the Armor table shows “Disadvantage” in the Stealth column, the wearer has disadvantage on Dexterity (Stealth) checks."
        },
        {
            id: "weapons",
            title: "Weapons",
            content: "Your class grants proficiency in certain weapons, reflecting both the class’s focus and the tools you are most likely to use. Whether you favor a longsword or a longbow, your weapon and your ability to wield it effectively can mean the difference between life and death while adventuring.",
            subsections: [
                {
                    id: "weapon-properties",
                    title: "Weapon Properties",
                    content: "**Ammunition**: You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon.\n\n**Finesse**: When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity modifier for the attack and damage rolls.\n\n**Heavy**: Small creatures have disadvantage on attack rolls with heavy weapons.\n\n**Light**: A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons.\n\n**Loading**: Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make.\n\n**Range**: A weapon that can be used to make a ranged attack has a range in parentheses after the ammunition or thrown property. The range lists two numbers. The first is the weapon’s normal range in feet, and the second indicates the weapon’s long range. When attacking a target beyond normal range, you have disadvantage on the attack roll.\n\n**Reach**: This weapon adds 5 feet to your reach when you attack with it.\n\n**Thrown**: If a weapon has the thrown property, you can throw the weapon to make a ranged attack.\n\n**Two-Handed**: This weapon requires two hands when you attack with it.\n\n**Versatile**: This weapon can be used with one or two hands. A damage value in parentheses appears with the property—the damage when the weapon is used with two hands to make a melee attack."
                }
            ]
        }
    ]
  },
  {
    id: "magic-items",
    title: "Magic Items",
    content: "Magic items are the fruits of great magical power, objects that are not only useful but often legendary. They are the rewards that characters seek in their adventures.",
    subsections: [
        {
            id: "categories-of-magic-items",
            title: "Categories of Magic Items",
            content: "Each magic item belongs to a category: armor, potions, rings, rods, scrolls, staffs, wands, weapons, or wondrous items.\n\n- **Armor**: A suit of armor or a shield.\n- **Potion**: A magical liquid that produces its effect when imbibed.\n- **Ring**: An item worn on a finger.\n- **Rod**: A scepter-like item.\n- **Scroll**: A spell magically inscribed on a piece of parchment.\n- **Staff**: A length of wood that is typically imbued with powerful spells.\n- **Wand**: A thin rod that holds a specific type of magical power.\n- **Weapon**: A weapon that has magical properties.\n- **Wondrous Item**: Anything that doesn't fall into the other categories, from a bag of holding to a flying carpet."
        },
        {
            id: "attunement",
            title: "Attunement",
            content: "Some magic items require a creature to form a bond with them before their magical properties can be used. This bond is called attunement, and certain items have a prerequisite for it. If the prerequisite is a class, a creature must be a member of that class to attune to the item.\n\nA creature can be attuned to no more than three magic items at a time. Attuning to an item requires a creature to spend a short rest focused on only that item while being in physical contact with it."
        }
    ]
  },
  {
    id: "conditions",
    title: "Conditions",
    content: "Conditions alter a creature’s capabilities in a variety of ways and can arise as a result of a spell, a class feature, a monster’s attack, or other effect. A condition lasts either until it is countered or for a duration specified by the effect that imposed the condition.",
    subsections: [
        { id: "blinded", title: "Blinded", content: "• A blinded creature can’t see and automatically fails any ability check that requires sight.\n• Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage." },
        { id: "charmed", title: "Charmed", content: "• A charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects.\n• The charmer has advantage on any ability check to interact socially with the creature." },
        { id: "deafened", title: "Deafened", content: "• A deafened creature can’t hear and automatically fails any ability check that requires hearing." },
        { id: "exhaustion", title: "Exhaustion", content: "Some special abilities and environmental hazards can lead to a special condition called exhaustion. Exhaustion is measured in six levels.\n\n| Level | Effect |\n| :--- | :--- |\n| 1 | Disadvantage on ability checks |\n| 2 | Speed halved |\n| 3 | Disadvantage on attack rolls and saving throws |\n| 4 | Hit point maximum halved |\n| 5 | Speed reduced to 0 |\n| 6 | Death |\n\nFinishing a long rest reduces a creature's exhaustion level by 1, provided that it has also ingested some food and drink." },
        { id: "frightened", title: "Frightened", content: "• A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.\n• The creature can’t willingly move closer to the source of its fear." },
        { id: "grappled", title: "Grappled", content: "• A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.\n• The condition ends if the grappler is incapacitated.\n• The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect." },
        { id: "incapacitated", title: "Incapacitated", content: "• An incapacitated creature can’t take actions or reactions." },
        { id: "invisible", title: "Invisible", content: "• An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured.\n• Attack rolls against the creature have disadvantage, and the creature’s attack rolls have advantage." },
        { id: "paralyzed", title: "Paralyzed", content: "• A paralyzed creature is incapacitated and can’t move or speak.\n• The creature automatically fails Strength and Dexterity saving throws.\n• Attack rolls against the creature have advantage.\n• Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature." },
        { id: "petrified", title: "Petrified", content: "• A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.\n• The creature is incapacitated, can’t move or speak, and is unaware of its surroundings.\n• Attack rolls against the creature have advantage.\n• The creature automatically fails Strength and Dexterity saving throws.\n• The creature has resistance to all damage.\n• The creature is immune to poison and disease." },
        { id: "poisoned", title: "Poisoned", content: "• A poisoned creature has disadvantage on attack rolls and ability checks." },
        { id: "prone", title: "Prone", content: "• A prone creature’s only movement option is to crawl, unless it stands up and thereby ends the condition.\n• The creature has disadvantage on attack rolls.\n• An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage." },
        { id: "restrained", title: "Restrained", content: "• A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.\n• Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.\n• The creature has disadvantage on Dexterity saving throws." },
        { id: "stunned", title: "Stunned", content: "• A stunned creature is incapacitated, can’t move, and can speak only falteringly.\n• The creature automatically fails Strength and Dexterity saving throws.\n• Attack rolls against the creature have advantage." },
        { id: "unconscious", title: "Unconscious", content: "• An unconscious creature is incapacitated, can’t move or speak, and is unaware of its surroundings.\n• The creature drops whatever it’s holding and falls prone.\n• The creature automatically fails Strength and Dexterity saving throws.\n• Attack rolls against the creature have advantage.\n• Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature." }
    ]
  }
];
