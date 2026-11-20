import { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playMatchSound,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface NumberPathOrderProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface NumberLevelSpec {
  description: string;
  sequence: number[];
  cols: number;
}

const NUMBER_LEVELS: Record<number, NumberLevelSpec> = {
  1: {
    description: 'Tap the numbers in order from 1 to 6.',
    sequence: [1, 2, 3, 4, 5, 6],
    cols: 3,
  },
  2: {
    description: 'Tap the numbers in order from 1 to 9.',
    sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    cols: 3,
  },
  3: {
    description: 'Tap the numbers in order from 1 to 12.',
    sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    cols: 4,
  },
  4: {
    description: 'Count gently by twos! Tap the even numbers from 2 to 20.',
    sequence: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    cols: 5,
  },
  5: {
    description: 'Tap every number in order from 1 to 16.',
    sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    cols: 4,
  },
};

function shuffleNumbers(seq: number[]): number[] {
  const copy = [...seq];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function NumberPathOrder({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: NumberPathOrderProps) {
  const [level, setLevel] = useState(1);
  const spec = NUMBER_LEVELS[level] ?? NUMBER_LEVELS[1];

  const [boardNumbers, setBoardNumbers] = useState<number[]>(() =>
    shuffleNumbers(NUMBER_LEVELS[1].sequence)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hintNumber, setHintNumber] = useState<number | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startLevel = useCallback((targetLevel: number) => {
    const nextSpec = NUMBER_LEVELS[targetLevel] ?? NUMBER_LEVELS[1];
    setLevel(targetLevel);
    setBoardNumbers(shuffleNumbers(nextSpec.sequence));
    setCurrentIdx(0);
    setHintNumber(null);
    setHintMessage(null);
    setStatusMessage(null);
    setIsComplete(false);
  }, []);

  const expectedNumber = spec.sequence[currentIdx];

  const handleNumberTap = (value: number) => {
    if (isComplete) return;
    const alreadyFound = spec.sequence.slice(0, currentIdx).includes(value);
    if (alreadyFound) return;

    if (value === expectedNumber) {
      setHintNumber(null);
      setHintMessage(null);
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);

      if (nextIdx >= spec.sequence.length) {
        playLevelCompleteSound(soundEnabled);
        setIsComplete(true);
        setStatusMessage(null);
        onCompleteLevel(level);
      } else {
        playMatchSound(soundEnabled);
        setStatusMessage(
          `Found ${value}! Next, look for ${spec.sequence[nextIdx]}.`
        );
      }
    } else {
      playGentleNudgeSound(soundEnabled);
      setStatusMessage(
        `You tapped ${value}. Let's find ${expectedNumber} next—take your time scanning the board.`
      );
    }
  };

  const handleRequestHint = () => {
    if (expectedNumber === undefined) return;
    setHintNumber(expectedNumber);
    setHintMessage(
      `Look for number ${expectedNumber}—we have highlighted its tile in warm gold.`
    );
  };

  const collectedSet = new Set(spec.sequence.slice(0, currentIdx));

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level}: ${spec.description}`}
      progressText={`Collected: ${currentIdx} of ${spec.sequence.length}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={isComplete}
      completionSummary={`You followed the complete number path smoothly from ${spec.sequence[0]} to ${spec.sequence[spec.sequence.length - 1]}.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Next Target Indicator */}
        {expectedNumber !== undefined && (
          <div className="bg-sage-mist border border-sage-strong rounded-xl px-6 py-4 flex items-center justify-between gap-4">
            <span className="text-base font-semibold text-ink">Next number to tap:</span>
            <span className="font-serif text-3xl font-bold text-sage-primary tabular-nums">
              {expectedNumber}
            </span>
          </div>
        )}

        {/* Number Grid */}
        <div
          className={`grid gap-3 sm:gap-4 ${
            spec.cols === 3
              ? 'grid-cols-3'
              : spec.cols === 5
                ? 'grid-cols-2 sm:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {boardNumbers.map((num) => {
            const isCollected = collectedSet.has(num);
            const isHinted = hintNumber === num && !isCollected;

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberTap(num)}
                disabled={isCollected}
                aria-label={`Number ${num}${isCollected ? ', already collected' : ''}`}
                className={`min-h-[82px] sm:min-h-[92px] rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-colors tabular-nums cursor-pointer disabled:cursor-default ${
                  isCollected
                    ? 'bg-sage-mist border-sage-primary text-sage-primary'
                    : isHinted
                      ? 'bg-ochre-bg border-ochre-text text-ochre-text'
                      : 'bg-surface border-sage-strong text-ink hover:bg-sage-mist'
                }`}
              >
                <span className="font-serif text-3xl font-semibold">{num}</span>
                {isCollected && <Check className="w-4 h-4" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
    </GameFrame>
  );
}
