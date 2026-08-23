export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { AEO_TEXT_HEADERS, buildLlmsTxt } from '@/lib/aeo';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  return new Response(buildLlmsTxt(posts).trim(), { headers: AEO_TEXT_HEADERS });
};
