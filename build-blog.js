#!/usr/bin/env node
/**
 * build-blog.js — Generates blog pages from markdown posts.
 *
 * Reads .md files from posts/, parses frontmatter + body,
 * generates public/posts.json (index) and posts/<slug>.html pages.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_DIR = path.join(__dirname, 'posts-html');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// Configure marked for clean HTML output
marked.setOptions({
    gfm: true,
    breaks: true,
});

/**
 * Read the shared HTML template for blog posts.
 */
function getPostTemplate() {
    return `<!doctype html>
<html lang="{{lang}}">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}} - SmokingTracker</title>
    <meta name="description" content="{{description}}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="progress-container">
        <div class="progress-bar" id="myBar"></div>
    </div>

    <nav class="navbar glass">
        <div class="nav-container">
            <a href="/" class="logo">
                <img src="/logo.png" alt="SmokingTracker Logo" class="logo-img">
                <span class="logo-text">SmokingTracker</span>
            </a>
            <div class="nav-links">
                <a href="/#features" data-i18n="nav.features">Features</a>
                <a href="/#how-it-works" data-i18n="nav.howItWorks">How It Works</a>
                <a href="/pricing.html" data-i18n="nav.pricing">Pricing</a>
                <a href="/about.html" data-i18n="nav.about">About</a>
                <a href="/blog.html" data-i18n="nav.blog">Blog</a>
            </div>
            <div class="nav-actions">
                <a href="/trial.html" class="btn btn-primary" data-i18n="nav.bookDemo">Book a Demo</a>
                <button class="mobile-menu-btn icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="4" x2="20" y1="12" y2="12" />
                        <line x1="4" x2="20" y1="6" y2="6" />
                        <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    </nav>

    <main class="page-header-spacing">
        <article class="post-container">
            <header class="post-header fade-in-up">
                <div class="post-meta">
                    <a href="/blog.html" class="back-link"><svg xmlns="http://www.w3.org/2000/svg" width="16"
                            height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg> {{backText}}</a>
                    <div class="meta-tags">
                        <span class="blog-category">{{category}}</span>
                        <span class="blog-date">{{dateFormatted}}</span>
                        <span class="read-time">{{readTime}}</span>
                    </div>
                </div>
                <h1 class="post-title">{{title}}</h1>
                <p class="post-subtitle">{{description}}</p>
                <div class="post-author">
                    <div class="author-info">
                        <strong>{{author}}</strong>
                    </div>
                </div>
            </header>
            {{imageHTML}}
            <div class="post-content fade-in-up" style="animation-delay: 0.3s">
                {{content}}

                <hr>
                <div class="post-footer">
                    <h3>{{shareText}}</h3>
                    <div class="share-links">
                        <button class="btn btn-outline" onclick="window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(document.title), '_blank')">Twitter</button>
                        <button class="btn btn-outline" onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href), '_blank')">LinkedIn</button>
                        <button class="btn btn-outline" onclick="navigator.clipboard.writeText(window.location.href).then(() => this.textContent = '{{copiedText}}')">{{copyText}}</button>
                    </div>
                </div>
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="container footer-content">
            <div class="footer-brand">
                <a href="/" class="logo">
                    <img src="/logo.png" alt="SmokingTracker Logo" class="logo-img">
                    <span class="logo-text">SmokingTracker</span>
                </a>
                <p data-i18n="footer.desc">Helping treatment centers deliver proactive, data-driven support while fully respecting client privacy.</p>
            </div>
            <div class="footer-links">
                <div class="link-group">
                    <h4 data-i18n="footer.product">Product</h4>
                    <a href="/#features" data-i18n="nav.features">Features</a>
                    <a href="/#how-it-works" data-i18n="nav.howItWorks">How It Works</a>
                    <a href="/pricing.html" data-i18n="nav.pricing">Pricing</a>
                    <a href="/faq.html" data-i18n="nav.faq">FAQ</a>
                    <a href="/about.html" data-i18n="nav.about">About</a>
                    <a href="/blog.html" data-i18n="nav.blog">Blog</a>
                </div>
                <div class="link-group">
                    <h4 data-i18n="footer.legal">Legal</h4>
                    <a href="#" data-i18n="footer.privacy">Privacy Policy</a>
                    <a href="#" data-i18n="footer.terms">Terms of Service</a>
                </div>
                <div class="link-group">
                    <h4 data-i18n="footer.connect">Connect</h4>
                    <a href="mailto:support@smokingtracker.com" data-i18n="footer.contact">Contact Sales</a>
                </div>
            </div>
        </div>
        <div class="container footer-bottom">
            <p>&copy; 2026 SmokingTracker. All rights reserved.</p>
        </div>
    </footer>
    <script type="module" src="/main.js"></script>
    <script>
        // Scroll progress bar
        window.onscroll = function () {
            var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = (winScroll / height) * 100;
            document.getElementById("myBar").style.width = scrolled + "%";
        }

    </script>
</body>
</html>`;
}

