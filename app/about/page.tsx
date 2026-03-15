import type { Metadata } from "next";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("About"),
  description: pageDescription("Luxury, approachable service with royal treatment and a care-first approach.")
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">About</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">Luxury, approachable service with royal treatment and a care-first approach.</p>
      <div className="mt-8">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
  <p className="text-brand-gray">
    Add your story here: what you specialize in, what clients can expect, and what makes the experience feel royal.
  </p>
</div>

      </div>
    </main>
  );
}
