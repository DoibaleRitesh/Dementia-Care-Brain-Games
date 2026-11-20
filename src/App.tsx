import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { GAMES_META } from './data/gamesMeta';
import { GamesPage } from './pages/GamesPage';
import { HomePage } from './pages/HomePage';
import { ResearchPage } from './pages/ResearchPage';
import { GameId, PageId, ProgressStore, TextSize } from './types';
import {
  createEmptyProgressStore,
  loadProgressStore,
  loadSoundEnabled,
  loadTextSize,
  recordLevelCompletion,
  saveProgressStore,
  saveSoundEnabled,
  saveTextSize,
} from './utils/storage';

const VALID_GAME_IDS = new Set<string>(GAMES_META.map((g) => g.id));

function parseHashRoute(): { page: PageId; gameId: GameId | null } {
  if (typeof window === 'undefined') return { page: 'home', gameId: null };
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (raw === 'research') return { page: 'research', gameId: null };
  if (raw === 'games') return { page: 'games', gameId: null };
  if (raw.startsWith('games/')) {
    const maybeId = raw.slice('games/'.length);
    if (VALID_GAME_IDS.has(maybeId)) {
      return { page: 'games', gameId: maybeId as GameId };
    }
    return { page: 'games', gameId: null };
  }
  return { page: 'home', gameId: null };
}

export default function App() {
  const initialRoute = parseHashRoute();
  const [activePage, setActivePage] = useState<PageId>(initialRoute.page);
  const [activeGameId, setActiveGameId] = useState<GameId | null>(initialRoute.gameId);
  const [textSize, setTextSize] = useState<TextSize>(() => loadTextSize());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundEnabled());
  const [progress, setProgress] = useState<ProgressStore>(() => loadProgressStore());

  // Apply text scaling class cleanly on document root
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-scale-standard', 'text-scale-large', 'text-scale-xlarge');
    html.classList.add(`text-scale-${textSize}`);
    saveTextSize(textSize);
  }, [textSize]);

  // Listen for browser hash back/forward navigation
  useEffect(() => {
    const onHashChange = () => {
      const next = parseHashRoute();
      setActivePage(next.page);
      setActiveGameId(next.gameId);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateToPage = useCallback((page: PageId) => {
    setActivePage(page);
    setActiveGameId(null);
    window.location.hash = page === 'home' ? '#home' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectGame = useCallback((gameId: GameId | null) => {
    setActivePage('games');
    setActiveGameId(gameId);
    window.location.hash = gameId ? `#games/${gameId}` : '#games';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveProgressStore(progress);
  }, [progress]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const handleCompleteLevel = useCallback((gameId: GameId, level: number) => {
    setProgress((prev) => recordLevelCompletion(prev, gameId, level));
  }, []);

  const handleResetAllProgress = useCallback(() => {
    setProgress(createEmptyProgressStore());
  }, []);

  const totalLevelsCount = GAMES_META.reduce((acc, g) => acc + g.totalLevels, 0);
  const completedLevelsCount = GAMES_META.reduce(
    (acc, g) => acc + (progress[g.id]?.completedLevels.length ?? 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar
        activePage={activePage}
        onNavigate={navigateToPage}
        textSize={textSize}
        onChangeTextSize={setTextSize}
        completedLevelsCount={completedLevelsCount}
        totalLevelsCount={totalLevelsCount}
      />

      <div className="flex-1">
        {activePage === 'home' && <HomePage onNavigate={navigateToPage} />}
        {activePage === 'research' && (
          <ResearchPage
            onOpenGame={(gameId) => selectGame(gameId)}
            onGoToGames={() => navigateToPage('games')}
          />
        )}
        {activePage === 'games' && (
          <GamesPage
            activeGameId={activeGameId}
            progress={progress}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onSelectGame={selectGame}
            onCompleteLevel={handleCompleteLevel}
            onResetAllProgress={handleResetAllProgress}
            onNavigateResearch={() => navigateToPage('research')}
          />
        )}
      </div>

      <Footer onNavigate={navigateToPage} />
    </div>
  );
}
