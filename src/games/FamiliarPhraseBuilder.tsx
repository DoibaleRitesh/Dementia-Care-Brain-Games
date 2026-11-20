import { useCallback, useState } from 'react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playMatchSound,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface FamiliarPhraseBuilderProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface PhrasePrompt {
  before: string;
  after: string;
  answer: string;
  choices: string[];
  clue: string;
}

const PHRASE_LEVELS: Record<number, PhrasePrompt[]> = {
  1: [
    {
      before: 'Bread and',
      after: '',
      answer: 'Butter',
      choices: ['Butter', 'Window'],
      clue: 'A classic golden spread for warm toast.',
    },
    {
      before: 'Salt and',
      after: '',
      answer: 'Pepper',
      choices: ['Pillow', 'Pepper'],
      clue: 'The two shakers that sit together on the dinner table.',
    },
    {
      before: 'Cup and',
      after: '',
      answer: 'Saucer',
      choices: ['Saucer', 'Ladder'],
      clue: 'The small dish that rests underneath a teacup.',
    },
    {
      before: 'Rain or',
      after: '',
      answer: 'Shine',
      choices: ['Chair', 'Shine'],
      clue: 'Means no matter what the weather brings.',
    },
  ],
  2: [
    {
      before: 'Home sweet',
      after: '',
      answer: 'Home',
      choices: ['Home', 'River', 'Garden'],
      clue: 'A warm expression about returning to your own cozy place.',
    },
    {
      before: 'Early to bed and early to',
      after: '',
      answer: 'Rise',
      choices: ['Walk', 'Rise', 'Sing'],
      clue: 'Means waking up fresh in the morning.',
    },
    {
      before: 'Better late than',
      after: '',
      answer: 'Never',
      choices: ['Never', 'Always', 'Quiet'],
      clue: 'Encourages doing something good even if it took a little extra time.',
    },
    {
      before: 'Good as',
      after: '',
      answer: 'Gold',
      choices: ['Silver', 'Wood', 'Gold'],
      clue: 'Describes something precious, kind, and dependable.',
    },
  ],
  3: [
    {
      before: 'A stitch in time saves',
      after: '',
      answer: 'Nine',
      choices: ['Five', 'Nine', 'Twelve'],
      clue: 'It rhymes with "time" and is a single-digit number.',
    },
    {
      before: 'Actions speak louder than',
      after: '',
      answer: 'Words',
      choices: ['Bells', 'Songs', 'Words'],
      clue: 'What we do shows more than what we simply say.',
    },
    {
      before: 'Every cloud has a silver',
      after: '',
      answer: 'Lining',
      choices: ['Lining', 'Ribbon', 'Window'],
      clue: 'The bright edge along the inside of a raincloud.',
    },
    {
      before: 'Laughter is the best',
      after: '',
      answer: 'Medicine',
      choices: ['Weather', 'Medicine', 'Journey'],
      clue: 'Something that helps lift spirits and heal the heart.',
    },
  ],
  4: [
    {
      before: 'An apple a day keeps the',
      after: 'away',
      answer: 'Doctor',
      choices: ['Winter', 'Doctor', 'Neighbor', 'Rain'],
      clue: 'The person you visit for a health check-up.',
    },
    {
      before: 'Slow and steady wins the',
      after: '',
      answer: 'Race',
      choices: ['Race', 'Song', 'Meal', 'Game'],
      clue: 'The famous lesson from the Tortoise and the Hare.',
    },
    {
      before: 'Birds of a feather',
      after: 'together',
      answer: 'Flock',
      choices: ['Swim', 'Flock', 'Climb', 'Paint'],
      clue: 'The word for a group of birds flying or gathering together.',
    },
    {
      before: 'Make hay while the',
      after: 'shines',
      answer: 'Sun',
      choices: ['Moon', 'Lamp', 'Sun', 'Candle'],
      clue: 'Farmers dry hay during bright, warm daytime weather.',
    },
  ],
  5: [
    {
      before: 'A penny saved is a penny',
      after: '',
      answer: 'Earned',
      choices: ['Found', 'Earned', 'Borrowed', 'Hidden'],
      clue: 'Keeping money wisely is just as valuable as working for it.',
    },
    {
      before: 'Where there is a will, there is a',
      after: '',
      answer: 'Way',
      choices: ['Road', 'Bridge', 'Way', 'Door'],
      clue: 'A short three-letter word meaning a path forward.',
    },
    {
      before: 'Still waters run',
      after: '',
      answer: 'Deep',
      choices: ['Fast', 'Wide', 'Cold', 'Deep'],
      clue: 'Quiet people often hold calm wisdom beneath the surface.',
    },
    {
      before: 'You cannot judge a',
      after: 'by its cover',
      answer: 'Book',
      choices: ['Letter', 'Book', 'Parcel', 'Journal'],
      clue: 'You open its pages to read a story.',
    },
  ],
};

