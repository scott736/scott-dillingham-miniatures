#!/usr/bin/env node
/**
 * Leonardo AI Image Generator for Scott Dillingham Miniatures
 * Generates photorealistic cover images for all blog posts and workshop steps.
 *
 * Usage: node scripts/generate-images.mjs
 *
 * Requires LEONARDO_API_KEY in .env
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load .env manually (no dotenv dependency)
const envPath = resolve(ROOT, '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) envVars[key.trim()] = vals.join('=').trim();
});

const API_KEY = envVars.LEONARDO_API_KEY;
if (!API_KEY) {
  console.error('Missing LEONARDO_API_KEY in .env');
  process.exit(1);
}

const API_BASE = 'https://cloud.leonardo.ai/api/rest/v1';
const HEADERS = {
  accept: 'application/json',
  'content-type': 'application/json',
  authorization: `Bearer ${API_KEY}`,
};

// Leonardo Kino XL — recommended for PhotoReal v2
const MODEL_ID = 'aa77f04e-3eec-4034-9c07-d0f619684628';

// -------------------------------------------------------------------
// Image prompts for each blog post
// -------------------------------------------------------------------
const BLOG_PROMPTS = [
  {
    slug: 'complete-guide-1-12-scale-miniature-furniture',
    prompt:
      'A beautifully handcrafted 1/12 scale miniature Queen Anne chair sitting on a fine woodworking bench, warm workshop lighting, shallow depth of field, rich wood grain detail, professional product photography',
    output: 'public/images/blog/complete-guide-1-12-scale.webp',
  },
  {
    slug: 'miniature-woodworking-for-beginners',
    prompt:
      'Hands of a craftsman carefully working on a tiny wooden furniture piece with miniature woodworking tools on a clean workbench, warm natural light, macro photography, sharp detail',
    output: 'public/images/blog/miniature-woodworking-beginners.webp',
  },
  {
    slug: 'how-to-start-miniature-furniture-collection',
    prompt:
      'An elegant glass display case showcasing a curated collection of miniature dollhouse furniture pieces, museum lighting, warm tones, shallow depth of field, collector aesthetic',
    output: 'public/images/blog/start-miniature-collection.webp',
  },
  {
    slug: 'queen-anne-miniature-furniture-guide',
    prompt:
      'A stunning 1/12 scale miniature Queen Anne side chair with cabriole legs and pad feet, crafted from cherry wood, sitting on a dark velvet cloth, dramatic side lighting, product photography',
    output: 'public/images/blog/queen-anne-guide.webp',
  },
  {
    slug: 'museum-quality-miniatures-what-sets-them-apart',
    prompt:
      'Extreme close-up macro shot of a handcrafted miniature furniture drawer showing perfect tiny dovetail joints in cherry wood, museum-quality craftsmanship, dramatic lighting revealing wood grain detail',
    output: 'public/images/blog/museum-quality-miniatures.webp',
  },
  {
    slug: 'chippendale-miniature-furniture',
    prompt:
      'A 1/12 scale miniature Chippendale highboy dresser in rich mahogany with ornate ball-and-claw feet and carved shell details, elegant dark background, professional studio lighting',
    output: 'public/images/blog/chippendale-miniature.webp',
  },
  {
    slug: 'understanding-dollhouse-scales',
    prompt:
      'Three miniature chairs at different scales (1/12, 1/24, 1/48) placed next to a ruler on a clean white surface for comparison, overhead flat lay photography, bright even lighting',
    output: 'public/images/blog/understanding-dollhouse-scales.webp',
  },
  {
    slug: 'handcrafted-vs-kit-built-miniatures',
    prompt:
      'Two miniature chairs side by side on a wooden surface: one exquisitely handcrafted from solid hardwood with visible grain, the other a simpler mass-produced version, comparison photography, natural lighting',
    output: 'public/images/blog/handcrafted-vs-kit-built.webp',
  },
  {
    slug: 'essential-miniature-woodworking-tools',
    prompt:
      'A neatly arranged collection of miniature woodworking tools including micro chisels, jewelers saw, tiny files, magnifying glass, and precision rulers laid out on a wooden workbench, overhead flat lay, warm lighting',
    output: 'public/images/blog/essential-tools.webp',
  },
  {
    slug: 'miniature-highboy-makers-guide',
    prompt:
      'A majestic 1/12 scale miniature highboy dresser in cherry wood with Queen Anne legs and finials, sitting on a polished wooden surface, warm dramatic lighting, professional product shot',
    output: 'public/images/blog/miniature-highboy-guide.webp',
  },
  {
    slug: 'investment-value-artisan-miniature-furniture',
    prompt:
      'A luxurious collection of miniature furniture pieces displayed on velvet-lined shelves behind glass, reminiscent of a high-end auction house, warm golden lighting, elegant composition',
    output: 'public/images/blog/investment-value-miniatures.webp',
  },
  {
    slug: 'building-miniature-four-poster-bed',
    prompt:
      'A stunning handcrafted 1/12 scale miniature four-poster bed in dark mahogany with hand-turned posts and carved headboard, placed in a miniature bedroom setting, warm lamp lighting',
    output: 'public/images/blog/miniature-four-poster-bed.webp',
  },
  {
    slug: 'displaying-protecting-miniature-furniture-collection',
    prompt:
      'A museum-style glass display case with LED lighting showcasing miniature furniture pieces on individual acrylic stands, clean modern aesthetic, soft warm gallery lighting',
    output: 'public/images/blog/displaying-protecting-collection.webp',
  },
  {
    slug: 'how-to-choose-wood-for-miniature-furniture',
    prompt:
      'A variety of fine hardwood samples including mahogany, cherry, walnut, maple, and boxwood cut into small blocks arranged on a workshop bench, with tiny furniture components alongside, natural overhead lighting',
    output: 'public/images/blog/choosing-wood-miniatures.webp',
  },
  {
    slug: 'history-miniature-furniture-royal-courts-modern',
    prompt:
      'An antique miniature dollhouse interior from the 17th century Dutch style with period furniture pieces, warm candlelight aesthetic, historical atmosphere, rich golden tones, dramatic chiaroscuro lighting',
    output: 'public/images/blog/history-miniature-furniture.webp',
  },
  {
    slug: 'scaling-down-furniture-plans',
    prompt:
      'Architectural blueprints and technical drawings of furniture plans spread on a drafting table with a tiny 1/12 scale miniature chair sitting on top for scale reference, warm desk lamp lighting',
    output: 'public/images/blog/scaling-down-plans.webp',
  },
  {
    slug: 'miniature-tall-case-clocks',
    prompt:
      'A beautifully handcrafted 1/12 scale miniature tall case grandfather clock in walnut with hand-painted dial face, placed next to a coin for scale, dramatic side lighting, sharp focus',
    output: 'public/images/blog/miniature-tall-case-clock.webp',
  },
  {
    slug: 'miniature-furniture-exhibitions-shows',
    prompt:
      'A miniature furniture exhibition with multiple display tables showing handcrafted dollhouse pieces, visitors admiring the work, bright gallery lighting, wide angle shot of exhibition hall',
    output: 'public/images/blog/miniature-exhibitions-shows.webp',
  },
  {
    slug: 'john-goddard-block-front-secretary-desk-miniature',
    prompt:
      'A masterwork 1/12 scale miniature John Goddard block-front secretary desk in mahogany with shell carvings and open bookcase top, dramatic museum lighting, dark background, incredible detail',
    output: 'public/images/blog/goddard-secretary-desk.webp',
  },
  {
    slug: 'miniature-woodworking-joints',
    prompt:
      'Extreme macro close-up of perfectly cut miniature dovetail joints in light maple wood, showing the interlocking fingers, workshop bench background, dramatic raking light revealing precision',
    output: 'public/images/blog/miniature-woodworking-joints.webp',
  },
  {
    slug: 'dollhouse-decorating-handcrafted-furniture',
    prompt:
      'A charming dollhouse room fully decorated with handcrafted miniature furniture including a tiny dining set, bookcase, and upholstered chair, warm interior lighting, cozy atmosphere',
    output: 'public/images/blog/dollhouse-decorating.webp',
  },
  {
    slug: 'finishing-techniques-miniature-furniture',
    prompt:
      'A craftsman hand applying French polish with a tiny cotton pad to a miniature wooden table, bottles of shellac and oil nearby, warm workshop lighting, shallow depth of field, macro detail',
    output: 'public/images/blog/finishing-techniques.webp',
  },
  {
    slug: 'victorian-dollhouse-furniture-guide',
    prompt:
      'An ornate 1/12 scale miniature Victorian parlor set with carved settee, side tables, and decorative mirror, rich dark wood, plush fabric upholstery, dramatic period lighting',
    output: 'public/images/blog/victorian-dollhouse-furniture.webp',
  },
  {
    slug: 'miniature-furniture-fine-art',
    prompt:
      'A single exquisite miniature furniture piece displayed on a white pedestal in an art gallery setting with spot lighting, museum-like presentation, clean minimalist environment, artistic composition',
    output: 'public/images/blog/miniature-furniture-fine-art.webp',
  },
  {
    slug: 'federal-period-miniature-furniture',
    prompt:
      'A refined 1/12 scale miniature Federal period sideboard in walnut with inlay details and brass hardware, placed against a muted blue wall, elegant classical composition, warm side lighting',
    output: 'public/images/blog/federal-period-miniature.webp',
  },
  {
    slug: 'renaissance-handcrafted-miniatures-digital-age',
    prompt:
      'A modern craftsman workshop with both traditional hand tools and a laptop showing miniature furniture designs, miniature pieces in progress on the bench, warm natural window lighting',
    output: 'public/images/blog/renaissance-miniatures-digital.webp',
  },
  {
    slug: 'setting-up-miniature-woodworking-workshop',
    prompt:
      'A well-organized dedicated miniature woodworking workshop with tool wall, magnifying lamp, small lathe, organized drawers of tiny components, clean and inviting workspace, bright overhead lighting',
    output: 'public/images/blog/miniature-workshop-setup.webp',
  },
  {
    slug: 'shaker-style-miniature-furniture',
    prompt:
      'A clean and simple 1/12 scale miniature Shaker-style rocking chair and side table in light maple, placed on a plain white surface, soft natural lighting, minimalist composition highlighting clean lines',
    output: 'public/images/blog/shaker-style-miniature.webp',
  },
  {
    slug: 'miniature-woodworking-safety-guide',
    prompt:
      'Safety equipment for miniature woodworking including magnifying goggles, dust mask, finger guards, and sharp tools with protective covers arranged neatly on a workbench, clear bright lighting',
    output: 'public/images/blog/miniature-safety-guide.webp',
  },
  {
    slug: 'arts-and-crafts-miniature-furniture',
    prompt:
      'A 1/12 scale miniature Arts and Crafts style Morris chair and bookcase in quarter-sawn oak, showing exposed joinery and hammered copper hardware, warm amber lighting, mission style aesthetic',
    output: 'public/images/blog/arts-crafts-miniature.webp',
  },
];

// -------------------------------------------------------------------
// Image prompts for workshop process steps
// -------------------------------------------------------------------
const WORKSHOP_PROMPTS = [
  {
    slug: 'process-design',
    prompt:
      'An architects desk with hand-drawn scaled furniture plans, reference books on period furniture open showing detailed illustrations, pencils and ruler, warm desk lamp lighting, overhead view, professional photography',
    output: 'public/images/workshop/process-design.webp',
  },
  {
    slug: 'process-wood',
    prompt:
      'A selection of fine hardwood samples - mahogany, cherry, walnut, maple - cut into small blocks with visible grain patterns, arranged on a clean workbench, warm natural lighting, overhead flat lay',
    output: 'public/images/workshop/process-wood.webp',
  },
  {
    slug: 'process-milling',
    prompt:
      'Close-up of skilled hands using a tiny precision saw to cut a small piece of hardwood on a miniature workbench, sawdust particles visible, warm workshop lighting, shallow depth of field',
    output: 'public/images/workshop/process-milling.webp',
  },
  {
    slug: 'process-joinery',
    prompt:
      'Extreme macro shot of a craftsman cutting tiny dovetail joints in miniature wood pieces using micro chisels, incredible precision detail, warm workshop lighting, wood shavings visible',
    output: 'public/images/workshop/process-joinery.webp',
  },
  {
    slug: 'process-carving',
    prompt:
      'Close-up of hands using micro gouges and a sharp craft knife to carve a tiny shell ornament on a miniature furniture piece under a magnifying lamp, dramatic focused lighting',
    output: 'public/images/workshop/process-carving.webp',
  },
  {
    slug: 'process-assembly',
    prompt:
      'Tiny miniature furniture components being carefully assembled with micro clamps and clothespins holding pieces in place, glue bottle nearby, warm workshop bench lighting, shallow depth of field',
    output: 'public/images/workshop/process-assembly.webp',
  },
  {
    slug: 'process-finishing',
    prompt:
      'A craftsman applying French polish to a tiny miniature table with a small cotton pad, bottles of shellac and oil nearby, the wood showing a beautiful warm glow, macro photography, warm lighting',
    output: 'public/images/workshop/process-finishing.webp',
  },
  {
    slug: 'process-delivery',
    prompt:
      'A finished miniature furniture masterpiece being carefully placed into custom-fitted protective foam inside a wooden shipping box, with a camera and studio lights visible in background, professional photography setup',
    output: 'public/images/workshop/process-delivery.webp',
  },
];

// -------------------------------------------------------------------
// API helpers
// -------------------------------------------------------------------

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function createGeneration(prompt, presetStyle = 'CINEMATIC') {
  const body = {
    prompt,
    modelId: MODEL_ID,
    width: 1344,
    height: 768,
    num_images: 1,
    alchemy: true,
    photoReal: true,
    photoRealVersion: 'v2',
    presetStyle,
    negative_prompt:
      'blurry, low quality, cartoon, anime, illustration, painting, watermark, text, logo, signature, deformed, ugly, bad anatomy, extra fingers',
  };

  const res = await fetch(`${API_BASE}/generations`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Generation request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.sdGenerationJob.generationId;
}

async function pollGeneration(generationId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(5000); // wait 5 seconds between polls

    const res = await fetch(`${API_BASE}/generations/${generationId}`, {
      headers: HEADERS,
    });

    if (!res.ok) {
      console.warn(`  Poll failed (${res.status}), retrying...`);
      continue;
    }

    const data = await res.json();
    const gen = data.generations_by_pk;

    if (gen.status === 'COMPLETE') {
      return gen.generated_images.map((img) => img.url);
    }

    if (gen.status === 'FAILED') {
      throw new Error(`Generation ${generationId} failed`);
    }

    // Still pending...
    process.stdout.write('.');
  }

  throw new Error(`Generation ${generationId} timed out after ${maxAttempts} polls`);
}

async function downloadImage(url, outputPath) {
  const fullPath = resolve(ROOT, outputPath);
  const dir = dirname(fullPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(fullPath, buffer);
  return fullPath;
}

// -------------------------------------------------------------------
// Main execution
// -------------------------------------------------------------------

async function generateBatch(items, label, presetStyle = 'CINEMATIC') {
  console.log(`\n========================================`);
  console.log(`  Generating ${items.length} ${label} images`);
  console.log(`  Model: Kino XL + PhotoReal v2`);
  console.log(`  Style: ${presetStyle}`);
  console.log(`========================================\n`);

  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const num = `[${i + 1}/${items.length}]`;

    try {
      console.log(`${num} Generating: ${item.slug}`);
      console.log(`    Prompt: ${item.prompt.substring(0, 80)}...`);

      const generationId = await createGeneration(item.prompt, presetStyle);
      console.log(`    Generation ID: ${generationId}`);
      process.stdout.write('    Waiting');

      const urls = await pollGeneration(generationId);
      console.log(` Done!`);

      const savedPath = await downloadImage(urls[0], item.output);
      console.log(`    Saved: ${item.output}`);

      results.push({ slug: item.slug, status: 'success', path: savedPath });

      // Rate limit: wait 2 seconds between generations
      if (i < items.length - 1) await sleep(2000);
    } catch (err) {
      console.error(`    ERROR: ${err.message}`);
      results.push({ slug: item.slug, status: 'error', error: err.message });
    }
  }

  return results;
}

async function main() {
  console.log('Leonardo AI Image Generator');
  console.log('Scott Dillingham Miniatures\n');

  // Check API key works
  try {
    const res = await fetch(`${API_BASE}/me`, { headers: HEADERS });
    if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
    const me = await res.json();
    console.log(`Authenticated as user: ${me.user_details?.[0]?.user?.username || 'OK'}`);
    console.log(`API tokens remaining: ${me.user_details?.[0]?.apiConcurrencySlots || 'unknown'}\n`);
  } catch (err) {
    console.error(`Authentication failed: ${err.message}`);
    process.exit(1);
  }

  // Generate blog images
  const blogResults = await generateBatch(BLOG_PROMPTS, 'blog post', 'CINEMATIC');

  // Generate workshop images
  const workshopResults = await generateBatch(WORKSHOP_PROMPTS, 'workshop step', 'CINEMATIC');

  // Summary
  const allResults = [...blogResults, ...workshopResults];
  const successes = allResults.filter((r) => r.status === 'success');
  const errors = allResults.filter((r) => r.status === 'error');

  console.log(`\n========================================`);
  console.log(`  COMPLETE`);
  console.log(`  Success: ${successes.length}/${allResults.length}`);
  if (errors.length) {
    console.log(`  Errors: ${errors.length}`);
    errors.forEach((e) => console.log(`    - ${e.slug}: ${e.error}`));
  }
  console.log(`========================================\n`);

  // Save results log
  const logPath = resolve(ROOT, 'scripts/image-generation-log.json');
  writeFileSync(logPath, JSON.stringify(allResults, null, 2));
  console.log(`Results logged to: ${logPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
