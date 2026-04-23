// Data for for-clinicians.astro modularization
export const carouselSlides = [
  {
    webp: '/images/en_behandler_patient_calendar.webp',
    mobileWebp: '/images/en_behandler_patient_calendar-mobile.webp',
    png: '/images/en_behandler_patient_calendar.png',
    alt: 'Practitioner Dashboard - client session timeline',
    caption: 'Practitioner Dashboard · Timeline',
    width: 1920,
    height: 1080,
    priority: true,
  },
  {
    webp: '/images/en_behandler_analytics_time_of_day.webp',
    mobileWebp: '/images/en_behandler_analytics_time_of_day-mobile.webp',
    png: '/images/en_behandler_analytics_time_of_day.png',
    alt: 'Practitioner Dashboard - time of day patterns',
    caption: 'Practitioner Dashboard · Patterns',
    width: 1920,
    height: 1080,
  },
  {
    webp: '/images/en_behandler_analytics_social.webp',
    mobileWebp: '/images/en_behandler_analytics_social-mobile.webp',
    png: '/images/en_behandler_analytics_social.png',
    alt: 'Practitioner Dashboard - social context analytics',
    caption: 'Practitioner Dashboard · Social context',
    width: 1920,
    height: 1080,
  },
  {
    webp: '/images/en_behandler_patient_list.webp',
    mobileWebp: '/images/en_behandler_patient_list-mobile.webp',
    png: '/images/en_behandler_patient_list.png',
    alt: 'Practitioner Dashboard - client list with traffic light status',
    caption: 'Practitioner Dashboard · Client list',
    width: 1920,
    height: 1080,
  },
  {
    webp: '/images/en_behandler_patient_detail.webp',
    mobileWebp: '/images/en_behandler_patient_detail-mobile.webp',
    png: '/images/en_behandler_patient_detail.png',
    alt: 'Practitioner Dashboard - individual client detail view',
    caption: 'Practitioner Dashboard · Detail view',
    width: 1920,
    height: 1080,
  },
];

export const benefitCards = [
  {
    title: 'Real-time EMA logging',
    body: 'Clients log in the moment — not reconstructed days later in session. Three taps, no cognitive load.',
    href: '/features.html',
    linkLabel: 'See features →',
    iconBg: 'var(--green-tint)',
    iconStroke: 'var(--green)',
    icon: 'clock',
  },
  {
    title: 'Practitioner dashboard',
    body: 'Traffic light status, trigger alarms, and week-over-week trends before clients walk through the door.',
    href: '/features.html',
    linkLabel: 'See features →',
    iconBg: 'var(--green-tint)',
    iconStroke: 'var(--green)',
    icon: 'grid',
  },
  {
    title: 'One-click PDF reports',
    body: 'Session-ready clinical report in one click. Attach directly to any EHR system — no formatting required.',
    href: '/features.html',
    linkLabel: 'See features →',
    iconBg: '#fff7ed',
    iconStroke: '#c2410c',
    icon: 'file',
  },
  {
    title: 'Privacy by Design',
    body: 'Clients control what they share. Consent can be extended or withdrawn at any time — no sharing required to start.',
    href: '/security.html',
    linkLabel: 'Learn more →',
    iconBg: 'var(--green-tint)',
    iconStroke: 'var(--green)',
    icon: 'lock',
  },
];

export const featureSections = [
  {
    eyebrow: 'Practitioner Dashboard',
    title: 'Know which clients need attention before they tell you',
    body: "A live overview of every client's usage, mood, and trigger patterns. No prep work required — the data is already structured and ready before the session starts.",
    bullets: [
      'Traffic light status — Green, Yellow, or Red at a glance',
      'Custom trigger alarms via app, email, or SMS',
      'Week-over-week trend for every client',
      'One-click PDF report — attach to any EHR',
    ],
    href: '/features.html',
    linkLabel: 'Explore dashboard features →',
    image: '/images/en_behandler_analytics_methods.webp',
    alt: 'Clinician analytics dashboard',
  },
  {
    eyebrow: 'Privacy by Design',
    title: 'Start private. Share when ready.',
    body: 'The tool works for the client first — no sharing required to start. Gradually extending data sharing can itself become part of the therapeutic process.',
    bullets: [
      'Works as a private self-monitoring tool first',
      'Share logs, mood, triggers, and notes independently',
      'Consent extended or withdrawn at any time',
      'GDPR DPA included · HIPAA BAA on Enterprise',
    ],
    href: '/security.html',
    linkLabel: 'Explore privacy features →',
    image: '/images/en_tracker_settings_my_counselor.webp',
    alt: 'Privacy settings screen',
    phone: true,
  },
];

export const evidenceCards = [
  {
    image: '/cannabis-use-disorder.webp',
    tag: 'Recall bias',
    title: 'Retrospective self-report is unreliable',
    body: 'EMA captures behavior as it happens — dramatically improving accuracy versus reconstructed recall.',
    refs: ['1'],
  },
  {
    image: '/urge-surfing.webp',
    tag: 'Proximal triggers',
    title: 'Craving and context predict use episodes',
    body: 'These associations only appear in real-time data — they vanish entirely in retrospective reports.',
    refs: ['2', '3'],
  },
  {
    image: '/measurement-based-care.webp',
    tag: 'Measurement-based care',
    title: 'Timely feedback improves outcomes',
    body: 'MBC principles have strong evidence for improving outcomes when feedback is timely and systematic.',
    refs: ['4', '5'],
  },
  {
    image: '/cannabis-withdrawal.webp',
    tag: 'CUD-specific EMA',
    title: 'Validated for cannabis use disorder',
    body: 'Captures dynamic mood–craving–use relationships that structured clinical interviews consistently miss.',
    refs: ['6'],
  },
];

export const faqs = [
  {
    question: 'What is SmokingTracker?',
    answer:
      'SmokingTracker is a clinical SaaS tool for outpatient substance use disorder treatment centers. Clients log cannabis consumption in real time using a three-tap mobile interface — no cognitive load required. Clinicians access a live dashboard showing usage trends, traffic-light status, trigger patterns, and one-click exportable PDF reports. SmokingTracker is built on Ecological Momentary Assessment (EMA), the gold-standard methodology for capturing behavior as it happens rather than from memory.',
  },
  {
    question: 'Is SmokingTracker HIPAA compliant?',
    answer:
      "SmokingTracker is built on a Privacy by Design architecture. A HIPAA Business Associate Agreement (BAA) is available on Enterprise plans for US-based treatment centers. All plans include a GDPR Data Processing Agreement (DPA). The platform's data handling approach is designed to align with 42 CFR Part 2 substance use confidentiality requirements.",
  },
];
