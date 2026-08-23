import { Hammer } from 'lucide-react';

const AboutMission = () => {
  return (
    <section className="section-padding container flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
      <div className="relative h-[340px] w-full sm:h-[600px] sm:min-w-[440px] lg:w-[569px] lg:shrink-0">
        <img
          src="/images/about/hand-tools.webp"
          alt="Traditional hand tools used for miniature furniture making"
          width={569}
          height={600}
          loading="lazy"
          className="size-full rounded-3xl object-cover object-top"
        />
      </div>
      <div className="space-y-6 md:space-y-8 lg:space-y-10.5">
        <div className="flex items-center gap-3">
          <Hammer />
          <p className="text-xl leading-8 md:leading-10">The Philosophy</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-medium md:text-3xl lg:text-4xl">
            No Kits. No Shortcuts. No Compromise.
          </h3>
          <p className="text-xl leading-8">
            Every piece begins as a rough block of fine hardwood and is
            transformed entirely by hand. There are no CNC machines, no laser
            cutters, no pre-made kits. Just wood, hand tools, and patience.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-medium md:text-3xl lg:text-4xl">
            Built the Way They Were Meant to Be
          </h3>
          <p className="text-xl leading-8">
            Each miniature uses the same traditional construction methods as the
            original full-size antiques — hand-cut dovetails, mortise and tenon
            joints, hand-carved details, and hand-applied finishes. The only
            difference is the scale.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
