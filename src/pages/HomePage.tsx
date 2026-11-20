import { ArrowRight, BookOpen, Brain, HeartHandshake, Pill, ShieldCheck, Sun } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { PageId } from '../types';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

const DEMENTIA_TYPES = [
  {
    name: "Alzheimer's Disease",
    share: '60% to 70% of cases',
    summary:
      'The most common form of dementia, associated with gradual buildup of amyloid plaques and tau tangles that affect recent memory first, followed by language and daily planning.',
  },
  {
    name: 'Vascular Dementia',
    share: '15% to 20% of cases',
    summary:
      'Occurs when reduced blood flow or small strokes injure brain tissue. Early changes often involve slower thinking, difficulty organizing steps, and attention shifts rather than memory alone.',
  },
  {
    name: 'Lewy Body Dementia',
    share: '10% to 15% of cases',
    summary:
      'Caused by microscopic alpha-synuclein protein deposits in brain cells. People may experience fluctuating alertness, vivid visual experiences, sleep changes, and gentle movement stiffness.',
  },
  {
    name: 'Frontotemporal Dementia',
    share: '5% to 10% of cases',
    summary:
      'Affects the frontal and temporal lobes, often starting earlier (ages 45 to 65). Early signs typically involve shifts in speech, word comprehension, or social habits.',
  },
];

const STAGES = [
  {
    stage: '01. Mild (Early Stage)',
    ageNote: 'Often begins subtly',
    description:
      'A person usually remains largely independent, living at home and enjoying social life, while noticing occasional word-finding pauses, misplacing everyday items, or needing written reminders for appointments and multi-step tasks.',
  },
  {
    stage: '02. Moderate (Middle Stage)',
    ageNote: 'Longest stage for many families',
    description:
      'Memory gaps become clearer—recent conversations or dates may fade quickly, and familiar tasks like managing bills or cooking complex meals benefit from calm step-by-step guidance and steady daily routines.',
  },
  {
    stage: '03. Advanced (Late Stage)',
    ageNote: 'Dedicated daily support',
    description:
      'Short-term and long-term recall become significantly reduced and communication grows simpler. Comfort, familiar music, warm human presence, gentle touch, and peaceful surroundings remain deeply meaningful.',
  },
];

const MEDICATIONS = [
  {
    title: 'Cholinesterase Inhibitors',
    examples: 'Donepezil, Rivastigmine, Galantamine',
    detail:
      'Prescribed for mild-to-moderate (and sometimes advanced) Alzheimer’s or Lewy body dementia. They help preserve acetylcholine, a brain chemical messenger important for memory and alertness.',
  },
  {
    title: 'NMDA Receptor Antagonists',
    examples: 'Memantine',
    detail:
      'Often used in moderate-to-severe stages (alone or alongside a cholinesterase inhibitor) to regulate glutamate activity, helping support attention, daily functioning, and calm mood.',
  },
  {
    title: 'Amyloid-Targeting Therapies',
    examples: 'Lecanemab, Donanemab (specialist prescribed)',
    detail:
      'Newer disease-modifying antibody treatments approved for carefully selected people with confirmed early-stage Alzheimer’s disease or mild cognitive impairment under neurologist supervision.',
  },
  {
    title: 'Supporting Overall Health',
    examples: 'Blood pressure, thyroid, vitamin B12, sleep & mood care',
    detail:
      'Treating vascular health, hearing loss, sleep apnea, vitamin deficiencies, and depression often improves day-to-day clarity and energy noticeably.',
  },
];

