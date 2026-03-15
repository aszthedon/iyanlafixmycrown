import type { Metadata } from "next";
import ServiceCatalog from "@/components/ServiceCatalog";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Services"),
  description: pageDescription("Browse services, pricing variants, and add-ons."),
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">Services</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">
        Filter by category, search, and book any service with add-ons.
      </p>
      <div className="mt-8">
        <ServiceCatalog />
      </div>
    </main>
  );
}
