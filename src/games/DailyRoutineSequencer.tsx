import { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playMatchSound,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface DailyRoutineSequencerProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface RoutineStep {
  id: string;
  order: number;
  text: string;
}

interface RoutineLevel {
  title: string;
  steps: RoutineStep[];
}

const ROUTINE_LEVELS: Record<number, RoutineLevel> = {
  1: {
    title: 'Making a Cup of Morning Tea',
    steps: [
      { id: 'tea-1', order: 1, text: 'Fill the kettle with fresh water and warm it up' },
      { id: 'tea-2', order: 2, text: 'Place a tea bag in your favorite mug and pour in hot water' },
      { id: 'tea-3', order: 3, text: 'Let it steep gently, then sit down and enjoy your warm tea' },
    ],
  },
  2: {
    title: 'Planting a Flower in a Pot',
    steps: [
      { id: 'plant-1', order: 1, text: 'Fill a clean flower pot with soft garden soil' },
      { id: 'plant-2', order: 2, text: 'Make a small hollow in the soil and tuck the seeds inside' },
      { id: 'plant-3', order: 3, text: 'Sprinkle gentle water over the soil with a watering can' },
      { id: 'plant-4', order: 4, text: 'Place the pot on a bright sunny windowsill to grow' },
    ],
  },
  3: {
    title: 'Getting Ready for a Morning Walk',
    steps: [
      { id: 'walk-1', order: 1, text: 'Look out the window to check the weather' },
      { id: 'walk-2', order: 2, text: 'Put on comfortable walking shoes and a light jacket' },
      { id: 'walk-3', order: 3, text: 'Pick up your house keys and lock the front door' },
      { id: 'walk-4', order: 4, text: 'Enjoy a peaceful stroll along the neighborhood path' },
    ],
  },
  4: {
    title: 'Writing and Mailing a Letter to a Friend',
    steps: [
      { id: 'mail-1', order: 1, text: 'Write a warm note on clean stationery with a pen' },
      { id: 'mail-2', order: 2, text: 'Fold the letter neatly and slip it into an envelope' },
      { id: 'mail-3', order: 3, text: 'Write your friend’s name and address on the front' },
      { id: 'mail-4', order: 4, text: 'Place a postage stamp in the top-right corner' },
      { id: 'mail-5', order: 5, text: 'Drop the sealed letter into the neighborhood mailbox' },
    ],
  },
  5: {
    title: 'Baking Warm Homemade Bread',
    steps: [
      { id: 'bake-1', order: 1, text: 'Measure flour, warm water, yeast, and a pinch of salt into a bowl' },
      { id: 'bake-2', order: 2, text: 'Stir and knead the dough until it feels smooth and soft' },
      { id: 'bake-3', order: 3, text: 'Cover the bowl with a clean towel and let the dough rise' },
      { id: 'bake-4', order: 4, text: 'Bake the loaf in the warm oven until the crust turns golden' },
      { id: 'bake-5', order: 5, text: 'Let the loaf cool slightly, slice it, and enjoy with butter' },
    ],
  },
};

function shuffleSteps(steps: RoutineStep[]): RoutineStep[] {
  const copy = [...steps];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // Ensure it's not already in exact sorted order
  if (copy.every((s, idx) => s.order === idx + 1) && copy.length >= 2) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

export function DailyRoutineSequencer({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: DailyRoutineSequencerProps) {
  const [level, setLevel] = useState(1);
  const currentRoutine = ROUTINE_LEVELS[level] ?? ROUTINE_LEVELS[1];

  const [shuffledOptions, setShuffledOptions] = useState<RoutineStep[]>(() =>
    shuffleSteps(ROUTINE_LEVELS[1].steps)
  );
  const [placedSteps, setPlacedSteps] = useState<RoutineStep[]>([]);
  const [hintStepId, setHintStepId] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startLevel = useCallback((targetLevel: number) => {
    const nextRoutine = ROUTINE_LEVELS[targetLevel] ?? ROUTINE_LEVELS[1];
    setLevel(targetLevel);
    setShuffledOptions(shuffleSteps(nextRoutine.steps));
    setPlacedSteps([]);
    setHintStepId(null);
    setHintMessage(null);
    setStatusMessage(null);
    setIsComplete(false);
  }, []);

  const nextExpectedOrder = placedSteps.length + 1;

  const handleSelectStep = (step: RoutineStep) => {
    if (isComplete) return;

    if (step.order === nextExpectedOrder) {
      const updatedPlaced = [...placedSteps, step];
      setPlacedSteps(updatedPlaced);
      setHintStepId(null);
      setHintMessage(null);

      if (updatedPlaced.length === currentRoutine.steps.length) {
        playLevelCompleteSound(soundEnabled);
        setIsComplete(true);
        setStatusMessage(null);
        onCompleteLevel(level);
      } else {
        playMatchSound(soundEnabled);
        setStatusMessage(
          `Step ${step.order} placed! Now choose what happens next (Step ${step.order + 1}).`
        );
      }
    } else {
      playGentleNudgeSound(soundEnabled);
      setStatusMessage(
        `That step comes a little later in the routine. Think about what we do first for Step ${nextExpectedOrder}.`
      );
    }
  };

  const handleRequestHint = () => {
    const targetStep = currentRoutine.steps.find((s) => s.order === nextExpectedOrder);
    if (targetStep) {
      setHintStepId(targetStep.id);
      setHintMessage(
        `For Step ${nextExpectedOrder}, look for the gold-highlighted card: "${targetStep.text}".`
      );
    }
  };

  const remainingOptions = shuffledOptions.filter(
    (opt) => !placedSteps.some((p) => p.id === opt.id)
  );

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level} (${currentRoutine.title}): Tap each everyday step in the natural order from Step 1 to Step ${currentRoutine.steps.length}.`}
      progressText={`Steps Ordered: ${placedSteps.length} of ${currentRoutine.steps.length}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={isComplete}
      completionSummary={`You arranged every step of "${currentRoutine.title}" in the exact natural order.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ordered Routine Slots */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Routine Order: {currentRoutine.title}
          </h2>
          <ol className="space-y-3">
            {currentRoutine.steps.map((_, idx) => {
              const stepNumber = idx + 1;
              const placed = placedSteps[idx];
              const isNextSlot = stepNumber === nextExpectedOrder;

              return (
                <li
                  key={stepNumber}
                  className={`rounded-xl border-2 px-5 py-4 flex items-start gap-4 ${
                    placed
                      ? 'bg-sage-mist border-sage-primary text-ink'
                      : isNextSlot
                        ? 'bg-surface border-sage-primary text-ink'
                        : 'bg-canvas border-sage-border text-ink-muted'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 tabular-nums ${
                      placed
                        ? 'bg-sage-primary text-white'
                        : isNextSlot
                          ? 'bg-sage-mist text-sage-primary border border-sage-primary'
                          : 'bg-surface text-ink-muted border border-sage-border'
                    }`}
                  >
                    {placed ? <Check className="w-4 h-4" aria-hidden="true" /> : stepNumber}
                  </span>
                  <div className="pt-0.5 text-base leading-relaxed">
                    {placed ? (
                      <span className="font-medium text-ink">{placed.text}</span>
                    ) : isNextSlot ? (
                      <span className="font-semibold text-sage-primary">
                        Choose Step {stepNumber} from the cards →
                      </span>
                    ) : (
                      <span>Waiting for Step {stepNumber}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Available Step Cards */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Tap the Card for Step {nextExpectedOrder}
          </h2>
          <div className="space-y-3">
            {remainingOptions.map((step) => {
              const isHinted = hintStepId === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleSelectStep(step)}
                  className={`w-full text-left rounded-xl border-2 px-5 py-4 text-base font-medium leading-relaxed transition-colors cursor-pointer ${
                    isHinted
                      ? 'bg-ochre-bg border-ochre-text text-ochre-text'
                      : 'bg-surface border-sage-strong text-ink hover:bg-sage-mist hover:border-sage-primary'
                  }`}
                >
                  {step.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameFrame>
  );
}
