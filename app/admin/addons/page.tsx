"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Addon = {
  id: string;
  name: string;
  price: number;
  note: string | null;
  sort_order: number | null;
  is_active: boolean;
};

export default function AdminAddonsPage() {
  const supabase = createClient();

  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadAddons() {
    setLoading(true);

    const { data, error } = await supabase
      .from("addons")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setAddons((data as Addon[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAddons();
  }, []);

  async function createAddon() {
    const { error } = await supabase.from("addons").insert({
      name: "New Add-on",
      price: 20,
      note: "",
      sort_order: addons.length + 1,
      is_active: true,
    });

    if (error) {
      alert(error.message);
      return;
    }

    loadAddons();
  }

  async function saveAddon(addon: Addon) {
    setSavingId(addon.id);

    const { error } = await supabase
      .from("addons")
      .update({
        name: addon.name,
        price: addon.price,
        note: addon.note,
        sort_order: addon.sort_order,
        is_active: addon.is_active,
      })
      .eq("id", addon.id);

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Add-on saved.");
    loadAddons();
  }

  async function deleteAddon(id: string) {
    const confirmed = confirm("Delete this add-on?");
    if (!confirmed) return;

    const { error } = await supabase.from("addons").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadAddons();
  }

  function updateAddon(id: string, field: keyof Addon, value: any) {
    setAddons((prev) =>
      prev.map((addon) =>
        addon.id === id ? { ...addon, [field]: value } : addon
      )
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p>Loading add-ons...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-brand-charcoal">
          Manage Add-ons
        </h1>

        <button
          onClick={createAddon}
          className="rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white"
        >
          Add Add-on
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft"
          >
            <div className="grid gap-4">
              <input
                value={addon.name ?? ""}
                onChange={(e) =>
                  updateAddon(addon.id, "name", e.target.value)
                }
                placeholder="Add-on name"
                className="rounded-xl border border-black/10 px-4 py-3"
              />

              <textarea
                value={addon.note ?? ""}
                onChange={(e) =>
                  updateAddon(addon.id, "note", e.target.value)
                }
                placeholder="Optional note"
                className="min-h-[100px] rounded-xl border border-black/10 px-4 py-3"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  value={addon.price ?? 0}
                  onChange={(e) =>
                    updateAddon(addon.id, "price", Number(e.target.value))
                  }
                  placeholder="Price"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />

                <input
                  type="number"
                  value={addon.sort_order ?? 0}
                  onChange={(e) =>
                    updateAddon(addon.id, "sort_order", Number(e.target.value))
                  }
                  placeholder="Sort order"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-brand-gray">
                <input
                  type="checkbox"
                  checked={addon.is_active}
                  onChange={(e) =>
                    updateAddon(addon.id, "is_active", e.target.checked)
                  }
                />
                Active add-on
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => saveAddon(addon)}
                  disabled={savingId === addon.id}
                  className="rounded-xl bg-brand-charcoal px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {savingId === addon.id ? "Saving..." : "Save Add-on"}
                </button>

                <button
                  onClick={() => deleteAddon(addon.id)}
                  className="rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}