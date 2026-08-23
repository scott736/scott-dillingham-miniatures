import type { CollectionEntry } from 'astro:content';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Image,
  Hammer,
  MessageSquare,
  Share2,
} from 'lucide-react';

import CategoryBadge from '@/components/elements/category-badge';
import { Card, CardContent } from '@/components/ui/card';

interface RelatedPost {
  id: string;
  title: string;
  description: string;
  image?: string;
  pubDate: string;
}

const SERVICE_CTAS = [
  {
    title: 'Explore the Gallery',
    href: '/gallery',
    description:
      'See hundreds of hours of handcraft in our finished miniature furniture collection.',
    icon: Image,
  },
  {
    title: 'Inside the Workshop',
    href: '/workshop',
    description:
      'Discover the eight-step process behind every handcrafted miniature piece.',
    icon: Hammer,
  },
  {
    title: 'Commission a Piece',
    href: '/contact',
    description:
      "Ready for a custom miniature? Let's discuss your vision.",
    icon: MessageSquare,
  },
];

function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      label: 'X',
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: <Share2 className="size-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm">Share:</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.label !== 'Email' ? '_blank' : undefined}
          rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
          className="text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-full border transition-colors"
          aria-label={`Share on ${link.label}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

const BlogPost = ({
  post,
  relatedPosts,
  currentTags,
  siteUrl,
  children,
}: {
  post: CollectionEntry<'blog'>[];
  relatedPosts?: RelatedPost[];
  currentTags?: string[];
  siteUrl: string;
  children: React.ReactNode;
}) => {
  const { title, description, pubDate, coverImage } = post[0].data;
  const postUrl = `${siteUrl}/blog/${post[0].id}`;

  return (
    <article className="hero-padding-margin container space-y-6 md:space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
        <ol className="flex items-center gap-1.5">
          <li>
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
          </li>
          <li>
            <ChevronRight className="inline size-3.5" />
          </li>
          <li>
            <a href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </a>
          </li>
          <li>
            <ChevronRight className="inline size-3.5" />
          </li>
          <li className="text-foreground truncate max-w-[240px] sm:max-w-none" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>

      <div>
        {/* Back button */}
        <a href="/blog" className="group inline-block">
          <CategoryBadge
            label="Back"
            icon={
              <ChevronLeft className="!text-current transition-transform group-hover:-translate-x-0.5" />
            }
          />
        </a>
        <h1 data-speakable="title" className="mt-3 text-2xl md:text-4xl lg:text-5xl">{title}</h1>
        <p data-speakable="description" className="mt-2.5 text-xl leading-8">{description}</p>
      </div>
      {coverImage && (
        <div className="relative h-[320px] overflow-hidden rounded-3xl md:h-[400px] lg:h-[600px]">
          <img
            src={coverImage}
            alt={`${title} - Miniature furniture guide by Scott Dillingham`}
            width={980}
            height={560}
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 980px"
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <time className="inline-block text-xl" dateTime={new Date(pubDate).toISOString()} suppressHydrationWarning>
          {new Date(pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        <ShareButtons title={title} url={postUrl} />
      </div>

      <div className="prose-headings:font-normal prose-headings:text-3xl dark:prose-invert prose prose-xl max-w-none leading-8">
        {children}
      </div>

      {/* Continue Your Journey - Service Page CTAs */}
      <section className="pt-8 md:pt-12">
        <h2 className="mb-6 text-2xl md:text-3xl">Continue Your Journey</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {SERVICE_CTAS.map((cta) => {
            const Icon = cta.icon;
            return (
              <a key={cta.href} href={cta.href} className="group">
                <Card className="h-full transition-colors hover:border-foreground/20">
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="text-muted-foreground size-5" />
                      <h3 className="text-lg font-medium">{cta.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {cta.description}
                    </p>
                    <span className="text-sm font-medium inline-flex items-center gap-1 mt-auto">
                      Learn more
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="pt-8 md:pt-12">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="text-muted-foreground size-5" />
            <h2 className="text-2xl md:text-3xl">Related Articles</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {relatedPosts.map((related) => (
              <a key={related.id} href={`/blog/${related.id}`} className="group">
                <Card className="h-full gap-0 overflow-hidden p-0 transition-all hover:border-foreground/20">
                  {related.image && (
                    <div className="relative h-[200px] overflow-hidden rounded-t-3xl">
                      <img
                        src={related.image}
                        alt={`${related.title} - 1/12 scale miniature furniture article`}
                        width={400}
                        height={200}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <CardContent className="px-5 py-5">
                    <h3 className="text-lg font-medium leading-snug line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed line-clamp-2">
                      {related.description}
                    </p>
                    <time className="text-muted-foreground mt-3 block text-xs" dateTime={new Date(related.pubDate).toISOString()} suppressHydrationWarning>
                      {new Date(related.pubDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export { BlogPost };
