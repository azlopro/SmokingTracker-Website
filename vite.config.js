import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const POSTS_HTML_DIR = resolve(__dirname, 'posts-html');

// Dynamically discover generated post HTML files
function getPostInputs() {
  const inputs = {};
  if (fs.existsSync(POSTS_HTML_DIR)) {
    const files = fs.readdirSync(POSTS_HTML_DIR).filter(f => f.endsWith('.html'));
    files.forEach(file => {
      const name = `post-${file.replace('.html', '')}`;
      inputs[name] = resolve(POSTS_HTML_DIR, file);
    });
  }
  return inputs;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        features: resolve(__dirname, 'features.html'),
        'knowledge-base': resolve(__dirname, 'knowledge-base.html'),
        trial:    resolve(__dirname, 'trial.html'),
        about:    resolve(__dirname, 'about.html'),
        faq:      resolve(__dirname, 'faq.html'),
        pricing:  resolve(__dirname, 'pricing.html'),
        privacy:  resolve(__dirname, 'privacy.html'),
        terms:    resolve(__dirname, 'terms.html'),
        security: resolve(__dirname, 'security.html'),
        dpa:      resolve(__dirname, 'dpa.html'),
        ...getPostInputs(),
      },
    },
  },
  plugins: [
    {
      // Serve /posts/<slug>.html from posts-html/ during dev
      name: 'serve-posts-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/posts/') && req.url?.endsWith('.html')) {
            const slug = req.url.replace('/posts/', '').replace('.html', '');
            const filePath = resolve(POSTS_HTML_DIR, `${slug}.html`);
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      },
    },
    {
      // Copy built post pages from dist/posts-html/ → dist/posts/ after build
      name: 'move-posts-to-dist',
      closeBundle() {
        const distPostsHtml = resolve(__dirname, 'dist', 'posts-html');
        const distPosts = resolve(__dirname, 'dist', 'posts');

        if (fs.existsSync(distPostsHtml)) {
          fs.mkdirSync(distPosts, { recursive: true });
          const files = fs.readdirSync(distPostsHtml);
          for (const file of files) {
            fs.renameSync(
              resolve(distPostsHtml, file),
              resolve(distPosts, file)
            );
          }
          fs.rmdirSync(distPostsHtml);
          console.log(`📂 Moved ${files.length} post(s) → dist/posts/`);
        }
      },
    },
  ],
});
