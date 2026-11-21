export function AboutHero() {
  return (
    <section className="hero-padding container flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-16">
      <div className="space-y-8">
        <h1
          data-speakable="title"
          className="text-5xl leading-13 font-bold text-balance md:text-6xl md:leading-18"
        >
          Scott Dillingham
        </h1>
        <p data-speakable="subtitle" className="text-xl leading-8 font-medium">
          Museum-exhibited master of 1/12 scale miniature furniture
        </p>
        <p data-speakable="description" className="max-w-3xl text-xl leading-8">
          Scott Dillingham builds museum-exhibited 1/12 scale miniature furniture
          by hand after decades of full-size woodworking. Three of his works are
          part of the KSB Miniatures Collection in Maysville, Kentucky. In his
          home workshop he reproduces period furniture from fine hardwoods with
          hand tools and the same traditional joinery used by the original
          cabinetmakers. Custom commissions and selected pieces are offered;
          museum-held uniques are not for sale.
        </p>
      </div>
      <img
        src="/images/about/pole-screen.webp"
        alt="1/12 scale miniature shield-back pole screen in mahogany by Scott Dillingham"
        width={383}
        height={683}
        fetchPriority="high"
        className="aspect-[383/683] max-h-[528px] rounded-3xl object-cover object-top"
      />
    </section>
  );
}
