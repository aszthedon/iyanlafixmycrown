import type { Metadata } from "next";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("FAQ"),
  description: pageDescription("Answers to the most common questions.")
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">FAQ</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">Answers to the most common questions.</p>
      <div className="mt-8">
        <div className="space-y-3">
  {[
    ["Do I need a deposit?", "Yes. A deposit is required to confirm every booking."],
    ["What if I'm late?", "There is a grace period if you communicate. Fees/cancellation may apply after that."],
    ["Do you provide hair?", "Some styles offer hair-provided add-ons."],
  ].map(([q,a]) => (
    <details key={q} className="rounded-2xl border border-black/10 bg-white p-5 shadow-soft">
      <summary className="cursor-pointer font-semibold text-brand-charcoal">{q}</summary>
      <p className="mt-2 text-sm text-brand-gray">{a}</p>
    </details>
  ))}
</div>

      </div>
    </main>
  );
}
