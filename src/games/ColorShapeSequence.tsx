import { useCallback, useEffect, useRef, useState } from 'react';
import { Circle, Diamond, Hexagon, Play, Square, Star, Triangle } from 'lucide-react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playSequenceNote,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface ColorShapeSequenceProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface SequencePad {
  id: number;
  label: string;
  Icon: typeof Circle;
  freq: number;
  idleClasses: string;
  activeClasses: string;
}

const ALL_PADS: SequencePad[] = [
  {
    id: 0,
    label: 'Sage Circle',
    Icon: Circle,
    freq: 329.63, // E4
    idleClasses: 'bg-[#E3EFE6] border-[#6F9C7E] text-[#1D422E]',
    activeClasses: 'bg-[#2F5D46] border-[#1D422E] text-white scale-[1.03]',
  },
  {
    id: 1,
    label: 'Amber Star',
    Icon: Star,
    freq: 392.0, // G4
    idleClasses: 'bg-[#FBF1DA] border-[#C79C4A] text-[#66410B]',
    activeClasses: 'bg-[#A86A14] border-[#66410B] text-white scale-[1.03]',
  },
  {
    id: 2,
    label: 'Slate Square',
    Icon: Square,
    freq: 440.0, // A4
    idleClasses: 'bg-[#E4ECF3] border-[#6F8FA9] text-[#1E3B52]',
    activeClasses: 'bg-[#2D587B] border-[#1E3B52] text-white scale-[1.03]',
  },
  {
    id: 3,
    label: 'Clay Diamond',
    Icon: Diamond,
    freq: 523.25, // C5
    idleClasses: 'bg-[#F5E7E1] border-[#BA7E68] text-[#632D1B]',
    activeClasses: 'bg-[#984A32] border-[#632D1B] text-white scale-[1.03]',
  },
  {
    id: 4,
    label: 'Moss Triangle',
    Icon: Triangle,
    freq: 587.33, // D5
    idleClasses: 'bg-[#E9EEDB] border-[#8B9D5B] text-[#354414]',
    activeClasses: 'bg-[#546B24] border-[#354414] text-white scale-[1.03]',
  },
  {
    id: 5,
    label: 'Plum Hexagon',
    Icon: Hexagon,
    freq: 659.25, // E5
    idleClasses: 'bg-[#EFE7F2] border-[#997AA6] text-[#452452]',
    activeClasses: 'bg-[#6B427C] border-[#452452] text-white scale-[1.03]',
  },
];

const LEVEL_CONFIG: Record<number, { padCount: number; length: number }> = {
  1: { padCount: 4, length: 2 },
  2: { padCount: 4, length: 3 },
  3: { padCount: 4, length: 4 },
  4: { padCount: 6, length: 5 },
  5: { padCount: 6, length: 6 },
};

function generateSequence(level: number): number[] {
  const { padCount, length } = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[1];
  const seq: number[] = [];
  for (let i = 0; i < length; i++) {
    let next = Math.floor(Math.random() * padCount);
    // Avoid immediate triple repeat for clarity
    if (i >= 1 && next === seq[i - 1]) {
      next = (next + 1) % padCount;
    }
    seq.push(next);
  }
  return seq;
}

