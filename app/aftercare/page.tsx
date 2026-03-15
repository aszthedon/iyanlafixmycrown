import type { Metadata } from "next";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Aftercare"),
  description: pageDescription("Care tips to keep your crown healthy between appointments.")
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">Aftercare</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">Care tips to keep your crown healthy between appointments.</p>
      <div className="mt-8">
        <div className="grid gap-5 sm:grid-cols-2">
  {[
    ["Before your appointment", "Arrive with clean, detangled hair unless otherwise specified."],
    ["After your appointment", "Protect at night with a bonnet or satin scarf; keep scalp hydrated as needed."],
    ["Maintenance", "Book maintenance consistently for best results."],
    ["Products", "List your preferred oils, sprays, and shampoos here."],
  ].map(([t,d]) => (
    <div key={t} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
      <div className="font-semibold text-brand-charcoal">{t}</div>
      <div className="mt-2 text-sm text-brand-gray">{d}</div>
    </div>
  ))}
</div>

      </div>
    </main>
  );
}
