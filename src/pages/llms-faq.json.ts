export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { AEO_JSON_HEADERS, buildLlmsFaqJson } from '@/lib/aeo';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  return new Response(JSON.stringify(buildLlmsFaqJson(posts), null, 2), {
    headers: AEO_JSON_HEADERS,
  });
};
