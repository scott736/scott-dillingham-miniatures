import React from 'react';

import { Fingerprint, Crosshair, Clock, BookOpen, Heart } from 'lucide-react';

import SectionHeader from '@/components/elements/section-header';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: <Fingerprint className="size-6" />,
    value: 'Authenticity',
    description:
      'Every piece uses historically accurate construction methods. The same joinery and techniques used by the original master cabinetmakers.',
  },
  {
    icon: <Crosshair className="size-6" />,
    value: 'Precision',
    description:
      'Working at 1/12 scale demands extraordinary attention to detail. A fraction of a millimeter can mean the difference between perfection and failure.',
  },
  {
    icon: <Clock className="size-6" />,
    value: 'Patience',
    description:
      'Complex pieces take 200+ hours. There are no shortcuts to excellence. Every surface is sanded, every joint fitted, every detail considered.',
  },
  {
    icon: <BookOpen className="size-6" />,
    value: 'Heritage',
    description:
      'Preserving traditional woodworking techniques for future generations. Each miniature is a living record of centuries-old craftsmanship.',
  },
];

export default function OurValues() {
  return (
    <section className="section-padding container space-y-10.5">
      <SectionHeader
        icon={<Heart />}
        category="Core Values"
        title="What Drives the Craft"
        description="Every piece is guided by four principles that define what it means to create something truly extraordinary at miniature scale."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {values.map((value, index) => (
          <Card key={index} className="gap-20 border-none p-8 shadow-none">
            <CardHeader className="p-0">
              <div className="border-input text-muted-foreground flex size-12 items-center justify-center rounded-full border">
                {value.icon}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <h3 className="text-3xl font-bold">{value.value}</h3>
              <p className="text-xl leading-8">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
