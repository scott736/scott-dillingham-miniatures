'use client';

import { useEffect, useRef } from 'react';

import { Wrench, ChevronRight } from 'lucide-react';
import { motion, useInView, useAnimation } from 'motion/react';

import AnimatedBorderButton from '@/components/elements/animated-border-button';
import SectionHeader from '@/components/elements/section-header';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const WORKSHOP_IMAGES = [
  {
    src: '/images/landing/workshop/hand-carving.webp',
    alt: 'Hand-carving intricate details on a 1/12 scale miniature furniture piece using micro chisels',
    caption: 'Hand-carving intricate shell details with custom-ground micro chisels.',
  },
  {
    src: '/images/landing/workshop/dovetails.webp',
    alt: 'Hand-cutting dovetail joints on miniature drawers for handcrafted dollhouse furniture',
    caption: 'Cutting precise dovetail joints on drawers smaller than a matchbox.',
  },
  {
    src: '/images/landing/workshop/french-polish.webp',
    alt: 'Applying museum-quality French polish finish to a handcrafted miniature furniture piece',
    caption: 'Building a mirror-like French polish finish, one thin layer at a time.',
  },
];

export default function InReality() {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isInView || prefersReducedMotion) {
      controls.start('visible');
    }
  }, [isInView, controls, prefersReducedMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        ease: 'easeOut',
        duration: 0.8,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: 'blur(6px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section ref={sectionRef} className="section-padding container space-y-10.5">
      <SectionHeader
        category="Behind the Scenes"
        title="From the Workshop"
        description="A glimpse into the making process — where raw hardwood becomes a miniature masterpiece through patience, skill, and traditional techniques."
        icon={<Wrench />}
      />

      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
        variants={containerVariants}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        animate={controls}
      >
        {WORKSHOP_IMAGES.map((image, index) => (
          <motion.div
            key={index}
            className="group flex flex-col gap-4"
            variants={cardVariants}
          >
            <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[400px]">
              <img
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-muted-foreground text-base leading-7">
              {image.caption}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center pt-4">
        <AnimatedBorderButton
          asChild
          className="[&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
        >
          <a href="/workshop">
            Explore the Workshop <ChevronRight />
          </a>
        </AnimatedBorderButton>
      </div>
    </section>
  );
}
