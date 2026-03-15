import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <div className="rounded-3xl bg-white p-10 shadow-soft">
        <p className="text-sm font-medium text-brand-purple">
          {settings?.tagline ?? "Adjust Your Crown & Walk Like Royalty"}
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-brand-charcoal">
          {settings?.hero_title ?? "Your Crown Was Never Meant to Fall."}
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-brand-gray">
          {settings?.hero_subtitle ??
            "Expert styling, healthy hair care, and royal treatment for the crown you never take off."}
        </p>

        {error ? (
          <p className="mt-6 text-sm text-red-600">
            Could not load site settings from Supabase.
          </p>
        ) : null}
      </div>
    </main>
  );
}