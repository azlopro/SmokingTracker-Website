export type ResourceCategory = 'clinical' | 'government' | 'research' | 'patient' | 'orgs';

export interface ResourceItem {
  title: string;
  description: string;
  source: string;
  href: string;
  icon: string;
  category: ResourceCategory;
  categoryLabel: string;
}

export const resourceCategoryLabels: Record<ResourceCategory | 'all', string> = {
  all: 'All Resources',
  clinical: 'Clinical Guidelines',
  government: 'Government & Data',
  research: 'Research',
  patient: 'Patient Education',
  orgs: 'Professional Orgs',
};

export const resources: ResourceItem[] = [
  {
    title: 'ASAM Clinical Practice Guidelines',
    description:
      "Evidence-based clinical practice guidelines from America's leading addiction medicine society — includes CUD assessment protocols and treatment recommendations.",
    source: 'American Society of Addiction Medicine',
    href: 'https://www.asam.org/quality-care/clinical-guidelines',
    icon: '📋',
    category: 'clinical',
    categoryLabel: 'Clinical',
  },
  {
    title: 'DSM-5-TR Cannabis Use Disorder Criteria',
    description:
      'Official APA diagnostic criteria for Cannabis Use Disorder (mild, moderate, severe) — the standard used in clinical assessment across North America.',
    source: 'American Psychiatric Association',
    href: 'https://www.psychiatry.org/psychiatrists/practice/dsm',
    icon: '📖',
    category: 'clinical',
    categoryLabel: 'Clinical',
  },
  {
    title: 'SAMHSA TIP 35: Enhancing Motivation for Change',
    description:
      'Practical counseling approaches for motivational interviewing in substance use treatment — directly applicable to cannabis use disorder programs.',
    source: 'SAMHSA',
    href: 'https://store.samhsa.gov/product/tip-35-enhancing-motivation-change-substance-use-disorder-treatment/pep19-02-01-003',
    icon: '💬',
    category: 'clinical',
    categoryLabel: 'Clinical',
  },
  {
    title: 'CAMH Cannabis Policy Framework',
    description:
      "Canada's leading mental health center's evidence-based framework for cannabis policy, clinical practice, and treatment center guidelines.",
    source: 'Centre for Addiction and Mental Health',
    href: 'https://www.camh.ca/en/camh-news-and-stories/cannabis-policy-framework',
    icon: '🍁',
    category: 'clinical',
    categoryLabel: 'Clinical',
  },
  {
    title: 'NSDUH — National Survey on Drug Use and Health',
    description:
      'Annual U.S. national survey covering substance use prevalence, treatment need, and mental health data — the primary epidemiological reference for U.S. treatment planning.',
    source: 'SAMHSA',
    href: 'https://www.samhsa.gov/data/data-we-collect/nsduh-national-survey-drug-use-and-health',
    icon: '📊',
    category: 'government',
    categoryLabel: 'Government',
  },
  {
    title: 'Canadian Cannabis Survey',
    description:
      'Annual tracking survey of Canadian cannabis use patterns, reasons for use, and health outcomes — essential reference for Canadian treatment programs.',
    source: 'Health Canada',
    href: 'https://www.canada.ca/en/health-canada/services/drugs-medication/cannabis/research-data/canadian-cannabis-survey.html',
    icon: '🇨🇦',
    category: 'government',
    categoryLabel: 'Government',
  },
  {
    title: 'CDC Cannabis & Public Health',
    description:
      'Public health data on cannabis use rates, health effects, and state-level trend information — key reference for U.S. prevalence data and risk communication.',
    source: 'Centers for Disease Control and Prevention',
    href: 'https://www.cdc.gov/marijuana/index.html',
    icon: '🏛️',
    category: 'government',
    categoryLabel: 'Government',
  },
  {
    title: 'NIDA Drug Facts: Cannabis (Marijuana)',
    description:
      'Research-backed overview of cannabis pharmacology, use patterns, addiction potential, and treatment evidence — authoritative federal reference.',
    source: 'National Institute on Drug Abuse',
    href: 'https://nida.nih.gov/publications/drugfacts/cannabis-marijuana',
    icon: '🔬',
    category: 'government',
    categoryLabel: 'Government',
  },
  {
    title: 'NIDA Research Report: Cannabis (Marijuana)',
    description:
      'Comprehensive research summaries on cannabis addiction, health effects, and treatment outcomes — regularly updated with the latest NIH-funded findings.',
    source: 'National Institute on Drug Abuse',
    href: 'https://nida.nih.gov/research-topics/cannabis-marijuana',
    icon: '🧪',
    category: 'research',
    categoryLabel: 'Research',
  },
  {
    title: 'Journal of Addiction Medicine',
    description:
      'Peer-reviewed research on addiction medicine — including cannabis use disorder treatment studies, pharmacotherapy trials, and behavioral intervention outcomes.',
    source: 'American Society of Addiction Medicine',
    href: 'https://journals.lww.com/journaladdictionmedicine/',
    icon: '📄',
    category: 'research',
    categoryLabel: 'Research',
  },
  {
    title: 'CAMH Research: Cannabis',
    description:
      "Canadian research on cannabis use, mental health impacts, and population-level treatment data from North America's largest addiction research center.",
    source: 'Centre for Addiction and Mental Health',
    href: 'https://www.camh.ca/en/science-and-research/institutes-and-centres/institute-for-mental-health-policy-research/key-areas-of-research/cannabis',
    icon: '🍁',
    category: 'research',
    categoryLabel: 'Research',
  },
  {
    title: 'Substance Use & Misuse Journal',
    description:
      'International peer-reviewed journal covering addiction research, harm reduction strategies, and cannabis treatment outcomes across diverse populations.',
    source: 'Taylor & Francis',
    href: 'https://www.tandfonline.com/journals/isum20',
    icon: '📚',
    category: 'research',
    categoryLabel: 'Research',
  },
  {
    title: 'Know the Risks of Marijuana',
    description:
      'Plain-language patient resources on cannabis risks, dependency signs, and how to find treatment — suitable for sharing directly with clients in your program.',
    source: 'SAMHSA',
    href: 'https://www.samhsa.gov/marijuana',
    icon: '🫂',
    category: 'patient',
    categoryLabel: 'Patient Ed',
  },
  {
    title: 'Cannabis and Your Health',
    description:
      'Official Canadian patient-facing information on cannabis health effects, risks, and dependency — available in English and French for bilingual programs.',
    source: 'Health Canada',
    href: 'https://www.canada.ca/en/health-canada/services/drugs-medication/cannabis/health-effects.html',
    icon: '🇨🇦',
    category: 'patient',
    categoryLabel: 'Patient Ed',
  },
  {
    title: 'NIDA for Teens: Marijuana',
    description:
      'Accessible, evidence-based cannabis education for adolescent clients — designed for youth-serving treatment programs and school-based prevention efforts.',
    source: 'National Institute on Drug Abuse',
    href: 'https://teens.drugabuse.gov/drug-facts/marijuana',
    icon: '🧑‍🎓',
    category: 'patient',
    categoryLabel: 'Patient Ed',
  },
  {
    title: 'Marijuana Anonymous',
    description:
      "12-step peer support community for cannabis use disorder — a free resource for treatment centers to share as part of a client's recovery support plan.",
    source: 'Marijuana Anonymous',
    href: 'https://marijuana-anonymous.org/',
    icon: '🤝',
    category: 'patient',
    categoryLabel: 'Patient Ed',
  },
  {
    title: 'NAADAC — Association for Addiction Professionals',
    description:
      'The leading membership organization for addiction counselors — offers CEUs, credentialing (NCAC, MAC), ethics guidance, and clinical practice resources.',
    source: 'NAADAC',
    href: 'https://www.naadac.org/',
    icon: '🏅',
    category: 'orgs',
    categoryLabel: 'Professional Orgs',
  },
  {
    title: 'ASAM — American Society of Addiction Medicine',
    description:
      'Physician-focused addiction medicine society — ASAM Criteria for level of care, clinical guidelines, and board certification for addiction specialists.',
    source: 'ASAM',
    href: 'https://www.asam.org/',
    icon: '⚕️',
    category: 'orgs',
    categoryLabel: 'Professional Orgs',
  },
  {
    title: 'CSAM — Canadian Society of Addiction Medicine',
    description:
      "Canada's primary professional organization for addiction medicine physicians and treatment specialists — clinical resources, education, and national advocacy.",
    source: 'CSAM',
    href: 'https://csam-smca.org/',
    icon: '🍁',
    category: 'orgs',
    categoryLabel: 'Professional Orgs',
  },
  {
    title: 'NAATP — National Association of Addiction Treatment Providers',
    description:
      'Membership organization for addiction treatment facilities — advocacy, ethical treatment standards, accreditation resources, and industry best practices.',
    source: 'NAATP',
    href: 'https://www.naatp.org/',
    icon: '🏢',
    category: 'orgs',
    categoryLabel: 'Professional Orgs',
  },
];
