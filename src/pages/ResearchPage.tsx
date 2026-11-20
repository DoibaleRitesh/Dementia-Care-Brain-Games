import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { getGameMeta } from '../data/gamesMeta';
import {
  COGNITIVE_DOMAINS,
  RESEARCH_CATEGORIES,
  RESEARCH_PAPERS,
} from '../data/researchData';
import { GameId, ResearchCategory } from '../types';

interface ResearchPageProps {
  onOpenGame: (gameId: GameId) => void;
  onGoToGames: () => void;
}

export function ResearchPage({ onOpenGame, onGoToGames }: ResearchPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory>('All Studies');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPaperIds, setExpandedPaperIds] = useState<Record<string, boolean>>({
    'spector-woods-cst-2023': true,
  });

  const filteredPapers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return RESEARCH_PAPERS.filter((paper) => {
      const matchesCategory =
        selectedCategory === 'All Studies' || paper.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        paper.title.toLowerCase().includes(query) ||
        paper.authors.toLowerCase().includes(query) ||
        paper.journal.toLowerCase().includes(query) ||
        paper.plainSummary.toLowerCase().includes(query) ||
        paper.clinicalFindings.toLowerCase().includes(query) ||
        String(paper.year).includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedPaperIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-14 sm:space-y-16">
      {/* Editorial Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <p className="text-sm font-semibold text-sage-primary">
            Peer-Reviewed Evidence · Clinical Trials · Cochrane Reviews
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.15]">
            Scientific research supporting brain games and cognitive activity
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-2xl">
            Every cognitive activity in Dementia Care Games is informed by published gerontology and
            neurology research. Below you will find plain-language explanations of how structured
            mental engagement strengthens memory pathways, alongside eight landmark peer-reviewed
            papers with direct DOI links.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-6 text-sm text-ink-muted tabular-nums">
            <span>8 Landmark Peer-Reviewed Studies</span>
            <span aria-hidden="true">·</span>
            <span>2003–2026 Clinical Evidence</span>
            <span aria-hidden="true">·</span>
            <span>Verified DOI Citations</span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-full bg-surface border border-sage-border rounded-xl overflow-hidden">
            <ResilientImage
              src="/src/assets/images/research_clinical_archive_1795158931357.jpg"
              alt="Open medical journals, classic reading glasses, handwritten study notes, and a small vase with fresh sage leaves on a pale oak desk."
              fallbackTitle="Peer-Reviewed Clinical Research Library"
              className="w-full h-64 sm:h-80 lg:h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 1: How Brain Activity Strengthens Memory */}
      <section className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold text-sage-primary">01. How It Works in the Brain</p>
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Four cognitive pathways supported by structured games
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Clinical neuroscience shows that older adult brains retain the capacity to adapt and
            strengthen neural connections—a principle known as <strong>neuroplasticity</strong>.
            Rather than relying on a single repetitive drill, research recommends combining varied,
            enjoyable exercises across multiple cognitive domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COGNITIVE_DOMAINS.map((item) => (
            <div
              key={item.id}
              className="bg-surface border border-sage-border rounded-xl p-6 space-y-3"
            >
              <p className="text-sm font-semibold text-sage-primary tabular-nums">
                {item.number}. {item.domain}
              </p>
              <p className="text-base text-ink leading-relaxed">{item.mechanism}</p>
              <p className="text-sm text-ink-muted leading-relaxed">{item.clinicalNote}</p>
              <p className="pt-2 border-t border-sage-border text-sm text-ink-muted">
                <strong className="text-ink">Dementia Care Games activities:</strong> {item.matchingGames}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-sage-border" />

      {/* Section 2: Interactive Peer-Reviewed Research Library */}
      <section className="space-y-8">
        <div className="space-y-3 max-w-3xl">
          <p className="text-sm font-semibold text-sage-primary">02. Published Literature Archive</p>
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Landmark research papers &amp; clinical trials
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Filter by clinical topic or search by author, journal, or keyword. Expand any study to
            read the detailed findings, caregiver takeaway, and verified external publication link.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-surface border border-sage-border rounded-xl p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div
              role="group"
              aria-label="Filter research papers by topic"
              className="flex flex-wrap items-center gap-1.5"
            >
              {RESEARCH_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={isActive}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-sage-primary text-white'
                        : 'bg-canvas text-ink-muted hover:text-ink hover:bg-sage-mist border border-sage-border'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search
                className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, author, journal..."
                aria-label="Search scientific research papers"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-canvas border border-sage-border rounded-lg text-ink placeholder:text-ink-muted focus:border-sage-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="text-sm text-ink-muted tabular-nums">
            Showing {filteredPapers.length} of {RESEARCH_PAPERS.length} peer-reviewed studies
          </div>
        </div>

        {/* Paper List */}
        {filteredPapers.length === 0 ? (
          <div className="bg-surface border border-sage-border rounded-xl p-10 text-center space-y-4">
            <p className="font-serif text-2xl font-semibold text-ink">
              No studies match your current search
            </p>
            <p className="text-base text-ink-muted">
              Try clearing your search term or selecting “All Studies” to browse the full library.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All Studies');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPapers.map((paper) => {
              const isExpanded = Boolean(expandedPaperIds[paper.id]);
              return (
                <article
                  key={paper.id}
                  className="bg-surface border border-sage-border rounded-xl p-6 sm:p-8 space-y-4"
                >
                  {/* Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-ink-muted tabular-nums">
                    <span className="font-semibold text-sage-primary">{paper.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{paper.journal}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-ink">{paper.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{paper.studyType}</span>
                  </div>

                  {/* Title & Authors */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-2xl font-semibold text-ink leading-snug">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-ink-muted">{paper.authors}</p>
                    <p className="text-sm text-ink-muted tabular-nums">{paper.sampleNote}</p>
                  </div>

                  {/* Plain-Language Summary */}
                  <p className="text-base text-ink leading-relaxed">{paper.plainSummary}</p>

                  {/* Expanded Clinical Details */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-sage-border space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-canvas border border-sage-border rounded-lg p-5 space-y-2">
                          <h4 className="text-sm font-semibold text-ink">Key Clinical Findings</h4>
                          <p className="text-base text-ink-muted leading-relaxed">
                            {paper.clinicalFindings}
                          </p>
                        </div>
                        <div className="bg-sage-mist border border-sage-border rounded-lg p-5 space-y-2">
                          <h4 className="text-sm font-semibold text-sage-primary">
                            Practical Takeaway for Families &amp; Patients
                          </h4>
                          <p className="text-base text-ink leading-relaxed">
                            {paper.caregiverTakeaway}
                          </p>
                        </div>
                      </div>

                      {/* Related Dementia Care Games */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-ink">
                          Try related Dementia Care Games activities:
                        </span>
                        {paper.relatedGameIds.map((gameId) => {
                          const meta = getGameMeta(gameId);
                          if (!meta) return null;
                          return (
                            <button
                              key={gameId}
                              type="button"
                              onClick={() => onOpenGame(gameId)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-sage-primary bg-surface border border-sage-strong hover:bg-sage-mist rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <span>{meta.title}</span>
                              <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Footer Actions Row */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-sage-border">
                    <button
                      type="button"
                      onClick={() => toggleExpand(paper.id)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <span>Hide Clinical Findings</span>
                          <ChevronUp className="w-4 h-4" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          <span>Read Clinical Findings &amp; Family Takeaway</span>
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </button>

                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-sage-primary hover:underline tabular-nums"
                    >
                      <span>DOI: {paper.doi}</span>
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Balanced Evidence Note & CTA */}
        <div className="bg-sage-mist border border-sage-strong rounded-xl p-7 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-serif text-2xl font-semibold text-ink">
              Putting the research into gentle daily practice
            </h3>
            <p className="text-base text-ink-muted leading-relaxed">
              Research consistently reminds us that cognitive games are not a standalone cure—they
              work best as a calm, enjoyable habit (15–30 minutes a few times each week) alongside
              medical care, movement, nourishing meals, and warm social connection.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToGames}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Brain Games</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
