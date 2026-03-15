"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Service = {
  id: string;
  name: string;
};

type Variant = {
  id: string;
  service_id: string;
  name: string;
  price: number;
  duration_min: number | null;
  sort_order: number | null;
};

export default function AdminVariantsPage() {
  const supabase = createClient();

  const [services, setServices] = useState<Service[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadData() {
    const { data: servicesData, error: servicesError } = await supabase
      .from("services")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    const { data: variantsData, error: variantsError } = await supabase
      .from("service_variants")
      .select("*")
      .order("sort_order", { ascending: true });

    if (servicesError) {
      alert(servicesError.message);
      return;
    }

    if (variantsError) {
      alert(variantsError.message);
      return;
    }

    setServices(servicesData ?? []);
    setVariants((variantsData as Variant[]) ?? []);

    if ((servicesData ?? []).length > 0 && !selectedServiceId) {
      setSelectedServiceId(servicesData![0].id);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredVariants = variants.filter(
    (variant) => variant.service_id === selectedServiceId
  );

  async function createVariant() {
    if (!selectedServiceId) return;

    const { error } = await supabase.from("service_variants").insert({
      service_id: selectedServiceId,
      name: "New Variant",
      price: 100,
      duration_min: 60,
      sort_order: filteredVariants.length + 1,
    });

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  async function saveVariant(variant: Variant) {
    setSavingId(variant.id);

    const { error } = await supabase
      .from("service_variants")
      .update({
        name: variant.name,
        price: variant.price,
        duration_min: variant.duration_min,
        sort_order: variant.sort_order,
      })
      .eq("id", variant.id);

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Variant saved.");
    loadData();
  }

  async function deleteVariant(id: string) {
    const confirmed = confirm("Delete this variant?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("service_variants")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  function updateVariant(id: string, field: keyof Variant, value: any) {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-brand-charcoal">
          Manage Variants
        </h1>

        <button
          onClick={createVariant}
          disabled={!selectedServiceId}
          className="rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          Add Variant
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-soft">
        <label className="block text-sm font-medium text-brand-gray">
          Select Service
        </label>

        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-5">
        {filteredVariants.map((variant) => (
          <div
            key={variant.id}
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft"
          >
            <div className="grid gap-4">
              <input
                value={variant.name ?? ""}
                onChange={(e) =>
                  updateVariant(variant.id, "name", e.target.value)
                }
                placeholder="Variant name"
                className="rounded-xl border border-black/10 px-4 py-3"
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="number"
                  value={variant.price ?? 0}
                  onChange={(e) =>
                    updateVariant(variant.id, "price", Number(e.target.value))
                  }
                  placeholder="Price"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />

                <input
                  type="number"
                  value={variant.duration_min ?? 60}
                  onChange={(e) =>
                    updateVariant(
                      variant.id,
                      "duration_min",
                      Number(e.target.value)
                    )
                  }
                  placeholder="Duration"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />

                <input
                  type="number"
                  value={variant.sort_order ?? 0}
                  onChange={(e) =>
                    updateVariant(
                      variant.id,
                      "sort_order",
                      Number(e.target.value)
                    )
                  }
                  placeholder="Sort order"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => saveVariant(variant)}
                  disabled={savingId === variant.id}
                  className="rounded-xl bg-brand-charcoal px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {savingId === variant.id ? "Saving..." : "Save Variant"}
                </button>

                <button
                  onClick={() => deleteVariant(variant.id)}
                  className="rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {selectedServiceId && filteredVariants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-sm text-brand-gray">
            No variants yet for this service.
          </div>
        ) : null}
      </div>
    </main>
  );
}
