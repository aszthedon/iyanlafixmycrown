export default function BookingCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-brand-charcoal">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-brand-gray">
          Your deposit was not completed, so the appointment is still pending.
        </p>
      </div>
    </main>
  );
}
