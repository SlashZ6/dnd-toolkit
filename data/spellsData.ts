import { Spell } from '../types';

export const DND_SPELLS: { [key: string]: Spell } = {
  // Cantrips
  "Acid Splash": {
    name: "Acid Splash", level: 0, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Blade Ward": {
    name: "Blade Ward", level: 0, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 round",
    description: "You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Booming Blade": {
    name: "Booming Blade", level: 0, school: "Evocation", castingTime: "1 action", range: "Self (5-foot radius)", components: "S, M (a weapon)", duration: "1 round",
    description: "You brandish the weapon used in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then becomes sheathed in booming energy until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends.",
    class: ["Artificer", "Warlock", "Wizard"]
  },
  "Chill Touch": {
    name: "Chill Touch", level: 0, school: "Necromancy", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "1 round",
    description: "You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Control Flames": {
    name: "Control Flames", level: 0, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "S", duration: "Instantaneous or 1 hour",
    description: "You choose nonmagical flame that you can see within range and that fits within a 5-foot cube. You affect it in one of the following ways: You instantaneously expand the flame 5 feet in one direction, provided that wood or other fuel is present in the new location. You instantaneously extinguish the flames within the cube. You double or halve the area of bright light and dim light cast by the flame, change its color, or both. The change lasts for 1 hour. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear within the flames and animate as you like. The shapes last for 1 hour.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Create Bonfire": {
    name: "Create Bonfire", level: 0, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You create a bonfire on ground that you can see within range. Until the spell ends, the bonfire fills a 5-foot cube. Any creature in the bonfire's space when you cast the spell must succeed on a Dexterity saving throw or take 1d8 fire damage. A creature must also make the saving throw when it moves into the bonfire's space for the first time on a turn or ends its turn there.",
    class: ["Artificer", "Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Dancing Lights": {
    name: "Dancing Lights", level: 0, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size.",
    class: ["Artificer", "Bard", "Sorcerer", "Wizard"]
  },
  "Druidcraft": {
    name: "Druidcraft", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    description: "You create a tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. You can also make a flower blossom, a seed pod open, or a leaf bud bloom. You can create an instantaneous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint odor of skunk. The effect must fit in a 5-foot cube.",
    class: ["Druid"]
  },
  "Eldritch Blast": {
    name: "Eldritch Blast", level: 0, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    description: "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
    class: ["Warlock"]
  },
  "Encode Thoughts": {
    name: "Encode Thoughts", level: 0, school: "Enchantment", castingTime: "1 action", range: "Self", components: "S", duration: "8 hours",
    description: "You pull a thought from your mind and manifest it as a tangible string of glowing energy. The thought can be a memory, an idea, or a message. You can hold onto the thought strand indefinitely, or you can store it in a Tiny object. A creature who touches the strand receives the thought.",
    class: ["Wizard"]
  },
  "Fire Bolt": {
    name: "Fire Bolt", level: 0, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    description: "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Friends": {
    name: "Friends", level: 0, school: "Enchantment", castingTime: "1 action", range: "Self", components: "S, M", duration: "Concentration, up to 1 minute",
    description: "For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn't hostile toward you. When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Frostbite": {
    name: "Frostbite", level: 0, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "You cause numbing frost to form on one creature that you can see within range. The target must make a Constitution saving throw. On a failed save, the target takes 1d6 cold damage, and it has disadvantage on the next weapon attack roll it makes before the end of its next turn.",
    class: ["Artificer", "Druid", "Warlock", "Wizard"]
  },
  "Green-Flame Blade": {
    name: "Green-Flame Blade", level: 0, school: "Evocation", castingTime: "1 action", range: "Self (5-foot radius)", components: "S, M (a weapon)", duration: "Instantaneous",
    description: "You brandish the weapon used in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects, and you can cause green fire to leap from the target to a different creature of your choice that you can see within 5 feet of it. The second creature takes fire damage equal to your spellcasting ability modifier.",
    class: ["Artificer", "Sorcerer", "Warlock", "Wizard"]
  },
  "Guidance": {
    name: "Guidance", level: 0, school: "Divination", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.",
    class: ["Artificer", "Cleric", "Druid"]
  },
  "Gust": {
    name: "Gust", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    description: "You seize the air and compel it to create one of the following effects at a point you can see within range: One Medium or smaller creature that you choose must succeed on a Strength saving throw or be pushed up to 5 feet away from you. You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters shut, or your clothing to ripple in a breeze.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Infestation": {
    name: "Infestation", level: 0, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You cause a cloud of mites, fleas, and other parasites to appear momentarily on one creature you can see within range. The target must succeed on a Constitution saving throw, or it takes 1d6 poison damage and moves 5 feet in a random direction if it can move and its speed is at least 5 feet.",
    class: ["Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Light": {
    name: "Light", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, M", duration: "1 hour",
    description: "You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet.",
    class: ["Artificer", "Bard", "Cleric", "Sorcerer", "Wizard"]
  },
  "Lightning Lure": {
    name: "Lightning Lure", level: 0, school: "Evocation", castingTime: "1 action", range: "Self (15-foot radius)", components: "V", duration: "Instantaneous",
    description: "You create a lash of lightning energy that strikes at one creature of your choice that you can see within 15 feet of you. The target must succeed on a Strength saving throw or be pulled up to 10 feet in a straight line toward you and then take 1d8 lightning damage if it is within 5 feet of you.",
    class: ["Artificer", "Sorcerer", "Warlock", "Wizard"]
  },
  "Mage Hand": {
    name: "Mage Hand", level: 0, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "1 minute",
    description: "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.",
    class: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Magic Stone": {
    name: "Magic Stone", level: 0, school: "Transmutation", castingTime: "1 bonus action", range: "Touch", components: "V, S", duration: "1 minute",
    description: "You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack with one of the pebbles by throwing it or hurling it with a sling. On a hit, the target takes bludgeoning damage equal to 1d6 + your spellcasting ability modifier.",
    class: ["Artificer", "Druid", "Warlock"]
  },
  "Mind Sliver": {
    name: "Mind Sliver", level: 0, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "1 round",
    description: "You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Mending": {
    name: "Mending", level: 0, school: "Transmutation", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.",
    class: ["Artificer", "Bard", "Cleric", "Druid", "Sorcerer", "Wizard"]
  },
  "Message": {
    name: "Message", level: 0, school: "Transmutation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "1 round",
    description: "You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.",
    class: ["Artificer", "Bard", "Sorcerer", "Wizard"]
  },
  "Minor Illusion": {
    name: "Minor Illusion", level: 0, school: "Illusion", castingTime: "1 action", range: "30 feet", components: "S, M", duration: "1 minute",
    description: "You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Mold Earth": {
    name: "Mold Earth", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "S", duration: "Instantaneous or 1 hour",
    description: "You choose a portion of dirt or stone that you can see within range and that fits within a 5-foot cube. You can manipulate it in one of the following ways: excavate loose earth, cause shapes, colors, or both to appear on the dirt or stone, or change the ground to difficult terrain.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Poison Spray": {
    name: "Poison Spray", level: 0, school: "Conjuration", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "Instantaneous",
    description: "You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.",
    class: ["Artificer", "Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Prestidigitation": {
    name: "Prestidigitation", level: 0, school: "Transmutation", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "Up to 1 hour",
    description: "This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range: a harmless sensory effect, light a or snuff out a candle, clean or soil an object, chill/warm/flavor nonliving material, make a color/mark/symbol appear, or create a nonmagical trinket that lasts until your next turn.",
    class: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Primal Savagery": {
    name: "Primal Savagery", level: 0, school: "Transmutation", castingTime: "1 action", range: "Self", components: "S", duration: "Instantaneous",
    description: "Your teeth or fingernails lengthen and sharpen. You make a melee spell attack against one creature within 5 feet of you. On a hit, the target takes 1d10 acid damage.",
    class: ["Druid"]
  },
  "Produce Flame": {
    name: "Produce Flame", level: 0, school: "Conjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes",
    description: "A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again. You can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.",
    class: ["Druid"]
  },
  "Ray of Frost": {
    name: "Ray of Frost", level: 0, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Resistance": {
    name: "Resistance", level: 0, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.",
    class: ["Artificer", "Cleric", "Druid"]
  },
  "Sacred Flame": {
    name: "Sacred Flame", level: 0, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.",
    class: ["Cleric"]
  },
  "Sapping Sting": {
    name: "Sapping Sting", level: 0, school: "Necromancy", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    description: "You sap the vitality of one creature you can see in range. The target must succeed on a Constitution saving throw or take 1d4 necrotic damage and fall prone.",
    class: ["Wizard"]
  },
  "Shape Water": {
    name: "Shape Water", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "S", duration: "Instantaneous or 1 hour",
    description: "You choose an area of water that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways: You instantaneously move or otherwise change the flow of the water as you direct. You cause the water to form into simple shapes and animate at your direction. You change the water's color or opacity. You freeze the water, provided that there are no creatures in it.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Shillelagh": {
    name: "Shillelagh", level: 0, school: "Transmutation", castingTime: "1 bonus action", range: "Touch", components: "V, S, M", duration: "1 minute",
    description: "The wood of a club or quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8.",
    class: ["Druid"]
  },
  "Shocking Grasp": {
    name: "Shocking Grasp", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous",
    description: "Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can't take reactions until the start of its next turn.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Spare the Dying": {
    name: "Spare the Dying", level: 0, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous",
    description: "You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.",
    class: ["Artificer", "Cleric"]
  },
  "Sword Burst": {
    name: "Sword Burst", level: 0, school: "Conjuration", castingTime: "1 action", range: "Self (5-foot radius)", components: "V", duration: "Instantaneous",
    description: "You create a momentary circle of spectral blades that sweep around you. Each creature within range, other than you, must succeed on a Dexterity saving throw or take 1d6 force damage.",
    class: ["Artificer", "Sorcerer", "Warlock", "Wizard"]
  },
  "Thaumaturgy": {
    name: "Thaumaturgy", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V", duration: "Up to 1 minute",
    description: "You manifest a minor wonder, a sign of supernatural power, within range. You create one of the following magical effects within range: Your voice booms up to three times as loud as normal for 1 minute. You cause flames to flicker, brighten, dim, or change color for 1 minute. You cause harmless tremors in the ground for 1 minute. You create an instantaneous sound that originates from a point of your choice within range. You instantaneously cause an unlocked door or window to fly open or slam shut. You alter the appearance of your eyes for 1 minute.",
    class: ["Cleric"]
  },
  "Thorn Whip": {
    name: "Thorn Whip", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you.",
    class: ["Artificer", "Druid"]
  },
  "Thunderclap": {
    name: "Thunderclap", level: 0, school: "Evocation", castingTime: "1 action", range: "Self (5-foot radius)", components: "S", duration: "Instantaneous",
    description: "You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must make a Constitution saving throw or take 1d6 thunder damage.",
    class: ["Artificer", "Bard", "Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Toll the Dead": {
    name: "Toll the Dead", level: 0, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "You point at one creature you can see within range, and the sound of a dolorous bell fills the air around it for a moment. The target must succeed on a Wisdom saving throw or take 1d8 necrotic damage. If the target is missing any of its hit points, it instead takes 1d12 necrotic damage.",
    class: ["Cleric", "Warlock", "Wizard"]
  },
  "True Strike": {
    name: "True Strike", level: 0, school: "Divination", castingTime: "1 action", range: "30 feet", components: "S", duration: "Concentration, up to 1 round",
    description: "You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Vicious Mockery": {
    name: "Vicious Mockery", level: 0, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous",
    description: "You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you, it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.",
    class: ["Bard"]
  },
  "Word of Radiance": {
    name: "Word of Radiance", level: 0, school: "Evocation", castingTime: "1 action", range: "5 feet", components: "V, M", duration: "Instantaneous",
    description: "You utter a divine word, and burning radiance erupts from you. Each creature of your choice that you can see within range must succeed on a Constitution saving throw or take 1d6 radiant damage.",
    class: ["Cleric"]
  },

  // Level 1
  "Alarm": {
    name: "Alarm", level: 1, school: "Abjuration", castingTime: "1 minute", range: "30 feet", components: "V, S, M (a tiny bell and a piece of fine silver wire)", duration: "8 hours",
    description: "You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. You decide whether the alarm is mental or audible.",
    class: ["Artificer", "Ranger", "Wizard"]
  },
  "Animal Friendship": {
    name: "Animal Friendship", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "24 hours",
    description: "This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration.",
    class: ["Bard", "Druid", "Ranger"]
  },
  "Armor of Agathys": {
    name: "Armor of Agathys", level: 1, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "1 hour",
    description: "A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.",
    class: ["Warlock"]
  },
  "Arms of Hadar": {
    name: "Arms of Hadar", level: 1, school: "Conjuration", castingTime: "1 action", range: "Self (10-foot radius)", components: "V, S", duration: "Instantaneous",
    description: "You invoke the power of Hadar, the Dark Hunger. Tendrils of dark energy erupt from you and batter all creatures within 10 feet of you. Each creature in that area must make a Strength saving throw. On a failed save, a target takes 2d6 necrotic damage and can't take reactions until its next turn.",
    class: ["Warlock"]
  },
  "Bane": {
    name: "Bane", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.",
    class: ["Bard", "Cleric"]
  },
  "Bless": {
    name: "Bless", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.",
    class: ["Cleric", "Paladin"]
  },
  "Burning Hands": {
    name: "Burning Hands", level: 1, school: "Evocation", castingTime: "1 action", range: "Self (15-foot cone)", components: "V, S", duration: "Instantaneous",
    description: "As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.",
    class: ["Sorcerer", "Wizard"]
  },
  "Charm Person": {
    name: "Charm Person", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "1 hour",
    description: "You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it.",
    class: ["Bard", "Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Chromatic Orb": {
    name: "Chromatic Orb", level: 1, school: "Evocation", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 damage of the type you chose.",
    class: ["Sorcerer", "Wizard"]
  },
  "Color Spray": {
    name: "Color Spray", level: 1, school: "Illusion", castingTime: "1 action", range: "Self (15-foot cone)", components: "V, S, M", duration: "1 round",
    description: "A dazzling array of flashing, colored light springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can affect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points. Each creature affected by this spell is blinded until the spell ends.",
    class: ["Sorcerer", "Wizard"]
  },
  "Command": {
    name: "Command", level: 1, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "1 round",
    description: "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn.",
    class: ["Cleric", "Paladin"]
  },
  "Compelled Duel": {
    name: "Compelled Duel", level: 1, school: "Enchantment", castingTime: "1 bonus action", range: "30 feet", components: "V", duration: "Concentration, up to 1 minute",
    description: "You attempt to compel a creature into a duel. One creature that you can see within range must make a Wisdom saving throw. On a failed save, the creature is drawn to you, compelled by your divine demand. For the duration, it has disadvantage on attack rolls against creatures other than you, and must make a Wisdom saving throw each time it attempts to move to a space that is more than 30 feet away from you.",
    class: ["Paladin"]
  },
  "Comprehend Languages": {
    name: "Comprehend Languages", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "1 hour",
    description: "For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Create or Destroy Water": {
    name: "Create or Destroy Water", level: 1, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You either create or destroy water. Create Water: You create up to 10 gallons of clean water within range in an open container. Destroy Water: You destroy up to 10 gallons of water in an open container within range.",
    class: ["Cleric", "Druid"]
  },
  "Cure Wounds": {
    name: "Cure Wounds", level: 1, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous",
    description: "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    class: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"]
  },
  "Detect Evil and Good": {
    name: "Detect Evil and Good", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located. You also know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated.",
    class: ["Cleric", "Paladin"]
  },
  "Detect Magic": {
    name: "Detect Magic", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.",
    class: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Wizard"]
  },
  "Detect Poison and Disease": {
    name: "Detect Poison and Disease", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.",
    class: ["Cleric", "Druid", "Paladin", "Ranger"]
  },
  "Disguise Self": {
    name: "Disguise Self", level: 1, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 hour",
    description: "You make yourself--including your clothing, armor, weapons, and other belongings on your person--look different until the spell ends or until you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between.",
    class: ["Artificer", "Bard", "Sorcerer", "Wizard"]
  },
  "Dissonant Whispers": {
    name: "Dissonant Whispers", level: 1, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous",
    description: "You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you.",
    class: ["Bard"]
  },
  "Divine Favor": {
    name: "Divine Favor", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.",
    class: ["Paladin"]
  },
  "Ensnaring Strike": {
    name: "Ensnaring Strike", level: 1, school: "Conjuration", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the magical vines until the spell ends.",
    class: ["Ranger"]
  },
  "Entangle": {
    name: "Entangle", level: 1, school: "Conjuration", castingTime: "1 action", range: "90 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends.",
    class: ["Druid"]
  },
  "Expeditious Retreat": {
    name: "Expeditious Retreat", level: 1, school: "Transmutation", castingTime: "1 bonus action", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.",
    class: ["Artificer", "Sorcerer", "Warlock", "Wizard"]
  },
  "False Life": {
    name: "False Life", level: 1, school: "Necromancy", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "1 hour",
    description: "Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Faerie Fire": {
    name: "Faerie Fire", level: 1, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V", duration: "Concentration, up to 1 minute",
    description: "Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius. Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible.",
    class: ["Artificer", "Bard", "Druid"]
  },
  "Feather Fall": {
    name: "Feather Fall", level: 1, school: "Transmutation", castingTime: "1 reaction", range: "60 feet", components: "V, M", duration: "1 minute",
    description: "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.",
    class: ["Artificer", "Bard", "Sorcerer", "Wizard"]
  },
  "Find Familiar": {
    name: "Find Familiar", level: 1, school: "Conjuration", castingTime: "1 hour", range: "10 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You gain the service of a familiar, a spirit that takes an animal form you choose: bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of a beast.",
    class: ["Wizard"]
  },
  "Fog Cloud": {
    name: "Fog Cloud", level: 1, school: "Conjuration", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.",
    class: ["Druid", "Ranger", "Sorcerer", "Wizard"]
  },
  "Goodberry": {
    name: "Goodberry", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day.",
    class: ["Druid", "Ranger"]
  },
  "Grease": {
    name: "Grease", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "1 minute",
    description: "Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.",
    class: ["Artificer", "Wizard"]
  },
  "Guiding Bolt": {
    name: "Guiding Bolt", level: 1, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "1 round",
    description: "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage.",
    class: ["Cleric"]
  },
  "Hail of Thorns": {
    name: "Hail of Thorns", level: 1, school: "Conjuration", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit a creature with a ranged weapon attack before the spell ends, this spell creates a rain of thorns that sprouts from your ranged weapon or ammunition. In addition to the normal effect of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 1d10 piercing damage on a failed save, or half as much damage on a successful one.",
    class: ["Ranger"]
  },
  "Healing Word": {
    name: "Healing Word", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "60 feet", components: "V", duration: "Instantaneous",
    description: "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    class: ["Bard", "Cleric", "Druid"]
  },
  "Hellish Rebuke": {
    name: "Hellish Rebuke", level: 1, school: "Evocation", castingTime: "1 reaction", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.",
    class: ["Warlock"]
  },
  "Heroism": {
    name: "Heroism", level: 1, school: "Enchantment", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to being frightened and gains temporary hit points equal to your spellcasting ability modifier at the start of each of its turns.",
    class: ["Bard", "Paladin"]
  },
  "Hex": {
    name: "Hex", level: 1, school: "Enchantment", castingTime: "1 bonus action", range: "90 feet", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.",
    class: ["Warlock"]
  },
  "Hunter's Mark": {
    name: "Hunter's Mark", level: 1, school: "Divination", castingTime: "1 bonus action", range: "90 feet", components: "V", duration: "Concentration, up to 1 hour",
    description: "You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it.",
    class: ["Ranger"]
  },
  "Identify": {
    name: "Identify", level: 1, school: "Divination", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any.",
    class: ["Artificer", "Bard", "Wizard"]
  },
  "Illusory Script": {
    name: "Illusory Script", level: 1, school: "Illusion", castingTime: "1 minute", range: "Touch", components: "S, M", duration: "10 days",
    description: "You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration. To you and any creatures you designate when you cast the spell, the writing appears normal. To all others, the writing appears as if it were written in an unknown or magical script.",
    class: ["Bard", "Warlock", "Wizard"]
  },
  "Inflict Wounds": {
    name: "Inflict Wounds", level: 1, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous",
    description: "Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.",
    class: ["Cleric"]
  },
  "Jump": {
    name: "Jump", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 minute",
    description: "You touch a creature. The creature's jump distance is tripled until the spell ends.",
    class: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"]
  },
  "Longstrider": {
    name: "Longstrider", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour",
    description: "You touch a creature. The target's speed increases by 10 feet until the spell ends.",
    class: ["Artificer", "Bard", "Druid", "Ranger", "Wizard"]
  },
  "Mage Armor": {
    name: "Mage Armor", level: 1, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "8 hours",
    description: "You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier.",
    class: ["Sorcerer", "Wizard"]
  },
  "Magic Missile": {
    name: "Magic Missile", level: 1, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
    class: ["Sorcerer", "Wizard"]
  },
  "Protection from Evil and Good": {
    name: "Protection from Evil and Good", level: 1, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead. The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target.",
    class: ["Cleric", "Paladin", "Warlock", "Wizard"]
  },
  "Purify Food and Drink": {
    name: "Purify Food and Drink", level: 1, school: "Transmutation", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "Instantaneous",
    description: "All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.",
    class: ["Artificer", "Cleric", "Druid", "Paladin"]
  },
  "Ray of Sickness": {
    name: "Ray of Sickness", level: 1, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "A ray of sickening greenish energy lashes out toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw. On a failed save, it is also poisoned until the end of your next turn.",
    class: ["Sorcerer", "Wizard"]
  },
  "Searing Smite": {
    name: "Searing Smite", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit a creature with a melee weapon attack during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames.",
    class: ["Paladin"]
  },
  "Sanctuary": {
    name: "Sanctuary", level: 1, school: "Abjuration", castingTime: "1 bonus action", range: "30 feet", components: "V, S, M", duration: "1 minute",
    description: "You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell.",
    class: ["Artificer", "Cleric"]
  },
  "Shield": {
    name: "Shield", level: 1, school: "Abjuration", castingTime: "1 reaction", range: "Self", components: "V, S", duration: "1 round",
    description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.",
    class: ["Sorcerer", "Wizard"]
  },
  "Shield of Faith": {
    name: "Shield of Faith", level: 1, school: "Abjuration", castingTime: "1 bonus action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
    class: ["Cleric", "Paladin"]
  },
  "Silent Image": {
    name: "Silent Image", level: 1, school: "Illusion", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image is purely visual; it isn't accompanied by sound, smell, or other sensory effects.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Sleep": {
    name: "Sleep", level: 1, school: "Enchantment", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "1 minute",
    description: "This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures).",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Speak with Animals": {
    name: "Speak with Animals", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes",
    description: "You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at a minimum, beasts can give you information about nearby locations and monsters, including whatever they can see or have seen in the past day.",
    class: ["Bard", "Druid", "Ranger"]
  },
  "Tasha's Hideous Laughter": {
    name: "Tasha's Hideous Laughter", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration.",
    class: ["Bard", "Wizard"]
  },
  "Tenser's Floating Disk": {
    name: "Tenser's Floating Disk", level: 1, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "1 hour",
    description: "This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk can hold up to 500 pounds.",
    class: ["Wizard"]
  },
  "Thunderous Smite": {
    name: "Thunderous Smite", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The first time you hit with a melee weapon attack during this spell's duration, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage to the target. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone.",
    class: ["Paladin"]
  },
  "Thunderwave": {
    name: "Thunderwave", level: 1, school: "Evocation", castingTime: "1 action", range: "Self (15-foot cube)", components: "V, S", duration: "Instantaneous",
    description: "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed.",
    class: ["Bard", "Druid", "Sorcerer", "Wizard"]
  },
  "Unseen Servant": {
    name: "Unseen Servant", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "1 hour",
    description: "This spell creates an invisible, mindless, shapeless force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can't attack.",
    class: ["Bard", "Warlock", "Wizard"]
  },
  "Witch Bolt": {
    name: "Witch Bolt", level: 1, school: "Evocation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Wrathful Smite": {
    name: "Wrathful Smite", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit with a melee weapon attack during this spell's duration, your attack deals an extra 1d6 psychic damage. Additionally, if the target is a creature, it must make a Wisdom saving throw or be frightened of you until the spell ends.",
    class: ["Paladin"]
  },

  // Level 2
  "Aid": {
    name: "Aid", level: 2, school: "Abjuration", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "8 hours",
    description: "Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.",
    class: ["Artificer", "Cleric", "Paladin"]
  },
  "Alter Self": {
    name: "Alter Self", level: 2, school: "Transmutation", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You assume a different form. You can change your appearance, gain natural weapons, or adapt to an aquatic environment.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Animal Messenger": {
    name: "Animal Messenger", level: 2, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "24 hours",
    description: "By means of this spell, you use an animal to send a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description.",
    class: ["Bard", "Druid", "Ranger"]
  },
  "Arcane Lock": {
    name: "Arcane Lock", level: 2, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Until dispelled",
    description: "You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration. You and the creatures you designate when you cast this spell can open the object normally. The lock has a DC of 25 to break or pick.",
    class: ["Artificer", "Wizard"]
  },
  "Augury": {
    name: "Augury", level: 2, school: "Divination", castingTime: "1 minute", range: "Self", components: "V, S, M", duration: "Instantaneous",
    description: "By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes.",
    class: ["Cleric"]
  },
  "Barkskin": {
    name: "Barkskin", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing.",
    class: ["Druid", "Ranger"]
  },
  "Beast Sense": {
    name: "Beast Sense", level: 2, school: "Divination", castingTime: "1 action", range: "Touch", components: "S", duration: "Concentration, up to 1 hour",
    description: "You touch a willing beast. For the duration of the spell, you can use your action to see through the beast's eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.",
    class: ["Druid", "Ranger"]
  },
  "Blindness/Deafness": {
    name: "Blindness/Deafness", level: 2, school: "Necromancy", castingTime: "1 action", range: "30 feet", components: "V", duration: "1 minute",
    description: "You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration.",
    class: ["Bard", "Cleric", "Sorcerer", "Wizard"]
  },
  "Blur": {
    name: "Blur", level: 2, school: "Illusion", castingTime: "1 action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Branding Smite": {
    name: "Branding Smite", level: 2, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit a creature with a weapon attack before this spell ends, the weapon gleams with astral radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it's invisible, and the target sheds dim light in a 5-foot radius and can't become invisible until the spell ends.",
    class: ["Paladin"]
  },
  "Calm Emotions": {
    name: "Calm Emotions", level: 2, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of two effects. You can suppress any effect causing a target to be charmed or frightened. Or, you can make a target indifferent about creatures of your choice that it is hostile toward.",
    class: ["Bard", "Cleric"]
  },
  "Cloud of Daggers": {
    name: "Cloud of Daggers", level: 2, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell's area for the first time on a turn or starts its turn there.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Continual Flame": {
    name: "Continual Flame", level: 2, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Until dispelled",
    description: "A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen. A continual flame can be covered or hidden but not smothered or quenched.",
    class: ["Artificer", "Cleric", "Wizard"]
  },
  "Cordon of Arrows": {
    name: "Cordon of Arrows", level: 2, school: "Transmutation", castingTime: "1 action", range: "5 feet", components: "V, S, M", duration: "8 hours",
    description: "You plant four pieces of ammunition in the ground within range and lay a magic trap that protects them. When a creature other than you comes within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 1d6 piercing damage.",
    class: ["Ranger"]
  },
  "Crown of Madness": {
    name: "Crown of Madness", level: 2, school: "Enchantment", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration. While the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes. The charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Darkness": {
    name: "Darkness", level: 2, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, M", duration: "Concentration, up to 10 minutes",
    description: "Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Darkvision": {
    name: "Darkvision", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "8 hours",
    description: "You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.",
    class: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"]
  },
  "Detect Thoughts": {
    name: "Detect Thoughts", level: 2, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Enhance Ability": {
    name: "Enhance Ability", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect for the duration. Bear's Endurance, Bull's Strength, Cat's Grace, Eagle's Splendor, Fox's Cunning, Owl's Wisdom.",
    class: ["Artificer", "Bard", "Cleric", "Druid", "Sorcerer"]
  },
  "Enlarge/Reduce": {
    name: "Enlarge/Reduce", level: 2, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. Enlarge: The target's size doubles in all dimensions, and its weight is multiplied by eight. Reduce: The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Enthrall": {
    name: "Enthrall", level: 2, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "1 minute",
    description: "You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear you to make a Wisdom saving throw. Any creature that can't be charmed succeeds on this saving throw automatically, and on a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you until the spell ends or until the target can no longer hear you.",
    class: ["Bard", "Warlock"]
  },
  "Find Steed": {
    name: "Find Steed", level: 2, school: "Conjuration", castingTime: "10 minutes", range: "30 feet", components: "V, S", duration: "Instantaneous",
    description: "You summon a spirit that assumes the form of a loyal, majestic steed. Appearing in an unoccupied space within range, the steed takes on a form that you choose, such as a warhorse, a pony, a camel, an elk, or a mastiff.",
    class: ["Paladin"]
  },
  "Find Traps": {
    name: "Find Traps", level: 2, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "Instantaneous",
    description: "You sense the presence of any trap within line of sight that is within range. A trap, for the purpose of this spell, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator.",
    class: ["Cleric", "Druid", "Ranger"]
  },
  "Flame Blade": {
    name: "Flame Blade", level: 2, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke the blade again as a bonus action. You can use your action to make a melee spell attack with the fiery blade. On a hit, the target takes 3d6 fire damage.",
    class: ["Druid"]
  },
  "Flaming Sphere": {
    name: "Flaming Sphere", level: 2, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.",
    class: ["Druid", "Wizard"]
  },
  "Gentle Repose": {
    name: "Gentle Repose", level: 2, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "10 days",
    description: "You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead. The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as raise dead.",
    class: ["Cleric", "Wizard"]
  },
  "Gust of Wind": {
    name: "Gust of Wind", level: 2, school: "Evocation", castingTime: "1 action", range: "Self (60-foot line)", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Heat Metal": {
    name: "Heat Metal", level: 2, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell.",
    class: ["Artificer", "Bard", "Druid"]
  },
  "Hold Person": {
    name: "Hold Person", level: 2, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.",
    class: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Invisibility": {
    name: "Invisibility", level: 2, school: "Illusion", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell.",
    class: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Knock": {
    name: "Knock", level: 2, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous",
    description: "Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access. A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Lesser Restoration": {
    name: "Lesser Restoration", level: 2, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous",
    description: "You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.",
    class: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"]
  },
  "Levitate": {
    name: "Levitate", level: 2, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "One creature or object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Locate Animals or Plants": {
    name: "Locate Animals or Plants", level: 2, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Instantaneous",
    description: "Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.",
    class: ["Bard", "Druid", "Ranger"]
  },
  "Locate Object": {
    name: "Locate Object", level: 2, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.",
    class: ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Wizard"]
  },
  "Magic Mouth": {
    name: "Magic Mouth", level: 2, school: "Illusion", castingTime: "1 minute", range: "30 feet", components: "V, S, M", duration: "Until dispelled",
    description: "You implant a message within an object in range, a message that is uttered when a trigger condition is met. Choose an object that you can see and that isn't being worn or carried by another creature. Then speak the message, which must be 25 words or less, though it can be delivered over as long as 10 minutes.",
    class: ["Artificer", "Bard", "Wizard"]
  },
  "Magic Weapon": {
    name: "Magic Weapon", level: 2, school: "Transmutation", castingTime: "1 bonus action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.",
    class: ["Artificer", "Paladin", "Wizard"]
  },
  "Melf's Acid Arrow": {
    name: "Melf's Acid Arrow", level: 2, school: "Evocation", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.",
    class: ["Wizard"]
  },
  "Mirror Image": {
    name: "Mirror Image", level: 2, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 minute",
    description: "Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Misty Step": {
    name: "Misty Step", level: 2, school: "Conjuration", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Instantaneous",
    description: "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Moonbeam": {
    name: "Moonbeam", level: 2, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one.",
    class: ["Druid"]
  },
  "Nystul's Magic Aura": {
    name: "Nystul's Magic Aura", level: 2, school: "Illusion", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "24 hours",
    description: "You place an illusion on a creature or an object you touch so that divination spells reveal false information about it. You can choose one of two effects: False Aura or Mask.",
    class: ["Wizard"]
  },
  "Pass without Trace": {
    name: "Pass without Trace", level: 2, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can't be tracked by nonmagical means.",
    class: ["Druid", "Ranger"]
  },
  "Phantasmal Force": {
    name: "Phantasmal Force", level: 2, school: "Illusion", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube and that is perceivable only to the target for the duration.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Prayer of Healing": {
    name: "Prayer of Healing", level: 2, school: "Evocation", castingTime: "10 minutes", range: "30 feet", components: "V", duration: "Instantaneous",
    description: "Up to six creatures of your choice that you can see within range each regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    class: ["Cleric"]
  },
  "Protection from Poison": {
    name: "Protection from Poison", level: 2, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "1 hour",
    description: "You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random. For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage.",
    class: ["Artificer", "Cleric", "Druid", "Paladin", "Ranger"]
  },
  "Ray of Enfeeblement": {
    name: "Ray of Enfeeblement", level: 2, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends.",
    class: ["Warlock", "Wizard"]
  },
  "Rope Trick": {
    name: "Rope Trick", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour",
    description: "You touch a length of rope that is up to 60 feet long. One end of the rope then rises into the air until the whole rope hangs perpendicular to the ground. At the upper end of the rope, an invisible entrance opens to an extradimensional space that lasts until the spell ends.",
    class: ["Artificer", "Wizard"]
  },
  "Scorching Ray": {
    name: "Scorching Ray", level: 2, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    description: "You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.",
    class: ["Sorcerer", "Wizard"]
  },
  "See Invisibility": {
    name: "See Invisibility", level: 2, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "1 hour",
    description: "For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent.",
    class: ["Artificer", "Bard", "Sorcerer", "Wizard"]
  },
  "Shatter": {
    name: "Shatter", level: 2, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Silence": {
    name: "Silence", level: 2, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it.",
    class: ["Bard", "Cleric", "Ranger"]
  },
  "Spider Climb": {
    name: "Spider Climb", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.",
    class: ["Artificer", "Sorcerer", "Warlock", "Wizard"]
  },
  "Spike Growth": {
    name: "Spike Growth", level: 2, school: "Transmutation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.",
    class: ["Druid", "Ranger"]
  },
  "Spiritual Weapon": {
    name: "Spiritual Weapon", level: 2, school: "Evocation", castingTime: "1 bonus action", range: "60 feet", components: "V, S", duration: "1 minute",
    description: "You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.",
    class: ["Cleric"]
  },
  "Suggestion": {
    name: "Suggestion", level: 2, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, M", duration: "Concentration, up to 8 hours",
    description: "You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Warding Bond": {
    name: "Warding Bond", level: 2, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour",
    description: "This spell wards a willing creature you touch and creates a mystic connection between you and the target until the spell ends. While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has resistance to all damage. Also, each time it takes damage, you take the same amount of damage.",
    class: ["Cleric"]
  },
  "Web": {
    name: "Web", level: 2, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube. The webs are difficult terrain and lightly obscure their area. Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Zone of Truth": {
    name: "Zone of Truth", level: 2, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "10 minutes",
    description: "You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius.",
    class: ["Bard", "Cleric", "Paladin"]
  },

  // Level 3
  "Animate Dead": {
    name: "Animate Dead", level: 3, school: "Necromancy", castingTime: "1 minute", range: "10 feet", components: "V, S, M", duration: "Instantaneous",
    description: "This spell creates an undead servant. Choose a pile of bones or a corpse of a Medium or Small humanoid within range. Your spell imbues the target with a foul mimicry of life, raising it as an undead creature. The target becomes a skeleton if you chose bones or a zombie if you chose a corpse.",
    class: ["Cleric", "Wizard"]
  },
  "Aura of Vitality": {
    name: "Aura of Vitality", level: 3, school: "Evocation", castingTime: "1 action", range: "Self (30-foot radius)", components: "V", duration: "Concentration, up to 1 minute",
    description: "Healing energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. You can use a bonus action to cause one creature in the aura (including you) to regain 2d6 hit points.",
    class: ["Paladin"]
  },
  "Beacon of Hope": {
    name: "Beacon of Hope", level: 3, school: "Abjuration", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points from any healing.",
    class: ["Cleric"]
  },
  "Bestow Curse": {
    name: "Bestow Curse", level: 3, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options: Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score. While cursed, the target has disadvantage on attack rolls against you. While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing.",
    class: ["Bard", "Cleric", "Wizard"]
  },
  "Blinding Smite": {
    name: "Blinding Smite", level: 3, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit a creature with a melee weapon attack during this spell's duration, your weapon flares with a brilliant light, and the attack deals an extra 3d8 radiant damage to the target. Additionally, the target must succeed on a Constitution saving throw or be blinded until the spell ends.",
    class: ["Paladin"]
  },
  "Blink": {
    name: "Blink", level: 3, school: "Transmutation", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 minute",
    description: "Roll a d20 at the end of each of your turns for the duration of the spell. On a roll of 11 or higher, you vanish from your current plane of existence and appear in the Ethereal Plane. At the start of your next turn, and when the spell ends if you are on the Ethereal Plane, you return to an unoccupied space of your choice that you can see within 10 feet of the space you vanished from.",
    class: ["Sorcerer", "Wizard"]
  },
  "Call Lightning": {
    name: "Call Lightning", level: 3, school: "Conjuration", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see 100 feet directly above you. The spell fails if you can't see a point in the air where the storm cloud could appear. When you cast the spell, and as an action on each of your turns until the spell ends, you can call down a bolt of lightning from the cloud to a point you can see within range.",
    class: ["Druid"]
  },
  "Clairvoyance": {
    name: "Clairvoyance", level: 3, school: "Divination", castingTime: "10 minutes", range: "1 mile", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and you can't move it. You can choose to see or hear from the sensor's location.",
    class: ["Bard", "Cleric", "Sorcerer", "Wizard"]
  },
  "Conjure Animals": {
    name: "Conjure Animals", level: 3, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You summon fey spirits that take the form of beasts and appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One beast of challenge rating 2 or lower, Two beasts of challenge rating 1 or lower, Four beasts of challenge rating 1/2 or lower, Eight beasts of challenge rating 1/4 or lower.",
    class: ["Druid", "Ranger"]
  },
  "Conjure Barrage": {
    name: "Conjure Barrage", level: 3, school: "Conjuration", castingTime: "1 action", range: "Self (60-foot cone)", components: "V, S, M", duration: "Instantaneous",
    description: "You throw a nonmagical weapon or fire a piece of nonmagical ammunition into the air to create a cone of identical weapons that shoot forward and then disappear. Each creature in a 60-foot cone must succeed on a Dexterity saving throw. A creature takes 3d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as that of the weapon or ammunition used as a component.",
    class: ["Ranger"]
  },
  "Counterspell": {
    name: "Counterspell", level: 3, school: "Abjuration", castingTime: "1 reaction", range: "60 feet", components: "S", duration: "Instantaneous",
    description: "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Create Food and Water": {
    name: "Create Food and Water", level: 3, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    description: "You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours.",
    class: ["Cleric", "Paladin"]
  },
  "Crusader's Mantle": {
    name: "Crusader's Mantle", level: 3, school: "Evocation", castingTime: "1 action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "Holy power radiates from you in an aura with a 30-foot radius, awakening boldness in friendly creatures. Until the spell ends, the aura moves with you, centered on you. While in the aura, each nonhostile creature in the aura (including you) deals an extra 1d4 radiant damage when it hits with a weapon attack.",
    class: ["Paladin"]
  },
  "Daylight": {
    name: "Daylight", level: 3, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "1 hour",
    description: "A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet. If you chose a point on an object you are holding or one that isn't being worn or carried, the light shines from the object and moves with it.",
    class: ["Cleric", "Druid", "Paladin", "Ranger", "Sorcerer"]
  },
  "Dispel Magic": {
    name: "Dispel Magic", level: 3, school: "Abjuration", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    description: "Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends.",
    class: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Sorcerer", "Warlock", "Wizard"]
  },
  "Elemental Weapon": {
    name: "Elemental Weapon", level: 3, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "A nonmagical weapon you touch becomes a magic weapon. Choose one of the following damage types: acid, cold, fire, lightning, or thunder. For the duration, the weapon has a +1 bonus to attack rolls and deals an extra 1d4 damage of the chosen type when it hits.",
    class: ["Paladin"]
  },
  "Fear": {
    name: "Fear", level: 3, school: "Illusion", castingTime: "1 action", range: "Self (30-foot cone)", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Feign Death": {
    name: "Feign Death", level: 3, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour",
    description: "You touch a willing creature and put it into a cataleptic state that is indistinguishable from death. For the spell's duration, or until you use an action to touch the target and dismiss the spell, the target appears dead to all outward inspection and to spells used to determine the target's status.",
    class: ["Bard", "Cleric", "Druid", "Wizard"]
  },
  "Fireball": {
    name: "Fireball", level: 3, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
    class: ["Sorcerer", "Wizard"]
  },
  "Fly": {
    name: "Fly", level: 3, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You touch a willing creature. The target gains a flying speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft, unless it can stop the fall.",
    class: ["Artificer", "Sorcerer", "Warlock", "Wizard"]
  },
  "Gaseous Form": {
    name: "Gaseous Form", level: 3, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You transform a willing creature you touch, along with everything it's wearing and carrying, into a misty cloud for the duration. The spell ends if the creature drops to 0 hit points. An incorporeal creature isn't affected.",
    class: ["Artificer", "Sorcerer", "Warlock", "Wizard"]
  },
  "Glyph of Warding": {
    name: "Glyph of Warding", level: 3, school: "Abjuration", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Until dispelled or triggered",
    description: "When you cast this spell, you inscribe a glyph that later unleashes a magical effect. You inscribe it either on a surface (such as a table or a section of floor or wall) or within an object that can be closed (such as a book, a scroll, or a treasure chest) to conceal the glyph.",
    class: ["Artificer", "Bard", "Cleric", "Wizard"]
  },
  "Haste": {
    name: "Haste", level: 3, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Choose a willing creature that you can see within range. Until the spell ends, the target's speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action. When the spell ends, the target can't move or take actions until after its next turn, as a wave of lethargy sweeps over it.",
    class: ["Artificer", "Sorcerer", "Wizard"]
  },
  "Hunger of Hadar": {
    name: "Hunger of Hadar", level: 3, school: "Conjuration", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You open a gateway to the dark between the stars, a region infested with unknown horrors. A 20-foot-radius sphere of blackness and bitter cold appears, centered on a point with range and lasting for the duration. No light, magical or otherwise, can illuminate the area, and creatures fully within the area are blinded.",
    class: ["Warlock"]
  },
  "Hypnotic Pattern": {
    name: "Hypnotic Pattern", level: 3, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "S, M", duration: "Concentration, up to 1 minute",
    description: "You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Leomund's Tiny Hut": {
    name: "Leomund's Tiny Hut", level: 3, school: "Evocation", castingTime: "1 minute", range: "Self (10-foot-radius hemisphere)", components: "V, S, M", duration: "8 hours",
    description: "A 10-foot-radius immobile dome of force springs into existence around and above you and remains stationary for the duration. The spell ends if you leave its area. Nine creatures of Medium size or smaller can fit inside the dome with you.",
    class: ["Bard", "Wizard"]
  },
  "Lightning Arrow": {
    name: "Lightning Arrow", level: 3, school: "Transmutation", castingTime: "1 bonus action", range: "Self", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "The next time you make a ranged weapon attack during the spell's duration, the weapon's ammunition, or the weapon itself if it's a thrown weapon, transforms into a bolt of lightning. Make the attack roll as normal. The target takes 4d8 lightning damage on a hit, or half as much damage on a miss, instead of the weapon's normal damage.",
    class: ["Ranger"]
  },
  "Lightning Bolt": {
    name: "Lightning Bolt", level: 3, school: "Evocation", castingTime: "1 action", range: "Self (100-foot line)", components: "V, S, M", duration: "Instantaneous",
    description: "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.",
    class: ["Sorcerer", "Wizard"]
  },
  "Magic Circle": {
    name: "Magic Circle", level: 3, school: "Abjuration", castingTime: "1 minute", range: "10 feet", components: "V, S, M", duration: "1 hour",
    description: "You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface. Choose one or more of the following types of creatures: celestials, elementals, fey, fiends, or undead. The circle affects a creature of the chosen type in the following ways: The creature can't willingly enter the cylinder by nonmagical means. The creature has disadvantage on attack rolls against targets within the cylinder. Targets within the cylinder can't be charmed, frightened, or possessed by the creature.",
    class: ["Cleric", "Paladin", "Warlock", "Wizard"]
  },
  "Major Image": {
    name: "Major Image", level: 3, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Mass Healing Word": {
    name: "Mass Healing Word", level: 3, school: "Evocation", castingTime: "1 bonus action", range: "60 feet", components: "V", duration: "Instantaneous",
    description: "As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    class: ["Cleric"]
  },
  "Meld into Stone": {
    name: "Meld into Stone", level: 3, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "8 hours",
    description: "You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.",
    class: ["Cleric", "Druid"]
  },
  "Nondetection": {
    name: "Nondetection", level: 3, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "8 hours",
    description: "For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can't be targeted by any divination magic or perceived through magical scrying sensors.",
    class: ["Bard", "Ranger", "Wizard"]
  },
  "Phantom Steed": {
    name: "Phantom Steed", level: 3, school: "Illusion", castingTime: "1 minute", range: "30 feet", components: "V, S", duration: "1 hour",
    description: "A Large quasi-real, horselike creature appears on the ground in an unoccupied space of your choice within range. You decide the creature's appearance, but it is equipped with a saddle, bit, and bridle. Any of the equipment created by the spell vanishes in a puff of smoke if it is carried more than 10 feet away from the steed.",
    class: ["Wizard"]
  },
  "Plant Growth": {
    name: "Plant Growth", level: 3, school: "Transmutation", castingTime: "1 action", range: "150 feet", components: "V, S", duration: "Instantaneous",
    description: "This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either an immediate or long-term benefit. If you cast this spell using 1 action, you cause plants to become thick and overgrown. If you cast this spell over 8 hours, you enrich the land.",
    class: ["Bard", "Druid", "Ranger"]
  },
  "Protection from Energy": {
    name: "Protection from Energy", level: 3, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder.",
    class: ["Artificer", "Cleric", "Druid", "Ranger", "Sorcerer", "Wizard"]
  },
  "Remove Curse": {
    name: "Remove Curse", level: 3, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous",
    description: "At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded.",
    class: ["Cleric", "Paladin", "Warlock", "Wizard"]
  },
  "Revivify": {
    name: "Revivify", level: 3, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts.",
    class: ["Artificer", "Cleric", "Paladin"]
  },
  "Sending": {
    name: "Sending", level: 3, school: "Evocation", castingTime: "1 action", range: "Unlimited", components: "V, S, M", duration: "1 round",
    description: "You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately.",
    class: ["Bard", "Cleric", "Wizard"]
  },
  "Sleet Storm": {
    name: "Sleet Storm", level: 3, school: "Conjuration", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused. The ground in the area is covered with slick ice, making it difficult terrain.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Slow": {
    name: "Slow", level: 3, school: "Transmutation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration. An affected target's speed is halved, it takes a -2 penalty to AC and Dexterity saving throws, and it can't use reactions.",
    class: ["Sorcerer", "Wizard"]
  },
  "Speak with Dead": {
    name: "Speak with Dead", level: 3, school: "Necromancy", castingTime: "1 action", range: "10 feet", components: "V, S, M", duration: "10 minutes",
    description: "You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can't be undead. The spell fails if the corpse was the target of this spell within the last 10 days.",
    class: ["Bard", "Cleric"]
  },
  "Speak with Plants": {
    name: "Speak with Plants", level: 3, school: "Transmutation", castingTime: "1 action", range: "Self (30-foot radius)", components: "V, S", duration: "10 minutes",
    description: "You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell's area within the past day, gaining information about creatures that have passed, weather, and other circumstances.",
    class: ["Bard", "Druid", "Ranger"]
  },
  "Spirit Guardians": {
    name: "Spirit Guardians", level: 3, school: "Conjuration", castingTime: "1 action", range: "Self (15-foot radius)", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. When a creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant or necrotic damage.",
    class: ["Cleric"]
  },
  "Stinking Cloud": {
    name: "Stinking Cloud", level: 3, school: "Conjuration", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You create a 20-foot-radius sphere of yellow, nauseating gas centered on a point within range. The cloud spreads around corners, and its area is heavily obscured. The cloud lingers in the air for the duration. Each creature that is completely within the cloud at the start of its turn must make a Constitution saving throw against poison. On a failed save, the creature spends its action that turn retching and reeling.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Tongues": {
    name: "Tongues", level: 3, school: "Divination", castingTime: "1 action", range: "Touch", components: "V, M", duration: "1 hour",
    description: "This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says.",
    class: ["Bard", "Cleric", "Sorcerer", "Warlock", "Wizard"]
  },
  "Vampiric Touch": {
    name: "Vampiric Touch", level: 3, school: "Necromancy", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "The touch of your shadow-wreathed hand can drain life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt.",
    class: ["Warlock", "Wizard"]
  },
  "Water Breathing": {
    name: "Water Breathing", level: 3, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "24 hours",
    description: "This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.",
    class: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"]
  },
  "Water Walk": {
    name: "Water Walk", level: 3, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "1 hour",
    description: "This spell grants the ability to move across any liquid surface--such as water, acid, mud, snow, quicksand, or lava--as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration.",
    class: ["Artificer", "Cleric", "Druid", "Ranger", "Sorcerer"]
  },
  "Wind Wall": {
    name: "Wind Wall", level: 3, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A wall of strong wind rises from the ground at a point you choose within range. You can make the wall up to 50 feet long, 15 feet high, and 1 foot thick. You can shape the wall in any way you choose so long as it makes one continuous path along the ground.",
    class: ["Druid", "Ranger"]
  },

  // Level 4
  "Arcane Eye": {
    name: "Arcane Eye", level: 4, school: "Divination", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You create an invisible, magical eye within range that hovers in the air for the duration. You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction.",
    class: ["Artificer", "Wizard"]
  },
  "Aura of Life": {
    name: "Aura of Life", level: 4, school: "Abjuration", castingTime: "1 action", range: "Self (30-foot radius)", components: "V", duration: "Concentration, up to 10 minutes",
    description: "Life-preserving energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) has resistance to necrotic damage, and its hit point maximum can't be reduced. In addition, a nonhostile, living creature regains 1 hit point when it starts its turn in the aura with 0 hit points.",
    class: ["Paladin"]
  },
  "Aura of Purity": {
    name: "Aura of Purity", level: 4, school: "Abjuration", castingTime: "1 action", range: "Self (30-foot radius)", components: "V", duration: "Concentration, up to 10 minutes",
    description: "Purifying energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) can't become diseased, has resistance to poison damage, and has advantage on saving throws against effects that cause any of the following conditions: blinded, charmed, deafened, frightened, paralyzed, poisoned, and stunned.",
    class: ["Paladin"]
  },
  "Banishment": {
    name: "Banishment", level: 4, school: "Abjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished.",
    class: ["Cleric", "Paladin", "Sorcerer", "Warlock", "Wizard"]
  },
  "Blight": {
    name: "Blight", level: 4, school: "Necromancy", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    description: "Necromantic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw. The target takes 8d8 necrotic damage on a failed save, or half as much damage on a successful one. This spell has no effect on undead or constructs.",
    class: ["Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Compulsion": {
    name: "Compulsion", level: 4, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "Creatures of your choice that you can see within range and that can hear you must make a Wisdom saving throw. A target automatically succeeds on this saving throw if it can't be charmed. On a failed save, a target is affected by this spell. Until the spell ends, you can use a bonus action on each of your turns to designate a direction that is horizontal to you. Each affected target must use as much of its movement as possible to move in that direction on its next turn.",
    class: ["Bard"]
  },
  "Confusion": {
    name: "Confusion", level: 4, school: "Enchantment", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "This spell assaults and twists the minds of creatures in a 10-foot-radius sphere centered on a point of your choice within range. Each creature in that area must succeed on a Wisdom saving throw or be affected by the spell. An affected target can't take reactions and must roll a d10 at the start of each of its turns to determine its behavior for that turn.",
    class: ["Bard", "Druid", "Sorcerer", "Wizard"]
  },
  "Conjure Minor Elementals": {
    name: "Conjure Minor Elementals", level: 4, school: "Conjuration", castingTime: "1 minute", range: "90 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You summon elementals that appear in unoccupied spaces that you can see within range. You choose one of the following options for what appears: One elemental of challenge rating 2 or lower, Two elementals of challenge rating 1 or lower, Four elementals of challenge rating 1/2 or lower, Eight elementals of challenge rating 1/4 or lower.",
    class: ["Druid", "Wizard"]
  },
  "Conjure Woodland Beings": {
    name: "Conjure Woodland Beings", level: 4, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You summon fey creatures that appear in unoccupied spaces that you can see within range. You choose one of the following options for what appears: One fey creature of challenge rating 2 or lower, Two fey creatures of challenge rating 1 or lower, Four fey creatures of challenge rating 1/2 or lower, Eight fey creatures of challenge rating 1/4 or lower.",
    class: ["Druid", "Ranger"]
  },
  "Control Water": {
    name: "Control Water", level: 4, school: "Transmutation", castingTime: "1 action", range: "300 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "Until the spell ends, you control any freestanding water inside an area you choose that is a cube of 100 feet on a side. You can choose from any of the following effects when you cast this spell. As an action on your turn, you can repeat the same effect or choose a different one. Flood, Part Water, Redirect Flow, Whirlpool.",
    class: ["Cleric", "Druid", "Wizard"]
  },
  "Death Ward": {
    name: "Death Ward", level: 4, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "8 hours",
    description: "You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the spell ends. If the spell is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the spell ends.",
    class: ["Cleric", "Paladin"]
  },
  "Dimension Door": {
    name: "Dimension Door", level: 4, school: "Conjuration", castingTime: "1 action", range: "500 feet", components: "V", duration: "Instantaneous",
    description: "You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Divination": {
    name: "Divination", level: 4, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Instantaneous",
    description: "Your magic and an offering put you in contact with a god or a god's servants. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The DM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen.",
    class: ["Cleric"]
  },
  "Dominate Beast": {
    name: "Dominate Beast", level: 4, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw.",
    class: ["Druid", "Sorcerer"]
  },
  "Evard's Black Tentacles": {
    name: "Evard's Black Tentacles", level: 4, school: "Conjuration", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Squirming, ebony tentacles fill a 20-foot square on ground that you can see within range. For the duration, these tentacles turn the ground in the area into difficult terrain. When a creature enters the affected area for the first time on a turn or starts its turn there, the creature must succeed on a Dexterity saving throw or take 3d6 bludgeoning damage and be restrained by the tentacles until the spell ends.",
    class: ["Wizard"]
  },
  "Fabricate": {
    name: "Fabricate", level: 4, school: "Transmutation", castingTime: "10 minutes", range: "120 feet", components: "V, S", duration: "Instantaneous",
    description: "You convert raw materials into products of the same material. For example, you can fabricate a wooden bridge from a clump of trees, a rope from a patch of hemp, and clothes from flax or wool.",
    class: ["Artificer", "Wizard"]
  },
  "Fire Shield": {
    name: "Fire Shield", level: 4, school: "Evocation", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "10 minutes",
    description: "Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it. The flames provide you with a warm or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage.",
    class: ["Wizard"]
  },
  "Freedom of Movement": {
    name: "Freedom of Movement", level: 4, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour",
    description: "You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained.",
    class: ["Artificer", "Bard", "Cleric", "Druid", "Ranger"]
  },
  "Giant Insect": {
    name: "Giant Insect", level: 4, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "You transform up to ten centipedes, three spiders, five wasps, or one scorpion within range into giant versions of their natural forms for the duration. A centipede becomes a giant centipede, a spider becomes a giant spider, a wasp becomes a giant wasp, and a scorpion becomes a giant scorpion.",
    class: ["Druid"]
  },
  "Grasping Vine": {
    name: "Grasping Vine", level: 4, school: "Conjuration", castingTime: "1 bonus action", range: "30 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You conjure a vine that sprouts from the ground in an unoccupied space of your choice that you can see within range. When you cast this spell, you can direct the vine to lash out at a creature within 30 feet of it that you can see. That creature must succeed on a Dexterity saving throw or be pulled 20 feet directly toward the vine.",
    class: ["Druid", "Ranger"]
  },
  "Greater Invisibility": {
    name: "Greater Invisibility", level: 4, school: "Illusion", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Guardian of Faith": {
    name: "Guardian of Faith", level: 4, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V", duration: "8 hours",
    description: "A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space and is indistinct except for a gleaming sword and shield.",
    class: ["Cleric"]
  },
  "Hallucinatory Terrain": {
    name: "Hallucinatory Terrain", level: 4, school: "Illusion", castingTime: "10 minutes", range: "300 feet", components: "V, S, M", duration: "24 hours",
    description: "You make a 150-foot cube of terrain in range look, sound, and smell like some other sort of terrain. The tactile characteristics of the terrain are unchanged, so creatures entering the area are likely to see through the illusion. The illusion lasts for the duration.",
    class: ["Bard", "Druid", "Warlock", "Wizard"]
  },
  "Ice Storm": {
    name: "Ice Storm", level: 4, school: "Evocation", castingTime: "1 action", range: "300 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Leomund's Secret Chest": {
    name: "Leomund's Secret Chest", level: 4, school: "Conjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You hide a chest, and all its contents, on the Ethereal Plane. You must touch the chest and the miniature replica that serves as a material component for the spell.",
    class: ["Wizard"]
  },
  "Locate Creature": {
    name: "Locate Creature", level: 4, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement.",
    class: ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Wizard"]
  },
  "Mordenkainen's Faithful Hound": {
    name: "Mordenkainen's Faithful Hound", level: 4, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "8 hours",
    description: "You conjure a phantom watchdog in an unoccupied space that you can see within range, where it remains for the duration, until you dismiss it as an action, or until you move more than 100 feet away from it.",
    class: ["Wizard"]
  },
  "Mordenkainen's Private Sanctum": {
    name: "Mordenkainen's Private Sanctum", level: 4, school: "Abjuration", castingTime: "10 minutes", range: "120 feet", components: "V, S, M", duration: "24 hours",
    description: "You make an area within range magically secure. The area is a cube that can be as small as 5 feet to as large as 100 feet on each side. The spell lasts for the duration or until you use an action to dismiss it.",
    class: ["Wizard"]
  },
  "Otiluke's Resilient Sphere": {
    name: "Otiluke's Resilient Sphere", level: 4, school: "Evocation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A sphere of shimmering force encloses a creature or object of Large size or smaller within range. An unwilling creature must make a Dexterity saving throw. On a failed save, the creature is enclosed for the duration.",
    class: ["Wizard"]
  },
  "Phantasmal Killer": {
    name: "Phantasmal Killer", level: 4, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature. The target must make a Wisdom saving throw. On a failed save, the target becomes frightened for the duration.",
    class: ["Wizard"]
  },
  "Polymorph": {
    name: "Polymorph", level: 4, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The transformation lasts for the duration, or until the target drops to 0 hit points or dies.",
    class: ["Bard", "Druid", "Sorcerer", "Wizard"]
  },
  "Staggering Smite": {
    name: "Staggering Smite", level: 4, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit a creature with a melee weapon attack during this spell's duration, your weapon pierces both body and mind, and the attack deals an extra 4d6 psychic damage to the target. The target must make a Wisdom saving throw. On a failed save, it has disadvantage on attack rolls and ability checks, and can't take reactions, until the end of its next turn.",
    class: ["Paladin"]
  },
  "Stone Shape": {
    name: "Stone Shape", level: 4, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall, as long as the wall is less than 5 feet thick.",
    class: ["Artificer", "Cleric", "Druid", "Wizard"]
  },
  "Stoneskin": {
    name: "Stoneskin", level: 4, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage.",
    class: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"]
  },
  "Wall of Fire": {
    name: "Wall of Fire", level: 4, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },

  // Level 5
  "Animate Objects": {
    name: "Animate Objects", level: 5, school: "Transmutation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "Objects come to life at your command. Choose up to ten nonmagical objects within range that are not being worn or carried. Each target animates and becomes a creature under your control until the spell ends or until reduced to 0 hit points.",
    class: ["Artificer", "Bard", "Sorcerer", "Wizard"]
  },
  "Antilife Shell": {
    name: "Antilife Shell", level: 5, school: "Abjuration", castingTime: "1 action", range: "Self (10-foot radius)", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "A shimmering barrier extends out from you in a 10-foot radius and moves with you, remaining centered on you and hedging out creatures other than undead and constructs. The barrier lasts for the duration.",
    class: ["Druid"]
  },
  "Awaken": {
    name: "Awaken", level: 5, school: "Transmutation", castingTime: "8 hours", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "After spending the casting time tracing magical pathways within a precious gemstone, you touch a Huge or smaller beast or plant. The target must have either no Intelligence score or an Intelligence of 3 or less. The target gains an Intelligence of 10. The target also gains the ability to speak one language you know.",
    class: ["Bard", "Druid"]
  },
  "Banishing Smite": {
    name: "Banishing Smite", level: 5, school: "Abjuration", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    description: "The next time you hit a creature with a weapon attack before this spell ends, your weapon crackles with force, and the attack deals an extra 5d10 force damage to the target. Additionally, if this attack reduces the target to 50 hit points or fewer, you banish it.",
    class: ["Paladin"]
  },
  "Bigby's Hand": {
    name: "Bigby's Hand", level: 5, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You create a Large hand of shimmering, translucent force in an unoccupied space that you can see within range. The hand lasts for the spell's duration, and it moves at your command, mimicking the movements of your own hand.",
    class: ["Wizard"]
  },
  "Circle of Power": {
    name: "Circle of Power", level: 5, school: "Abjuration", castingTime: "1 action", range: "Self (30-foot radius)", components: "V", duration: "Concentration, up to 10 minutes",
    description: "Divine energy radiates from you, twisting and turning to ward off harm. For the duration, each friendly creature in the area (including you) has advantage on saving throws. When an affected creature succeeds on a saving throw made against a spell or other magical effect, the creature takes no damage if it would normally take half damage from the spell or effect.",
    class: ["Paladin"]
  },
  "Cloudkill": {
    name: "Cloudkill", level: 5, school: "Conjuration", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "You create a 20-foot-radius sphere of poisonous, yellow-green fog centered on a point you choose within range. The fog spreads around corners. It lasts for the duration or until strong wind disperses the fog, ending the spell. Its area is heavily obscured.",
    class: ["Sorcerer", "Wizard"]
  },
  "Commune": {
    name: "Commune", level: 5, school: "Divination", castingTime: "1 minute", range: "Self", components: "V, S, M", duration: "1 minute",
    description: "You contact your deity or a divine proxy and ask up to three questions that can be answered with a yes or no. You must ask your questions before the spell ends. You receive a correct answer for each question.",
    class: ["Cleric"]
  },
  "Commune with Nature": {
    name: "Commune with Nature", level: 5, school: "Divination", castingTime: "1 minute", range: "Self", components: "V, S", duration: "Instantaneous",
    description: "You become one with nature for a moment and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet.",
    class: ["Druid", "Ranger"]
  },
  "Cone of Cold": {
    name: "Cone of Cold", level: 5, school: "Evocation", castingTime: "1 action", range: "Self (60-foot cone)", components: "V, S, M", duration: "Instantaneous",
    description: "A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.",
    class: ["Sorcerer", "Wizard"]
  },
  "Conjure Elemental": {
    name: "Conjure Elemental", level: 5, school: "Conjuration", castingTime: "1 minute", range: "90 feet", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You call forth an elemental servant. Choose an area of air, earth, fire, or water that fills a 10-foot cube within range. An elemental of challenge rating 5 or lower appropriate to the area you chose appears in an unoccupied space within 10 feet of it.",
    class: ["Druid", "Wizard"]
  },
  "Conjure Volley": {
    name: "Conjure Volley", level: 5, school: "Conjuration", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You fire a piece of nonmagical ammunition from a ranged weapon or throw a nonmagical weapon into the air. The ammunition or weapon duplicates itself, creating a volley of identical projectiles that rain down in a 40-foot-radius, 20-foot-high cylinder centered on a point you can see within range. Each creature in the area must make a Dexterity saving throw. A creature takes 8d8 damage on a failed save, or half as much on a successful one. The damage type is the same as that of the weapon or ammunition used for the spell.",
    class: ["Ranger"]
  },
  "Contact Other Plane": {
    name: "Contact Other Plane", level: 5, school: "Divination", castingTime: "1 minute", range: "Self", components: "V", duration: "1 minute",
    description: "You mentally contact a demigod, the spirit of a long-dead sage, or some other mysterious entity from another plane. You can ask up to five questions. You must ask your questions before the spell ends. The DM answers each question with one word, such as 'yes,' 'no,' 'maybe,' 'never,' 'irrelevant,' or 'unclear.'",
    class: ["Warlock", "Wizard"]
  },
  "Contagion": {
    name: "Contagion", level: 5, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "7 days",
    description: "Your touch inflicts disease. Make a melee spell attack against a creature within your reach. On a hit, you afflict the creature with a disease of your choice from several options.",
    class: ["Cleric", "Druid"]
  },
  "Creation": {
    name: "Creation", level: 5, school: "Illusion", castingTime: "1 minute", range: "30 feet", components: "V, S, M", duration: "Special",
    description: "You pull wisps of shadow material from the Shadowfell to create a nonliving object of vegetable matter within range: soft goods, rope, wood, or something similar. You can also use this spell to create mineral objects such as stone, crystal, or metal.",
    class: ["Sorcerer", "Wizard"]
  },
  "Destructive Wave": {
    name: "Destructive Wave", level: 5, school: "Evocation", castingTime: "1 action", range: "Self (30-foot radius)", components: "V", duration: "Instantaneous",
    description: "You strike the ground, creating a burst of divine energy that ripples outward from you. Each creature you choose within 30 feet of you must succeed on a Constitution saving throw or take 5d6 thunder damage, as well as 5d6 radiant or necrotic damage (your choice), and be knocked prone.",
    class: ["Paladin"]
  },
  "Dispel Evil and Good": {
    name: "Dispel Evil and Good", level: 5, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Shimmering energy surrounds and protects you from fey, undead, and creatures originating from beyond the Material Plane. For the duration, celestials, elementals, fey, fiends, and undead have disadvantage on attack rolls against you.",
    class: ["Cleric", "Paladin"]
  },
  "Dominate Person": {
    name: "Dominate Person", level: 5, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You attempt to beguile a humanoid that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Dream": {
    name: "Dream", level: 5, school: "Illusion", castingTime: "1 minute", range: "Special", components: "V, S, M", duration: "8 hours",
    description: "This spell shapes a creature's dreams. Choose a creature known to you as the target of this spell. The target must be on the same plane of existence as you. You enter a trance state, acting as a messenger. While in the trance, you are aware of your surroundings, but you can't take actions or move.",
    class: ["Bard", "Warlock", "Wizard"]
  },
  "Flame Strike": {
    name: "Flame Strike", level: 5, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot-radius, 40-foot-high cylinder centered on a point within range must make a Dexterity saving throw. A creature takes 4d6 fire damage and 4d6 radiant damage on a failed save, or half as much damage on a successful one.",
    class: ["Cleric"]
  },
  "Geas": {
    name: "Geas", level: 5, school: "Enchantment", castingTime: "1 minute", range: "60 feet", components: "V", duration: "30 days",
    description: "You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration.",
    class: ["Bard", "Cleric", "Druid", "Paladin", "Wizard"]
  },
  "Greater Restoration": {
    name: "Greater Restoration", level: 5, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's exhaustion level by one, or end one of the following effects on the target: One effect that charmed or petrified the target, one curse, including the target's attunement to a cursed magic item, any reduction to one of the target's ability scores, one effect reducing the target's hit point maximum.",
    class: ["Artificer", "Bard", "Cleric", "Druid"]
  },
  "Hallow": {
    name: "Hallow", level: 5, school: "Evocation", castingTime: "24 hours", range: "Touch", components: "V, S, M", duration: "Until dispelled",
    description: "You touch a point and infuse an area around it with holy (or unholy) power. The area can have a radius up to 60 feet, and the spell fails if the radius includes an area already under the effect of a hallow spell.",
    class: ["Cleric"]
  },
  "Hold Monster": {
    name: "Hold Monster", level: 5, school: "Enchantment", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This spell has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Insect Plague": {
    name: "Insect Plague", level: 5, school: "Conjuration", castingTime: "1 action", range: "300 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain.",
    class: ["Cleric", "Druid", "Sorcerer"]
  },
  "Legend Lore": {
    name: "Legend Lore", level: 5, school: "Divination", castingTime: "10 minutes", range: "Self", components: "V, S, M", duration: "Instantaneous",
    description: "Name or describe a person, place, or object. The spell brings to your mind a brief, summary statement of the significant lore about the thing you named. The lore might consist of current tales, forgotten stories, or even secret lore that has never been widely known.",
    class: ["Bard", "Cleric", "Wizard"]
  },
  "Mass Cure Wounds": {
    name: "Mass Cure Wounds", level: 5, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier.",
    class: ["Bard", "Cleric"]
  },
  "Mislead": {
    name: "Mislead", level: 5, school: "Illusion", castingTime: "1 action", range: "Self", components: "S", duration: "Concentration, up to 1 hour",
    description: "You become invisible at the same time that an illusory double of you appears where you are standing. The double lasts for the duration, but the invisibility ends if you attack or cast a spell.",
    class: ["Bard", "Wizard"]
  },
  "Modify Memory": {
    name: "Modify Memory", level: 5, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You attempt to reshape another creature's memories. One creature that you can see must make a Wisdom saving throw. If you are fighting the creature, it has advantage on the saving throw. On a failed save, the target is charmed by you for the duration.",
    class: ["Bard", "Wizard"]
  },
  "Passwall": {
    name: "Passwall", level: 5, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "1 hour",
    description: "A passage appears at a point of your choice that you can see on a wooden, plaster, or stone surface (such as a wall, a ceiling, or a floor) within range, and lasts for the duration. You choose the opening's dimensions: up to 5 feet wide, 8 feet tall, and 20 feet deep.",
    class: ["Wizard"]
  },
  "Planar Binding": {
    name: "Planar Binding", level: 5, school: "Abjuration", castingTime: "1 hour", range: "60 feet", components: "V, S, M", duration: "24 hours",
    description: "With this spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell.",
    class: ["Bard", "Cleric", "Druid", "Wizard"]
  },
  "Raise Dead": {
    name: "Raise Dead", level: 5, school: "Necromancy", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You return a dead creature you touch to life, provided that it has been dead for no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point.",
    class: ["Bard", "Cleric", "Paladin"]
  },
  "Rary's Telepathic Bond": {
    name: "Rary's Telepathic Bond", level: 5, school: "Divination", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "1 hour",
    description: "You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration.",
    class: ["Wizard"]
  },
  "Reincarnate": {
    name: "Reincarnate", level: 5, school: "Transmutation", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You touch a dead humanoid or a piece of a dead humanoid. Provided that the creature has been dead for no longer than 10 days, the spell forms a new adult body for it and then calls the soul to enter that body. The new body is of a different race, determined by a roll on a table.",
    class: ["Druid"]
  },
  "Scrying": {
    name: "Scrying", level: 5, school: "Divination", castingTime: "10 minutes", range: "Self", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it.",
    class: ["Bard", "Cleric", "Druid", "Warlock", "Wizard"]
  },
  "Seeming": {
    name: "Seeming", level: 5, school: "Illusion", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "8 hours",
    description: "This spell allows you to change the appearance of any number of creatures that you can see within range. You give each target you choose a new, illusory appearance. An unwilling target can make a Charisma saving throw, and if it succeeds, it is unaffected by this spell.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Swift Quiver": {
    name: "Swift Quiver", level: 5, school: "Transmutation", castingTime: "1 bonus action", range: "Touch", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You transmute your quiver so it produces an endless supply of nonmagical ammunition, which seems to leap into your hand when you reach for it. On each of your turns until the spell ends, you can use a bonus action to make two attacks with a weapon that uses ammunition from the quiver.",
    class: ["Ranger"]
  },
  "Telekinesis": {
    name: "Telekinesis", level: 5, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "You can try to move an object that weighs up to 1,000 pounds. If the object isn't being worn or carried, you automatically move it. If the object is worn or carried by a creature, you must make an ability check with your spellcasting ability contested by the creature's Strength check.",
    class: ["Sorcerer", "Wizard"]
  },
  "Teleportation Circle": {
    name: "Teleportation Circle", level: 5, school: "Conjuration", castingTime: "1 minute", range: "10 feet", components: "V, M", duration: "1 round",
    description: "As you cast the spell, you draw a 10-foot-diameter circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice whose sigil sequence you know and that is on the same plane of existence as you.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },
  "Tree Stride": {
    name: "Tree Stride", level: 5, school: "Conjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "You gain the ability to enter a tree and move from inside it to inside another tree of the same kind within 500 feet. Both trees must be living and at least the same size as you.",
    class: ["Druid", "Ranger"]
  },
  "Wall of Force": {
    name: "Wall of Force", level: 5, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "An invisible wall of force springs into existence at a point you choose within range. The wall appears in any orientation you choose, as a horizontal or vertical barrier or at an angle. It can be free floating or resting on a solid surface. You can form it into a hemispherical dome or a sphere with a radius of up to 10 feet.",
    class: ["Wizard"]
  },
  "Wall of Stone": {
    name: "Wall of Stone", level: 5, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "A nonmagical wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels. Each panel must be contiguous with another panel.",
    class: ["Artificer", "Druid", "Sorcerer", "Wizard"]
  },

  // Level 6
  "Arcane Gate": {
    name: "Arcane Gate", level: 6, school: "Conjuration", castingTime: "1 action", range: "500 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "You create linked teleportation portals that remain open for the duration. Choose two points on the ground that you can see, one point within 10 feet of you and one point within 500 feet of you. A circular portal, 10 feet in diameter, opens over each point.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Blade Barrier": {
    name: "Blade Barrier", level: 6, school: "Evocation", castingTime: "1 action", range: "90 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "You create a vertical wall of whirling, razor-sharp blades made of magical energy. The wall appears within range and lasts for the duration. You can make a straight wall up to 100 feet long, 20 feet high, and 5 feet thick, or a ringed wall up to 60 feet in diameter, 20 feet high, and 5 feet thick.",
    class: ["Cleric"]
  },
  "Chain Lightning": {
    name: "Chain Lightning", level: 6, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets, each of which must be within 30 feet of the first target. A target can be a creature or an object and can be targeted by only one of the bolts. A target must make a Dexterity saving throw. The target takes 10d8 lightning damage on a failed save, or half as much damage on a successful one.",
    class: ["Sorcerer", "Wizard"]
  },
  "Circle of Death": {
    name: "Circle of Death", level: 6, school: "Necromancy", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A sphere of negative energy ripples out in a 60-foot-radius sphere from a point within range. Each creature in that area must make a Constitution saving throw. A target takes 8d6 necrotic damage on a failed save, or half as much damage on a successful one.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Conjure Fey": {
    name: "Conjure Fey", level: 6, school: "Conjuration", castingTime: "1 minute", range: "90 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You summon a fey creature of challenge rating 6 or lower, or a fey spirit that takes the form of a beast of challenge rating 6 or lower. It appears in an unoccupied space that you can see within range. The fey creature is friendly to you and your companions for the duration.",
    class: ["Druid", "Warlock"]
  },
  "Contingency": {
    name: "Contingency", level: 6, school: "Evocation", castingTime: "10 minutes", range: "Self", components: "V, S, M", duration: "10 days",
    description: "Choose a spell of 5th level or lower that you can cast, that has a casting time of 1 action, and that can target you. You cast that spell--called the contingent spell--as part of casting contingency, expending spell slots for both, but the contingent spell doesn't come into effect. Instead, it takes effect when a certain circumstance occurs.",
    class: ["Wizard"]
  },
  "Create Undead": {
    name: "Create Undead", level: 6, school: "Necromancy", castingTime: "1 minute", range: "10 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You can cast this spell only at night. Choose up to three corpses of Medium or Small humanoids within range. Each corpse becomes a ghoul under your control.",
    class: ["Cleric", "Warlock", "Wizard"]
  },
  "Disintegrate": {
    name: "Disintegrate", level: 6, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A thin green ray springs from your pointing finger to a target that you can see within range. The target can be a creature, an object, or a creation of magical force. The target must make a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 force damage. If this damage reduces the target to 0 hit points, it is disintegrated.",
    class: ["Sorcerer", "Wizard"]
  },
  "Drawmij's Instant Summons": {
    name: "Drawmij's Instant Summons", level: 6, school: "Conjuration", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "Until dispelled",
    description: "You touch an object weighing 10 pounds or less whose longest dimension is 6 feet or less. The spell leaves an invisible mark on its surface and magically links the object to a sapphire you carry. At any time thereafter, you can use your action to speak the sapphire's command word and the object instantly appears in your hand.",
    class: ["Wizard"]
  },
  "Eyebite": {
    name: "Eyebite", level: 6, school: "Necromancy", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "For the spell's duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects of your choice for the duration: Asleep, Panicked, Sickened.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Find the Path": {
    name: "Find the Path", level: 6, school: "Divination", castingTime: "1 minute", range: "Self", components: "V, S, M", duration: "Concentration, up to 24 hours",
    description: "This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence. If you name a destination on another plane of existence, a destination that moves, or a destination that isn't specific, the spell fails.",
    class: ["Bard", "Cleric", "Druid"]
  },
  "Flesh to Stone": {
    name: "Flesh to Stone", level: 6, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You attempt to turn one creature that you can see within range into stone. If the target's body is made of flesh, the creature must make a Constitution saving throw. On a failed save, it is restrained as its flesh begins to harden. On a successful save, the creature isn't affected.",
    class: ["Warlock", "Wizard"]
  },
  "Forbiddance": {
    name: "Forbiddance", level: 6, school: "Abjuration", castingTime: "10 minutes", range: "Touch", components: "V, S, M", duration: "24 hours",
    description: "You create a ward against magical travel that protects up to 40,000 square feet of floor space to a height of 30 feet above the floor. For the duration, creatures can't teleport into the area or use portals, such as those created by the gate spell, to enter the area.",
    class: ["Cleric"]
  },
  "Globe of Invulnerability": {
    name: "Globe of Invulnerability", level: 6, school: "Abjuration", castingTime: "1 action", range: "Self (10-foot radius)", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "An immobile, faintly shimmering barrier springs into existence in a 10-foot radius around you and remains for the duration. Any spell of 5th level or lower cast from outside the barrier can't affect creatures or objects within it, even if the spell is cast using a higher level spell slot.",
    class: ["Sorcerer", "Wizard"]
  },
  "Guards and Wards": {
    name: "Guards and Wards", level: 6, school: "Abjuration", castingTime: "10 minutes", range: "Touch", components: "V, S, M", duration: "24 hours",
    description: "You create a ward that protects an area of up to 2,500 square feet. The warded area can be up to 20 feet tall, and shaped as you desire. You can ward several stories of a stronghold by dividing the area among them, as long as you can walk into each contiguous area while you are casting the spell.",
    class: ["Bard", "Wizard"]
  },
  "Harm": {
    name: "Harm", level: 6, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "You unleash a virulent disease on a creature that you can see within range. The target must make a Constitution saving throw. On a failed save, it takes 14d6 necrotic damage, or half as much damage on a successful save. The damage can't reduce the target's hit points below 1.",
    class: ["Cleric"]
  },
  "Heal": {
    name: "Heal", level: 6, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 hit points. This spell also ends blindness, deafness, and any diseases affecting the target.",
    class: ["Cleric", "Druid"]
  },
  "Heroes' Feast": {
    name: "Heroes' Feast", level: 6, school: "Conjuration", castingTime: "10 minutes", range: "30 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You bring forth a great feast, including magnificent food and drink. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don't set in until this hour is over. Up to twelve creatures can partake of the feast.",
    class: ["Cleric", "Druid"]
  },
  "Magic Jar": {
    name: "Magic Jar", level: 6, school: "Necromancy", castingTime: "1 minute", range: "Self", components: "V, S, M", duration: "Until dispelled",
    description: "Your body falls into a catatonic state as your soul leaves it and enters the container you used for the spell's material component. While your soul is in the container, you are aware of your surroundings as if you were in the container's space.",
    class: ["Wizard"]
  },
  "Mass Suggestion": {
    name: "Mass Suggestion", level: 6, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, M", duration: "24 hours",
    description: "You suggest a course of activity (limited to a sentence or two) and magically influence up to twelve creatures of your choice that you can see within range and that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Move Earth": {
    name: "Move Earth", level: 6, school: "Transmutation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 2 hours",
    description: "Choose an area of terrain no larger than 40 feet on a side within range. You can reshape dirt, sand, or clay in the area in any manner you choose for the duration.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Otiluke's Freezing Sphere": {
    name: "Otiluke's Freezing Sphere", level: 6, school: "Evocation", castingTime: "1 action", range: "300 feet", components: "V, S, M", duration: "Instantaneous",
    description: "A frigid globe of cold energy streaks from your fingertips to a point of your choice within range, where it explodes in a 60-foot-radius sphere. Each creature within the area must make a Constitution saving throw. A creature takes 10d6 cold damage on a failed save, or half as much damage on a successful one.",
    class: ["Wizard"]
  },
  "Otto's Irresistible Dance": {
    name: "Otto's Irresistible Dance", level: 6, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V", duration: "Concentration, up to 1 minute",
    description: "Choose one creature that you can see within range. The target begins a comic dance in place: shuffling, tapping its feet, and capering for the duration. Creatures that can't be charmed are immune to this spell. A dancing creature must use all its movement to dance without leaving its space and has disadvantage on Dexterity saving throws and attack rolls.",
    class: ["Bard", "Wizard"]
  },
  "Planar Ally": {
    name: "Planar Ally", level: 6, school: "Conjuration", castingTime: "10 minutes", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "You beseech an otherworldly entity for aid. The being must be known to you: a god, a primordial, a demon prince, or some other being of cosmic power. That entity sends a celestial, an elemental, or a fiend loyal to it to aid you, making the creature appear in an unoccupied space within range.",
    class: ["Cleric"]
  },
  "Programmed Illusion": {
    name: "Programmed Illusion", level: 6, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Until dispelled",
    description: "You create an illusion of an object, a creature, or some other visible phenomenon within range that activates when a specific condition is met. The illusion is imperceptible until then. It can be up to a 30-foot cube and is only visual.",
    class: ["Bard", "Wizard"]
  },
  "Sunbeam": {
    name: "Sunbeam", level: 6, school: "Evocation", castingTime: "1 action", range: "Self (60-foot line)", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn't blinded by this spell.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Transport via Plants": {
    name: "Transport via Plants", level: 6, school: "Conjuration", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "1 round",
    description: "This spell creates a magical link between a Large or larger inanimate plant within range and another such plant, at any distance, on the same plane of existence. You must have seen or touched the destination plant at least once before.",
    class: ["Druid"]
  },
  "True Seeing": {
    name: "True Seeing", level: 6, school: "Divination", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour",
    description: "This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet.",
    class: ["Bard", "Cleric", "Sorcerer", "Warlock", "Wizard"]
  },
  "Wall of Ice": {
    name: "Wall of Ice", level: 6, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You create a wall of ice on a solid surface within range. You can form it into a hemispherical dome or a sphere with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-foot-square panels.",
    class: ["Wizard"]
  },
  "Wall of Thorns": {
    name: "Wall of Thorns", level: 6, school: "Conjuration", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, up to 10 minutes",
    description: "You create a wall of tough, pliable, tangled brush bristling with needle-sharp thorns. The wall appears within range on a solid surface and lasts for the duration. You can make the wall up to 60 feet long, 10 feet high, and 5 feet thick or a circle that has a 20-foot diameter and is up to 20 feet high and 5 feet thick.",
    class: ["Druid"]
  },
  "Wind Walk": {
    name: "Wind Walk", level: 6, school: "Transmutation", castingTime: "1 minute", range: "30 feet", components: "V, S, M", duration: "8 hours",
    description: "You and up to ten willing creatures you can see within range assume a gaseous form for the duration, appearing as wisps of cloud. While in this cloud form, a creature has a flying speed of 300 feet and has resistance to damage from nonmagical weapons.",
    class: ["Druid"]
  },
  "Word of Recall": {
    name: "Word of Recall", level: 6, school: "Conjuration", castingTime: "1 action", range: "5 feet", components: "V", duration: "Instantaneous",
    description: "You and up to five willing creatures within 5 feet of you instantly teleport to a previously designated sanctuary. You and any creatures that teleport with you appear in the nearest unoccupied space to the spot you designated when you prepared your sanctuary.",
    class: ["Cleric"]
  },

  // Level 7
  "Conjure Celestial": {
    name: "Conjure Celestial", level: 7, school: "Conjuration", castingTime: "1 minute", range: "90 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You summon a celestial of challenge rating 4 or lower, which appears in an unoccupied space that you can see within range. The celestial is friendly to you and your companions for the duration.",
    class: ["Cleric"]
  },
  "Delayed Blast Fireball": {
    name: "Delayed Blast Fireball", level: 7, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "A beam of yellow light flashes from your pointing finger, then condenses to linger at a chosen point within range as a glowing bead for the duration. When the spell ends, either because your concentration is broken or because you decide to end it, the bead blossoms with a low roar into an explosion of flame that spreads around corners.",
    class: ["Sorcerer", "Wizard"]
  },
  "Divine Word": {
    name: "Divine Word", level: 7, school: "Evocation", castingTime: "1 bonus action", range: "30 feet", components: "V", duration: "Instantaneous",
    description: "You utter a divine word, imbued with the power that shaped the world at the dawn of creation. Choose any number of creatures you can see within range. Each creature that can hear you must make a Charisma saving throw. On a failed save, a creature suffers an effect based on its current hit points.",
    class: ["Cleric"]
  },
  "Etherealness": {
    name: "Etherealness", level: 7, school: "Transmutation", castingTime: "1 action", range: "Self", components: "V, S", duration: "8 hours",
    description: "You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell.",
    class: ["Bard", "Cleric", "Sorcerer", "Warlock", "Wizard"]
  },
  "Finger of Death": {
    name: "Finger of Death", level: 7, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "You send negative energy coursing through a creature that you can see within range, causing it searing pain. The target must make a Constitution saving throw. It takes 7d8 + 30 necrotic damage on a failed save, or half as much damage on a successful one. A humanoid killed by this spell rises at the start of your next turn as a zombie that is permanently under your command.",
    class: ["Sorcerer", "Warlock", "Wizard"]
  },
  "Fire Storm": {
    name: "Fire Storm", level: 7, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S", duration: "Instantaneous",
    description: "A storm made up of sheets of roaring flame appears in a location you choose within range. The area of the storm consists of up to ten 10-foot cubes, which you can arrange as you wish. Each cube must have at least one face adjacent to the face of another cube.",
    class: ["Cleric", "Druid", "Sorcerer"]
  },
  "Forcecage": {
    name: "Forcecage", level: 7, school: "Evocation", castingTime: "1 action", range: "100 feet", components: "V, S, M", duration: "1 hour",
    description: "An immobile, invisible, cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box, as you choose.",
    class: ["Bard", "Warlock", "Wizard"]
  },
  "Mirage Arcane": {
    name: "Mirage Arcane", level: 7, school: "Illusion", castingTime: "10 minutes", range: "Sight", components: "V, S", duration: "10 days",
    description: "You make terrain in an area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. The terrain's general shape remains the same, however. Open fields or a road could be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain.",
    class: ["Bard", "Druid", "Wizard"]
  },
  "Mordenkainen's Magnificent Mansion": {
    name: "Mordenkainen's Magnificent Mansion", level: 7, school: "Conjuration", castingTime: "1 minute", range: "300 feet", components: "V, S, M", duration: "24 hours",
    description: "You conjure an extradimensional dwelling in range that lasts for the duration. You choose where its one entrance is located. The entrance shimmers faintly and is 5 feet wide and 10 feet tall. You and any creature you designate when you cast the spell can enter the extradimensional dwelling as long as the portal remains open.",
    class: ["Bard", "Wizard"]
  },
  "Mordenkainen's Sword": {
    name: "Mordenkainen's Sword", level: 7, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You create a sword-shaped plane of force that hovers within range. It lasts for the duration. When the sword appears, you can make a melee spell attack against a target of your choice within 5 feet of the sword.",
    class: ["Bard", "Wizard"]
  },
  "Plane Shift": {
    name: "Plane Shift", level: 7, school: "Conjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms, such as the City of Brass on the Elemental Plane of Fire, and you appear in or near that destination.",
    class: ["Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"]
  },
  "Prismatic Spray": {
    name: "Prismatic Spray", level: 7, school: "Evocation", castingTime: "1 action", range: "Self (60-foot cone)", components: "V, S", duration: "Instantaneous",
    description: "Eight multicolored rays of light flash from your hand. Each ray is a different color and has a different power and purpose. Each creature in a 60-foot cone must make a Dexterity saving throw. For each target, roll a d8 to determine which color ray affects it.",
    class: ["Sorcerer", "Wizard"]
  },
  "Project Image": {
    name: "Project Image", level: 7, school: "Illusion", castingTime: "1 action", range: "500 miles", components: "V, S, M", duration: "Concentration, up to 24 hours",
    description: "You send an illusory duplicate of yourself to a location you specify within range. The illusion looks and sounds like you but is intangible. You can see through its eyes and hear through its ears as if you were in its space.",
    class: ["Bard", "Wizard"]
  },
  "Regenerate": {
    name: "Regenerate", level: 7, school: "Transmutation", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "1 hour",
    description: "You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points each minute).",
    class: ["Bard", "Cleric", "Druid"]
  },
  "Resurrection": {
    name: "Resurrection", level: 7, school: "Necromancy", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You touch a dead creature that has been dead for no more than a century, that didn't die of old age, and that isn't undead. If its soul is free and willing, the target returns to life with all its hit points.",
    class: ["Bard", "Cleric"]
  },
  "Reverse Gravity": {
    name: "Reverse Gravity", level: 7, school: "Transmutation", castingTime: "1 action", range: "100 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "This spell reverses gravity in a 50-foot-radius, 100-foot-high cylinder centered on a point within range. All creatures and objects that aren't somehow anchored to the ground in the area fall upward and reach the top of the area when you cast this spell.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Sequester": {
    name: "Sequester", level: 7, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Until dispelled",
    description: "By means of this spell, a willing creature or an object can be hidden away, safe from detection for the duration. When you cast the spell and touch the target, it becomes invisible and can't be targeted by divination spells or perceived through scrying sensors created by divination spells.",
    class: ["Wizard"]
  },
  "Simulacrum": {
    name: "Simulacrum", level: 7, school: "Illusion", castingTime: "12 hours", range: "Touch", components: "V, S, M", duration: "Until dispelled",
    description: "You shape an illusory duplicate of one beast or humanoid that is within range for the entire casting time of the spell. The duplicate is a creature, partially real and formed from ice or snow, and it can take actions and otherwise be affected as a normal creature.",
    class: ["Wizard"]
  },
  "Symbol": {
    name: "Symbol", level: 7, school: "Abjuration", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "Until dispelled or triggered",
    description: "When you cast this spell, you inscribe a harmful glyph on a surface or in an object that can be closed to conceal the glyph. If you choose a surface, the glyph can cover an area of the surface no larger than 10 feet in diameter. If you choose an object, that object must remain in its place; if the object is moved more than 10 feet from where you cast this spell, the glyph is broken, and the spell ends without being triggered.",
    class: ["Bard", "Cleric", "Wizard"]
  },
  "Teleport": {
    name: "Teleport", level: 7, school: "Conjuration", castingTime: "1 action", range: "10 feet", components: "V", duration: "Instantaneous",
    description: "This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object that you can see within range, to a destination you select.",
    class: ["Bard", "Sorcerer", "Wizard"]
  },

  // Level 8
  "Animal Shapes": {
    name: "Animal Shapes", level: 8, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Concentration, up to 24 hours",
    description: "Your magic turns others into beasts. Choose any number of willing creatures that you can see within range. You transform each target into the form of a Large or smaller beast with a challenge rating of 4 or lower.",
    class: ["Druid"]
  },
  "Antimagic Field": {
    name: "Antimagic Field", level: 8, school: "Abjuration", castingTime: "1 action", range: "Self (10-foot-radius sphere)", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "A 10-foot-radius invisible sphere of antimagic surrounds you. This area is divorced from the magical energy that suffuses the multiverse. Within the sphere, spells can't be cast, summoned creatures disappear, and even magic items become mundane.",
    class: ["Cleric", "Wizard"]
  },
  "Antipathy/Sympathy": {
    name: "Antipathy/Sympathy", level: 8, school: "Enchantment", castingTime: "1 hour", range: "60 feet", components: "V, S, M", duration: "10 days",
    description: "This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or creature or an area that is no larger than a 200-foot cube. Then specify a kind of intelligent creature, such as red dragons, goblins, or vampires.",
    class: ["Druid", "Wizard"]
  },
  "Clone": {
    name: "Clone", level: 8, school: "Necromancy", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "This spell grows an inert duplicate of a living creature as a safeguard against death. This clone forms inside a sealed vessel and grows to full size and maturity after 120 days; you can also choose to have the clone be a younger version of the same creature.",
    class: ["Wizard"]
  },
  "Control Weather": {
    name: "Control Weather", level: 8, school: "Transmutation", castingTime: "10 minutes", range: "Self (5-mile radius)", components: "V, S, M", duration: "Concentration, up to 8 hours",
    description: "You take control of the weather within 5 miles of you for the duration. You must be outdoors to cast this spell. Moving to a place where you don't have a clear path to the sky ends the spell early.",
    class: ["Cleric", "Druid", "Wizard"]
  },
  "Demiplane": {
    name: "Demiplane", level: 8, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "S", duration: "1 hour",
    description: "You create a shadowy door on a flat solid surface that you can see within range. The door is large enough to allow Medium creatures to pass through unhindered. When opened, the door leads to a demiplane that appears to be an empty room 30 feet in each dimension, made of wood or stone.",
    class: ["Warlock", "Wizard"]
  },
  "Dominate Monster": {
    name: "Dominate Monster", level: 8, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    description: "You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. While the creature is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Earthquake": {
    name: "Earthquake", level: 8, school: "Evocation", castingTime: "1 action", range: "500 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You create a seismic disturbance at a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point and shakes creatures and structures in contact with the ground in that area.",
    class: ["Cleric", "Druid", "Sorcerer"]
  },
  "Feeblemind": {
    name: "Feeblemind", level: 8, school: "Enchantment", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous",
    description: "You blast the mind of a creature that you can see within range, attempting to shatter its intellect and personality. The target takes 4d6 psychic damage and must make an Intelligence saving throw. On a failed save, the creature's Intelligence and Charisma scores become 1.",
    class: ["Bard", "Druid", "Warlock", "Wizard"]
  },
  "Glibness": {
    name: "Glibness", level: 8, school: "Transmutation", castingTime: "1 action", range: "Self", components: "V", duration: "1 hour",
    description: "Until the spell ends, when you make a Charisma check, you can replace the number you roll with a 15. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates that you are being truthful.",
    class: ["Bard", "Warlock"]
  },
  "Holy Aura": {
    name: "Holy Aura", level: 8, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "Divine light washes out from you and coalesces in a soft radiance in a 30-foot radius around you. Creatures of your choice in that radius when you cast this spell shed dim light in a 5-foot radius and have advantage on all saving throws, and other creatures have disadvantage on attack rolls against them until the spell ends.",
    class: ["Cleric"]
  },
  "Incendiary Cloud": {
    name: "Incendiary Cloud", level: 8, school: "Conjuration", castingTime: "1 action", range: "150 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "A swirling cloud of smoke shot through with white-hot embers appears in a 20-foot-radius sphere centered on a point within range. The cloud spreads around corners and is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.",
    class: ["Sorcerer", "Wizard"]
  },
  "Maze": {
    name: "Maze", level: 8, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    description: "You banish a creature that you can see within range into a labyrinthine demiplane. The target remains there for the duration or until it escapes the maze.",
    class: ["Wizard"]
  },
  "Mind Blank": {
    name: "Mind Blank", level: 8, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "24 hours",
    description: "Until the spell ends, one willing creature you touch is immune to psychic damage, any effect that would sense its emotions or read its thoughts, divination spells, and the charmed condition.",
    class: ["Bard", "Wizard"]
  },
  "Power Word Stun": {
    name: "Power Word Stun", level: 8, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous",
    description: "You speak a word of power that can overwhelm the mind of one creature you can see within range, leaving it dumbfounded. If the target has 150 hit points or fewer, it is stunned. Otherwise, the spell has no effect.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Sunburst": {
    name: "Sunburst", level: 8, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous",
    description: "Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 12d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell.",
    class: ["Druid", "Sorcerer", "Wizard"]
  },
  "Telepathy": {
    name: "Telepathy", level: 8, school: "Evocation", castingTime: "1 action", range: "Unlimited", components: "V, S, M", duration: "24 hours",
    description: "You create a telepathic link with one willing creature with which you are familiar. Until the spell ends, you and the target can instantaneously share words, images, sounds, and other sensory messages with one another through the link, and the target recognizes you as the creature it is communicating with.",
    class: ["Wizard"]
  },
  "Trap the Soul": {
    name: "Trap the Soul", level: 8, school: "Conjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Until dispelled",
    description: "You attempt to trap a creature's soul within a gemstone. The target must be within range and must succeed on a Charisma saving throw or its soul is trapped within the gem.",
    class: ["Wizard"]
  },
  "Tsunami": {
    name: "Tsunami", level: 8, school: "Conjuration", castingTime: "1 minute", range: "Sight", components: "V, S", duration: "Concentration, up to 6 rounds",
    description: "A wall of water springs into existence at a point you choose within range. You can make the wall up to 300 feet long, 300 feet high, and 50 feet thick. The wall lasts for the duration.",
    class: ["Druid"]
  },

  // Level 9
  "Astral Projection": {
    name: "Astral Projection", level: 9, school: "Necromancy", castingTime: "1 hour", range: "10 feet", components: "V, S, M", duration: "Special",
    description: "You and up to eight willing creatures within range project your astral bodies into the Astral Plane. The material body you leave behind is unconscious and in a state of suspended animation; it doesn't need food or air and doesn't age.",
    class: ["Cleric", "Warlock", "Wizard"]
  },
  "Foresight": {
    name: "Foresight", level: 9, school: "Divination", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "8 hours",
    description: "You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target can't be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration.",
    class: ["Bard", "Druid", "Warlock", "Wizard"]
  },
  "Gate": {
    name: "Gate", level: 9, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, up to 1 minute",
    description: "You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence. The portal is a circular opening, which you can make 5 to 20 feet in diameter. You can orient the portal in any direction you choose.",
    class: ["Cleric", "Sorcerer", "Wizard"]
  },
  "Imprisonment": {
    name: "Imprisonment", level: 9, school: "Abjuration", castingTime: "1 minute", range: "30 feet", components: "V, S, M", duration: "Until dispelled",
    description: "You create a magical restraint to hold a creature that you can see within range. The target must succeed on a Wisdom saving throw or be bound by the spell; if it succeeds, it is immune to this spell if you cast it again.",
    class: ["Warlock", "Wizard"]
  },
  "Mass Heal": {
    name: "Mass Heal", level: 9, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    description: "A flood of healing energy flows from you into injured creatures around you. You restore up to 700 hit points, divided as you choose among any number of creatures that you can see within range. Creatures healed by this spell are also cured of all diseases and any effect making them blinded or deafened.",
    class: ["Cleric"]
  },
  "Meteor Swarm": {
    name: "Meteor Swarm", level: 9, school: "Evocation", castingTime: "1 action", range: "1 mile", components: "V, S", duration: "Instantaneous",
    description: "Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw. The sphere spreads around corners. A creature takes 20d6 fire damage and 20d6 bludgeoning damage on a failed save, or half as much damage on a successful one.",
    class: ["Sorcerer", "Wizard"]
  },
  "Power Word Heal": {
    name: "Power Word Heal", level: 9, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous",
    description: "A wave of healing energy washes over the creature you touch. The target regains all its hit points. If the creature is charmed, frightened, paralyzed, or stunned, the condition ends. If the creature is prone, it can use its reaction to stand up. This spell has no effect on undead or constructs.",
    class: ["Bard"]
  },
  "Power Word Kill": {
    name: "Power Word Kill", level: 9, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous",
    description: "You utter a word of power that can compel one creature you can see within range to die instantly. If the creature you choose has 100 hit points or fewer, it dies. Otherwise, the spell has no effect.",
    class: ["Bard", "Sorcerer", "Warlock", "Wizard"]
  },
  "Prismatic Wall": {
    name: "Prismatic Wall", level: 9, school: "Abjuration", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "10 minutes",
    description: "A shimmering, multicolored wall of light springs into existence at a point you choose within range. The wall can be a vertical plane up to 90 feet long, 30 feet high, and 1 inch thick, or a sphere with a 30-foot radius. The wall is opaque and consists of seven layers of different colors.",
    class: ["Wizard"]
  },
  "Shapechange": {
    name: "Shapechange", level: 9, school: "Transmutation", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "You assume the form of a different creature for the duration. The new form can be of any creature with a challenge rating equal to your level or lower. The creature can't be a construct or an undead, and you must have seen the sort of creature at least once.",
    class: ["Druid", "Wizard"]
  },
  "Storm of Vengeance": {
    name: "Storm of Vengeance", level: 9, school: "Conjuration", castingTime: "1 action", range: "Sight", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "A churning storm cloud forms, centered on a point you can see and spreading to a radius of 360 feet. Lightning flashes in the area, thunder booms, and strong winds roar. Each creature under the cloud (no more than 5,000 feet beneath the cloud) when it appears must make a Constitution saving throw. On a failed save, a creature takes 2d6 thunder damage and becomes deafened for 5 minutes.",
    class: ["Druid"]
  },
  "Time Stop": {
    name: "Time Stop", level: 9, school: "Transmutation", castingTime: "1 action", range: "Self", components: "V", duration: "Instantaneous",
    description: "You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row, during which you can use actions and move as normal.",
    class: ["Sorcerer", "Wizard"]
  },
  "True Polymorph": {
    name: "True Polymorph", level: 9, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, up to 1 hour",
    description: "Choose one creature or nonmagical object that you can see within range. You transform the creature into a different creature, the creature into an object, or the object into a creature (the object must be neither worn nor carried by another creature). The transformation lasts for the duration, or until the target drops to 0 hit points or dies.",
    class: ["Bard", "Warlock", "Wizard"]
  },
  "True Resurrection": {
    name: "True Resurrection", level: 9, school: "Necromancy", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    description: "You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age. If the creature's soul is free and willing, the creature is restored to life with all its hit points.",
    class: ["Cleric", "Druid"]
  },
  "Weird": {
    name: "Weird", level: 9, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    description: "Drawing on the deepest fears of a group of creatures, you create illusory creatures in their minds, visible only to them. Each creature in a 30-foot-radius sphere centered on a point of your choice within range must make a Wisdom saving throw. On a failed save, a creature becomes frightened for the duration.",
    class: ["Wizard"]
  },
  "Wish": {
    name: "Wish", level: 9, school: "Conjuration", castingTime: "1 action", range: "Self", components: "V", duration: "Instantaneous",
    description: "Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires. The basic use of this spell is to duplicate any other spell of 8th level or lower.",
    class: ["Sorcerer", "Wizard"]
  },
};
Object.keys(DND_SPELLS).forEach(k => {
  if (!DND_SPELLS[k].class) DND_SPELLS[k].class = [];
});
