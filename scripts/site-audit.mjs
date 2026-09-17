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

function jsonLdBlocks(html) {
  const blocks = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch {
      fail('invalid JSON-LD block');
    }
  }
  return blocks;
}

function walkJsonLd(value, visit) {
  if (Array.isArray(value)) {
    value.forEach((item) => walkJsonLd(item, visit));
    return;
  }
  if (!value || typeof value !== 'object') return;
  visit(value);
  Object.values(value).forEach((item) => walkJsonLd(item, visit));
}

function jsonLdTypes(html) {
  const types = [];
  for (const block of jsonLdBlocks(html)) {
    walkJsonLd(block, (value) => {
      const t = value['@type'];
      if (t) types.push(...(Array.isArray(t) ? t : [t]));
    });
  }
  return types;
}

function checkNoProductSchema(label, html) {
  const types = jsonLdTypes(html);
  if (types.includes('Product')) {
    fail(`${label}: JSON-LD must not emit Product (GSC Product snippets require offers/review/rating)`);
  }
  // No dollar amount is published on shop/gallery/contact/workshop pages.
  for (const block of jsonLdBlocks(html)) {
    walkJsonLd(block, (value) => {
      const t = value['@type'];
      const typesForNode = t ? (Array.isArray(t) ? t : [t]) : [];
      if (!typesForNode.includes('Offer')) return;
      if (
        value.price != null ||
        value.priceCurrency != null ||
        value.lowPrice != null ||
        value.highPrice != null
      ) {
        fail(`${label}: Offer has a price but no price is published on the page`);
      }
    });
  }
  return types;
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
  if (!text.includes('hero-workshop.webp') || !text.includes('bonsai.webp')) {
    fail('_redirects must alias retired workshop hero to bonsai.webp');
  }
}

