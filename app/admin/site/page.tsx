"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSitePage() {
  const supabase = createClient();

  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setForm(data);
    }

    loadSettings();
  }, [supabase]);

  async function saveSettings() {
    setSaving(true);

    const { error } = await supabase.from("site_settings").upsert(form);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Site settings saved successfully.");
  }

  if (!form) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p>Loading site settings...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-charcoal">
        Edit Website Content
      </h1>

      <div className="mt-6 grid gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-soft">
        <input
          value={form.brand_name ?? ""}
          onChange={(e) =>
            setForm({ ...form, brand_name: e.target.value })
          }
          placeholder="Brand name"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <input
          value={form.tagline ?? ""}
          onChange={(e) =>
            setForm({ ...form, tagline: e.target.value })
          }
          placeholder="Tagline"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <input
          value={form.hero_title ?? ""}
          onChange={(e) =>
            setForm({ ...form, hero_title: e.target.value })
          }
          placeholder="Hero title"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <textarea
          value={form.hero_subtitle ?? ""}
          onChange={(e) =>
            setForm({ ...form, hero_subtitle: e.target.value })
          }
          placeholder="Hero subtitle"
          className="min-h-[120px] rounded-xl border border-black/10 px-4 py-3"
        />

        <input
          value={form.primary_cta ?? ""}
          onChange={(e) =>
            setForm({ ...form, primary_cta: e.target.value })
          }
          placeholder="Primary button text"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <input
          value={form.secondary_cta ?? ""}
          onChange={(e) =>
            setForm({ ...form, secondary_cta: e.target.value })
          }
          placeholder="Secondary button text"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <input
          value={form.contact_email ?? ""}
          onChange={(e) =>
            setForm({ ...form, contact_email: e.target.value })
          }
          placeholder="Contact email"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <input
          value={form.contact_phone ?? ""}
          onChange={(e) =>
            setForm({ ...form, contact_phone: e.target.value })
          }
          placeholder="Contact phone"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <input
          value={form.instagram_url ?? ""}
          onChange={(e) =>
            setForm({ ...form, instagram_url: e.target.value })
          }
          placeholder="Instagram URL"
          className="rounded-xl border border-black/10 px-4 py-3"
        />

        <button
          onClick={saveSettings}
          disabled={saving}
          className="rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Website Content"}
        </button>
      </div>
    </main>
  );
}