export function AboutHero() {
  return (
    <section className="hero-padding container flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-16">
      <div className="space-y-8">
        <h1 className="text-5xl leading-13 font-bold text-balance md:text-6xl md:leading-18">
          Meet the Maker
        </h1>
        <p className="text-xl leading-8 font-medium">
          Scott Dillingham — Museum-Exhibited Master Miniature Furniture Craftsman
        </p>
        <p className="max-w-3xl text-xl leading-8">
          After decades of full-size woodworking, Scott discovered his true
          calling in the art of miniature furniture making. His work has been
          exhibited in museums and recognized by collectors worldwide. Working
          in his home workshop, he creates museum-quality 1/12 scale
          reproductions of period furniture using nothing but fine hardwoods,
          hand tools, and the same traditional techniques used by the original
          master cabinetmakers centuries ago. Custom commissions and selected
          pieces are offered; some uniques reside in museum collections.
        </p>
      </div>
      <img
        src="/images/about/pole-screen.webp"
        alt="1/12 scale miniature shield-back pole screen in mahogany by Scott Dillingham"
        width={383}
        height={683}
        fetchPriority="high"
        className="aspect-[6.44/5.28] max-h-[528px] rounded-3xl object-cover object-top"
      />
    </section>
  );
}
