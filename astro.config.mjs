// @ts-check
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://scottdillinghamminiatures.com',
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: 'node',
  }),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('privacy-policy') &&
        !page.includes('terms-of-service') &&
        !page.includes('/404') &&
        !page.includes('/api/') &&
        !page.includes('/rss.xml'),
      serialize: (item) => {
        const url = item.url.replace(/\/$/, '') || 'https://scottdillinghamminiatures.com';
        const weekly = /** @type {import('sitemap').EnumChangefreq} */ ('weekly');
        const monthly = /** @type {import('sitemap').EnumChangefreq} */ ('monthly');
        const lastmod = new Date().toISOString().split('T')[0];

        if (url === 'https://scottdillinghamminiatures.com') {
          return { ...item, changefreq: weekly, priority: 1.0, lastmod };
        }
        if (url.endsWith('/gallery')) {
          return { ...item, changefreq: weekly, priority: 0.9, lastmod };
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
