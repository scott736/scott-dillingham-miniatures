'use client';

import { useState, useMemo } from 'react';

import { Paperclip, Search, X } from 'lucide-react';
import { motion as m } from 'motion/react';

import SectionHeader from '@/components/elements/section-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export type BlogListItem = {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  coverImage?: string;
  tags?: string[];
};

const DEFAULT_HOVERED_CARD_INDEX = 1;

export default function BlogPosts({
  posts,
  isBlogsPage,
}: {
  posts: BlogListItem[];
  isBlogsPage?: boolean;
}) {
  const isMobile = useIsMobile();
  const [hoveredCardIndex, setHoveredCardIndex] = useState(
    DEFAULT_HOVERED_CARD_INDEX,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q),
      );
    }
    if (selectedTag) {
      result = result.filter((post) => post.tags?.includes(selectedTag));
    }
    return result;
  }, [posts, searchQuery, selectedTag]);

  const displayPosts = isBlogsPage ? filteredPosts : posts;
  const isFiltering = isBlogsPage && (searchQuery.trim() || selectedTag);

  const getIsCardHovered = (index: number) =>
    isMobile || hoveredCardIndex === index;

  return (
    <section
      className={cn(
        'section-padding container space-y-10.5',
        isBlogsPage && 'hero-padding-margin',
      )}
    >
      <SectionHeader
        icon={<Paperclip />}
        category="Blog"
        title="From the Workshop Journal"
        description="Tips, techniques, and stories from the world of miniature woodworking."
        isCenter={isBlogsPage}
      />

      {isBlogsPage && (
        <div className="space-y-4">
          <div className="relative mx-auto max-w-lg">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-full border py-2 pl-9 pr-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                !selectedTag
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input text-muted-foreground hover:text-foreground hover:border-foreground/30',
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTag(selectedTag === tag ? null : tag)
                }
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  selectedTag === tag
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input text-muted-foreground hover:text-foreground hover:border-foreground/30',
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {displayPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10.5">
          {displayPosts.map((post, index) => {
            const isHovered = getIsCardHovered(index);
            return (
              <Card
                key={post.id}
                className={cn(
                  'group cursor-pointer gap-0 overflow-hidden p-0 transition-all',
                  !isHovered && 'border-transparent bg-transparent shadow-none',
                )}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() =>
                  setHoveredCardIndex(DEFAULT_HOVERED_CARD_INDEX)
                }
              >
                <a href={`/blog/${post.id}`}>
                  <CardHeader className="p-0">
                    <div className="relative h-[320px] overflow-hidden rounded-3xl">
                      <img
                        src={post.coverImage}
                        alt={`${post.title} - Miniature furniture article by Scott Dillingham`}
                        width={400}
                        height={320}
                        loading="lazy"
                        className="size-full object-cover transition-all duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 py-6">
                    <m.div
                      initial={false}
                      animate={{
                        x: isHovered ? 'calc(var(--spacing) * 6)' : 0,
                      }}
                      className="space-y-2.5"
                    >
                      <h3 className="text-2xl">{post.title}</h3>
                      <time
                        className="text-muted-foreground text-sm"
                        dateTime={post.pubDate}
                        suppressHydrationWarning
                      >
                        {new Date(post.pubDate).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </time>
                    </m.div>
                  </CardContent>
                </a>
              </Card>
            );
          })}
        </div>
      ) : (
        isFiltering && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-lg">
              No articles found
              {searchQuery && <> matching "{searchQuery}"</>}
              {selectedTag && <> in "{selectedTag}"</>}.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
              }}
              className="text-primary hover:text-primary/80 mt-2 text-sm font-medium underline transition-colors"
            >
              Clear filters
            </button>
          </div>
        )
      )}
    </section>
  );
}
