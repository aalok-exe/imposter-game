import { useState } from 'react';
import { categories } from './data/categories';
import { categoriesHard } from './data/categoriesHard';
import type { Category, GameSession, Phase, Player } from './types';
import { createSession, rerollSession } from './utils/gameLogic';
import { useTheme } from './hooks/useTheme';
import StepTabs from './components/StepTabs';
import SetupScreen from './components/SetupScreen';
import RevealScreen from './components/RevealScreen';
import BriefingScreen from './components/BriefingScreen';
import ResultsScreen from './components/ResultsScreen';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [phase, setPhase] = useState<Phase>('setup');
  const [session, setSession] = useState<GameSession | null>(null);
  const [lastPlayers, setLastPlayers] = useState<Player[]>([]);

  function handleStart(
    players: Player[],
    imposterCount: number,
    categoryPool: Category[],
    showCategoryToImposter: boolean
  ) {
    setSession(createSession(players, imposterCount, categoryPool, showCategoryToImposter));
    setLastPlayers(players);
    setPhase('reveal');
  }

  function handleRevealComplete() {
    setPhase('briefing');
  }

  function handleBriefingProceed() {
    setPhase('results');
  }

  function handlePlayAgain() {
    if (!session) return;
    setSession(rerollSession(session));
    setPhase('reveal');
  }

  function handleNewGame() {
    setPhase('setup');
  }

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-title">
          THE <span>IM</span>POST<span>ER</span>
        </div>
        <div className="app-header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="case-number">Round {Math.floor(Math.random() * 900 + 100)}</div>
        </div>
      </div>

      <StepTabs phase={phase} />

      {phase === 'setup' && (
        <SetupScreen
          categoriesEasy={categories}
          categoriesHard={categoriesHard}
          initialPlayers={lastPlayers}
          onStart={handleStart}
        />
      )}

      {phase === 'reveal' && session && (
        <RevealScreen key={session.roundKey} session={session} onComplete={handleRevealComplete} />
      )}

      {phase === 'briefing' && session && (
        <BriefingScreen onProceed={handleBriefingProceed} />
      )}

      {phase === 'results' && session && (
        <ResultsScreen session={session} onPlayAgain={handlePlayAgain} onNewGame={handleNewGame} />
      )}

      <p className="footer-note">Pass-and-play · one device · {session ? session.players.length : 0} players</p>
    </div>
  );
}
