"use client";

import { useEffect, useMemo, useState } from "react";
import ServiceCard from "@/components/ServiceCard";

type Config = any;

export default function ServiceCatalog() {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/config");
      const data = await res.json();
      setCfg(data.config);
    })();
  }, []);

  const categories = cfg?.categories ?? [];
  const services = cfg?.services ?? [];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return services.filter((s: any) => {
      const matchQ = !query || `${s.name} ${s.description ?? ""}`.toLowerCase().includes(query);
      const matchC = cat === "All" || s.category === cat;
      return matchQ && matchC;
    });
  }, [services, q, cat]);

  if (!cfg) return <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft text-sm text-brand-gray">Loading services…</div>;

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${cat === "All" ? "bg-brand-charcoal text-white" : "bg-white border border-black/10 text-brand-charcoal"}`}
            onClick={() => setCat("All")}
          >
            All
          </button>
          {categories.map((c: string) => (
            <button
              key={c}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${cat === c ? "bg-brand-charcoal text-white" : "bg-white border border-black/10 text-brand-charcoal"}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services..."
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-purple/30 md:w-80"
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, 25).map((s: any) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>

      {services.length > 25 ? (
        <div className="mt-4 text-xs text-brand-gray">Showing first 25 services. (Increase the limit in components if needed.)</div>
      ) : null}
    </div>
  );
}
