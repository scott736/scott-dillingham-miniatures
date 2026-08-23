'use client';

import { useRef } from 'react';

import {
  Ruler,
  TreePine,
  Scissors,
  Puzzle,
  PenTool,
  Layers,
  Sparkles,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { motion, useInView } from 'motion/react';

import SectionHeader from '@/components/elements/section-header';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const steps = [
  {
    number: '01',
    title: 'Design & Research',
    description:
      'Every piece begins with studying the original period furniture. Historical references, museum archives, and antique photographs inform scaled drawings that capture every proportion and detail.',
    image: '/images/workshop/process-design.webp',
    icon: <Ruler className="size-5" />,
    relatedPost: {
      label: 'Scaling Down Plans',
      href: '/blog/scaling-down-furniture-plans',
    },
  },
  {
    number: '02',
    title: 'Wood Selection',
    description:
      'Choosing the right hardwood is critical. Each species is selected for its grain pattern, workability at miniature scale, and historical accuracy to the period being reproduced.',
    image: '/images/workshop/process-wood.webp',
    icon: <TreePine className="size-5" />,
    relatedPost: {
      label: 'Choosing Wood Guide',
      href: '/blog/how-to-choose-wood-for-miniature-furniture',
    },
  },
  {
    number: '03',
    title: 'Milling & Shaping',
    description:
      'Raw stock is cut to 1/12 scale dimensions with extreme precision. At this scale, tolerances are measured in fractions of a millimeter. There is no room for error.',
    image: '/images/workshop/process-milling.webp',
    icon: <Scissors className="size-5" />,
    relatedPost: {
      label: 'Essential Tools',
      href: '/blog/essential-miniature-woodworking-tools',
    },
  },
  {
    number: '04',
    title: 'Joinery',
    description:
      'Hand-cutting dovetails, mortise and tenon joints at miniature scale. These are the same joints used in full-size period furniture, shrunk down to tiny dimensions.',
    image: '/images/workshop/process-joinery.webp',
    icon: <Puzzle className="size-5" />,
    relatedPost: {
      label: 'Miniature Joints Guide',
      href: '/blog/miniature-woodworking-joints',
    },
  },
  {
    number: '05',
    title: 'Carving & Detail',
    description:
      'Adding shell carvings, fluting, and decorative elements by hand using micro chisels and gouges. This is where each piece truly comes alive with character.',
    image: '/images/workshop/process-carving.webp',
    icon: <PenTool className="size-5" />,
  },
  {
    number: '06',
    title: 'Assembly',
    description:
      'Carefully fitting all components together. Every joint must be tight and true. Miniature clamps hold pieces in place while the glue sets over hours.',
    image: '/images/workshop/process-assembly.webp',
    icon: <Layers className="size-5" />,
    relatedPost: {
      label: 'Beginner Guide',
      href: '/blog/miniature-woodworking-for-beginners',
    },
  },
  {
    number: '07',
    title: 'Finishing',
    description:
      'Applying French polish or lacquer for museum-quality protection. Multiple coats are hand-rubbed to build depth and warmth, giving each piece its final glow.',
    image: '/images/workshop/process-finishing.webp',
    icon: <Sparkles className="size-5" />,
    relatedPost: {
      label: 'Finishing Techniques',
      href: '/blog/finishing-techniques-miniature-furniture',
    },
  },
  {
    number: '08',
    title: 'Photography & Delivery',
    description:
      'Documenting the finished piece with detailed photography, then carefully packing in custom-fitted foam for safe shipping anywhere in the world.',
    image: '/images/workshop/process-delivery.webp',
    icon: <Camera className="size-5" />,
    relatedPost: {
      label: 'Display & Protection Guide',
      href: '/blog/displaying-protecting-miniature-furniture-collection',
    },
  },
];

export default function WorkshopProcess() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="section-padding container space-y-12">
      <SectionHeader
        icon={<Layers />}
        category="The Process"
        title="From Raw Hardwood to Finished Masterpiece"
        description="Each piece follows a meticulous eight-step process that transforms a rough block of wood into a museum-quality miniature."
        isCenter
      />

      <div className="mx-auto max-w-5xl">
        {steps.map((step, index) => (
          <ProcessStep
            key={step.number}
            step={step}
            index={index}
            isLeft={index % 2 === 0}
            isLast={index === steps.length - 1}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  );
}

function ProcessStep({
  step,
  index,
  isLeft,
  isLast,
  prefersReducedMotion,
}: {
  step: (typeof steps)[number];
  index: number;
  isLeft: boolean;
  isLast: boolean;
  prefersReducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-1 gap-6 py-6 md:grid-cols-[1fr_3rem_1fr] md:gap-8"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: prefersReducedMotion ? 0 : 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Text content */}
      <div
        className={`flex min-w-0 flex-col justify-center space-y-3 ${isLeft ? 'md:order-1' : 'md:order-3'}`}
      >
        <div className="flex items-center gap-3">
          <div className="border-input text-muted-foreground flex size-9 items-center justify-center rounded-full border">
            {step.icon}
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            Step {step.number}
          </span>
        </div>
        <h3 className="text-2xl font-bold">{step.title}</h3>
        <p className="text-lg leading-7">{step.description}</p>
        {step.relatedPost && (
          <a
            href={step.relatedPost.href}
            className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            {step.relatedPost.label} <ArrowRight className="size-3.5" />
          </a>
        )}
      </div>

      {/* Center timeline */}
      <div className="hidden flex-col items-center md:order-2 md:flex">
        <div className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
          {step.number}
        </div>
        {!isLast && <div className="bg-border w-px flex-1" />}
      </div>

      {/* Image */}
      <div
        className={`min-w-0 overflow-hidden rounded-2xl ${isLeft ? 'md:order-3' : 'md:order-1'}`}
      >
        <img
          src={step.image}
          alt={`Step ${step.number}: ${step.title} - Miniature furniture making process by Scott Dillingham`}
          width={800}
          height={500}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover"
        />
      </div>
    </motion.div>
  );
}
