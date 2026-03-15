import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const bookingId = url.searchParams.get("bookingId");

  console.log("Stripe checkout route hit");
  console.log("bookingId:", bookingId);

  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    console.error("Booking not found:", error?.message);
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.SITE_URL}/book/success?bookingId=${booking.id}`,
      cancel_url: `${process.env.SITE_URL}/book/cancel?bookingId=${booking.id}`,
      client_reference_id: booking.id,
      metadata: {
        bookingId: booking.id,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Deposit for booking ${booking.id}`,
            },
            unit_amount: Math.round(Number(booking.deposit) * 100),
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.redirect(session.url!);
  } catch (err: any) {
    console.error("Stripe checkout creation failed:", err.message);
    return NextResponse.json(
      { error: err.message || "Stripe checkout failed" },
      { status: 500 }
    );
  }
}