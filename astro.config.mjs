// @ts-check
import fs from 'node:fs';
import path from 'node:path';

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { GALLERY_ITEMS } from './src/consts.ts';

/** @returns {Record<string, string>} slug path → YYYY-MM-DD */
function blogLastmods() {
  const dir = path.join(process.cwd(), 'src/content/blog');
  /** @type {Record<string, string>} */
  const map = {};
  if (!fs.existsSync(dir)) return map;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    const slug = file.replace(/\.mdx?$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) continue;
    const updated = fm[1].match(/^updatedDate:\s*["']?([^"'\n]+)/m);
    const pub = fm[1].match(/^pubDate:\s*["']?([^"'\n]+)/m);
    const d = (updated?.[1] || pub?.[1] || '').trim().slice(0, 10);
    if (d) map[`/blog/${slug}`] = d;
  }
  return map;
}

const BLOG_LASTMOD = blogLastmods();
const SITE = 'https://scottdillinghamminiatures.com';

/** image:image entries: real photo files under public/ only.
 * @param {string[]} srcs
 * @returns {import('sitemap').Img[]} */
function sitemapImages(srcs) {
  return srcs
    .filter((src) => src.startsWith('/') && fs.existsSync(path.join(process.cwd(), 'public', src)))
    .map((src) => ({ url: `${SITE}${src}` }));
}

const GALLERY_IMAGES = sitemapImages(GALLERY_ITEMS.flatMap((item) => item.images));
/** @type {Record<string, import('sitemap').Img[]>} */
const PIECE_IMAGES = Object.fromEntries(
  GALLERY_ITEMS.map((item) => [`/gallery/${item.id}`, sitemapImages(item.images)]),
);
/** Core pages: last real content change, not every deploy.
 * @type {Record<string, string>} */
const PAGE_LASTMOD = {
  '/': '2026-10-01',
  '/gallery': '2026-10-01',
  '/workshop': '2026-09-07',
  '/about': '2026-08-31',
  '/blog': '2026-09-07',
  '/contact': '2026-10-01',
  '/commissions': '2026-10-01',
  '/visit': '2026-10-01',
  '/image-license': '2026-08-31',
  '/privacy-policy': '2025-01-14',
  '/terms-of-service': '2025-01-14',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://scottdillinghamminiatures.com',
  trailingSlash: 'always',
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: 'node',
  }),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/api/') &&
        !page.includes('/rss.xml') &&
        !page.includes('/message-sent'),
      serialize: (item) => {
        const url = item.url.replace(/\/$/, '') || 'https://scottdillinghamminiatures.com';
        const weekly = /** @type {import('sitemap').EnumChangefreq} */ ('weekly');
        const monthly = /** @type {import('sitemap').EnumChangefreq} */ ('monthly');
        const pathname = url.replace('https://scottdillinghamminiatures.com', '') || '/';
        const lastmod =
          BLOG_LASTMOD[pathname] || PAGE_LASTMOD[pathname] || undefined;

        if (url === 'https://scottdillinghamminiatures.com') {
          return { ...item, changefreq: weekly, priority: 1.0, lastmod };
        }
        if (url.endsWith('/gallery')) {
          return { ...item, changefreq: weekly, priority: 0.9, lastmod, img: GALLERY_IMAGES };
        }
        if (/\/gallery\/[^/]+$/.test(pathname)) {
          return {
            ...item,
            changefreq: monthly,
            priority: 0.8,
            lastmod: PAGE_LASTMOD['/gallery'],
            img: PIECE_IMAGES[pathname] || [],
          };
        }
        if (pathname === '/commissions' || pathname === '/visit') {
          return { ...item, changefreq: monthly, priority: 0.8, lastmod };
        }
        if (url.endsWith('/workshop') || url.endsWith('/about')) {
          return { ...item, changefreq: monthly, priority: 0.8, lastmod };
        }
        if (url.endsWith('/blog')) {
          return { ...item, changefreq: weekly, priority: 0.8, lastmod };
        }
        if (url.includes('/blog/')) {
          return { ...item, changefreq: monthly, priority: 0.65, lastmod };
        }
        if (url.endsWith('/contact')) {
          return { ...item, changefreq: monthly, priority: 0.7, lastmod };
        }
        if (
          url.endsWith('/image-license') ||
          url.endsWith('/privacy-policy') ||
          url.endsWith('/terms-of-service')
        ) {
          return { ...item, changefreq: monthly, priority: 0.5, lastmod };
        }
        return { ...item, changefreq: monthly, priority: 0.5, lastmod };
      },
    }),
    react(),
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          },
        },
      },
    },
  },
});
