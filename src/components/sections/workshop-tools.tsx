'use client';

import { useRef } from 'react';

import { Wrench } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import SectionHeader from '@/components/elements/section-header';
import { Card, CardContent } from '@/components/ui/card';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const tools = [
  {
    title: 'Miniature Hand Planes',
    description:
      'Precision planes scaled down for smoothing tiny surfaces. Essential for achieving flat, clean faces on miniature panels and tabletops.',
    image: '/images/workshop/tools-planes.webp',
  },
  {
    title: 'Micro Chisels & Gouges',
    description:
      'Ultra-fine chisels for cutting joints and carving decorative details like shell motifs and fluting at 1/12 scale.',
    image: '/images/workshop/tools-chisels.webp',
  },
  {
    title: "Jeweler's Saws",
    description:
      'Fine-tooth saws that allow intricate cuts in tiny workpieces. Indispensable for cutting delicate curves and scroll work.',
    image: '/images/workshop/tools-saws.webp',
  },
  {
    title: 'Miniature Clamps',
    description:
      'Specialized clamps designed for holding tiny components during glue-ups. Precise pressure without crushing delicate parts.',
    image: '/images/workshop/tools-clamps.webp',
  },
  {
    title: 'Hand-Turned Lathe',
    description:
      'A small lathe for turning miniature spindles, posts, finials, and other round components with perfect symmetry.',
    image: '/images/workshop/tools-lathe.webp',
  },
  {
    title: 'Magnification Systems',
    description:
      'High-quality magnifying lenses and headsets that make it possible to see and work at the extreme precision this scale demands.',
    image: '/images/workshop/tools-magnification.webp',
  },
];

export default function WorkshopTools() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="section-padding container space-y-10.5">
      <SectionHeader
        icon={<Wrench />}
        category="Equipment"
        title="Tools of the Trade"
        description="Specialized instruments that make museum-quality miniature woodworking possible. Many are custom-made or modified for working at 1/12 scale."
        isCenter
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {tools.map((tool, index) => (
          <ToolCard
            key={tool.title}
            tool={tool}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  );
}

function ToolCard({
  tool,
  index,
  prefersReducedMotion,
}: {
  tool: (typeof tools)[number];
  index: number;
  prefersReducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
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
            src={tool.image}
            alt={`${tool.title} used for handcrafted 1/12 scale miniature furniture making`}
            loading="lazy"
            width={800}
            height={600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="space-y-2 px-2 pt-4">
          <h3 className="text-xl font-bold">{tool.title}</h3>
          <p className="text-muted-foreground leading-7">{tool.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
