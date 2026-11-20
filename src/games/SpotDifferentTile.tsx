import { useCallback, useMemo, useState } from 'react';
import {
  Anchor,
  Apple,
  Bell,
  Bird,
  BookOpen,
  Cloud,
  CloudRain,
  Coffee,
  Compass,
  Feather,
  Flower2,
  Heart,
  Home,
  KeyRound,
  Leaf,
  Moon,
  Music,
  Star,
  Sun,
  TreePine,
  Umbrella,
  Watch,
} from 'lucide-react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playMatchSound,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface SpotDifferentTileProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface RoundPair {
  mainLabel: string;
  MainIcon: typeof Sun;
  oddLabel: string;
  OddIcon: typeof Moon;
}

const LEVEL_ROUNDS: Record<number, { cols: number; totalTiles: number; pairs: RoundPair[] }> = {
  1: {
    cols: 2,
    totalTiles: 4,
    pairs: [
      { mainLabel: 'Sun', MainIcon: Sun, oddLabel: 'Moon', OddIcon: Moon },
      { mainLabel: 'Coffee Cup', MainIcon: Coffee, oddLabel: 'Apple', OddIcon: Apple },
      { mainLabel: 'Flower', MainIcon: Flower2, oddLabel: 'Tree', OddIcon: TreePine },
    ],
  },
  2: {
    cols: 3,
    totalTiles: 6,
    pairs: [
      { mainLabel: 'Leaf', MainIcon: Leaf, oddLabel: 'Flower', OddIcon: Flower2 },
      { mainLabel: 'Cloud', MainIcon: Cloud, oddLabel: 'Rain Cloud', OddIcon: CloudRain },
      { mainLabel: 'Book', MainIcon: BookOpen, oddLabel: 'Music Note', OddIcon: Music },
    ],
  },
  3: {
    cols: 3,
    totalTiles: 9,
    pairs: [
      { mainLabel: 'Star', MainIcon: Star, oddLabel: 'Heart', OddIcon: Heart },
      { mainLabel: 'Bird', MainIcon: Bird, oddLabel: 'Feather', OddIcon: Feather },
      { mainLabel: 'Home', MainIcon: Home, oddLabel: 'Key', OddIcon: KeyRound },
    ],
  },
  4: {
    cols: 4,
    totalTiles: 12,
    pairs: [
      { mainLabel: 'Bell', MainIcon: Bell, oddLabel: 'Umbrella', OddIcon: Umbrella },
      { mainLabel: 'Compass', MainIcon: Compass, oddLabel: 'Watch', OddIcon: Watch },
      { mainLabel: 'Cloud', MainIcon: Cloud, oddLabel: 'Rain Cloud', OddIcon: CloudRain },
    ],
  },
  5: {
    cols: 4,
    totalTiles: 16,
    pairs: [
      { mainLabel: 'Anchor', MainIcon: Anchor, oddLabel: 'Compass', OddIcon: Compass },
      { mainLabel: 'Leaf', MainIcon: Leaf, oddLabel: 'Tree', OddIcon: TreePine },
      { mainLabel: 'Feather', MainIcon: Feather, oddLabel: 'Bird', OddIcon: Bird },
    ],
  },
};

function pickOddIndex(totalTiles: number, seed: number): number {
  return Math.floor(Math.random() * totalTiles + seed) % totalTiles;
}

export function SpotDifferentTile({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: SpotDifferentTileProps) {
  const [level, setLevel] = useState(1);
  const [roundIdx, setRoundIdx] = useState(0);
  const [oddIndex, setOddIndex] = useState(() => pickOddIndex(4, 1));
  const [hintStep, setHintStep] = useState(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const config = LEVEL_ROUNDS[level] ?? LEVEL_ROUNDS[1];
  const currentPair = config.pairs[roundIdx] ?? config.pairs[0];

  const startLevel = useCallback((targetLevel: number) => {
    const nextCfg = LEVEL_ROUNDS[targetLevel] ?? LEVEL_ROUNDS[1];
    setLevel(targetLevel);
    setRoundIdx(0);
    setOddIndex(pickOddIndex(nextCfg.totalTiles, targetLevel));
    setHintStep(0);
    setHintMessage(null);
    setStatusMessage(null);
    setIsComplete(false);
  }, []);

  const tiles = useMemo(
    () =>
      Array.from({ length: config.totalTiles }, (_, idx) => ({
        index: idx,
        isOdd: idx === oddIndex,
      })),
    [config.totalTiles, oddIndex]
  );

  const handleTileTap = (idx: number) => {
    if (isComplete) return;

    if (idx === oddIndex) {
      setHintStep(0);
      setHintMessage(null);

      if (roundIdx + 1 >= config.pairs.length) {
        playLevelCompleteSound(soundEnabled);
        setIsComplete(true);
        setStatusMessage(null);
        onCompleteLevel(level);
      } else {
        playMatchSound(soundEnabled);
        const nextRound = roundIdx + 1;
        setRoundIdx(nextRound);
        setOddIndex(pickOddIndex(config.totalTiles, nextRound + level * 3));
        setStatusMessage(
          `Great eye! You spotted the ${currentPair.oddLabel}. Here is round ${nextRound + 1} of ${config.pairs.length}.`
        );
      }
    } else {
      playGentleNudgeSound(soundEnabled);
      setStatusMessage(
        `That tile shows a ${currentPair.mainLabel}. Keep scanning calmly for the one tile that looks different.`
      );
    }
  };

  const handleRequestHint = () => {
    const oddRow = Math.floor(oddIndex / config.cols) + 1;
    const nextStep = Math.min(hintStep + 1, 2);
    setHintStep(nextStep);
    if (nextStep === 1) {
      setHintMessage(
        `Look carefully along Row ${oddRow} (counting from the top) for a ${currentPair.oddLabel}.`
      );
    } else {
      setHintMessage(
        `The different tile (${currentPair.oddLabel}) is highlighted in gold in Row ${oddRow}.`
      );
    }
  };

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level}: Look across the tiles below and tap the one tile that is different from all the others.`}
      progressText={`Round ${Math.min(roundIdx + 1, config.pairs.length)} of ${config.pairs.length}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={isComplete}
      completionSummary={`You spotted every different tile across all ${config.pairs.length} rounds of Level ${level}.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div
        className="grid gap-3 sm:gap-4 max-w-2xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
      >
        {tiles.map((tile) => {
          const IconComp = tile.isOdd ? currentPair.OddIcon : currentPair.MainIcon;
          const label = tile.isOdd ? currentPair.oddLabel : currentPair.mainLabel;
          const showGoldHint = tile.isOdd && hintStep >= 2;
          const rowHighlight =
            hintStep === 1 && Math.floor(tile.index / config.cols) === Math.floor(oddIndex / config.cols);

          return (
            <button
              key={tile.index}
              type="button"
              onClick={() => handleTileTap(tile.index)}
              aria-label={`Tile ${tile.index + 1}: ${label}`}
              className={`min-h-[104px] sm:min-h-[118px] rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                showGoldHint
                  ? 'bg-ochre-bg border-ochre-text text-ochre-text'
                  : rowHighlight
                    ? 'bg-sage-mist border-sage-strong text-ink hover:bg-sage-soft'
                    : 'bg-surface border-sage-border text-ink hover:bg-sage-mist'
              }`}
            >
              <IconComp className="w-9 h-9 text-sage-primary" aria-hidden="true" />
              <span className="text-xs font-medium text-ink-muted sr-only">{label}</span>
            </button>
          );
        })}
      </div>
    </GameFrame>
  );
}
