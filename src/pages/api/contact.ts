import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { Resend } from 'resend';

import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, GALLERY_ITEMS, SITE_URL } from '@/consts';

export const prerender = false;

const MAX_NAME = 200;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const MAX_SHORT = 200;
const MAX_BODY_BYTES = 16_384;

const BUDGET_LABELS: Record<string, string> = {
  discuss: 'Prefer to discuss',
  smaller: 'A smaller piece',
  'chair-table-bed': 'A chair, table, or bed',
  'case-piece': 'A case piece or clock',
};

const TIMELINE_LABELS: Record<string, string> = {
  flexible: 'No fixed date',
  'six-months': 'Hoping within six months',
  'this-year': 'Hoping this year',
  ready: 'Whenever it is ready',
};

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function workerSecret(name: 'RESEND_API_KEY' | 'RESEND_FROM_EMAIL'): string | undefined {
  const fromWorker = (env as unknown as Record<string, string | undefined>)[name];
  if (fromWorker) return fromWorker;
  const fromProcess =
    typeof process !== 'undefined' ? process.env[name] : undefined;
  return fromProcess || import.meta.env[name];
}

function isNativeFormPost(request: Request): boolean {
  const contentType = (request.headers.get('content-type') || '').toLowerCase();
  return (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  );
}

function isJsonPost(request: Request): boolean {
  const contentType = (request.headers.get('content-type') || '').toLowerCase();
  return contentType.includes('application/json');
}

function originAllowed(request: Request): boolean {
  const originHeader = request.headers.get('origin');
  const refererHeader = request.headers.get('referer');
  const candidate = originHeader || refererHeader;
  if (!candidate) return false;

  try {
    const url = new URL(candidate);
    const site = new URL(SITE_URL);
    const host = url.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return import.meta.env.DEV === true;
    }
    return url.origin === site.origin;
  } catch {
    return false;
  }
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function htmlError(message: string, status = 400) {
  const safe = escapeHtml(message);
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Contact</title></head><body><p>${safe}</p><p><a href="/contact/">Back to contact</a></p></body></html>`,
    {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    },
  );
}

function respondError(request: Request, message: string, status: number) {
  if (isNativeFormPost(request)) return htmlError(message, status);
  return jsonResponse({ error: message }, status);
}

function respondSuccess(request: Request) {
  if (isNativeFormPost(request)) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/message-sent/' },
    });
  }
  return jsonResponse({ success: true }, 200);
}

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed.' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json' },
  });

async function readBody(request: Request): Promise<Record<string, unknown>> {
  if (isJsonPost(request)) {
    const json = await request.json();
    return json && typeof json === 'object' && !Array.isArray(json)
      ? (json as Record<string, unknown>)
      : {};
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export const POST: APIRoute = async ({ request }) => {
  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > MAX_BODY_BYTES) {
    return respondError(request, 'Request too large.', 413);
  }

  if (!originAllowed(request)) {
    return respondError(request, 'Forbidden.', 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await readBody(request);
  } catch {
    return respondError(request, 'Invalid request body.', 400);
  }

  const honeypot = String(body.company ?? body.website ?? '').trim();
  if (honeypot) {
    return respondSuccess(request);
  }

  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const subject = String(body?.subject ?? '').trim();
  const message = String(body?.message ?? '').trim();
  const pieceRaw = String(body?.piece ?? '').trim();
  const pieceType = String(body?.pieceType ?? '').trim();
  const budgetKey = String(body?.budget ?? '').trim();
  const timelineKey = String(body?.timeline ?? '').trim();
  const knownPiece = GALLERY_ITEMS.find((item) => item.id === pieceRaw);
  const piece = knownPiece?.title || pieceRaw;
  const budget = BUDGET_LABELS[budgetKey] || '';
  const timeline = TIMELINE_LABELS[timelineKey] || '';

  if (
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    subject.length > MAX_SUBJECT ||
    message.length > MAX_MESSAGE ||
    piece.length > MAX_SHORT ||
    pieceType.length > MAX_SHORT
  ) {
    return respondError(request, 'One or more fields are too long.', 400);
  }

  if (!name || !email || !message) {
    return respondError(request, 'Name, email, and message are required.', 400);
  }

  if (!EMAIL_RE.test(email)) {
    return respondError(request, 'A valid email is required.', 400);
  }

  const subjectLabels: Record<string, string> = {
    general: 'General Inquiry',
    commission: 'Commission Request',
    collection: 'Collection Question',
    collaboration: 'Collaboration',
  };

  const subjectLabel = subjectLabels[subject] || (subject ? subject : 'None selected');
  const subjectLine = subject
    ? `[Website] ${subjectLabels[subject] || subject} from ${name}`
    : `[Website] Message from ${name}`;

  try {
    const apiKey = workerSecret('RESEND_API_KEY');
    if (!apiKey) {
      console.error('Contact form missing RESEND_API_KEY');
      return respondError(request, 'Failed to send message. Please try again.', 500);
    }

    const from = workerSecret('RESEND_FROM_EMAIL') || CONTACT_FROM_EMAIL;
    const resend = new Resend(apiKey);

    const detail = [
      piece ? `<p><strong>Piece:</strong> ${escapeHtml(piece)}</p>` : '',
      pieceType ? `<p><strong>Kind of piece:</strong> ${escapeHtml(pieceType)}</p>` : '',
      budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : '',
      timeline ? `<p><strong>Timing:</strong> ${escapeHtml(timeline)}</p>` : '',
    ].join('');

    const { error } = await resend.emails.send({
      from,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: subjectLine,
      html: `
        <h2>New message from your website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subjectLabel)}</p>
        ${detail}
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      const err = error as { name?: string; message?: string; statusCode?: number };
      console.error('Contact form Resend error:', err.statusCode ?? err.name, err.message ?? error);
      return respondError(request, 'Failed to send message. Please try again.', 500);
    }

    const { error: replyError } = await resend.emails.send({
      from,
      to: email,
      replyTo: CONTACT_TO_EMAIL,
      subject: 'Your note reached the studio',
      html: `
        <p>Your note reached the studio. I read every message and will reply from this address.</p>
        <p>Scott Dillingham Miniatures</p>
      `,
    });
    if (replyError) {
      console.error('Contact auto-reply failed:', replyError);
    }

    return respondSuccess(request);
  } catch (error) {
    console.error('Contact form error:', error);
    return respondError(request, 'Failed to send message. Please try again.', 500);
  }
};
