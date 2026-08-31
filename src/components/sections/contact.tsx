import { useEffect, useState } from 'react';

import { Lightbulb } from 'lucide-react';

import CategoryBadge from '@/components/elements/category-badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  const [errorText, setErrorText] = useState(
    'Something went wrong. Please try again.',
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') === '1') setStatus('sent');
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorText('Something went wrong. Please try again.');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          website: formData.get('website'),
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        success?: boolean;
      } | null;

      if (!res.ok) {
        setErrorText(data?.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="hero-padding-margin container grid grid-cols-1 justify-between gap-10 md:grid-cols-2 lg:gap-10.5">
      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <CategoryBadge label="Get in Touch" icon={<Lightbulb />} />
          <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl lg:leading-14">
            Let's Create Something Extraordinary
          </h1>
        </div>
        <p className="text-xl leading-8">
          Whether you're interested in commissioning a custom piece, have
          questions about the collection, or simply want to discuss miniature
          woodworking — I'd love to hear from you.
        </p>

        <p className="text-muted-foreground text-sm italic">
          I personally read and respond to every message.
        </p>
      </div>

      <Card className="flex-1 py-8">
        <CardHeader className="gap-3 px-8">
          <h2 className="text-3xl font-bold">Write to Me</h2>
          <p className="text-xl">I'd love to hear from you.</p>
        </CardHeader>

        <CardContent className="px-8">
          <form
            onSubmit={handleSubmit}
            method="post"
            action="/api/contact"
            className="flex flex-col gap-6"
          >
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
                maxLength={254}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                name="subject"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a subject...</option>
                <option value="general">General Inquiry</option>
                <option value="commission">Commission Request</option>
                <option value="collection">Collection Question</option>
                <option value="collaboration">Collaboration</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                placeholder="Tell me about your project or question..."
                id="message"
                name="message"
                className="min-h-[120px]"
                required
                maxLength={5000}
              />
            </div>

            {status === 'sent' && (
              <p className="text-sm font-medium text-green-600">
                Message sent! I'll get back to you soon.
              </p>
            )}

            {status === 'error' && (
              <p className="text-sm font-medium text-red-600">{errorText}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
