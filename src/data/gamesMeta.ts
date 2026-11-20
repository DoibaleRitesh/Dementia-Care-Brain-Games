import { GameMeta } from '../types';

export const GAMES_META: GameMeta[] = [
  {
    id: 'picture-pairs',
    title: 'Picture Pair Match',
    subtitle: 'Visual & Short-Term Memory',
    skill: 'Memory',
    totalLevels: 5,
    estimatedTime: '2 to 4 min',
    description:
      'Turn over two cards at a time to find matching everyday pictures and words. Cards stay visible as long as you need.',
    cognitiveBenefit:
      'Exercises short-term visual recall, spatial memory, and object recognition at a relaxed pace.',
  },
  {
    id: 'word-search',
    title: 'Gentle Word Search',
    subtitle: 'Language & Visual Scanning',
    skill: 'Language',
    totalLevels: 5,
    estimatedTime: '3 to 6 min',
    description:
      'Find warm everyday words placed clearly left-to-right or top-to-bottom in a large-letter grid, supported by 4-step hints.',
    cognitiveBenefit:
      'Supports vocabulary retrieval, letter recognition, and calm focused visual scanning.',
  },
  {
    id: 'color-sequence',
    title: 'Color & Shape Sequence',
    subtitle: 'Working Memory & Patterns',
    skill: 'Memory',
    totalLevels: 5,
    estimatedTime: '2 to 4 min',
    description:
      'Watch a calm sequence of labeled shapes light up with gentle tones, then tap them back in the same order.',
    cognitiveBenefit:
      'Strengthens working memory span, sequential recall, and auditory-visual attention.',
  },
  {
    id: 'category-sort',
    title: 'Everyday Category Sort',
    subtitle: 'Semantic Memory & Grouping',
    skill: 'Logic',
    totalLevels: 5,
    estimatedTime: '2 to 5 min',
    description:
      'Sort familiar household, garden, and wardrobe items into clearly labeled baskets with gentle guidance.',
    cognitiveBenefit:
      'Maintains semantic memory networks and everyday object-to-category associations.',
  },
  {
    id: 'spot-difference',
    title: 'Spot the Different Tile',
    subtitle: 'Visual Attention & Focus',
    skill: 'Attention',
    totalLevels: 5,
    estimatedTime: '2 to 4 min',
    description:
      'Look across a tidy grid of tiles and tap the one tile that shows a different symbol or pattern from the rest.',
    cognitiveBenefit:
      'Sharpens visual discrimination, sustained attention, and detail recognition without time pressure.',
  },
  {
    id: 'phrase-builder',
    title: 'Familiar Phrase Builder',
    subtitle: 'Verbal Recall & Reminiscence',
    skill: 'Language',
    totalLevels: 5,
    estimatedTime: '2 to 4 min',
    description:
      'Complete comforting, well-known everyday sayings and word pairs by choosing the missing word from clear large tiles.',
    cognitiveBenefit:
      'Taps into preserved long-term verbal memory and brings a sense of familiarity and confidence.',
  },
  {
    id: 'number-path',
    title: 'Number Path Order',
    subtitle: 'Executive Function & Sequencing',
    skill: 'Attention',
    totalLevels: 5,
    estimatedTime: '2 to 5 min',
    description:
      'Tap large numbered tiles in order from smallest to largest across a calm, uncluttered board.',
    cognitiveBenefit:
      'Practices visual search, numerical sequencing, and step-by-step planning (inspired by clinical Trail Making tasks).',
  },
  {
    id: 'daily-routine',
    title: 'Daily Routine Sequencer',
    subtitle: 'Procedural Memory & Planning',
    skill: 'Logic',
    totalLevels: 5,
    estimatedTime: '2 to 4 min',
    description:
      'Place familiar everyday steps—such as making morning tea or planting a flower—into their natural beginning-to-end order.',
    cognitiveBenefit:
      'Reinforces procedural memory and practical step-by-step reasoning used in daily living.',
  },
];

export function getGameMeta(id: string): GameMeta | undefined {
  return GAMES_META.find((game) => game.id === id);
}
