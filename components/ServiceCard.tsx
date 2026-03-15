import Link from "next/link";

export default function ServiceCard({ service }: { service: any }) {
  const price =
    service.startingPrice ??
    (service.variants && service.variants.length ? Math.min(...service.variants.map((v: any) => v.price)) : undefined);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
      <div className="text-xs font-medium text-brand-gray">{service.category}</div>
      <div className="mt-1 text-lg font-semibold text-brand-charcoal">{service.name}</div>
      <div className="mt-2 text-sm text-brand-gray">
        {price !== undefined ? <>From <span className="font-semibold text-brand-charcoal">${price}</span></> : "Pricing varies"}
        {" • "}
        {Math.round(service.baseDurationMin / 30) * 0.5} hrs+
      </div>
      {service.description ? <div className="mt-3 text-sm text-brand-gray">{service.description}</div> : null}

      <div className="mt-5 flex gap-3">
        <Link
          href={`/book?service=${encodeURIComponent(service.id)}`}
          className="btn-shimmer rounded-xl bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Book
        </Link>
        <Link
          href="/services"
          className="rounded-xl border border-brand-charcoal/15 bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal hover:bg-brand-charcoal/5"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
