"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Slot = {
  date: string;
  start: string;
  end: string;
};

type Props = {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot) => void;
};

export default function CalendarStep({
  slots,
  selectedSlot,
  onSelectSlot,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const availableDates = useMemo(() => {
    return new Set(slots.map((slot) => slot.date));
  }, [slots]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const isoDate = selectedDate.toISOString().slice(0, 10);
    return slots.filter((slot) => slot.date === isoDate);
  }, [selectedDate, slots]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileDisabled={({ date }) => {
            const isoDate = date.toISOString().slice(0, 10);
            return !availableDates.has(isoDate);
          }}
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft">
        <h3 className="text-lg font-semibold text-brand-charcoal">
          Available Times
        </h3>

        {!selectedDate ? (
          <p className="mt-3 text-sm text-brand-gray">
            Select a date to view times.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {slotsForSelectedDate.map((slot) => {
              const active =
                selectedSlot?.date === slot.date &&
                selectedSlot?.start === slot.start;

              return (
                <button
                  key={`${slot.date}-${slot.start}`}
                  onClick={() => onSelectSlot(slot)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                    active
                      ? "border-brand-purple bg-brand-purple text-white"
                      : "border-black/10 hover:bg-brand-purple/5"
                  }`}
                >
                  {slot.start} – {slot.end}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}