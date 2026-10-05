import { env } from 'cloudflare:workers';

type Limiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

/**
 * Per-IP rate limit via a Workers Rate Limiting binding (wrangler.toml
 * [[ratelimits]]). Returns true when the request may proceed. If the binding
 * is missing (local dev) it logs and allows. If the limiter errors, it allows
 * so a limiter outage never blocks real visitors.
 */
export async function withinRateLimit(
  request: Request,
  binding: 'CONTACT_LIMITER' | 'SUBSCRIBE_LIMITER',
): Promise<boolean> {
  const limiter = (env as unknown as Record<string, Limiter | undefined>)[binding];
  if (!limiter) {
    console.warn(`Rate limiter ${binding} not bound; allowing request.`);
    return true;
  }
  const key = request.headers.get('cf-connecting-ip') || 'unknown';
  try {
    const { success } = await limiter.limit({ key });
    return success;
  } catch (error) {
    console.error(`Rate limiter ${binding} error:`, error);
    return true;
  }
}