function checkDistExtras() {
  const dir = join(root, distDir);
  const home = readFileSync(join(dir, 'index.html'), 'utf8');
  const homeTypes = checkNoProductSchema('home', home);
  if (!homeTypes.includes('Organization')) fail('home JSON-LD missing Organization');
  if (!homeTypes.includes('Person')) fail('home JSON-LD missing Person');
  if (!homeTypes.includes('WebSite')) fail('home JSON-LD missing WebSite');
  if (!homeTypes.includes('WebPage')) fail('home JSON-LD missing WebPage');
  if (!homeTypes.includes('BreadcrumbList')) fail('home JSON-LD missing BreadcrumbList');
  if (!homeTypes.includes('Service')) fail('home JSON-LD missing Service offer catalog');
  if (!homeTypes.includes('OfferCatalog')) fail('home JSON-LD missing OfferCatalog');
  if (!homeTypes.includes('VisualArtwork')) {
    fail('home JSON-LD missing VisualArtwork in offer catalog');
  }
  if (!home.includes('https://schema.org/InStock')) {
    fail('home JSON-LD missing InStock offer for available work');
  }
  if (!home.includes('https://schema.org/PreOrder')) {
    fail('home JSON-LD missing PreOrder offer for commissions');
  }
  for (const id of ['highboy-dresser', 'four-poster-bed', 'shaker-d-ring-table']) {
    if (!home.includes(`/gallery/#${id}`)) {
      fail(`home OfferCatalog missing available artwork ${id}`);
    }
  }
  if (!home.includes('/gallery/#moser-continuous-arm-chair')) {
    fail('home OfferCatalog missing commission artwork moser-continuous-arm-chair');
  }
  const styleChars = [...home.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce(
    (n, m) => n + m[1].length,
    0,
  );
  notes.push(`home html ${home.length} inline-css ${styleChars}`);
  if (home.includes('ClientRouter')) fail('homepage still ships ClientRouter');
  if (!home.includes('og:image:width') || !home.includes('1600')) {
    fail('homepage og:image should be 1600px wide (bonsai dining set, not Sonic template)');
  }
  if (home.includes('Immersive Sound')) fail('homepage still references Sonic template copy');
  const nf = join(dir, '404.html');
  if (existsSync(nf)) {
    const html = readFileSync(nf, 'utf8');
    if (html.includes('astro-island')) fail('404.html hydrates an astro-island');
  }
  const sitemap0 = join(dir, 'sitemap-0.xml');
  if (existsSync(sitemap0)) {
    const xml = readFileSync(sitemap0, 'utf8');
    if (!xml.includes('/privacy-policy/')) fail('sitemap missing /privacy-policy/');
    if (!xml.includes('/terms-of-service/')) fail('sitemap missing /terms-of-service/');
    if (xml.includes('/404')) fail('sitemap must not include 404');
    if (xml.includes('/api/')) fail('sitemap must not include /api/');
  }
  const blog = join(dir, 'blog/index.html');
  if (existsSync(blog)) {
    const html = readFileSync(blog, 'utf8');
    const size = statSync(blog).size;
    notes.push(`blog index ${size}`);
    if (html.includes('Start a Commission')) fail('blog index still shows the commission CTA');
    if (size > 150000) fail(`blog index ${size} bytes, expected under 150000`);
    checkNoProductSchema('blog index', html);
    const blogPost = join(dir, 'blog/complete-guide-1-12-scale-miniature-furniture/index.html');
    if (existsSync(blogPost)) {
      checkNoProductSchema('blog post', readFileSync(blogPost, 'utf8'));
    }
    const props = html.match(/props="([^"]*)"/);
    if (props && props[1].length > 80000) {
      fail(`blog island props ${props[1].length} chars, listing is shipping full posts`);
    }
  }
  const gallery = join(dir, 'gallery/index.html');
  if (existsSync(gallery)) {
    const html = readFileSync(gallery, 'utf8');
    const galleryTypes = checkNoProductSchema('gallery', html);
    if (!galleryTypes.includes('CollectionPage')) fail('gallery JSON-LD missing CollectionPage');
    if (!galleryTypes.includes('ItemList')) fail('gallery JSON-LD missing ItemList');
    if (!galleryTypes.includes('VisualArtwork')) {
      fail('gallery JSON-LD missing VisualArtwork');
    }
    if (!galleryTypes.includes('WebPage')) fail('gallery JSON-LD missing WebPage');
    if (!html.includes('https://schema.org/InStock')) {
      fail('gallery JSON-LD missing InStock offer for available work');
    }
    if (!html.includes('https://schema.org/PreOrder')) {
      fail('gallery JSON-LD missing PreOrder offer for commission work');
    }
    if (!html.includes('https://schema.org/SoldOut')) {
      fail('gallery JSON-LD missing SoldOut offer for museum-held work');
    }
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
    for (const label of ['Available', 'Commission only', 'Museum collection', 'Inquire', 'Commission']) {
      if (!html.includes(label)) fail(`gallery html missing status/cta "${label}"`);
    }
  }
  const workshop = join(dir, 'workshop/index.html');
  if (existsSync(workshop)) {
    const html = readFileSync(workshop, 'utf8');
    const workshopTypes = checkNoProductSchema('workshop', html);
    if (!workshopTypes.includes('WebPage')) fail('workshop JSON-LD missing WebPage');
    if (!workshopTypes.includes('HowTo')) fail('workshop JSON-LD missing HowTo');
    if (html.includes('hero-workshop.webp')) fail('workshop still uses Christies hero-workshop.webp');
    if (html.includes('Christie')) fail('workshop html still mentions Christie');
  }
  const about = join(dir, 'about/index.html');
  if (existsSync(about)) {
    const html = readFileSync(about, 'utf8');
    const aboutTypes = checkNoProductSchema('about', html);
    if (!aboutTypes.includes('ProfilePage')) fail('about JSON-LD missing ProfilePage');
    if (!aboutTypes.includes('WebPage')) fail('about JSON-LD missing WebPage');
    if (html.includes('scott-workshop.webp')) fail('about still uses mislabeled scott-workshop.webp');
    if (html.includes('hand-tools.webp')) fail('about still uses mislabeled hand-tools.webp');
  }
  const contact = join(dir, 'contact/index.html');
  if (existsSync(contact)) {
    const html = readFileSync(contact, 'utf8');
    const contactTypes = checkNoProductSchema('contact', html);
    if (!contactTypes.includes('ContactPage')) fail('contact JSON-LD missing ContactPage');
    if (!contactTypes.includes('WebPage')) fail('contact JSON-LD missing WebPage');
    if (!contactTypes.includes('Service')) fail('contact JSON-LD missing commission Service');
    if (!html.includes('/contact/#commission-service')) {
      fail('contact JSON-LD missing commission Service @id');
    }
    if (!html.includes('mailto:sedminiatures@gmail.com')) {
      fail('contact page missing visible mailto:sedminiatures@gmail.com');
    }
    if (html.includes('astro-island')) fail('contact page still hydrates a React island');
  }
  for (const [label, path] of [
    ['image-license', 'image-license/index.html'],
    ['privacy', 'privacy-policy/index.html'],
    ['terms', 'terms-of-service/index.html'],
  ]) {
    const file = join(dir, path);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    const types = checkNoProductSchema(label, html);
    if (!types.includes('WebPage')) fail(`${label} JSON-LD missing WebPage`);
    if (!types.includes('BreadcrumbList')) fail(`${label} JSON-LD missing BreadcrumbList`);
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
  checkHtml('privacy', readPage('/privacy-policy'), { maxTitle: 70, maxDesc: 170 });
  checkHtml('terms', readPage('/terms-of-service'), { maxTitle: 70, maxDesc: 170 });
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
