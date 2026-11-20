import { useCallback, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playMatchSound,
  playTapSound,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface GentleWordSearchProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface PlacedWord {
  word: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
  cells: string[];
}

interface LevelPuzzle {
  theme: string;
  size: number;
  words: { word: string; row: number; col: number; direction: 'across' | 'down' }[];
}

// Hand-crafted, 100% non-conflicting senior-friendly grids (across & down only)
const LEVEL_PUZZLES: Record<number, LevelPuzzle> = {
  1: {
    theme: 'Warm Morning',
    size: 5,
    words: [
      { word: 'TEA', row: 0, col: 1, direction: 'across' },
      { word: 'SUN', row: 2, col: 0, direction: 'across' },
      { word: 'CUP', row: 2, col: 4, direction: 'down' },
    ],
  },
  2: {
    theme: 'In the Garden',
    size: 6,
    words: [
      { word: 'ROSE', row: 0, col: 0, direction: 'across' },
      { word: 'LEAF', row: 2, col: 1, direction: 'across' },
      { word: 'SEED', row: 1, col: 5, direction: 'down' },
      { word: 'SOIL', row: 5, col: 1, direction: 'across' },
    ],
  },
  3: {
    theme: 'Cozy Home',
    size: 7,
    words: [
      { word: 'CHAIR', row: 0, col: 1, direction: 'across' },
      { word: 'LAMP', row: 2, col: 0, direction: 'down' },
      { word: 'BOOK', row: 3, col: 2, direction: 'across' },
      { word: 'QUILT', row: 6, col: 1, direction: 'across' },
      { word: 'CLOCK', row: 1, col: 6, direction: 'down' },
    ],
  },
  4: {
    theme: 'Nature Walk',
    size: 7,
    words: [
      { word: 'RIVER', row: 0, col: 0, direction: 'across' },
      { word: 'BIRD', row: 2, col: 2, direction: 'across' },
      { word: 'TREE', row: 1, col: 0, direction: 'down' },
      { word: 'CLOUD', row: 4, col: 1, direction: 'across' },
      { word: 'PATH', row: 2, col: 6, direction: 'down' },
    ],
  },
  5: {
    theme: 'Seasons & Kitchen',
    size: 8,
    words: [
      { word: 'AUTUMN', row: 0, col: 1, direction: 'across' },
      { word: 'BREAD', row: 2, col: 0, direction: 'across' },
      { word: 'HONEY', row: 1, col: 7, direction: 'down' },
      { word: 'GARDEN', row: 4, col: 1, direction: 'across' },
      { word: 'APPLE', row: 3, col: 0, direction: 'down' },
      { word: 'SPRING', row: 7, col: 2, direction: 'across' },
    ],
  },
};

const FILL_LETTERS = 'AEIOURSTLNMDPHCGWB';

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

function generateBoard(level: number): { grid: string[][]; placed: PlacedWord[]; theme: string } {
  const puzzle = LEVEL_PUZZLES[level] ?? LEVEL_PUZZLES[1];
  const grid: string[][] = Array.from({ length: puzzle.size }, () =>
    Array.from({ length: puzzle.size }, () => '')
  );

  const placed: PlacedWord[] = puzzle.words.map((item) => {
    const cells: string[] = [];
    for (let i = 0; i < item.word.length; i++) {
      const r = item.direction === 'down' ? item.row + i : item.row;
      const c = item.direction === 'across' ? item.col + i : item.col;
      grid[r][c] = item.word[i];
      cells.push(cellKey(r, c));
    }
    return { ...item, cells };
  });

  // Deterministic friendly filler letters so board never changes mid-render
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (!grid[r][c]) {
        const idx = (r * 7 + c * 3 + level * 5) % FILL_LETTERS.length;
        grid[r][c] = FILL_LETTERS[idx];
      }
    }
  }

  return { grid, placed, theme: puzzle.theme };
}

