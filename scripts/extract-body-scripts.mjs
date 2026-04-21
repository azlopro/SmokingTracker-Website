#!/usr/bin/env node
/**
 * Extract everything between </footer> and </body> (typically scripts).
 * Writes src/fragments/<basename>-scripts.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const [, , htmlFile, baseName] = process.argv;
if (!htmlFile || !baseName) {
  console.error('Usage: node scripts/extract-body-scripts.mjs <file.html> <basename>');
  process.exit(1);
}
const htmlPath = path.join(root, htmlFile);
const html = fs.readFileSync(htmlPath, 'utf-8');
const foot = html.lastIndexOf('</footer>');
if (foot === -1) {
  console.error('No </footer> in', htmlFile);
  process.exit(1);
}
const afterFoot = html.slice(foot + '</footer>'.length);
const bodyEnd = afterFoot.lastIndexOf('</body>');
const chunk = bodyEnd === -1 ? afterFoot : afterFoot.slice(0, bodyEnd);
const trimmed = chunk.trim();
const outDir = path.join(root, 'src', 'fragments');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${baseName}-scripts.html`);
fs.writeFileSync(out, trimmed ? trimmed + '\n' : '');
console.log('Wrote', path.relative(root, out), `(${trimmed.length} chars)`);
