import { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import { GameMeta } from '../types';
import {
  playGentleNudgeSound,
  playLevelCompleteSound,
  playMatchSound,
  playTapSound,
} from '../utils/sound';
import { GameFrame } from './GameFrame';

interface EverydayCategorySortProps {
  meta: GameMeta;
  completedLevels: number[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteLevel: (level: number) => void;
  onBackToHub: () => void;
}

interface SortItem {
  id: string;
  label: string;
  categoryId: string;
}

interface SortCategory {
  id: string;
  name: string;
  helper: string;
}

interface SortLevel {
  categories: SortCategory[];
  items: SortItem[];
}

const SORT_LEVELS: Record<number, SortLevel> = {
  1: {
    categories: [
      { id: 'kitchen', name: 'Kitchen', helper: 'Used for cooking or eating' },
      { id: 'garden', name: 'Garden', helper: 'Found outdoors among plants' },
    ],
    items: [
      { id: 'kettle', label: 'Tea Kettle', categoryId: 'kitchen' },
      { id: 'rose', label: 'Rose Bush', categoryId: 'garden' },
      { id: 'spoon', label: 'Wooden Spoon', categoryId: 'kitchen' },
      { id: 'trowel', label: 'Watering Can', categoryId: 'garden' },
      { id: 'plate', label: 'Dinner Plate', categoryId: 'kitchen' },
      { id: 'sunflower', label: 'Sunflower', categoryId: 'garden' },
    ],
  },
  2: {
    categories: [
      { id: 'fruit', name: 'Fruits', helper: 'Sweet foods that grow on trees or vines' },
      { id: 'clothing', name: 'Clothing', helper: 'Things we wear each day' },
    ],
    items: [
      { id: 'apple', label: 'Red Apple', categoryId: 'fruit' },
      { id: 'sweater', label: 'Wool Sweater', categoryId: 'clothing' },
      { id: 'peach', label: 'Ripe Peach', categoryId: 'fruit' },
      { id: 'scarf', label: 'Warm Scarf', categoryId: 'clothing' },
      { id: 'banana', label: 'Banana', categoryId: 'fruit' },
      { id: 'hat', label: 'Sun Hat', categoryId: 'clothing' },
      { id: 'grapes', label: 'Sweet Grapes', categoryId: 'fruit' },
      { id: 'socks', label: 'Cotton Socks', categoryId: 'clothing' },
    ],
  },
  3: {
    categories: [
      { id: 'bedroom', name: 'Bedroom', helper: 'For sleeping and resting' },
      { id: 'bathroom', name: 'Bathroom', helper: 'For washing and grooming' },
      { id: 'living', name: 'Living Room', helper: 'For relaxing with family' },
    ],
    items: [
      { id: 'pillow', label: 'Soft Pillow', categoryId: 'bedroom' },
      { id: 'towel', label: 'Bath Towel', categoryId: 'bathroom' },
      { id: 'sofa', label: 'Armchair', categoryId: 'living' },
      { id: 'blanket', label: 'Warm Blanket', categoryId: 'bedroom' },
      { id: 'soap', label: 'Hand Soap', categoryId: 'bathroom' },
      { id: 'lamp', label: 'Reading Lamp', categoryId: 'living' },
      { id: 'toothbrush', label: 'Toothbrush', categoryId: 'bathroom' },
      { id: 'bookshelf', label: 'Bookshelf', categoryId: 'living' },
      { id: 'alarm', label: 'Bedside Clock', categoryId: 'bedroom' },
    ],
  },
  4: {
    categories: [
      { id: 'morning', name: 'Breakfast Table', helper: 'Morning foods & drinks' },
      { id: 'desk', name: 'Writing Desk', helper: 'Paper & letter supplies' },
      { id: 'walk', name: 'Outdoor Walk', helper: 'Taken outside for a stroll' },
    ],
    items: [
      { id: 'oatmeal', label: 'Warm Oatmeal', categoryId: 'morning' },
      { id: 'envelope', label: 'Envelope', categoryId: 'desk' },
      { id: 'umbrella', label: 'Umbrella', categoryId: 'walk' },
      { id: 'toast', label: 'Buttered Toast', categoryId: 'morning' },
      { id: 'pen', label: 'Fountain Pen', categoryId: 'desk' },
      { id: 'shoes', label: 'Walking Shoes', categoryId: 'walk' },
      { id: 'orangejuice', label: 'Orange Juice', categoryId: 'morning' },
      { id: 'stamp', label: 'Postage Stamp', categoryId: 'desk' },
      { id: 'jacket', label: 'Light Jacket', categoryId: 'walk' },
    ],
  },
  5: {
    categories: [
      { id: 'summer', name: 'Warm Summer', helper: 'Sunny weather items' },
      { id: 'winter', name: 'Chilly Winter', helper: 'Cold weather items' },
      { id: 'baking', name: 'Home Baking', helper: 'Ingredients & baking tools' },
    ],
    items: [
      { id: 'sunglasses', label: 'Sunglasses', categoryId: 'summer' },
      { id: 'mittens', label: 'Knit Mittens', categoryId: 'winter' },
      { id: 'flour', label: 'Bag of Flour', categoryId: 'baking' },
      { id: 'lemonade', label: 'Cool Lemonade', categoryId: 'summer' },
      { id: 'coat', label: 'Winter Coat', categoryId: 'winter' },
      { id: 'rollingpin', label: 'Rolling Pin', categoryId: 'baking' },
      { id: 'picnic', label: 'Picnic Basket', categoryId: 'summer' },
      { id: 'fireplace', label: 'Wool Blanket', categoryId: 'winter' },
      { id: 'mixingbowl', label: 'Mixing Bowl', categoryId: 'baking' },
      { id: 'sandals', label: 'Garden Sandals', categoryId: 'summer' },
      { id: 'boots', label: 'Warm Boots', categoryId: 'winter' },
      { id: 'whisk', label: 'Wire Whisk', categoryId: 'baking' },
    ],
  },
};

export function EverydayCategorySort({
  meta,
  completedLevels,
  soundEnabled,
  onToggleSound,
  onCompleteLevel,
  onBackToHub,
}: EverydayCategorySortProps) {
  const [level, setLevel] = useState(1);
  const currentConfig = SORT_LEVELS[level] ?? SORT_LEVELS[1];

  const [placedMap, setPlacedMap] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    currentConfig.items[0]?.id ?? null
  );
  const [hintCategoryId, setHintCategoryId] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startLevel = useCallback((targetLevel: number) => {
    const cfg = SORT_LEVELS[targetLevel] ?? SORT_LEVELS[1];
    setLevel(targetLevel);
    setPlacedMap({});
    setSelectedItemId(cfg.items[0]?.id ?? null);
    setHintCategoryId(null);
    setHintMessage(null);
    setStatusMessage(null);
    setIsComplete(false);
  }, []);

  const remainingItems = currentConfig.items.filter((item) => !placedMap[item.id]);
  const activeItem =
    remainingItems.find((i) => i.id === selectedItemId) ?? remainingItems[0] ?? null;

  const handleSelectItem = (itemId: string) => {
    playTapSound(soundEnabled);
    setSelectedItemId(itemId);
    setHintCategoryId(null);
    setHintMessage(null);
  };

  const handleChooseBasket = (category: SortCategory) => {
    if (!activeItem || isComplete) return;

    if (activeItem.categoryId === category.id) {
      const nextPlaced = { ...placedMap, [activeItem.id]: category.id };
      setPlacedMap(nextPlaced);
      setHintCategoryId(null);
      setHintMessage(null);

      const nextRemaining = currentConfig.items.filter((i) => !nextPlaced[i.id]);
      if (nextRemaining.length === 0) {
        setSelectedItemId(null);
        setIsComplete(true);
        setStatusMessage(null);
        playLevelCompleteSound(soundEnabled);
        onCompleteLevel(level);
      } else {
        setSelectedItemId(nextRemaining[0].id);
        playMatchSound(soundEnabled);
        setStatusMessage(`Placed "${activeItem.label}" in ${category.name}.`);
      }
    } else {
      playGentleNudgeSound(soundEnabled);
      setStatusMessage(
        `"${activeItem.label}" usually belongs in another basket. Take a gentle guess at another one.`
      );
    }
  };

  const handleRequestHint = () => {
    if (!activeItem) return;
    const correctCat = currentConfig.categories.find((c) => c.id === activeItem.categoryId);
    if (correctCat) {
      setHintCategoryId(correctCat.id);
      setHintMessage(
        `"${activeItem.label}" belongs in the "${correctCat.name}" basket (${correctCat.helper}).`
      );
    }
  };

  const sortedCount = Object.keys(placedMap).length;
  const totalCount = currentConfig.items.length;

  return (
    <GameFrame
      meta={meta}
      level={level}
      completedLevels={completedLevels}
      instruction={`Level ${level}: Choose an item below (the highlighted item is ready), then tap the basket where it naturally belongs.`}
      progressText={`Items Sorted: ${sortedCount} of ${totalCount}`}
      hintMessage={hintMessage}
      statusMessage={statusMessage}
      isLevelComplete={isComplete}
      completionSummary={`You sorted all ${totalCount} everyday items into their matching baskets.`}
      soundEnabled={soundEnabled}
      onToggleSound={onToggleSound}
      onSelectLevel={startLevel}
      onRequestHint={handleRequestHint}
      onResetLevel={() => startLevel(level)}
      onBackToHub={onBackToHub}
    >
      <div className="space-y-8">
        {/* Current Item & Remaining Tray */}
        <div className="bg-canvas border border-sage-border rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl font-semibold text-ink">
              Step 1: Item to Place
            </h2>
            <span className="text-sm text-ink-muted">Tap any item to switch</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {remainingItems.map((item) => {
              const isSelected = activeItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item.id)}
                  aria-pressed={isSelected}
                  className={`px-5 py-3.5 text-base font-semibold rounded-lg border-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sage-primary text-white border-sage-primary'
                      : 'bg-surface text-ink border-sage-border hover:bg-sage-mist'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Baskets */}
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Step 2: Tap the Matching Basket for{' '}
            <span className="text-sage-primary">
              “{activeItem ? activeItem.label : ''}”
            </span>
          </h2>

          <div
            className={`grid gap-5 ${
              currentConfig.categories.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {currentConfig.categories.map((cat) => {
              const placedItems = currentConfig.items.filter(
                (item) => placedMap[item.id] === cat.id
              );
              const isHinted = hintCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChooseBasket(cat)}
                  className={`text-left rounded-xl border-2 p-6 space-y-4 transition-colors cursor-pointer ${
                    isHinted
                      ? 'bg-ochre-bg border-ochre-text'
                      : 'bg-surface border-sage-strong hover:bg-sage-mist'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-serif text-2xl font-semibold text-ink">{cat.name}</p>
                    <p className="text-sm text-ink-muted">{cat.helper}</p>
                  </div>

                  <div className="pt-3 border-t border-sage-border space-y-2 min-h-[72px]">
                    {placedItems.length === 0 ? (
                      <p className="text-sm text-ink-muted">Tap here to place item</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {placedItems.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-2 text-sm font-semibold text-sage-primary"
                          >
                            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>{item.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameFrame>
  );
}
