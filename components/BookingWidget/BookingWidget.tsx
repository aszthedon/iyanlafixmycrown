"use client";

import CalendarStep from "@/components/BookingWidget/CalendarStep";
import { useEffect, useMemo, useState } from "react";
import type { Config } from "@/lib/config";
import type { Slot } from "@/types/booking";

type Step = "service" | "variant" | "addons" | "time" | "details" | "confirm";

function money(n: number) {
  return Number(n ?? 0).toFixed(2);
}

export default function BookingWidget({
  initialServiceId,
}: {
  initialServiceId?: string;
}) {
  const [config, setConfig] = useState<Config | null>(null);

  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState<string | null>(
    initialServiceId ?? null
  );
  const [variantId, setVariantId] = useState<string | null>(null);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<Slot | null>(null);

  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [ack, setAck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/booking-data");
      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      setConfig({
        meta: {
          brandName: "Iyanla Fix My Crown",
          tagline: "Adjust Your Crown & Walk Like Royalty",
          timezone: "America/Detroit",
        },
        services: data.services ?? [],
        addons: data.addons ?? [],
        categories: data.categories ?? [],
        depositTiers: [
          { minTotal: 200, deposit: 100 },
          { minTotal: 150, deposit: 50 },
          { minTotal: 0, deposit: 25 },
        ],
        schedule: {
          bufferMinutes: 15,
          slotStepMinutes: 15,
          weeklyHours: {
            sun: null,
            mon: null,
            tue: { start: "10:00", end: "18:00" },
            wed: { start: "10:00", end: "18:00" },
            thu: { start: "10:00", end: "18:00" },
            fri: { start: "10:00", end: "19:00" },
            sat: { start: "09:00", end: "17:00" },
          },
          blockedDates: [],
        },
      } as Config);
    })();
  }, []);

  const service = useMemo(
    () => config?.services.find((s: any) => s.id === serviceId) ?? null,
    [config, serviceId]
  );

  const variant = useMemo(() => {
    if (!service?.variants?.length) return null;
    return service.variants.find((v: any) => v.id === variantId) ?? null;
  }, [service, variantId]);

  const addonsCatalog = config?.addons ?? [];

  const allowedAddons = useMemo(() => {
    if (!service) return [];
    const allowedIds = service.allowedAddonIds ?? [];
    if (!allowedIds.length) return [];
    return addonsCatalog.filter((a: any) => allowedIds.includes(a.id));
  }, [service, addonsCatalog]);

  const total = useMemo(() => {
    if (!config) return 0;

    const base =
      (variant?.price ?? null) ??
      (service?.starting_price ?? service?.startingPrice ?? null) ??
      (service?.variants?.length
        ? Math.min(...service.variants.map((v: any) => v.price))
        : 0);

    const addOnTotal = addonIds.reduce(
      (sum, id) =>
        sum + (addonsCatalog.find((a: any) => a.id === id)?.price ?? 0),
      0
    );

    return Number(base ?? 0) + addOnTotal;
  }, [config, service, variant, addonIds, addonsCatalog]);

  const deposit = useMemo(() => {
    if (!config) return 0;
    const tiers = [...config.depositTiers].sort(
      (a, b) => b.minTotal - a.minTotal
    );
    for (const t of tiers) {
      if (total >= t.minTotal) return t.deposit;
    }
    return 0;
  }, [config, total]);

  const remaining = Math.max(0, total - deposit);

  async function loadSlots() {
    if (!service) return;

    const res = await fetch(
      `/api/availability?serviceId=${encodeURIComponent(service.id)}${
        variantId ? `&variantId=${encodeURIComponent(variantId)}` : ""
      }`
    );
    const data = await res.json();
    setSlots(data.slots ?? []);
  }

  useEffect(() => {
    if (!service) return;
    setVariantId(null);
    setAddonIds([]);
    setSlot(null);
    setSlots([]);
    setStep(service.variants?.length ? "variant" : "addons");
  }, [serviceId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function goToTime() {
    await loadSlots();
    setStep("time");
  }

  async function submitBooking() {
    if (!service || !slot || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = {
        serviceId: service.id,
        variantId,
        addonIds,
        slot,
        client,
        totals: { total, deposit, remaining },
        policyAck: ack,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Booking failed.");
        setIsSubmitting(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      setStep("confirm");
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting the booking.");
      setIsSubmitting(false);
    }
  }

  if (!config) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-brand-gray shadow-soft">
        Loading booking…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-brand-gray">Booking</div>
          <div className="text-lg font-semibold text-brand-charcoal">
            Fix My Crown
          </div>
        </div>

        <div className="rounded-xl bg-brand-charcoal/5 px-4 py-2 text-sm">
          <div className="text-brand-gray">Total</div>
          <div className="font-semibold text-brand-charcoal">
            ${money(total)}
          </div>
        </div>

        <div className="rounded-xl bg-brand-purple/10 px-4 py-2 text-sm">
          <div className="text-brand-gray">Deposit due now</div>
          <div className="font-semibold text-brand-charcoal">
            ${money(deposit)}
          </div>
        </div>

        <div className="rounded-xl bg-brand-gold/15 px-4 py-2 text-sm">
          <div className="text-brand-gray">Remaining</div>
          <div className="font-semibold text-brand-charcoal">
            ${money(remaining)}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-black/5 pt-5">
        {step === "service" && (
          <div>
            <div className="text-sm font-semibold text-brand-charcoal">
              Choose a service
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {config.services.map((s: any) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    serviceId === s.id
                      ? "border-brand-purple bg-brand-purple/5"
                      : "border-black/10 hover:bg-black/5"
                  }`}
                >
                  <div className="text-xs text-brand-gray">
                    {s.category ?? "Service"}
                  </div>
                  <div className="mt-1 font-semibold text-brand-charcoal">
                    {s.name}
                  </div>
                  <div className="mt-1 text-sm text-brand-gray">
                    Duration: ~
                    {Math.round(
                      (s.base_duration_min ?? s.baseDurationMin ?? 60) / 30
                    ) * 0.5}{" "}
                    hrs+
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "variant" && service && service.variants?.length ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-brand-charcoal">
                Choose a variant
              </div>
              <button
                type="button"
                onClick={() => setStep("service")}
                className="text-sm font-semibold text-brand-purple"
              >
                Change
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.variants.map((v: any) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    variantId === v.id
                      ? "border-brand-purple bg-brand-purple/5"
                      : "border-black/10 hover:bg-black/5"
                  }`}
                >
                  <div className="font-semibold text-brand-charcoal">
                    {v.name}
                  </div>
                  <div className="mt-1 text-sm text-brand-gray">
                    ${money(v.price)}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setStep("addons")}
                disabled={!variantId}
                className="btn-shimmer rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        ) : null}

        {step === "addons" && service && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-brand-charcoal">
                Add-ons (optional)
              </div>
              <button
                type="button"
                onClick={() =>
                  setStep(service.variants?.length ? "variant" : "service")
                }
                className="text-sm font-semibold text-brand-purple"
              >
                Back
              </button>
            </div>

            {allowedAddons.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-black/10 p-4 text-sm text-brand-gray">
                No add-ons assigned to this service.
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {allowedAddons.map((a: any) => {
                  const checked = addonIds.includes(a.id);

                  return (
                    <label
                      key={a.id}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/10 p-4 hover:bg-black/5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setAddonIds((prev) =>
                            e.target.checked
                              ? [...prev, a.id]
                              : prev.filter((x) => x !== a.id)
                          )
                        }
                        className="mt-1"
                      />
                      <div>
                        <div className="font-semibold text-brand-charcoal">
                          {a.name}
                        </div>
                        <div className="text-sm text-brand-gray">
                          +${money(a.price)}
                        </div>
                        {a.note ? (
                          <div className="text-xs text-brand-gray">{a.note}</div>
                        ) : null}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={goToTime}
                className="btn-shimmer rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white"
              >
                Choose time
              </button>
            </div>
          </div>
        )}

        {step === "time" && service && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-brand-charcoal">
                Choose a date & time
              </div>
              <button
                type="button"
                onClick={() => setStep("addons")}
                className="text-sm font-semibold text-brand-purple"
              >
                Back
              </button>
            </div>

            <div className="mt-4">
              <CalendarStep
                slots={slots}
                selectedSlot={slot}
                onSelectSlot={setSlot}
              />
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setStep("details")}
                disabled={!slot}
                className="btn-shimmer rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "details" && service && slot && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-brand-charcoal">
                Your details
              </div>
              <button
                type="button"
                onClick={() => setStep("time")}
                className="text-sm font-semibold text-brand-purple"
              >
                Back
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={client.name}
                onChange={(e) =>
                  setClient({ ...client, name: e.target.value })
                }
                placeholder="Full name"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-purple/30"
              />

              <input
                value={client.phone}
                onChange={(e) =>
                  setClient({ ...client, phone: e.target.value })
                }
                placeholder="Phone"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-purple/30"
              />

              <input
                value={client.email}
                onChange={(e) =>
                  setClient({ ...client, email: e.target.value })
                }
                placeholder="Email"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-purple/30 sm:col-span-2"
              />

              <textarea
                value={client.notes}
                onChange={(e) =>
                  setClient({ ...client, notes: e.target.value })
                }
                placeholder="Notes (optional)"
                className="min-h-[110px] rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-purple/30 sm:col-span-2"
              />
            </div>

            <label className="mt-4 flex items-start gap-3 rounded-2xl border border-black/10 p-4 text-sm text-brand-gray">
              <input
                type="checkbox"
                checked={ack}
                onChange={(e) => setAck(e.target.checked)}
                className="mt-1"
              />
              <span>
                I understand a deposit is required to confirm my booking and I
                agree to the posted policies.
              </span>
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={submitBooking}
                disabled={
                  !client.name ||
                  !client.phone ||
                  !client.email ||
                  !ack ||
                  isSubmitting
                }
                className="btn-shimmer rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Pay deposit & confirm"}
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="text-center">
            <div className="mx-auto max-w-md">
              <div className="text-2xl font-semibold text-brand-charcoal">
                Booked!
              </div>
              <p className="mt-2 text-sm text-brand-gray">
                Your booking is recorded.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}