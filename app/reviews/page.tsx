import type { Metadata } from "next";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Reviews"),
  description: pageDescription("Client testimonials and social proof.")
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">Reviews</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">Client testimonials and social proof.</p>
      <div className="mt-8">
        <div className="grid gap-5 sm:grid-cols-2">
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
      <div className="text-sm font-semibold text-brand-charcoal">5.0 ★★★★★</div>
      <p className="mt-3 text-sm text-brand-gray">Paste a testimonial here.</p>
      <div className="mt-4 text-xs text-brand-gray">— Client Name</div>
    </div>
  ))}
</div>

      </div>
    </main>
  );
}
