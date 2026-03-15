"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Rule = {
  id: string;
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
};

type BlockedDate = {
  id: string;
  blocked_date: string;
  reason: string | null;
};

const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminAvailabilityPage() {
  const supabase = createClient();

  const [rules, setRules] = useState<Rule[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");

  async function loadData() {
    const { data: rulesData, error: rulesError } = await supabase
      .from("availability_rules")
      .select("*")
      .order("day_of_week", { ascending: true });

    const { data: blockedData, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("blocked_date", { ascending: true });

    if (rulesError) {
      alert(rulesError.message);
      return;
    }

    if (blockedError) {
      alert(blockedError.message);
      return;
    }

    setRules((rulesData as Rule[]) ?? []);
    setBlockedDates((blockedData as BlockedDate[]) ?? []);
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateRule(id: string, field: keyof Rule, value: any) {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  }

  async function saveRule(rule: Rule) {
    const { error } = await supabase
      .from("availability_rules")
      .update({
        day_of_week: rule.day_of_week,
        start_time: rule.start_time,
        end_time: rule.end_time,
        is_active: rule.is_active,
      })
      .eq("id", rule.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Availability saved.");
    loadData();
  }

  async function addBlockedDate() {
    if (!newBlockedDate) return;

    const { error } = await supabase.from("blocked_dates").insert({
      blocked_date: newBlockedDate,
      reason: newBlockedReason || null,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setNewBlockedDate("");
    setNewBlockedReason("");
    loadData();
  }

  async function deleteBlockedDate(id: string) {
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-charcoal">
        Manage Availability
      </h1>

      <div className="mt-8 space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft"
          >
            <div className="grid gap-4 md:grid-cols-4 md:items-end">
              <div>
                <label className="block text-sm font-medium text-brand-gray">
                  Day
                </label>
                <div className="mt-2 rounded-xl border border-black/10 px-4 py-3">
                  {dayLabels[rule.day_of_week]}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray">
                  Start Time
                </label>
                <input
                  type="time"
                  value={rule.start_time ?? ""}
                  onChange={(e) => updateRule(rule.id, "start_time", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray">
                  End Time
                </label>
                <input
                  type="time"
                  value={rule.end_time ?? ""}
                  onChange={(e) => updateRule(rule.id, "end_time", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-brand-gray">
                  <input
                    type="checkbox"
                    checked={rule.is_active}
                    onChange={(e) => updateRule(rule.id, "is_active", e.target.checked)}
                  />
                  Active
                </label>

                <button
                  onClick={() => saveRule(rule)}
                  className="rounded-xl bg-brand-charcoal px-4 py-3 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-brand-charcoal">Blocked Dates</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input
            type="date"
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="rounded-xl border border-black/10 px-4 py-3"
          />

          <input
            value={newBlockedReason}
            onChange={(e) => setNewBlockedReason(e.target.value)}
            placeholder="Reason (optional)"
            className="rounded-xl border border-black/10 px-4 py-3"
          />

          <button
            onClick={addBlockedDate}
            className="rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white"
          >
            Add Blocked Date
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {blockedDates.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-black/10 p-4"
            >
              <div>
                <div className="font-medium text-brand-charcoal">{item.blocked_date}</div>
                {item.reason ? (
                  <div className="text-sm text-brand-gray">{item.reason}</div>
                ) : null}
              </div>

              <button
                onClick={() => deleteBlockedDate(item.id)}
                className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          ))}

          {blockedDates.length === 0 ? (
            <div className="text-sm text-brand-gray">No blocked dates yet.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
