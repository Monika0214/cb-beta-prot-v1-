
// Add missing React import to fix namespace error
import React from 'react';
import { PlayerCard, Region, Squad } from './types';
import { Shield, Trophy, Swords, Target, Activity, Flame } from 'lucide-react';

export interface ExtendedPlayerCard extends PlayerCard {
  unlockLevel: number;
}

export const MOCK_CARDS: ExtendedPlayerCard[] = [
  { 
    id: '1', name: 'Mithali Raj', cost: 6, runs: 95, rarity: 'Legendary', unlockLevel: 1,
    image: 'https://images.unsplash.com/photo-1624192132371-367288e67f08?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Boosts the Power Score of all other players in this squad by 10.' 
  },
  { 
    id: '2', name: 'Hardik Pandya', cost: 4, runs: 88, rarity: 'Epic', unlockLevel: 1,
    image: 'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ONGOING', abilityText: 'Gains +15 Runs if another Epic player is present in the squad.'
  },
  { 
    id: '3', name: 'S. Tendulkar', cost: 8, runs: 98, rarity: 'Legendary', unlockLevel: 1,
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ABILITY', abilityText: 'Runs scored by this card cannot be reduced by opponent effects.'
  },
  { 
    id: '4', name: 'Jasprit Bumrah', cost: 1, runs: 60, rarity: 'Rare', unlockLevel: 2,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Reduces the Runs of the next opponent card played by 20.'
  },
  { 
    id: '5', name: 'Shubman Gill', cost: 2, runs: 75, rarity: 'Rare', unlockLevel: 2,
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'If you are losing this stadium, draw an additional card.'
  },
  { 
    id: '6', name: 'Deandra Dottin', cost: 1, runs: 55, rarity: 'Common', unlockLevel: 3,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ABILITY', abilityText: 'Gains +5 Runs for every Common card in this squad.'
  },
  { 
    id: '7', name: 'Virat Kohli', cost: 7, runs: 94, rarity: 'Legendary', unlockLevel: 3,
    image: 'https://images.unsplash.com/photo-1540747913346-19e3adcc174b?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ONGOING', abilityText: 'Double the total Runs in this stadium if you are winning.'
  },
  { 
    id: '8', name: 'Ellyse Perry', cost: 5, runs: 89, rarity: 'Epic', unlockLevel: 4,
    image: 'https://images.unsplash.com/photo-1518116202812-789886367357?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Swap this card with the highest cost card in your hand.'
  },
  { 
    id: '9', name: 'Rashid Khan', cost: 3, runs: 72, rarity: 'Epic', unlockLevel: 4,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Next ball, the opponent must play their lowest cost card.'
  },
  { 
    id: '10', name: 'Kane Williamson', cost: 3, runs: 82, rarity: 'Epic', unlockLevel: 5,
    image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ONGOING', abilityText: 'All other players in this stadium gain +3 Runs.'
  },
  { 
    id: '11', name: 'Steve Smith', cost: 6, runs: 92, rarity: 'Epic', unlockLevel: 6,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ABILITY', abilityText: 'This card cannot be removed from the stadium by any effects.'
  },
  { 
    id: '12', name: 'Babar Azam', cost: 7, runs: 93, rarity: 'Legendary', unlockLevel: 7,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Draw 2 cards. Discard one at random.'
  },
  { 
    id: '13', name: 'Ben Stokes', cost: 5, runs: 86, rarity: 'Epic', unlockLevel: 8,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'If played on the final ball, this card gains +20 Runs.'
  },
  { 
    id: '14', name: 'Rohit Sharma', cost: 7, runs: 90, rarity: 'Legendary', unlockLevel: 9,
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Discard your hand and draw 4 new cards.'
  },
  { 
    id: '15', name: 'Glenn Maxwell', cost: 1, runs: 45, rarity: 'Rare', unlockLevel: 10,
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Add a random Common player card to your hand.'
  },
  { 
    id: '16', name: 'Pat Cummins', cost: 4, runs: 74, rarity: 'Rare', unlockLevel: 11,
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Destroy a random opponent card in this stadium.'
  },
  { 
    id: '17', name: 'Joe Root', cost: 2, runs: 80, rarity: 'Epic', unlockLevel: 12,
    image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ONGOING', abilityText: 'This card gains +2 Runs for every card in your hand.'
  },
  { 
    id: '18', name: 'Trent Boult', cost: 3, runs: 68, rarity: 'Rare', unlockLevel: 13,
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Move an opponent card to a different stadium at random.'
  },
  { 
    id: '19', name: 'Quinton de Kock', cost: 5, runs: 85, rarity: 'Rare', unlockLevel: 14,
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'Look at the top 3 cards of your deck. Put one in hand.'
  },
  { 
    id: '20', name: 'Mitchell Starc', cost: 4, runs: 71, rarity: 'Rare', unlockLevel: 15,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=600',
    abilityType: 'ON REVEAL', abilityText: 'The next card played in this stadium costs 1 less ⚡.'
  },
];

