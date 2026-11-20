import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageId, TextSize } from '../types';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  textSize: TextSize;
  onChangeTextSize: (size: TextSize) => void;
  completedLevelsCount: number;
  totalLevelsCount: number;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'research', label: 'Scientific Research' },
  { id: 'games', label: 'Brain Games' },
];

const TEXT_SIZES: { id: TextSize; label: string }[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'large', label: 'Large' },
  { id: 'xlarge', label: 'Extra Large' },
];

export function Navbar({
  activePage,
  onNavigate,
  textSize,
  onChangeTextSize,
  completedLevelsCount,
  totalLevelsCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-surface border-b border-sage-border">
      {/* Strict 3-Zone Top Bar: Brand | Nav Links | Primary CTA */}
      <header className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="font-serif text-2xl font-semibold tracking-tight text-ink hover:text-sage-primary transition-colors whitespace-nowrap shrink-0 cursor-pointer bg-transparent border-0 p-0"
        >
          Dementia Care Games
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-base font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer bg-transparent ${
                  isActive
                    ? 'border-sage-primary text-sage-primary font-semibold'
                    : 'border-transparent text-ink-muted hover:text-ink hover:border-sage-strong'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('games')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Play Brain Games
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-sage-border bg-canvas text-ink hover:bg-sage-mist transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-sage-border bg-surface px-5 py-4 flex flex-col gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sage-mist text-sage-primary font-semibold'
                    : 'text-ink hover:bg-canvas'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* Reading Comfort Bar: Text Size Accessibility Control & Quiet Progress Indicator */}
      <div className="bg-sage-mist border-t border-sage-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-ink whitespace-nowrap">
              Reading Text Size:
            </span>
            <div
              role="group"
              aria-label="Choose reading text size"
              className="inline-flex items-center gap-1 p-1 bg-surface border border-sage-border rounded-lg"
            >
              {TEXT_SIZES.map((option) => {
                const selected = textSize === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChangeTextSize(option.id)}
                    aria-pressed={selected}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selected
                        ? 'bg-sage-primary text-white'
                        : 'text-ink-muted hover:text-ink hover:bg-canvas'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-sm text-ink-muted tabular-nums">
            <span>Calm &amp; Untimed</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              onClick={() => handleLinkClick('games')}
              className="font-medium text-sage-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              {completedLevelsCount} of {totalLevelsCount} game levels completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
