import { ChevronRight, Search, BookOpen } from 'lucide-react';

import AnimatedBorderButton from '@/components/elements/animated-border-button';

export default function NotFound() {
  return (
    <section className="container flex min-h-[75vh] flex-col items-center justify-center gap-8 text-center">
      <p className="text-muted-foreground text-lg tracking-wide uppercase">
        404
      </p>
      <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
        Even at 1:12 Scale,
        <br />
        <span className="text-primary">We Couldn't Find That Page</span>
      </h1>
      <p className="text-muted-foreground max-w-lg text-xl leading-relaxed">
        This piece must have wandered off the workbench. Let's get you back to
        the collection.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <AnimatedBorderButton
          asChild
          className="rounded-full [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
        >
          <a href="/gallery">
            <Search className="mr-1 size-4" />
            Explore the Gallery <ChevronRight />
          </a>
        </AnimatedBorderButton>
        <a
          href="/blog"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <BookOpen className="size-4" />
          Browse Articles <ChevronRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
