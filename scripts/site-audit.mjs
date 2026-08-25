#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = 'Scott Dillingham Miniatures';
const args = process.argv.slice(2);
const dirFlag = args.indexOf('--dir');
const urlFlag = args.indexOf('--url');
const distDir = dirFlag >= 0 ? args[dirFlag + 1] : null;
const baseUrl = urlFlag >= 0 ? args[urlFlag + 1] : null;

if (!distDir && !baseUrl) {
  console.error('usage: site-audit.mjs --dir dist/client  OR  --url https://scottdillinghamminiatures.com');
  process.exit(2);
}

const failures = [];
const notes = [];

function fail(msg) {
  failures.push(msg);
}

function titleText(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/&amp;/g, '&').trim() : '';
}

function metaContent(html, name) {
  const re = new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

function brandCount(title) {
  return title.split(BRAND).length - 1;
}

function readPage(path) {
  if (distDir) {
    const file = path === '/' ? join(root, distDir, 'index.html') : join(root, distDir, path.replace(/^\//, ''), 'index.html');
    if (!existsSync(file)) {
      fail(`missing ${file}`);
      return '';
    }
    return readFileSync(file, 'utf8');
  }
  return null;
}

async function fetchPage(path) {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'SDM-site-audit/1.0' },
  });
  const html = await res.text();
  return { status: res.status, url: res.url, html, headers: res.headers };
}

function checkHtml(label, html, { maxTitle = 65, maxDesc = 160, noindex = false, forbid = [] } = {}) {
  const title = titleText(html);
  const desc = metaContent(html, 'description') || '';
  notes.push(`${label} title ${title.length} ${title}`);
  notes.push(`${label} desc ${desc.length}`);
  if (!title) fail(`${label}: missing title`);
  if (title.length > maxTitle) fail(`${label}: title ${title.length} > ${maxTitle} (${title})`);
  if (brandCount(title) > 1) fail(`${label}: brand appears ${brandCount(title)} times in title (${title})`);
  if (desc.length > maxDesc) fail(`${label}: description ${desc.length} > ${maxDesc}`);
  const robots = metaContent(html, 'robots') || '';
  if (noindex && !robots.includes('noindex')) fail(`${label}: expected noindex, got ${robots}`);
  if (!noindex && robots.includes('noindex')) fail(`${label}: unexpected noindex`);
  if (metaContent(html, 'keywords')) fail(`${label}: keywords meta should be removed`);
  for (const needle of forbid) {
    if (html.includes(needle)) fail(`${label}: forbidden "${needle}"`);
  }
}

function checkGalleryConst() {
  const src = readFileSync(join(root, 'src/consts.ts'), 'utf8');
  const blocks = [...src.matchAll(/id:\s*'([^']+)'[\s\S]*?images:\s*\['([^']+)'\]/g)];
  if (blocks.length < 7) fail(`gallery items parsed ${blocks.length}, expected 7`);
  for (const [, id, image] of blocks) {
    const expected = `/images/gallery/${id}.webp`;
    if (image !== expected) fail(`gallery ${id} image ${image} != ${expected}`);
  }
}

function checkRedirects() {
  const file = join(root, 'public/_redirects');
  if (!existsSync(file)) {
    fail('missing public/_redirects');
    return;
  }
  const text = readFileSync(file, 'utf8');
  if (!text.includes('/sitemap.xml') || !text.includes('/sitemap-index.xml')) {
    fail('_redirects must alias /sitemap.xml to /sitemap-index.xml');
  }
  if (!text.includes('/favicon.ico')) {
    fail('_redirects must alias /favicon.ico to /favicon/favicon.ico');
  }
  if (!text.includes('windsor-chair.webp') || !text.includes('maloof-rocking-chair.webp')) {
    fail('_redirects must keep old gallery image URLs');
  }
}

