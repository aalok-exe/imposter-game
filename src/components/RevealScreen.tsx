import { useEffect, useRef, useState } from 'react';
import type { GameSession } from '../types';
import StampButton from './StampButton';

interface RevealScreenProps {
  session: GameSession;
  onComplete: () => void;
}

const HOLD_MS = 1000;
const RING_RADIUS = 32;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function RevealScreen({ session, onComplete }: RevealScreenProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [showStarter, setShowStarter] = useState(false);

  const holding = useRef(false);
  const rafId = useRef<number | null>(null);
  const holdProgressRef = useRef<SVGCircleElement>(null);

  const player = session.players[index];
  const isImposter = session.imposterIds.includes(player.id);
  const isLast = index === session.players.length - 1;
  const starter = session.players.find((p) => p.id === session.startingPlayerId)!;

  function setHoldProgress(pct: number) {
    const offset = RING_CIRCUMFERENCE * (1 - pct / 100);
    holdProgressRef.current?.style.setProperty('stroke-dashoffset', String(offset));
  }

  function stopHold() {
    holding.current = false;
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }

  function startHold(e: React.PointerEvent<HTMLDivElement>) {
    if (revealed || holding.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    holding.current = true;
    setIsHolding(true);
    const start = performance.now();

    const tick = (now: number) => {
      if (!holding.current) return;
      const pct = Math.min(100, ((now - start) / HOLD_MS) * 100);
      setHoldProgress(pct);
      if (pct >= 100) {
        stopHold();
        setIsHolding(false);
        setRevealed(true);
        return;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
  }

  function cancelHold(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    stopHold();
    setIsHolding(false);
    if (!revealed) setHoldProgress(0);
  }

  useEffect(() => () => stopHold(), []);

  function handleNext() {
    if (isLast) {
      setShowStarter(true);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setIsHolding(false);
    setHoldProgress(0);
  }

  if (showStarter) {
    return (
      <div className="card">
        <p className="card-eyebrow">Step 2 — Deal Cards</p>
        <h2 className="card-title">Everyone&apos;s seen their card</h2>

        <div className="starter-badge">
          <div className="label">Goes first this round</div>
          <div className="name">{starter.name}</div>
        </div>

        <p className="hint">
          Play clockwise from {starter.name}. Put the phone down and start giving one-word clues.
        </p>

        <StampButton variant="primary" onClick={onComplete}>
          Continue to rules
        </StampButton>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="card-eyebrow">
        Step 2 — Deal Cards ({index + 1}/{session.players.length})
      </p>

      <div className="pass-notice">
        <div className="to">Hand the phone to</div>
        <div className="name">{player.name}</div>
      </div>

      <div
        className={`reveal-card${isHolding ? ' is-holding' : ''}${revealed ? ' is-revealed' : ''}`}
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
      >
        <div className="reveal-card-stage">
          <div className="reveal-face reveal-front">
            <div className="hold-ring" aria-hidden="true">
              <svg className="hold-ring-svg" viewBox="0 0 72 72">
                <circle className="hold-ring-track" cx="36" cy="36" r={RING_RADIUS} />
                <circle
                  ref={holdProgressRef}
                  className="hold-ring-progress"
                  cx="36"
                  cy="36"
                  r={RING_RADIUS}
                  style={{ strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: RING_CIRCUMFERENCE }}
                />
              </svg>
              <div className="hold-ring-core" />
            </div>
            <p className="hold-label">Only {player.name} should be looking</p>
            <p className="hold-sublabel">
              {isHolding ? 'Keep holding…' : 'Press and hold to reveal'}
            </p>
          </div>

          <div className={`reveal-face reveal-back ${isImposter ? 'role-imposter' : 'role-crew'}`}>
            <span className="role-label">{isImposter ? 'Imposter' : 'Civilian'}</span>
            {isImposter ? (
              <>
                {!session.showCategoryToImposter && (
                  <p className="imposter-hint">No category — blend in with your clue</p>
                )}
                {session.showCategoryToImposter && (
                  <span className="category-badge">{session.category.name}</span>
                )}
                <div className="payload">{session.selectedPair.clue}</div>
              </>
            ) : (
              <>
                <span className="category-badge">{session.category.name}</span>
                <div className="payload">{session.selectedPair.word}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="progress-dots">
        {session.players.map((_, i) => (
          <div key={i} className={`dot ${i < index || (i === index && revealed) ? 'filled' : ''}`} />
        ))}
      </div>

      <StampButton variant="primary" onClick={handleNext} disabled={!revealed}>
        {isLast ? "That's everyone — continue" : 'Pass to next player'}
      </StampButton>
    </div>
  );
}
