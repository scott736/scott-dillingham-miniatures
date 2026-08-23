'use client';
import React, { useEffect, useState } from 'react';

import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

import AnimatedBorderButton from '@/components/elements/animated-border-button';
import { useIsMobile } from '@/hooks/use-mobile';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isScrolling, setIsScrolling] = useState(false);
  const { scrollY } = useScroll();

  const isMobile = useIsMobile();

  // Use different Y values for mobile and desktop
  const imageY = useTransform(scrollY, [0, 1400], [0, isMobile ? 200 : 280]);
  const imageScale = useTransform(scrollY, [0, 1400], [1, 1.125]);
  const textScale = useTransform(scrollY, [0, 1400], [1, 0.9]);

  // Update isScrolling state when user scrolls to prevent flickering between initial and scrolling states
  useEffect(() => {
    const updateScrollState = () => {
      if (window.scrollY > 5 && !isScrolling) {
        setIsScrolling(true);
      }
    };

    window.addEventListener('scroll', updateScrollState);
    return () => window.removeEventListener('scroll', updateScrollState);
  }, [isScrolling]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -30, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const imageAnimation = {
    hidden: { opacity: 0, y: 80, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 20,
      },
    },
  };

  // Skip initial animation if reduced motion is preferred
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsScrolling(true);
    }
  }, [prefersReducedMotion]);

  return (
    <section className="hero-padding container flex flex-col items-center justify-center gap-8 overflow-hidden !pb-0 text-center">
      <motion.div
        variants={container}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="flex flex-col items-center gap-8"
      >
        <motion.h1
          data-speakable="title"
          variants={item}
          className="bg-clip-text text-5xl leading-13 font-bold md:text-6xl"
          style={
            isScrolling
              ? {
                  scale: textScale,
                }
              : {}
          }
        >
          Miniature Furniture,<br /> Extraordinary Craft
        </motion.h1>

        <motion.p
          data-speakable="description"
          variants={item}
          className="max-w-3xl text-xl leading-8"
          style={
            isScrolling
              ? {
                  scale: textScale,
                }
              : {}
          }
        >
          Museum-exhibited 1/12 scale miniature furniture, handcrafted from fine
          hardwoods using traditional woodworking techniques. Available for
          purchase and custom commission. Every joint, every detail, every piece
          — built entirely by hand.
        </motion.p>

        <motion.div variants={item} className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <AnimatedBorderButton
            asChild
            className="[&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
          >
            <a href="/gallery">
              Explore the Gallery <ChevronRight />
            </a>
          </AnimatedBorderButton>

          <a
            href="/workshop"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            See the Workshop <ArrowRight className="size-4" />
          </a>
        </motion.div>

        <motion.div
          variants={imageAnimation}
          className="relative md:mt-7"
          style={
            isScrolling
              ? {
                  y: imageY,
                  scale: imageScale,
                }
              : {}
          }
        >
          <img
            src="/images/hero/bonsai.webp"
            alt="Scott Dillingham's miniature furniture workshop with handcrafted 1/12 scale pieces"
            width={644}
            height={568}
            fetchPriority="high"
            className="rounded-2xl drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
