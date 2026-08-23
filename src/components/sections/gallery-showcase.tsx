'use client';

import { useState, useRef, useCallback } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import { Card, CardContent } from '@/components/ui/card';
import { GALLERY_ITEMS } from '@/consts';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

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
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
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
            onClick={prev}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-colors hover:bg-white dark:bg-black/50 dark:hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
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

export default function GalleryShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section ref={sectionRef} className="hero-padding container space-y-12">
      {/* Hero area */}
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <motion.h1
          className="text-5xl leading-13 font-bold md:text-6xl md:leading-18"
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }
          }
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          The Collection
        </motion.h1>
        <motion.p
          className="text-xl leading-8 text-balance"
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }
          }
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Museum-exhibited miniature furniture available for purchase and custom
          commission. Each piece represents hundreds of hours of meticulous
          handcraft. Every joint is cut by hand, every detail historically
          accurate, every surface finished to museum standards.
        </motion.p>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {GALLERY_ITEMS.map((item, index) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
            onOpenLightbox={() => setSelectedItem(item)}
          />
        ))}
      </div>

      <GalleryLightbox
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
      />
    </section>
  );
}

function GalleryCard({
  item,
  index,
  prefersReducedMotion,
  onOpenLightbox,
}: {
  item: GalleryItem;
  index: number;
  prefersReducedMotion: boolean;
  onOpenLightbox: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card className="group overflow-hidden border-none shadow-none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src={item.images[0]}
            alt={`${item.title} - Handcrafted 1/12 scale miniature in ${item.wood} by Scott Dillingham`}
            loading="lazy"
            width={800}
            height={600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>
        <CardContent className="space-y-3 px-2 pt-4">
          <h3 className="text-xl font-bold">
            <button
              onClick={onOpenLightbox}
              className="hover:text-primary text-left transition-colors"
            >
              {item.title}
            </button>
          </h3>
          <ExpandableDescription text={item.description} maxLen={225} />
          {item.relatedPost && (
            <div className="flex items-center">
              <a
                href={item.relatedPost}
                className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Read Similar Story <ArrowRight className="size-3.5" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
