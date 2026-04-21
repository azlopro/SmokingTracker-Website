#!/usr/bin/env node
/**
 * Extract <style>...</style> blocks from <head> after the main stylesheet link.
 * Writes src/fragments/<basename>-head.html (may be empty file if none).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const [, , htmlFile, baseName] = process.argv;
if (!htmlFile || !baseName) {
  console.error('Usage: node scripts/extract-head-styles.mjs <file.html> <basename>');
  process.exit(1);
}
const htmlPath = path.join(root, htmlFile);
const html = fs.readFileSync(htmlPath, 'utf-8');
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
let blocks = '';
if (headMatch) {
  let headInner = headMatch[1];
  const linkIdx = headInner.indexOf('<link rel="stylesheet" href="/style.css"');
  if (linkIdx !== -1) {
    headInner = headInner.slice(linkIdx);
    const endFirstLink = headInner.indexOf('>');
    headInner = headInner.slice(endFirstLink + 1);
  }
  const re = /<style>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(headInner)) !== null) {
    const body = m[1].trim();
    if (!body) continue;
    // Skip global FOUC-only snippet (still in BaseLayout when hideUntilLoad)
    if (body === 'html{visibility:hidden}' || body === 'html{visibility: hidden}') continue;
    blocks += `<style>\n${body}\n</style>\n`;
  }
}
const outDir = path.join(root, 'src', 'fragments');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${baseName}-head.html`);
fs.writeFileSync(out, blocks);
console.log('Wrote', path.relative(root, out), `(${blocks.length} chars)`);
