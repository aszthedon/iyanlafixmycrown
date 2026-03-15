import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const serviceId = body.serviceId;
    const variantId = body.variantId ?? null;
    const slot = body.slot;
    const client = body.client;
    const totals = body.totals;
    const policyAck = body.policyAck;

    if (
      !serviceId ||
      !slot ||
      !slot.date ||
      !slot.start ||
      !slot.end ||
      !client?.name ||
      !client?.email ||
      !client?.phone
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    if (!policyAck) {
      return NextResponse.json(
        { error: "Policy acknowledgement is required." },
        { status: 400 }
      );
    }

    if (
      !totals ||
      typeof totals.total !== "number" ||
      typeof totals.deposit !== "number" ||
      typeof totals.remaining !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid booking totals." },
        { status: 400 }
      );
    }

    const { data: insertedBooking, error } = await supabase
      .from("bookings")
      .insert({
        client_id: user?.id ?? null,
        client_name: client.name,
        client_email: client.email,
        client_phone: client.phone,
        service_id: serviceId,
        variant_id: variantId,
        booking_date: slot.date,
        start_time: slot.start,
        end_time: slot.end,
        total: totals.total,
        deposit: totals.deposit,
        remaining: totals.remaining,
        status: "pending_deposit",
        notes: client.notes ?? null,
      })
      .select()
      .single();

    if (error || !insertedBooking) {
      return NextResponse.json(
        { error: error?.message || "Failed to create booking." },
        { status: 400 }
      );
    }

    if (process.env.STRIPE_ENABLED === "true") {
      const origin = new URL(req.url).origin;

      return NextResponse.json({
        ok: true,
        bookingId: insertedBooking.id,
        checkoutUrl: `${origin}/api/stripe/checkout?bookingId=${insertedBooking.id}`,
      });
    }

    return NextResponse.json({
      ok: true,
      bookingId: insertedBooking.id,
    });
  } catch (error) {
    console.error("Booking route error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the booking." },
      { status: 500 }
    );
  }
}