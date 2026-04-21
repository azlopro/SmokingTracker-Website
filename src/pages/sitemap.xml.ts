import { getCollection } from 'astro:content';

export const prerender = true;

const site = 'https://www.smokingtracker.com';

const staticPages = [
  '/',
  '/about.html',
  '/cannabis-cognitive-fog.html',
  '/clinical-reports.html',
  '/cud-application.html',
  '/dpa.html',
  '/ema-logging.html',
  '/faq.html',
  '/features.html',
  '/for-clinicians.html',
  '/for-individuals.html',
  '/getting-started-guide.html',
  '/individual-signup.html',
  '/knowledge-base.html',
  '/measurement-based-care.html',
  '/practitioner-dashboard.html',
  '/pricing.html',
  '/privacy.html',
  '/privacy-compliance.html',
  '/resources.html',
  '/security.html',
  '/terms.html',
  '/trial.html',
];

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const posts = await getCollection('blog');
  const postEntries = posts
    .filter((post) => post.data.lang === 'en')
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(
      (post) => `  <url>
    <loc>${escapeXml(`${site}/posts/${post.slug}.html`)}</loc>
    <lastmod>${post.data.date}</lastmod>
  </url>`,
    );

  const pageEntries = staticPages.map(
    (path) => `  <url>
    <loc>${escapeXml(`${site}${path}`)}</loc>
  </url>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pageEntries, ...postEntries].join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
