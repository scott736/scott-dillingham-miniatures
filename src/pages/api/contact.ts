import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { Resend } from 'resend';

import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } from '@/consts';

export const prerender = false;

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
  const fromWorker = (env as Record<string, string | undefined>)[name];
  if (fromWorker) return fromWorker;
  const fromProcess =
    typeof process !== 'undefined' ? process.env[name] : undefined;
  return fromProcess || import.meta.env[name];
}

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed.' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json' },
  });

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await request.json();
    return json && typeof json === 'object' ? (json as Record<string, unknown>) : {};
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await readBody(request);
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const subject = String(body?.subject ?? '').trim();
    const message = String(body?.message ?? '').trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required.' }),
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'A valid email is required.' }), {
        status: 400,
      });
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

    const apiKey = workerSecret('RESEND_API_KEY');
    if (!apiKey) {
      console.error('Contact form missing RESEND_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try again.' }),
        { status: 500 },
      );
    }

    const from = workerSecret('RESEND_FROM_EMAIL') || CONTACT_FROM_EMAIL;
    const resend = new Resend(apiKey);

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
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      console.error('Contact form Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try again.' }),
        { status: 500 },
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message. Please try again.' }),
      { status: 500 },
    );
  }
};
