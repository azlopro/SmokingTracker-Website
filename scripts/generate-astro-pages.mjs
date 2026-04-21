#!/usr/bin/env node
/**
 * Generates src/pages/<slug>.astro from fragments + src/data/page-seo.json (titles and meta).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const pageSeo = JSON.parse(fs.readFileSync(path.join(root, 'src/data/page-seo.json'), 'utf-8'));

/** @type {Record<string, Partial<{ showCta: boolean; includeMainJs: boolean; extraModuleScripts: string[]; activeNav: string; footerVariant: 'full'|'blog'; navVariant: 'marketing'|'blog'; bodyClass: string; customFooter: boolean; skipHead: boolean; skipScripts: boolean; headExtraAstro: string }>>} */
const overrides = {
  features: {
    showCta: false,
    includeMainJs: false,
    activeNav: 'features',
    bodyClass: 'dark-theme',
    customFooter: true,
  },
  trial: {
    showCta: false,
    includeMainJs: true,
    extraModuleScripts: ['/trial.js'],
    activeNav: '',
    footerVariant: 'blog',
    navVariant: 'marketing',
  },
  pricing: {
    showCta: false,
    includeMainJs: true,
    activeNav: 'pricing',
  },
  faq: {
    showCta: false,
    includeMainJs: true,
    activeNav: '',
  },
  'for-clinicians': {
    showCta: true,
    includeMainJs: true,
    activeNav: 'for-clinicians',
  },
  'for-individuals': {
    showCta: true,
    includeMainJs: true,
    activeNav: 'for-individuals',
  },
  privacy: { showCta: false, includeMainJs: false, activeNav: '' },
  terms: { showCta: false, includeMainJs: false, activeNav: '' },
  security: { showCta: false, includeMainJs: false, activeNav: '' },
  dpa: { showCta: false, includeMainJs: false, activeNav: '' },
  'ema-logging': { showCta: true, includeMainJs: false, activeNav: 'ema-logging' },
  'practitioner-dashboard': { showCta: true, includeMainJs: false, activeNav: 'practitioner-dashboard' },
  'clinical-reports': { showCta: true, includeMainJs: false, activeNav: 'clinical-reports' },
  'measurement-based-care': { showCta: true, includeMainJs: false, activeNav: 'measurement-based-care' },
  'privacy-compliance': { showCta: true, includeMainJs: false, activeNav: 'privacy-compliance' },
  'cannabis-cognitive-fog': { showCta: true, includeMainJs: false, activeNav: 'cannabis-cognitive-fog' },
  resources: { showCta: false, includeMainJs: true, activeNav: 'resources', navVariant: 'blog' },
  'individual-signup': {
    showCta: false,
    includeMainJs: false,
    extraModuleScripts: ['/individual-signup.js'],
    activeNav: 'for-individuals',
  },
  'cud-application': {
    showCta: false,
    includeMainJs: false,
    extraModuleScripts: ['/cud-application.js'],
    activeNav: 'for-individuals',
  },
};

const pages = [
  'about',
  'features',
  'pricing',
  'faq',
  'for-clinicians',
  'for-individuals',
  'trial',
  'privacy',
  'terms',
  'security',
  'dpa',
  'ema-logging',
  'practitioner-dashboard',
  'clinical-reports',
  'measurement-based-care',
  'privacy-compliance',
  'cannabis-cognitive-fog',
  'resources',
  'individual-signup',
  'cud-application',
];

function activeFromSlug(slug) {
  if (slug === 'about') return 'about';
  return overrides[slug]?.activeNav ?? slug;
}

fs.mkdirSync(path.join(root, 'src', 'pages'), { recursive: true });

for (const slug of pages) {
  const meta = pageSeo[slug];
  if (!meta) {
    console.error('Missing SEO entry for', slug);
    process.exit(1);
  }
  const { title, description, ogTitle, ogDescription } = meta;
  const o = overrides[slug] ?? {};
  const showCta = o.showCta ?? true;
  const includeMainJs = o.includeMainJs ?? false;
  const extra = o.extraModuleScripts ?? [];
  const extraStr = extra.length ? JSON.stringify(extra) : '[]';
  const activeNav = activeFromSlug(slug);
  const footerVariant = o.footerVariant ?? 'full';
  const navVariant = o.navVariant ?? 'marketing';
  const bodyClass = o.bodyClass !== undefined ? o.bodyClass : 'light-theme';
  const customFooter = o.customFooter ?? false;

  const fragBase = path.join(root, 'src', 'fragments', slug);
  const hasHead = fs.existsSync(`${fragBase}-head.html`) && fs.readFileSync(`${fragBase}-head.html`, 'utf-8').trim();
  const hasScripts =
    fs.existsSync(`${fragBase}-scripts.html`) && fs.readFileSync(`${fragBase}-scripts.html`, 'utf-8').trim();

  const imports = [
    `import BaseLayout from '../layouts/BaseLayout.astro';`,
    `import mainHtml from '../fragments/${slug}-main.html?raw';`,
  ];
  if (hasHead) imports.push(`import headHtml from '../fragments/${slug}-head.html?raw';`);
  if (hasScripts) imports.push(`import scriptsHtml from '../fragments/${slug}-scripts.html?raw';`);
  if (customFooter) imports.push(`import footerHtml from '../fragments/${slug}-footer.html?raw';`);

  let headSlot = '';
  if (slug === 'for-clinicians') {
    headSlot = `
  <div slot="head" style="display:contents">
    <link rel="preload" as="image" imagesrcset="/images/en_behandler_patient_calendar-mobile.webp 1280w, /images/en_behandler_patient_calendar.webp 1920w" imagesizes="(max-width: 900px) 100vw, 1280px" type="image/webp" />
    ${hasHead ? '<div style="display:contents" set:html={headHtml} />' : ''}
  </div>`;
  } else if (hasHead) {
    headSlot = `
  <div slot="head" style="display:contents" set:html={headHtml} />`;
  }

  let footerSlot = '';
  if (customFooter) {
    footerSlot = `
  <div slot="footer" style="display:contents" set:html={footerHtml} />`;
  }

  const scriptsSlot = hasScripts
    ? `
  <div slot="scripts" set:html={scriptsHtml} />`
    : '';

  const out = `---
${imports.join('\n')}
const title = ${JSON.stringify(title)};
const description = ${JSON.stringify(description)};
const ogTitle = ${JSON.stringify(ogTitle)};
const ogDescription = ${JSON.stringify(ogDescription)};
---
<BaseLayout
  title={title}
  description={description}
  canonicalPath="${`/${slug}.html`}"
  ogTitle={ogTitle}
  ogDescription={ogDescription}
  activeNav={${JSON.stringify(activeNav)}}
  navVariant={${JSON.stringify(navVariant)}}
  footerVariant={${JSON.stringify(footerVariant)}}
  bodyClass={${JSON.stringify(bodyClass)}}
  showCta={${showCta ? 'true' : 'false'}}
  includeMainJs={${includeMainJs ? 'true' : 'false'}}
  extraModuleScripts={${extraStr}}
  hideUntilLoad={true}
>${headSlot}
  <div style="display:contents" set:html={mainHtml} />${footerSlot}${scriptsSlot}
</BaseLayout>
`;
  const outPath = path.join(root, 'src', 'pages', `${slug}.astro`);
  fs.writeFileSync(outPath, out);
  console.log('Wrote', path.relative(root, outPath));
}
