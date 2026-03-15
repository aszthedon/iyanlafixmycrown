import type { Metadata } from "next";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Contact"),
  description: pageDescription("Send a message, find the location, and connect on social.")
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">Contact</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">Send a message, find the location, and connect on social.</p>
      <div className="mt-8">
        <div className="grid gap-6 md:grid-cols-2">
  <form className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
    <div className="text-lg font-semibold text-brand-charcoal">Contact form</div>
    <p className="mt-2 text-sm text-brand-gray">Front-end placeholder (wire to email/DB later).</p>
    <div className="mt-4 grid gap-3">
      <input className="rounded-xl border border-black/10 px-4 py-3 text-sm" placeholder="Name" />
      <input className="rounded-xl border border-black/10 px-4 py-3 text-sm" placeholder="Email" />
      <textarea className="min-h-[120px] rounded-xl border border-black/10 px-4 py-3 text-sm" placeholder="Message" />
      <button type="button" className="btn-shimmer rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white">Send message</button>
    </div>
  </form>

  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
    <div className="text-lg font-semibold text-brand-charcoal">Map + hours</div>
    <p className="mt-2 text-sm text-brand-gray">
      Add your Google Maps embed here. Hours are in <code className="rounded bg-black/5 px-1">lib/schedule.ts</code>.
    </p>
    <div className="mt-4 aspect-video rounded-2xl bg-brand-charcoal/5" />
  </div>
</div>

      </div>
    </main>
  );
}
