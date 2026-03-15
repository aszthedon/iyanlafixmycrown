import type { Metadata } from "next";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Gallery"),
  description: pageDescription("A visual showcase of styles and transformations.")
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">Gallery</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">A visual showcase of styles and transformations.</p>
      <div className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {Array.from({ length: 12 }).map((_, i) => (
    <div key={i} className="aspect-[4/5] rounded-2xl border border-black/5 bg-white shadow-soft" />
  ))}
</div>

      </div>
    </main>
  );
}
