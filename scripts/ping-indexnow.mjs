#!/usr/bin/env node
/**
 * Ping IndexNow after production deploys so Bing/Copilot pick up URLs faster.
 * Reads the key from public/sdm-indexnow-*.txt and URLs from the built sitemap.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://scottdillinghamminiatures.com';
const MAX_URLS = 10_000;

function findKey() {
  const publicDir = join(root, 'public');
  const match = readdirSync(publicDir).find(
    (name) => name.startsWith('sdm-indexnow-') && name.endsWith('.txt'),
  );
  if (!match) return null;
  const key = readFileSync(join(publicDir, match), 'utf8').trim();
  return { key, file: match };
}

function urlsFromSitemap() {
  const urls = new Set([
    `${SITE_URL}/`,
    `${SITE_URL}/gallery`,
    `${SITE_URL}/workshop`,
    `${SITE_URL}/about`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/ai.txt`,
    `${SITE_URL}/sitemap-index.xml`,
  ]);

  const sitemapFiles = [
    join(root, 'dist/client/sitemap-0.xml'),
    join(root, 'dist/client/sitemap-index.xml'),
  ];

  for (const file of sitemapFiles) {
    if (!existsSync(file)) continue;
    const xml = readFileSync(file, 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.add(match[1].trim());
    }
  }

  return [...urls].slice(0, MAX_URLS);
}

const found = findKey();
if (!found) {
  console.log('IndexNow: skipped (no public/sdm-indexnow-*.txt key file)');
  process.exit(0);
}

const urlList = urlsFromSitemap();
const body = {
  host: new URL(SITE_URL).hostname,
  key: found.key,
  keyLocation: `${SITE_URL}/${found.file}`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const text = await res.text().catch(() => '');
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} URLs`);
if (text) console.log(text.slice(0, 500));
if (!res.ok && res.status !== 202) process.exit(1);
