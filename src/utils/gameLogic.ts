import type { Category, GameSession, Player } from '../types';

/** Unbiased integer in [0, max). */
function randomInt(max: number): number {
  if (max <= 1) return 0;
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

/** Fisher-Yates shuffle. Returns a new array, does not mutate the input. */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick `count` unique random indices from [0, total). */
function pickUniqueIndices(total: number, count: number): number[] {
  const pool = Array.from({ length: total }, (_, i) => i);
  const picked: number[] = [];
  for (let c = 0; c < count; c++) {
    const slot = randomInt(pool.length);
    picked.push(pool[slot]);
    pool.splice(slot, 1);
  }
  return picked;
}

/** Picks random, unique player ids to be imposters. */
export function pickImposters(players: Player[], count: number): string[] {
  const safeCount = Math.max(1, Math.min(Math.floor(Number(count)) || 1, players.length - 1));
  const indices = pickUniqueIndices(players.length, safeCount);
  return indices.map((i) => players[i].id);
}

/** Picks one random player id to go first during the talking round. */
export function pickStartingPlayer(players: Player[]): string {
  return players[randomInt(players.length)].id;
}

/**
 * Assign imposter(s) and starting player independently.
 * Same person can be both by chance, but each pick uses its own random draw.
 */
export function assignRoles(players: Player[], imposterCount: number) {
  const imposterIds = pickImposters(players, imposterCount);
  const startingPlayerId = pickStartingPlayer(players);
  return { imposterIds, startingPlayerId };
}

/** Picks one random category from the pool, then one random pair from it. */
export function pickCategoryAndPair(categoryPool: Category[]) {
  const category = categoryPool[randomInt(categoryPool.length)];
  const pair = category.pairs[randomInt(category.pairs.length)];
  return { category, pair };
}

function newRoundKey(): string {
  return crypto.randomUUID();
}

/** Builds a brand new game session from setup choices. */
export function createSession(
  players: Player[],
  imposterCount: number,
  categoryPool: Category[],
  showCategoryToImposter: boolean
): GameSession {
  const { category, pair } = pickCategoryAndPair(categoryPool);
  const { imposterIds, startingPlayerId } = assignRoles(players, imposterCount);
  return {
    players,
    imposterCount: Math.max(1, Math.min(Math.floor(Number(imposterCount)) || 1, players.length - 1)),
    categoryPool,
    category,
    selectedPair: pair,
    imposterIds,
    startingPlayerId,
    showCategoryToImposter,
    roundKey: newRoundKey(),
  };
}

/** Re-rolls word, imposters and starting player, keeping the same players/settings/category pool. */
export function rerollSession(session: GameSession): GameSession {
  return createSession(
    session.players,
    session.imposterCount,
    session.categoryPool,
    session.showCategoryToImposter
  );
}

export function makePlayerId(): string {
  return crypto.randomUUID();
}
