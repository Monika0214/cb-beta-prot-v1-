
export enum AppView {
  HOME = 'HOME',
  COLLECTIONS = 'COLLECTIONS',
  LEADERBOARD = 'LEADERBOARD',
  FRIENDS = 'FRIENDS',
  STORE = 'STORE',
  MATCHMAKING = 'MATCHMAKING',
  GAMEPLAY = 'GAMEPLAY',
  MATCH_RESULT = 'MATCH_RESULT',
  MATCH_STATS = 'MATCH_STATS',
  MATCH_REWARDS = 'MATCH_REWARDS',
  FRAME_BREAK = 'FRAME_BREAK',
  EDIT_SQUAD = 'EDIT_SQUAD',
  COLLECTION_LEVEL = 'COLLECTION_LEVEL',
  RANK_PROGRESSION = 'RANK_PROGRESSION',
  SEARCH_FRIENDS = 'SEARCH_FRIENDS',
  PLAYER_PROFILE = 'PLAYER_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE'
}

/* Added missing AppTool enum for Sidebar component */
export enum AppTool {
  WRITER = 'WRITER',
  IMAGEN = 'IMAGEN',
  VISION = 'VISION',
  SEARCH = 'SEARCH',
  SPEECH = 'SPEECH'
}

/* Added missing SearchCitation interface for Gemini grounding metadata results */
export interface SearchCitation {
  web?: {
    uri: string;
    title: string;
  };
}

export interface PlayerCard {
  id: string;
  name: string;
  cost: number;
  runs: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  image: string;
  abilityType?: 'ON REVEAL' | 'ONGOING' | 'ABILITY';
  abilityText?: string;
}

export interface Squad {
  id: string;
  name: string;
  cards: PlayerCard[];
  power: number;
  emblemId?: string;
  color?: string;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  avatar: string;
  coins: number;
  gems: number;
  energyDrinks: number;
  wins: number;
}

export interface Region {
  id: string;
  name: string;
  country: string;
  city: string;
  entryFee: number;
  playersCount: number;
  stadiumCount: number;
  flag: string;
  energyReward: number;
  unlockLevel: number;
  image: string;
  /* Added missing risk property for Lobby component */
  risk: 'Low' | 'Medium' | 'High';
}

export interface MatchState {
  opponent: {
    name: string;
    level: number;
    avatar: string;
    squadPower: number;
  };
  region: Region;
  ballsPlayed: number;
  playerWins: number;
  opponentWins: number;
  currentStadium: number;
  isDeclared: boolean;
  score: {
    player: number;
    opponent: number;
  };
  playedCards?: { stadiumId: number; card: PlayerCard; side: 'player' | 'opponent' }[];
}

export interface AIInsight {
  type: 'PASSIVE' | 'CONTEXTUAL';
  message: string;
  urgency: 'low' | 'medium' | 'high';
}
