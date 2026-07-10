export interface Player {
  id: string;
  name: string;
}

export interface WordPair {
  word: string;
  clue: string;
}

export interface Category {
  id: string;
  name: string;
  pairs: WordPair[];
}

export type Phase = 'setup' | 'reveal' | 'briefing' | 'results';

export interface GameSession {
  players: Player[];
  imposterCount: number;
  categoryPool: Category[]; // categories the player enabled in setup
  category: Category; // the one actually picked for this round
  selectedPair: WordPair;
  imposterIds: string[];
  startingPlayerId: string;
  showCategoryToImposter: boolean;
  roundKey: string;
}