export function FamiliarPhraseBuilder({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: FamiliarPhraseBuilderProps) {
  const [level, setLevel] = useState(1);
  const [promptIdx, setPromptIdx] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const prompts = PHRASE_LEVELS[level] ?? PHRASE_LEVELS[1];
  const currentPrompt = prompts[promptIdx] ?? prompts[0];

  const startLevel = useCallback((targetLevel: number) => {
    setLevel(targetLevel);
    setPromptIdx(0);
    setHintLevel(0);
    setHintMessage(null);
    setStatusMessage(null);
    setIsComplete(false);
  }, []);

  const handleChooseWord = (word: string) => {
    if (isComplete) return;

    if (word === currentPrompt.answer) {
      setHintLevel(0);
      setHintMessage(null);
      const completedSentence = `${currentPrompt.before} ${currentPrompt.answer}${
        currentPrompt.after ? ` ${currentPrompt.after}` : ''
      }.`;

      if (promptIdx + 1 >= prompts.length) {
        playLevelCompleteSound(soundEnabled);
        setIsComplete(true);
        setStatusMessage(null);
        onCompleteLevel(level);
      } else {
        playMatchSound(soundEnabled);
        setPromptIdx((idx) => idx + 1);
        setStatusMessage(`Lovely! "${completedSentence}"`);
      }
    } else {
      playGentleNudgeSound(soundEnabled);
      setStatusMessage(`"${word}" doesn't quite fit this familiar saying—try another word below.`);
    }
  };

  const handleRequestHint = () => {
    const nextHint = Math.min(hintLevel + 1, 2);
    setHintLevel(nextHint);
    if (nextHint === 1) {
      setHintMessage(currentPrompt.clue);
    } else {
      setHintMessage(
        `${currentPrompt.clue} The word starts with "${currentPrompt.answer[0]}" and is highlighted in gold.`
      );
    }
  };

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level}: Read the familiar saying below and tap the word that completes it naturally.`}
      progressText={`Phrase ${Math.min(promptIdx + 1, prompts.length)} of ${prompts.length}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={isComplete}
      completionSummary={`You completed all ${prompts.length} familiar phrases in Level ${level}.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Phrase Display Card */}
        <div className="bg-sage-mist border border-sage-strong rounded-xl p-8 sm:p-10 text-center">
          <p className="font-serif text-2xl sm:text-3xl font-semibold text-ink leading-relaxed">
            <span>“{currentPrompt.before} </span>
            <span className="inline-block min-w-[120px] border-b-2 border-sage-primary text-sage-primary px-2">
              _____
            </span>
            {currentPrompt.after ? <span> {currentPrompt.after}</span> : null}
            <span>”</span>
          </p>
        </div>

        {/* Word Choices */}
        <div
          className={`grid gap-4 ${
            currentPrompt.choices.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {currentPrompt.choices.map((choice) => {
            const isGoldHint = hintLevel >= 2 && choice === currentPrompt.answer;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleChooseWord(choice)}
                className={`min-h-[68px] px-6 py-4 text-xl font-semibold rounded-xl border-2 transition-colors cursor-pointer ${
                  isGoldHint
                    ? 'bg-ochre-bg border-ochre-text text-ochre-text'
                    : 'bg-surface border-sage-strong text-ink hover:bg-sage-mist hover:border-sage-primary'
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>
    </GameFrame>
  );
}