export function ColorShapeSequence({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: ColorShapeSequenceProps) {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>(() => generateSequence(1));
  const [phase, setPhase] = useState<'ready' | 'watching' | 'input' | 'complete'>('ready');
  const [activePad, setActivePad] = useState<number | null>(null);
  const [userIndex, setUserIndex] = useState(0);
  const [hintPadId, setHintPadId] = useState<number | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    'Press "Watch Pattern" when you are ready to begin.'
  );

  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const playSequence = useCallback(
    (seqToPlay: number[]) => {
      clearTimers();
      setPhase('watching');
      setActivePad(null);
      setHintPadId(null);
      setHintMessage(null);
      setUserIndex(0);
      setStatusMessage('Watch carefully as each labeled shape lights up...');

      seqToPlay.forEach((padId, stepIdx) => {
        const startMs = 450 + stepIdx * 950;
        const t1 = window.setTimeout(() => {
          setActivePad(padId);
          playSequenceNote(soundEnabled, ALL_PADS[padId].freq);
        }, startMs);
        const t2 = window.setTimeout(() => {
          setActivePad(null);
        }, startMs + 600);
        timersRef.current.push(t1, t2);
      });

      const doneTimer = window.setTimeout(() => {
        setPhase('input');
        setStatusMessage('Now tap the shapes in the same order. You can replay anytime.');
      }, 450 + seqToPlay.length * 950 + 150);
      timersRef.current.push(doneTimer);
    },
    [clearTimers, soundEnabled]
  );

  const startLevel = useCallback(
    (targetLevel: number) => {
      clearTimers();
      const nextSeq = generateSequence(targetLevel);
      setLevel(targetLevel);
      setSequence(nextSeq);
      setPhase('ready');
      setActivePad(null);
      setUserIndex(0);
      setHintPadId(null);
      setHintMessage(null);
      setStatusMessage('Press "Watch Pattern" when you are ready to see the sequence.');
    },
    [clearTimers]
  );

  const handlePadTap = (pad: SequencePad) => {
    if (phase !== 'input') return;

    setActivePad(pad.id);
    const t = window.setTimeout(() => setActivePad(null), 260);
    timersRef.current.push(t);

    const expectedId = sequence[userIndex];
    if (pad.id === expectedId) {
      playSequenceNote(soundEnabled, pad.freq);
      setHintPadId(null);
      setHintMessage(null);
      const nextIdx = userIndex + 1;

      if (nextIdx >= sequence.length) {
        setUserIndex(nextIdx);
        setPhase('complete');
        setStatusMessage(null);
        playLevelCompleteSound(soundEnabled);
        onCompleteLevel(level);
      } else {
        setUserIndex(nextIdx);
        setStatusMessage(`Great! Step ${nextIdx} of ${sequence.length} matched.`);
      }
    } else {
      playGentleNudgeSound(soundEnabled);
      setStatusMessage(
        `That was ${pad.label}. Take a breath and try another tile—or press "Replay Pattern" anytime.`
      );
    }
  };

  const handleRequestHint = () => {
    if (phase === 'ready') {
      playSequence(sequence);
      return;
    }
    if (phase !== 'input') return;
    const expectedPad = ALL_PADS[sequence[userIndex]];
    if (expectedPad) {
      setHintPadId(expectedPad.id);
      setHintMessage(
        `Step ${userIndex + 1} is "${expectedPad.label}". We have marked it with a gold border for you.`
      );
    }
  };

  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[1];
  const visiblePads = ALL_PADS.slice(0, config.padCount);

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level}: Watch the ${config.length}-step pattern of shapes and gentle tones, then tap them back in the same order.`}
      progressText={`Steps Matched: ${userIndex} of ${sequence.length}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={phase === 'complete'}
      completionSummary={`You remembered all ${sequence.length} shapes in the exact order.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Watch / Replay Control */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => playSequence(sequence)}
            disabled={phase === 'watching'}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-sage-primary hover:bg-sage-hover disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-5 h-5" aria-hidden="true" />
            <span>
              {phase === 'watching'
                ? 'Showing Pattern...'
                : phase === 'ready'
                  ? 'Watch Pattern'
                  : 'Replay Pattern'}
            </span>
          </button>
        </div>

        {/* Shape Pads Grid */}
        <div
          className={`grid gap-4 ${
            config.padCount === 4 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {visiblePads.map((pad) => {
            const IconComponent = pad.Icon;
            const isLit = activePad === pad.id;
            const isHinted = hintPadId === pad.id && phase === 'input';

            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => handlePadTap(pad)}
                disabled={phase !== 'input'}
                className={`min-h-[124px] rounded-xl border-2 p-5 flex flex-col items-center justify-center gap-3 transition-transform duration-150 cursor-pointer disabled:cursor-default ${
                  isLit
                    ? pad.activeClasses
                    : isHinted
                      ? 'bg-ochre-bg border-ochre-text text-ochre-text'
                      : pad.idleClasses
                }`}
              >
                <IconComponent className="w-10 h-10" aria-hidden="true" />
                <span className="text-base font-semibold">{pad.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameFrame>
  );
}
