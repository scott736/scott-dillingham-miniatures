'use client';
import { useEffect, useRef } from 'react';

import { motion, useInView, useAnimation } from 'motion/react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const VALUE_ITEMS = [
  {
    title: 'No Kits, No Shortcuts',
    description:
      'Every piece built entirely from scratch using fine hardwoods — mahogany, cherry, walnut, and maple.',
    image: '/images/landing/value-proposition/no-kits.webp',
    alt: 'Raw hardwood being shaped for miniature furniture',
  },
  {
    title: 'Traditional Joinery',
    description:
      'Precision dovetail joints mortise and tenon joints, and hand-carved details crafted with time-tested techniques I\'ve learned.',
    image: '/images/landing/value-proposition/joinery.webp',
    alt: 'Close-up of hand-cut dovetail joints on a miniature drawer',
  },
  {
    title: 'Museum-Quality Finish',
    description:
      'Each piece is finished with hand-applied shellac or rich oil for exceptional depth, natural warmth, and enduring protection that highlights the wood\'s timeless beauty.',
    image: '/images/landing/value-proposition/finish.webp',
    alt: 'French polish being applied to a miniature furniture piece',
  },
];

const ValueProposition = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isInView || prefersReducedMotion) {
      controls.start('visible');
    }
  }, [isInView, controls, prefersReducedMotion]);

  const variants = {
    text: {
      hidden: {
        opacity: 0,
        y: 10,
        filter: 'blur(8px)',
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
    },

    image: {
      hidden: {
        opacity: 0,
        scale: 1.05,
        y: -5,
        filter:
          'blur(8px) brightness(1.07) drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
        transition: {
          duration: 0.7,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
      visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px) brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))',
        y: 0,
        transition: {
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    },

    container: {
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
    },

    card: {
      hidden: {
        opacity: 0,
        y: 30,
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
    },
  };

  return (
    <section ref={sectionRef} className="bg-card py-15 md:py-20 lg:py-36">
      <div className="container flex flex-col items-center justify-center gap-12">
        <motion.h2
          className="text-center text-2xl font-bold md:text-3xl lg:text-5xl"
          variants={variants.container}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          animate={controls}
        >
          <motion.span className="m-1.5 inline-block md:m-4" variants={variants.text}>
            Why Choose
          </motion.span>
          <motion.span className="m-1.5 inline-block md:m-4" variants={variants.text}>
            Handcrafted
          </motion.span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12"
          variants={variants.container}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          animate={controls}
        >
          {VALUE_ITEMS.map((item, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center gap-6 text-center"
              variants={variants.card}
            >
              <motion.div
                className="relative h-48 w-full overflow-hidden rounded-2xl"
                variants={variants.image}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  width={400}
                  height={192}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold md:text-2xl">{item.title}</h3>
              <p className="text-muted-foreground text-base leading-7 md:text-lg">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;
