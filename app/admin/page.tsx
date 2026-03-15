import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/client");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-charcoal">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-brand-gray">
        Welcome, {profile?.full_name ?? user.email}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        
        <Link
          href="/admin/site"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft hover:bg-black/5"
        >
          <h2 className="text-lg font-semibold text-brand-charcoal">
            Edit Website Content
          </h2>
          <p className="mt-2 text-sm text-brand-gray">
            Update homepage text, buttons, and contact info.
          </p>
        </Link>

        <Link
          href="/admin/services"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft hover:bg-black/5"
        >
          <h2 className="text-lg font-semibold text-brand-charcoal">
            Manage Services
          </h2>
          <p className="mt-2 text-sm text-brand-gray">
            Add, edit, and remove services.
          </p>
        </Link>
          <Link
  href="/admin/addons"
  className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft hover:bg-black/5"
>
  <h2 className="text-lg font-semibold text-brand-charcoal">
    Manage Add-ons
  </h2>
  <p className="mt-2 text-sm text-brand-gray">
    Add, edit, and remove service add-ons.
  </p>
</Link>

<Link
  href="/admin/service-addons"
  className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft hover:bg-black/5"
>
  <h2 className="text-lg font-semibold text-brand-charcoal">
    Assign Add-ons
  </h2>
  <p className="mt-2 text-sm text-brand-gray">
    Choose which add-ons belong to each service.
  </p>
</Link>

<Link
  href="/admin/variants"
  className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft hover:bg-black/5"
>
  <h2 className="text-lg font-semibold text-brand-charcoal">
    Manage Variants
  </h2>
  <p className="mt-2 text-sm text-brand-gray">
    Add size, length, and price variations for services.
  </p>
</Link>

<Link
  href="/admin/bookings"
  className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft hover:bg-black/5"
>
  <h2 className="text-lg font-semibold text-brand-charcoal">
    Manage Bookings
  </h2>
  <p className="mt-2 text-sm text-brand-gray">
    View appointments and update booking statuses.
  </p>
</Link>

<Link
  href="/admin/availability"
  className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft hover:bg-black/5"
>
  <h2 className="text-lg font-semibold text-brand-charcoal">
    Manage Availability
  </h2>
  <p className="mt-2 text-sm text-brand-gray">
    Edit hours, open days, and blocked dates.
  </p>
</Link>

      </div>
    </main>
  );
}