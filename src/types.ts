export type PageId = 'home' | 'research' | 'games';

export type TextSize = 'standard' | 'large' | 'xlarge';

export type CognitiveSkill = 'Memory' | 'Language' | 'Attention' | 'Logic';

export type GameId =
  | 'picture-pairs'
  | 'word-search'
  | 'color-sequence'
  | 'category-sort'
  | 'spot-difference'
  | 'phrase-builder'
  | 'number-path'
  | 'daily-routine';

export interface GameProgressEntry {
  completedLevels: number[];
  highestLevel: number;
  sessionsCompleted: number;
  lastPlayedAt: string | null;
}

export type ProgressStore = Record<GameId, GameProgressEntry>;

export interface GameMeta {
  id: GameId;
  title: string;
  subtitle: string;
  skill: CognitiveSkill;
  totalLevels: number;
  estimatedTime: string;
  description: string;
  cognitiveBenefit: string;
}

export type ResearchCategory =
  | 'All Studies'
  | 'Cognitive Stimulation'
  | 'Memory & Attention'
  | 'Multidomain Care'
  | 'Systematic Reviews';

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  studyType: string;
  category: Exclude<ResearchCategory, 'All Studies'>;
  sampleNote: string;
  doi: string;
  plainSummary: string;
  clinicalFindings: string;
  caregiverTakeaway: string;
  relatedGameIds: GameId[];
}
