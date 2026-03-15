"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Service = {
  id: string;
  name: string;
  description: string | null;
  base_duration_min: number;
  starting_price: number | null;
  is_active: boolean;
  sort_order: number | null;
};

export default function AdminServicesPage() {
  const supabase = createClient();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadServices() {
    setLoading(true);

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setServices((data as Service[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function createService() {
    const { error } = await supabase.from("services").insert({
      name: "New Service",
      description: "",
      base_duration_min: 60,
      starting_price: 100,
      is_active: true,
      sort_order: services.length + 1,
    });

    if (error) {
      alert(error.message);
      return;
    }

    loadServices();
  }

  async function saveService(service: Service) {
    setSavingId(service.id);

    const { error } = await supabase
      .from("services")
      .update({
        name: service.name,
        description: service.description,
        base_duration_min: service.base_duration_min,
        starting_price: service.starting_price,
        is_active: service.is_active,
        sort_order: service.sort_order,
      })
      .eq("id", service.id);

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Service saved.");
    loadServices();
  }

  async function deleteService(id: string) {
    const confirmed = confirm("Delete this service?");
    if (!confirmed) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadServices();
  }

  function updateService(id: string, field: keyof Service, value: any) {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p>Loading services...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-brand-charcoal">
          Manage Services
        </h1>

        <button
          onClick={createService}
          className="rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white"
        >
          Add Service
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft"
          >
            <div className="grid gap-4">
              <input
                value={service.name ?? ""}
                onChange={(e) =>
                  updateService(service.id, "name", e.target.value)
                }
                placeholder="Service name"
                className="rounded-xl border border-black/10 px-4 py-3"
              />

              <textarea
                value={service.description ?? ""}
                onChange={(e) =>
                  updateService(service.id, "description", e.target.value)
                }
                placeholder="Service description"
                className="min-h-[100px] rounded-xl border border-black/10 px-4 py-3"
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="number"
                  value={service.starting_price ?? 0}
                  onChange={(e) =>
                    updateService(
                      service.id,
                      "starting_price",
                      Number(e.target.value)
                    )
                  }
                  placeholder="Starting price"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />

                <input
                  type="number"
                  value={service.base_duration_min ?? 60}
                  onChange={(e) =>
                    updateService(
                      service.id,
                      "base_duration_min",
                      Number(e.target.value)
                    )
                  }
                  placeholder="Duration in minutes"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />

                <input
                  type="number"
                  value={service.sort_order ?? 0}
                  onChange={(e) =>
                    updateService(
                      service.id,
                      "sort_order",
                      Number(e.target.value)
                    )
                  }
                  placeholder="Sort order"
                  className="rounded-xl border border-black/10 px-4 py-3"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-brand-gray">
                <input
                  type="checkbox"
                  checked={service.is_active}
                  onChange={(e) =>
                    updateService(service.id, "is_active", e.target.checked)
                  }
                />
                Active service
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => saveService(service)}
                  disabled={savingId === service.id}
                  className="rounded-xl bg-brand-charcoal px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {savingId === service.id ? "Saving..." : "Save Service"}
                </button>

                <button
                  onClick={() => deleteService(service.id)}
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