import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { Resend } from 'resend';

import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, GALLERY_ITEMS, SITE_URL } from '@/consts';
import { withinRateLimit } from '@/lib/rate-limit';

export const prerender = false;

const MAX_EMAIL = 254;
const MAX_SHORT = 200;
const MAX_BODY_BYTES = 8_192;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function workerSecret(name: string): string | undefined {
  const fromWorker = (env as unknown as Record<string, string | undefined>)[name];
  if (fromWorker) return fromWorker;
  const fromProcess = typeof process !== 'undefined' ? process.env[name] : undefined;
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[name];
  return fromProcess || fromMeta;
}

function isNativeFormPost(request: Request): boolean {
  const contentType = (request.headers.get('content-type') || '').toLowerCase();
  return (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  );
}

function originAllowed(request: Request): boolean {
  const candidate = request.headers.get('origin') || request.headers.get('referer');
  if (!candidate) return false;
  try {
    const url = new URL(candidate);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return import.meta.env.DEV === true;
    }
    return url.origin === new URL(SITE_URL).origin;
  } catch {
    return false;
  }
}

function respondError(request: Request, message: string, status: number) {
  if (isNativeFormPost(request)) {
    const safe = escapeHtml(message);
    return new Response(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>List</title></head><body><p>${safe}</p><p><a href="/">Back home</a></p></body></html>`,
      { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function respondSuccess(request: Request) {
  if (isNativeFormPost(request)) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/message-sent/?list=1' },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function alreadyOnList(error: { message?: string; statusCode?: number | null }): boolean {
  const message = String(error.message || '').toLowerCase();
  return error.statusCode === 409 || message.includes('already');
}

/** Build-time switch shared with list-signup.astro. Off until the privacy
 * policy covers the mailing list. */
const LIST_SIGNUP_ENABLED = import.meta.env.PUBLIC_LIST_SIGNUP === 'true';

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed.' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  if (!LIST_SIGNUP_ENABLED) {
    return respondError(request, 'Not found.', 404);
  }
  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > MAX_BODY_BYTES) {
    return respondError(request, 'Request too large.', 413);
  }
  if (!originAllowed(request)) {
    return respondError(request, 'Forbidden.', 403);
  }

  if (!(await withinRateLimit(request, 'SUBSCRIBE_LIMITER'))) {
    return respondError(request, 'Too many requests. Please wait a minute and try again.', 429);
  }

  let body: Record<string, unknown>;
  try {
    // Read as text and cap the real size; Content-Length may be absent.
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
      return respondError(request, 'Request too large.', 413);
    }
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('application/json')) {
      const json: unknown = JSON.parse(text);
      body =
        json && typeof json === 'object' && !Array.isArray(json)
          ? (json as Record<string, unknown>)
          : {};
    } else {
      const form = await new Response(text, { headers: { 'content-type': contentType } }).formData();
      body = Object.fromEntries(form.entries());
    }
  } catch {
    return respondError(request, 'Invalid request body.', 400);
  }

  if (String(body.website ?? '').trim()) {
    return respondSuccess(request);
  }

  const email = String(body.email ?? '').trim();
  const source = String(body.source ?? 'website').trim().slice(0, MAX_SHORT);
  const pieceRaw = String(body.piece ?? '').trim();
  const knownPiece = GALLERY_ITEMS.find((item) => item.id === pieceRaw);
  const piece = knownPiece?.title || pieceRaw;

  if (email.length > MAX_EMAIL || piece.length > MAX_SHORT) {
    return respondError(request, 'One or more fields are too long.', 400);
  }
  if (!EMAIL_RE.test(email)) {
    return respondError(request, 'A valid email is required.', 400);
  }

  const apiKey = workerSecret('RESEND_API_KEY');
  if (!apiKey) {
    console.error('List signup missing RESEND_API_KEY');
    return respondError(request, 'Could not join the list. Please try again.', 500);
  }

  const from = workerSecret('RESEND_FROM_EMAIL') || CONTACT_FROM_EMAIL;
  const resend = new Resend(apiKey);
  const segmentId = workerSecret('RESEND_SEGMENT_ID');
  const audienceId = workerSecret('RESEND_AUDIENCE_ID');

  try {
    if (segmentId) {
      const { error } = await resend.contacts.create({
        email,
        unsubscribed: false,
        segments: [{ id: segmentId }],
      });
      if (error && !alreadyOnList(error)) {
        console.error('List segment error:', error);
        return respondError(request, 'Could not join the list. Please try again.', 500);
      }
    } else if (audienceId) {
      const { error } = await resend.contacts.create({
        email,
        unsubscribed: false,
        audienceId,
      });
      if (error && !alreadyOnList(error)) {
        console.error('List audience error:', error);
        return respondError(request, 'Could not join the list. Please try again.', 500);
      }
    } else {
      const { error } = await resend.emails.send({
        from,
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `[Website] List signup ${email}`,
        html: `
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Source:</strong> ${escapeHtml(source)}</p>
          ${piece ? `<p><strong>Piece:</strong> ${escapeHtml(piece)}</p>` : ''}
          <p>No Resend segment is configured yet. Add this address when the list is ready.</p>
        `,
      });
      if (error) {
        console.error('List fallback email error:', error);
        return respondError(request, 'Could not join the list. Please try again.', 500);
      }
    }

    // No confirmation email to the submitted address: with only a honeypot and
    // an Origin check, that would let anyone send mail from the studio domain
    // to any inbox. /message-sent/?list=1 confirms on screen instead.

    return respondSuccess(request);
  } catch (error) {
    console.error('List signup error:', error);
    return respondError(request, 'Could not join the list. Please try again.', 500);
  }
};
