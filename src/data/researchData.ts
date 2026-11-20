import { ResearchCategory, ResearchPaper } from '../types';

export const RESEARCH_CATEGORIES: ResearchCategory[] = [
  'All Studies',
  'Cognitive Stimulation',
  'Memory & Attention',
  'Multidomain Care',
  'Systematic Reviews',
];

export interface CognitiveDomainInfo {
  id: string;
  number: string;
  domain: string;
  mechanism: string;
  clinicalNote: string;
  matchingGames: string;
}

export const COGNITIVE_DOMAINS: CognitiveDomainInfo[] = [
  {
    id: 'visual-episodic',
    number: '01',
    domain: 'Visual & Short-Term Memory',
    mechanism:
      'Matching familiar visual cards and recalling recent locations activates hippocampal and medial temporal pathways involved in encoding new information.',
    clinicalNote:
      'Structured low-error recall practice helps older adults retain confidence while rehearsing retrieval cues.',
    matchingGames: 'Picture Pair Match · Color & Shape Sequence',
  },
  {
    id: 'language-semantic',
    number: '02',
    domain: 'Language, Vocabulary & Reminiscence',
    mechanism:
      'Word-finding, proverbs, and semantic grouping engage long-preserved temporal-lobe language networks that often remain resilient even in mild-to-moderate dementia.',
    clinicalNote:
      'Cognitive Stimulation Therapy (CST) trials consistently highlight language and familiarity games for improving communication and mood.',
    matchingGames: 'Gentle Word Search · Familiar Phrase Builder · Everyday Category Sort',
  },
  {
    id: 'attention-processing',
    number: '03',
    domain: 'Visual Attention & Sequencing',
    mechanism:
      'Scanning clean grids for a distinct tile or following an ordered number path exercises fronto-parietal attention networks and visual processing speed.',
    clinicalNote:
      'Long-term ACTIVE trial follow-ups linked targeted visual-attention and processing training with durable daily-functioning benefits.',
    matchingGames: 'Spot the Different Tile · Number Path Order',
  },
  {
    id: 'executive-procedural',
    number: '04',
    domain: 'Procedural Memory & Everyday Planning',
    mechanism:
      'Organizing familiar daily steps reinforces procedural schemas and frontal-lobe sequencing skills directly relevant to independent everyday routines.',
    clinicalNote:
      'Linking cognitive tasks to meaningful real-world habits improves engagement and transfer into daily life.',
    matchingGames: 'Daily Routine Sequencer · Everyday Category Sort',
  },
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'spector-woods-cst-2023',
    title: 'Cognitive Stimulation to Improve Cognitive Functioning in People With Dementia',
    authors: 'Woods B, Rai HK, Elliott E, Aguirre E, Orrell M, Spector A',
    journal: 'Cochrane Database of Systematic Reviews',
    year: 2023,
    studyType: 'Systematic Review & Meta-Analysis',
    category: 'Cognitive Stimulation',
    sampleNote: '37 randomized controlled trials · 2,766 participants with mild-to-moderate dementia',
    doi: '10.1002/14651858.CD005562.pub3',
    plainSummary:
      'This landmark Cochrane review updated the global evidence on Cognitive Stimulation Therapy (CST)—structured, enjoyable mental activities such as word games, categorization, reminiscence, and puzzles.',
    clinicalFindings:
      'Participants receiving cognitive stimulation demonstrated consistent, clinically meaningful improvements in global cognitive scores (MMSE and ADAS-Cog), along with measurable gains in communication, social interaction, and self-reported quality of life compared with usual care.',
    caregiverTakeaway:
      'Cognitive stimulation is widely recommended in international clinical guidelines (including UK NICE guidelines) as a core non-drug support for people living with mild-to-moderate dementia. Keep sessions enjoyable, social, and stress-free.',
    relatedGameIds: ['phrase-builder', 'category-sort', 'word-search'],
  },
  {
    id: 'active-10yr-rebok-2014',
    title: 'Ten-Year Effects of the Advanced Cognitive Training for Independent and Vital Elderly (ACTIVE) Trial',
    authors: 'Rebok GW, Ball K, Guey LT, Jones RN, Kim HY, King JW, Marsiske M, Morris JN, Tennstedt SL, Unverzagt FW, Willis SL',
    journal: 'Journal of the American Geriatrics Society (JAGS)',
    year: 2014,
    studyType: 'Multi-Site Randomized Controlled Trial (10-Year Follow-Up)',
    category: 'Memory & Attention',
    sampleNote: '2,832 older adults aged 65+ across 6 U.S. clinical sites',
    doi: '10.1111/jgs.12607',
    plainSummary:
      'The ACTIVE study is one of the largest randomized clinical trials ever conducted on structured brain training in older adults, evaluating memory, reasoning, and visual processing exercises.',
    clinicalFindings:
      'Ten years after training, participants in the reasoning and processing-speed groups maintained statistically significant gains in their trained cognitive abilities, and all three intervention groups reported less difficulty with everyday instrumental activities of daily living (IADLs) than untrained controls.',
    caregiverTakeaway:
      'Even brief, regular periods of targeted reasoning, sequencing, and visual attention practice can help preserve everyday practical independence over many years.',
    relatedGameIds: ['number-path', 'spot-difference', 'daily-routine'],
  },
  {
    id: 'active-20yr-2026',
    title: 'Impact of Cognitive Training on Claims-Based Diagnosed Dementia Over 20 Years: Evidence From the ACTIVE Study',
    authors: 'Coe NB, Miller KEM, Sun C, Taggert E, Willis SL, Ball KK, Marsiske M, Rebok GW, Gross AL, Albert MS',
    journal: "Alzheimer's & Dementia: Translational Research & Clinical Interventions",
    year: 2026,
    studyType: '20-Year Medicare-Linked Longitudinal Follow-Up',
    category: 'Memory & Attention',
    sampleNote: '2,021 ACTIVE trial participants linked to 20-year clinical records',
    doi: '10.1002/trc2.70197',
    plainSummary:
      'Extending the landmark ACTIVE clinical trial across two full decades, researchers examined long-term medical records to measure whether structured cognitive training with booster sessions influenced later dementia diagnoses.',
    clinicalFindings:
      'Older adults randomized to visual speed-of-processing training who also completed periodic booster sessions showed a significantly lower 20-year hazard of diagnosed Alzheimer’s disease and related dementias compared with the control group.',
    caregiverTakeaway:
      'Consistency matters: returning to gentle visual attention and pattern games periodically as ongoing "booster" practice provides stronger long-term support than one-time sessions.',
    relatedGameIds: ['spot-difference', 'number-path', 'color-sequence'],
  },
  {
    id: 'verghese-nejm-2003',
    title: 'Leisure Activities and the Risk of Dementia in the Elderly',
    authors: 'Verghese J, Lipton RB, Katz MJ, Hall CB, Derby CA, Kuslansky G, Ambrose AF, Sliwinski M, Buschke H',
    journal: 'The New England Journal of Medicine (NEJM)',
    year: 2003,
    studyType: 'Prospective Cohort Study (Einstein Aging Study)',
    category: 'Multidomain Care',
    sampleNote: '469 community-dwelling adults older than 75 followed over 5.1 median years',
    doi: '10.1056/NEJMoa022252',
    plainSummary:
      'This widely cited New England Journal of Medicine study tracked everyday hobbies—including board games, reading, crossword puzzles, and music—to see how mental engagement relates to dementia risk.',
    clinicalFindings:
      'Frequent participation in cognitively stimulating leisure activities was associated with a markedly reduced risk of developing both Alzheimer’s disease and vascular dementia. Playing board games and doing word puzzles stood out among the most protective mental habits.',
    caregiverTakeaway:
      'Familiar, enjoyable tabletop-style puzzles and word games are not trivial pastimes—they actively build and sustain cognitive reserve.',
    relatedGameIds: ['word-search', 'picture-pairs', 'phrase-builder'],
  },
  {
    id: 'bahar-fuchs-cochrane-2019',
    title: 'Cognitive Training for People With Mild to Moderate Dementia',
    authors: 'Bahar-Fuchs A, Martyr A, Goh AMY, Sabates J, Clare L',
    journal: 'Cochrane Database of Systematic Reviews',
    year: 2019,
    studyType: 'Systematic Review & Meta-Analysis',
    category: 'Systematic Reviews',
    sampleNote: '33 randomized controlled trials · ~2,000 participants across 12 countries',
    doi: '10.1002/14651858.CD013069.pub2',
    plainSummary:
      'Researchers systematically evaluated guided practice on structured memory, attention, and language exercises specifically for adults already diagnosed with mild-to-moderate dementia.',
    clinicalFindings:
      'Cognitive training produced small-to-moderate positive effects on overall global cognition and verbal semantic fluency, with benefits frequently persisting in the months following the training period and with no evidence of adverse effects.',
    caregiverTakeaway:
      'Guided cognitive games are safe and beneficial for people living with mild-to-moderate dementia, especially when paired with encouraging prompts and zero performance pressure.',
    relatedGameIds: ['category-sort', 'picture-pairs', 'phrase-builder'],
  },
  {
    id: 'hill-lampit-ajp-2017',
    title: 'Computerized Cognitive Training in Older Adults With Mild Cognitive Impairment or Dementia: A Systematic Review and Meta-Analysis',
    authors: 'Hill NTM, Mowszowski L, Naismith SL, Chadwick VL, Valenzuela M, Lampit A',
    journal: 'The American Journal of Psychiatry',
    year: 2017,
    studyType: 'Systematic Review & Meta-Analysis',
    category: 'Systematic Reviews',
    sampleNote: '17 trials in Mild Cognitive Impairment (686 adults) & 12 trials in Dementia (389 adults)',
    doi: '10.1176/appi.ajp.2016.16030360',
    plainSummary:
      'This comprehensive review analyzed whether digital, screen-based cognitive games can meaningfully support thinking skills and emotional well-being in older adults experiencing memory decline.',
    clinicalFindings:
      'In mild cognitive impairment, computerized cognitive training demonstrated significant moderate gains across global cognition, working memory, attention, learning, and psychosocial functioning (including reduced depressive symptoms).',
    caregiverTakeaway:
      'Well-designed, accessible digital games can support both working memory and emotional mood when sessions are calm, readable, and tailored to the person’s current level.',
    relatedGameIds: ['color-sequence', 'picture-pairs', 'number-path'],
  },
  {
    id: 'lampit-plos-2014',
    title: 'Computerized Cognitive Training in Cognitively Healthy Older Adults: A Systematic Review and Meta-Analysis of Randomized Controlled Trials',
    authors: 'Lampit A, Hallock H, Valenzuela M',
    journal: 'PLOS Medicine',
    year: 2014,
    studyType: 'Systematic Review & Meta-Analysis',
    category: 'Systematic Reviews',
    sampleNote: '52 randomized controlled trials · 4,885 older adult participants',
    doi: '10.1371/journal.pmed.1001756',
    plainSummary:
      'Analyzing 52 clinical trials, this study identified the exact design patterns and session habits that make screen-based brain exercises genuinely effective for older adults.',
    clinicalFindings:
      'Computerized training delivered statistically significant improvements in nonverbal memory, verbal memory, working memory, processing speed, and visuospatial skills. Importantly, sessions lasting around 30 minutes a few times per week outperformed overly long or exhausting daily drills.',
    caregiverTakeaway:
      'Short, calm sessions (15–30 minutes, 2 to 3 times a week) with gentle breaks work better than long, tiring practice marathons.',
    relatedGameIds: ['picture-pairs', 'color-sequence', 'spot-difference'],
  },
  {
    id: 'ngandu-finger-lancet-2015',
    title: 'A 2-Year Multidomain Intervention of Diet, Exercise, Cognitive Training, and Vascular Risk Monitoring Versus Control to Prevent Cognitive Decline (FINGER)',
    authors: 'Ngandu T, Lehtisalo J, Solomon A, Levälahti E, Ahtiluoto S, Antikainen R, Bäckman L, Hänninen T, Jula A, Laatikainen T, Lindström J, Mangialasche F, Paajanen T, Pajala S, Peltonen M, Rauramaa R, Stigsdotter-Neely A, Strandberg T, Tuomilehto J, Soininen H, Kivipelto M',
    journal: 'The Lancet',
    year: 2015,
    studyType: '2-Year Double-Blind Randomized Controlled Trial',
    category: 'Multidomain Care',
    sampleNote: '1,260 at-risk older adults aged 60–77 in Finland',
    doi: '10.1016/S0140-6736(15)60461-5',
    plainSummary:
      'The groundbreaking FINGER trial tested combining regular cognitive training games with healthy nutrition, gentle physical exercise, social activity, and heart-health monitoring.',
    clinicalFindings:
      'After two years, participants in the multidomain lifestyle and cognitive training group scored 25% higher overall on comprehensive neuropsychological testing—with 83% greater improvement in executive functioning and 150% greater improvement in processing speed compared with general health advice alone.',
    caregiverTakeaway:
      'Brain games work best as part of a warm whole-person routine alongside balanced meals, daily movement, good sleep, medical check-ups, and meaningful human connection.',
    relatedGameIds: ['daily-routine', 'number-path', 'category-sort'],
  },
];
