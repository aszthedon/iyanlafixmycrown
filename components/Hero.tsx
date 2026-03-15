import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-artistic">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="inline-flex items-center rounded-full bg-brand-charcoal/5 px-3 py-1 text-xs font-medium text-brand-charcoal">
            Adjust Your Crown & Walk Like Royalty
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-brand-charcoal md:text-5xl">
            Your Crown Was Never Meant to Fall.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-gray md:text-lg">
            Expert styling, healthy hair care, and royal treatment for the crown you never take off.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="btn-shimmer rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95"
            >
              Fix My Crown
            </Link>
            <Link
              href="/services"
              className="rounded-xl border border-brand-charcoal/15 bg-white px-5 py-3 text-sm font-semibold text-brand-charcoal hover:bg-brand-charcoal/5"
            >
              Browse Royal Treatments
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-purple/25 via-brand-softGold/20 to-brand-gold/25 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft">
            <div className="p-6">
              <div className="text-sm font-semibold text-brand-charcoal">Featured</div>
              <div className="mt-2 text-2xl font-semibold text-brand-charcoal">Royal Results</div>
              <p className="mt-2 text-sm text-brand-gray">
                Replace this area with a before/after slider or signature service highlight.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-xl bg-brand-charcoal/5 p-4">
                  <div className="font-semibold text-brand-charcoal">Loc Retwist</div>
                  <div className="text-sm text-brand-gray">Length-based pricing • 2.5 hrs</div>
                </div>
                <div className="rounded-xl bg-brand-charcoal/5 p-4">
                  <div className="font-semibold text-brand-charcoal">Knotless Braids</div>
                  <div className="text-sm text-brand-gray">Size-based pricing • ~6.5 hrs</div>
                </div>
                <div className="rounded-xl bg-brand-charcoal/5 p-4">
                  <div className="font-semibold text-brand-charcoal">Starter Locs</div>
                  <div className="text-sm text-brand-gray">From $115 • 3 hrs</div>
                </div>
              </div>
              <div className="mt-6 text-xs text-brand-gray">
                Add your logo + photos when ready.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
