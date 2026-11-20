import { GameId, ProgressStore, TextSize } from '../types';

const PROGRESS_KEY = 'mindharbor_game_progress_v1';
const TEXT_SIZE_KEY = 'mindharbor_text_size_v1';
const SOUND_KEY = 'mindharbor_sound_enabled_v1';

const ALL_GAME_IDS: GameId[] = [
  'picture-pairs',
  'word-search',
  'color-sequence',
  'category-sort',
  'spot-difference',
  'phrase-builder',
  'number-path',
  'daily-routine',
];

export function createEmptyProgressStore(): ProgressStore {
  const store = {} as ProgressStore;
  for (const id of ALL_GAME_IDS) {
    store[id] = {
      completedLevels: [],
      highestLevel: 0,
      sessionsCompleted: 0,
      lastPlayedAt: null,
    };
  }
  return store;
}

export function loadProgressStore(): ProgressStore {
  const fallback = createEmptyProgressStore();
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<ProgressStore>;
    const merged = { ...fallback };
    for (const id of ALL_GAME_IDS) {
      const entry = parsed[id];
      if (entry && Array.isArray(entry.completedLevels)) {
        const cleanLevels = Array.from(
          new Set(
            entry.completedLevels.filter(
              (lvl): lvl is number => typeof lvl === 'number' && lvl >= 1 && lvl <= 5
            )
          )
        ).sort((a, b) => a - b);
        merged[id] = {
          completedLevels: cleanLevels,
          highestLevel: cleanLevels.length > 0 ? Math.max(...cleanLevels) : 0,
          sessionsCompleted:
            typeof entry.sessionsCompleted === 'number' ? entry.sessionsCompleted : cleanLevels.length,
          lastPlayedAt: typeof entry.lastPlayedAt === 'string' ? entry.lastPlayedAt : null,
        };
      }
    }
    return merged;
  } catch {
    return fallback;
  }
}

export function saveProgressStore(store: ProgressStore): void {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota or private-mode restrictions safely
  }
}

export function recordLevelCompletion(
  store: ProgressStore,
  gameId: GameId,
  level: number
): ProgressStore {
  const current = store[gameId] ?? {
    completedLevels: [],
    highestLevel: 0,
    sessionsCompleted: 0,
    lastPlayedAt: null,
  };
  const updatedLevels = Array.from(new Set([...current.completedLevels, level])).sort(
    (a, b) => a - b
  );
  const nextStore: ProgressStore = {
    ...store,
    [gameId]: {
      completedLevels: updatedLevels,
      highestLevel: Math.max(current.highestLevel, level),
      sessionsCompleted: current.sessionsCompleted + 1,
      lastPlayedAt: new Date().toISOString(),
    },
  };
  return nextStore;
}

export function loadTextSize(): TextSize {
  try {
    const raw = window.localStorage.getItem(TEXT_SIZE_KEY);
    if (raw === 'standard' || raw === 'large' || raw === 'xlarge') {
      return raw;
    }
  } catch {
    // Ignore storage errors
  }
  return 'standard';
}

export function saveTextSize(size: TextSize): void {
  try {
    window.localStorage.setItem(TEXT_SIZE_KEY, size);
  } catch {
    // Ignore storage errors
  }
}

export function loadSoundEnabled(): boolean {
  try {
    const raw = window.localStorage.getItem(SOUND_KEY);
    if (raw === 'false') return false;
    if (raw === 'true') return true;
  } catch {
    // Ignore storage errors
  }
  return true;
}

export function saveSoundEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // Ignore storage errors
  }
}
