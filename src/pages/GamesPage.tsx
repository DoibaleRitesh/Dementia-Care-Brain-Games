import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Grid2x2,
  Layers,
  ListOrdered,
  MessageSquareQuote,
  RotateCcw,
  ScanEye,
  Search,
  Shapes,
} from 'lucide-react';
import { GAMES_META, getGameMeta } from '../data/gamesMeta';
import { ColorShapeSequence } from '../games/ColorShapeSequence';
import { DailyRoutineSequencer } from '../games/DailyRoutineSequencer';
import { EverydayCategorySort } from '../games/EverydayCategorySort';
import { FamiliarPhraseBuilder } from '../games/FamiliarPhraseBuilder';
import { GentleWordSearch } from '../games/GentleWordSearch';
import { NumberPathOrder } from '../games/NumberPathOrder';
import { PicturePairMatch } from '../games/PicturePairMatch';
import { SpotDifferentTile } from '../games/SpotDifferentTile';
import { CognitiveSkill, GameId, ProgressStore } from '../types';

interface GamesPageProps {
  activeGameId: GameId | null;
  progress: ProgressStore;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectGame: (gameId: GameId | null) => void;
  onCompleteLevel: (gameId: GameId, level: number) => void;
  onResetAllProgress: () => void;
  onNavigateResearch: () => void;
}

type SkillFilter = 'All Games' | CognitiveSkill;

const SKILL_FILTERS: SkillFilter[] = ['All Games', 'Memory', 'Language', 'Attention', 'Logic'];

const GAME_ICONS: Record<GameId, typeof Grid2x2> = {
  'picture-pairs': Grid2x2,
  'word-search': Search,
  'color-sequence': Shapes,
  'category-sort': Layers,
  'spot-difference': ScanEye,
  'phrase-builder': MessageSquareQuote,
  'number-path': ListOrdered,
  'daily-routine': Check,
};

