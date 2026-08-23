export const prerender = true;

import type { APIRoute } from 'astro';

import { AEO_TEXT_HEADERS, buildAiTxt } from '@/lib/aeo';

export const GET: APIRoute = () =>
  new Response(buildAiTxt(), { headers: AEO_TEXT_HEADERS });
