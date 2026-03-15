import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Slot = {
  date: string;
  start: string;
  end: string;
};

function toDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(total: number) {
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const url = new URL(req.url);

  const serviceId = url.searchParams.get("serviceId");
  const variantId = url.searchParams.get("variantId");

  if (!serviceId) {
    return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  let durationMin = service.base_duration_min ?? 60;

  if (variantId) {
    const { data: variant } = await supabase
      .from("service_variants")
      .select("*")
      .eq("id", variantId)
      .single();

    if (variant?.duration_min) {
      durationMin = variant.duration_min;
    }
  }

  const { data: rules, error: rulesError } = await supabase
    .from("availability_rules")
    .select("*")
    .eq("is_active", true);

  const { data: blockedDates, error: blockedError } = await supabase
    .from("blocked_dates")
    .select("*");

  if (rulesError || blockedError) {
    return NextResponse.json(
      { error: rulesError?.message || blockedError?.message || "Failed to load availability" },
      { status: 500 }
    );
  }

  const blockedSet = new Set((blockedDates ?? []).map((d: any) => d.blocked_date));
  const slots: Slot[] = [];
  const bufferMinutes = 15;
  const stepMinutes = 15;
  const daysToGenerate = 90;

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateISO = toDateISO(date);
    if (blockedSet.has(dateISO)) continue;

    const dayOfWeek = date.getDay();
    const rule = (rules ?? []).find((r: any) => r.day_of_week === dayOfWeek);

    if (!rule || !rule.start_time || !rule.end_time) continue;

    const openMin = timeToMinutes(rule.start_time.slice(0, 5));
    const closeMin = timeToMinutes(rule.end_time.slice(0, 5));

    for (
      let startMin = openMin;
      startMin + durationMin + bufferMinutes <= closeMin;
      startMin += stepMinutes
    ) {
      const endMin = startMin + durationMin;

      slots.push({
        date: dateISO,
        start: minutesToTime(startMin),
        end: minutesToTime(endMin),
      });
    }
  }

  return NextResponse.json({ slots });
}
