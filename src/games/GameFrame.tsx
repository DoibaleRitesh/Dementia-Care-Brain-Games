import { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GameMeta } from '../types';

interface GameFrameProps {
  meta: GameMeta;
  level: number;
  completedLevels: number[];
  instruction: string;
  progressText: string;
  hintMessage: string | null;
  statusMessage?: string | null;
  isLevelComplete: boolean;
  completionSummary?: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectLevel: (level: number) => void;
  onRequestHint: () => void;
  onResetLevel: () => void;
  onBackToHub: () => void;
  children: ReactNode;
}

export function GameFrame({
  meta,
  level,
  completedLevels,
  instruction,
  progressText,
  hintMessage,
  statusMessage,
  isLevelComplete,
  completionSummary,
  soundEnabled,
  onToggleSound,
  onSelectLevel,
  onRequestHint,
  onResetLevel,
  onBackToHub,
  children,
}: GameFrameProps) {
  const levels = Array.from({ length: meta.totalLevels }, (_, idx) => idx + 1);
  const hasNextLevel = level < meta.totalLevels;

  return (
    <div className="space-y-6">
      {/* Top Return & Audio Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink bg-surface border border-sage-border hover:bg-sage-mist rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to All Games</span>
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink bg-surface border border-sage-border hover:bg-sage-mist rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-sage-primary" aria-hidden="true" />
              <span>Gentle Sounds: On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              <span>Gentle Sounds: Off</span>
            </>
          )}
        </button>
      </div>

      {/* Main Solid Game Card */}
      <section className="bg-surface border border-sage-border rounded-xl p-6 sm:p-8 space-y-6">
        {/* Title & Metadata */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-sage-border">
          <div className="space-y-1.5">
            <p className="text-sm text-ink-muted tabular-nums">
              <span className="font-semibold text-sage-primary">{meta.skill}</span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>{meta.subtitle}</span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>Untimed</span>
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink">
              {meta.title}
            </h1>
          </div>

          <div className="text-base font-semibold text-sage-primary tabular-nums">
            {progressText}
          </div>
        </div>

        {/* Level Switcher + Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Select game level">
            <span className="text-sm font-semibold text-ink mr-1">Level:</span>
            {levels.map((lvl) => {
              const isCurrent = lvl === level;
              const isDone = completedLevels.includes(lvl);
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onSelectLevel(lvl)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`inline-flex items-center justify-center gap-1.5 min-w-[48px] h-11 px-3.5 text-sm font-semibold rounded-lg border transition-colors tabular-nums whitespace-nowrap shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-sage-primary text-white border-sage-primary'
                      : isDone
                        ? 'bg-sage-mist text-sage-primary border-sage-strong hover:bg-sage-soft'
                        : 'bg-canvas text-ink border-sage-border hover:bg-sage-mist'
                  }`}
                >
                  <span>{lvl}</span>
                  {isDone && <Check className="w-4 h-4" aria-label="Completed" />}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isLevelComplete && (
              <button
                type="button"
                onClick={onRequestHint}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ochre-text bg-ochre-bg border border-ochre-border hover:bg-[#f5e7cb] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" aria-hidden="true" />
                <span>Ask for a Hint</span>
              </button>
            )}

            <button
              type="button"
              onClick={onResetLevel}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink bg-canvas border border-sage-border hover:bg-sage-mist rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Restart Level</span>
            </button>
          </div>
        </div>

        {/* Instruction Strip */}
        <div className="bg-canvas border border-sage-border rounded-lg px-5 py-4 text-base text-ink leading-relaxed">
          {instruction}
        </div>

        {/* Encouraging Hint Banner */}
        {hintMessage && !isLevelComplete && (
          <div
            role="status"
            aria-live="polite"
            className="bg-ochre-bg border border-ochre-border rounded-lg px-5 py-3.5 text-base text-ochre-text"
          >
            <strong>Helpful Hint:</strong> {hintMessage}
          </div>
        )}

        {/* Calm Status Feedback Banner */}
        {statusMessage && !isLevelComplete && (
          <div
            role="status"
            aria-live="polite"
            className="bg-sage-mist border border-sage-strong rounded-lg px-5 py-3 text-base text-ink font-medium"
          >
            {statusMessage}
          </div>
        )}

        {/* Level Complete View OR Active Game Stage */}
        {isLevelComplete ? (
          <div
            role="status"
            aria-live="polite"
            className="bg-sage-mist border border-sage-strong rounded-xl p-8 sm:p-10 text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage-primary text-white mx-auto">
              <Check className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-ink">
                Well done! Level {level} complete
              </h2>
              <p className="text-base sm:text-lg text-ink-muted">
                {completionSummary ??
                  'You took your time and finished this level calmly. Your progress has been saved.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {hasNextLevel && (
                <button
                  type="button"
                  onClick={() => onSelectLevel(level + 1)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Continue to Level {level + 1}</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={onResetLevel}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-sage-primary bg-surface border border-sage-strong hover:bg-canvas rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Play Level {level} Again</span>
              </button>
              <button
                type="button"
                onClick={onBackToHub}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-ink bg-surface border border-sage-border hover:bg-canvas rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Choose Another Game</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2">{children}</div>
        )}
      </section>
    </div>
  );
}
