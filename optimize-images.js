import { execSync } from 'child_process';
import { statSync, existsSync, mkdirSync } from 'fs';
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
const pubImg = (name) => resolve(__dirname, 'public', 'images', name);

// Ensure public/images exists
mkdirSync(resolve(__dirname, 'public', 'images'), { recursive: true });

console.log('\nConverting app screenshots...');
convert(img('en_tracker_home_calendar.png'),            pub('app-kalender.webp'));
convert(img('en_tracker_onboarding_step1_methods.png'), pub('app-registrer-session.webp'));
convert(img('en_tracker_statistics.png'),               pub('app-indsigt.webp'));
convert(img('en_tracker_achievements.png'),             pub('app-praestationer.webp'));
convert(img('en_tracker_settings_preferences.png'),     pub('app-samtykke.webp'));
convert(img('en_behandler_patient_list.png'),           pub('behandler-preview.webp'));

console.log('\nConverting hero carousel images to public/images/...');
convert(img('en_behandler_patient_calendar.png'),       pubImg('en_behandler_patient_calendar.webp'));
convert(img('en_behandler_analytics_time_of_day.png'),  pubImg('en_behandler_analytics_time_of_day.webp'));
convert(img('en_behandler_analytics_social.png'),       pubImg('en_behandler_analytics_social.webp'));
convert(img('en_behandler_patient_list.png'),           pubImg('en_behandler_patient_list.webp'));
convert(img('en_behandler_patient_detail.png'),         pubImg('en_behandler_patient_detail.webp'));
convert(img('en_behandler_analytics_mood.png'),         pubImg('en_behandler_analytics_mood.webp'));
convert(img('en_behandler_analytics_methods.png'),      pubImg('en_behandler_analytics_methods.webp'));
convert(img('en_behandler_analytics_notes.png'),        pubImg('en_behandler_analytics_notes.webp'));

console.log('\nConverting app carousel images to public/images/...');
convert(img('en_tracker_log_session_modal.png'),        pubImg('en_tracker_log_session_modal.webp'));
convert(img('en_tracker_home_calendar.png'),            pubImg('en_tracker_home_calendar.webp'));
convert(img('en_tracker_statistics.png'),               pubImg('en_tracker_statistics.webp'));
convert(img('en_tracker_settings_my_counselor.png'),    pubImg('en_tracker_settings_my_counselor.webp'));

console.log('\nConverting logo...');
convert(pub('logo.png'), pub('logo.webp'), 85);

console.log('\nDone.\n');