/**
 * Format a date string like "2026-10-24" to "24. okt 2026" (DA) or "Oct 24, 2026" (EN)
 */
function formatDate(dateStr, lang = 'da') {
    const d = new Date(dateStr + 'T00:00:00');
    if (lang === 'en') {
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Derive a URL slug from a filename: "my-great-post.md" → "my-great-post"
 */
function slugFromFilename(filename) {
    return path.basename(filename, '.md');
}

// ── Main ────────────────────────────────────────────────────────────

const mdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();

if (mdFiles.length === 0) {
    console.log('⚠️  No markdown files found in posts/');
    // Write empty index
    fs.writeFileSync(path.join(PUBLIC_DIR, 'posts.json'), '[]');
    process.exit(0);
}

const posts = [];
const template = getPostTemplate();

for (const file of mdFiles) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data: front, content: mdContent } = matter(raw);

    const slug = slugFromFilename(file);
    const htmlContent = marked.parse(mdContent);
    const dateFormatted = formatDate(front.date, front.lang);

    // Build the individual post HTML page
    const isEn = front.lang === 'en';
    const imageHTML = front.image ? `<img src="${front.image}" alt="${front.title || slug}" class="post-hero-image fade-in-up" style="animation-delay: 0.2s">` : '';
    let page = template
        .replace(/\{\{title\}\}/g, front.title || slug)
        .replace(/\{\{description\}\}/g, front.description || '')
        .replace(/\{\{category\}\}/g, front.category || '')
        .replace(/\{\{dateFormatted\}\}/g, dateFormatted)
        .replace(/\{\{readTime\}\}/g, front.readTime || '5 min')
        .replace(/\{\{author\}\}/g, front.author || 'SmokingTracker Team')
        .replace(/\{\{lang\}\}/g, front.lang || 'da')
        .replace(/\{\{pair\}\}/g, front.pair || '')
        .replace(/\{\{backText\}\}/g, isEn ? 'Back to blog' : 'Tilbage til blog')
        .replace(/\{\{shareText\}\}/g, isEn ? 'Share this article' : 'Del denne artikel')
        .replace(/\{\{copyText\}\}/g, isEn ? 'Copy link' : 'Kopiér link')
        .replace(/\{\{copiedText\}\}/g, isEn ? 'Copied!' : 'Kopieret!')
        .replace(/\{\{imageHTML\}\}/g, imageHTML)
        .replace(/\{\{content\}\}/g, htmlContent);

    const outFile = path.join(OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(outFile, page);
    console.log(`  ✅ ${slug}.html`);

    posts.push({
        slug,
        title: front.title,
        description: front.description || '',
        image: front.image || null,
        category: front.category || '',
        date: front.date,
        dateFormatted,
        author: front.author || 'SmokingTracker Team',
        readTime: front.readTime || '5 min',
        lang: front.lang || 'da',
        featured: front.featured || false,
    });
}

// Sort newest first
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write posts index
fs.writeFileSync(path.join(PUBLIC_DIR, 'posts.json'), JSON.stringify(posts, null, 2));
console.log(`\n📝 Generated ${posts.length} posts → public/posts.json`);
console.log('✅ Blog build complete!\n');
