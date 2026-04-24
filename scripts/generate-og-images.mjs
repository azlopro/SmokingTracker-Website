import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const outDir = join(publicDir, 'og');

mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;
const BG = '#020c07';
const GREEN = '#10b981';
const GREEN_DARK = '#065f46';
const TEXT_PRIMARY = '#ecfdf5';
const TEXT_SECONDARY = '#6ee7b7';

// Wrap text into lines fitting within maxWidth chars (rough estimate at ~18px)
function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

function brandedSvg(title, tagline) {
  const titleLines = wrapText(title, 32);
  const taglineLines = tagline ? wrapText(tagline, 52) : [];

  const titleY = tagline ? 230 : 270;
  const lineHeight = 64;
  const taglineStartY = titleY + titleLines.length * lineHeight + 28;
  const taglineLineHeight = 40;

  const titleSvgLines = titleLines
    .map((line, i) => `<text x="80" y="${titleY + i * lineHeight}" font-size="58" font-weight="700" fill="${TEXT_PRIMARY}" font-family="system-ui,sans-serif">${escXml(line)}</text>`)
    .join('\n');

  const taglineSvgLines = taglineLines
    .map((line, i) => `<text x="80" y="${taglineStartY + i * taglineLineHeight}" font-size="30" font-weight="400" fill="${TEXT_SECONDARY}" font-family="system-ui,sans-serif">${escXml(line)}</text>`)
    .join('\n');

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#041a0e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${GREEN}"/>
      <stop offset="100%" stop-color="${GREEN_DARK}"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- Subtle grid pattern -->
  <rect width="${W}" height="${H}" fill="none" stroke="${GREEN}" stroke-opacity="0.04" stroke-width="1"/>
  <!-- Decorative circle -->
  <circle cx="${W - 120}" cy="120" r="200" fill="${GREEN}" fill-opacity="0.06"/>
  <circle cx="${W - 80}" cy="80" r="120" fill="${GREEN}" fill-opacity="0.04"/>
  <!-- Green accent bar at bottom -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="url(#accent)"/>
  <!-- Green left accent -->
  <rect x="0" y="80" width="4" height="120" fill="${GREEN}" opacity="0.8"/>
  <!-- Title text -->
  ${titleSvgLines}
  <!-- Tagline text -->
  ${taglineSvgLines}
  <!-- Brand name at bottom -->
  <text x="80" y="${H - 28}" font-size="22" font-weight="600" fill="${GREEN}" font-family="system-ui,sans-serif" opacity="0.9">smokingtracker.com</text>
</svg>`;
}

function compositeSvgOverlay(title) {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="strip" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0"/>
      <stop offset="40%" stop-color="${BG}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${GREEN}"/>
      <stop offset="100%" stop-color="${GREEN_DARK}"/>
    </linearGradient>
  </defs>
  <!-- Bottom gradient overlay -->
  <rect width="${W}" height="${H}" fill="url(#strip)"/>
  <!-- Green accent bar -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="url(#accent)"/>
  <!-- Title text at bottom -->
  <text x="60" y="${H - 70}" font-size="46" font-weight="700" fill="${TEXT_PRIMARY}" font-family="system-ui,sans-serif">${escXml(title)}</text>
  <!-- Brand name -->
  <text x="60" y="${H - 28}" font-size="22" font-weight="600" fill="${GREEN}" font-family="system-ui,sans-serif" opacity="0.9">smokingtracker.com</text>
</svg>`;
}

function escXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function branded(outFile, title, tagline) {
  const svg = brandedSvg(title, tagline);
  await sharp(Buffer.from(svg))
    .resize(W, H)
    .webp({ quality: 82 })
    .toFile(join(outDir, outFile));
  console.log(`✓ og/${outFile}`);
}

async function composite(outFile, screenshotPath, title) {
  const overlay = Buffer.from(compositeSvgOverlay(title));
  await sharp(join(publicDir, screenshotPath))
    .resize(W, H, { fit: 'cover', position: 'top' })
    .composite([{ input: overlay, blend: 'over' }])
    .webp({ quality: 82 })
    .toFile(join(outDir, outFile));
  console.log(`✓ og/${outFile}`);
}

async function main() {
  console.log('Generating OG images → public/og/\n');

  await Promise.all([
    // Branded pages
    branded('home.webp', 'SmokingTracker', 'Cannabis habit tracking for individuals & treatment centers'),
    branded('about.webp', 'About SmokingTracker', 'Built with clinical insight — and lived experience'),
    branded('pricing.webp', 'Simple, Transparent Pricing', 'Flexible billing for treatment centers. Free pilot until Oct 2026'),
    branded('faq.webp', 'Frequently Asked Questions', 'Pricing, HIPAA, onboarding, and technical requirements'),
    branded('trial.webp', 'Start Free — SmokingTracker', 'No payment until October 2026. Get your treatment center online today'),
    branded('resources.webp', 'Clinical Resources', 'Curated guidelines for cannabis use disorder treatment'),
    branded('knowledge-base.webp', 'Knowledge Base', 'Clinical insights and evidence for cannabis use disorder'),
    branded('measurement-based-care.webp', 'Measurement-Based Care', 'Track real outcomes with EMA data — not clinical impression'),
    branded('privacy-compliance.webp', 'HIPAA · GDPR · 42 CFR Part 2', 'Privacy by design — the highest standard for substance use data'),
    branded('cannabis-cognitive-fog.webp', 'Cannabis & Memory', 'Why recall-based tracking fails — and what to use instead'),
    branded('security.webp', 'Security & Transparency', 'How we protect client health data at treatment centers'),
    branded('legal.webp', 'SmokingTracker', 'Legal & compliance documentation'),
    branded('getting-started-guide.webp', 'Getting Started', 'Up and running with SmokingTracker in minutes'),
    branded('individual-signup.webp', 'Create Your Account', 'Start tracking your cannabis habits — free, private, no download'),
    branded('cud-application.webp', 'Apply for Free Access', 'No diagnosis required — if $1/month isn\'t possible, just ask'),

    // Screenshot composites
    composite('for-clinicians.webp', 'images/en_behandler_analytics_social.webp', 'SmokingTracker for Clinicians'),
    composite('for-individuals.webp', 'images/en_tracker_statistics.webp', 'Cannabis Habit Tracker'),
    composite('features.webp', 'images/en_behandler_analytics_social.webp', 'Features — SmokingTracker'),
    composite('ema-logging.webp', 'images/en_tracker_log_session_modal.webp', 'EMA Logging — Capture Use in the Moment'),
    composite('practitioner-dashboard.webp', 'images/en_behandler_analytics_social.webp', 'Practitioner Dashboard'),
    composite('clinical-reports.webp', 'images/en_behandler_analytics_notes.webp', 'One-Click Clinical Reports'),
  ]);

  console.log('\nDone. All OG images written to public/og/');
}

main().catch((err) => { console.error(err); process.exit(1); });
