import type { Slot } from "@/types/booking";
import type { Config } from "@/lib/config";

function toDateISO(d: Date) { return d.toISOString().slice(0, 10); }

function addMinutes(hhmm: string, minutes: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function weekdayKey(d: Date) {
  const map = ["sun","mon","tue","wed","thu","fri","sat"] as const;
  return map[d.getDay()];
}

export function generateSlotsFromConfig(opts: {
  config: Config;
  serviceId: string;
  variantId?: string | null;
  fromDateISO?: string;
  days?: number;
}): Slot[] {
  const { config } = opts;
  const service = config.services.find((s: any) => s.id === opts.serviceId);
  if (!service) return [];
  const days = opts.days ?? 21;

  const durationMin =
    (opts.variantId && service.variants?.find((v: any) => v.id === opts.variantId)?.durationMin) ??
    service.baseDurationMin;

  const buffer = config.schedule.bufferMinutes;
  const step = config.schedule.slotStepMinutes;

  const slots: Slot[] = [];

  const start = opts.fromDateISO ? new Date(`${opts.fromDateISO}T12:00:00`) : new Date();
  start.setHours(12, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const dateISO = toDateISO(d);
    if (config.schedule.blockedDates.includes(dateISO)) continue;

    const key = weekdayKey(d);
    const window = config.schedule.weeklyHours[key];
    if (!window) continue;

    const openMin = timeToMinutes(window.start);
    const closeMin = timeToMinutes(window.end);

    for (let t = openMin; t + durationMin <= closeMin; t += step) {
      const startHH = `${String(Math.floor(t / 60)).padStart(2,"0")}:${String(t % 60).padStart(2,"0")}`;
      const endHH = addMinutes(startHH, durationMin);
      const endWithBuffer = timeToMinutes(endHH) + buffer;
      if (endWithBuffer > closeMin) continue;
      slots.push({ date: dateISO, start: startHH, end: endHH });
    }
  }
  return slots;
}
