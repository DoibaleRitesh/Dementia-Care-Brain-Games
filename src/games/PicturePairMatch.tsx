import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Apple,
  BookOpen,
  Clock,
  CloudSun,
  Coffee,
  Flower2,
  Home,
  KeyRound,
  Leaf,
  Music,
  Umbrella,
  Watch,
} from 'lucide-react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playMatchSound,
  playTapSound,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface PicturePairMatchProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface CardSymbol {
  key: string;
  label: string;
  Icon: typeof Coffee;
}

const SYMBOLS: CardSymbol[] = [
  { key: 'tea', label: 'Tea Cup', Icon: Coffee },
  { key: 'flower', label: 'Flower', Icon: Flower2 },
  { key: 'apple', label: 'Apple', Icon: Apple },
  { key: 'book', label: 'Book', Icon: BookOpen },
  { key: 'sun', label: 'Sunshine', Icon: CloudSun },
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'leaf', label: 'Leaf', Icon: Leaf },
  { key: 'music', label: 'Music', Icon: Music },
  { key: 'umbrella', label: 'Umbrella', Icon: Umbrella },
  { key: 'clock', label: 'Clock', Icon: Clock },
  { key: 'key', label: 'House Key', Icon: KeyRound },
  { key: 'watch', label: 'Watch', Icon: Watch },
];

const LEVEL_PAIRS: Record<number, number> = {
  1: 3,
  2: 4,
  3: 6,
  4: 7,
  5: 8,
};

interface DeckCard {
  uid: string;
  symbolKey: string;
  label: string;
  Icon: typeof Coffee;
  matched: boolean;
}

function buildDeck(level: number): DeckCard[] {
  const pairCount = LEVEL_PAIRS[level] ?? 4;
  const chosen = SYMBOLS.slice(0, pairCount);
  const doubled: DeckCard[] = chosen.flatMap((sym) => [
    { uid: `${sym.key}-a`, symbolKey: sym.key, label: sym.label, Icon: sym.Icon, matched: false },
    { uid: `${sym.key}-b`, symbolKey: sym.key, label: sym.label, Icon: sym.Icon, matched: false },
  ]);
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export function PicturePairMatch({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: PicturePairMatchProps) {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<DeckCard[]>(() => buildDeck(1));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [hintIds, setHintIds] = useState<string[]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const startLevel = useCallback(
    (targetLevel: number) => {
      clearTimer();
      setLevel(targetLevel);
      setCards(buildDeck(targetLevel));
      setFlippedIds([]);
      setHintIds([]);
      setHintMessage(null);
      setStatusMessage(null);
      setMoves(0);
      setIsChecking(false);
      setIsComplete(false);
    },
    [clearTimer]
  );

  const handleCardClick = (card: DeckCard) => {
    if (isChecking || isComplete || card.matched || flippedIds.includes(card.uid)) return;

    playTapSound(soundEnabled);
    const nextFlipped = [...flippedIds, card.uid];
    setFlippedIds(nextFlipped);
    setHintMessage(null);
    setHintIds([]);

    if (nextFlipped.length === 2) {
      setIsChecking(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const firstCard = cards.find((c) => c.uid === firstId);
      const secondCard = cards.find((c) => c.uid === secondId);

      if (firstCard && secondCard && firstCard.symbolKey === secondCard.symbolKey) {
        const updatedCards = cards.map((c) =>
          c.uid === firstId || c.uid === secondId ? { ...c, matched: true } : c
        );
        const allMatched = updatedCards.every((c) => c.matched);

        timeoutRef.current = window.setTimeout(() => {
          setCards(updatedCards);
          setFlippedIds([]);
          setIsChecking(false);
          if (allMatched) {
            playLevelCompleteSound(soundEnabled);
            setIsComplete(true);
            setStatusMessage(null);
            onCompleteLevel(level);
          } else {
            playMatchSound(soundEnabled);
            setStatusMessage(`Matched "${firstCard.label}"! Take your time for the next pair.`);
          }
        }, 420);
      } else {
        playGentleNudgeSound(soundEnabled);
        setStatusMessage('Not a match yet—remember where each picture sits and try another pair.');
        timeoutRef.current = window.setTimeout(() => {
          setFlippedIds([]);
          setIsChecking(false);
        }, 1250);
      }
    }
  };

  const handleRequestHint = () => {
    const unmatched = cards.filter((c) => !c.matched);
    if (unmatched.length < 2) return;

    // If one card is already flipped, highlight its partner; otherwise pick an unmatched pair
    if (flippedIds.length === 1) {
      const openCard = cards.find((c) => c.uid === flippedIds[0]);
      const partner = openCard
        ? unmatched.find((c) => c.symbolKey === openCard.symbolKey && c.uid !== openCard.uid)
        : null;
      if (openCard && partner) {
        setHintIds([partner.uid]);
        setHintMessage(`The matching "${openCard.label}" card is highlighted in warm gold.`);
        return;
      }
    }

    const sample = unmatched[0];
    const partner = unmatched.find((c) => c.symbolKey === sample.symbolKey && c.uid !== sample.uid);
    if (partner) {
      setHintIds([sample.uid, partner.uid]);
      setHintMessage(`Look at the two gold-bordered cards—they both hide "${sample.label}".`);
    }
  };

  const matchedPairs = cards.filter((c) => c.matched).length / 2;
  const totalPairs = cards.length / 2;

  const gridCols =
    totalPairs <= 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : totalPairs <= 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-4';

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level}: Turn over two cards at a time to find all ${totalPairs} matching pairs. There is no timer—take all the time you like.`}
      progressText={`Pairs Found: ${matchedPairs} of ${totalPairs}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={isComplete}
      completionSummary={`You matched all ${totalPairs} pairs calmly in ${moves} turns.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div className={`grid ${gridCols} gap-4 max-w-3xl mx-auto`}>
        {cards.map((card, index) => {
          const isOpen = card.matched || flippedIds.includes(card.uid);
          const isHinted = hintIds.includes(card.uid) && !card.matched;
          const IconComponent = card.Icon;

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardClick(card)}
              disabled={card.matched || isChecking}
              aria-label={isOpen ? `${card.label} card${card.matched ? ', matched' : ''}` : `Hidden card ${index + 1}`}
              className={`min-h-[124px] sm:min-h-[136px] rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2.5 transition-transform duration-150 cursor-pointer ${
                card.matched
                  ? 'bg-sage-mist border-sage-primary text-sage-primary'
                  : isOpen
                    ? 'bg-surface border-sage-primary text-ink scale-[1.01]'
                    : isHinted
                      ? 'bg-ochre-bg border-ochre-text text-ochre-text'
                      : 'bg-sage-primary text-white border-sage-primary hover:bg-sage-hover'
              }`}
            >
              {isOpen ? (
                <>
                  <IconComponent className="w-9 h-9" aria-hidden="true" />
                  <span className="text-base font-semibold">{card.label}</span>
                </>
              ) : (
                <>
                  <span className="font-serif text-2xl font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium">
                    {isHinted ? 'Hint Card' : 'Tap to Reveal'}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </GameFrame>
  );
}
