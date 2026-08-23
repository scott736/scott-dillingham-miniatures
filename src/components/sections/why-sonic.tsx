import { ChevronRight, Check, X } from 'lucide-react';

import SectionHeader from '@/components/elements/section-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const handcraftedPoints = [
  'Solid hardwood construction',
  'Hand-cut traditional joinery',
  'Working drawers and doors',
  'Museum-quality finish',
  'Historically accurate methods',
  'Heirloom that appreciates in value',
];

const massProducedPoints = [
  'Resin, plastic, or laser-cut MDF',
  'Glued butt joints',
  'Fixed or non-functional details',
  'Factory paint or stain',
  'Machine-made shortcuts',
  'Disposable collectible',
];

export default function WhySonic() {
  return (
    <section className="section-padding container space-y-10.5">
      <SectionHeader
        icon={<Check />}
        category="The Difference"
        title="Why Handcrafted?"
        description="There is a world of difference between mass-produced miniatures and furniture built entirely by hand from solid hardwood."
        isCenter
      />

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        <Card className="border-primary/20 bg-primary/5 p-8">
          <CardContent className="space-y-6 p-0">
            <h3 className="text-2xl font-bold">Handcrafted</h3>
            <ul className="space-y-3">
              {handcraftedPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="text-primary mt-0.5 size-5 shrink-0" />
                  <span className="text-lg leading-7">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted bg-muted/30 p-8">
          <CardContent className="space-y-6 p-0">
            <h3 className="text-muted-foreground text-2xl font-bold">
              Mass-Produced
            </h3>
            <ul className="space-y-3">
              {massProducedPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="text-muted-foreground mt-0.5 size-5 shrink-0" />
                  <span className="text-muted-foreground text-lg leading-7">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button size="lg" className="group rounded-full" asChild>
          <a href="/gallery">
            See the Collection
            <ChevronRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </Button>
      </div>
    </section>
  );
}
