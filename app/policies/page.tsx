import type { Metadata } from "next";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Policies"),
  description: pageDescription("Deposit and late policy details.")
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">Policies</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">Deposit and late policy details.</p>
      <div className="mt-8">
        <div className="grid gap-6 md:grid-cols-2">
  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
    <h2 className="text-lg font-semibold text-brand-charcoal">Deposit Policy</h2>
    <p className="mt-2 text-sm text-brand-gray">
      A deposit is required to confirm every booking. Deposit tiers are calculated based on the booking total.
    </p>
    <ul className="mt-4 list-disc pl-5 text-sm text-brand-gray">
      <li>Total under $150 → $25 deposit</li>
      <li>Total $150–$199 → $50 deposit</li>
      <li>Total $200+ → $100 deposit</li>
    </ul>
  </div>

  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
    <h2 className="text-lg font-semibold text-brand-charcoal">Late Policy</h2>
    <p className="mt-2 text-sm text-brand-gray">
      30 minute grace period if communicated. 30–45 minutes may add a fee. 45+ minutes may be cancelled.
    </p>
  </div>
</div>

      </div>
    </main>
  );
}
