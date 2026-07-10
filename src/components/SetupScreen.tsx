import { useState } from 'react';
import type { Category, Player } from '../types';
import { makePlayerId } from '../utils/gameLogic';
import CategoryPicker from './CategoryPicker';
import StampButton from './StampButton';

interface SetupScreenProps {
  categoriesEasy: Category[];
  categoriesHard: Category[];
  initialPlayers: Player[];
  onStart: (
    players: Player[],
    imposterCount: number,
    categoryPool: Category[],
    showCategoryToImposter: boolean
  ) => void;
}

export default function SetupScreen({
  categoriesEasy,
  categoriesHard,
  initialPlayers,
  onStart,
}: SetupScreenProps) {
  const [players, setPlayers] = useState<Player[]>(
    initialPlayers.length >= 3
      ? initialPlayers
      : [
          { id: makePlayerId(), name: '' },
          { id: makePlayerId(), name: '' },
          { id: makePlayerId(), name: '' },
        ]
  );
  const [imposterCount, setImposterCount] = useState(1);
  const [hardMode, setHardMode] = useState(true);
  const [showCategoryToImposter, setShowCategoryToImposter] = useState(false);
  const categories = hardMode ? categoriesHard : categoriesEasy;
  // Multiple categories can be in play at once; all are on by default and
  // the actual word each round is drawn from a random one among the enabled set.
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    categoriesHard.map((c) => c.id)
  );

  function toggleHardMode() {
    setHardMode((prev) => {
      const next = !prev;
      const nextCategories = next ? categoriesHard : categoriesEasy;
      setSelectedCategoryIds(nextCategories.map((c) => c.id));
      return next;
    });
  }

  function setSelectedCategoryIdsFromPicker(ids: string[]) {
    setSelectedCategoryIds(ids);
  }

  const filledPlayers = players.filter((p) => p.name.trim().length > 0);
  const maxImposters = Math.max(1, filledPlayers.length - 1);

  function updateName(id: string, name: string) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  function addPlayer() {
    setPlayers((prev) => [...prev, { id: makePlayerId(), name: '' }]);
  }

  function removePlayer(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  let error = '';
  if (filledPlayers.length < 3) {
    error = 'Add at least 3 named players.';
  } else if (imposterCount < 1) {
    error = 'There must be at least 1 imposter.';
  } else if (imposterCount >= filledPlayers.length) {
    error = 'Imposters must be fewer than the total players.';
  } else if (selectedCategoryIds.length < 1) {
    error = 'Pick at least 1 category.';
  }

  function handleStart() {
    if (error) return;
    const categoryPool = categories.filter((c) => selectedCategoryIds.includes(c.id));
    onStart(filledPlayers, imposterCount, categoryPool, showCategoryToImposter);
  }

  return (
    <div className="card">
      <p className="card-eyebrow">Step 1 — Game Setup</p>
      <h2 className="card-title">Who's playing tonight?</h2>

      <div className="field">
        <label>Players</label>
        {players.map((p, i) => (
          <div className="player-row" key={p.id}>
            <input
              type="text"
              placeholder={`Player ${i + 1} name`}
              value={p.name}
              onChange={(e) => updateName(p.id, e.target.value)}
              maxLength={20}
            />
            {players.length > 3 && (
              <button
                type="button"
                className="icon-btn"
                aria-label={`Remove player ${i + 1}`}
                onClick={() => removePlayer(p.id)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-player" onClick={addPlayer}>
          + Add another player
        </button>
      </div>

      <div className="field">
        <label>Number of imposters</label>
        <input
          type="number"
          min={1}
          max={maxImposters}
          value={imposterCount}
          onChange={(e) => setImposterCount(Number(e.target.value))}
        />
      </div>
      {imposterCount >= Math.ceil(filledPlayers.length / 2) && !error && (
        <p className="hint warn">That's a lot of imposters for this group — crew may struggle.</p>
      )}

      <div className="field">
        <label>Imposter options</label>
        <label className="mode-toggle">
          <input
            type="checkbox"
            checked={showCategoryToImposter}
            onChange={() => setShowCategoryToImposter((prev) => !prev)}
          />
          Show category to imposter
        </label>
        <p className="hint">
          {showCategoryToImposter
            ? 'Imposters see the category and their clue — harder for the crew.'
            : 'Imposters only see their clue — category stays hidden from them.'}
        </p>
      </div>

      <div className="field">
        <label>Clue style</label>
        <label className="mode-toggle">
          <input type="checkbox" checked={hardMode} onChange={toggleHardMode} />
          Hard mode — short, indirect clues
        </label>
        <p className="hint">
          {hardMode
            ? '977 pairs across 41 categories. Turn off for the classic descriptive dataset.'
            : 'Classic mode — similar word pairs that are easier to bluff with.'}
        </p>
      </div>

      <div className="field">
        <CategoryPicker
          categories={categories}
          selectedIds={selectedCategoryIds}
          onChange={setSelectedCategoryIdsFromPicker}
        />
        <p className="hint">All categories are on by default — open Categories to narrow it down.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <StampButton variant="primary" onClick={handleStart} disabled={!!error}>
        Deal the cards
      </StampButton>
    </div>
  );
}
