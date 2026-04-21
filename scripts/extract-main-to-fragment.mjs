#!/usr/bin/env node
/**
 * One-off helper: extract <main>...</main> inner HTML into src/fragments/<name>-main.html
 * Usage: node scripts/extract-main-to-fragment.mjs <root-html-file> <fragment-basename>
 * Example: node scripts/extract-main-to-fragment.mjs about.html about
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const [, , htmlFile, baseName] = process.argv;
if (!htmlFile || !baseName) {
  console.error('Usage: node scripts/extract-main-to-fragment.mjs <file.html> <basename>');
  process.exit(1);
}
const htmlPath = path.join(root, htmlFile);
const html = fs.readFileSync(htmlPath, 'utf-8');
let inner;
const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (m) {
  inner = m[1];
} else {
  const navMatch = html.match(/<\/nav>\s*/i);
  const footMatch = html.match(/<footer\b/i);
  if (!navMatch || footMatch?.index == null || footMatch.index <= navMatch.index) {
    console.error('No <main> and no </nav>…<footer> region in', htmlFile);
    process.exit(1);
  }
  const start = navMatch.index + navMatch[0].length;
  inner = html.slice(start, footMatch.index);
}
const outDir = path.join(root, 'src', 'fragments');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${baseName}-main.html`);
fs.writeFileSync(out, inner.trim() + '\n');
console.log('Wrote', path.relative(root, out));
