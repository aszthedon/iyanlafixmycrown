"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Service = {
  id: string;
  name: string;
};

type Addon = {
  id: string;
  name: string;
  price: number;
};

type ServiceAddon = {
  service_id: string;
  addon_id: string;
};

export default function AdminServiceAddonsPage() {
  const supabase = createClient();

  const [services, setServices] = useState<Service[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [serviceAddons, setServiceAddons] = useState<ServiceAddon[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  async function loadData() {
    const { data: servicesData, error: servicesError } = await supabase
      .from("services")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    const { data: addonsData, error: addonsError } = await supabase
      .from("addons")
      .select("id, name, price")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    const { data: serviceAddonsData, error: serviceAddonsError } =
      await supabase.from("service_addons").select("*");

    if (servicesError) {
      alert(servicesError.message);
      return;
    }

    if (addonsError) {
      alert(addonsError.message);
      return;
    }

    if (serviceAddonsError) {
      alert(serviceAddonsError.message);
      return;
    }

    setServices(servicesData ?? []);
    setAddons(addonsData ?? []);
    setServiceAddons(serviceAddonsData ?? []);

    if ((servicesData ?? []).length > 0 && !selectedServiceId) {
      setSelectedServiceId(servicesData![0].id);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function isAssigned(addonId: string) {
    return serviceAddons.some(
      (item) =>
        item.service_id === selectedServiceId && item.addon_id === addonId
    );
  }

  async function toggleAssignment(addonId: string) {
    const alreadyAssigned = isAssigned(addonId);

    if (alreadyAssigned) {
      const { error } = await supabase
        .from("service_addons")
        .delete()
        .eq("service_id", selectedServiceId)
        .eq("addon_id", addonId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("service_addons").insert({
        service_id: selectedServiceId,
        addon_id: addonId,
      });

      if (error) {
        alert(error.message);
        return;
      }
    }

    loadData();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-charcoal">
        Assign Add-ons to Services
      </h1>

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

      <div className="mt-6 grid gap-4">
        {addons.map((addon) => {
          const assigned = isAssigned(addon.id);

          return (
            <label
              key={addon.id}
              className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-soft"
            >
              <div>
                <h2 className="text-lg font-semibold text-brand-charcoal">
                  {addon.name}
                </h2>
                <p className="text-sm text-brand-gray">${addon.price}</p>
              </div>

              <input
                type="checkbox"
                checked={assigned}
                onChange={() => toggleAssignment(addon.id)}
                className="h-5 w-5"
              />
            </label>
          );
        })}
      </div>
    </main>
  );
}