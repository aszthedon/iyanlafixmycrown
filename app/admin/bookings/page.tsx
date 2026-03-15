"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Booking = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total: number;
  deposit: number;
  remaining: number;
  notes: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  services?: { name: string } | null;
  service_variants?: { name: string } | null;
};


export default function AdminBookingsPage() {
  const supabase = createClient();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    setLoading(true);

 const { data, error } = await supabase
  .from("bookings")
  .select(`
    *,
    services(name),
    service_variants(name)
  `)
  .order("booking_date", { ascending: true })
  .order("start_time", { ascending: true });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setBookings((data as Booking[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadBookings();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p>Loading bookings...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-charcoal">
        Manage Bookings
      </h1>

      <div className="mt-6 space-y-4">
        {bookings.length ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <h2 className="text-lg font-semibold text-brand-charcoal">
                    {booking.services?.name ?? "Service"}
                  </h2>

                  {booking.service_variants?.name ? (
                    <p className="text-sm text-brand-gray">
                      Variant: {booking.service_variants.name}
                    </p>
                  ) : null}

                  <p className="mt-2 text-sm text-brand-gray">
                    {booking.booking_date} • {booking.start_time} – {booking.end_time}
                  </p>

                  <p className="mt-2 text-sm text-brand-gray">
                    Total: ${booking.total} • Deposit: ${booking.deposit} • Remaining: ${booking.remaining}
                  </p>

                  <p className="mt-2 text-sm text-brand-gray">
                    Status: <span className="font-medium">{booking.status}</span>
                  </p>
                </div>

                <div>
  <h3 className="text-sm font-semibold text-brand-charcoal">
    Client
  </h3>

  <p className="mt-2 text-sm text-brand-gray">
    {booking.client_name ?? "No name provided"}
  </p>

  <p className="text-sm text-brand-gray">
    {booking.client_phone ?? "No phone provided"}
  </p>

  <p className="text-sm text-brand-gray">
    {booking.client_email ?? "No email provided"}
  </p>

  {booking.notes ? (
    <p className="mt-3 text-sm text-brand-gray">
      Notes: {booking.notes}
    </p>
  ) : null}
</div>

              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus(booking.id, "pending_deposit")}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm"
                >
                  Pending
                </button>

                <button
                  onClick={() => updateStatus(booking.id, "deposit_paid")}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm"
                >
                  Deposit Paid
                </button>

                <button
                  onClick={() => updateStatus(booking.id, "completed")}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm"
                >
                  Completed
                </button>

                <button
                  onClick={() => updateStatus(booking.id, "cancelled")}
                  className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600"
                >
                  Cancelled
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-sm text-brand-gray">
            No bookings found.
          </div>
        )}
      </div>
    </main>
  );
}
