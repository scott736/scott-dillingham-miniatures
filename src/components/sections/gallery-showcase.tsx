'use client';

import { useCallback, useEffect, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { GALLERY_ITEMS } from '@/consts';

type GalleryItem = (typeof GALLERY_ITEMS)[number];

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function ExpandableDescription({
  text,
  maxLen = 225,
  className,
}: {
  text: string;
  maxLen?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const plainText = stripHtml(text);
  const needsTruncation = plainText.length > maxLen;

  return (
    <div className={className}>
      {needsTruncation && !expanded ? (
        <p className="text-muted-foreground leading-7">
          {truncateText(plainText, maxLen)}
        </p>
      ) : (
        <p
          className="text-muted-foreground [&_a]:text-primary leading-7 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-primary mt-1 text-sm font-medium hover:underline"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrentIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  return (
    <div
      className="relative select-none"
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (diff > 50) next();
        if (diff < -50) prev();
        setTouchStart(null);
      }}
    >
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title} - Image ${i + 1} of ${images.length}`}
              className="max-h-[70vh] w-full shrink-0 object-contain"
              draggable={false}
            />
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-colors hover:bg-white dark:bg-black/50 dark:hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-colors hover:bg-white dark:bg-black/50 dark:hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

function GalleryLightbox({
  item,
  open,
  onOpenChange,
}: {
  item: GalleryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!item) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="bg-background data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl p-6 shadow-xl focus:outline-none">
          <Dialog.Close className="hover:bg-muted absolute top-4 right-4 z-10 rounded-full p-1.5 transition-colors">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <Dialog.Title className="mb-4 text-2xl font-bold">
            {item.title}
          </Dialog.Title>

          <ImageCarousel images={item.images} title={item.title} />

          <div className="mt-4 space-y-3">
            <ExpandableDescription text={item.description} maxLen={225} />
            {item.relatedPost && (
              <a
                href={item.relatedPost}
                className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Read Similar Story <ArrowRight className="size-3.5" />
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function GalleryLightboxIsland() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-gallery-open]');
      if (!target) return;
      e.preventDefault();
      setSelectedId(target.getAttribute('data-gallery-open'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const item = GALLERY_ITEMS.find((g) => g.id === selectedId) ?? null;

  return (
    <GalleryLightbox
      item={item}
      open={!!item}
      onOpenChange={(open) => {
        if (!open) setSelectedId(null);
      }}
    />
  );
}