function checkDistExtras() {
  const dir = join(root, distDir);
  const home = readFileSync(join(dir, 'index.html'), 'utf8');
  const styleChars = [...home.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce(
    (n, m) => n + m[1].length,
    0,
  );
  notes.push(`home html ${home.length} inline-css ${styleChars}`);
  if (home.includes('ClientRouter')) fail('homepage still ships ClientRouter');
  const nf = join(dir, '404.html');
  if (existsSync(nf)) {
    const html = readFileSync(nf, 'utf8');
    if (html.includes('astro-island')) fail('404.html hydrates an astro-island');
  }
  const blog = join(dir, 'blog/index.html');
  if (existsSync(blog)) {
    const html = readFileSync(blog, 'utf8');
    const size = statSync(blog).size;
    notes.push(`blog index ${size}`);
    if (html.includes('Start a Commission')) fail('blog index still shows the commission CTA');
    if (size > 150000) fail(`blog index ${size} bytes, expected under 150000`);
    const props = html.match(/props="([^"]*)"/);
    if (props && props[1].length > 80000) {
      fail(`blog island props ${props[1].length} chars, listing is shipping full posts`);
    }
  }
  const gallery = join(dir, 'gallery/index.html');
  if (existsSync(gallery)) {
    const html = readFileSync(gallery, 'utf8');
    for (const id of [
      'tall-case-clock',
      'highboy-dresser',
      'four-poster-bed',
      'maloof-rocking-chair',
      'hepplewhite-shield-back-chair',
      'moser-continuous-arm-chair',
      'shaker-d-ring-table',
    ]) {
      if (!html.includes(`/images/gallery/${id}.webp`)) {
        fail(`gallery html missing /images/gallery/${id}.webp`);
      }
    }
  }
}

checkGalleryConst();
checkRedirects();

if (distDir) {
  checkHtml('home', readPage('/'), { maxTitle: 65, maxDesc: 160, forbid: ['ClientRouter'] });
  checkHtml('gallery', readPage('/gallery'), { maxTitle: 70, maxDesc: 170 });
  checkHtml('about', readPage('/about'), { maxTitle: 70, maxDesc: 170 });
  checkHtml('workshop', readPage('/workshop'), { maxTitle: 70, maxDesc: 170 });
  checkHtml('blog', readPage('/blog'), { maxTitle: 70, maxDesc: 170 });
  checkHtml('contact', readPage('/contact'), { maxTitle: 70, maxDesc: 170 });
  checkHtml('privacy', readPage('/privacy-policy'), { maxTitle: 70, maxDesc: 170, noindex: true });
  checkHtml('terms', readPage('/terms-of-service'), { maxTitle: 70, maxDesc: 170, noindex: true });
  const nf = join(root, distDir, '404.html');
  if (existsSync(nf)) {
    const html = readFileSync(nf, 'utf8');
    checkHtml('404', html, { maxTitle: 70, maxDesc: 170, noindex: true });
    if (/rel="canonical"/i.test(html)) fail('404.html must not emit a canonical URL');
  }
  checkDistExtras();
}

if (baseUrl) {
  const pages = [
    ['home', '/'],
    ['gallery', '/gallery/'],
    ['about', '/about/'],
    ['workshop', '/workshop/'],
    ['blog', '/blog/'],
    ['contact', '/contact/'],
  ];
  for (const [label, path] of pages) {
    const page = await fetchPage(path);
    if (page.status !== 200) fail(`${label} ${path} HTTP ${page.status}`);
    checkHtml(label, page.html, {
      maxTitle: label === 'home' ? 65 : 70,
      maxDesc: label === 'home' ? 160 : 170,
      forbid: label === 'home' ? ['ClientRouter'] : [],
    });
    if (label === 'gallery') {
      for (const id of [
        'maloof-rocking-chair',
        'hepplewhite-shield-back-chair',
        'moser-continuous-arm-chair',
        'shaker-d-ring-table',
      ]) {
        if (!page.html.includes(`/images/gallery/${id}.webp`)) {
          fail(`live gallery html missing /images/gallery/${id}.webp`);
        }
      }
    }
  }
  const missing = await fetchPage('/this-page-does-not-exist');
  if (missing.status !== 404) fail(`missing page HTTP ${missing.status}, expected 404`);
  checkHtml('404', missing.html, { maxTitle: 70, maxDesc: 170, noindex: true });
  if (/rel="canonical"/i.test(missing.html)) fail('missing URL response must not emit a canonical URL');
  const sitemap = await fetch(`${baseUrl.replace(/\/$/, '')}/sitemap.xml`, {
    redirect: 'manual',
    headers: { 'user-agent': 'SDM-site-audit/1.0' },
  });
  const location = sitemap.headers.get('location') || '';
  const ok =
    sitemap.status === 200 ||
    ([301, 302, 307, 308].includes(sitemap.status) && location.includes('sitemap-index.xml'));
  if (!ok) fail(`sitemap.xml HTTP ${sitemap.status} location=${location}`);
}

for (const line of notes) console.log(line);
if (failures.length) {
  console.error(`FAIL ${failures.length}`);
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log('PASS');
