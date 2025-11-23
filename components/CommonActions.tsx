
import React from 'react';

const actions = [
  {
    name: 'Attack',
    description: 'Make one melee or ranged attack. Certain features, like Extra Attack, allow you to make more than one attack.',
  },
  {
    name: 'Cast a Spell',
    description: 'Cast a spell with a casting time of 1 action. You can\'t cast a spell with your action and a different spell with your bonus action in the same turn, unless the action is a cantrip.',
  },
  {
    name: 'Dash',
    description: 'Gain extra movement for the current turn. The increase equals your speed, after applying any modifiers.',
  },
  {
    name: 'Disengage',
    description: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.',
  },
  {
    name: 'Dodge',
    description: 'Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage.',
  },
  {
    name: 'Help',
    description: 'You can aid another creature in the completion of a task. The creature you help gains advantage on the next ability check it makes to perform the task. Alternatively, you can aid a friendly creature in attacking a creature within 5 feet of you, granting them advantage on the attack roll.',
  },
  {
    name: 'Hide',
    description: 'Make a Dexterity (Stealth) check in an attempt to become unseen. You can\'t hide from a creature that can see you clearly.',
  },
  {
    name: 'Ready',
    description: 'Choose a trigger and a specific action to take in response. When the trigger occurs, you can either take your action right after the trigger finishes or ignore the trigger.',
  },
  {
    name: 'Search',
    description: 'Devote your attention to finding something. Depending on the nature of your search, the DM might have you make a Wisdom (Perception) check or an Intelligence (Investigation) check.',
  },
  {
    name: 'Use an Object',
    description: 'Interact with a second object or feature of the environment. The DM might require a check for complex interactions.',
  },
];

const ActionCard: React.FC<{ name: string; description: string; onClick: () => void }> = ({ name, description, onClick }) => (
  <button onClick={onClick} className="w-full text-left bg-[var(--bg-secondary)]/50 rounded-md p-4 border-l-4 border-[var(--border-secondary)]/50 hover:bg-[var(--bg-secondary)] transition-colors">
    <strong className="text-[var(--text-secondary)] font-bold text-lg">{name}</strong>
    <p className="text-[var(--text-muted)] text-sm mt-1 whitespace-pre-wrap">{description}</p>
  </button>
);


const CommonActions: React.FC<{onActionSelect: (action: {name: string, description: string}) => void, isReadOnly?: boolean}> = ({onActionSelect, isReadOnly}) => {
  return (
    <div>
        <h3 className="text-xl font-medieval text-[var(--accent-primary)] mb-4">Common Actions in Combat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map(action => (
                <button 
                    key={action.name}
                    onClick={() => onActionSelect(action)}
                    className={`p-3 rounded-md text-left transition-all duration-200 w-full h-full flex flex-col justify-between border-l-4 border-[var(--border-secondary)]/50 bg-[var(--bg-secondary)]/70 text-[var(--text-primary)] ${isReadOnly ? 'cursor-pointer' : 'hover:bg-[var(--bg-tertiary)]/80'}`}
                >
                    <strong className={`font-bold ${isReadOnly ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>{action.name}</strong>
                </button>
            ))}
        </div>
    </div>
  );
};

export default CommonActions;