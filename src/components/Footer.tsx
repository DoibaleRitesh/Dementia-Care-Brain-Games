import { PageId } from '../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-surface border-t border-sage-border mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-8 border-b border-sage-border">
          <div>
            <p className="font-serif text-xl font-semibold text-ink mb-2">Dementia Care Games</p>
            <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
              A calm, distraction-free companion offering plain-language dementia guidance,
              verified scientific literature, and eight untimed cognitive games for daily mental
              engagement.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink mb-3">Pages</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-ink-muted hover:text-sage-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Home — Understanding Dementia
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('research')}
                  className="text-ink-muted hover:text-sage-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Scientific Research &amp; Papers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('games')}
                  className="text-ink-muted hover:text-sage-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Brain Games (8 Leveled Activities)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink mb-3">Medical Information Notice</p>
            <p className="text-sm text-ink-muted leading-relaxed">
              The educational guidance and cognitive activities on Dementia Care Games are intended for
              general wellness and family support. They do not replace professional medical
              diagnosis, prescription advice, or clinical care from a qualified physician.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-muted">
          <p>Dementia Care Games · Education &amp; Cognitive Wellness Project</p>
          <p>Progress is saved locally in your browser · No account required</p>
        </div>
      </div>
    </footer>
  );
}
