import { execSync } from 'child_process';
import { statSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

function convert(src, dest, quality = 82) {
    if (!existsSync(src)) {
        console.warn(`  SKIP (not found): ${src}`);
        return;
    }
    const before = statSync(src).size;
    execSync(`magick "${src}" -quality ${quality} "${dest}"`);
    const after = statSync(dest).size;
    const pct = Math.round((1 - after / before) * 100);
    console.log(`  ${kb(before)} → ${kb(after)} (-${pct}%)  ${dest.replace(__dirname + '/', '')}`);
}

const img = (name) => resolve(__dirname, 'images', name);
const pub = (name) => resolve(__dirname, 'public', name);

console.log('\nConverting screenshots...');
convert(img('en_tracker_home_calendar.png'),          pub('app-kalender.webp'));
convert(img('en_tracker_onboarding_step1_methods.png'), pub('app-registrer-session.webp'));
convert(img('en_tracker_statistics.png'),              pub('app-indsigt.webp'));
convert(img('en_tracker_achievements.png'),            pub('app-praestationer.webp'));
convert(img('en_tracker_settings_preferences.png'),    pub('app-samtykke.webp'));
convert(img('en_behandler_patient_list.png'),          pub('behandler-preview.webp'));

console.log('\nConverting logo...');
convert(pub('logo.png'), pub('logo.webp'), 85);

console.log('\nDone.\n');
