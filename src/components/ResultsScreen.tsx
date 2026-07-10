import { useState } from 'react';
import type { GameSession } from '../types';
import StampButton from './StampButton';

interface ResultsScreenProps {
  session: GameSession;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export default function ResultsScreen({ session, onPlayAgain, onNewGame }: ResultsScreenProps) {
  const [revealed, setRevealed] = useState(false);

  const imposters = session.players.filter((p) => session.imposterIds.includes(p.id));
  const multipleImposters = imposters.length > 1;

  return (
    <div className="card">
      <p className="card-eyebrow">Step 4 — Results</p>

      {!revealed ? (
        <>
          <h2 className="card-title">Ready to see who it was?</h2>
          <StampButton variant="primary" onClick={() => setRevealed(true)}>
            Reveal answer
          </StampButton>
        </>
      ) : (
        <>
          <div className="results-hero">
            <p className="results-hero-tag">That&apos;s a wrap!</p>
            <p className="results-hero-label">
              {multipleImposters ? 'The imposters were' : 'The imposter was'}
            </p>
            <div className="results-hero-names">
              {imposters.map((player) => (
                <h2 key={player.id} className="results-hero-name">
                  {player.name}
                </h2>
              ))}
            </div>
          </div>

          <section className="results-details" aria-label="Game details">
            <p className="results-details-heading">The full picture</p>
            <div className="reveal-block category">
              <div className="k">Category</div>
              <div className="v">{session.category.name}</div>
            </div>
            <div className="reveal-block word">
              <div className="k">The word was</div>
              <div className="v">{session.selectedPair.word}</div>
            </div>
            <div className="reveal-block clue">
              <div className="k">Imposter clue was</div>
              <div className="v">{session.selectedPair.clue}</div>
            </div>
          </section>

          <div className="btn-row">
            <StampButton variant="primary" onClick={onPlayAgain}>
              Play again
            </StampButton>
            <StampButton variant="secondary" onClick={onNewGame}>
              New setup
            </StampButton>
          </div>
        </>
      )}
    </div>
  );
}