const REMEDIES = [
  {
    title: 'Cognitive Stimulation & Gentle Games',
    detail:
      'Regular, enjoyable puzzles, word games, matching cards, and reminiscence activities exercise attention, language, and memory without pressure.',
  },
  {
    title: 'Predictable Daily Routines',
    detail:
      'Consistent times for waking, meals, short walks, and rest reduce confusion and anxiety while reinforcing familiar habits.',
  },
  {
    title: 'Nourishing Meals & Hydration',
    detail:
      'Brain-supportive eating patterns such as the MIND or Mediterranean diet—rich in leafy greens, berries, beans, fish, and olive oil—support vascular and neural health.',
  },
  {
    title: 'Daily Movement & Natural Daylight',
    detail:
      'Short morning walks, gentle stretching, or gardening improve circulation, uplift mood, and help steady the body’s natural sleep-wake rhythm.',
  },
  {
    title: 'Music, Photos & Social Warmth',
    detail:
      'Listening to favorite songs from earlier decades, sharing family albums, and talking calmly with loved ones spark emotional connection and long-term memories.',
  },
  {
    title: 'Calm, Clear Home Spaces',
    detail:
      'Good lighting, uncluttered rooms, clear labels, and high-contrast visual cues make everyday navigation safer and more independent.',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <p className="text-sm font-semibold text-sage-primary">
            Dementia Education · Clinical Research · Calm Memory Games
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.15]">
            Clear guidance and gentle brain games for every day
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-xl">
            Dementia Care Games brings together plain-language information about dementia, verified
            scientific research, and eight untimed, leveled cognitive games designed for comfort,
            dignity, and steady mental engagement.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('games')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Explore All 8 Brain Games</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('research')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-sage-primary bg-surface border border-sage-strong hover:bg-sage-mist rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              <span>Read Scientific Research</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full bg-surface border border-sage-border rounded-xl overflow-hidden">
            <ResilientImage
              src="/src/assets/images/hero_calm_memory_table_1795158930104.jpg"
              alt="A sunlit wooden table with neatly arranged wooden puzzle tiles, a warm mug of herbal tea, an open notebook, and a potted sage plant."
              fallbackTitle="Calm Everyday Memory Practice"
              className="w-full h-72 sm:h-88 lg:h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quick Chapter Jump Strip */}
      <section
        aria-label="Page Guide"
        className="bg-surface border border-sage-border rounded-xl p-6 sm:p-7"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href="#what-is-dementia"
            className="group block space-y-1.5 text-left hover:text-sage-primary transition-colors"
          >
            <p className="text-sm font-semibold text-sage-primary tabular-nums">01 · Guide</p>
            <p className="font-serif text-lg font-semibold text-ink group-hover:text-sage-primary">
              What Is Dementia?
            </p>
            <p className="text-sm text-ink-muted">Common types and how it differs from normal aging.</p>
          </a>
          <a
            href="#when-it-happens"
            className="group block space-y-1.5 text-left hover:text-sage-primary transition-colors"
          >
            <p className="text-sm font-semibold text-sage-primary tabular-nums">02 · Timeline</p>
            <p className="font-serif text-lg font-semibold text-ink group-hover:text-sage-primary">
              When It Happens
            </p>
            <p className="text-sm text-ink-muted">Typical onset, early signs, and gentle stage overview.</p>
          </a>
          <a
            href="#remedies-medications"
            className="group block space-y-1.5 text-left hover:text-sage-primary transition-colors"
          >
            <p className="text-sm font-semibold text-sage-primary tabular-nums">03 · Care</p>
            <p className="font-serif text-lg font-semibold text-ink group-hover:text-sage-primary">
              Medications &amp; Remedies
            </p>
            <p className="text-sm text-ink-muted">Prescribed therapies alongside daily supportive habits.</p>
          </a>
          <a
            href="#about-project"
            className="group block space-y-1.5 text-left hover:text-sage-primary transition-colors"
          >
            <p className="text-sm font-semibold text-sage-primary tabular-nums">04 · Purpose</p>
            <p className="font-serif text-lg font-semibold text-ink group-hover:text-sage-primary">
              Why Memory Games Help
            </p>
            <p className="text-sm text-ink-muted">How Dementia Care Games supports patients and caregivers.</p>
          </a>
        </div>
      </section>

      {/* Section 1: What Is Dementia? */}
      <section id="what-is-dementia" className="scroll-mt-8 space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold text-sage-primary">01. Understanding the Condition</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink">
            What is dementia?
          </h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            Dementia is not a single disease—it is a general medical term describing a decline in
            memory, language, problem-solving, and everyday thinking skills that becomes noticeable
            enough to affect daily independence. It happens when nerve cells in specific parts of
            the brain are gradually damaged and have more difficulty communicating with one another.
          </p>
        </div>

        {/* Normal Aging vs Dementia Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-sage-border rounded-xl p-6 sm:p-7 space-y-3">
            <h3 className="font-serif text-xl font-semibold text-ink">
              Normal Age-Related Forgetfulness
            </h3>
            <ul className="space-y-2.5 text-base text-ink-muted list-disc pl-5">
              <li>Occasionally forgetting a neighbor’s name and recalling it later that day.</li>
              <li>Misplacing reading glasses and retracing your steps to find them.</li>
              <li>Pausing briefly for the right word during a conversation.</li>
              <li>Managing familiar daily routines, bills, and favorite hobbies comfortably.</li>
            </ul>
          </div>

          <div className="bg-sage-mist border border-sage-border rounded-xl p-6 sm:p-7 space-y-3">
            <h3 className="font-serif text-xl font-semibold text-ink">
              Signs Worth Discussing With a Doctor
            </h3>
            <ul className="space-y-2.5 text-base text-ink-muted list-disc pl-5">
              <li>Forgetting recently learned information or repeating the same questions frequently.</li>
              <li>Having trouble following a familiar recipe, routine, or monthly schedule.</li>
              <li>Losing track of seasons, dates, or familiar neighborhood directions.</li>
              <li>Noticeable shifts in word comprehension, judgment, or withdrawing from hobbies.</li>
            </ul>
          </div>
        </div>

        {/* Four Common Forms */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-semibold text-ink">
            Common types of dementia
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DEMENTIA_TYPES.map((type) => (
              <article
                key={type.name}
                className="bg-surface border border-sage-border rounded-xl p-6 space-y-2.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-serif text-xl font-semibold text-ink">{type.name}</h4>
                  <span className="text-sm font-medium text-sage-primary tabular-nums">
                    {type.share}
                  </span>
                </div>
                <p className="text-base text-ink-muted leading-relaxed">{type.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-sage-border" />

      {/* Section 2: When Does Dementia Happen? */}
      <section id="when-it-happens" className="scroll-mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-sm font-semibold text-sage-primary">02. Onset &amp; Progression</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink">
              When does dementia happen?
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              Dementia most commonly appears in adults aged <strong>65 and older</strong>, with
              likelihood rising gradually in the 70s and 80s. However, it is{' '}
              <strong>not an inevitable part of aging</strong>. In roughly 5% to 10% of cases—known
              as young-onset dementia—symptoms can begin earlier, between ages 45 and 64.
            </p>
            <div className="bg-surface border border-sage-border rounded-xl p-5 space-y-2">
              <p className="text-sm font-semibold text-ink">Why early evaluation matters</p>
              <p className="text-sm text-ink-muted leading-relaxed">
                Some memory changes are caused by treatable conditions—such as vitamin B12
                deficiency, thyroid imbalances, medication side effects, dehydration, or poor
                sleep. An early medical check-up clarifies the cause and opens supportive care sooner.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {STAGES.map((item) => (
              <div
                key={item.stage}
                className="bg-surface border border-sage-border rounded-xl p-6 space-y-2"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-xl font-semibold text-ink">{item.stage}</h3>
                  <span className="text-sm text-ink-muted">{item.ageNote}</span>
                </div>
                <p className="text-base text-ink-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-sage-border" />

      {/* Section 3: Remedies and Medications */}
      <section id="remedies-medications" className="scroll-mt-8 space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold text-sage-primary">03. Treatment &amp; Daily Care</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink">
            Medications and everyday remedies
          </h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            Effective dementia care combines thoughtful medical guidance with warm, practical daily
            habits. While no single pill cures dementia today, approved medications and structured
            lifestyle remedies can ease symptoms, support thinking clarity, and meaningfully enhance
            quality of life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Medications Column */}
          <div className="bg-surface border border-sage-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-sage-border">
              <Pill className="w-6 h-6 text-sage-primary shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-serif text-2xl font-semibold text-ink">Medical Treatments</h3>
                <p className="text-sm text-ink-muted">Prescribed &amp; monitored by a physician</p>
              </div>
            </div>

            <div className="space-y-5">
              {MEDICATIONS.map((med) => (
                <div key={med.title} className="space-y-1.5">
                  <h4 className="text-lg font-semibold text-ink">{med.title}</h4>
                  <p className="text-sm font-medium text-sage-primary">{med.examples}</p>
                  <p className="text-base text-ink-muted leading-relaxed">{med.detail}</p>
                </div>
              ))}
            </div>

            <div className="bg-ochre-bg border border-ochre-border rounded-lg p-4 text-sm text-ochre-text leading-relaxed">
              <strong>Important medical note:</strong> Always consult a doctor, geriatrician, or
              neurologist before starting, adjusting, or stopping any medication or supplement.
            </div>
          </div>

          {/* Non-Pharmacological Remedies Column */}
          <div className="bg-sage-mist border border-sage-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-sage-border">
              <Sun className="w-6 h-6 text-sage-primary shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-serif text-2xl font-semibold text-ink">
                  Everyday Remedies &amp; Support
                </h3>
                <p className="text-sm text-ink-muted">Non-drug approaches proven to aid daily life</p>
              </div>
            </div>

            <div className="space-y-5">
              {REMEDIES.map((remedy) => (
                <div key={remedy.title} className="space-y-1">
                  <h4 className="text-lg font-semibold text-ink">{remedy.title}</h4>
                  <p className="text-base text-ink-muted leading-relaxed">{remedy.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-sage-border" />

      {/* Section 4: How Memory Games Help & About Our Project */}
      <section id="about-project" className="scroll-mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5">
            <div className="h-full bg-surface border border-sage-border rounded-xl overflow-hidden">
              <ResilientImage
                src="/src/assets/images/caregiver_family_support_1795158933711.jpg"
                alt="An older woman and her adult daughter smiling together at a bright kitchen table while playing a tabletop picture-matching game."
                fallbackTitle="Shared Moments of Cognitive Engagement"
                className="w-full h-72 sm:h-88 lg:h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <p className="text-sm font-semibold text-sage-primary">
              04. Cognitive Engagement &amp; Our Mission
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink">
              How memory games help—and why we built Dementia Care Games
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              Just as gentle daily walking helps keep muscles flexible, calm mental activities
              encourage <strong>neuroplasticity</strong> and strengthen{' '}
              <strong>cognitive reserve</strong>—the brain’s ability to stay active and resourceful.
              Peer-reviewed studies of Cognitive Stimulation Therapy (CST) show that structured word,
              matching, and reasoning games can support thinking skills, communication, and overall
              mood in older adults.
            </p>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              <strong>About our project:</strong> Many existing brain-training apps use flashing
              animations, rapid countdown clocks, and tiny buttons that frustrate older adults.
              Dementia Care Games was designed from the ground up for patients and caregivers: solid
              high-contrast surfaces, adjustable large text, completely untimed gameplay, encouraging
              multi-step hints, and eight varied games that progress smoothly across five levels.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-surface border border-sage-border rounded-lg p-4 space-y-1">
                <Brain className="w-5 h-5 text-sage-primary mb-1" aria-hidden="true" />
                <p className="text-sm font-semibold text-ink">8 Distinct Games</p>
                <p className="text-sm text-ink-muted">Memory, language, attention, and daily logic.</p>
              </div>
              <div className="bg-surface border border-sage-border rounded-lg p-4 space-y-1">
                <ShieldCheck className="w-5 h-5 text-sage-primary mb-1" aria-hidden="true" />
                <p className="text-sm font-semibold text-ink">Zero Time Pressure</p>
                <p className="text-sm text-ink-muted">Untimed rounds with gentle hints anytime.</p>
              </div>
              <div className="bg-surface border border-sage-border rounded-lg p-4 space-y-1">
                <HeartHandshake className="w-5 h-5 text-sage-primary mb-1" aria-hidden="true" />
                <p className="text-sm font-semibold text-ink">Play Solo or Together</p>
                <p className="text-sm text-ink-muted">Built for independent or caregiver-guided sessions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prominent Link Banner to Games & Research Pages */}
        <div className="bg-sage-mist border border-sage-strong rounded-xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
              Ready for a calm brain exercise?
            </h3>
            <p className="text-base sm:text-lg text-ink-muted">
              Choose from eight leveled activities designed for comfort and clarity, or explore the
              clinical research papers behind each cognitive skill.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('games')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-sage-primary hover:bg-sage-hover rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Go to Brain Games</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('research')}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-sage-primary bg-surface border border-sage-strong hover:bg-canvas rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View Research Papers</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
