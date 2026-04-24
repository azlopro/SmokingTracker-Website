import { getCollection } from 'astro:content';

export const prerender = true;

const site = 'https://www.smokingtracker.com';

type PageMeta = { path: string; priority: string; changefreq: string };

const staticPages: PageMeta[] = [
  { path: '/',                          priority: '1.0', changefreq: 'weekly'  },
  { path: '/for-clinicians.html',       priority: '0.9', changefreq: 'weekly'  },
  { path: '/for-individuals.html',      priority: '0.9', changefreq: 'weekly'  },
  { path: '/features.html',             priority: '0.9', changefreq: 'weekly'  },
  { path: '/trial.html',                priority: '0.9', changefreq: 'weekly'  },
  { path: '/ema-logging.html',          priority: '0.8', changefreq: 'monthly' },
  { path: '/practitioner-dashboard.html', priority: '0.8', changefreq: 'monthly' },
  { path: '/clinical-reports.html',     priority: '0.8', changefreq: 'monthly' },
  { path: '/measurement-based-care.html', priority: '0.8', changefreq: 'monthly' },
  { path: '/cannabis-cognitive-fog.html', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy-compliance.html',   priority: '0.8', changefreq: 'monthly' },
  { path: '/about.html',                priority: '0.6', changefreq: 'monthly' },
  { path: '/pricing.html',              priority: '0.6', changefreq: 'monthly' },
  { path: '/faq.html',                  priority: '0.6', changefreq: 'monthly' },
  { path: '/resources.html',            priority: '0.6', changefreq: 'monthly' },
  { path: '/knowledge-base.html',       priority: '0.6', changefreq: 'weekly'  },
  { path: '/getting-started-guide.html', priority: '0.5', changefreq: 'monthly' },
  { path: '/individual-signup.html',    priority: '0.5', changefreq: 'monthly' },
  { path: '/cud-application.html',      priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy.html',              priority: '0.3', changefreq: 'yearly'  },
  { path: '/terms.html',                priority: '0.3', changefreq: 'yearly'  },
  { path: '/security.html',             priority: '0.4', changefreq: 'yearly'  },
  { path: '/dpa.html',                  priority: '0.3', changefreq: 'yearly'  },
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
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    );

  const pageEntries = staticPages.map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${escapeXml(`${site}${path}`)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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