export const MOCK_REGIONS: Region[] = [
  { 
    id: 'uae', 
    name: 'DUBAI', 
    country: 'UAE',
    city: 'International Stadium',
    entryFee: 100, 
    playersCount: 450, 
    stadiumCount: 1, 
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/AE.svg',
    energyReward: 2,
    unlockLevel: 1, // THE SINGLE OPEN REGION
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    risk: 'Low'
  },
  { 
    id: 'sl', 
    name: 'COLOMBO', 
    country: 'SRI LANKA',
    city: 'R. Premadasa Stadium',
    entryFee: 250, 
    playersCount: 890, 
    stadiumCount: 1, 
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/LK.svg',
    energyReward: 3,
    unlockLevel: 10,
    image: 'https://images.unsplash.com/photo-1588714023644-039659ec4002?auto=format&fit=crop&q=80&w=800',
    risk: 'Low'
  },
  { 
    id: 'ind', 
    name: 'INDIA', 
    country: 'INDIA',
    city: 'Multiple arenas available',
    entryFee: 500, 
    playersCount: 2180, 
    stadiumCount: 12, 
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/IN.svg',
    energyReward: 5,
    unlockLevel: 20,
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=800',
    risk: 'Low'
  },
  { 
    id: 'eng', 
    name: 'ENGLAND', 
    country: 'ENGLAND',
    city: 'Multiple arenas available',
    entryFee: 1200, 
    playersCount: 3600, 
    stadiumCount: 8, 
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg',
    energyReward: 10,
    unlockLevel: 30,
    image: 'https://images.unsplash.com/photo-1624192132371-367288e67f08?auto=format&fit=crop&q=80&w=800',
    risk: 'Medium'
  },
  { 
    id: 'aus', 
    name: 'AUSTRALIA', 
    country: 'AUSTRALIA',
    city: 'Multiple arenas available',
    entryFee: 3000, 
    playersCount: 1950, 
    stadiumCount: 10, 
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/AU.svg',
    energyReward: 18,
    unlockLevel: 40,
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=800',
    risk: 'Medium'
  },
  { 
    id: 'za', 
    name: 'SOUTH AFRICA', 
    country: 'SOUTH AFRICA',
    city: 'Multiple arenas available',
    entryFee: 5000, 
    playersCount: 1100, 
    stadiumCount: 6, 
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/ZA.svg',
    energyReward: 28,
    unlockLevel: 50,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200',
    risk: 'High'
  },
  { 
    id: 'glo', 
    name: 'WORLD SERIES', 
    country: 'GLOBAL',
    city: 'Ultimate global competition',
    entryFee: 10000, 
    playersCount: 450, 
    stadiumCount: 1, 
    flag: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/globe.svg',
    energyReward: 45,
    unlockLevel: 60,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200',
    risk: 'High'
  },
];

export const MOCK_SQUADS: Squad[] = [
  { id: 's1', name: 'STRIKERS', cards: MOCK_CARDS.slice(0, 6), power: 512, emblemId: 'shield', color: 'red' },
  { id: 's2', name: 'BLAZERS', cards: MOCK_CARDS.slice(6, 11), power: 450, emblemId: 'flame', color: 'red' },
];

export const EMBLEMS: Record<string, React.ElementType> = {
  shield: Shield,
  trophy: Trophy,
  swords: Swords,
  target: Target,
  activity: Activity,
  flame: Flame,
};

export const COLORS: Record<string, string> = {
  red: 'text-red-600',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  yellow: 'text-yellow-500',
  emerald: 'text-emerald-500',
};
