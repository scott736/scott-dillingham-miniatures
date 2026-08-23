'use client';

import { motion } from 'motion/react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

export default function WorkshopHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

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

  return (
    <section className="hero-padding container flex flex-col items-center justify-center gap-8 text-center">
      <motion.div
        variants={container}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="flex flex-col items-center gap-8"
      >
        <motion.h1
          variants={item}
          className="text-5xl leading-13 font-bold md:text-6xl md:leading-18"
        >
          The Maker's Workshop
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-3xl text-xl leading-8 text-balance"
        >
          Where raw hardwood becomes miniature art
        </motion.p>

        <motion.div variants={item} className="relative mt-4">
          <img
            src="/images/hero/hero-workshop.webp"
            alt="Scott Dillingham's miniature furniture workshop where museum-quality 1/12 scale handcrafted pieces are built"
            width={900}
            height={500}
            fetchPriority="high"
            className="rounded-3xl object-cover drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