export function GentleWordSearch({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: GentleWordSearchProps) {
  const [level, setLevel] = useState(1);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [hintTier, setHintTier] = useState(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintCells, setHintCells] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { grid, placed, theme } = useMemo(() => generateBoard(level), [level]);

  const foundCellSet = useMemo(() => {
    const set = new Set<string>();
    placed.forEach((p) => {
      if (foundWords.includes(p.word)) {
        p.cells.forEach((ck) => set.add(ck));
      }
    });
    return set;
  }, [placed, foundWords]);

  const startLevel = useCallback((targetLevel: number) => {
    setLevel(targetLevel);
    setFoundWords([]);
    setSelectedCells([]);
    setHintTier(0);
    setHintMessage(null);
    setHintCells([]);
    setStatusMessage(null);
    setIsComplete(false);
  }, []);

  const checkWordMatch = (candidateCells: string[]) => {
    const candidateStr = candidateCells.join(',');
    const reversedStr = [...candidateCells].reverse().join(',');
    const match = placed.find(
      (p) =>
        !foundWords.includes(p.word) &&
        (p.cells.join(',') === candidateStr || p.cells.join(',') === reversedStr)
    );
    return match ?? null;
  };

  const handleCellClick = (row: number, col: number) => {
    if (isComplete) return;
    const key = cellKey(row, col);
    playTapSound(soundEnabled);

    // Toggle off if clicking the last selected letter
    if (selectedCells.includes(key)) {
      setSelectedCells((prev) => prev.filter((c) => c !== key));
      return;
    }

    // If user clicks start and end of a word in 2 clicks, auto-select the line between them
    let nextSelected = [...selectedCells, key];
    if (selectedCells.length === 1) {
      const [sr, sc] = selectedCells[0].split('-').map(Number);
      if (sr === row && Math.abs(sc - col) >= 2) {
        const minC = Math.min(sc, col);
        const maxC = Math.max(sc, col);
        const line: string[] = [];
        for (let c = minC; c <= maxC; c++) line.push(cellKey(row, c));
        const directMatch = checkWordMatch(line);
        if (directMatch) {
          nextSelected = directMatch.cells;
        }
      } else if (sc === col && Math.abs(sr - row) >= 2) {
        const minR = Math.min(sr, row);
        const maxR = Math.max(sr, row);
        const line: string[] = [];
        for (let r = minR; r <= maxR; r++) line.push(cellKey(r, col));
        const directMatch = checkWordMatch(line);
        if (directMatch) {
          nextSelected = directMatch.cells;
        }
      }
    }

    const matchedWord = checkWordMatch(nextSelected);
    if (matchedWord) {
      const updatedFound = [...foundWords, matchedWord.word];
      setFoundWords(updatedFound);
      setSelectedCells([]);
      setHintTier(0);
      setHintMessage(null);
      setHintCells([]);

      if (updatedFound.length === placed.length) {
        playLevelCompleteSound(soundEnabled);
        setIsComplete(true);
        setStatusMessage(null);
        onCompleteLevel(level);
      } else {
        playMatchSound(soundEnabled);
        setStatusMessage(`Wonderful! You found "${matchedWord.word}".`);
      }
    } else {
      // Check if current selection could still be a prefix of any remaining word
      const remaining = placed.filter((p) => !foundWords.includes(p.word));
      const isPrefixOfAny = remaining.some((p) =>
        nextSelected.every((ck) => p.cells.includes(ck))
      );

      if (!isPrefixOfAny && nextSelected.length >= 2) {
        playGentleNudgeSound(soundEnabled);
        setSelectedCells([key]);
        setStatusMessage(
          'Those letters do not form a word on the list yet—starting a fresh selection from this letter.'
        );
      } else {
        setSelectedCells(nextSelected);
        setStatusMessage(null);
      }
    }
  };

  // 4-Tier Senior Hint System: 1=Direction, 2=Row/Col, 3=First Letter, 4=Full Word Highlight
  const handleRequestHint = () => {
    const remaining = placed.filter((p) => !foundWords.includes(p.word));
    if (remaining.length === 0) return;

    const target = remaining[0];
    const nextTier = Math.min(hintTier + 1, 4);
    setHintTier(nextTier);

    if (nextTier === 1) {
      setHintCells([]);
      setHintMessage(
        `Hint 1 of 4: Look for "${target.word}" reading ${
          target.direction === 'across' ? 'left to right (Across)' : 'top to bottom (Down)'
        }.`
      );
    } else if (nextTier === 2) {
      setHintCells([]);
      setHintMessage(
        `Hint 2 of 4: "${target.word}" is in ${
          target.direction === 'across'
            ? `Row ${target.row + 1} (counting from top)`
            : `Column ${target.col + 1} (counting from left)`
        }.`
      );
    } else if (nextTier === 3) {
      setHintCells([target.cells[0]]);
      setHintMessage(
        `Hint 3 of 4: The first letter "${target.word[0]}" of "${target.word}" is highlighted in gold.`
      );
    } else {
      setHintCells(target.cells);
      setHintMessage(
        `Hint 4 of 4: All letters of "${target.word}" are highlighted in gold—tap the first and last letter to collect it.`
      );
    }
  };

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level} (${theme}): Tap each letter of a word—or tap its first and last letter. Words read left-to-right or top-to-bottom only.`}
      progressText={`Words Found: ${foundWords.length} of ${placed.length}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={isComplete}
      completionSummary={`You found all ${placed.length} words in the "${theme}" puzzle.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Letter Grid */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div
            className="grid gap-1.5 sm:gap-2 p-3 sm:p-4 bg-canvas border border-sage-border rounded-xl"
            style={{
              gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((rowArr, rIdx) =>
              rowArr.map((letter, cIdx) => {
                const ck = cellKey(rIdx, cIdx);
                const isFound = foundCellSet.has(ck);
                const isSelected = selectedCells.includes(ck);
                const isHinted = hintCells.includes(ck) && !isFound;

                return (
                  <button
                    key={ck}
                    type="button"
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    aria-label={`Row ${rIdx + 1}, Column ${cIdx + 1}, letter ${letter}${
                      isFound ? ', found' : ''
                    }`}
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-lg border-2 text-lg sm:text-xl font-bold flex items-center justify-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sage-primary text-white border-sage-primary'
                        : isFound
                          ? 'bg-sage-mist text-sage-primary border-sage-primary'
                          : isHinted
                            ? 'bg-ochre-bg text-ochre-text border-ochre-text'
                            : 'bg-surface text-ink border-sage-border hover:bg-sage-mist'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>

          {selectedCells.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedCells([])}
              className="mt-4 text-sm font-semibold text-sage-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Clear current letter selection
            </button>
          )}
        </div>

        {/* Word Checklist */}
        <div className="lg:col-span-4 bg-canvas border border-sage-border rounded-xl p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-sage-primary">Theme: {theme}</p>
            <h2 className="font-serif text-xl font-semibold text-ink">Words to Find</h2>
          </div>

          <ul className="space-y-2.5">
            {placed.map((item) => {
              const found = foundWords.includes(item.word);
              return (
                <li
                  key={item.word}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border text-base font-semibold tracking-wide ${
                    found
                      ? 'bg-sage-mist border-sage-primary text-sage-primary line-through'
                      : 'bg-surface border-sage-border text-ink'
                  }`}
                >
                  <span>{item.word}</span>
                  {found && <Check className="w-5 h-5 shrink-0" aria-label="Found" />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </GameFrame>
  );
}
