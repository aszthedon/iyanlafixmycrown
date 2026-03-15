import type { Metadata } from "next";
import BookingWidget from "@/components/BookingWidget/BookingWidget";
import { pageTitle, pageDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Book Now"),
  description: pageDescription("Choose a service, add-ons, time slot, and confirm with a deposit."),
};

export default function BookPage({ searchParams }: { searchParams?: { service?: string } }) {
  const initialServiceId = searchParams?.service;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal">Book Now</h1>
      <p className="mt-2 max-w-2xl text-brand-gray">
        Select your service, add-ons, and time slot. A deposit is required to confirm the booking.
      </p>
      <div className="mt-8">
        <BookingWidget initialServiceId={initialServiceId} />
      </div>
    </main>
  );
}