export function GamesPage({
  activeGameId,
  progress,
  soundEnabled,
  onToggleSound,
  onSelectGame,
  onCompleteLevel,
  onResetAllProgress,
  onNavigateResearch,
}: GamesPageProps) {
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('All Games');
  const [confirmReset, setConfirmReset] = useState(false);

  // Active Game View
  if (activeGameId) {
    const meta = getGameMeta(activeGameId);
    if (meta) {
      const completedLevels = progress[activeGameId]?.completedLevels ?? [];
      const sharedProps = {
        meta,
        completedLevels,
        soundEnabled,
        onToggleSound,
        onCompleteLevel: (lvl: number) => onCompleteLevel(activeGameId, lvl),
        onBackToHub: () => onSelectGame(null),
      };

      return (
        <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
          {activeGameId === 'picture-pairs' && <PicturePairMatch {...sharedProps} />}
          {activeGameId === 'word-search' && <GentleWordSearch {...sharedProps} />}
          {activeGameId === 'color-sequence' && <ColorShapeSequence {...sharedProps} />}
          {activeGameId === 'category-sort' && <EverydayCategorySort {...sharedProps} />}
          {activeGameId === 'spot-difference' && <SpotDifferentTile {...sharedProps} />}
          {activeGameId === 'phrase-builder' && <FamiliarPhraseBuilder {...sharedProps} />}
          {activeGameId === 'number-path' && <NumberPathOrder {...sharedProps} />}
          {activeGameId === 'daily-routine' && <DailyRoutineSequencer {...sharedProps} />}
        </main>
      );
    }
  }

  // Games Hub Summary Metrics
  const totalPossibleLevels = GAMES_META.reduce((acc, g) => acc + g.totalLevels, 0);
  const completedLevelsTotal = GAMES_META.reduce(
    (acc, g) => acc + (progress[g.id]?.completedLevels.length ?? 0),
    0
  );
  const gamesStarted = GAMES_META.filter(
    (g) => (progress[g.id]?.completedLevels.length ?? 0) > 0
  ).length;
  const totalSessions = GAMES_META.reduce(
    (acc, g) => acc + (progress[g.id]?.sessionsCompleted ?? 0),
    0
  );

  const visibleGames =
    skillFilter === 'All Games'
      ? GAMES_META
      : GAMES_META.filter((g) => g.skill === skillFilter);

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <p className="text-sm font-semibold text-sage-primary">
          8 Cognitive Games · 5 Levels Each · Untimed &amp; Encouraging
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.15]">
          Calm brain games for daily memory &amp; focus
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed">
          Choose any activity below to play at your own pace. Every game includes five progressive
          levels, large readable buttons, and helpful hints whenever you want a gentle nudge.
        </p>
      </section>

      {/* Local Progress Overview Bar */}
      <section
        aria-label="Your Saved Progress"
        className="bg-surface border border-sage-border rounded-xl p-6 space-y-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
            <div>
              <p className="text-sm text-ink-muted">Levels Completed</p>
              <p className="font-serif text-3xl font-semibold text-ink tabular-nums">
                {completedLevelsTotal} <span className="text-lg font-normal text-ink-muted">/ {totalPossibleLevels}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">Games Explored</p>
              <p className="font-serif text-3xl font-semibold text-ink tabular-nums">
                {gamesStarted} <span className="text-lg font-normal text-ink-muted">/ {GAMES_META.length}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">Completed Rounds</p>
              <p className="font-serif text-3xl font-semibold text-ink tabular-nums">
                {totalSessions}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                disabled={completedLevelsTotal === 0 && totalSessions === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-muted bg-canvas border border-sage-border hover:text-ink hover:bg-sage-mist disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-default"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset Saved Progress</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2 bg-ochre-bg border border-ochre-border rounded-lg p-2.5">
                <span className="text-sm font-medium text-ochre-text px-1">
                  Clear local progress?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllProgress();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-md cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 text-sm font-semibold text-ink bg-surface border border-sage-border hover:bg-canvas rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clean Progress Track */}
        <div className="w-full h-2.5 bg-canvas border border-sage-border rounded-full overflow-hidden">
          <div
            className="h-full bg-sage-primary transition-all duration-200"
            style={{
              width: `${Math.round((completedLevelsTotal / totalPossibleLevels) * 100)}%`,
            }}
          />
        </div>
      </section>

      {/* Skill Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter games by cognitive skill"
          className="flex flex-wrap items-center gap-2"
        >
          {SKILL_FILTERS.map((skill) => {
            const isSelected = skillFilter === skill;
            return (
              <button
                key={skill}
                type="button"
                onClick={() => setSkillFilter(skill)}
                aria-pressed={isSelected}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-sage-primary text-white border-sage-primary'
                    : 'bg-surface text-ink-muted border-sage-border hover:text-ink hover:bg-sage-mist'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-ink-muted tabular-nums">
          Showing {visibleGames.length} of {GAMES_META.length} activities
        </p>
      </div>

      {/* 8 Game Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Available Brain Games">
        {visibleGames.map((game) => {
          const IconComp = GAME_ICONS[game.id];
          const entry = progress[game.id];
          const doneCount = entry?.completedLevels.length ?? 0;

          return (
            <article
              key={game.id}
              className="bg-surface border border-sage-border rounded-xl p-6 sm:p-7 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-sm text-ink-muted tabular-nums">
                      <span className="font-semibold text-sage-primary">{game.skill}</span>
                      <span className="mx-2" aria-hidden="true">
                        ·
                      </span>
                      <span>{game.totalLevels} Levels</span>
                      <span className="mx-2" aria-hidden="true">
                        ·
                      </span>
                      <span>{game.estimatedTime}</span>
                    </p>
                    <h2 className="font-serif text-2xl font-semibold text-ink">{game.title}</h2>
                  </div>

                  <div className="w-11 h-11 rounded-lg bg-sage-mist border border-sage-border flex items-center justify-center text-sage-primary shrink-0">
                    <IconComp className="w-6 h-6" aria-hidden="true" />
                  </div>
                </div>

                <p className="text-base text-ink leading-relaxed">{game.description}</p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  <strong className="text-ink">How it helps:</strong> {game.cognitiveBenefit}
                </p>
              </div>

              <div className="pt-4 border-t border-sage-border flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink tabular-nums">
                    {doneCount === game.totalLevels
                      ? 'All 5 levels completed'
                      : `${doneCount} of ${game.totalLevels} levels completed`}
                  </p>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const done = entry?.completedLevels.includes(lvl);
                      return (
                        <span
                          key={lvl}
                          className={`w-6 h-2 rounded-sm ${
                            done ? 'bg-sage-primary' : 'bg-sage-soft'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectGame(game.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{doneCount > 0 ? 'Continue Playing' : 'Play Game'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Bottom Link to Research Page */}
      <section className="bg-sage-mist border border-sage-strong rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-semibold text-ink">
            Curious about the science behind these games?
          </h3>
          <p className="text-base text-ink-muted">
            Read eight peer-reviewed clinical studies explaining how structured mental activities
            support memory and everyday confidence.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateResearch}
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-sage-primary bg-surface border border-sage-strong hover:bg-canvas rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>Explore Research Papers</span>
        </button>
      </section>
    </main>
  );
}
